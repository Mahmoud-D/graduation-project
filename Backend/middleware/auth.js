const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET غير موجود في ملف .env');
}

exports.verifyToken = (req, res, next) => {
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

    pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?', 
      [userId], 
      (err, users) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            message: 'خطأ في قاعدة البيانات',
            error: 'database_error' 
          });
        }

        if (users.length === 0) {
          return res.status(401).json({ 
            message: 'المستخدم غير موجود',
            error: 'user_not_found' 
          });
        }

        req.user = users[0];
        next();
      }
    );
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