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
 * Parse custom_data object or JSON string and return user_id.
 * We pass custom_data: { user_id: <our user id> } at checkout; Paddle attaches it to transaction and subscription.
 */
function parseUserIdFromCustomData(customData) {
  if (customData == null) return null;
  const obj = typeof customData === 'string'
    ? (() => { try { return JSON.parse(customData); } catch { return null; } })()
    : customData;
  if (!obj || typeof obj !== 'object') return null;
  const id = obj.user_id;
  return id != null && id !== '' ? id : null;
}

/**
 * Resolve user id from webhook payload. Check transaction top-level custom_data first (from checkout),
 * then subscription top-level, then subscription items' custom_data.
 */
function getUserIdFromPayload(data) {
  if (!data) return null;
  let userId = parseUserIdFromCustomData(data.custom_data);
  if (userId != null) return userId;
  if (data.items && Array.isArray(data.items)) {
    for (const item of data.items) {
      userId = parseUserIdFromCustomData(item?.custom_data);
      if (userId != null) return userId;
    }
  }
  return null;
}

async function setUserPlan(userId, plan, paddleCustomerId = null) {
  if (userId == null || userId === '') return;
  const updates = { plan };
  if (paddleCustomerId != null && String(paddleCustomerId).trim() !== '') {
    updates.paddle_customer_id = paddleCustomerId;
  }
  const { data, error } = await supabaseAdmin.from('users').update(updates).eq('id', userId).select('id');
  if (error) {
    console.error('Paddle webhook: failed to update user plan:', { userId, plan, error: error.message, code: error.code });
    return;
  }
  console.log('Paddle webhook: updated user plan', { userId, plan, rowsAffected: data?.length ?? 0 });
}

/**
 * POST /api/webhooks/paddle
 * Must be mounted with express.raw({ type: 'application/json' }) so req.body is a Buffer.
 */
async function handlePaddleWebhook(req, res) {
  const rawBody = req.body;
  if (!Buffer.isBuffer(rawBody)) {
    console.error('Paddle webhook: body is not a Buffer (mount with express.raw)');
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  const bodyStr = rawBody.toString('utf8');
  const signature = req.headers['paddle-signature'];

  if (!verifySignature(bodyStr, signature)) {
    if (!WEBHOOK_SECRET) console.error('Paddle webhook: PADDLE_WEBHOOK_SECRET is not set');
    console.warn('Paddle webhook: invalid signature or missing secret');
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

  // Log every webhook for debugging (no PII)
  console.log('Paddle webhook received', { eventType, hasData: !!data, custom_data: data?.custom_data });

  if (!eventType || !data) {
    return res.status(200).json({ received: true });
  }

  const userId = getUserIdFromPayload(data);
  const paddleCustomerId = data?.customer_id || null;
  console.log('Paddle webhook: extracted userId', { eventType, userId, paddleCustomerId: !!paddleCustomerId });

  const activeStatuses = ['active', 'trialing'];
  const inactiveStatuses = ['canceled', 'past_due', 'paused'];

  switch (eventType) {
    case 'transaction.completed':
    case 'transaction.paid':
      // Transaction fires when payment succeeds; custom_data is on transaction (from checkout). Most reliable for first payment.
      await setUserPlan(userId, 'pro', paddleCustomerId);
      break;
    case 'subscription.created':
    case 'subscription.activated':
    case 'subscription.resumed':
      await setUserPlan(userId, 'pro', paddleCustomerId);
      break;
    case 'subscription.updated':
      if (data.status && inactiveStatuses.includes(data.status)) {
        await setUserPlan(userId, 'free');
      } else if (data.status && activeStatuses.includes(data.status)) {
        await setUserPlan(userId, 'pro', paddleCustomerId);
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
