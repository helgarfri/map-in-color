// routes/notifications.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Notification, User, Map, Comment } = require('../models'); // Added Comment
const { Op } = require('sequelize');

// Get notifications for the authenticated user
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
          model: Map,
          attributes: ['id', 'title'],
        },
        {
          model: Comment,
          attributes: ['id', 'content'],
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

module.exports = router;
