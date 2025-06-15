// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
const orderDishController = require("../controllers/orderDishController");
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const validator = require('../middleware/validate.middleware');

 const { createOrderSchema } = require("../validations/orderValidation");
// Get all orders

 // Create new order
router.post("/",verifyToken, OrderController.createOrder);

// // Get order by ID
router.get('/my-orders', verifyToken, OrderController.getMyOrders);
router.get("/:id", OrderController.getOrderDetails);
// // // Update order status
router.put("/:id", OrderController.updateOrder);

// // // Delete order
router.delete("/:id", OrderController.deleteOrder);

router.get("/",verifyToken,checkRole(["admin"]),OrderController.getAllOrders);

module.exports = router;
