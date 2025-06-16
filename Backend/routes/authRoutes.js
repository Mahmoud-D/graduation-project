const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// User login
router.post('/login', AuthController.login);

// User registration
router.post('/register', AuthController.register);

module.exports = router;
