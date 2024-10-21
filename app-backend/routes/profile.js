// routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to authenticate user
const User = require('../models/user'); // Your User model
const { check, validationResult } = require('express-validator');

// GET /api/profile - Fetch the current user's profile
router.get('/', auth, async (req, res) => {
  console.log(`Fetching profile for user ID: ${req.user.id}`);
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'username', 'createdAt', 'updatedAt'], // Specify fields to return
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/profile - Update the current user's profile
router.put(
  '/',
  [
    auth,
    [
      // Validation rules
      check('email', 'Please include a valid email').optional().isEmail(),
      check('username', 'Username must be at least 3 characters').optional().isLength({ min: 3 }),
    ],
  ],
  async (req, res) => {
    console.log(`Updating profile for user ID: ${req.user.id}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username } = req.body;

    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // If username is being updated, check for uniqueness
      if (username && username !== user.username) {
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          return res.status(400).json({ msg: 'Username already taken' });
        }
      }

      // Update fields if provided
      if (email) user.email = email;
      if (username) user.username = username;

      await user.save();

      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
