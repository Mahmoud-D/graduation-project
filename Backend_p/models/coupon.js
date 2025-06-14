const sql = require('../config/db');

// إنشاء كوبون
const createCoupon = async (couponData) => {
    const { code, discount_type, discount_value, min_order, start_date, end_date, max_uses } = couponData;
    const query = `
      INSERT INTO coupons (code, discount_type, discount_value, min_order, start_date, end_date, max_uses)
      VALUES (${sql.val(code)}, ${sql.val(discount_type)}, ${sql.val(discount_value)}, ${sql.val(min_order)}, ${sql.val(start_date)}, ${sql.val(end_date)}, ${sql.val(max_uses)})
    `;
    const result = await sql.query(query);
    return result;
};

// استرجاع جميع الكوبونات أو كوبون معين
const getCoupons = async (couponCode) => {
    const query = couponCode
      ? `SELECT id FROM coupons WHERE code = ${sql.val(couponCode)}`
      : `SELECT id FROM coupons`;
    const result = await sql.query(query);
    return result.length > 0 ? result[0].id : null;
};

// استرجاع الكوبونات حسب الفلتر
const getCouponsByFilter = async (code) => {
    try {
        let result;
        if (code) {
            result = await sql`
                SELECT * FROM coupons 
                WHERE code LIKE ${'%' + code + '%'} 
                AND is_active = TRUE
            `;
        } else {
            result = await sql`
                SELECT * FROM coupons 
                WHERE is_active = TRUE
            `;
        }
        return result;
    } catch (error) {
        console.error("Error while fetching filtered coupons:", error);
        throw error;
    }
};

// استرجاع كوبون حسب ID
const getCouponById = async (id) => {
    const result = await sql`SELECT * FROM coupons WHERE id = ${id}`;
    return result;
};

// تحديث كوبون
const updateCoupon = async (id, couponData) => {
    const { code, discount_type, discount_value, min_order, start_date, end_date, max_uses, is_active } = couponData;
    const query = `
      UPDATE coupons 
      SET code = ${sql.val(code)}, discount_type = ${sql.val(discount_type)}, discount_value = ${sql.val(discount_value)}, 
          min_order = ${sql.val(min_order)}, start_date = ${sql.val(start_date)}, end_date = ${sql.val(end_date)}, 
          max_uses = ${sql.val(max_uses)}, is_active = ${sql.val(is_active)}
      WHERE id = ${sql.val(id)}
    `;
    await sql.query(query);
};

// حذف كوبون
const deleteCoupon = async (id) => {
    const query = `DELETE FROM coupons WHERE id = ${sql.val(id)}`;
    await sql.query(query);
};

// الحصول على عدد استخدامات الكوبون
const getCouponUses = async (couponId) => {
    const query = `SELECT COUNT(*) as count FROM coupon_uses WHERE coupon_id = ${sql.val(couponId)}`;
    const result = await sql.query(query);
    return result[0].count;
};

// الحصول على عدد استخدامات الكوبون من قبل مستخدم معين
const getUserCouponUses = async (couponId, userId) => {
    const query = `SELECT COUNT(*) as count FROM coupon_uses WHERE coupon_id = ${sql.val(couponId)} AND user_id = ${sql.val(userId)}`;
    const result = await sql.query(query);
    return result[0].count;
};

// إضافة كوبون إلى الطلب (جدول coupon_uses)
const addCouponToOrder = (couponId, userId, orderId) => {
    const useDate = new Date(); // تاريخ ووقت الاستخدام الحالي
    const query = `
      INSERT INTO coupon_uses (coupon_id, user_id, order_id, use_date)
      VALUES (${sql.val(couponId)}, ${sql.val(userId)}, ${sql.val(orderId)}, ${sql.val(useDate)})
    `;
    return sql.query(query);
};

// تطبيق الكوبون على الطلب
const applyCouponToOrder = (orderId, couponId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // إضافة سجل إلى جدول coupon_uses
            await sql.query(`
              INSERT INTO coupon_uses (coupon_id, user_id, order_id, use_date)
              VALUES (${sql.val(couponId)}, ${sql.val(userId)}, ${sql.val(orderId)}, NOW())
            `);

            // تحديث جدول الكوبونات لزيادة العدد الحالي للاستخدامات
            await sql.query(`
              UPDATE coupons SET current_uses = current_uses + 1 WHERE id = ${sql.val(couponId)}
            `);

            resolve("Coupon applied successfully");
        } catch (err) {
            console.error("Error applying coupon to order:", err);
            reject("Error applying coupon to order: " + err.message);
        }
    });
};

// جلب الكوبون حسب الكود
const getCouponByCode = async (couponCode, userId) => {
    const query = `
      SELECT * FROM coupons 
      WHERE code = ${sql.val(couponCode)} AND is_active = 1 AND start_date <= NOW() AND end_date >= NOW()}
    `;
    const result = await sql.query(query);
    
    if (result.length === 0) {
        return null; // الكوبون غير موجود أو انتهت صلاحيته
    }

    const coupon = result[0];

    // التحقق من أن الكوبون لم يتجاوز الحد الأقصى لاستخدامه
    if (coupon.current_uses >= coupon.max_uses) {
        return "Coupon limit reached"; // إذا تم الوصول للحد الأقصى للاستخدام
    }

    // التحقق من أن المستخدم لم يتجاوز الحد الأقصى لاستخدامه لهذا الكوبون
    const userResults = await sql.query(`
      SELECT COUNT(*) AS userUses FROM coupon_uses WHERE coupon_id = ${sql.val(coupon.id)} AND user_id = ${sql.val(userId)}
    `);

    if (userResults[0].userUses >= coupon.user_max_uses) {
        return "User has exceeded coupon usage limit"; // إذا تم تجاوز الحد الأقصى لاستخدام الكوبون
    }

    return coupon; // الكوبون صالح ويمكن استخدامه
};

module.exports = {
    createCoupon,
    getCoupons,
    getCouponsByFilter,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    getCouponUses,
    getUserCouponUses,
    addCouponToOrder,
    applyCouponToOrder,
    getCouponByCode
};
