// routes/paddle.js – Paddle checkout config (client token + price id)
// Env: PADDLE_CLIENT_TOKEN, PADDLE_PRICE_ID. Webhook uses PADDLE_WEBHOOK_SECRET (see paddleWebhook.js).
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

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

module.exports = router;
