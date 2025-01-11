// routes/comments.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional');
const { Comment, User, Map, Activity, CommentReaction, Notification } = require('../models');


// Fetch comments for a map
router.get('/maps/:mapId/comments', authOptional, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        MapId: req.params.mapId,
        ParentCommentId: null, // top-level comments
      },
      include: [
        { model: User, attributes: ['username', 'profilePicture'] },
        {
          model: CommentReaction,
          where: req.user ? { UserId: req.user.id } : undefined,
          required: false,
          attributes: ['reaction'],
        },
        {
          model: Comment,
          as: 'Replies',
          include: [
            { model: User, attributes: ['username', 'profilePicture'] },
            {
              model: CommentReaction,
              where: req.user ? { UserId: req.user.id } : undefined,
              required: false,
              attributes: ['reaction'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });


    // Compute Wilson score and format comments
    const formattedComments = comments.map((comment) => {
      const commentJson = comment.toJSON();

      // Process userReaction
      commentJson.userReaction = commentJson.CommentReactions[0]
        ? commentJson.CommentReactions[0].reaction
        : null;
      delete commentJson.CommentReactions;

      // Compute Wilson score for the comment
      const upvotes = commentJson.likeCount;
      const downvotes = commentJson.dislikeCount;
      const n = upvotes + downvotes;

      if (n === 0) {
        commentJson.wilsonScore = 0;
      } else {
        const z = 1.96; // for 95% confidence
        const phat = upvotes / n;
        const wilsonScore =
          (phat +
            (z * z) / (2 * n) -
            z *
              Math.sqrt(
                (phat * (1 - phat) + (z * z) / (4 * n)) / n
              )) /
          (1 + (z * z) / n);
        commentJson.wilsonScore = wilsonScore;
      }

      // Process Replies
      if (commentJson.Replies && commentJson.Replies.length > 0) {
        commentJson.Replies = commentJson.Replies.map((reply) => {
          reply.userReaction = reply.CommentReactions[0]
            ? reply.CommentReactions[0].reaction
            : null;
          delete reply.CommentReactions;

          // Compute Wilson score for the reply
          const upvotes = reply.likeCount;
          const downvotes = reply.dislikeCount;
          const n = upvotes + downvotes;

          if (n === 0) {
            reply.wilsonScore = 0;
          } else {
            const z = 1.96; // for 95% confidence
            const phat = upvotes / n;
            const wilsonScore =
              (phat +
                (z * z) / (2 * n) -
                z *
                  Math.sqrt(
                    (phat * (1 - phat) + (z * z) / (4 * n)) / n
                  )) /
              (1 + (z * z) / n);
            reply.wilsonScore = wilsonScore;
          }

          return reply;
        });

        // Sort replies by createdAt ascending
        commentJson.Replies.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }

      return commentJson;
    });

    // Return your sorted / formatted comments
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Post a new comment or reply
router.post('/maps/:mapId/comments', auth, async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.mapId);
    if (!map) {
      return res.status(404).json({ msg: 'Map not found' });
    }
    // optionally check if map.isPublic or if user is the owner, up to your logic

    const { content, ParentCommentId } = req.body;

    // If replying to a comment, ensure the parent comment exists
    let parentComment = null;
    if (ParentCommentId) {
      parentComment = await Comment.findByPk(ParentCommentId);
      if (!parentComment || parentComment.MapId !== map.id) {
        return res.status(400).json({ msg: 'Invalid parent comment' });
      }
    }

    // Create the new comment in the DB
    const comment = await Comment.create({
      content,
      UserId: req.user.id,
      MapId: map.id,
      ParentCommentId: ParentCommentId || null,
    });

    // Re-fetch to include user data, if desired
    const createdComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['username', 'profilePicture'] }],
    });

    // 1) If it's a reply
    if (ParentCommentId && parentComment.UserId !== req.user.id) {
      await Notification.create({
        type: 'reply',
        UserId: parentComment.UserId, // parent comment owner
        SenderId: req.user.id,        // current user
        MapId: map.id,
        CommentId: comment.id,        // newly created reply
      });
    }
    // 2) If it's a top-level comment (no ParentCommentId), create a 'comment' notification
    //    whether or not user is the map owner. (Remove the map.UserId !== req.user.id check.)
    else if (!ParentCommentId) {
      await Notification.create({
        type: 'comment',
        UserId: map.UserId,     // map owner (or you can set this to req.user.id if you want yourself)
        SenderId: req.user.id,
        MapId: map.id,
        CommentId: comment.id,
      });
    }

    // Optionally create an activity record
    await Activity.create({
      type: 'commented',
      UserId: req.user.id,
      mapTitle: map.title,
      createdAt: new Date(),
    });

    res.json(createdComment);
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Like a comment
router.post('/comments/:commentId/like', auth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    const existingReaction = await CommentReaction.findOne({
      where: { CommentId: commentId, UserId: userId },
    });

    if (existingReaction) {
      if (existingReaction.reaction === 'like') {
        // Remove the like
        await existingReaction.destroy();
        comment.likeCount -= 1;
        await comment.save();
        return res.json({
          userReaction: null,
          likeCount: comment.likeCount,
          dislikeCount: comment.dislikeCount,
        });
      } else {
        // Change from dislike to like
        existingReaction.reaction = 'like';
        await existingReaction.save();
        comment.likeCount += 1;
        comment.dislikeCount -= 1;
        await comment.save();

        // Optional: Create notification if changing from dislike to like
        // But as per your requirement, we'll only create a notification on new likes
        return res.json({
          userReaction: 'like',
          likeCount: comment.likeCount,
          dislikeCount: comment.dislikeCount,
        });
      }
    } else {
      // Add new like
      await CommentReaction.create({
        reaction: 'like',
        UserId: userId,
        CommentId: commentId,
      });
      comment.likeCount += 1;
      await comment.save();

      // Create a notification if the comment's author is not the same as the user
      if (comment.UserId !== userId) {
        await Notification.create({
          type: 'like',
          UserId: comment.UserId, // Recipient of the notification
          SenderId: userId,       // User who liked the comment
          MapId: comment.MapId,
          CommentId: comment.id,
        });
      }

      return res.json({
        userReaction: 'like',
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
      });
    }
  } catch (err) {
    console.error('Error liking comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Dislike a comment
router.post('/comments/:commentId/dislike', auth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    const existingReaction = await CommentReaction.findOne({
      where: { CommentId: commentId, UserId: userId },
    });

    if (existingReaction) {
      if (existingReaction.reaction === 'dislike') {
        // Remove the dislike
        await existingReaction.destroy();
        comment.dislikeCount -= 1;
        await comment.save();
        return res.json({
          userReaction: null,
          likeCount: comment.likeCount,
          dislikeCount: comment.dislikeCount,
        });
      } else {
        // Change from like to dislike
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
    } else {
      // Add new dislike
      await CommentReaction.create({
        reaction: 'dislike',
        UserId: userId,
        CommentId: commentId,
      });
      comment.dislikeCount += 1;
      await comment.save();
      return res.json({
        userReaction: 'dislike',
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
      });
    }
  } catch (err) {
    console.error('Error disliking comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a comment by ID
router.delete('/comments/:commentId', auth, async (req, res) => {
  try {
    // Find the comment and include the Map so we can check the Map owner
    const comment = await Comment.findByPk(req.params.commentId, {
      include: [Map],
    });
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // The map owner can delete any comment on that map
    const isMapOwner = (comment.Map && comment.Map.UserId === req.user.id);
    // The comment owner can delete their own comment
    const isCommentOwner = (comment.UserId === req.user.id);

    if (!isMapOwner && !isCommentOwner) {
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
