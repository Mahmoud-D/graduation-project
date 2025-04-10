// 4. إنشاء موديل OrderDish (جدول ربط الأطباق بالطلبات)

// models/OrderDish.js

const connection = require("../config/db");

// Create OrderDish Model
const OrderDish = {
  addDishesToOrder: (orderId, dishId, quantity) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES (?, ?, ?)";
      connection.query(sql, [orderId, dishId, quantity], (err, results) => {
        if (err) reject(err);
        resolve(results.insertId);
      });
    });
  },

  getByOrderId: (orderId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM order_dishes WHERE order_id = ?",
        [orderId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  },
};

module.exports = OrderDish;
