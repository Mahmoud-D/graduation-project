const db = require('../config/db'); 


const DishCategory = {
  create: async (dishId, categoryId) => {
    const sql = 'INSERT INTO dish_categories (dish_id, category_id) VALUES (?, ?)';
    const [result] = await db.promise().query(sql, [dishId, categoryId]);
    return result.insertId; 
  },
};

module.exports = DishCategory;
