const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { registerSchema,EmailSchema,passwordValidate ,loginSchema,isEnteredEmailSchema} = require('../validations/userSchema');
const validator = require('../middleware/validate.middleware');


// User login
router.post('/login',validator(loginSchema), AuthController.login);

// User registration
router.post('/register',validator(registerSchema), AuthController.register);
router.get('/verify-email',  AuthController.verifyEmail);
router.post('/resendVerificationEmail',validator(isEnteredEmailSchema), AuthController.resendVerificationEmail);
router.post('/sendResetPasswordEmail',validator(isEnteredEmailSchema), AuthController.sendResetPasswordEmail );
router.post('/resetPassword',validator(passwordValidate), AuthController.resetPassword );

module.exports = router;
