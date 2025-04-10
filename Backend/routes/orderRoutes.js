const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Get all orders
router.get('/', OrderController.getAllOrders);

// Get order by ID
router.get('/:id', OrderController.getOrderById);

// Create new order
router.post('/', OrderController.createOrder);

// Update order status
router.put('/:id', OrderController.updateOrderStatus);

// Delete order
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
