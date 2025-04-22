const couponUsesModel = require('../models/couponUses');
 
// إنشاء استخدام للكوبون
const useCoupon = async (req, res) => {
    const { couponId, orderId } = req.body;
    const userId = req.user.id;  // المستخدم الحالي من التوكن

    try {
        // تحقق من وجود الكوبون وصلاحيته
        const coupon = await couponUsesModel.getCouponById(couponId);
        if (!coupon) {
            return res.status(404).json({ message: "الكوبون غير موجود أو منتهي" });
        }

        // تحقق من عدد الاستخدامات للمستخدم على الكوبون
        const userUsageCount = await couponUsesModel.checkUserCouponUsage(userId, couponId);
        if (userUsageCount >= coupon.user_max_uses) {
            return res.status(400).json({ message: "لقد وصلت إلى الحد الأقصى لاستخدام هذا الكوبون" });
        }

        // تحقق من الاستخدامات الكلية للكوبون
        const couponUsageCount = await couponUsesModel.checkCouponTotalUsage(couponId);
        if (couponUsageCount >= coupon.max_uses) {
            return res.status(400).json({ message: "تم الوصول إلى الحد الأقصى لاستخدام هذا الكوبون" });
        }

        // إضافة استخدام جديد للكوبون
        await couponUsesModel.addCouponUse(userId, couponId, orderId);

        return res.status(200).json({ message: "تم استخدام الكوبون بنجاح" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ في النظام" });
    }
};

module.exports = {
    useCoupon,
};
