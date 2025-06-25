// controllers/imageController.js
const fs = require('fs');
const path = require('path');

 const checkImageExists = (req, res) => {
    const imagePath = path.join(__dirname, '..', 'uploads', req.params.imageName); 

     fs.exists(imagePath, (exists) => {
        if (exists) {
             res.sendFile(imagePath);
        } else {
             res.status(404).json({ message: 'الصورة غير موجودة' });
        }
    });
};

module.exports = {
    checkImageExists,
};
