const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// Example: GET /unsubscribe/36
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Update the 'subscribed' status to false
  const { error } = await supabaseAdmin
    .from('email_subscriptions')
    .update({ subscribed: false })
    .eq('id', id);

  if (error) {
    console.error('Error unsubscribing user:', error);
    return res.status(500).send('Something went wrong.');
  }

  res.send('You have been unsubscribed from future promotional emails. Sorry to see you go!');
});

module.exports = router;
