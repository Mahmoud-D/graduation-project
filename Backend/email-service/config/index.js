// https://mailtrap.io/sending/domains/0c93287e-47c7-44ac-979a-7f64aa88a06c?current_tab=open_clicks
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = "6d26b6005df711914212e33fcf6fec3c";

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
const recipients = [
  "khaled.mohameed1998@gmail.com",
];

transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "heloo  test are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);