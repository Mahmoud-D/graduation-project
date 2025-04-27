// emailService.js
const nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = "6d26b6005df711914212e33fcf6fec3c";

// إعداد خدمة النقل باستخدام Mailtrap
const transport = nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

// إعداد ثابت للمرسل (البريد الإلكتروني الأساسي)
const defaultSender = {
  address: "hello@demomailtrap.co",
  name: "Mailtrap Test", // يمكنك تغيير هذا الاسم أو تركه ثابتًا
};

/**
 * دالة لإرسال البريد الإلكتروني
 * @param {Object} options - معلمات البريد الإلكتروني.
 * @param {string} options.to - البريد الإلكتروني أو مجموعة من عناوين البريد الإلكتروني للمستلمين.
 * @param {string} options.subject - موضوع البريد الإلكتروني.
 * @param {string} options.text - نص البريد الإلكتروني.
 * @param {string} [options.html] - (اختياري) نص HTML للبريد الإلكتروني.
 * @param {string} [options.category] - (اختياري) فئة البريد الإلكتروني (مثل اختبار التكامل).
 * @param {string} [options.senderName] - (اختياري) اسم المرسل إذا أردت تخصيصه.
 * @returns {Promise} - وعد بالإجابة بعد إرسال البريد.
 */
const sendEmail = async (options) => {
  const { to, subject, text, html, category, senderName } = options;

  // تخصيص اسم المرسل إذا تم تمريره، أو استخدام الاسم الافتراضي
  const sender = {
    ...defaultSender,
    name: senderName || defaultSender.name,  // إذا تم تمرير اسم المرسل، يتم استخدامه، وإلا يتم استخدام الافتراضي
  };

  try {
    const mailOptions = {
      from: sender,
      to,
      subject,
      text,
      html,  
      category, // فئة البريد الإلكتروني (اختياري)
    };

    // إرسال البريد الإلكتروني باستخدام nodemailer
    const info = await transport.sendMail(mailOptions);
    console.log("تم إرسال البريد بنجاح:", info);
    return info;
  } catch (error) {
    console.error("❌ فشل إرسال البريد الإلكتروني:", error);
    throw new Error("فشل إرسال البريد الإلكتروني: " + error.message);
  }
};

module.exports = sendEmail;



// // في ملف آخر، على سبيل المثال register.js أو في أي ملف يتطلب إرسال بريد إلكتروني
// const sendEmail = require("./emailService");

// const recipients = [
//   "khaled.mohameed1998@gmail.com",
// ];

// const subject = "Welcome to Our Service!";
// const text = "Thank you for signing up with our service. We are excited to have you!";
// const html = "<p>Thank you for signing up with our service. We are excited to have you!</p>";
// const category = "User Registration";
// const senderName = "Khaled's Team"; // تخصيص اسم المرسل

// // استخدام دالة إرسال البريد الإلكتروني
// sendEmail({
//   to: recipients,
//   subject,
//   text,
//   html,
//   category,
//   senderName, // إذا أردت تخصيص الاسم
// })
//   .then((result) => console.log("تم إرسال البريد بنجاح", result))
//   .catch((error) => console.error("حدث خطأ في إرسال البريد:", error));