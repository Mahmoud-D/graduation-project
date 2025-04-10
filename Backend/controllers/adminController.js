// controllers/adminController.js
const User = require('../models/User'); // استيراد موديل المستخدم

 
// جلب جميع المديرين
exports.getAllAdmins = (req, res) => {
    User.getAll()
    .then((admins) => {
      res.status(200).json(admins);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب المديرين' });
    });
};

// إنشاء مدير جديد
exports.createAdmin = (req, res) => {
  const { name, email } = req.body;

  User.create(name, email)
    .then((insertId) => {
      res.status(201).json({
        message: 'تم إنشاء المدير بنجاح',
        adminId: insertId,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المدير' });
    });
};
