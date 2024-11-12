// routes/comments.js 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/comment');
const User = require('../models/user');
const Map = require('../models/map');

// Fetch comments for a map
router.get('/maps/:mapId/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { MapId: req.params.mapId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Post a new comment
router.post('/maps/:mapId/comments', auth, async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.mapId);
    if (!map || (!map.isPublic && map.UserId !== req.user.id)) {
      return res.status(404).json({ msg: 'Map not found' });
    }
    const comment = await Comment.create({
      content: req.body.content,
      UserId: req.user.id,
      MapId: req.params.mapId,
    });
    res.json(comment);
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
