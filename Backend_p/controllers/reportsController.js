const Order = require('../models/Order');
const Review = require('../models/Review');
const User = require('../models/User');  
const Category = require('../models/category');  
const Dish = require("../models/Dish"); // استيراد موديل الطبق



 

exports.getUserGrowthReport = async (req, res) => {
  try {
    const users = await User.getUserGrowthReport();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};


exports.getstatsCategories = async (req, res) => {
  try {
    const data = await Category.getstatsCategories();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
 
exports.OverallAverageRating = async (req, res) => {
  try {
    const data = await Review.OverallAverageRating();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
exports.ReviewsOverTimebymonth = async (req, res) => {
  try {
    const data = await Review.ReviewsOverTimebymonth();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
 
exports.ReviewsOverTimebyDay = async (req, res) => {
  try {
    const data = await Review.ReviewsOverTimebyDay();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
 
exports.RatingDistributionHistogram = async (req, res) => {
  try {
    const data = await Review.RatingDistributionHistogram();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};



exports.getUsersWithMostReviews = async (req, res) => {
  try {
    const data = await Review.getUsersWithMostReviews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
exports.getTopRatedDishes = async (req, res) => {
  try {
    const data = await Review.getTopRatedDishes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};




exports.getTotalOrdersPerDay = async (req, res) => {
  try {
    const data = await Order.getTotalOrdersPerDay();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};


exports.getTopUsersByOrders = async (req, res) => {
  try {
    const data = await Order.getTopUsersByOrders();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
exports.getTopSellingDishes = async (req, res) => {
  try {
    const data = await Dish.getTopSellingDishes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
exports.getDailyDishesSales = async (req, res) => {
  try {
    const data = await Dish.getDailyDishesSales();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ' });
  }
};
 