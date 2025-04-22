// models/Order.js
const sql = require('../config/db');

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
        JOIN order_dishes od ON o.id = od.order_id
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
        JOIN order_dishes od ON o.id = od.order_id
        JOIN dishes d ON od.dish_id = d.id
        GROUP BY o.id;
      `;

      return results.map(order => ({
        ...order,
        dishes: order.dishes.split(', ').map(d => {
          const [name, quantity] = d.split(' (');
          return {
            dish_name: name,
            quantity: parseInt(quantity.replace(')', ''), 10)
          };
        })
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
        JOIN order_dishes od ON o.id = od.order_id
        JOIN dishes d ON od.dish_id = d.id
        LEFT JOIN promotions p 
          ON d.id = p.dish_id 
          AND p.is_active = TRUE
          AND NOW() BETWEEN p.start_date AND p.end_date
        LEFT JOIN coupon_uses cu ON cu.order_id = o.id
        LEFT JOIN coupons c ON cu.coupon_id = c.id
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
          final_price: row.final_price
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
          STRING_AGG(d.name || ' (' || od.quantity || ')', ', ') AS dishes
        FROM orders o
        JOIN order_dishes od ON o.id = od.order_id
        JOIN dishes d ON od.dish_id = d.id
        WHERE o.user_id = ${userId}
        GROUP BY o.id;
      `;

      return results.map(order => ({
        ...order,
        dishes: order.dishes.split(', ').map(d => {
          const [name, quantity] = d.split(' (');
          return {
            dish_name: name,
            quantity: parseInt(quantity.replace(')', ''), 10)
          };
        })
      }));
    } catch (err) {
      throw err;
    }
  },

  create: async ({ user_id, status }) => {
    const now = new Date();
    try {
      const result = await sql`
        INSERT INTO orders (user_id, status, created_at, updated_at)
        VALUES (${user_id}, ${status}, ${now}, ${now})
        RETURNING id;
      `;
      return { id: result[0].id, user_id, status };
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
  }
};

module.exports = Order;
