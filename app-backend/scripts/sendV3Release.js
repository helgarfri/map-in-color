/**
 * Send the v3 release email to all subscribers (subscribed = true).
 * Each recipient gets a working unsubscribe link: https://mapincolor.com/api/unsubscribe/:id
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

    const filePath = path.join(__dirname, '..', 'emails', 'v3-release.html');
    const template = fs.readFileSync(filePath, 'utf-8');

    for (const subscriber of subscribers) {
      const unsubscribeLink = `${BASE_URL}/api/unsubscribe/${subscriber.id}`;
      const finalHtml = template.replace(/\{\{unsubscribeLink\}\}/g, unsubscribeLink);

      try {
        await resend.emails.send({
          from: 'Map in Color <no-reply@mapincolor.com>',
          to: subscriber.email,
          subject: 'Map in Color 3.0 is here',
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
    console.error('Error in sendV3Release.js:', err);
  }
})();
