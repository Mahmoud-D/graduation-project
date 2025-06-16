


require('dotenv').config();
const nodemailer = require('nodemailer');

// SMTP or Gmail

const isGmail = process.env.MAIL_SERVICE === 'gmail';

const transporter = nodemailer.createTransport(
  isGmail
    ? {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,  
        },
      }
    : {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true', // true for SSL
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
);

// Connection Test

transporter.verify((error, success) => {
  if (error) {
    console.error('  connection failed:', error);
  } else {
    console.log('server is ready to send emails');
  }
});

module.exports = transporter;
