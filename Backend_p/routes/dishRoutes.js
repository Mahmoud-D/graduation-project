const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const DishController = require("../controllers/dishController");
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const {
  createDishSchema,
  updateDishSchema,
} = require("../validations/dishSchema");
const validator = require("../middleware/validate.middleware");

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  upload.single("image"),
  (req, res, next) => {
    req.bodyForValidation = {
      ...req.body,
      image: req.file
        ? {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          filename: req.file.filename,
        }
        : undefined,
    };
    next();
  },
  validator(createDishSchema),
  DishController.createDish
);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  upload.single("image"),
  (req, res, next) => {
    req.bodyForValidation = {
      ...req.body,
      id: req.params.id,
      ...(req.file
        ? {
          image: {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            filename: req.file.filename,
          },
        }
        : {}),
    };
    next();
  },
  validator(updateDishSchema),
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
