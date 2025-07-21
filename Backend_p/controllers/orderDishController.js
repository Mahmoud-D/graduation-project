const OrderDish = require('../models/OrderDish'); 


exports.getAllOrderDishes = async (req, res) => {
  try {
    const orderDishes = await OrderDish.find(); 
    res.status(200).json(orderDishes); 
  } catch (error) {
    res.status(500).json({ message: "هناك خطأ في الخادم" });
  }
};


exports.getOrderDishesByOrderId = async (req, res) => {
  const { orderId } = req.params; 
  
  try {
    const orderDishes = await OrderDish.find({ orderId: orderId }); 
    if (orderDishes.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على العلاقات لهذا الطلب" });
    }
    res.status(200).json(orderDishes); 
  } catch (error) {
    res.status(500).json({ message: "هناك خطأ في الخادم" });
  }
};


exports.createOrderDish = async (req, res) => {
  const { orderId, dishId, quantity } = req.body; 
  
  try {
    const newOrderDish = new OrderDish({ orderId, dishId, quantity });
    await newOrderDish.save(); 
    res.status(201).json({ message: "تم إنشاء العلاقة بنجاح", newOrderDish });
  } catch (error) {
    res.status(500).json({ message: "هناك خطأ في الخادم" });
  }
};


exports.deleteOrderDish = async (req, res) => {
  const { id } = req.params; 
  
  try {
    const orderDish = await OrderDish.findByIdAndDelete(id); 
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













 