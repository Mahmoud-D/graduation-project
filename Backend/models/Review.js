const connection = require('../config/db');

const Review = {
  // Create a new review
  create: ({ user_id, dish_id, rating, comment }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO reviews (user_id, dish_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `;
      connection.query(sql, [user_id, dish_id, rating, comment], (err, results) => {
        if (err) return reject(err);
        resolve({ id: results.insertId, user_id, dish_id, rating, comment });
      });
    });
  },

  // Get all reviews for a specific dish
  getByDishId: (dishId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT reviews.*, users.name AS user_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE dish_id = ?
        ORDER BY created_at DESC
      `;
      connection.query(sql, [dishId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

module.exports = Review;
