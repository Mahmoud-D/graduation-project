// sqlController.js
const db = require('../config/db');  // دي هي `sql` اللي من مكتبة postgres

const executeSqlQuery = async (req, res) => {
  const query = req.body.query?.replace(/[\r\n]+/g, '').trim();

  if (!query) {
    return res.status(400).json({ message: 'لا يوجد استعلام لتنفيذه' });
  }

  try {
    console.log('تنفيذ الكويري:', query);
    
    // تنفيذ الكويري بشكل ديناميكي
    const result = await db.unsafe(query);

    console.log('النتيجة:', result);
    return res.status(200).json({ query, message: 'تم تنفيذ الاستعلام بنجاح', result });
  } catch (err) {
    console.error('❌ خطأ في تنفيذ الاستعلام:', err);
    return res.status(500).json({
      message: 'حدث خطأ أثناء تنفيذ الاستعلام',
      error: {
        query,
        message: err.message,
        code: err.code
      }
    });
  }
};

module.exports = { executeSqlQuery };
