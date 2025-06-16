const db = require('../config/db');

// إضافة استخدام جديد للكوبون
const addCouponUse = async (userId, couponId, orderId) => {
  try {
    await db`
      INSERT INTO coupon_uses (user_id, coupon_id, order_id, use_date)
      VALUES (${userId}, ${couponId}, ${orderId}, NOW());
    `;
  } catch (error) {
    throw new Error('حدث خطأ أثناء إضافة استخدام الكوبون');
  }
};

// التحقق من عدد الاستخدامات للمستخدم على الكوبون المحدد
const checkUserCouponUsage = async (userId, couponId) => {
  try {
    const result = await db`
      SELECT COUNT(*) AS usage_count
      FROM coupon_uses
      WHERE user_id = ${userId} AND coupon_id = ${couponId};
    `;
    return parseInt(result[0].usage_count);
  } catch (error) {
    throw new Error('حدث خطأ أثناء التحقق من عدد الاستخدامات');
  }
};

// التحقق من الاستخدامات الكلية للكوبون
const checkCouponTotalUsage = async (couponId) => {
  try {
    const result = await db`
      SELECT COUNT(*) AS usage_count
      FROM coupon_uses
      WHERE coupon_id = ${couponId};
    `;
    return parseInt(result[0].usage_count);
  } catch (error) {
    throw new Error('حدث خطأ أثناء التحقق من الاستخدامات الكلية للكوبون');
  }
};

// التحقق من صلاحية الكوبون وتواريخه
const getCouponById = async (couponId) => {
  try {
    const result = await db`
      SELECT * 
      FROM coupons 
      WHERE id = ${couponId}
        AND is_active = TRUE 
        AND start_date <= NOW() 
        AND end_date >= NOW();
    `;
    return result[0]; // بيرجع أول كوبون لو موجود
  } catch (error) {
    throw new Error('حدث خطأ أثناء التحقق من صلاحية الكوبون');
  }
};

module.exports = {
  addCouponUse,
  checkUserCouponUsage,
  checkCouponTotalUsage,
  getCouponById,
};
