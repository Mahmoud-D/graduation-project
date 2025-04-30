const db = require("../config/db");
const Promotion = require("../models/Promotion");

exports.getActivePromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAllActive();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDishesWithPromotions = async (req, res) => {
  try {
     
    const [dishes] = await db.promise().query(`
      SELECT d.*, p.discount_percentage 
      FROM dishes d
      JOIN promotions p ON d.id = p.dish_id
      WHERE p.is_active = TRUE
      AND NOW() BETWEEN p.start_date AND p.end_date
    `);
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.getAllPromotions(req.body);
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const promo = await Promotion.create(req.body);
    res.status(201).json(promo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promo = await Promotion.update(req.params.id, req.body);
    res.json(promo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.togglePromotion = async (req, res) => {
  try {
    const promo = await Promotion.toggleStatus(req.params.id);
    res.json(promo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deletePromotion = async (req, res) => {
  try {
    const promotionId = req.params.id;
    
     const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      return res.status(404).json({ message: 'العرض غير موجود' });
    }

    // حذف العرض
    const isDeleted = await Promotion.delete(promotionId);
    
    if (isDeleted) {
      res.json({ message: 'تم حذف العرض بنجاح' });
    } else {
      res.status(500).json({ message: 'فشل في حذف العرض' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'حدث خطأ أثناء حذف العرض',
      error: error.message 
    });
  }
};