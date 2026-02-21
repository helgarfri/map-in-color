require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { resend } = require('../config/resend');
const { supabaseAdmin } = require('../config/supabase');

// Test only — sends to these addresses, no one else
const TEST_EMAILS = ['helgifreyr02@gmail.com', 'hfd2@hi.is'];

const BASE_URL = 'https://mapincolor.com';

(async () => {
  const filePath = path.join(__dirname, '..', 'emails', 'v3-release.html');
  const template = fs.readFileSync(filePath, 'utf-8');

  for (const email of TEST_EMAILS) {
    let unsubscribeLink = `${BASE_URL}/api/unsubscribe/0`;
    const { data: subscriber } = await supabaseAdmin
      .from('email_subscriptions')
      .select('id')
      .ilike('email', email)
      .maybeSingle();
    if (subscriber?.id) {
      unsubscribeLink = `${BASE_URL}/api/unsubscribe/${subscriber.id}`;
    } else {
      console.warn(`${email} not in email_subscriptions — unsubscribe link may not work.`);
    }

    const finalHtml = template.replace(/\{\{unsubscribeLink\}\}/g, unsubscribeLink);

    try {
      const data = await resend.emails.send({
        from: 'Map in Color <no-reply@mapincolor.com>',
        to: email,
        subject: 'Map in Color 3.0 is here',
        html: finalHtml,
        headers: {
          'List-Unsubscribe': `<${unsubscribeLink}>, <mailto:hello@mapincolor.com?subject=unsubscribe>`,
        },
      });
      console.log('Sent to', email, data?.data?.id ?? '');
    } catch (error) {
      console.error('Error sending to', email, error);
    }
  }
  console.log('Done. Sent only to:', TEST_EMAILS.join(', '));
})();
