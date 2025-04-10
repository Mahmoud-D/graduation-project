// ├───config
// │       db.js

const mysql = require('mysql2');

// إعداد الاتصال بقاعدة البيانات البعيدة
const db = mysql.createConnection({
  host: 'sql8.freesqldatabase.com',   // استبدل بـ hostname الذي زودتني به
  user: 'sql8772293',                 // اسم المستخدم
  password: 'QsLIMmc2dS',             // كلمة المرور
  database: 'sql8772293',             // اسم قاعدة البيانات
  port: 3306                          // رقم المنفذ (port number)
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;

// Host: sql8.freesqldatabase.com
// Database name: sql8772293
// Database user: sql8772293
// Database password: QsLIMmc2dS
// Port number: 3306