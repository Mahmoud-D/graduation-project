// استيراد الوظائف من ملف tracking.js
const { wrapLinksWithTracking, getTrackingPixel } = require('../utils/tracking');

// عند إرسال البريد الإلكتروني، سنقوم بإضافة روابط التتبع وصورة التتبع
const sendEmail = async ({
  to,
  subject,
  html,
  text,
  templateName,
  templateData = {},
  language = "ar",
  log = true,
  bcc,
  attachments = [],
}) => {
  try {
    const recipients = Array.isArray(to) ? to : [to];
    const bccRecipients = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined;

    let finalSubject = subject;
    let finalHtml = html;

    // إذا كان هناك قالب، نقوم باستخدامه لتحديد الموضوع والمحتوى
    if (templateName) {
      const template = getEmailTemplate(templateName, templateData, language);
      finalSubject = template.subject;
      finalHtml = template.html;
    }

    // إضافة روابط التتبع وصورة التتبع للبريد الإلكتروني
    const results = await Promise.all(
      recipients.map(async (recipient) => {
        try {
          // إضافة التتبع إلى المحتوى
          const htmlWithTracking = wrapLinksWithTracking(
            `${finalHtml}${getTrackingPixel(recipient)}`,
            recipient
          );

          // إرسال البريد الإلكتروني باستخدام nodemailer
          const result = await nodemailerConfig.sendMail({
            from: process.env.EMAIL_USER,
            to: recipient,
            bcc: bccRecipients, // المستلمين المخفيين
            subject: finalSubject,
            html: htmlWithTracking, // نسخة HTML مع الروابط المتعقبة
            text: text || "", // نص عادي كنسخة احتياطية
            attachments, // المرفقات
          });

          // تسجيل البريد في قاعدة البيانات إذا كان log مفعلاً
          if (log) {
            await logEmailInDatabase(recipient, finalSubject, finalHtml);
          }

          return result;
        } catch (innerError) {
          console.error(
            "Error sending email to recipient:",
            recipient,
            innerError
          );
          throw new Error(`Failed to send email to ${recipient}`);
        }
      })
    );

    return results;
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw new Error(
      "An error occurred while processing the email request. Please try again later."
    );
  }
};

// تصدير الوظيفة لاستخدامها في ملفات أخرى
module.exports = {
  sendEmail, // تصدير دالة sendEmail
};
