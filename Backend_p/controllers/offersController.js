const Offer = require("../models/Offers");

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.getAll();
    res.json(offers);
  } catch (error) {
    console.error("Error in getAllOffers:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب العروض", error: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.getById(id);
    if (!offer) {
      return res.status(404).json({ message: "العرض غير موجود" });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات العرض", error: error.message });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const { title, description, discount_percentage, start_date, end_date, dishIds } = req.body;

     let parsedDishIds = [];
    if (dishIds) {
        try {
            parsedDishIds = JSON.parse(dishIds);
            if (!Array.isArray(parsedDishIds)) {
                return res.status(400).json({ message: "dishIds must be an array." });
            }
        } catch (e) {
            return res.status(400).json({ message: "Invalid JSON format for dishIds." });
        }
    }

    const offerData = { title, description, discount_percentage, start_date, end_date };
    
    const newOffer = await Offer.create(offerData, parsedDishIds);

    res.status(201).json({
      message: "تم إنشاء العرض وربطه بالأطباق بنجاح",
      offer: newOffer,
    });
  } catch (error) {
    console.error("Create offer error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء إنشاء العرض",
      error: error.message,
    });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discount_percentage, start_date, end_date, is_active, dishIds } = req.body;

     let parsedDishIds = [];
    if (dishIds) {
        try {
            parsedDishIds = JSON.parse(dishIds);
            if (!Array.isArray(parsedDishIds)) {
                return res.status(400).json({ message: "dishIds must be an array." });
            }
        } catch (e) {
            return res.status(400).json({ message: "Invalid JSON format for dishIds." });
        }
    }
    
    const offerData = { title, description, discount_percentage, start_date, end_date, is_active };

    const updatedOffer = await Offer.update(id, offerData, parsedDishIds);
    
    if (!updatedOffer) {
      return res.status(404).json({ message: "العرض غير موجود" });
    }
    
    res.json({
        message: "تم تحديث العرض بنجاح",
        offer: updatedOffer
    });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات العرض", error: error.message });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Offer.delete(id);

    if (result === null) {
      return res.status(404).json({ message: "العرض غير موجود" });
    }

    res.json({ message: "تم حذف العرض بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف العرض", error: error.message });
  }
};
