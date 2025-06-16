// controllers/imageController.js
const fs = require('fs');
const path = require('path');

// فحص وجود الصورة
const checkImageExists = (req, res) => {
    const imagePath = path.join(__dirname, '..', 'uploads', req.params.imageName); // التحقق من المسار بشكل صحيح

    // فحص إذا كانت الصورة موجودة
    fs.exists(imagePath, (exists) => {
        if (exists) {
            // إذا كانت الصورة موجودة، يتم إرجاعها مباشرة
            res.sendFile(imagePath);
        } else {
            // إذا كانت الصورة غير موجودة، يتم إرسال رسالة خطأ
            res.status(404).json({ message: 'الصورة غير موجودة' });
        }
    });
};

module.exports = {
    checkImageExists,
};
