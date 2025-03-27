require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { resend } = require('../config/resend');

// Read in the template
const filePath = path.join(__dirname, '..', 'emails', 'launch.html');
const template = fs.readFileSync(filePath, 'utf-8');

// Example: if you have a user with ID 23
const unsubscribeLink = 'https://mapincolor.com/api/unsubscribe/23';
const finalHtml = template.replace('{{unsubscribeLink}}', unsubscribeLink);

(async () => {
  try {
    const data = await resend.emails.send({
      from: 'Helgi from Map in Color <hello@mapincolor.com>',
      to: 'helgifreyr02@gmail.com',
      subject: 'Mic is live!',
      html: finalHtml,
      headers: {
        // Some email clients look for mailto:, some look for a direct link.
        // It’s recommended to include both, separated by commas.
        'List-Unsubscribe': `<${unsubscribeLink}>, <mailto:hello@mapincolor.com?subject=unsubscribe>`
      }
    });

    console.log('Email sent successfully!', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
})();
