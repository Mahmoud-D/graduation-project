const Review = require("../models/Review");

// POST /api/reviews
const createReview = async (req, res) => {
  const { dish_id, rating, comment } = req.body;

  if (!req.user.id || !dish_id || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newReview = await Review.create({
      user_id: req.user.id,
      dish_id,
      rating,
      comment,
    });
    return res
      .status(201)
      .json({ message: "Review created", review: newReview });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating review" });
  }
};

// GET /api/reviews/dish/:dishId
const getReviewsByDish = async (req, res) => {
  const { dishId } = req.params;

  try {
    const reviews = await Review.getByDishId(dishId);
    return res.status(200).json({ reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching reviews" });
  }
};

module.exports = {
  createReview,
  getReviewsByDish,
};
