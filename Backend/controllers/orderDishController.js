const OrderDish = require('../models/OrderDish'); // تأكد من استيراد الموديل المناسب

// دالة لجلب كل العلاقات بين الطلبات والأطباق
exports.getAllOrderDishes = async (req, res) => {
  try {
    const orderDishes = await OrderDish.find(); // استخدم find() لجلب كل البيانات
    res.status(200).json(orderDishes); // إعادة البيانات للمستخدم
  } catch (error) {
    res.status(500).json({ message: "هناك خطأ في الخادم" });
  }
};

// دالة لجلب العلاقات بين الطلبات والأطباق بناءً على ID الطلب
exports.getOrderDishesByOrderId = async (req, res) => {
  const { orderId } = req.params; // جلب الـ orderId من المعاملات (params)
  
  try {
    const orderDishes = await OrderDish.find({ orderId: orderId }); // ابحث باستخدام orderId
    if (orderDishes.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على العلاقات لهذا الطلب" });
    }
    res.status(200).json(orderDishes); // إعادة العلاقات للمستخدم
  } catch (error) {
    res.status(500).json({ message: "هناك خطأ في الخادم" });
  }
};

// دالة لإنشاء علاقة جديدة بين الطلب والطبق
exports.createOrderDish = async (req, res) => {
  const { orderId, dishId, quantity } = req.body; // الحصول على البيانات من الـ body
  
  try {
    const newOrderDish = new OrderDish({ orderId, dishId, quantity });
    await newOrderDish.save(); // حفظ البيانات الجديدة في قاعدة البيانات
    res.status(201).json({ message: "تم إنشاء العلاقة بنجاح", newOrderDish });
  } catch (error) {
    res.status(500).json({ message: "هناك خطأ في الخادم" });
  }
};

// دالة لحذف علاقة بين الطلب والطبق بناءً على ID
exports.deleteOrderDish = async (req, res) => {
  const { id } = req.params; // الحصول على الـ ID من المعاملات (params)
  
  try {
    const orderDish = await OrderDish.findByIdAndDelete(id); // محاولة العثور على العنصر وحذفه
    if (!orderDish) {
      return res.status(404).json({ message: "لم يتم العثور على العلاقة" });
    }
    res.status(200).json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "هناك خطأ في الخادم" });
  }
};



exports. deleteDishFromOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deleted = await OrderDish.deleteByOrderId(orderId);
    if (deleted) {
      return res.status(200).json({ message: "Dishes deleted successfully!" });
    } else {
      return res.status(404).json({ message: "Order not found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting dishes" });
  }
};