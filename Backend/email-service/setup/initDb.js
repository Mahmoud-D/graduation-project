// db-setup/initDb.js
const sql = require('../config/dbEmail');

async function createTableAndSeedData() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS email_templates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,  -- إضافة قيد فريد هنا
      subject VARCHAR(255),
      html TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  const insertDataQuery = `
    INSERT INTO email_templates (name, subject, html)
    VALUES
      ('Welcome Template', 'Welcome to Our Service', '<h1>Welcome to our amazing service</h1>'),
      ('Password Reset', 'Reset Your Password', '<p>Click <a href="#">here</a> to reset your password.</p>')
    ON CONFLICT (name) DO NOTHING;
  `;

  try {
    // تنفيذ الاستعلام لإنشاء الجدول
    await sql.unsafe(createTableQuery);
    console.log('✅ تم إنشاء الجدول بنجاح');
    
    // إدخال البيانات الأولية
    await sql.unsafe(insertDataQuery);
    console.log('✅ تم إدخال البيانات الأولية بنجاح');
  } catch (err) {
    console.error('❌ حدث خطأ أثناء إعداد قاعدة البيانات:', err);
  }
}

// تشغيل دالة إعداد قاعدة البيانات
createTableAndSeedData();
