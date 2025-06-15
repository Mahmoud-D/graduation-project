const sql = require("../config/db");

// إنشاء كوبون
const createCoupon = async (couponData) => {
  const {
    code,
    discount_value,
    min_order,
    start_date,
    end_date,
    max_uses,
    user_max_uses = 1, // لو مش جاي من الـ frontend
    is_active = true,
    current_uses = 0,
  } = couponData;

  const result = await sql`
      INSERT INTO coupons (
        code,
         discount_value,
        min_order,
        start_date,
        end_date,
        max_uses,
        user_max_uses,
        is_active,
        current_uses
      )
      VALUES (
        ${code},
         ${discount_value},
        ${min_order},
        ${start_date},
        ${end_date},
        ${max_uses},
        ${user_max_uses},
        ${is_active},
        ${current_uses}
      )
      RETURNING *;
    `;

  return result[0]; // بيرجع أول كوبون بعد الإدخال
};

const getCoupons = async (couponCode) => {
  let result;

  if (couponCode) {
    result = await sql`
        SELECT id FROM coupons WHERE code = ${couponCode}
      `;
  } else {
    result = await sql`
        SELECT id FROM coupons
      `;
  }

  return result.length > 0 ? result[0].id : null;
};

// ✅ 1. Get coupons by optional filter (code)
const getCouponsByFilter = async (code) => {
  try {
    const result = code
      ? await sql`SELECT * FROM coupons WHERE code ILIKE ${
          "%" + code + "%"
        } AND is_active = true`
      : await sql`SELECT * FROM coupons `;
    return result;
  } catch (error) {
    console.error("Error while fetching filtered coupons:", error);
    throw error;
  }
};

// ✅ 2. Get coupon by ID
const getCouponById = async (id) => {
  const result = await sql`SELECT * FROM coupons WHERE id = ${id}`;
  return result[0]; // رجع أول نتيجة بس
};

// ✅ 3. Update coupon
const updateCoupon = async (id, couponData) => {
  const {
    code,
    discount_value,
    min_order,
    start_date,
    end_date,
    max_uses,
    is_active,
  } = couponData;

  await sql`
      UPDATE coupons 
      SET code = ${code},
           discount_value = ${discount_value},
          min_order = ${min_order},
          start_date = ${start_date},
          end_date = ${end_date},
          max_uses = ${max_uses},
          is_active = ${is_active}
      WHERE id = ${id}
    `;
};

// ✅ 4. Delete coupon
const deleteCoupon = async (id) => {
  await sql`DELETE FROM coupons WHERE id = ${id}`;
};

// ✅ 5. Get total uses for a coupon
const getCouponUses = async (couponId) => {
  const result = await sql`
      SELECT COUNT(*) AS count FROM coupon_uses WHERE coupon_id = ${couponId}
    `;
  return Number(result[0].count);
};

// ✅ 6. Get total uses by user for a coupon
const getUserCouponUses = async (couponId, userId) => {
  const result = await sql`
      SELECT COUNT(*) AS count FROM coupon_uses 
      WHERE coupon_id = ${couponId} AND user_id = ${userId}
    `;
  return Number(result[0].count);
};

// ✅ 7. Add coupon to order
const addCouponToOrder = async (couponId, userId, orderId) => {
  const useDate = new Date();
  await sql`
      INSERT INTO coupon_uses (coupon_id, user_id, order_id, use_date)
      VALUES (${couponId}, ${userId}, ${orderId}, ${useDate})
    `;
};

// ✅ 8. Apply coupon to order
const applyCouponToOrder = async (orderId, couponId, userId) => {
  try {
    // 1. ربط الكوبون بالأوردر
    await sql`
      UPDATE orders 
      SET coupon_id = ${couponId}
      WHERE id = ${orderId} AND user_id = ${userId}
    `;

    // 2. تحديث عدد الاستخدامات
    await sql`
      UPDATE coupons 
      SET current_uses = current_uses + 1 
      WHERE id = ${couponId}
    `;

    return "Coupon applied successfully";
  } catch (err) {
    console.error("Error applying coupon to order:", err);
    throw new Error("Error applying coupon to order: " + err.message);
  }
};

// ✅ 9. Get coupon by code and validate limits
const getCouponByCode = async (couponCode, userId) => {
  const result = await sql`
      SELECT * FROM coupons 
      WHERE code = ${couponCode} 
        AND is_active = true 
        AND start_date <= NOW() 
        AND end_date >= NOW()
    `;

  if (result.length === 0) {
    throw new Error("الكوبون غير موجود");
  }

  const coupon = result[0];

  if (coupon.current_uses >= coupon.max_uses) {
    throw new Error("انتهت صلاحية هذا الكوبون");
  }

  // const userResult = await sql`
  //   SELECT COUNT(*) AS userUses FROM coupon_uses
  //   WHERE coupon_id = ${coupon.id} AND user_id = ${userId}
  // `;

  // if (Number(userResult[0].useruses) >= coupon.user_max_uses) {
  //   return "User has exceeded coupon usage limit";
  // }
  const userResult = await sql`
    SELECT COUNT(*) AS userUses
    FROM orders
    WHERE user_id = ${userId}
      AND coupon_id = ${coupon.id}
  `;

  if (Number(userResult[0].useruses) >= coupon.user_max_uses) {
    throw new Error(
      "لقد استخدمت هذا الكوبون من قبل، ولا يمكنك استخدامه مرة أخرى"
    );
  }

  return coupon;
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
  getCouponByCode,
};
