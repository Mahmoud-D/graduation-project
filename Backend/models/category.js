const connection = require('../config/db'); // تأكد من إعداد قاعدة البيانات بشكل صحيح

// جلب جميع الفئات
exports.getAll = async () => {
  const [rows] = await connection.promise().query(`
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
  `);
  return rows;
};


// إضافة فئة جديدة
exports.create = async (name, description) => {
  const [result] = await connection.promise().query(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [name, description]
  );
  return { id: result.insertId, name, description };
};

// تعديل فئة
exports.update = async (id, name, description) => {
  const [result] = await connection.promise().query(
    "UPDATE categories SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
  if (result.affectedRows === 0) return null;
  return { id, name, description };
};

// حذف فئة
exports.delete = async (id) => {
  const [result] = await connection.promise().query(
    "DELETE FROM categories WHERE id = ?",
    [id]
  );
  if (result.affectedRows === 0) return null;
  return true;
};
