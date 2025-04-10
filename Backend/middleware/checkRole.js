// middlewares/checkRole.js
// middlewares/checkRole.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'يرجى تسجيل الدخول أولاً' });
    }


console.log(req.user.role);


    // تأكد من صلاحية الدور
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: '🚫 ليس لديك صلاحية للوصول إلى هذا المورد' });
    }

    next();
  };
};

module.exports = checkRole;
