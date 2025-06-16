// https://developers.brevo.com/reference/getemailcampaign

// Address	Heliopolis, Cairo
// Zipcode	11757
// City	Cairo
// Country	Egypt



const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',  
  port: 587,                     
  secure: false,                 
  auth: {
    user: '8be65b001@smtp-brevo.com',  
    pass: 'UmDRGI3T205hVKw4',          
  },
});


const sendEmail = async (options) => {
  const { to, subject, text, html, category, senderName } = options;

  

  try {
    const mailOptions = {
      from: '"Khaled" <khaled.mohameed1998@gmail.com>',  
      to,
      subject,
      text,
      html,  
      category,
     };

     const info = await transporter.sendMail(mailOptions);
    console.log("تم إرسال البريد بنجاح:", info);
    return info;
  } catch (error) {
    console.error("❌ فشل إرسال البريد الإلكتروني:", error);
    throw new Error("فشل إرسال البريد الإلكتروني: " + error.message);
  }
};

module.exports = sendEmail;



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
 