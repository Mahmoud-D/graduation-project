const db = require('../config/db'); // تأكد من الاتصال بقاعدة البيانات

// إضافة استخدام جديد للكوبون
const addCouponUse = async (userId, couponId, orderId) => {
    try {
        const query = `
            INSERT INTO coupon_uses (user_id, coupon_id, order_id, use_date)
            VALUES (?, ?, ?, NOW());
        `;
        await db.query(query, [userId, couponId, orderId]);
    } catch (error) {
        throw new Error('حدث خطأ أثناء إضافة استخدام الكوبون');
    }
};

// التحقق من عدد الاستخدامات للمستخدم على الكوبون المحدد
const checkUserCouponUsage = async (userId, couponId) => {
    try {
        const query = `
            SELECT COUNT(*) AS usageCount
            FROM coupon_uses
            WHERE user_id = ? AND coupon_id = ?
        `;
        const [rows] = await db.query(query, [userId, couponId]);
        return rows[0].usageCount;
    } catch (error) {
        throw new Error('حدث خطأ أثناء التحقق من عدد الاستخدامات');
    }
};

// التحقق من الاستخدامات الكلية للكوبون
const checkCouponTotalUsage = async (couponId) => {
    try {
        const query = `
            SELECT COUNT(*) AS usageCount
            FROM coupon_uses
            WHERE coupon_id = ?
        `;
        const [rows] = await db.query(query, [couponId]);
        return rows[0].usageCount;
    } catch (error) {
        throw new Error('حدث خطأ أثناء التحقق من الاستخدامات الكلية للكوبون');
    }
};

// التحقق من صلاحية الكوبون وتواريخه
const getCouponById = async (couponId) => {
    try {
        const query = `
            SELECT * FROM coupons WHERE id = ? AND is_active = 1 AND start_date <= NOW() AND end_date >= NOW();
        `;
        const [rows] = await db.query(query, [couponId]);
        return rows[0];
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
