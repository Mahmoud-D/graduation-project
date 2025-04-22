const connection = require('../config/db');

// إنشاء كوبون
const createCoupon = async (couponData) => {
    const { code, discount_type, discount_value, min_order, start_date, end_date, max_uses } = couponData;
    const query = 'INSERT INTO coupons (code, discount_type, discount_value, min_order, start_date, end_date, max_uses) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.promise().query(query, [code, discount_type, discount_value, min_order, start_date, end_date, max_uses]);
    return result;
};

// استرجاع جميع الكوبونات أو كوبون معين
const getCoupons = async (couponCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM coupons WHERE code = ?", // تعديل: استخدم 'code' بدلًا من 'coupon_code'
      [couponCode],
      (err, results) => {
        if (err) {
          console.error("Error fetching coupon:", err);
          return reject(err);
        }
        if (results.length > 0) {
          resolve(results[0].id);  // إعادة id الكوبون
        } else {
          resolve(null);  // في حالة عدم وجود الكوبون
        }
      }
    );
  });
};



const getCouponsByFilter = async (code) => {
  try {
    // إذا كان code غير موجود أو فارغ، نرجع كل الكوبونات
    const query = code ? 
      `SELECT * FROM coupons WHERE code LIKE ? AND is_active = 1` : 
      `SELECT * FROM coupons WHERE is_active = 1`;

    const values = code ? [`%${code}%`] : [];

    const result = await connection.promise().query(query, values);

    if (!Array.isArray(result)) throw new Error('Invalid result from DB');

    const [rows] = result;
    return rows; // هنا بنرجع كل النتائج
  } catch (error) {
    console.error("Error: حدث خطأ أثناء فلترة الكوبونات", error);
    throw error;
  }
};


      

const getCouponById = async (id) => {
    const query = 'SELECT * FROM coupons WHERE id = ?';
    const result = await connection.promise().query(query, [id]);
    return result; // هترجع أول نتيجة أو undefined
};

// تحديث كوبون
const updateCoupon = async (id, couponData) => {
    const { code, discount_type, discount_value, min_order, start_date, end_date, max_uses, is_active } = couponData;
    const query = 'UPDATE coupons SET code = ?, discount_type = ?, discount_value = ?, min_order = ?, start_date = ?, end_date = ?, max_uses = ?, is_active = ? WHERE id = ?';
    await connection.promise().query(query, [code, discount_type, discount_value, min_order, start_date, end_date, max_uses, is_active, id]);
};

 const deleteCoupon = async (id) => {
    const query = 'DELETE FROM coupons WHERE id = ?';
    await connection.promise().query(query, [id]);
};


 
 
  

  const getCouponUses = async (couponId) => {
    try {
      const [rows] = await connection.promise().query(
        `SELECT COUNT(*) as count FROM coupon_uses WHERE coupon_id = ?`,
        [couponId]
      );
      return rows[0].count;
    } catch (error) {
      console.error("Error: حدث خطأ أثناء حساب استخدامات الكوبون", error);
      throw error;
    }
  };

  const getUserCouponUses = async (couponId, userId) => {
    try {
      const [rows] = await connection.promise().query(
        `SELECT COUNT(*) as count FROM coupon_uses WHERE coupon_id = ? AND user_id = ?`,
        [couponId, userId]
      );
      return rows[0].count;
    } catch (error) {
      console.error("Error: حدث خطأ أثناء حساب استخدامات المستخدم للكوبون", error);
      throw error;
    }
  };

  // إضافة الكوبون إلى قاعدة البيانات (جدول coupon_uses)
const addCouponToOrder = (couponId, userId, orderId) => {
  return new Promise((resolve, reject) => {
    const useDate = new Date(); // تاريخ ووقت الاستخدام الحالي
    const sql =
      "INSERT INTO coupon_uses (coupon_id, user_id, order_id, use_date) VALUES (?, ?, ?, ?)";
    
    connection.promise()
      .query(sql, [couponId, userId, orderId, useDate]) // تنفيذ الاستعلام
      .then((result) => {
        resolve(result.insertId); // إرجاع ID السطر الذي تم إدخاله
      })
      .catch((err) => {
        reject("Error applying coupon to order: " + err.message); // التعامل مع الأخطاء
      });
  });
};


const applyCouponToOrder = (orderId, couponId, userId) => {
  return new Promise((resolve, reject) => {
    // إضافة سجل إلى جدول coupon_uses
    connection.query(
      `INSERT INTO coupon_uses (coupon_id, user_id, order_id, use_date) VALUES (?, ?, ?, NOW())`,
      [couponId, userId, orderId],
      (err, result) => {
        if (err) {
          console.error("Error applying coupon to order:", err);
          return reject("Error applying coupon to order: " + err.message);
        }

        // تحديث جدول الكوبونات لزيادة العدد الحالي للاستخدامات
        connection.query(
          `UPDATE coupons SET current_uses = current_uses + 1 WHERE id = ?`,
          [couponId],
          (err, updateResult) => {
            if (err) {
              console.error("Error updating coupon uses:", err);
              return reject("Error updating coupon uses: " + err.message);
            }

            resolve(result);  // الكوبون تم تطبيقه بنجاح
          }
        );
      }
    );
  });
};



const getCouponByCode = (couponCode, userId) => {
  return new Promise((resolve, reject) => {
    // جلب الكوبون من قاعدة البيانات
    connection.query(
      `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND start_date <= NOW() AND end_date >= NOW()`,
      [couponCode],
      (err, results) => {
        if (err) {
          console.error("Error fetching coupon:", err);
          return reject(err);
        }
        if (results.length === 0) {
          return resolve(null);  // في حالة عدم وجود الكوبون أو انتهت صلاحيته
        }

        const coupon = results[0];

        // التحقق من أن الكوبون لم يتجاوز الحد الأقصى لاستخدامه
        if (coupon.current_uses >= coupon.max_uses) {
          return resolve("Coupon limit reached");  // إذا تم الوصول للحد الأقصى للاستخدام
        }

        // التحقق من أن المستخدم لم يتجاوز الحد الأقصى لاستخدامه لهذا الكوبون
        connection.query(
          `SELECT COUNT(*) AS userUses FROM coupon_uses WHERE coupon_id = ? AND user_id = ?`,
          [coupon.id, userId],
          (err, userResults) => {
            if (err) {
              console.error("Error checking user coupon usage:", err);
              return reject(err);
            }
            if (userResults[0].userUses >= coupon.user_max_uses) {
              return resolve("User has exceeded coupon usage limit");
            }

            resolve(coupon);  // الكوبون صالح ويمكن استخدامه
          }
        );
      }
    );
  });
};



  module.exports = {
    getCouponUses,
    getUserCouponUses,
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    getCouponById ,
    addCouponToOrder,
    getCouponsByFilter,
    applyCouponToOrder,
    getCouponByCode
};
