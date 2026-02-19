// auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase'); 
const { resend } = require('../config/resend');
const crypto = require("crypto");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

function passwordRuleFailures(pw) {
  const fails = [];

  if (!pw || pw.length < 6) fails.push("at least 6 characters");
  if (!/[A-Z]/.test(pw)) fails.push("one uppercase letter (A-Z)");
  if (!/[0-9]/.test(pw)) fails.push("one number (0-9)");
  if (!/[!?.#]/.test(pw)) fails.push("one special character (! ? . #)");

  return fails;
}

const saltRounds = 10;
// Full public URL from Supabase
const DEFAULT_PROFILE_PIC =
  `${process.env.SUPABASE_URL}/storage/v1/object/public/profile-pictures/default-pic.jpg`;



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
            plan:'free'
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

      // Construct the verify link (backend endpoint updates status and redirects to /verified)
      const apiBase = (process.env.API_URL || FRONTEND_URL).replace(/\/$/, '');
      const verifyLink = `${apiBase}/api/auth/verify/${verifyToken}`;

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

      // Return a token so the user is logged in and can use the app; they can verify from the dashboard.
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '14d' });
      return res.json({
        token,
        msg: 'User created successfully. Please check your email to verify your account.',
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          status: newUser.status,
          plan: newUser.plan || 'free',
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
        .select('id, email, username, password, first_name, last_name, status, plan')
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
        .select('id, email, username, password, first_name, last_name, status, plan')
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

    // 3) Check status (allow pending users to log in; they can verify from the dashboard)
    if (foundUser.status === 'banned') {
      return res.status(403).json({ msg: 'Your account is banned.' });
    }

    // 4) Sign JWT if all is good
    const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, {
      expiresIn: '14d',
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
        plan: foundUser.plan || "free",
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
      .maybeSingle();

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

// RESEND VERIFICATION LINK
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    // Look up the user by email
    const { data: foundUser, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, status')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('resend-verification error:', error);
      return res.status(500).json({ msg: 'Error looking up user.' });
    }

    if (!foundUser) {
      // Optionally, return 404 or a generic success to avoid exposing that a user doesn't exist
      return res.status(404).json({ msg: 'No user found with that email.' });
    }

    // Check if user is still pending
    if (foundUser.status !== 'pending') {
      return res.status(400).json({
        msg: 'This account is already verified or is not eligible for resend.',
      });
    }

    // Generate a fresh verification token
    const newVerifyToken = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const newVerifyLink = `https://mapincolor.com/api/auth/verify/${newVerifyToken}`;

    // Send the email
    try {
      await resend.emails.send({
        from: 'no-reply@mapincolor.com',
        to: foundUser.email,
        subject: 'Please verify your account (Resend) - Map in Color',
        html: `
          <p>Hello ${foundUser.first_name || ''},</p>
          <p>We noticed you haven't verified your account yet. Here's a new link:</p>
          <p><a href="${newVerifyLink}">Verify Your Account</a></p>
          <p>If you didn't request this email, you can ignore it.</p>
          <p>Cheers,<br/>Helgi</p>
        `,
      });

      console.log(`Verification email re-sent to: ${foundUser.email}`);
      return res.json({ msg: 'Verification email resent successfully.' });
    } catch (sendError) {
      console.error('Error re-sending verification email:', sendError);
      return res.status(500).json({ msg: 'Unable to resend verification email.' });
    }

  } catch (err) {
    console.error('Resend verification server error:', err);
    return res.status(500).json({ msg: 'Server error.' });
  }
});

router.post("/request-password-reset", async (req, res) => {
  try {
    const cleanEmail = String(req.body?.email || "").trim();

    if (!cleanEmail) {
      return res.status(400).json({ msg: "Email is required." });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
    if (!emailOk) {
      return res.status(400).json({ msg: "Please enter a valid email address." });
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, first_name, status")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (error) {
      console.error("request-password-reset lookup error:", error);
      return res.status(500).json({ msg: "Server error. Please try again." });
    }

    if (!user) {
      return res.status(404).json({ msg: "No account found with that email." });
    }

    if (user.status !== "active") {
      return res.status(403).json({ msg: "This account is not eligible for password reset." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { error: updErr } = await supabaseAdmin
      .from("users")
      .update({
        reset_token_hash: tokenHash,
        reset_token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updErr) {
      console.error("request-password-reset update error:", updErr);
      return res.status(500).json({ msg: "Could not create reset link. Please try again." });
    }

    const resetLink = `${FRONTEND_URL}/reset-password?token=${rawToken}`;

    try {
      await resend.emails.send({
        from: "no-reply@mapincolor.com",
        to: user.email,
        subject: "Reset your password - Map in Color",
        html: `
          <p>Hello ${user.first_name || ""},</p>
          <p>We received a request to reset your password.</p>
          <p><a href="${resetLink}">Reset password</a></p>
          <p>This link expires in 30 minutes.</p>
          <p>If you didn't request this, you can ignore this email.</p>
          <p>Cheers,<br/>Helgi</p>
        `,
      });
    } catch (mailErr) {
      console.error("request-password-reset email send error:", mailErr);
      return res.status(500).json({ msg: "We couldn't send the email. Please try again." });
    }

    return res.json({ msg: "Reset link sent. Check your email." });
  } catch (err) {
    console.error("request-password-reset server error:", err);
    return res.status(500).json({ msg: "Server error. Please try again." });
  }
});


router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

 // match your signup rules (but return a useful message)
const fails = passwordRuleFailures(newPassword);

if (fails.length) {
  return res.status(400).json({
    msg: `Password must contain ${fails.join(", ")}.`,
    code: "PASSWORD_WEAK",
    requirements: {
      minLength: 6,
      uppercase: true,
      number: true,
      special: "!?.#",
    },
  });
}


    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, reset_token_hash, reset_token_expires_at")
      .eq("reset_token_hash", tokenHash)
      .maybeSingle();

    if (error) {
      console.error("reset-password lookup error:", error);
      return res.status(400).json({ msg: "Invalid or expired reset link." });
    }

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset link." });
    }

    const exp = user.reset_token_expires_at ? new Date(user.reset_token_expires_at) : null;
    if (!exp || exp.getTime() < Date.now()) {
      return res.status(400).json({ msg: "Reset link expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password + clear token fields
    const { error: updErr } = await supabaseAdmin
      .from("users")
      .update({
        password: hashedPassword,
        reset_token_hash: null,
        reset_token_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updErr) {
      console.error("reset-password update error:", updErr);
      return res.status(500).json({ msg: "Error updating password." });
    }

    return res.json({ msg: "Password reset successfully." });
  } catch (err) {
    console.error("reset-password server error:", err);
    return res.status(500).json({ msg: "Server error." });
  }
});





module.exports = router;
