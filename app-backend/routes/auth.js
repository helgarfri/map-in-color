// auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase'); 
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
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure from body, including the new field "subscribe_promos"
    const {
      email,
      password,
      username,
      first_name,
      last_name,
      date_of_birth,
      location,
      gender,
      subscribe_promos  // <-- this should come from your frontend checkbox
    } = req.body;

    try {
      // 1) Check if user with the same email already exists
      const { data: existingUser, error: userCheckError } = await supabaseAdmin
        .from('users')
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

      // 4) Insert the new user => status = 'pending'
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
            status: 'pending', // <--- user is initially pending
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return res.status(500).json({ msg: 'Error creating user' });
      }

      const newUser = insertedUsers;

      // 5) If user chose to subscribe to promos => add to email_subscriptions
      if (subscribe_promos) {
        try {
          const { data: existingSub, error: subCheckErr } = await supabaseAdmin
            .from('email_subscriptions')
            .select('id, email')
            .ilike('email', email)  // case-insensitive check
            .maybeSingle();

          if (subCheckErr) {
            console.error('Error checking email_subscriptions:', subCheckErr);
          } else if (!existingSub) {
            // Insert the email
            const { error: insertSubErr } = await supabaseAdmin
              .from('email_subscriptions')
              .insert([{ email }]);

            if (insertSubErr) {
              console.error('Error inserting into email_subscriptions:', insertSubErr);
            } else {
              console.log(`Subscribed ${email} to promotional emails.`);
            }
          } else {
            console.log(`${email} is already subscribed to promos.`);
          }
        } catch (subErr) {
          console.error('Unhandled error creating subscription:', subErr);
        }
      }

      // 6) Create a verification token that expires in 1 day
      const verifyToken = jwt.sign(
        { id: newUser.id, email: newUser.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      // Construct the verify link
      const verifyLink = `https://mapincolor.com/api/auth/verify/${verifyToken}`;

      // 7) Send a verification email with the link
      try {
        const welcomeEmailHTML = `
          <p>Hello ${newUser.first_name},</p>
          <p>Welcome to Map in Color! Please verify your account by clicking the link below:</p>
          <p><a href="${verifyLink}">Verify Your Account</a></p>
          <p>Once verified, you can log in and start creating and exploring data through maps!</p>
          <p>Cheers,<br/>Helgi</p>
        `;

        await resend.emails.send({
          from: 'no-reply@mapincolor.com',
          to: newUser.email,
          subject: 'Please verify your account - Map in Color',
          html: welcomeEmailHTML,
        });

        console.log(`Verification email sent to: ${newUser.email}`);
      } catch (emailError) {
        // Log it, but don't block user creation
        console.error('Failed to send verification email:', emailError);
      }

      // You could optionally return a token for partial login,
      // but if you're blocking usage until verified, skip it:
      return res.json({
        msg: 'User created successfully. Please check your email to verify your account.',
      });

    } catch (err) {
      console.error('Error during signup:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// LOGIN
router.post('/login', [check('password').exists()], async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    return res.status(400).json({ msg: 'Identifier (email or username) is required.' });
  }

  try {
    let foundUser;

    // 1) Lookup by email or username
    if (identifier.includes('@')) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, username, password, first_name, last_name, status')
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
        .select('id, email, username, password, first_name, last_name, status')
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

    // 2) Compare passwords
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (bad password)' });
    }

    // 3) Check status
    if (foundUser.status === 'pending') {
      return res.status(403).json({ msg: 'Please verify your account before logging in.' });
    }

    if (foundUser.status === 'banned') {
      return res.status(403).json({ msg: 'Your account is banned.' });
    }

    // 4) Sign JWT if all is good
    const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // 5) Return user & token
    return res.json({
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        status: foundUser.status,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

//VERIFY TOKEN
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // 1) Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2) Update user’s status => 'active'
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ status: 'active' })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Error verifying user' });
    }

    if (!data) {
      // means no user found
      return res.status(404).json({ msg: 'No user found to verify' });
    }

    // 3) Return success as HTML or redirect
    // Option A: Send a simple HTML response:
    return res.redirect('https://mapincolor.com/verified');


    
  } catch (err) {
    console.error('Verification error:', err);
    // Token is invalid or expired
    return res.redirect('https://mapincolor.com/verification-error');
  }
});



module.exports = router;
