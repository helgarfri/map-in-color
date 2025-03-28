require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../config/supabase');
const { resend } = require('../config/resend');

// A small helper to create a delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  try {
    // 1. Fetch subscribed users
    const { data: subscribers, error } = await supabaseAdmin
      .from('email_subscriptions')
      .select('id, email')
      .eq('subscribed', true);

    if (error) {
      throw error;
    }

    // 2. Read the email template
    const filePath = path.join(__dirname, '..', 'emails', 'launch.html');
    const template = fs.readFileSync(filePath, 'utf-8');

    // 3. Loop through each subscriber, create their unsubscribe link, and send
    for (const subscriber of subscribers) {
      // Fix: use a valid string or template literal
      const unsubscribeLink = `https://mapincolor.com/api/unsubscribe/${subscriber.id}`;
      const finalHtml = template.replace('{{unsubscribeLink}}', unsubscribeLink);

      try {
        await resend.emails.send({
          from: 'Helgi from Map in Color <no-reply@mapincolor.com>',
          to: subscriber.email,
          subject: 'Mic is live!',
          html: finalHtml,
        });
        console.log(`Email sent successfully to ${subscriber.email}`);
      } catch (err) {
        console.error(`Error sending to ${subscriber.email}:`, err);
      }

      // 4. Optionally wait 1 second before the next send
      await sleep(1000);
    }

    console.log('All promotional emails have been sent!');
  } catch (err) {
    console.error('Error in sendPromoEmail.js:', err);
  }
})();
