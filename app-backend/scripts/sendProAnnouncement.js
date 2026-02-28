/**
 * Send the Pro announcement email to all subscribers (subscribed = true).
 * Uses app-backend/emails/pro-announcement.html; each recipient gets a working unsubscribe link.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../config/supabase');
const { resend } = require('../config/resend');

const BASE_URL = 'https://mapincolor.com';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  try {
    const { data: subscribers, error } = await supabaseAdmin
      .from('email_subscriptions')
      .select('id, email')
      .eq('subscribed', true);

    if (error) throw error;

    const filePath = path.join(__dirname, '..', 'emails', 'pro-announcement.html');
    const template = fs.readFileSync(filePath, 'utf-8');

    for (const subscriber of subscribers) {
      const unsubscribeLink = `${BASE_URL}/api/unsubscribe/${subscriber.id}`;
      const finalHtml = template.replace(/\{\{unsubscribeLink\}\}/g, unsubscribeLink);

      try {
        await resend.emails.send({
          from: 'Helgi from Map in Color <hello@mapincolor.com>',
          to: subscriber.email,
          subject: 'Introducing Map in Color Pro',
          html: finalHtml,
          headers: {
            'List-Unsubscribe': `<${unsubscribeLink}>, <mailto:hello@mapincolor.com?subject=unsubscribe>`,
          },
        });
        console.log(`Sent to ${subscriber.email}`);
      } catch (err) {
        console.error(`Error sending to ${subscriber.email}:`, err);
      }

      await sleep(500);
    }

    console.log('Done.');
  } catch (err) {
    console.error('Error in sendProAnnouncement.js:', err);
  }
})();
