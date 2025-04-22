const sql = require('../config/db');

const Review = {
  // إنشاء تقييم جديد
  create: async ({ user_id, dish_id, rating, comment }) => {
    try {
      const query = sql`
        INSERT INTO reviews (user_id, dish_id, rating, comment)
        VALUES (${user_id}, ${dish_id}, ${rating}, ${comment})
        RETURNING id
      `;
      const result = await query;
      return {
        id: result[0].id,
        user_id,
        dish_id,
        rating,
        comment
      };
    } catch (err) {
      console.error('❌ Error creating review:', err);
      throw err;
    }
  },

  // الحصول على جميع التقييمات لطبق معين
  getByDishId: async (dishId) => {
    try {
      const query = sql`
        SELECT reviews.*, users.name AS user_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE dish_id = ${dishId}
        ORDER BY reviews.created_at DESC
      `;
      const results = await query;
      return results;
    } catch (err) {
      console.error('❌ Error fetching reviews for dish:', err);
      throw err;
    }
  }
};

module.exports = Review;
