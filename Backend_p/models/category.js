const sql = require('../config/db'); // استيراد الاتصال بقاعدة البيانات

// جلب جميع الفئات
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
    return query;  // العودة بالنتائج من الاستعلام
  } catch (err) {
    console.error('❌ Error fetching categories:', err);
    throw err;  // التعامل مع الخطأ إذا حدث
  }
};

// إضافة فئة جديدة
exports.create = async (name, description) => {
  try {
    const query = sql`
      INSERT INTO categories (name, description) 
      VALUES (${name}, ${description}) 
      RETURNING id
    `;
    const result = await query;
    return { id: result[0].id, name, description }; // إرجاع الـ id وبيانات الفئة الجديدة
  } catch (err) {
    console.error('❌ Error creating category:', err);
    throw err;
  }
};

// تعديل فئة
exports.update = async (id, name, description) => {
  try {
    const query = sql`
      UPDATE categories 
      SET name = ${name}, description = ${description} 
      WHERE id = ${id}
      RETURNING id, name, description
    `;
    const result = await query;
    if (result.length === 0) return null; // إذا لم يتم العثور على الفئة
    return result[0]; // إرجاع الفئة المعدلة
  } catch (err) {
    console.error('❌ Error updating category:', err);
    throw err;
  }
};

 exports.delete = async (id) => {
  try {
    const query = sql`
      DELETE FROM categories WHERE id = ${id} RETURNING id
    `;
    const result = await query;
    if (result.length === 0) return null; // إذا لم يتم العثور على الفئة
    return true; // النجاح في الحذف
  } catch (err) {
    console.error('❌ Error deleting category:', err);
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
    console.error('❌ Error deleting category:', err);
    throw err;
  }
};
