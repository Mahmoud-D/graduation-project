// controllers/orderController.js

const { getDishesByIds } = require("../models/Dish");
const Order = require("../models/Order");
const OrderDish = require("../models/OrderDish");
const couponModel = require("../models/coupon");
const sendEmail = require("../utils/emailService");
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





const sendOrderInvoiceEmail = async (orderData, email) => {

   
 

  try {
    // تنسيق بيانات الفاتورة
    const formattedDate = new Date(orderData.created_at).toLocaleDateString('ar-EG');
    const totalBeforeDelivery = parseFloat(orderData.total_amount) - parseFloat(orderData.delivery_fees);
    
    // إنشاء محتوى HTML للفاتورة
    const html = `
    <html dir="rtl">
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .logo {
            max-width: 150px;
          }
          .invoice-title {
            color: #2c3e50;
            margin-top: 10px;
          }
          .order-info {
            margin: 20px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #eee;
          }
          th {
            background-color: #f8f9fa;
          }
          .total-row {
            font-weight: bold;
            background-color: #f8f9fa;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="invoice-title">فاتورة شراء</h1>
            <p>رقم الفاتورة: #${orderData.order_id}</p>
            <p>تاريخ: ${formattedDate}</p>
          </div>
          
          <div class="order-info " dir="rtl">
            <h3>معلومات العميل:</h3>
            <p>الاسم: ${orderData.user_name}</p>
             <p>رقم الهاتف: ${orderData.phone_number}</p>
            <p>عنوان التسليم: ${orderData.delivery_address}، ${orderData.city}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>الصنف</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.dishes.map(dish => `
                <tr>
                  <td>${dish.name}</td>
                  <td>${dish.quantity}</td>
                  <td>${dish.final_price} ج.م</td>
                  <td>${(dish.quantity * dish.final_price).toFixed(2)} ج.م</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="3">إجمالي الطلب</td>
                <td>${totalBeforeDelivery.toFixed(2)} ج.م</td>
              </tr>
              <tr>
                <td colspan="3">رسوم التوصيل</td>
                <td>${orderData.delivery_fees} ج.م</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">المبلغ الإجمالي</td>
                <td>${orderData.total_amount} ج.م</td>
              </tr>
            </tbody>
          </table>
          
          <div class="payment-method">
            <h3>طريقة الدفع:</h3>
            <p>${orderData.payment_method === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}</p>
          </div>
          
          <div class="footer">
            <p>شكراً لاختياركم مطعمنا</p>

            </div>
        </div>
      </body>
    </html>
    `;

    // نص عادي للبريد الإلكتروني
    const text = `
    فاتورة شراء - مطعمنا
    ---------------------
    رقم الفاتورة: #${orderData.order_id}
    التاريخ: ${formattedDate}
    
    معلومات العميل:
    الاسم: ${orderData.user_name}
     رقم الهاتف: ${orderData.phone_number}
    عنوان التسليم: ${orderData.delivery_address}، ${orderData.city}
    
    تفاصيل الطلب:
    ${orderData.dishes.map(dish => `
    - ${dish.name} (${dish.quantity} x ${dish.final_price} ج.م) = ${(dish.quantity * dish.final_price).toFixed(2)} ج.م
    `).join('')}
    
    إجمالي الطلب: ${totalBeforeDelivery.toFixed(2)} ج.م
    رسوم التوصيل: ${orderData.delivery_fees} ج.م
    المبلغ الإجمالي: ${orderData.total_amount} ج.م
    
    طريقة الدفع: ${orderData.payment_method === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}
    
    شكراً لاختياركم مطعمنا
    `;

    // إرسال البريد الإلكتروني
    await sendEmail({
      to: email, // استخدام البريد من بيانات الطلب
      subject: `فاتورة طلبك #${orderData.order_id} من مطعمنا`,
      text,
      html,
      category: "Order Invoice",
      senderName: "مطعمنا"
    });

    console.log(`تم إرسال الفاتورة إلى ${email}`);
  } catch (error) {
    console.error('فشل إرسال بريد الفاتورة:', error);
    throw error;
  }
};












const createOrder = async (req, res) => {
  try {
    const {
      dishes,
      coupon_code,
      payment_method,
      delivery_address,
      city,
      phone_number,
      status,
      paypal_order_id
    } = req.body;

    if (!dishes || dishes.length === 0) {
      return res.status(400).json({ message: "No dishes provided" });
    }

    // 2. Fetch dishes details from database
    const dbDishes = await getDishesByIds(dishes.map((d) => d.dishId));

    // 3.  The function calculates the total price of all dishes by multiplying the price of each dish by its ordered quantity and adding the results together.
    const totalAmount = dbDishes.reduce((total, dish) => {
      const dishData = dishes.find((d) => d.dishId === dish.id);
      if (dishData && dishData.quantity) {
        return total + dish.price * dishData.quantity;
      }
      return total;
    }, 0);

    let finalAmount = 0;
    let coupon = null;
    if (coupon_code) {
      try {
        coupon = await couponModel.getCouponByCode(coupon_code, req.user.id);
      } catch (err) {
        return res
          .status(400)
          .json({ message: err.message || "Invalid or expired coupon" });
      }

      let discount = totalAmount * (coupon.discount_value / 100);
      finalAmount = totalAmount - discount;
    }

    // if (payment_method === "paypal") {
    //   if (!paypal_order_id) {
    //     return res.status(400).json({ message: "Missing PayPal order ID" });
    //   }

    //   try {
    //     const captureResult = await capturePayment(paypal_order_id);
    //     console.log("✅ PayPal Payment Captured:", captureResult);
    //   } catch (error) {
    //     console.error("❌ PayPal Capture Failed:", error);
    //     return res.status(400).json({ message: "PayPal payment failed" });
    //   }
    // }

    const orderData = {
      dishes: dbDishes,
      user_id: req.user.id,
      status: status || "pending",
      payment_method,
      delivery_address,
      city,
      phone_number,
      total_amount: finalAmount, // بعد الخصم
      delivery_fees: totalAmount >= 500 ? 0 : 35,
      coupon_id: coupon?.id || null,
    };

    const { id: orderId } = await Order.create(orderData);

    for (let dish of dishes) {
      await OrderDish.addDishToOrder(orderId, dish.dishId, dish.quantity);
    }

    let applyCouponToOrder;
    if (coupon_code) {
      applyCouponToOrder = await couponModel.applyCouponToOrder(
        orderId,
        coupon.id,
        req.user.id
      );
    }

    const order1 = await Order.getById(orderId);







    await sendOrderInvoiceEmail(order1, req.user.email);




























    return res
      .status(201)
      .json({ok: true, message: "Order created successfully  2", order1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// module.exports = { createOrder };

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
