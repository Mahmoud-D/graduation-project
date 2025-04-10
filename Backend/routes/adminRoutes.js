// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // تأكد من المسار

// جلب جميع المديرين
router.get('/', adminController.getAllAdmins);

// إنشاء مدير جديد
router.post('/', adminController.createAdmin);

module.exports = router;
