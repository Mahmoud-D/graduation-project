// 4. إنشاء موديل OrderDish (جدول ربط الأطباق بالطلبات)

// models/OrderDish.js
// models/OrderDish.js

const connection = require("../config/db");

const OrderDish = {
  addDishesToOrder: (orderId, dishId, quantity) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO order_items (order_id, dish_id, quantity) VALUES (?, ?, ?)";
      connection
        .promise()
        .query(sql, [orderId, dishId, quantity])
        .then((results) => {
          resolve(results.insertId);
        })
        .catch((err) => {
          console.error("Error inserting dish to order:", err);
          reject("Error adding dish to order: " + err.message);
        });
    });
  },

  getByOrderId: (orderId) => {
    return new Promise((resolve, reject) => {
      connection
        .promise()
        .query(
          "SELECT * FROM order_items WHERE order_id = ?",
          [orderId],
          (err, results) => {
            if (err) reject(err);
            resolve(results);
          }
        );
    });
  },

  deleteByOrderId: async (orderId) => {
    try {
      const [results] = await connection
        .promise()
        .query("DELETE FROM order_items WHERE order_id = ?", [orderId]);
      return results.affectedRows;
    } catch (err) {
      console.error("Error in deleteByOrderId:", err.message);
      throw err;
    }
  },
};

module.exports = OrderDish;
