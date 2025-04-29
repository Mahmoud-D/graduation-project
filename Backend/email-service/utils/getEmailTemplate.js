const templates = require("../templates");
const sql = require("../config/dbEmail");

/**
 * Loads an email template from local or DB and renders it.
 *
 * @param {string} templateName
 * @param {Object} templateData
 * @param {string} language
 * @returns {Promise<{ subject: string, html: string }>}
 */
const getEmailTemplateUnified = async (
  templateName,
  templateData = {},
  language = "ar"
) => {
  // Check if local template exists
  const localTemplateFn = templates[templateName];

  if (typeof localTemplateFn === "function") {
    const { subject, html } = localTemplateFn({ ...templateData, language });
    return { subject, html };
  }

  // Load template from DB
  const result = await sql`
    SELECT subject, template_body 
    FROM email_templates 
    WHERE template_name = ${templateName} AND language = ${language}
    LIMIT 1
  `;

  if (result.length === 0) {
    throw new Error(`Template "${templateName}" not found locally or in DB.`);
  }

  const { subject, template_body } = result[0];

  // Use simple placeholder replacement
  const finalHtml = renderTemplate(template_body, {
    ...templateData,
    language,
  });

  return {
    subject: subject || "No Subject",
    html: finalHtml,
  };
};

// Same renderTemplate function as above
function renderTemplate(templateStr, data = {}) {
  return templateStr.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return data[key] !== undefined ? data[key] : "";
  });
}

module.exports = getEmailTemplateUnified;
