const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post(
  "/",
  verifyToken,
  checkRole(["user"]),
  reviewController.createReview
);
router.get("/dish/:dishId", reviewController.getReviewsByDish);

module.exports = router;
