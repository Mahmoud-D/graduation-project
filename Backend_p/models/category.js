const sql = require("../config/db"); 


exports.getAll = async () => {
  try {
    const query = sql`
      SELECT 
        c.id AS category_id, 
        c.name AS category_name, 
        c.description AS description, 
        COUNT(dc.dish_id) AS dish_count
      FROM 
        categories c
      LEFT JOIN 
        dish_categories dc ON c.id = dc.category_id
      GROUP BY 
        c.id
    `;
    return query; 

  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    throw err; 

  }
};

exports.create = async (name, description) => {
  try {
    const query = sql`
      INSERT INTO categories (name, description) 
      VALUES (${name}, ${description}) 
      RETURNING id
    `;
    const result = await query;
    return { id: result[0].id, name, description };

  } catch (err) {
    console.error("❌ Error creating category:", err);
    throw err;
  }
};


exports.update = async (id, name, description) => {
  try {
    const query = sql`
      UPDATE categories 
      SET name = ${name}, description = ${description} 
      WHERE id = ${id}
      RETURNING id, name, description
    `;
    const result = await query;
    if (result.length === 0) return null; 
    return result[0]; 
  } catch (err) {
    console.error("❌ Error updating category:", err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const query = sql`
      DELETE FROM categories WHERE id = ${id} RETURNING id
    `;
    const result = await query;
    if (result.length === 0) return null; 
    return true; 
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    throw err;
  }
};

exports.getstatsCategories = async () => {
  try {
    const query = sql`
       SELECT name, COUNT(*) AS count
  FROM categories
  GROUP BY name
  ORDER BY count DESC;
    `;
    const result = await query;

    return result;
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    throw err;
  }
};





 