const sql = require('../config/db');

class Promotion {
  // استرجاع العروض الترويجية النشطة والتي تكون في فترة صالحة
  static async findAllActive() {
    try {
      const rows = await sql`
        SELECT * FROM promotions 
        WHERE is_active = TRUE 
        AND NOW() BETWEEN start_date AND end_date
      `;
      return rows;
    } catch (err) {
      console.error("Error in findAllActive:", err);
      throw err;
    }
  }
  static async getAllPromotions() {
    try {
      const rows = await sql`
        SELECT * FROM promotions 
         
      `;
      return rows;
    } catch (err) {
      console.error("Error in findAllActive:", err);
      throw err;
    }
  }

  // استرجاع عرض ترويجي بناءً على الـ ID
  static async findById(id) {
    try {
      const rows = await sql`
        SELECT * FROM promotions WHERE id = ${id}
      `;
      return rows[0];
    } catch (err) {
      console.error("Error in findById:", err);
      throw err;
    }
  }

  // إنشاء عرض ترويجي جديد
  static async create(data) {
    console.log("data", data);
    const { dish_id, discount_percentage, start_date, end_date } = data;
    try {
      const result = await sql`
        INSERT INTO promotions (dish_id, discount_percentage, start_date, end_date, is_active) 
        VALUES (${dish_id}, ${discount_percentage}, ${start_date}, ${end_date}, TRUE)
        RETURNING id
      `;
      return this.findById(result[0].id);
    } catch (err) {
      console.error("Error in create promotion:", err);
      throw err;
    }
  }

  // تحديث عرض ترويجي موجود
  static async update(id, data) {
    const { dish_id, discount_percentage, start_date, end_date, is_active } = data;
    try {
      await sql`
        UPDATE promotions
        SET dish_id = ${dish_id},
            discount_percentage = ${discount_percentage},
            start_date = ${start_date},
            end_date = ${end_date},
            is_active = ${is_active}
        WHERE id = ${id}
      `;
      return this.findById(id);
    } catch (err) {
      console.error("Error in update promotion:", err);
      throw err;
    }
  }

  // تبديل حالة العرض الترويجي (تفعيل أو إلغاء تفعيل)
  static async toggleStatus(id) {
    try {
      const promo = await this.findById(id);
      const newStatus = !promo.is_active;
      await sql`
        UPDATE promotions
        SET is_active = ${newStatus}
        WHERE id = ${id}
      `;
      return this.findById(id);
    } catch (err) {
      console.error("Error in toggleStatus promotion:", err);
      throw err;
    }
  }

  // حذف عرض ترويجي بناءً على الـ ID
  static async delete(id) {
    try {
      await sql`
        DELETE FROM promotions WHERE id = ${id}
      `;
      return true;
    } catch (err) {
      console.error("Error in delete promotion:", err);
      throw err;
    }
  }

  // استرجاع الأطباق التي تحتوي على عروض ترويجية نشطة
  static async getDishesWithPromotions() {
    try {
      const dishes = await sql`
        SELECT d.*, p.discount_percentage 
        FROM dishes d
        JOIN promotions p ON d.id = p.dish_id
        WHERE p.is_active = TRUE
        AND NOW() BETWEEN p.start_date AND p.end_date
      `;
      return dishes;
    } catch (err) {
      console.error("Error in getDishesWithPromotions:", err);
      throw err;
    }
  }
}

module.exports = Promotion;
