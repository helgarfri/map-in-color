// authRoutes.js (for example)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const { supabaseAdmin } = require('../config/supabase'); // Single admin client

const saltRounds = 10;
const DEFAULT_PROFILE_PIC = '/uploads/profile_pictures/default-pic.jpg';

// SIGNUP
router.post(
  '/signup',
  [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    // ...
  ],
  async (req, res) => {
    // Expecting snake_case from the frontend
    // If your frontend is still sending camelCase, do:
    //   const { email, password, username, first_name, last_name, date_of_birth, location, gender } = req.body;
    //   and then map them to .first_name, .last_name, etc. when inserting
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      username,
      first_name,
      last_name,
      date_of_birth,
      location,
      gender,
    } = req.body;

    try {
      // 1) Check if user with the same email already exists
      const { data: existingUser, error: userCheckError } = await supabaseAdmin
        .from('users') // table name is already lowercase
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (userCheckError) {
        console.error(userCheckError);
        return res.status(500).json({ msg: 'Error checking user email' });
      }
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // 2) If username is provided, check uniqueness
      if (username) {
        const { data: sameNameUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('username', username)
          .maybeSingle();

        if (sameNameUser) {
          return res.status(400).json({ msg: 'Username already taken' });
        }
      }

      // 3) Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 4) Insert the new user with snake_case columns
      const { data: insertedUsers, error: insertError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            email,
            password: hashedPassword,
            username: username || null,
            first_name,
            last_name,
            date_of_birth,
            location,
            gender,
            profile_picture: DEFAULT_PROFILE_PIC,
            created_at: new Date().toISOString(), // change here
            updated_at: new Date().toISOString(), // and here
          },
        ])
        .select()       // <--- force row to be returned
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return res.status(500).json({ msg: 'Error creating user' });
      }

      // Inserted user is in insertedUsers
      const newUser = insertedUsers;

      // Sign JWT
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Send back snake_case fields (or map them back to camelCase if you prefer)
      return res.json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          date_of_birth: newUser.date_of_birth,
          location: newUser.location,
          gender: newUser.gender,
          profile_picture: newUser.profile_picture,
        },
      });
    } catch (err) {
      console.error('Error during signup:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// LOGIN
router.post(
  '/login',
  [check('email').isEmail(), check('password').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // 1) Find user by email, selecting snake_case columns
      const { data: foundUser, error: findErr } = await supabaseAdmin
        .from('users')
        .select('id, email, username, password, first_name, last_name')
        .eq('email', email)
        .maybeSingle();

      if (findErr) {
        console.error(findErr);
        return res.status(500).json({ msg: 'Error fetching user' });
      }
      if (!foundUser) {
        return res.status(400).json({ msg: 'Invalid credentials (no user)' });
      }

      // 2) Compare password
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials (bad password)' });
      }

      // 3) Sign token
      const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // 4) Return token + user fields (snake_case)
      return res.json({
        token,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          first_name: foundUser.first_name,
          last_name: foundUser.last_name,
        },
      });
    } catch (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
