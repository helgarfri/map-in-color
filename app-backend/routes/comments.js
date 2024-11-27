// routes/comments.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional');
const Comment = require('../models/comment');
const User = require('../models/user');
const Map = require('../models/map');
const Notification = require('../models/notification');
const CommentReaction = require('../models/commentReaction');

// Fetch comments for a map
router.get('/maps/:mapId/comments', authOptional, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        MapId: req.params.mapId,
        ParentCommentId: null, // Fetch only top-level comments
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
      order: [['createdAt', 'DESC']], // We'll sort after computing Wilson scores
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

    // Sort comments by Wilson score descending
    formattedComments.sort((a, b) => b.wilsonScore - a.wilsonScore);

    res.json(formattedComments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Post a new comment or reply
router.post('/maps/:mapId/comments', auth, async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.mapId);
    if (!map || (!map.isPublic && map.UserId !== req.user.id)) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    const { content, ParentCommentId } = req.body;

    // If replying to a comment, ensure the parent comment exists
    let parentComment = null;
    if (ParentCommentId) {
      parentComment = await Comment.findByPk(ParentCommentId);
      if (!parentComment || parentComment.MapId !== map.id) {
        return res.status(400).json({ msg: 'Invalid parent comment' });
      }
    }

    const comment = await Comment.create({
      content,
      UserId: req.user.id,
      MapId: req.params.mapId,
      ParentCommentId: ParentCommentId || null,
    });

    // Fetch the newly created comment with User data
    const createdComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['username', 'profilePicture'] }],
    });

    // Create a notification for the map owner or parent comment owner
    if (ParentCommentId && parentComment.UserId !== req.user.id) {
      // Notification for the parent comment's author
      await Notification.create({
        type: 'reply',
        UserId: parentComment.UserId,
        SenderId: req.user.id,
        MapId: map.id,
        CommentId: parentComment.id,
      });
    } else if (map.UserId !== req.user.id) {
      // Notification for the map owner
      await Notification.create({
        type: 'comment',
        UserId: map.UserId,
        SenderId: req.user.id,
        MapId: map.id,
      });
    }

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

module.exports = router;
