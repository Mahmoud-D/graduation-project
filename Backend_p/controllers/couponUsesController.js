const couponUsesModel = require('../models/couponUses');

const useCoupon = async (req, res) => {
    const { couponId, orderId } = req.body;
    const userId = req.user.id;  
    
    // The current user from the token

    try {

        // Check if the coupon exists and is valid
        const coupon = await couponUsesModel.getCouponById(couponId);
        if (!coupon) {
            return res.status(404).json({ message: "الكوبون غير موجود أو منتهي" });
        }

        // Check how many times the user has used this coupon
        const userUsageCount = await couponUsesModel.checkUserCouponUsage(userId, couponId);
        if (userUsageCount >= coupon.user_max_uses) {
            return res.status(400).json({ message: "لقد وصلت إلى الحد الأقصى لاستخدام هذا الكوبون" });
        }

        // Check the total usage count of the coupon
        const couponUsageCount = await couponUsesModel.checkCouponTotalUsage(couponId);
        if (couponUsageCount >= coupon.max_uses) {
            return res.status(400).json({ message: "تم الوصول إلى الحد الأقصى لاستخدام هذا الكوبون" });
        }

        // Add a new usage record for this coupon
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
