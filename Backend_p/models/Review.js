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

  },


  
  OverallAverageRating: async (dishId) => {
    try {
      const query = sql`
      SELECT ROUND(AVG(rating), 2) AS average_rating FROM reviews;

      `;
      const results = await query;
      return results;
    } catch (err) {
      console.error('❌ Error fetching reviews for dish:', err);
      throw err;
    }
  },

  ReviewsOverTimebymonth: async (dishId) => {
    try {
      const query = sql`
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS review_count
FROM reviews
GROUP BY month
ORDER BY month;

      `;
      const results = await query;
      return results;
    } catch (err) {
      console.error('❌ Error fetching reviews for dish:', err);
      throw err;
    }
  },
  ReviewsOverTimebyDay: async (dishId) => {
    try {
      const query = sql`
SELECT 
  DATE(created_at) AS date,
  COUNT(*) AS review_count
FROM reviews
GROUP BY date
ORDER BY date;


      `;
      const results = await query;
      return results;
    } catch (err) {
      console.error('❌ Error fetching reviews for dish:', err);
      throw err;
    }
  },

  RatingDistributionHistogram: async (dishId) => {
    try {
      const query = sql`
SELECT rating, COUNT(*) AS count
FROM reviews
GROUP BY rating
ORDER BY rating;
      `;
      const results = await query;
      return results;
    } catch (err) {
      console.error('❌ Error fetching reviews for dish:', err);
      throw err;
    }
  },
  getUsersWithMostReviews: async (dishId) => {
    try {
      const query = sql`
SELECT 
  reviews.user_id, 
  users.name AS user_name, 
  COUNT(*) AS review_count
FROM reviews
JOIN users ON users.id = reviews.user_id
GROUP BY reviews.user_id, users.name
ORDER BY review_count DESC
LIMIT 10;


      `;
      const results = await query;
      return results;
    } catch (err) {
      console.error('❌ Error fetching reviews for dish:', err);
      throw err;
    }
  },
  getTopRatedDishes: async (dishId) => {
    try {
      const query = sql`
SELECT 
  dishes.name,
  ROUND(AVG(reviews.rating), 2) AS avg_rating,
  COUNT(*) AS review_count
FROM reviews
JOIN dishes ON dishes.id = reviews.dish_id
GROUP BY dishes.name
ORDER BY avg_rating DESC;


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
