// routes/comments.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional');
const {
  Comment,
  User,
  Map,
  Activity,
  CommentReaction,
  Notification,
} = require('../models');

// GET /maps/:mapId/comments
// -------------------------
// routes/comments.js

router.get('/maps/:mapId/comments', authOptional, async (req, res) => {
  try {
    const mapId = req.params.mapId;

    // 1) Fetch top-level comments only (ParentCommentId = null)
    //    We do NOT specify any "order" here, because we will sort by Wilson in memory.
    const comments = await Comment.findAll({
      where: { MapId: mapId, ParentCommentId: null },
      include: [
        {
          model: User,
          attributes: ['username', 'profilePicture'],
        },
        {
          // If the user is logged in, we find that user’s reaction. Otherwise skip.
          model: CommentReaction,
          required: false,
          where: req.user ? { UserId: req.user.id } : undefined,
          attributes: ['reaction'],
        },
        {
          // Fetch replies
          model: Comment,
          as: 'Replies',
          // No "order" or "DESC" here. We’ll sort in memory if needed.
          include: [
            {
              model: User,
              attributes: ['username', 'profilePicture'],
            },
            {
              model: CommentReaction,
              required: false,
              where: req.user ? { UserId: req.user.id } : undefined,
              attributes: ['reaction'],
            },
          ],
        },
      ],
    });

    // 2) Convert everything to plain objects, attach userReaction
    const plainComments = comments.map((comment) => {
      const topC = comment.toJSON();

      // userReaction for top-level
      topC.userReaction =
        topC.CommentReactions && topC.CommentReactions.length > 0
          ? topC.CommentReactions[0].reaction
          : null;
      delete topC.CommentReactions;

      // For each reply in topC.Replies
      if (topC.Replies && topC.Replies.length > 0) {
        topC.Replies = topC.Replies.map((reply) => {
          const r = reply.CommentReactions || [];
          reply.userReaction = r.length > 0 ? r[0].reaction : null;
          delete reply.CommentReactions;
          return reply;
        });
      }

      return topC;
    });

    // 3) Compute a Wilson score for each top-level comment (and optionally for replies).
    plainComments.forEach((c) => {
      c.wilsonScore = computeWilsonScore(c.likeCount, c.dislikeCount);

      if (c.Replies && c.Replies.length > 0) {
        // If you want replies also sorted by Wilson:
        c.Replies.forEach((rep) => {
          rep.wilsonScore = computeWilsonScore(rep.likeCount, rep.dislikeCount);
        });
        // Sort replies in descending Wilson:
        c.Replies.sort((a, b) => b.wilsonScore - a.wilsonScore);
      }
    });

    // 4) Sort the top-level array by Wilson descending
    plainComments.sort((a, b) => b.wilsonScore - a.wilsonScore);

    // 5) Return them
    res.json(plainComments);
  } catch (err) {
    console.error('Error fetching comments with Wilson sorting:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// POST /maps/:mapId/comments
// --------------------------
router.post('/maps/:mapId/comments', auth, async (req, res) => {
  try {
    const mapId = req.params.mapId;
    const { content, ParentCommentId } = req.body;

    const map = await Map.findByPk(mapId);
    if (!map) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    let parentComment = null;
    if (ParentCommentId) {
      parentComment = await Comment.findByPk(ParentCommentId);
      if (!parentComment || parentComment.MapId !== map.id) {
        return res.status(400).json({ msg: 'Invalid parent comment' });
      }
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      UserId: req.user.id,
      MapId: map.id,
      ParentCommentId: ParentCommentId || null,
    });

    // Re-fetch with the user included
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        { model: User, attributes: ['username', 'profilePicture'] },
        {
          model: CommentReaction,
          required: false,
          where: { UserId: req.user.id },
          attributes: ['reaction'],
        },
      ],
    });

    // Attach userReaction
    const c = createdComment.toJSON();
    c.userReaction =
      c.CommentReactions && c.CommentReactions.length > 0
        ? c.CommentReactions[0].reaction
        : null;
    delete c.CommentReactions;

    // Only create notifications if the user is acting on *someone else's* map/comment
    if (ParentCommentId) {
      // It's a reply
      if (parentComment.UserId !== req.user.id) {
        await Notification.create({
          type: 'reply',
          UserId: parentComment.UserId, // parent comment owner
          SenderId: req.user.id,
          MapId: map.id,
          CommentId: comment.id,
        });
      }
    } else {
      // It's a top-level comment => notify map owner if different user
      if (map.UserId !== req.user.id) {
        await Notification.create({
          type: 'comment',
          UserId: map.UserId,
          SenderId: req.user.id,
          MapId: map.id,
          CommentId: comment.id,
        });
      }
    }

    // Optionally record an Activity
    // If you don't want self-activities for user’s own map, add a check:
    if (map.UserId !== req.user.id) {
      await Activity.create({
        type: 'commented',
        UserId: req.user.id,
        mapTitle: map.title,
        createdAt: new Date(),
      });
    }

    res.json(c);
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /comments/:commentId/like
// ------------------------------
router.post('/comments/:commentId/like', auth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    // Fetch the map so we can see if the user is the same as the map owner
    const map = await Map.findByPk(comment.MapId);

    let existingReaction = await CommentReaction.findOne({
      where: { CommentId: commentId, UserId: userId },
    });

    // If user already liked it, remove the like
    if (existingReaction && existingReaction.reaction === 'like') {
      await existingReaction.destroy();
      comment.likeCount -= 1;
      await comment.save();
      return res.json({
        userReaction: null,
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
      });
    }

    // If user had disliked, switch to like
    if (existingReaction && existingReaction.reaction === 'dislike') {
      existingReaction.reaction = 'like';
      await existingReaction.save();
      comment.likeCount += 1;
      comment.dislikeCount -= 1;
      await comment.save();
      return res.json({
        userReaction: 'like',
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
      });
    }

    // No existing reaction => create a new "like"
    await CommentReaction.create({
      reaction: 'like',
      UserId: userId,
      CommentId: commentId,
    });
    comment.likeCount += 1;
    await comment.save();

    // Only create a "like" notification if the comment owner isn't the same user
    if (comment.UserId !== userId) {
      await Notification.create({
        type: 'like',
        UserId: comment.UserId,
        SenderId: userId,
        MapId: comment.MapId,
        CommentId: comment.id,
      });
    }

    // Optionally skip Activity if user is liking their *own* map or comment
    if (map && map.UserId !== userId && comment.UserId !== userId) {
      await Activity.create({
        type: 'likeComment',
        UserId: userId,
        mapTitle: map.title,
        createdAt: new Date(),
      });
    }

    res.json({
      userReaction: 'like',
      likeCount: comment.likeCount,
      dislikeCount: comment.dislikeCount,
    });
  } catch (err) {
    console.error('Error liking comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /comments/:commentId/dislike
// ---------------------------------
router.post('/comments/:commentId/dislike', auth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    // Also fetch map to see if user = map owner
    const map = await Map.findByPk(comment.MapId);

    let existingReaction = await CommentReaction.findOne({
      where: { CommentId: commentId, UserId: userId },
    });

    // If user already disliked it, remove the dislike
    if (existingReaction && existingReaction.reaction === 'dislike') {
      await existingReaction.destroy();
      comment.dislikeCount -= 1;
      await comment.save();
      return res.json({
        userReaction: null,
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
      });
    }

    // If user had liked, switch to dislike
    if (existingReaction && existingReaction.reaction === 'like') {
      existingReaction.reaction = 'dislike';
      await existingReaction.save();
      comment.likeCount -= 1;
      comment.dislikeCount += 1;
      await comment.save();
      return res.json({
        userReaction: 'dislike',
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
      });
    }

    // No existing reaction => create a new "dislike"
    await CommentReaction.create({
      reaction: 'dislike',
      UserId: userId,
      CommentId: commentId,
    });
    comment.dislikeCount += 1;
    await comment.save();

    // Only notify if the comment belongs to a different user
    if (comment.UserId !== userId) {
      await Notification.create({
        type: 'dislike',
        UserId: comment.UserId,
        SenderId: userId,
        MapId: comment.MapId,
        CommentId: comment.id,
      });
    }

    // Optionally skip Activity if user is disliking their own map or comment
    if (map && map.UserId !== userId && comment.UserId !== userId) {
      await Activity.create({
        type: 'dislikeComment',
        UserId: userId,
        mapTitle: map.title,
        createdAt: new Date(),
      });
    }

    res.json({
      userReaction: 'dislike',
      likeCount: comment.likeCount,
      dislikeCount: comment.dislikeCount,
    });
  } catch (err) {
    console.error('Error disliking comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /comments/:commentId
// ---------------------------
router.delete('/comments/:commentId', auth, async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.findByPk(commentId, {
      include: [Map],
    });
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const isCommentOwner = comment.UserId === req.user.id;
    const isMapOwner = comment.Map && comment.Map.UserId === req.user.id;

    if (!isCommentOwner && !isMapOwner) {
      return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    }

    await comment.destroy();
    res.json({ msg: 'Comment deleted successfully.' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;

// helper function to compute Wilson score

// For a 95% confidence Wilson Score:
const Z = 1.96;

function computeWilsonScore(likeCount, dislikeCount) {
  const up = likeCount || 0;
  const down = dislikeCount || 0;
  const n = up + down;
  if (n === 0) {
    return 0; // no votes => score = 0
  }
  const pHat = up / n;
  const z2 = Z * Z;

  // Wilson lower bound formula:
  // score = ( pHat + z^2/(2n) - z * sqrt( (pHat*(1-pHat) + z^2/(4n))/n ) )
  //         / (1 + z^2/n)
  const denominator = 1 + (z2 / n);
  const numerator =
    pHat +
    z2 / (2 * n) -
    Z *
      Math.sqrt(
        (pHat * (1 - pHat) + z2 / (4 * n)) / n
      );
  return numerator / denominator;
}
