const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

const SITE_URL = 'https://mapincolor.com';

function unsubPage({ title, message, isError = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} – Map in Color</title>
  <link rel="icon" type="image/png" href="${SITE_URL}/assets/3-0/MIC-logo-transparent.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; line-height: 1.6; color: rgba(15, 23, 42, 0.9); background: #e8f4f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; -webkit-font-smoothing: antialiased; }
    .card { max-width: 440px; width: 100%; margin: 24px; padding: 40px 32px; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08); text-align: center; }
    .logo { display: block; width: 40px; height: 40px; margin: 0 auto 24px; }
    h1 { margin: 0 0 16px; font-size: 1.5rem; font-weight: 700; color: rgba(15, 23, 42, 0.95); letter-spacing: -0.02em; }
    p { margin: 0 0 24px; color: rgba(15, 23, 42, 0.78); }
    a.btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #28a8e1 0%, #14a9af 100%); background-color: #14a9af; color: #fff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 999px; box-shadow: 0 14px 26px rgba(40, 168, 225, 0.25); transition: transform 0.2s ease, box-shadow 0.2s ease; }
    a.btn:hover { transform: translateY(-1px); box-shadow: 0 18px 34px rgba(40, 168, 225, 0.3); }
    a.link { color: #14a9af; font-weight: 600; text-decoration: none; }
    a.link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <a href="${SITE_URL}"><img src="${SITE_URL}/assets/3-0/MIC-logo-transparent.png" alt="Map in Color" class="logo" width="40" height="40" /></a>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${SITE_URL}" class="btn">Back to Map in Color</a>
  </div>
</body>
</html>`;
}

/** Prefer: GET /api/unsubscribe?token=JWT (signed subscription id). Avoids guessing sequential ids. */
router.get('/', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(400).set('Content-Type', 'text/html');
    return res.send(unsubPage({ title: 'Missing link', message: 'Use the unsubscribe link from your email to unsubscribe.', isError: true }));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.sub;
    if (id == null || id === '') {
      res.status(400).set('Content-Type', 'text/html');
      return res.send(unsubPage({ title: 'Invalid link', message: 'The unsubscribe link was invalid. You can contact us at hello@mapincolor.com if you need help.', isError: true }));
    }
    const { error } = await supabaseAdmin
      .from('email_subscriptions')
      .update({ subscribed: false })
      .eq('id', id);

    if (error) {
      console.error('Error unsubscribing (token):', error);
      res.status(500).set('Content-Type', 'text/html');
      return res.send(unsubPage({ title: 'Something went wrong', message: 'We couldn’t process your request. Please try again or contact hello@mapincolor.com.', isError: true }));
    }
    res.status(200).set('Content-Type', 'text/html');
    return res.send(unsubPage({ title: 'You’re unsubscribed', message: 'You’ve been removed from our promotional email list. You won’t receive further updates unless you sign up again. Sorry to see you go!' }));
  } catch (err) {
    res.status(400).set('Content-Type', 'text/html');
    return res.send(unsubPage({ title: 'Link expired', message: 'This unsubscribe link has expired or is invalid. If you still want to unsubscribe, contact us at hello@mapincolor.com.', isError: true }));
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
    res.status(500).set('Content-Type', 'text/html');
    return res.send(unsubPage({ title: 'Something went wrong', message: 'We couldn’t process your request. Please try again or contact hello@mapincolor.com.', isError: true }));
  }

  res.status(200).set('Content-Type', 'text/html');
  return res.send(unsubPage({ title: 'You’re unsubscribed', message: 'You’ve been removed from our promotional email list. You won’t receive further updates unless you sign up again. Sorry to see you go!' }));
});

module.exports = router;
