const db = require('../config/db');
 
class Promotion {
  static async findAllActive() {
    const [rows] = await db.promise().query(`
      SELECT * FROM promotions 
      WHERE is_active = TRUE 
      AND NOW() BETWEEN start_date AND end_date
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.promise().query('SELECT * FROM promotions WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { dish_id, discount_percentage, start_date, end_date } = data;
    const [result] = await db.promise().query(
      'INSERT INTO promotions (dish_id, discount_percentage, start_date, end_date, is_active) VALUES (?, ?, ?, ?, TRUE)',
      [dish_id, discount_percentage, start_date, end_date]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const { dish_id, discount_percentage, start_date, end_date, is_active } = data;
    await db.promise().query(
      'UPDATE promotions SET dish_id = ?, discount_percentage = ?, start_date = ?, end_date = ?, is_active = ? WHERE id = ?',
      [dish_id, discount_percentage, start_date, end_date, is_active, id]
    );
    return this.findById(id);
  }

  static async toggleStatus(id) {
    const promo = await this.findById(id);
    await db.promise().query('UPDATE promotions SET is_active = ? WHERE id = ?', [!promo.is_active, id]);
    return this.findById(id);
  }

  static async delete(id) {
    await db.promise().query('DELETE FROM promotions WHERE id = ?', [id]);
    return true;
  }

  static async getDishesWithPromotions() {
    const [dishes] = await db.promise().query(`
      SELECT d.*, p.discount_percentage 
      FROM dishes d
      JOIN promotions p ON d.id = p.dish_id
      WHERE p.is_active = TRUE
      AND NOW() BETWEEN p.start_date AND p.end_date
    `);
    return dishes;
  }
}

module.exports = Promotion;