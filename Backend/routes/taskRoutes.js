const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// Get all tasks
router.get('/', TaskController.getAllTasks);

// Get tasks by order ID
router.get('/order/:orderId', TaskController.getTasksByOrderId);

// Create new task
router.post('/', TaskController.createTask);

// Update task status
router.put('/:id', TaskController.updateTaskStatus);

// Delete task
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
