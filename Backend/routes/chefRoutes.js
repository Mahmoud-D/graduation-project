const express = require('express');
const router = express.Router();
const ChefController = require('../controllers/chefController');

// Get all chefs
router.get('/', ChefController.getAllChefs);

// Get chef by ID
router.get('/:id', ChefController.getChefById);

// Create new chef
router.post('/', ChefController.createChef);

// Update chef details
router.put('/:id', ChefController.updateChef);

// Delete chef
router.delete('/:id', ChefController.deleteChef);

module.exports = router;
