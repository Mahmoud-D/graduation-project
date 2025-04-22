const sql = require('../config/db');

// Get all dishes
const Dish = {
  getAll: async ({ category, minPrice, maxPrice, name }) => {
    let query = sql`
      SELECT 
        d.*,
        AVG(r.rating) AS average_rating,
        STRING_AGG(c.name, ',') AS categories
      FROM dishes d
      LEFT JOIN reviews r ON d.id = r.dish_id
      LEFT JOIN dish_categories dc ON d.id = dc.dish_id
      LEFT JOIN categories c ON dc.category_id = c.id
      WHERE TRUE
    `;
    const params = [];

    if (category) {
      query = sql`${query} AND c.name = ${category}`;
    }

    if (minPrice) {
      query = sql`${query} AND d.price >= ${minPrice}`;
    }

    if (maxPrice) {
      query = sql`${query} AND d.price <= ${maxPrice}`;
    }

    if (name) {
      query = sql`${query} AND d.name ILIKE ${`%${name}%`}`;
    }

    query = sql`${query} GROUP BY d.id`;

    try {
      const result = await query;  // استخدم `query` هنا
      return result.map(dish => ({
        ...dish,
        average_rating: dish.average_rating ? parseFloat(dish.average_rating).toFixed(1) : null,
        categories: dish.categories ? dish.categories.split(',') : []
      }));
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    }
  },

  // Get dish by ID
  getById: async (id) => {
    const dishSql = sql`
      SELECT 
        d.id,
        d.name,
        d.description,
        d.price,
        d.image_path,
        AVG(r.rating) AS average_rating
      FROM dishes d
      LEFT JOIN reviews r ON d.id = r.dish_id
      WHERE d.id = ${id}
      GROUP BY d.id
    `;

    const commentsSql = sql`SELECT comment FROM reviews WHERE dish_id = ${id}`;

    const categoriesSql = sql`
      SELECT c.id, c.name 
      FROM categories c
      INNER JOIN dish_categories dc ON c.id = dc.category_id
      WHERE dc.dish_id = ${id}
    `;

    try {
      const dishResult = await dishSql;
      if (dishResult.length === 0) return null;

      const dish = dishResult[0];
      dish.average_rating = dish.average_rating ? parseFloat(dish.average_rating).toFixed(1) : null;

      const commentsResult = await commentsSql;
      dish.comments = commentsResult.map(row => row.comment);

      const categoriesResult = await categoriesSql;
      dish.categories = categoriesResult.map(row => ({ id: row.id, name: row.name }));

      return dish;
    } catch (err) {
      console.error("Error in getById:", err);
      throw err;
    }
  },

  // Create new dish
  create: async (name, description, price, imagePath) => {
    const sqlQuery = sql`
      INSERT INTO dishes (name, description, price, image_path, created_at)
      VALUES (${name}, ${description}, ${price}, ${imagePath}, NOW()) RETURNING id
    `;

    try {
      const result = await sqlQuery;
      return result[0].id;
    } catch (err) {
      console.error('Error in create dish:', err);
      throw err;
    }
  },

  // Update dish details
  update: async (id, name, description, price) => {
    const query = sql`
      UPDATE dishes
      SET name = ${name}, description = ${description}, price = ${price}
      WHERE id = ${id}
    `;

    try {
      const result = await query;
      return result.rowCount;
    } catch (err) {
      console.error('Error in update dish:', err);
      throw err;
    }
  },

  // Delete dish by ID
  delete: async (id) => {
    const query = sql`DELETE FROM dishes WHERE id = ${id}`;

    try {
      const result = await query;
      return result;
    } catch (err) {

     if (err.code === '23503') { // Foreign key violation code
      throw {
        success: false,
        error: 'CANNOT_DELETE_RELATED_RECORDS_EXIST',
         message: 'لا يمكن الحذف بسبب وجود عناصر مرتبطة بهذا الطبق'
      };
    }


      console.error("Error in delete:", err);
      throw err;
    }
  },
 
  // Link dish to a category
  linkCategory: async (dishId, categoryId) => {
    const query = sql`
      INSERT INTO dish_categories (dish_id, category_id)
      VALUES (${dishId}, ${categoryId})
    `;

    try {
      const result = await query;
      return result.rowCount;
    } catch (err) {
      console.error(`❌ Error linking dish ${dishId} with category ${categoryId}:`, err);
      throw new Error("فشل ربط الطبق بالفئة، تأكد من أن الفئة موجودة.");
    }
  }
};

module.exports = Dish;

