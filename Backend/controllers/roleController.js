// controllers/roleController.js

const Role = require('../models/Role'); // تأكد من المسار هنا

// جلب جميع الأدوار
exports.getAllRoles = (req, res) => {
  Role.getAll()
    .then((roles) => {
      res.status(200).json(roles);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب الأدوار' });
    });
};

// إنشاء دور جديد
exports.createRole = (req, res) => {
  const { name } = req.body;

  Role.create(name)
    .then((insertId) => {
      res.status(201).json({
        message: 'تم إنشاء الدور بنجاح',
        roleId: insertId,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الدور' });
    });
};
