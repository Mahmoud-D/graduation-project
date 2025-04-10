// models/Role.js

const connection = require('../config/db');

// جلب جميع الأدوار
const Role = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM roles', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  // إنشاء دور جديد
  create: (name) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO roles (name) VALUES (?)';
      connection.query(sql, [name], (err, results) => {
        if (err) reject(err);
        resolve(results.insertId); // إرجاع id الخاص بالدور الذي تم إنشاؤه
      });
    });
  },
};

module.exports = Role;
