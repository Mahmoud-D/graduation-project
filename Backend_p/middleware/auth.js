const jwt = require('jsonwebtoken');
const sql = require('../config/db'); // استيراد الاتصال بقاعدة البيانات من الملف الجديد
require('dotenv').config();

 

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'يرجى تسجيل الدخول - لا يوجد توكن',
        error: 'missing_token' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'صيغة التوكن غير صالحة',
        error: 'invalid_token_format' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token:", decoded);
    
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ 
        message: 'التوكن لا يحتوي على بيانات مستخدم صالحة',
        error: 'invalid_token_payload' 
      });
    }

    // استعلام للحصول على المستخدم
    const users = await sql`
      SELECT id, name, email, role ,is_verified, is_active
      FROM users 
      WHERE id = ${userId}
    `;


console.log("users ---->:", users);

    // تحقق من وجود المستخدم
    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'المستخدم غير موجود',
        error: 'user_not_found' 
      });
    }


if (!users[0].is_verified) {
  return res.status(401).json({ 
    message: ' المستخدم غير مفعل يرجى التحقق من البريد الإلكتروني أو إعادة توثيق الحساب' ,
    error: 'user_not_verified' 
  });
}

if (!users[0].is_active) {
  return res.status(401).json({ 
    message: ' المستخدم غير مفعل يرجى التواصل مع خدمة العملاء   ' ,
    error: 'user_not_verified' 
  });
}


    req.user = users[0]; // استرجاع أول مستخدم من النتيجة
    next();
  } catch (error) {
    console.error('❌ Error in verifyToken:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'توكن غير صالح',
        error: 'jwt_invalid' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'انتهت صلاحية التوكن',
        error: 'jwt_expired' 
      });
    }

    return res.status(500).json({ 
      message: 'خطأ في التحقق من التوكن',
      error: 'server_error' 
    });
  }
};
