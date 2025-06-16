const sql = require("../config/db");
const connection = require("../config/db");

class DistinctiveDishModel {
  // الحصول على جميع الأطباق المميزة النشطة
  static async getAllDishesByActivity() {
    const [rows] = await connection.promise().query(`
                SELECT * 
                FROM distinctive_dishes 
            `);

    const active = [];
    const inactive = [];

    for (const row of rows) {
      const isCurrentlyActive =
        row.is_active === 1 &&
        (!row.end_date || new Date(row.end_date) >= new Date());

      if (isCurrentlyActive) {
        inactive.push(row);
      } else {
        active.push(row);
      }
    }

    return {
      active,
      inactive,
    };
  }

  static async getMostOrderedDishes() {
    try {
      const result = sql`
      SELECT
      oi.dish_id,
      d.name,
      SUM(oi.quantity)        AS total_qty,
      COUNT(DISTINCT oi.order_id) AS orders_count,
      d.image_path,
      d.price,
      d.description
      FROM order_items AS oi
      JOIN dishes        AS d  ON d.id = oi.dish_id
      GROUP BY oi.dish_id, d.name, d.image_path, d.price, d.description, d.image_path, d.price, d.description
      ORDER BY total_qty DESC
      LIMIT 3;
      `;

      return result;
    } catch (err) {
      console.error("❌ Error fetching top dishes:", err);
      throw err;
    }
  }

  static async getActiveDishesOnly() {
    const [rows] = await connection.promise().query(`
                 SELECT 
        dd.*, 
        d.name, 
        d.description,
        d.price,
        d.image_path,
        AVG(r.rating) AS average_rating
      FROM 
        distinctive_dishes dd
      JOIN 
        dishes d ON dd.dish_id = d.id
      LEFT JOIN 
        reviews r ON d.id = r.dish_id
      WHERE 
        dd.is_active = 1 
        AND (dd.end_date IS NULL OR dd.end_date >= NOW())
      GROUP BY 
        dd.id
      ORDER BY 
        dd.featured_order ASC
            `);

    return rows;
  }

  // إضافة طبق مميز
  static async addDish(dishData) {
    try {
      const [result] = await connection
        .promise()
        .query("INSERT INTO distinctive_dishes SET ?", dishData);

      return {
        success: true,
        message: "Dish added successfully to distinctive_dishes.",
        insertId: result.insertId,
      };
    } catch (error) {
      // نحاول نوضح سبب الخطأ قدر الإمكان
      let userMessage = "An error occurred while adding the dish.";

      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        userMessage =
          "Cannot add dish: dish_id does not exist in dishes table.";
      } else if (error.code === "ER_DUP_ENTRY") {
        userMessage = "This dish is already marked as distinctive.";
      }

      return {
        success: false,
        message: userMessage,
        error: error.message,
      };
    }
  }

  // تحديث طبق مميز
  static async updateDish(id, updates) {
    await connection
      .promise()
      .query("UPDATE distinctive_dishes SET ? WHERE id = ?", [updates, id]);
  }

  // حذف طبق مميز
  static async deleteDish(id) {
    await connection
      .promise()
      .query("DELETE FROM distinctive_dishes WHERE id = ?", [id]);
  }
}

module.exports = DistinctiveDishModel;
