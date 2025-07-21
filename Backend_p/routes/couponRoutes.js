const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/', verifyToken, checkRole(['admin']), couponController.createCoupon);

 router.get('/', couponController.filterCoupons);

 router.get('/active', couponController.getActiveCoupons);
 
 router.get('/:code', couponController.getCoupons);
 
 
 router.put('/:id', verifyToken, checkRole(['admin']), couponController.updateCoupon);

 router.delete('/:id', verifyToken, checkRole(['admin']), couponController.deleteCoupon);

module.exports = router;
