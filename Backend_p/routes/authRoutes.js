const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// User login
router.post('/login', AuthController.login);

// User registration
router.post('/register', AuthController.register);
router.get('/verify-email', AuthController.verifyEmail);
router.post('/resendVerificationEmail', AuthController.resendVerificationEmail);
router.post('/sendResetPasswordEmail', AuthController.sendResetPasswordEmail );
router.post('/resetPassword', AuthController.resetPassword );

module.exports = router;
