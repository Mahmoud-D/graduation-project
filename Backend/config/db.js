// ├───config
// │       db.js

const mysql = require("mysql2");

// إعداد الاتصال بقاعدة البيانات البعيدة
const db = mysql.createConnection({
  host: "sql8.freesqldatabase.com", // استبدل بـ hostname الذي زودتني به
  user: "sql8772293", // اسم المستخدم
  password: "QsLIMmc2dS", // كلمة المرور
  database: "sql8772293", // اسم قاعدة البيانات
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
   queueLimit: 0,
   charset: 'utf8mb4' 

  // multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

db.on("connection", (connection) => {
  connection.on("query", (query) => {
    console.log("Executing query:", query.sql);
  });
});

//  connection.on('query', (query) => {
//   console.log('Executing query:', query.sql);
// });

module.exports = db;

// Host: sql8.freesqldatabase.com
// Database name: sql8772293
// Database user: sql8772293
// Database password: QsLIMmc2dS
// Port number: 3306
