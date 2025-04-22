const express = require("express");
const router = express.Router();
const DishController = require("../controllers/dishController");
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post("/", verifyToken, checkRole(["admin"]), DishController.createDish);

 router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  DishController.updateDish
);

 router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  DishController.deleteDish
);

router.get("/", DishController.getAllDishes);

router.get("/:id", DishController.getDishById);

module.exports = router;
