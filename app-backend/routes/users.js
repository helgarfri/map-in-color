// routes/users.js

const express = require('express');
const router = express.Router();
const { User, Activity } = require('../models');

router.get('/:username/activity', async (req, res) => {
  const { username } = req.params;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log(`Fetching activities for user ${username} with offset ${offset} and limit ${limit}`);

    const activities = await Activity.findAll({
      where: { UserId: user.id },
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit: limit,
    });

    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
