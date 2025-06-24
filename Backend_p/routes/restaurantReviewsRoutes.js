const express = require('express');
const router = express.Router();
const restaurantReviewsController = require('../controllers/restaurantReviewsController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/',verifyToken, checkRole(["user"]) ,restaurantReviewsController.createRestaurantReview);
router.get('/user', restaurantReviewsController.getRestaurantReviewsByUserId);

module.exports = router;
