// Import necessary configurations and utilities
const nodemailerConfig = require("../config/nodemailerConfig.js");
const {
  wrapLinksWithTracking,
  getTrackingPixel,
} = require("../utils/tracking.js");
 const { logEmailInDatabase } = require("../utils/emailLogger.js"); // Logging utility
const getEmailTemplate = require("../utils/getEmailTemplate.js"); // اضف الاستيراد في الأعلى

/**
 * @function sendEmail
 * @param {Object} params
 * @param {string|string[]} params.to - Required. One or more recipient email addresses.
 * @param {string} params.subject - Required. Email subject.
 * @param {string} [params.html] - Optional. HTML body content. Ignored if templateName is provided.
 * @param {string} [params.text] - Optional. Plain text fallback version of the email.
 * @param {string} [params.templateName] - Optional. Name of the template to use.
 * @param {Object} [params.templateData] - Optional. Data to render inside the template.
 * @param {string} [params.language='ar'] - Optional. Language code for the template.
 * @param {boolean} [params.log=true] - Optional. Whether to log the email in DB.
 * @param {string|string[]} [params.bcc] - Optional. One or more BCC recipients.
 * @param {Array} [params.attachments] - Optional. Array of attachment objects.
 */
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

    // If a template name is provided, get the template and override the subject and html
    if (templateName) {
      const template = getEmailTemplate(templateName, templateData, language);
      finalSubject = template.subject;
      finalHtml = template.html;
    }

    // Send email with tracking and logging
    const results = await Promise.all(
      recipients.map(async (recipient) => {
        try {
          // Wrap the HTML content with tracking links and pixels
          const htmlWithTracking = wrapLinksWithTracking(
            `${finalHtml}${getTrackingPixel(recipient)}`,
            recipient
          );

          // Sending the email using nodemailer
          const result = await nodemailerConfig.sendMail({
            from: process.env.EMAIL_USER,
            to: recipient,
            bcc: bccRecipients, // Optional BCC recipients
            subject: finalSubject,
            html: htmlWithTracking, // HTML version
            text: text || "", // Optional plain text fallback
            attachments, // Optional attachments
          });

          // Log to DB if enabled
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
          console.error("Error in sendEmail function:", innerError);
         
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

// Export the functions for use in other parts of the application
module.exports = {
  sendEmail, // Export the sendEmail function
};
