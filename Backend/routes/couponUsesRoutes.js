const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// المسار لتطبيق الكوبون
router.post('/', couponController.applyCoupon);

// أي مسار آخر إذا أردت إضافته مستقبلاً مثل
// router.get('/list', couponController.getAllCoupons);
// router.get('/details/:id', couponController.getCouponDetails);

module.exports = router;
