import { Resend } from 'resend';

const resend = new Resend('your_api_key');

const sendPromotionalEmail = async ({ to, subject, text }) => {
  await resend.emails.send({
    from: 'Mic <hello@mapincolor.com>',
    to,
    subject,
    text,
    headers: {
      'List-Unsubscribe': '<https://mapincolor.com/unsubscribe>',
    },
  });
};
