const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Profile route (protected)
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

module.exports = router;