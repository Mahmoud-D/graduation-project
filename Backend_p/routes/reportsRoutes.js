const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController.js");
const checkRole = require("../middleware/checkRole");
const { verifyToken } = require("../middleware/auth");

router.get("/getUserGrowthReport",   verifyToken,   checkRole(["admin"]),   reportsController.getUserGrowthReport);
router.get("/getstatsCategories",   verifyToken,   checkRole(["admin"]),   reportsController.getstatsCategories);
router.get("/OverallAverageRating",   verifyToken,   checkRole(["admin"]),   reportsController.OverallAverageRating);
router.get("/ReviewsOverTimebymonth",   verifyToken,   checkRole(["admin"]),   reportsController.ReviewsOverTimebymonth);
router.get("/ReviewsOverTimebyDay",   verifyToken,   checkRole(["admin"]),   reportsController.ReviewsOverTimebyDay);

router.get("/RatingDistributionHistogram",   verifyToken,   checkRole(["admin"]),   reportsController.RatingDistributionHistogram);
router.get("/getUsersWithMostReviews",   verifyToken,   checkRole(["admin"]),   reportsController.getUsersWithMostReviews);
router.get("/getTopRatedDishes",   verifyToken,   checkRole(["admin"]),   reportsController.getTopRatedDishes);

 
 
 
module.exports = router;
