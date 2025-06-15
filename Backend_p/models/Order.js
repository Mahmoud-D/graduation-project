// models/Order.js
const sql = require("../config/db");

const Order = {
  getAllOrdersWithDishes: async () => {
    try {
      const results = await sql`
        SELECT 
          o.id AS order_id,
          o.user_id,
          o.status,
          o.created_at,
          o.updated_at,
          od.dish_id,
          d.name AS dish_name,
          od.quantity
        FROM orders o
        JOIN order_items od ON o.id = od.order_id
        JOIN dishes d ON od.dish_id = d.id;
      `;
      return results;
    } catch (err) {
      throw err;
    }
  },

  getAll: async () => {

    try {
      const results = await sql`
        SELECT 
          o.id AS order_id,
          o.user_id,
          o.status,
          o.created_at,
          o.updated_at,
          STRING_AGG(d.name || ' (' || od.quantity || ')', ', ') AS dishes
        FROM orders o
        JOIN order_items od ON o.id = od.order_id
        JOIN dishes d ON od.dish_id = d.id
        GROUP BY o.id;
      `;

      return results.map((order) => ({
        ...order,
        dishes: order.dishes.split(", ").map((d) => {
          const [name, quantity] = d.split(" (");
          return {
            dish_name: name,
            quantity: parseInt(quantity.replace(")", ""), 10),
          };
        }),
      }));
    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {

 

     


    try {
      const results = await sql`
        SELECT 
          o.id AS order_id,
    o.user_id,
    o.status,
    o.created_at,
    o.updated_at,
    o.coupon_id,
    o.total_amount,
    o.payment_method,
    o.delivery_address,
    o.city,
    o.phone_number,
    o.notes,
    o.delivery_fees,

          u.name AS user_name,
          u.email AS user_email,

          d.*,
          od.quantity,

          c.code AS coupon_code,
          c.discount_value AS coupon_discount_value,

          p.discount_percentage,
          CASE 
            WHEN p.discount_percentage IS NOT NULL 
              AND p.is_active = TRUE 
              AND NOW() BETWEEN p.start_date AND p.end_date
            THEN d.price * (1 - p.discount_percentage / 100)
            ELSE d.price
          END AS final_price

        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items od ON o.id = od.order_id
        JOIN dishes d ON od.dish_id = d.id

      LEFT JOIN (
  SELECT DISTINCT ON (dish_id) *
  FROM promotions
  WHERE is_active = TRUE
    AND NOW() BETWEEN start_date AND end_date
  ORDER BY dish_id, start_date DESC
) p ON d.id = p.dish_id


LEFT JOIN coupons c ON o.coupon_id = c.id
        WHERE o.id = ${id};
      `;

      if (results.length === 0) {
        throw new Error(`Order with ID ${id} not found`);
      }

      const order = results.reduce((acc, row) => {
        if (!acc) {
          acc = {
            order_id: row.order_id,
            user_id: row.user_id,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            user_name: row.user_name,
            user_email: row.user_email,
             coupon_code: row.coupon_code,
            coupon_discount_value: row.coupon_discount_value,



             coupon_id: row.coupon_id,
            total_amount: row.total_amount,
            payment_method: row.payment_method,
            delivery_address: row.delivery_address,
            city: row.city,
            phone_number: row.phone_number,
            notes: row.notes,
            delivery_fees: row.delivery_fees,


            dishes: [],
          };
        }

        const dishData = {
          id: row.id,
          name: row.name,
          description: row.description,
          image_url: row.image_url,
          price: row.price,
          quantity: row.quantity,
          discount_percentage: row.discount_percentage,
          final_price: row.final_price,
        };

        acc.dishes.push(dishData);
        return acc;
      }, null);

      return order;
    } catch (err) {
      throw err;
    }
  },

  getMyOrders: async (userId) => {
    try {
      const results = await sql`
        SELECT 
          o.id AS order_id,
          o.user_id,
          o.status,
          o.created_at,
          o.updated_at,
          o.coupon_id,
          STRING_AGG(d.name || ' (' || od.quantity || ')', ', ') AS dishes
        FROM orders o
        JOIN order_items od ON o.id = od.order_id
        JOIN dishes d ON od.dish_id = d.id
        WHERE o.user_id = ${userId}
        GROUP BY o.id;
      `;

      return results.map((order) => ({
        ...order,
        dishes: order.dishes.split(", ").map((d) => {
          const [name, quantity] = d.split(" (");
          return {
            dish_name: name,
            quantity: parseInt(quantity.replace(")", ""), 10),
          };
        }),
      }));
    } catch (err) {
      throw err;
    }
  },

  create: async ({
    user_id,
    status = "pending",
    payment_method,
    delivery_address,
    city,
    phone_number,
    total_amount,
    delivery_fees
  }) => {
    const now = new Date();
  
    try {
      // 1. أنشئ الأوردر وارجع البيانات كلها
      const [order] = await sql`
        INSERT INTO orders (
          user_id, status, created_at, updated_at, 
          payment_method, delivery_address, city, 
          phone_number, total_amount, delivery_fees
        )
        VALUES (
          ${user_id}, ${status}, ${now}, ${now}, 
          ${payment_method}, ${delivery_address}, ${city}, 
          ${phone_number}, ${total_amount}, ${delivery_fees}
        )
        RETURNING *;
      `;
  
 
  
       return {
        ...order,
       };
  
    } catch (err) {
      throw err;
    }
  },  

  update: async (id, status) => {
    try {
      const result = await sql`
        UPDATE orders SET status = ${status} WHERE id = ${id};
      `;

      if (result.count === 0) {
        throw new Error(`Order with ID ${id} not found`);
      }

      return true;
    } catch (err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      await sql`
        DELETE FROM orders WHERE id = ${id};
      `;
      return true;
    } catch (err) {
      throw err;
    }
  },
  getTotalOrdersPerDay: async () => {
    try {
      const result = await sql`
 SELECT DATE(created_at) AS order_date, COUNT(*) AS total_orders  
FROM orders  
GROUP BY order_date  
ORDER BY order_date;
      `;
      return result;
    } catch (err) {
      throw err;
    }
  },
  getTopUsersByOrders: async () => {
    try {
      const result = await sql`
SELECT 
  o.user_id, 
  u.name AS user_name, 
  COUNT(*) AS total_orders  
FROM orders o
JOIN users u ON o.user_id = u.id
GROUP BY o.user_id, u.name  
ORDER BY total_orders DESC  
LIMIT 10;

      `;
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Order;
