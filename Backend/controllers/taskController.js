const Task = require('../models/Task');

// Get all tasks
exports.getAllTasks = (req, res) => {
  Task.getAll()
    .then((tasks) => {
      res.status(200).json(tasks); // إرسال المهام كاستجابة
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب المهام' }); // إرسال رسالة خطأ
    });
};

// Get tasks by order ID
exports.getTasksByOrderId = (req, res) => {
  const { orderId } = req.params; // الحصول على orderId من الـ params

  Task.getById(orderId)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'لم يتم العثور على المهام' });
      }
      res.status(200).json(task); // إرسال المهام بناءً على orderId
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب المهام' }); // إرسال رسالة خطأ
    });
};

// Create new task
exports.createTask = (req, res) => {
  const { chefId, orderId, dishId, status } = req.body; // الحصول على البيانات من الـ body

  Task.create(chefId, orderId, dishId, status)
    .then((insertId) => {
      res.status(201).json({
        message: 'تم إضافة المهمة بنجاح',
        taskId: insertId, // إرسال معرف المهمة الجديدة
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء إضافة المهمة' }); // إرسال رسالة خطأ
    });
};

// Update task status
exports.updateTaskStatus = (req, res) => {
  const { id } = req.params; // الحصول على id من الـ params
  const { status } = req.body; // الحصول على الـ status من الـ body

  Task.update(id, status)
    .then((affectedRows) => {
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'لم يتم العثور على المهمة' }); // إذا لم يتم العثور على المهمة
      }
      res.status(200).json({ message: 'تم تحديث حالة المهمة بنجاح' }); // إرسال رد بنجاح التحديث
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحالة' }); // إرسال رسالة خطأ
    });
};

// Delete task
exports.deleteTask = (req, res) => {
  const { id } = req.params; // الحصول على id من الـ params

  // في حال كنت تحتاج إلى حذف المهمة من قاعدة البيانات، يجب أن تضيف دالة حذف في الموديل.
  // إذا كانت لديك دالة لحذف المهمة في الموديل، يمكنك استخدامها هنا.

  Task.delete(id)
    .then((affectedRows) => {
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'لم يتم العثور على المهمة' });
      }
      res.status(200).json({ message: 'تم حذف المهمة بنجاح' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء حذف المهمة' });
    });
};
