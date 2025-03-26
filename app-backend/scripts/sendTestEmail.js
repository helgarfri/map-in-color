require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { resend } = require('../config/resend');

// Read in the template
const filePath = path.join(__dirname, '..', 'emails', 'launch.html');
const template = fs.readFileSync(filePath, 'utf-8');
const unsubscribeLink = `https://mapincolor.com/api/unsubscribe/${subscriber.id}
`;

const finalHtml = template.replace('{{unsubscribeLink}}', unsubscribeLink);

(async () => {
  try {
    const data = await resend.emails.send({
      from: 'Helgi from Map in Color <no-reply@mapincolor.com>',
      to: 'helgifreyr02@gmail.com',
      subject: 'Mic is live!',
      html: finalHtml,
    });

    console.log('Email sent successfully!', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
})();
