const sql = require("../config/db");

// Get all dishes
const Dish = {
  getAll: async ({ category, minPrice, maxPrice, name }) => {
    let query = sql`
      WITH latest_promotion AS (
        SELECT 
          dish_id,
          discount_percentage,
          start_date,
          end_date,
          is_active,
          created_at,
          ROW_NUMBER() OVER (
            PARTITION BY dish_id 
            ORDER BY created_at DESC, discount_percentage DESC
          ) AS rn
        FROM promotions
        WHERE is_active = true
          AND CURRENT_TIMESTAMP BETWEEN start_date AND end_date
      )
      SELECT 
        d.id,
        d.name,
        d.description,
        d.price AS old_price,  -- تم تغيير هذا من price إلى old_price
        d.image_path,
        d.created_at,
        AVG(r.rating) AS average_rating,
        STRING_AGG(c.name, ',') AS categories,
        lp.discount_percentage,
        CASE
          WHEN lp.discount_percentage IS NOT NULL
          THEN ROUND(d.price * (1 - lp.discount_percentage/100), 2)
          ELSE d.price
        END AS price,
        lp.start_date AS promotion_start,
        lp.end_date AS promotion_end,
        CASE
          WHEN lp.discount_percentage IS NULL THEN 'no promotion'
          ELSE 'active'
        END AS promotion_status
      FROM dishes d
      LEFT JOIN reviews r ON d.id = r.dish_id
      LEFT JOIN dish_categories dc ON d.id = dc.dish_id
      LEFT JOIN categories c ON dc.category_id = c.id
      LEFT JOIN latest_promotion lp ON d.id = lp.dish_id AND lp.rn = 1
      WHERE TRUE
    `;
    const params = [];

    if (category) {
      query = sql`${query} AND c.name = ${category}`;
    }

    if (minPrice) {
      query = sql`${query} AND d.price >= ${minPrice}`;
    }

    if (maxPrice) {
      query = sql`${query} AND d.price <= ${maxPrice}`;
    }

    if (name) {
      query = sql`${query} AND d.name ILIKE ${`%${name}%`}`;
    }

    query = sql`${query} GROUP BY d.id, lp.discount_percentage, lp.start_date, lp.end_date`;

    try {
      const result = await query;
      return result.map((dish) => {
        const baseDish = {
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          old_price: dish.old_price,
          image_path: dish.image_path,
          created_at: dish.created_at,
          average_rating: dish.average_rating
            ? parseFloat(dish.average_rating).toFixed(1)
            : null,
          categories: dish.categories ? dish.categories.split(",") : [],
        };

        if (dish.discount_percentage) {
          return {
            ...baseDish,
            promotion: {
              discount_percentage: dish.discount_percentage,
              final_price: dish.price,
              start_date: dish.promotion_start,
              end_date: dish.promotion_end,
              status: dish.promotion_status,
            },
          };
        }

        return baseDish;
      });
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    }
  },
  // Get dish by ID
  getDishesByIds: async (ids) => {
    if (!Array.isArray(ids)) {
      if (typeof ids === 'string') {
        try {
          ids = JSON.parse(ids);
          if (!Array.isArray(ids)) ids = [Number(ids)];
        } catch {
          ids = ids.split(',').map(x => Number(x.trim()));
        }
      } else if (typeof ids === 'number') {
        ids = [ids];
      } else {
        throw new Error("يجب تقديم مصفوفة من IDs صالحة");
      }
    }
  
    ids = ids.map(Number).filter((x) => !isNaN(x));
  
    if (ids.length === 0) return [];
  
   
    try {
      const result = await sql`
        WITH active_promotions AS (
          SELECT 
            dish_id,
            discount_percentage,
            start_date,
            end_date,
            created_at,
            ROW_NUMBER() OVER (
              PARTITION BY dish_id 
              ORDER BY created_at DESC, discount_percentage DESC
            ) AS rn
          FROM promotions
          WHERE is_active = true
            AND CURRENT_TIMESTAMP BETWEEN start_date AND end_date
        )
        SELECT 
          d.id,
          d.name,
          d.description,
          d.price AS old_price,
          d.image_path,
          d.created_at,
          COALESCE(AVG(r.rating), 0) AS average_rating,
          COALESCE(STRING_AGG(DISTINCT c.name, ','), '') AS categories,
          p.discount_percentage,
          CASE
            WHEN p.discount_percentage IS NOT NULL
            THEN ROUND(d.price * (1 - p.discount_percentage/100), 2)
            ELSE d.price
          END AS price,
          p.start_date AS promotion_start,
          p.end_date AS promotion_end,
          CASE
            WHEN p.discount_percentage IS NULL THEN 'no promotion'
            ELSE 'active'
          END AS promotion_status
        FROM dishes d
        LEFT JOIN reviews r ON d.id = r.dish_id
        LEFT JOIN dish_categories dc ON d.id = dc.dish_id
        LEFT JOIN categories c ON dc.category_id = c.id
        LEFT JOIN active_promotions p ON d.id = p.dish_id AND p.rn = 1
        WHERE d.id = ANY(${sql`${ids}`})
        GROUP BY d.id, p.discount_percentage, p.start_date, p.end_date
      `;
  
      return result.map((dish) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: parseFloat(dish.price),
        old_price: parseFloat(dish.old_price),
        image_path: dish.image_path,
        created_at: dish.created_at,
        average_rating: parseFloat(dish.average_rating).toFixed(1),
        categories: dish.categories
          ? dish.categories.split(",").filter(Boolean)
          : [],
        ...(dish.discount_percentage && {
          promotion: {
            discount_percentage: parseFloat(dish.discount_percentage),
            final_price: parseFloat(dish.price),
            start_date: dish.promotion_start,
            end_date: dish.promotion_end,
            status: dish.promotion_status,
          },
        }),
      }));
    } catch (err) {
      console.error("PostgreSQL Error:", err);
      throw new Error("فشل في جلب بيانات الأطباق: " + err.message);
    }
  },
  
  findById: async (id) => {
    if (!id) {
      throw new Error("Invalid dish ID");
    }

    try {
      const result = await sql`
        SELECT * FROM dishes WHERE id = ${id}
      `;
      return result[0] || null;
    } catch (err) {
      console.error("Error in findById:", err);
      throw new Error("Failed to retrieve dish: " + err.message);
    }
  },

  // getById: async (id) => {
  //   const dishSql = sql`
  //     SELECT
  //       d.id,
  //       d.name,
  //       d.description,
  //       d.price,
  //       d.image_path,
  //       AVG(r.rating) AS average_rating
  //     FROM dishes d
  //     LEFT JOIN reviews r ON d.id = r.dish_id
  //     WHERE d.id = ${id}
  //     GROUP BY d.id
  //   `;

  //   const commentsSql = sql`SELECT comment FROM reviews WHERE dish_id = ${id}`;

  //   const categoriesSql = sql`
  //     SELECT c.id, c.name
  //     FROM categories c
  //     INNER JOIN dish_categories dc ON c.id = dc.category_id
  //     WHERE dc.dish_id = ${id}
  //   `;

  //   try {
  //     const dishResult = await dishSql;
  //     if (dishResult.length === 0) return null;

  //     const dish = dishResult[0];
  //     dish.average_rating = dish.average_rating ? parseFloat(dish.average_rating).toFixed(1) : null;

  //     const commentsResult = await commentsSql;
  //     dish.comments = commentsResult.map(row => row.comment);

  //     const categoriesResult = await categoriesSql;
  //     dish.categories = categoriesResult.map(row => ({ id: row.id, name: row.name }));

  //     return dish;
  //   } catch (err) {
  //     console.error("Error in getById:", err);
  //     throw err;
  //   }
  // },

  // Create new dish
  create: async (name, description, price, imagePath) => {
    const sqlQuery = sql`
      INSERT INTO dishes (name, description, price, image_path, created_at)
      VALUES (${name}, ${description}, ${price}, ${imagePath}, NOW()) RETURNING id
    `;

    try {
      const result = await sqlQuery;
      return result[0].id;
    } catch (err) {
      console.error("Error in create dish:", err);
      throw err;
    }
  },

  // Update dish details
  update: async (id, name, description, price) => {
    const query = sql`
      UPDATE dishes
      SET name = ${name}, description = ${description}, price = ${price}
      WHERE id = ${id}
    `;

    try {
      const result = await query;
      return result.rowCount;
    } catch (err) {
      console.error("Error in update dish:", err);
      throw err;
    }
  },

  // Delete dish by ID
  delete: async (id) => {
    const query = sql`DELETE FROM dishes WHERE id = ${id}`;

    try {
      const result = await query;
      return result;
    } catch (err) {
      if (err.code === "23503") {
        // Foreign key violation code
        throw {
          success: false,
          error: "CANNOT_DELETE_RELATED_RECORDS_EXIST",
          message: "لا يمكن الحذف بسبب وجود عناصر مرتبطة بهذا الطبق",
        };
      }

      console.error("Error in delete:", err);
      throw err;
    }
  },

  // Link dish to a category
  linkCategory: async (dishId, categoryId) => {
    const query = sql`
      INSERT INTO dish_categories (dish_id, category_id)
      VALUES (${dishId}, ${categoryId})
    `;

    try {
      const result = await query;
      return result.rowCount;
    } catch (err) {
      console.error(
        `❌ Error linking dish ${dishId} with category ${categoryId}:`,
        err
      );
      throw new Error("فشل ربط الطبق بالفئة، تأكد من أن الفئة موجودة.");
    }
  },

  search: async (keyword) => {
    const pattern = `%${keyword}%`;
    try {
      const results = await sql`
      SELECT id, name, description, price, image_path
      FROM dishes
      WHERE translate(
              translate(lower(name), 'أإآ', 'ااا'),
              'ى', 'ي'
            ) ILIKE translate(
              translate(lower(${pattern}), 'أإآ', 'ااا'),
              'ى', 'ي'
            )
      ORDER BY name
      LIMIT 50;
    `;
      return results;
    } catch (err) {
      throw err;
    }
  },

  getTopSellingDishes: async (dishId, categoryId) => {
    const query = sql`
  SELECT d.name AS dish_name, SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN dishes d ON oi.dish_id = d.id
GROUP BY d.name
ORDER BY total_sold DESC
LIMIT 10;

    `;

    try {
      const result = await query;
      return result;
    } catch (err) {
      console.error(
        `❌ Error linking dish ${dishId} with category ${categoryId}:`,
        err
      );
      throw new Error("فشل ربط الطبق بالفئة، تأكد من أن الفئة موجودة.");
    }
  },
  getDailyDishesSales: async (dishId, categoryId) => {
    const query = sql`
SELECT DATE(created_at) AS date, SUM(quantity) AS total_dishes_sold  
FROM order_items  
GROUP BY date  
ORDER BY date;
    `;

    try {
      const result = await query;
      return result;
    } catch (err) {
      console.error(
        `❌ Error linking dish ${dishId} with category ${categoryId}:`,
        err
      );
      throw new Error("فشل ربط الطبق بالفئة، تأكد من أن الفئة موجودة.");
    }
  },
};

module.exports = Dish;
