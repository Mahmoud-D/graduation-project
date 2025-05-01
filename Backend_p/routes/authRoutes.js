const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { registerSchema,EmailSchema,passwordValidate } = require('../validations/userSchema');
const validator = require('../middleware/validate.middleware');


// User login
router.post('/login', AuthController.login);

// User registration
router.post('/register',validator(registerSchema), AuthController.register);
router.get('/verify-email', AuthController.verifyEmail);
router.post('/resendVerificationEmail',validator(EmailSchema), AuthController.resendVerificationEmail);
router.post('/sendResetPasswordEmail',validator(EmailSchema), AuthController.sendResetPasswordEmail );
router.post('/resetPassword',validator(passwordValidate), AuthController.resetPassword );

module.exports = router;
