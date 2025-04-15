// models/Dish.js

const connection = require("../config/db");

// Create Dish Model
const Dish = {
  getAll: ({ category, minPrice, maxPrice, name }) => {
    let sql = `
      SELECT 
        d.*,
        AVG(r.rating) AS average_rating,
        GROUP_CONCAT(c.name) AS categories
      FROM dishes d
      LEFT JOIN reviews r ON d.id = r.dish_id
      LEFT JOIN dish_categories dc ON d.id = dc.dish_id
      LEFT JOIN categories c ON dc.category_id = c.id
      WHERE 1
    `;
    const params = [];
  
    if (category) {
      sql += " AND c.name = ?";
      params.push(category); // هنا بنضيف اسم التصنيف في الفلتر
    }
  
    if (minPrice) {
      sql += " AND d.price >= ?";
      params.push(minPrice);
    }
  
    if (maxPrice) {
      sql += " AND d.price <= ?";
      params.push(maxPrice);
    }
  
    if (name) {
      sql += " AND d.name LIKE ?";
      params.push(`%${name}%`);
    }
  
    sql += " GROUP BY d.id";
  
    return connection.promise()
      .query(sql, params)
      .then(([results]) => {
        return results.map(dish => ({
          ...dish,
          average_rating: dish.average_rating
            ? parseFloat(dish.average_rating).toFixed(1)
            : null,
          categories: dish.categories
            ? dish.categories.split(',')
            : []
        }));
      })
      .catch((err) => {
        console.error("Error in getAll:", err);
        throw err;
      });
  },
  
  


  


 
  









  

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const dishSql = `
        SELECT 
          d.id,
          d.name,
          d.description,
          d.price,
          d.image_path,
          AVG(r.rating) AS average_rating
        FROM 
          dishes d
        LEFT JOIN 
          reviews r ON d.id = r.dish_id
        WHERE 
          d.id = ?
        GROUP BY 
          d.id
      `;
  
      const commentsSql = `SELECT comment FROM reviews WHERE dish_id = ?`;
  
      const categoriesSql = `
        SELECT c.id, c.name 
        FROM categories c
        INNER JOIN dish_categories dc ON c.id = dc.category_id
        WHERE dc.dish_id = ?
      `;
  
      connection.query(dishSql, [id], (err, dishResults) => {
        if (err) return reject(err);
        if (dishResults.length === 0) return resolve(null);
  
        const dish = dishResults[0];
        dish.average_rating = dish.average_rating
          ? parseFloat(dish.average_rating).toFixed(1)
          : null;
  
        connection.query(commentsSql, [id], (err, commentsResults) => {
          if (err) return reject(err);
          dish.comments = commentsResults.map(row => row.comment);
  
          connection.query(categoriesSql, [id], (err, categoryResults) => {
            if (err) return reject(err);
  
            dish.categories = categoryResults.map(row => ({
              id: row.id,
              name: row.name
            }));
  
            resolve(dish);
          });
        });
      });
    });
  },
  
  
  
  


  create: (name, description, price, category, imagePath) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO dishes (name, description, price, image_path,  created_at) VALUES (?, ?, ?,  ?, NOW())";
 
      connection.promise().query(sql, [name, description, price, category, imagePath])
        .then(([results]) => {
          if (results && results.insertId) {
            resolve(results.insertId);
          } else {
            reject(new Error("لم يتم الحصول على insertId"));
          }
        })
        .catch(err => {
          console.error('Error in create dish:', err);
          reject(err);
        });
    });
  },

  update: (id, name, description, price, category) => {
    return connection
      .promise()
      .query(
        "UPDATE dishes SET name = ?, description = ?, price = ?, category = ? WHERE id = ?",
        [name, description, price, category, id]
      )
      .then(([result]) => result.affectedRows)
      .catch((err) => {
        throw err;
      });
  },

  delete: (id) => {
    return connection
      .promise()
      .query("DELETE FROM dishes WHERE id = ?", [id])
      .then(([result]) => result.affectedRows)
      .catch((err) => {
        console.error("Error in delete:", err);
        throw err;
      });
  },
  linkCategory: async (dishId, categoryId) => {
    try {
      const sql = "INSERT INTO dish_categories (dish_id, category_id) VALUES (?, ?)";
      const [result] = await connection.promise().query(sql, [dishId, categoryId]);
  
      return result;
    } catch (error) {
      console.error(`❌ Error linking dish ${dishId} with category ${categoryId}:`, error);
      throw new Error("فشل ربط الطبق بالفئة، تأكد من أن الفئة موجودة.");
    }
  }
  
  
  
};

module.exports = Dish;
