// sqlController.js
const db = require('../config/db');  // تأكد من أن المسار صحيح حسب تنظيم المجلدات في مشروعك

 const executeSqlQuery = (req, res) => {
  const query = req.body.query?.replace(/[\r\n]+/g, '').trim();

  if (!query) {
    return res.status(400).json({ message: 'لا يوجد استعلام لتنفيذه' });
  }

  try {
    console.log('تنفيذ الكويري:', query);
    db.query(query, (err, result) => {
      if (err) {
        console.error('خطأ في تنفيذ الاستعلام:', err);
        return res.status(500).json({
          message: 'حدث خطأ أثناء تنفيذ الاستعلام',
          error: {
            query: query,
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
            sql: err.sql
          }
        });
      }
      console.log('النتيجة:', result);
      return res.status(200).json({ query, message: 'تم تنفيذ الاستعلام بنجاح', result });
    });
  } catch (error) {
    console.error('حدث خطأ غير متوقع:', error);
    return res.status(500).json({
      message: 'حدث خطأ غير متوقع',
      error: error.message
    });
  }
};

module.exports = { executeSqlQuery };
