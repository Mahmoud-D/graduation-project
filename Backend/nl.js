const nodemailer = require('nodemailer');

// Create transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',   // Brevo SMTP server
  port: 587,                      // Port for TLS
  secure: false,                  // Use TLS, not SSL
  auth: {
    user: '8be65b001@smtp-brevo.com',   // Your Brevo SMTP login
    pass: 'UmDRGI3T205hVKw4',           // Your Brevo Master Password
  },
});

// Mail options
const mailOptions = {
  from: '"Khaled" <khaled.mohameed1998@gmail.com>',   // Use the validated email
  to: 'siyedox789@exitings.com',
  subject: 'Graduation Project Test',
  text: 'This is a test email using Brevo SMTP and Node.js!',
};

// Send email
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('Error occurred:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
