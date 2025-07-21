const couponModel = require("../models/coupon");


const createCoupon = async (req, res) => {
  const {
    code,
    discount_type,
    discount_value,
    min_order,
    start_date,
    end_date,
    max_uses,
    current_uses = 0, 
    is_active = 1, 
    user_max_uses = 1, 
  } = req.body;

  try {

// check if the coupon code unique

    const existingCoupon = await couponModel.getCoupons(code);
    if (existingCoupon && existingCoupon.length > 0) {
       return res.status(400).json({ message: "الكود المدخل موجود بالفعل" });
    }

    const result = await couponModel.createCoupon({
      code,
      discount_type,
      discount_value,
      min_order,
      start_date,
      end_date,
      max_uses,
      current_uses,
      is_active,
      user_max_uses,
    });

    res.status(201).json({
      message: "تم إنشاء الكوبون بنجاح",
      coupon_id: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "الكود المدخل موجود بالفعل" });
    }

    console.error("error", error);
    res
      .status(500)
      .json({
        message: "حدث خطأ في النظام أثناء إنشاء الكوبون",
        error: error.message,
      });
  }
};

const getCoupons = async (req, res) => {
  const { code } = req.params;

  try {
    const coupons = await couponModel.getCouponsByFilter(code);

    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ message: "الكوبون غير موجود" });
    }

    res.json(coupons);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "حدث خطأ في النظام أثناء استرجاع الكوبونات" });
  }
};

const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.getActiveCoupons();
    res.json(coupons);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "حدث خطأ في النظام أثناء استرجاع الكوبونات" });
  }
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;

  const {
    code,
    discount_type,
    discount_value,
    min_order,
    start_date,
    end_date,
    max_uses,
    is_active,
  } = req.body;

  try {
    const existingCoupon = await couponModel.getCouponById(id); 
    if (!existingCoupon) {
      return res.status(404).json({ message: "الكوبون غير موجود" });
    }

     await couponModel.updateCoupon(id, {
      code,
      discount_type,
      discount_value,
      min_order,
      start_date,
      end_date,
      max_uses,
      is_active,
    });

    res.json({ message: "تم تحديث الكوبون بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ في النظام أثناء تحديث الكوبون" });
  }
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const existingCoupon = await couponModel.getCouponById(id);
    if (existingCoupon.length === 0) {
      return res.status(404).json({ message: "الكوبون غير موجود" });
    }

     await couponModel.deleteCoupon(id);

    res.json({ message: "تم حذف الكوبون بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ في النظام أثناء حذف الكوبون" });
  }
};

 const applyCoupon = async (req, res) => {
  const { coupon_code, user_id, order_id } = req.body;

  if (!coupon_code || !user_id || !order_id) {
    return res.status(400).json({ message: "البيانات غير مكتملة" });
  }

  try {
    const coupon = await couponModel.getCoupons(coupon_code);

    if (!coupon || !coupon.id) {
      return res.status(400).json({ message: "الكوبون غير صالح" });
    }

    const now = new Date();
    if (now < new Date(coupon.start_date) || now > new Date(coupon.end_date)) {
      return res.status(400).json({ message: "الكوبون خارج فترة الصلاحية" });
    }

    const couponUses = await couponModel.getCouponUses(coupon.id);
    if (couponUses >= coupon.max_uses) {
      return res
        .status(400)
        .json({ message: "تم استخدام الكوبون أكثر من الحد المسموح به" });
    }

    const userUses = await couponModel.getUserCouponUses(coupon.id, user_id);
    if (userUses >= coupon.user_max_uses) {
      return res
        .status(400)
        .json({ message: "لقد تجاوزت الحد الأقصى لاستخدام هذا الكوبون" });
    }

     return res.status(200).json({
      message: "تم تطبيق الكوبون بنجاح",
      discount_value: coupon.discount_value,
      type: coupon.discount_type, 

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء تطبيق الكوبون" });
  }
};

const filterCoupons = async (req, res) => {
  const { code } = req.query;

  try {
    const coupons = await couponModel.getCouponsByFilter(code);

    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ message: "لا توجد كوبونات مطابقة" });
    }

    res.json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء فلترة الكوبونات" });
  }
};

 module.exports = {
  applyCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  filterCoupons,
  deleteCoupon,
  getActiveCoupons
};
