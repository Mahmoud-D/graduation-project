// utils/upload.js

const multer = require('multer');
const path = require('path');

 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // توليد اسم فريد للملف مع الإبقاء على الامتداد الأصلي
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

 const upload = multer({ storage: storage });

 module.exports = upload;
