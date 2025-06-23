const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { CategorySchema } = require('../validations/categorySchema');
const validator = require('../middleware/validate.middleware');
const checkRole = require('../middleware/checkRole');
const { verifyToken } = require('../middleware/auth');

 router.get('/',verifyToken,    categoryController.getAllCategories);

 router.post('/',validator(CategorySchema),verifyToken,   checkRole(["admin"]), categoryController.createCategory);

 router.put('/:id',validator(CategorySchema),verifyToken,   checkRole(["admin"]), categoryController.updateCategory);

 router.delete('/:id',verifyToken,   checkRole(["admin"]), categoryController.deleteCategory);

module.exports = router;
