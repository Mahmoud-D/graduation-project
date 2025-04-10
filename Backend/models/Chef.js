// models/Chef.js

const connection = require("../config/db");

// Create Chef Model
const Chef = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM chefs", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM chefs WHERE id = ?",
        [id],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  async create() {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())';
      connection.query(sql, [this.name, this.email, this.password, this.role], (err, results) => {
        if (err) {
          console.error('❌ Error inserting user:', err);
          return reject(err);
        }
  
        console.log('✅ Insert results:', results); // دي أهم سطر حاليًا
  
        if (!results || !results.insertId) {
          return reject(new Error('❌ User creation failed. No insertId returned.'));
        }
  
        resolve(results.insertId);
      });
    });
  }
  
  
};

module.exports = Chef;
