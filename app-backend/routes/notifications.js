// routes/notifications.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Notification, User, Map, Comment } = require('../models'); // Added Comment
const { Op } = require('sequelize');

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'username', 'firstName', 'profilePicture'],
        },
        {
          // Return enough map fields to build a thumbnail & star count
          model: Map,
          attributes: [
            'id',
            'title',
            'selectedMap',
            'oceanColor',
            'unassignedColor',
            'groups',
            'data',
            'fontColor',
            'isTitleHidden',
            'saveCount',      // so we can show how many stars the map has
          ],
        },
        {
          // Return enough comment fields to build comment text or reply text
          model: Comment,
          attributes: [
            'id',
            'content',        // your "commentText" 
            'ParentCommentId',
            'likeCount',
            'dislikeCount',
          ],
          // Include the parent comment if we want "Original Comment" for a reply
          include: [
            {
              model: Comment,
              as: 'ParentComment',
              attributes: ['id', 'content'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

// Mark a notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { UserId: req.user.id, isRead: false } }
    );

    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error updating notifications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    await notification.destroy();

    res.json({ msg: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
