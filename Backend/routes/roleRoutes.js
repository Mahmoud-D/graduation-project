const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/roleController');

// Get all roles
router.get('/', RoleController.getAllRoles);

// Create a new role
router.post('/', RoleController.createRole);

module.exports = router;
