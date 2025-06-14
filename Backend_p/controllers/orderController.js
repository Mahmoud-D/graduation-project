// controllers/orderController.js

const { getDishesByIds } = require("../models/Dish");
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

// orderController.js

const createOrder = async (req, res) => {
  try {
    const {
      dishes,
      coupon_id,
      payment_method,
      delivery_address,
      city,
      phone_number,
      status,
    } = req.body;

    if (!dishes || dishes.length === 0) {
      return res.status(400).json({ message: "No dishes provided" });
    }

    const dbDishes = await getDishesByIds(dishes.map((d) => d.dishId));
    let totalAmount = dbDishes.reduce((total, dish) => {
      const dishData = dishes.find((d) => d.dishId === dish.id);
      if (dishData && dishData.quantity) {
        return total + dish.price * dishData.quantity;
      }
      return total;
    }, 0);
    const coupon = await couponModel.getCouponById(coupon_id);
    if (coupon) {
      totalAmount -= (totalAmount * coupon[0].discount_value) / 100;
    }
    if (totalAmount < 500) totalAmount += 35; // Add delivery fees if total is less than 500

    const orderData = {
      dishes,
      user_id: req.user.id,
      status: status || "pending",
      payment_method,
      delivery_address,
      city,
      phone_number,
      total_amount: totalAmount,
      delivery_fees: totalAmount >= 500 ? 0 : 35,
      coupon_id
    };
    
    const { id: orderId } = await Order.create(orderData);

    // 3. Check promotions
    // 4. Calculate subtotal
    // 5. Apply coupon if any
    // 6. Insert order into database
    // 7. Insert order items

    res
      .status(201)
      .json({ ok: true, message: "Order created successfully", orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createOrder };

// const createOrder = async (req, res) => {
//   const { status, dishes, coupon_code } = req.body;

//   try {
//     const orderData = { user_id: req.user.id, status };
//     const { id: orderId } = await Order.create(orderData);

//     // تحقق من الكوبون إذا كان موجودًا وصالحًا
//     if (coupon_code) {
//       const coupon = await couponModel.getCouponByCode(coupon_code, req.user.id);
//       if (coupon === null) {
//         return res.status(400).json({ message: "Invalid or expired coupon" });
//       }
//       if (coupon === "Coupon limit reached") {
//         return res.status(400).json({ message: "Coupon usage limit reached" });
//       }
//       if (coupon === "User has exceeded coupon usage limit") {
//         return res.status(400).json({ message: "You have exceeded your coupon usage limit" });
//       }

//       // تطبيق الكوبون على الطلب
//       await couponModel.applyCouponToOrder(orderId, coupon.id, req.user.id);
//     }

//     for (let dish of dishes) {
//       await OrderDish.addDishesToOrder(orderId, dish.dishId, dish.quantity);
//     }

//     return res.status(201).json({ message: "Order created successfully!", orderId });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error creating order" });
//   }
// };

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
  getMyOrders,
};
