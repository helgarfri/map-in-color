// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const User = require('../models/user');

const saltRounds = 10;

// Path to your default pic relative to the public folder
const DEFAULT_PROFILE_PIC = '/uploads/profile_pictures/default-pic.jpg';

// Sign Up Route
router.post(
  '/signup',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('username', 'Username must be at least 3 characters')
      .optional()
      .isLength({ min: 3 }),
    // If you want, you can add optional validation for other fields:
    // check('firstName').optional().isString(),
    // check('lastName').optional().isString(),
    // check('dateOfBirth').optional().isISO8601(),
    // check('location').optional().isString(),
    // check('gender').optional().isString(),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure all fields from the request body
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      dateOfBirth,
      location,
      gender,
    } = req.body;

    try {
      // 1) Check if user with the same email already exists
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // 2) If username is provided, check uniqueness
      if (username) {
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          return res.status(400).json({ msg: 'Username already taken' });
        }
      }

      // 3) Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 4) Create a new user with **all** fields (including firstName, lastName, etc.)
      user = await User.create({
        email,
        password: hashedPassword,
        username: username || null, // If empty, set to null
        firstName,
        lastName,
        dateOfBirth, // e.g., "YYYY-MM-DD" from front-end
        location,
        gender,
        profilePicture: DEFAULT_PROFILE_PIC,

      });

      // 5) Sign a JWT token (expires in 1 hour)
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // 6) Respond with token and user info
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          location: user.location,
          gender: user.gender,
          profilePicture: user.profilePicture, // Should be /assets/default-pic.png

        },
      });
    } catch (err) {
      console.error('Error during signup:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // 1) Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // 2) Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // 3) Sign a JWT token with user id
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // 4) Return token and basic user info
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          // You could optionally include firstName, lastName, etc. here if desired
        },
      });
    } catch (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
