const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkRole = require('../middleware/checkRole');
const {verifyToken} = require('../middleware/auth');


 
 router.get('/', 
    
    verifyToken, 
    checkRole(['user', 'admin']),
    
    userController.getAllUsers);

 router.get('/:id', userController.getUserById);

 
 // router.put('/:id', userController.updateUser);

 // router.delete('/:id', userController.deleteUser);

module.exports = router;
