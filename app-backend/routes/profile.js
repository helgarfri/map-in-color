// routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pictures/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Update validation rules to include new fields
const profileValidationRules = [
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('username', 'Username must be at least 3 characters').optional().isLength({ min: 3 }),
    check('location', 'Location must be a string').optional().isString(),
    check('description', 'Description must be a string').optional().isString(),
    check('gender', 'Gender must be a string').optional().isString(),
    check('firstName', 'First name must be a string').optional().isString(),
    check('lastName', 'Last name must be a string').optional().isString(),
    check('dateOfBirth', 'Date of birth must be a valid date')
      .optional()
      .isISO8601(),
  ],
];

// Combine middleware
const profileUpdateMiddleware = [
  auth,
  upload.single('profilePicture'),
  ...profileValidationRules,
];


// Get current user's profile
router.get('/', auth, async (req, res) => {
  console.log(`Fetching profile for user ID: ${req.user.id}`);
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'email', // Include email if needed
        'firstName',
        'lastName',
        'dateOfBirth',
        'location',
        'description',
        'gender',
        'profilePicture',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user profile by username
router.get('/:username', async (req, res) => {
  const username = req.params.username;
  console.log(`Fetching profile for username: ${username}`);

  try {
    const user = await User.findOne({
      where: { username },
      attributes: [
        'id',
        'username',
        'firstName',
        'lastName',
        'dateOfBirth',
        'location',
        'description',
        'gender',
        'profilePicture',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Combined PUT /api/profile route
router.put('/', profileUpdateMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, firstName, lastName, dateOfBirth, location, description, gender } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check for unique username if it's being updated
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    // Update fields
    if (email) user.email = email;
    if (username) user.username = username;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (location !== undefined) user.location = location;
    if (description !== undefined) user.description = description;
    if (gender !== undefined) user.gender = gender;

    // Handle dateOfBirth (set only if not already set)
    if (!user.dateOfBirth && dateOfBirth) {
      user.dateOfBirth = dateOfBirth;
    }

    // Handle profile picture if a file is uploaded
    if (req.file) {
      user.profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
    }

    await user.save();

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      location: user.location,
      description: user.description,
      gender: user.gender,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
