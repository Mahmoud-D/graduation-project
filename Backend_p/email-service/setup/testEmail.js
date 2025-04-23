const getEmailTemplateUnified = require("../utils/getEmailTemplate");

 
// بيانات تجريبية
const templateData = {
  name: 'Khaled',
  link: 'https://example.com/verify',
  language: 'ar',
};

// دالة لاختبار القوالب
async function testTemplates() {
  try {
    // اختبار قالب محلي
    console.log('Testing local template...');
    const localTemplate = await getEmailTemplateUnified('welcomeTemplate', templateData);
    console.log('Local Template (Subject):', localTemplate.subject);
    console.log('Local Template (HTML):', localTemplate.html);

    // اختبار قالب من قاعدة البيانات
    console.log('Testing DB template...');
    const dbTemplate = await getEmailTemplateUnified('verificationTemplate', templateData);
    console.log('DB Template (Subject):', dbTemplate.subject);
    console.log('DB Template (HTML):', dbTemplate.html);
    
  } catch (error) {
    console.error('Error during template rendering:', error.message);
  }
}

// اختبار القوالب
testTemplates();
