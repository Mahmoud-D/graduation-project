// models/Order.js

const connection = require("../config/db");

// Create Order Model
const Order = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM orders", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM orders WHERE id = ?",
        [id],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  create: (userId, status) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO orders (user_id, status, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";
      connection.query(sql, [userId, status], (err, results) => {
        if (err) reject(err);
        resolve(results.insertId);
      });
    });
  },

  update: (id, status) => {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?";
      connection.query(sql, [status, id], (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows);
      });
    });
  },
};

module.exports = Order;
