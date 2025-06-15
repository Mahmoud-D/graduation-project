const e = require("express");
const sql = require("../config/db"); // الاتصال الجديد بـ postgres
const bcrypt = require("bcrypt");

class User {
  constructor(name, email, password, role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error("خطأ في تشفير كلمة المرور");
    }
  }
  

  async create() {
    try {
      const hashedPassword = await this.constructor.hashPassword(this.password);
      const result = await sql`
        INSERT INTO users (name, email, password, role, created_at)
        VALUES (${this.name}, ${this.email}, ${hashedPassword}, ${this.role}, NOW())
        RETURNING id
      `;
      console.log("✅ Insert result:", result);
      return result[0].id;
    } catch (err) {
      if (err.code === "23505") {
        console.log("البريد الإلكتروني موجود بالفعل.");
        throw new Error("البريد الإلكتروني موجود بالفعل.");
      } else {
        console.log("حدث خطأ غير متوقع:", err);
        throw new Error("error in create user " + err.message);
      }
    }
  }

  static async getAll() {
    try {
      const results = await sql`SELECT * FROM users`;
      return results;
    } catch (err) {
      console.error("❌ Error getting all users:", err);
      throw new Error("خطأ في جلب المستخدمين");
    }
  }
  static async getUserGrowthReport() {
    try {
      const results = await sql`SELECT 
    DATE(created_at) AS signup_date,
    COUNT(*) AS new_users
FROM users
GROUP BY signup_date
ORDER BY signup_date;`;
      return results;
    } catch (err) {
      console.error("❌ Error getting all users:", err);
      throw new Error("خطأ في جلب المستخدمين");
    }
  }

  static async getById(id) {
    try {
      const result = await sql`SELECT * FROM users WHERE id = ${id}`;
      return result[0];
    } catch (err) {
      console.error("❌ Error getting user by ID:", err);
      throw new Error("خطأ في جلب المستخدم");
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error("خطأ في مقارنة كلمة المرور");
    }
  }
  static async initTable() {
    const sqlQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    try {
      await sql.unsafe(sqlQuery); // استخدم unsafe عشان نمرر SQL string عادي
      console.log('✅ Table "users" is ready');
    } catch (err) {
      console.error("❌ Error creating users table:", err);
      throw new Error("خطأ أثناء إنشاء الجدول");
    }
  }

  static async findByEmail(email) {
    try {
      const result = await sql`SELECT * FROM users WHERE email = ${email}`;
      return result[0];
    } catch (err) {
      console.error("❌ Error finding user by email:", err);
      throw new Error("خطأ في البحث عن المستخدم");
    }
  }

  static async update(id, data) {
    try {
      const fields = Object.entries(data)
        .map(([key, value], index) => sql`${sql(key)} = ${value}`)
        .reduce((prev, curr) => sql`${prev}, ${curr}`);

      const result = await sql`UPDATE users SET ${fields} WHERE id = ${id}`;
      return result.count > 0;
    } catch (err) {
      console.error("❌ Error updating user:", err);
      throw new Error("خطأ في تحديث المستخدم");
    }
  }

  static async delete(id) {
    try {
      const result = await sql`DELETE FROM users WHERE id = ${id}`;
      return result.count > 0;
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      throw new Error("خطأ في حذف المستخدم");
    }
  }

  static async toggleActiveStatus(id) {

console.log('========');

    console.log(id);
     
    try {
      const user = await sql`SELECT is_active FROM users WHERE id = ${id}`;
      if (!user.length) {
        throw new Error("المستخدم غير موجود");
      }
  
      const currentStatus = user[0].is_active;
      const newStatus = !currentStatus;
  
      await sql`UPDATE users SET is_active = ${newStatus} WHERE id = ${id}`;
  
      return newStatus; // ممكن ترجعه علشان تعرف إذا اتفعل أو اتعطل
    } catch (err) {

      console.log("❌ Error toggling user status:", err);
      
       throw new Error(Error);
    }
  }
  
  

}

module.exports = User;
