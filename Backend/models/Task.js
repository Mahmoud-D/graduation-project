// models/Task.js

const connection = require("../config/db");

// Create Task Model
const Task = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM tasks", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM tasks WHERE id = ?",
        [id],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  create: (chefId, orderId, dishId, status) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO tasks (chef_id, order_id, dish_id, status, assigned_at) VALUES (?, ?, ?, ?, NOW())";
      connection.query(
        sql,
        [chefId, orderId, dishId, status],
        (err, results) => {
          if (err) reject(err);
          resolve(results.insertId);
        }
      );
    });
  },

  update: (id, status) => {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE tasks SET status = ?, completed_at = NOW() WHERE id = ?";
      connection.query(sql, [status, id], (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows);
      });
    });
  },
};

module.exports = Task;
