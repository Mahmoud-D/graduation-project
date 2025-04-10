const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'يرجى تسجيل الدخول - لا يوجد توكن' });
    }

    // ✅ فك التوكن واستخراج userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // 🔍 جلب بيانات المستخدم من قاعدة البيانات باستخدام callback
    pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'خطأ في قاعدة البيانات', error: err });
      }

      if (users.length === 0) {
        return res.status(401).json({ message: 'المستخدم غير موجود أو التوكن غير صالح' });
      }

      // 🛡️ حفظ بيانات المستخدم في req.user
      req.user = users[0];

      next();
    });
  } catch (error) {
    console.error('❌ Error in verifyToken:', error);
    return res.status(500).json({ message: 'خطأ في التحقق من التوكن', error });
  }
};
