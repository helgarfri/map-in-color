// resend.js (CommonJS version)
require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = { resend };
