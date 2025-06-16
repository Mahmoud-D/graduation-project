const RestaurantReview = require('../models/RestaurantReview');

// POST /api/restaurantReviews
const createRestaurantReview = async (req, res) => {
  const { rating, comment } = req.body;

  console.log(req.body);
  console.log(req.user);

  // we not add validation or check role in south middleware

  if (!req.user || !req.user.id || !comment || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newReview = await RestaurantReview.create({
      user_id: req.user.id,
      rating,
      comment
    });

    return res.status(201).json({ message: "Restaurant review created", review: newReview });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating restaurant review" });
  }
};

// GET /api/restaurantReviews/user
const getRestaurantReviewsByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const reviews = await RestaurantReview.getByUserId(userId);

    return res.status(200).json({ reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching restaurant reviews" });
  }
};

module.exports = {
  createRestaurantReview,
  getRestaurantReviewsByUserId
};
