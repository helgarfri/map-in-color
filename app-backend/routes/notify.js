const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { Resend } = require('resend');

// Create or import your Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  console.log('POST /api/notify hit!', req.body); // Debug
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    // (Optional) Check if email already exists to avoid duplicates
    const { data: existing } = await supabaseAdmin
      .from('email_subscriptions')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      // Email already subscribed; just respond or show error
      return res.status(200).json({ message: 'Already subscribed.' });
    }

    // Insert new subscription
    const { data, error } = await supabaseAdmin
      .from('email_subscriptions')
      .insert([{ email }])
      .single();

    if (error) {
      console.error('Error inserting email subscription:', error);
      return res.status(500).json({ error: 'Server error. Please try again.' });
    }

    // Email sending logic for brand-new signups:
    await resend.emails.send({
      from: 'no-reply@mapincolor.com',
      to: email,
      subject: 'Welcome to Map in Color!',
      html: `
        <p>Hey there!</p>
        <p>Thanks for signing up to get notified about <strong>Map in Color v2</strong>!</p>
        <p>We're launching on <strong>March 28th</strong>. We'll be sure to keep you in the loop.</p>
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
