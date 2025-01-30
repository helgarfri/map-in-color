// routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { Map, Comment, MapSaves } = require('../models'); // Import necessary models

/***********************************************
 *   GET USER ACTIVITY (CREATED / COMMENTED / STARRED)
 ***********************************************/
// routes/profile.js

router.get('/:username/activity', async (req, res) => {
  const username = req.params.username;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  console.log(`Fetching activity for username: ${username}, offset: ${offset}, limit: ${limit}`);

  try {
    // 1) Find the user by username
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'firstName', 'username'],  // adjust as you like
    });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const userId = user.id;

    // 2) Query the top-level "createdMap" items
    const createdMaps = await Map.findAll({
      where: { UserId: userId },
      attributes: [
        'id','title','selectedMap','oceanColor','unassignedColor',
        'groups','data','fontColor','isTitleHidden','saveCount','createdAt',
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });

    // 3) Query the user’s Comments (both top-level and replies),
    //    but EAGER-LOAD the ParentComment + its user
    const comments = await Comment.findAll({
      where: { UserId: userId },  // all comments from this user
      attributes: ['id', 'content', 'createdAt', 'ParentCommentId'],
      include: [
        {
          model: Map,
          attributes: [
            'id','title','selectedMap','oceanColor','unassignedColor',
            'groups','data','fontColor','isTitleHidden','saveCount','createdAt',
          ],
        },
        {
          // Eager-load the parent comment
          model: Comment,
          as: 'ParentComment',
          // Also load the parent’s User
          include: [
            {
              model: User,
              attributes: ['username','profilePicture'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });

    // 4) Query the user’s Map saves => starred
    const mapSaves = await MapSaves.findAll({
      where: { UserId: userId },
      attributes: ['createdAt'],
      include: [
        {
          model: Map,
          attributes: [
            'id','title','selectedMap','oceanColor','unassignedColor',
            'groups','data','fontColor','isTitleHidden','saveCount','createdAt',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });

    // Combine everything
    const activities = [];

    // createdMap
    createdMaps.forEach((map) => {
      activities.push({
        type: 'createdMap',
        user: {  // the actor is 'this' user
          username: user.username,
          firstName: user.firstName || null,
          // if you want more fields, add them
        },
        map: map,         // the entire Map object
        createdAt: map.createdAt,
      });
    });

    // commented or reply
    comments.forEach((cmt) => {
      const isReply = !!cmt.ParentCommentId;  // if ParentCommentId is not null => a reply
      activities.push({
        type: isReply ? 'reply' : 'commented',
        user: {
          username: user.username,
          firstName: user.firstName || null,
          // could also store user.profilePicture if you want
          profilePicture: user.profilePicture || null,
        },
        map: cmt.Map,     // the entire Map object
        commentId: cmt.id,
        commentContent: cmt.content,
        createdAt: cmt.createdAt,
        commentObj: {
          // So you can retrieve the parent's text + parent's user
          ParentComment: cmt.ParentComment
            ? {
                id: cmt.ParentComment.id,
                content: cmt.ParentComment.content,
                User: cmt.ParentComment.User
                  ? {
                      username: cmt.ParentComment.User.username,
                      profilePicture: cmt.ParentComment.User.profilePicture,
                    }
                  : null,
              }
            : null,
        },
      });
    });

    // starredMap
    mapSaves.forEach((save) => {
      activities.push({
        type: 'starredMap',
        user: {
          username: user.username,
          firstName: user.firstName || null,
        },
        map: save.Map,
        createdAt: save.createdAt,
      });
    });

    // Sort by createdAt desc
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Slice for pagination
    const paginated = activities.slice(offset, offset + limit);

    return res.json(paginated);
  } catch (err) {
    console.error('Error fetching user activity:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/***********************************************
 *   CONFIGURE MULTER STORAGE FOR PROFILE PICS
 ***********************************************/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pictures/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

/***********************************************
 *   VALIDATION RULES FOR PROFILE UPDATES
 ***********************************************/
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
const profileUpdateMiddleware = [auth, upload.single('profilePicture'), ...profileValidationRules];

/***********************************************
 *   GET CURRENT USER'S PROFILE (LOGGED-IN)
 ***********************************************/
router.get('/', auth, async (req, res) => {
  console.log(`Fetching profile for user ID: ${req.user.id}`);
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'email',
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
    return res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/***********************************************
 *   GET USER PROFILE BY USERNAME (PUBLIC)
 ***********************************************/
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
    return res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/***********************************************
 *   UPDATE PROFILE (PUT /api/profile)
 ***********************************************/
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

    return res.json({
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
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
