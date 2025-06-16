const express = require("express");
const router = express.Router();
const controller = require("../controllers/DistinctiveDishesController");
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.get("/", controller.getTopOrderedDishes);
router.get("/admin",verifyToken, checkRole(["admin"]), controller.getFeaturedDishesForAdmin);

// رواتب للمشرفين (تتطلب مصادقة وتفويض)
router.post("/", verifyToken, checkRole(["admin"]), controller.addFeaturedDish);
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.updateFeaturedDish
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.deleteFeaturedDish
);

module.exports = router;
