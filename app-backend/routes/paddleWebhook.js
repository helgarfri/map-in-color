// routes/paddleWebhook.js – Paddle webhook handler (raw body; mount with express.raw)
const crypto = require('crypto');
const { supabaseAdmin } = require('../config/supabase');

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

/**
 * Verify Paddle-Signature: ts=UNIX;h1=HMAC_SHA256(secret, ts + ':' + rawBody)
 */
function verifySignature(rawBody, signatureHeader) {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;
  const parts = {};
  signatureHeader.split(';').forEach((part) => {
    const [k, v] = part.trim().split('=');
    if (k && v) parts[k] = v;
  });
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;
  const signedPayload = `${ts}:${rawBody}`;
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(signedPayload).digest('hex');
  if (expected.length !== h1.length || !crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(h1, 'hex'))) {
    return false;
  }
  const age = Math.abs(Date.now() / 1000 - parseInt(ts, 10));
  if (age > 300) return false; // reject if older than 5 min (replay)
  return true;
}

/**
 * Resolve user id from webhook payload. We pass custom_data: { user_id: <our user id> } at checkout.
 */
function getUserIdFromPayload(data) {
  const customData = data?.custom_data;
  if (!customData) return null;
  const id = typeof customData === 'string' ? (() => { try { return JSON.parse(customData).user_id; } catch { return null; } })() : customData.user_id;
  return id != null ? Number(id) : null;
}

async function setUserPlan(userId, plan) {
  if (!userId) return;
  const { error } = await supabaseAdmin.from('users').update({ plan }).eq('id', userId);
  if (error) console.error('Paddle webhook: failed to update user plan:', error);
}

/**
 * POST /api/webhooks/paddle
 * Must be mounted with express.raw({ type: 'application/json' }) so req.body is a Buffer.
 */
async function handlePaddleWebhook(req, res) {
  const rawBody = req.body;
  if (!Buffer.isBuffer(rawBody)) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  const bodyStr = rawBody.toString('utf8');
  const signature = req.headers['paddle-signature'];

  if (!verifySignature(bodyStr, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(bodyStr);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const eventType = payload?.event_type;
  const data = payload?.data;

  if (!eventType || !data) {
    return res.status(200).json({ received: true });
  }

  const userId = getUserIdFromPayload(data);

  const activeStatuses = ['active', 'trialing'];
  const inactiveStatuses = ['canceled', 'past_due', 'paused'];

  switch (eventType) {
    case 'subscription.created':
    case 'subscription.activated':
    case 'subscription.resumed':
      await setUserPlan(userId, 'pro');
      break;
    case 'subscription.updated':
      if (data.status && inactiveStatuses.includes(data.status)) {
        await setUserPlan(userId, 'free');
      } else if (data.status && activeStatuses.includes(data.status)) {
        await setUserPlan(userId, 'pro');
      }
      break;
    case 'subscription.canceled':
    case 'subscription.past_due':
    case 'subscription.paused':
      await setUserPlan(userId, 'free');
      break;
    default:
      break;
  }

  return res.status(200).json({ received: true });
}

module.exports = { handlePaddleWebhook };
