// models/Order.js

const connection = require("../config/db");

 
const Order = {
  getAllOrdersWithDishes: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          orders.id AS order_id,
          orders.user_id,
          orders.status,
          orders.created_at,
          orders.updated_at,
          order_dishes.dish_id,
          dishes.name AS dish_name,
          order_dishes.quantity
        FROM 
          orders
        JOIN 
          order_dishes ON orders.id = order_dishes.order_id
        JOIN 
          dishes ON order_dishes.dish_id = dishes.id;
      `;
      
      connection.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  



  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          orders.id AS order_id,
          orders.user_id,
          orders.status,
          orders.created_at,
          orders.updated_at,
          GROUP_CONCAT(
            CONCAT(dishes.name, ' (', order_dishes.quantity, ')')
            SEPARATOR ', '
          ) AS dishes 
        FROM 
          orders
        JOIN 
          order_dishes ON orders.id = order_dishes.order_id
        JOIN 
          dishes ON order_dishes.dish_id = dishes.id
        GROUP BY 
          orders.id;
      `;
      connection.query(sql, (err, results) => {
        if (err) return reject(err);
        
        // تحويل الأطباق إلى مصفوفة في الكود
        results.forEach(order => {
          order.dishes = order.dishes.split(', ').map(dish => {
            const [name, quantity] = dish.split(' (');
            return {
              dish_name: name,
              quantity: parseInt(quantity.replace(')', ''), 10)
            };
          });
        });
        
        resolve(results);
      });
    });
  },


  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
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
  
        WHERE o.id = ?;
      `;
  
      connection.query(sql, [id], (err, results) => {
        if (err) return reject(err);
  
        if (results.length === 0) {
          return reject(new Error(`Order with ID ${id} not found`));
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
            ...row,
            quantity: row.quantity,
            discount_percentage: row.discount_percentage,
            final_price: row.final_price,
          };
  
          // نحذف بيانات الطلب والمستخدم من بيانات الطبق لتفادي التكرار
          delete dishData.order_id;
          delete dishData.user_id;
          delete dishData.status;
          delete dishData.created_at;
          delete dishData.updated_at;
          delete dishData.user_name;
          delete dishData.user_email;
          delete dishData.coupon_code;
          delete dishData.coupon_discount_value;
  
          acc.dishes.push(dishData);
  
          return acc;
        }, null);
  
        resolve(order);
      });
    });
  },
  
  

  
  getMyOrders: (userId) => {
    console.log("userId",userId);
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          orders.id AS order_id,
          orders.user_id,
          orders.status,
          orders.created_at,
          orders.updated_at,
          GROUP_CONCAT(
            CONCAT(dishes.name, ' (', order_dishes.quantity, ')')
            SEPARATOR ', '
          ) AS dishes
        FROM 
          orders
        JOIN 
          order_dishes ON orders.id = order_dishes.order_id
        JOIN 
          dishes ON order_dishes.dish_id = dishes.id
        JOIN
          users ON orders.user_id = users.id
        WHERE 
          orders.user_id = ?
        GROUP BY 
          orders.id;
      `;
  
      connection.query(sql, [userId], (err, results) => {
        if (err) return reject(err);
  
        const orders = results.map(order => {
          order.dishes = order.dishes.split(', ').map(dish => {
            const [name, quantity] = dish.split(' (');
            return {
              dish_name: name,
              quantity: parseInt(quantity.replace(')', ''), 10)
            };
          });
  
          return order;
        });
  
        resolve(orders);
      });
    });
  },
  

 
  
  
  create: (order) => {
    const { user_id, status } = order;
    const now = new Date();
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO orders (user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?)",
        [user_id, status, now, now],
        (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, ...order });
        }
      );
    });
  },

  create: (order) => {
    const { user_id, status } = order;
    const now = new Date();
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO orders (user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?)",
        [user_id, status, now, now],
        (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, ...order });
        }
      );
    });
  },

update: (id, status) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    connection.query(sql, [status, id], (err, result) => {
      if (err) return reject(err);

      if (result.affectedRows === 0) {
        return reject(new Error(`Order with ID ${id} not found`));
      }

      resolve(true);
    });
  });
},


  delete: (id) => {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM orders WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}

 
module.exports = Order;
