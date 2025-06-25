const sql = require('../config/db'); 

exports.getAll = async () => {
  try {
    
    const query = sql`
      SELECT 
        o.*,
        COALESCE(
          (SELECT json_agg(d.*) 
           FROM dishes d
           JOIN offer_dishes od ON d.id = od.dish_id
           WHERE od.offer_id = o.id), 
          '[]'::json
        ) AS dishes
      FROM 
        offers o
      GROUP BY 
        o.id
      ORDER BY
        o.start_date DESC
    `;
    return query; 
  } catch (err) {
    console.error('❌ Error fetching offers:', err);
    throw err;
  }
};

/**
 * جلب عرض محدد بواسطة الـ ID مع الأطباق المرتبطة به
 */
exports.getById = async (id) => {
    try {
      const query = sql`
        SELECT 
          o.*,
          COALESCE(
            (SELECT json_agg(d.*) 
             FROM dishes d
             JOIN offer_dishes od ON d.id = od.dish_id
             WHERE od.offer_id = o.id), 
            '[]'::json
          ) AS dishes
        FROM 
          offers o
        WHERE 
          o.id = ${id}
        GROUP BY 
          o.id
      `;
      const result = await query;
      if (result.length === 0) return null; 
      return result[0]; 
    } catch (err) {
      console.error(`❌ Error fetching offer with id ${id}:`, err);
      throw err;
    }
  };

exports.create = async (offerData, dishIds) => {
  try {
    const result = await sql.begin(async (sql) => {
      const newOffer = await sql`
        INSERT INTO offers ${sql(offerData, 'title', 'description', 'discount_percentage', 'start_date', 'end_date')}
        RETURNING *
      `;

      const offerId = newOffer[0].id;
      let linkedDishes = [];

       if (dishIds && dishIds.length > 0) {
        const dishLinks = dishIds.map(dishId => ({ offer_id: offerId, dish_id: dishId }));
        linkedDishes = await sql`
          INSERT INTO offer_dishes ${sql(dishLinks, 'offer_id', 'dish_id')}
          RETURNING dish_id
        `;
      }
      
       return { ...newOffer[0], dishes: linkedDishes };
    });
    return result;
  } catch (err) {
    console.error('❌ Error creating offer:', err);
    throw err;
  }
};

 
exports.update = async (id, offerData, dishIds) => {
  try {
    const result = await sql.begin(async (sql) => {
       const updatedOffer = await sql`
        UPDATE offers SET ${sql(offerData, 'title', 'description', 'discount_percentage', 'start_date', 'end_date', 'is_active')}
        WHERE id = ${id}
        RETURNING *
      `;

      if (updatedOffer.length === 0) {
         throw new Error('Offer not found');
      }

       await sql`
        DELETE FROM offer_dishes WHERE offer_id = ${id}
      `;

      let linkedDishes = [];
       if (dishIds && dishIds.length > 0) {
        const dishLinks = dishIds.map(dishId => ({ offer_id: id, dish_id: dishId }));
        linkedDishes = await sql`
          INSERT INTO offer_dishes ${sql(dishLinks, 'offer_id', 'dish_id')}
          RETURNING dish_id
        `;
      }

      return { ...updatedOffer[0], dishes: linkedDishes };
    });
    return result;
  } catch (err) {
     if (err.message === 'Offer not found') return null;
    console.error(`❌ Error updating offer with id ${id}:`, err);
    throw err;
  }
};

 
exports.delete = async (id) => {
  try {



    const query = sql`
      DELETE FROM offers WHERE id = ${id} RETURNING id
    `;
    const result = await query;
    if (result.length === 0) return null; 

    return true; 

  } catch (err) {
    console.error(`❌ Error deleting offer with id ${id}:`, err);
    throw err;
  }
};



 