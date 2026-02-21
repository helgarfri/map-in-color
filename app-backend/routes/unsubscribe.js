const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

const UNSUB_MSG = 'You have been unsubscribed from future promotional emails. Sorry to see you go!';

/** Prefer: GET /api/unsubscribe?token=JWT (signed subscription id). Avoids guessing sequential ids. */
router.get('/', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Missing token. Use the unsubscribe link from your email.');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.sub;
    if (id == null || id === '') {
      return res.status(400).send('Invalid token.');
    }
    const { error } = await supabaseAdmin
      .from('email_subscriptions')
      .update({ subscribed: false })
      .eq('id', id);

    if (error) {
      console.error('Error unsubscribing (token):', error);
      return res.status(500).send('Something went wrong.');
    }
    return res.send(UNSUB_MSG);
  } catch (err) {
    return res.status(400).send('Invalid or expired unsubscribe link. Please request a new one.');
  }
});

/** Legacy: GET /api/unsubscribe/:id — less secure (guessable ids). Prefer ?token= for new emails. */
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const { error } = await supabaseAdmin
    .from('email_subscriptions')
    .update({ subscribed: false })
    .eq('id', id);

  if (error) {
    console.error('Error unsubscribing user:', error);
    return res.status(500).send('Something went wrong.');
  }

  res.send(UNSUB_MSG);
});

module.exports = router;
