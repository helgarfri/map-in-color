const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { resend } = require('../config/resend');
const { wrapEmailBody, P } = require('../utils/emailLayout');

// Stricter limit for newsletter signup to reduce abuse and email probing
const notifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many signup attempts. Please try again later.' },
});

router.post('/', notifyLimiter, async (req, res) => {
  console.log('POST /api/notify hit!', req.body);

  // Force email to lowercase and trim whitespace
  const email = req.body.email?.toLowerCase().trim();

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Check if email already exists (case-insensitive)
    const { data: existing } = await supabaseAdmin
      .from('email_subscriptions')
      .select('email')
      .ilike('email', email)
      .single();

    if (existing) {
      // Email already subscribed
      return res.status(200).json({ message: 'Already subscribed.' });
    }

    // Insert new subscription (store email as lowercase)
    const { error } = await supabaseAdmin
      .from('email_subscriptions')
      .insert([{ email }]);

    if (error) {
      console.error('Error inserting email subscription:', error);
      return res.status(500).json({ error: 'Server error. Please try again.' });
    }

    // Send welcome email to new subscribers
    const content =
      P.p('Hey there!') +
      P.p('Thanks for signing up to get notified about <strong>Map in Color</strong>—you\'re officially among the first to know what\'s coming.') +
      P.p('We\'ll be sure to keep you updated with new features and news.');
    await resend.emails.send({
      from: 'Map in Color <no-reply@mapincolor.com>',
      to: email,
      subject: "You're on the list – Map in Color",
      html: wrapEmailBody(content),
    });

    console.log('Inserted subscription and sent email to:', email);
    return res.json({ message: 'Successfully subscribed!' });

  } catch (err) {
    console.error('Unhandled error in /api/notify route:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;

