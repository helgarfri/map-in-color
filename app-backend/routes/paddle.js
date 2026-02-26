// routes/paddle.js – Paddle checkout config (client token + price id) + customer portal
// Env: PADDLE_CLIENT_TOKEN, PADDLE_PRICE_ID, PADDLE_API_KEY (for portal). Webhook uses PADDLE_WEBHOOK_SECRET (see paddleWebhook.js).
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');

const PADDLE_API_BASE = process.env.PADDLE_API_URL || 'https://api.paddle.com';

/**
 * GET /api/paddle/config
 * Returns client-side token and Pro price ID for Paddle.js checkout.
 * Requires auth. Used by frontend to open Paddle.Checkout.open().
 */
router.get('/config', auth, (req, res) => {
  const clientToken = process.env.PADDLE_CLIENT_TOKEN;
  const priceId = process.env.PADDLE_PRICE_ID;

  if (!clientToken || !priceId) {
    return res.status(503).json({
      msg: 'Checkout is not configured',
      code: 'PADDLE_NOT_CONFIGURED',
    });
  }

  return res.json({
    clientToken,
    priceId,
  });
});

/**
 * GET /api/paddle/portal
 * Returns an authenticated Paddle customer portal URL so the user can manage subscription, payment method, invoices.
 * Requires auth. User must have paddle_customer_id (set when they became Pro via webhook).
 */
router.get('/portal', auth, async (req, res) => {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ msg: 'Portal is not configured', code: 'PADDLE_PORTAL_NOT_CONFIGURED' });
  }

  const userId = req.user.id;
  const { data: userRow, error: userError } = await supabaseAdmin
    .from('users')
    .select('paddle_customer_id')
    .eq('id', userId)
    .maybeSingle();

  if (userError) {
    console.error('Paddle portal: error fetching user', userError);
    return res.status(500).json({ msg: 'Server error' });
  }
  if (!userRow?.paddle_customer_id) {
    return res.status(404).json({
      msg: 'No subscription linked to this account. If you just subscribed, try again in a moment.',
      code: 'NO_PADDLE_CUSTOMER',
    });
  }

  const customerId = userRow.paddle_customer_id;
  try {
    const response = await fetch(`${PADDLE_API_BASE}/customers/${customerId}/portal-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Paddle portal API error', response.status, errText);
      return res.status(502).json({ msg: 'Could not open billing portal. Try again later.' });
    }

    const json = await response.json();
    const urls = json?.data?.urls;
    const general = urls?.general;
    const url = typeof general === 'string' ? general : general?.overview || general?.url || json?.data?.url;
    if (!url) {
      console.error('Paddle portal: no URL in response', json);
      return res.status(502).json({ msg: 'Could not open billing portal.' });
    }

    return res.json({ url });
  } catch (err) {
    console.error('Paddle portal: request failed', err);
    return res.status(502).json({ msg: 'Could not open billing portal. Try again later.' });
  }
});

module.exports = router;
