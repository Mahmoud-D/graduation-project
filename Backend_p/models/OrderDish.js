// 4. إنشاء موديل OrderDish (جدول ربط الأطباق بالطلبات)

// models/OrderDish.js
// models/OrderDish.js
// models/OrderDish.js

const sql = require('../config/db');

const OrderDish = {

  // ✅ إضافة طبق واحد للطلب
  addDishToOrder: async (orderId, dishId, quantity) => {
    try {
      const result = await sql`
        INSERT INTO order_dishes (order_id, dish_id, quantity)
        VALUES (${orderId}, ${dishId}, ${quantity})
        RETURNING id
      `;
      return result[0].id;
    } catch (err) {
      console.error('❌ Error inserting dish to order:', err);
      throw {
        customMessage: 'حدث خطأ أثناء إضافة الطبق للطلب',
        errorCode: err.code || 'db_error',
        statusCode: 500
      };
    }
  },

  // ✅ جلب كل الأطباق المرتبطة بطلب
  getByOrderId: async (orderId) => {
    try {
      const result = await sql`
        SELECT * FROM order_dishes WHERE order_id = ${orderId}
      `;
      return result;
    } catch (err) {
      console.error('❌ Error getting order dishes:', err);
      throw {
        customMessage: 'حدث خطأ أثناء جلب أطباق الطلب',
        errorCode: err.code || 'db_error',
        statusCode: 500
      };
    }
  },

  // ✅ حذف الأطباق المرتبطة بطلب معين
  deleteByOrderId: async (orderId) => {
    try {
      const result = await sql`
        DELETE FROM order_dishes WHERE order_id = ${orderId}
      `;
      return result.count; // عدد الصفوف المحذوفة
    } catch (err) {
      console.error('❌ Error deleting order dishes:', err);
      throw {
        customMessage: 'حدث خطأ أثناء حذف أطباق الطلب',
        errorCode: err.code || 'db_error',
        statusCode: 500
      };
    }
  }

};

module.exports = OrderDish;
