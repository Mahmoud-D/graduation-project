// models/Dish.js

const connection = require('../config/db');

// Create Dish Model
const Dish = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM dishes', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM dishes WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },

  create: (name, description, price, category, imagePath) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO dishes (name, description, price, category, image_path, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
      connection.query(sql, [name, description, price, category, imagePath], (err, results) => {
        if (err) {
          reject(err);
        } else {
          // تحقق من وجود insertId قبل استخدامه
          if (results && results.insertId) {
            resolve(results.insertId);
          } else {
            reject(new Error('لم يتم الحصول على insertId'));
          }
        }
      });
    });
  },

  update: (id, name, description, price, category) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE dishes SET name = ?, description = ?, price = ?, category = ?, updated_at = NOW() WHERE id = ?';
      connection.query(sql, [name, description, price, category, id], (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows);
      });
    });
  }
};

module.exports = Dish;
