const connection = require('../config/db');
const bcrypt = require('bcrypt');
class User {
  constructor(name, email, password, role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // 🔐 تشفير كلمة المرور
  async hashPassword() {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
      throw new Error('خطأ في تشفير كلمة المرور');
    }
  }

  // 🧑‍💻 إنشاء مستخدم جديد
  async create() {
    try {
      const hashedPassword = await this.hashPassword();
      const sql = 'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())';
      const [results] = await connection.promise().query(sql, [this.name, this.email, hashedPassword, this.role]);
      console.log('✅ Insert result:', results);
      return results.insertId;
    } catch (err) {
      console.error('❌ Error during insert:', err);
      // هنا يمكنك طباعة المزيد من التفاصيل حول الخطأ:
      throw new Error('error in create user ' + err.message);
    }
  }





  static async getAll() {
    try {
      const [results] = await connection.promise().query('SELECT * FROM users');
      return results;
    } catch (err) {
      console.error('❌ Error getting all users:', err);
      throw new Error('خطأ في جلب المستخدمين');
    }
  }


  static async getById(id) {
    try {
      const [results] = await connection.promise().query('SELECT * FROM users WHERE id = ?', [id]);
      return results[0];
    } catch (err) {
      console.error('❌ Error getting user by ID:', err);
      throw new Error('خطأ في جلب المستخدم');
    }
  }




  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('خطأ في مقارنة كلمة المرور');
    }
  }

  // 🏗️ إنشاء جدول users إذا لم يكن موجود
  static async initTable() {
    const sql = `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    try {
      await connection.promise().query(sql);
      console.log('✅ Table "users" is ready');
    } catch (err) {
      console.error('❌ Error creating users table:', err);
      throw new Error('خطأ أثناء إنشاء الجدول');
    }
  }


  static async findByEmail(email) {
  try {
    const [results] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    return results[0]; // إذا وجدنا المستخدم، نعيده
  } catch (err) {
    console.error('❌ Error finding user by email:', err);
    throw new Error('خطأ في البحث عن المستخدم');
  }
}

}

module.exports = User;
