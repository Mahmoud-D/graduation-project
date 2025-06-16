// controllers/orderController.js

const Order = require("../models/Order");
const OrderDish = require("../models/OrderDish");
const couponModel = require("../models/coupon");

// const createOrder = async (req, res) => {
//   const {  status, dishes } = req.body;

//   try {
//     const orderData = { user_id: req.user.id, status };
//     const { id: orderId } = await Order.create(orderData);

//     for (let dish of dishes) {
//       await OrderDish.addDishesToOrder(orderId, dish.dishId, dish.quantity);
//     }

//     // return res.status(201).json({ message: "  orderId  !",  orderId });

//     return res
//       .status(201)
//       .json({ message: "Order created successfully!", orderId });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error creating order" });
//   }
// };



const createOrder = async (req, res) => {
  const { status, dishes, coupon_code } = req.body;

  try {
    const orderData = { user_id: req.user.id, status };
    const { id: orderId } = await Order.create(orderData);

    // تحقق من الكوبون إذا كان موجودًا وصالحًا
    if (coupon_code) {
      const coupon = await couponModel.getCouponByCode(coupon_code, req.user.id);
      if (coupon === null) {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }
      if (coupon === "Coupon limit reached") {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }
      if (coupon === "User has exceeded coupon usage limit") {
        return res.status(400).json({ message: "You have exceeded your coupon usage limit" });
      }

      // تطبيق الكوبون على الطلب
      await couponModel.applyCouponToOrder(orderId, coupon.id, req.user.id);
    }

    for (let dish of dishes) {
      await OrderDish.addDishesToOrder(orderId, dish.dishId, dish.quantity);
    }

    return res.status(201).json({ message: "Order created successfully!", orderId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating order" });
  }
};


 

const getAllOrders = async (req, res) => {
   
  try {
    const orders = await Order.getAll();
    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};




 
 

 

// جلب تفاصيل الطلب بناءً على الـ id
const getOrderDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.getById(id);
    return res.status(200).json({ order });
  } catch (err) {
    console.error(err);
    
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({ message: "Error fetching order details" });
  }
};


const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Order.update(id, status);

    if (updated) {
      return res.status(200).json({ message: "Order updated successfully!" });
    }

    // لو الدالة Order.update عملت reject برسالة
    return res.status(404).json({ message: `Order with ID ${id} not found` });

  } catch (err) {
    console.error(err);

    if (err.message.includes("not found")) {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({ message: "Error updating order" });
  }
};


// حذف طلب
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const { force } = req.query;

  try {
    if (force === "true") {
      // نحذف الصفوف المرتبطة الأول
      await OrderDish.deleteByOrderId(id);
    }

    const deleted = await Order.delete(id);
    if (deleted) {
      return res.status(200).json({ message: "Order deleted successfully!" });
    } else {
      return res.status(404).json({ message: "Order not found!" });
    }
  } catch (err) {
    console.error(err);

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        message:
          "Cannot delete order: there are related items linked to it. Please delete them first or use force=true.",
      });
    }

    return res.status(500).json({ message: "Error deleting order" });
  }
};


const getMyOrders = async (req, res) => {
  const userId = req.user.id; // تأكد أنك مستخرج user من التوكن أو السيشن

  try {
    const myOrders = await Order.getMyOrders(userId);
    return res.status(200).json({ orders: myOrders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching your orders" });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderDetails,
  updateOrder,
  deleteOrder,
  getMyOrders
};
