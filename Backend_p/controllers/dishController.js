const Dish = require("../models/Dish"); // استيراد موديل الطبق
const upload = require("../utils/upload"); // استيراد إعدادات Multer من utils

exports.getAllDishes = async (req, res) => {
  const { q, sortBy, filterByCategory, minPrice, maxPrice } = req.query;

  try {
    const dishes = await Dish.getAll({
      name: q,
      category: filterByCategory,
      minPrice,
      maxPrice,
      sortBy,
    });

    res.json(dishes);
  } catch (error) {
    console.error("Error in getAllDishes:", error);
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء جلب الأطباق", error: error.message });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.getDishesByIds(req.body.ids); // جلب الطبق باستخدام الـ ID
    if (!dish) {
      return res.status(404).json({ message: "الطبق غير موجود" });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات الطبق", error });
  }
};

exports.getDishByIdParam = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);


    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }


    res.status(200).json(dish);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dish", error: error.message });
    res
      .status(500)
      .json({ message: "Error fetching dish", error: error.message });
  }
};

exports.createDish = async (req, res) => {
  try {
    // 1. التحقق من وجود الملف (تم الرفع بواسطة multer)
    if (!req.file) {
      return res.status(400).json({ message: "لم يتم رفع الصورة" });
    }

    // 2. معالجة البيانات
    const imagePath = `uploads/${req.file.filename}`;
    const { name, description, price, category } = req.body;

    // 3. تحليل التصنيفات بشكل آمن
    let parsedCategories = [];
    try {
      parsedCategories = JSON.parse(category);
      if (!Array.isArray(parsedCategories)) {
        parsedCategories = [parsedCategories];
      }
    } catch (e) {
      return res.status(400).json({ message: "تنسيق التصنيفات غير صالح" });
    }

    // 4. إنشاء الطبق
    const newDishId = await Dish.create(name, description, price, imagePath);

    // 5. ربط التصنيفات
    for (const catId of parsedCategories) {
      await Dish.linkCategory(newDishId, catId);
    }

    // 6. إرجاع النتيجة
    const newDish = await Dish.findById(newDishId);
    res.status(201).json({
      message: "تم إنشاء الطبق بنجاح",
      dish: newDish,
    });
  } catch (error) {
    console.error("Create dish error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء إنشاء الطبق",
      error: error.message,
    });
  }
};
exports.updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    // التحقق من وجود الطبق
    const existingDish = await Dish.findById(id);
    if (!existingDish) {
      return res.status(404).json({ message: "الطبق غير موجود" });
    }

    // إنشاء كائن التحديث مع تجنب القيم غير المعرّفة
    const updateData = {};
    if (name !== undefined && name !== null) updateData.name = name;
    if (description !== undefined && description !== null) updateData.description = description;
    if (price !== undefined && price !== null) updateData.price = price;

    // التحديث فقط إذا كان هناك بيانات للتحديث
    if (Object.keys(updateData).length > 0) {
      await Dish.update(id, updateData);
    }

    // معالجة الصورة إذا تم رفعها
    if (req.file) {
      const imagePath = `uploads/${req.file.filename}`;
      await Dish.updateImage(id, imagePath);
    }

    // معالجة التصنيفات إذا تم تقديمها
    if (category !== undefined && category !== null) {
      let parsedCategories = [];
      try {
        parsedCategories = JSON.parse(category);
        if (!Array.isArray(parsedCategories)) {
          parsedCategories = [parsedCategories];
        }
      } catch (e) {
        return res.status(400).json({ message: "تنسيق التصنيفات غير صالح" });
      }

      await Dish.clearCategories(id);
      for (const catId of parsedCategories) {
        await Dish.linkCategory(id, catId);
      }
    }

    // إرجاع الطبق المحدث
    const updatedDish = await Dish.findById(id);
    res.status(200).json({
      message: "تم تحديث الطبق بنجاح",
      dish: updatedDish,
    });

  } catch (error) {
    console.error("Update dish error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث الطبق",
      error: error.message,
    });
  }
};


// في ملف models/Dish.js


exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "الطبق غير موجود" });
    }

    const deletedRows = await Dish.delete(req.params.id);
    console.log(deletedRows);

    if (deletedRows.length == 0) {
      res.json({ message: "تم حذف الطبق بنجاح" });
    } else {
      res.status(500).json({ message: "حدث خطأ أثناء حذف الطبق" });
    }
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(400)
        .json({ message: "لا يمكن حذف الطبق لأنه مرتبط بعروض ترويجية" });
    }
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء حذف الطبق", error: error.message });
  }
};
