const express = require('express');
const router = express.Router();
const restaurantReviewsController = require('../controllers/restaurantReviewsController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/',verifyToken, checkRole(["admin"]) ,restaurantReviewsController.createRestaurantReview);
router.get('/user', verifyToken, checkRole(["admin"]),restaurantReviewsController.getRestaurantReviewsByUserId);

module.exports = router;
