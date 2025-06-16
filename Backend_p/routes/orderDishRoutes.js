const express = require('express');
const router = express.Router();
const OrderDishController = require('../controllers/orderDishController');
const { verifyToken } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Get all order-dish relationships
router.get('/', OrderDishController.getAllOrderDishes);

// Get order-dish by order ID
router.get('/order/:orderId', OrderDishController.getOrderDishesByOrderId);

// Create order-dish
router.post('/', OrderDishController.createOrderDish);

// Delete order-dish
router.delete('/:id', OrderDishController.deleteOrderDish);


// router.delete('/dishes/:orderId',verifyToken,   checkRole(["admin"]), OrderDishController.deleteDishFromOrder);


module.exports = router;
