const sql = require('../config/db'); // استيراد الاتصال بقاعدة البيانات

exports.getAll = async () => {
  try {
    // نستخدم json_agg لتجميع كل الأطباق المرتبطة بكل عرض في مصفوفة JSON
    const query = sql`
      SELECT 
        o.*,
        COALESCE(
          (SELECT json_agg(d.*) 
           FROM dishes d
           JOIN offer_dishes od ON d.id = od.dish_id
           WHERE od.offer_id = o.id), 
          '[]'::json
        ) AS dishes
      FROM 
        offers o
      GROUP BY 
        o.id
      ORDER BY
        o.start_date DESC
    `;
    return query; 
  } catch (err) {
    console.error('❌ Error fetching offers:', err);
    throw err;
  }
};

/**
 * جلب عرض محدد بواسطة الـ ID مع الأطباق المرتبطة به
 */
exports.getById = async (id) => {
    try {
      const query = sql`
        SELECT 
          o.*,
          COALESCE(
            (SELECT json_agg(d.*) 
             FROM dishes d
             JOIN offer_dishes od ON d.id = od.dish_id
             WHERE od.offer_id = o.id), 
            '[]'::json
          ) AS dishes
        FROM 
          offers o
        WHERE 
          o.id = ${id}
        GROUP BY 
          o.id
      `;
      const result = await query;
      if (result.length === 0) return null; // إذا لم يتم العثور على العرض
      return result[0]; // إرجاع العرض المحدد
    } catch (err) {
      console.error(`❌ Error fetching offer with id ${id}:`, err);
      throw err;
    }
  };

exports.create = async (offerData, dishIds) => {
  try {
    const result = await sql.begin(async (sql) => {
      const newOffer = await sql`
        INSERT INTO offers ${sql(offerData, 'title', 'description', 'discount_percentage', 'start_date', 'end_date')}
        RETURNING *
      `;

      const offerId = newOffer[0].id;
      let linkedDishes = [];

      // 2. إذا كانت هناك أطباق لربطها، قم بإضافتها إلى جدول offer_dishes
      if (dishIds && dishIds.length > 0) {
        const dishLinks = dishIds.map(dishId => ({ offer_id: offerId, dish_id: dishId }));
        linkedDishes = await sql`
          INSERT INTO offer_dishes ${sql(dishLinks, 'offer_id', 'dish_id')}
          RETURNING dish_id
        `;
      }
      
      // إرجاع بيانات العرض الكاملة مع الأطباق المرتبطة
      return { ...newOffer[0], dishes: linkedDishes };
    });
    return result;
  } catch (err) {
    console.error('❌ Error creating offer:', err);
    throw err;
  }
};

/**
 * تعديل عرض موجود وتحديث الأطباق المرتبطة به
 * @param {number} id - رقم العرض
 * @param {object} offerData - بيانات العرض الجديدة
 * @param {Array<number>} dishIds - مصفوفة الأطباق الجديدة
 */
exports.update = async (id, offerData, dishIds) => {
  try {
    const result = await sql.begin(async (sql) => {
      // 1. تحديث بيانات العرض في جدول offers
      const updatedOffer = await sql`
        UPDATE offers SET ${sql(offerData, 'title', 'description', 'discount_percentage', 'start_date', 'end_date', 'is_active')}
        WHERE id = ${id}
        RETURNING *
      `;

      if (updatedOffer.length === 0) {
        // إذا لم يتم العثور على العرض، أوقف العملية
        throw new Error('Offer not found');
      }

      // 2. حذف كل الروابط القديمة للأطباق مع هذا العرض
      await sql`
        DELETE FROM offer_dishes WHERE offer_id = ${id}
      `;

      let linkedDishes = [];
      // 3. إضافة الروابط الجديدة إذا تم توفيرها
      if (dishIds && dishIds.length > 0) {
        const dishLinks = dishIds.map(dishId => ({ offer_id: id, dish_id: dishId }));
        linkedDishes = await sql`
          INSERT INTO offer_dishes ${sql(dishLinks, 'offer_id', 'dish_id')}
          RETURNING dish_id
        `;
      }

      return { ...updatedOffer[0], dishes: linkedDishes };
    });
    return result;
  } catch (err) {
    // التحقق من نوع الخطأ لإرجاع رسالة مناسبة
    if (err.message === 'Offer not found') return null;
    console.error(`❌ Error updating offer with id ${id}:`, err);
    throw err;
  }
};

/**
 * حذف عرض من قاعدة البيانات
 * @param {number} id - رقم العرض
 */
exports.delete = async (id) => {
  try {
    // سيتم حذف السجلات المرتبطة في offer_dishes تلقائيًا بسبب ON DELETE CASCADE
    const query = sql`
      DELETE FROM offers WHERE id = ${id} RETURNING id
    `;
    const result = await query;
    if (result.length === 0) return null; // إذا لم يتم العثور على العرض
    return true; // النجاح في الحذف
  } catch (err) {
    console.error(`❌ Error deleting offer with id ${id}:`, err);
    throw err;
  }
};
