const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

router.post('/', async (req, res) => {
  console.log('POST /api/notify hit!', req.body); // Debug
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const { data, error } = await supabaseAdmin
    .from('email_subscriptions')
    .insert([{ email }])
    .single();

  if (error) {
    console.error('Error inserting email subscription:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }

  console.log('Inserted subscription for:', email);
  res.json({ message: 'Successfully subscribed!' });
});

module.exports = router;
