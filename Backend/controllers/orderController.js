const Order = require('../models/Order'); // استيراد موديل الطلب

// الحصول على جميع الطلبات
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // جلب جميع الطلبات
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلبات' });
  }
};

// الحصول على طلب بواسطة الـ ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); // جلب الطلب باستخدام الـ ID
    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات الطلب' });
  }
};

// إنشاء طلب جديد
exports.createOrder = async (req, res) => {
  const { userId, dishes, totalPrice } = req.body;
  try {
    const newOrder = new Order({ userId, dishes, totalPrice });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الطلب' });
  }
};

// تحديث حالة الطلب
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة الطلب' });
  }
};

// حذف طلب
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }
    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الطلب' });
  }
};
