const express = require('express');
const router = express.Router();
const DishController = require('../controllers/dishController');

// Get all dishes
router.get('/', DishController.getAllDishes);

// Get dish by ID
router.get('/:id', DishController.getDishById);

// Create new dish
router.post('/', DishController.createDish);

// Update dish
router.put('/:id', DishController.updateDish);

// Delete dish
router.delete('/:id', DishController.deleteDish);

module.exports = router;
