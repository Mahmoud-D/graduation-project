const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { CategorySchema } = require('../validations/categorySchema');
const validator = require('../middleware/validate.middleware');

 router.get('/', categoryController.getAllCategories);

 router.post('/',validator(CategorySchema), categoryController.createCategory);

 router.put('/:id',validator(CategorySchema), categoryController.updateCategory);

 router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
