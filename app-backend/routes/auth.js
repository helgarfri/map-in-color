// authRoutes.js (for example)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const { supabaseAdmin } = require('../config/supabase'); // Single admin client

const { resend } = require('../config/resend');


const saltRounds = 10;
// Full public URL from Supabase
const DEFAULT_PROFILE_PIC = 'https://cuijtjpwlzmamegajljz.supabase.co/storage/v1/object/public/profile-pictures/default-pic.jpg';

// SIGNUP
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Invalid email address'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter.')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number (0-9).')
      .matches(/[!?.#]/)
      .withMessage('Password must contain at least one special character (!?.#).'),
    // You can add more checks here for username, etc.
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

       // 5) Send a welcome email via Resend
       try {
        // Build your HTML string. Note the links can be simple <a> tags.
        const welcomeEmailHTML = `
          <p>Hello ${newUser.first_name},</p>
          <p>Welcome to Map in Color! I’m really glad to have you on board. 🎉</p>
          <p>You’ve successfully signed up, and you’re now ready to start <strong>creating and exploring data through maps</strong>. To get started, head over to your <a href="https://mapincolor.com/dashboard">dashboard</a>. You can create your first map today – all you need is a CSV file, and you’re good to go!</p>
          <p>Need help? Check out our <a href="https://mapincolor.com/docs">docs</a> or feel free to reach out anytime at <a href="mailto:hello@mapincolor.com">hello@mapincolor.com</a>.</p>
          <p>Cheers,<br/>Helgi</p>
        `;

        await resend.emails.send({
          from: 'no-reply@mapincolor.com',
          to: newUser.email,
          subject: 'Welcome to Map in Color!',
          html: welcomeEmailHTML,
        });

        console.log(`Welcome email sent to: ${newUser.email}`);
      } catch (emailError) {
        // Log it but don't block user creation if the email fails
        console.error('Failed to send welcome email:', emailError);
      }

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
router.post('/login', [check('password').exists()], async (req, res) => {
  // We'll read "identifier" from the body, not "email"
  const { identifier, password } = req.body;

  if (!identifier) {
    return res.status(400).json({ msg: 'Identifier (email or username) is required.' });
  }

  try {
    let foundUser;
    // Decide if identifier is an email or a username:
    if (identifier.includes('@')) {
      // Possibly an email
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, username, password, first_name, last_name')
        .eq('email', identifier)
        .maybeSingle();
      if (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error fetching user by email' });
      }
      foundUser = data;
    } else {
      // Probably a username
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, username, password, first_name, last_name')
        .eq('username', identifier)
        .maybeSingle();
      if (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error fetching user by username' });
      }
      foundUser = data;
    }

    if (!foundUser) {
      return res.status(400).json({ msg: 'Invalid credentials (no user)' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (bad password)' });
    }

    // Make JWT
    const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

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
});


module.exports = router;
