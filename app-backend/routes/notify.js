const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { Resend } = require('resend');

// Create or import your Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
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
    await resend.emails.send({
      from: 'no-reply@mapincolor.com',
      to: email,
      subject: '🎉 You\'re officially on the list!',
      html: `
        <p>Hey there!</p>
        <p>Thanks for signing up to get notified about <strong>Map in Color v2</strong>—you're officially among the first to know what's coming!</p>
        <p>We’re excited to release on <strong>March 28th</strong>, and we’ll be sure to keep you updated along the way.</p>
        <p>Cheers,<br/>Helgi from Map in Color</p>
      `,
    });

    console.log('Inserted subscription and sent email to:', email);
    return res.json({ message: 'Successfully subscribed!' });

  } catch (err) {
    console.error('Unhandled error in /api/notify route:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;

