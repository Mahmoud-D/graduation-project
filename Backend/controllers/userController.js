const User = require('../models/User'); // استيراد موديل المستخدم



 

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين' });
  }
};

// الحصول على مستخدم بواسطة الـ ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المستخدم' });
  }
};
