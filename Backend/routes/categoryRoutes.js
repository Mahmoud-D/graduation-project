const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// جلب جميع الفئات
router.get('/', categoryController.getAllCategories);

// إضافة فئة جديدة
router.post('/', categoryController.createCategory);

// تعديل فئة
router.put('/:id', categoryController.updateCategory);

// حذف فئة
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
