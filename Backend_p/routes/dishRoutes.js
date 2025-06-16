const express = require("express");
const router = express.Router();
const DishController = require("../controllers/dishController");
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const { dishSchema } = require("../validations/dishSchema");
const validator = require("../middleware/validate.middleware");


  router.post("/", verifyToken, checkRole(["admin"]),
  validator(dishSchema),
  DishController.createDish);

 router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  validator(dishSchema),
  DishController.updateDish
);

 router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  
  DishController.deleteDish
);

router.get("/", DishController.getAllDishes);

router.get("/getDishesByIds", DishController.getDishById);

router.get("/:id", DishController.getDishByIdParam);
module.exports = router;
