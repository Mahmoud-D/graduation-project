const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khaled.mohameed1998@gmail.com',        // الإيميل بتاعك
    pass: 'tmel cllz eljv zsbf',      // ال App Password اللي طلعته
  },
});

const mailOptions = {
  from: 'your_email@gmail.com',
  to: 'khaled.mohameed1998@gmail.com',   // اللي انت عايز تبعتله
  subject: 'Graduation Project Test',
  text: 'This is a test email using Gmail SMTP and Node.js!',
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('Error occurred:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
