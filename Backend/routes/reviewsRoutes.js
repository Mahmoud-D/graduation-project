const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/auth');

router.post('/',verifyToken, reviewController.createReview);
router.get('/dish/:dishId', reviewController.getReviewsByDish);

module.exports = router;
