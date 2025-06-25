const sql = require('../config/db');  

const DishCategory = {
   create: async (dishId, categoryId) => {
    try {
      const query = sql`
        INSERT INTO dish_categories (dish_id, category_id)
        VALUES (${dishId}, ${categoryId})
        RETURNING id
      `;
      const result = await query;
      return result[0].id; 
    } catch (err) {
      console.error('❌ Error creating dish category:', err);
      throw err;
    }
  },
};

module.exports = DishCategory;
