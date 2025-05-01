const sql = require('../config/db');

const RestaurantReview = {
  // إنشاء تقييم جديد
  create: async ({ user_id, rating, comment }) => {
    try {
      const query = sql`
        INSERT INTO restaurant_reviews (user_id, rating, comment)
        VALUES (${user_id}, ${rating}, ${comment})
        RETURNING id
      `;
      const result = await query;
      return {
        id: result[0].id,
        user_id,
        rating,
        comment,
      };
    } catch (err) {
      console.error('❌ Error creating restaurant review:', err);
      throw err;
    }
  },

  // الحصول على جميع التقييمات لمستخدم معين
  getByUserId: async (userId) => {
    try {
      const query = sql`
        SELECT * FROM restaurant_reviews
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
      const results = await query;
      return results;
    } catch (err) {
      console.error('❌ Error fetching reviews for user:', err);
      throw err;
    }
  }
};

module.exports = RestaurantReview;
