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
  }
};

exports.createDish = (req, res) => {
  upload.single("image")(req, res, async (err) => {
    try {
      if (err) {
        console.error("Upload error:", err);
        return res
          .status(400)
          .json({ message: "حدث خطأ أثناء رفع الصورة", error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "لم يتم رفع الصورة" });
      }

      const imagePath = `uploads/${req.file.filename}`;
      const { name, description, price, category } = req.body;

      const parsedCategories = JSON.parse(category);

      console.log("Received data:", {
        name,
        description,
        price,
        parsedCategories,
        imagePath,
      });

      const newDishId = await Dish.create(name, description, price, imagePath);

      for (const catId of parsedCategories) {
        await Dish.linkCategory(newDishId, catId);
      }

      const newDish = await Dish.getDishesByIds([newDishId]); // Use the more detailed getter

      res.status(201).json({
        message: "تم إنشاء الطبق وربطه بالتصنيفات بنجاح",
        dish: newDish[0],
      });
    } catch (error) {
      console.error("Create dish error:", error);
      res.status(500).json({
        message: "حدث خطأ أثناء إنشاء الطبق",
        error: error.message,
      });
    }
  });
};

exports.updateDish = async (req, res) => {
  const { name, description, price, category } = req.body;

  console.log(name, description, price, category);

  try {
    const updatedRows = await Dish.update(
      req.params.id,
      name,
      description,
      price,
      category
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: "الطبق غير موجود" });
    }
    const updatedDish = await Dish.getDishesByIds([req.params.id]); // Use the more detailed getter
    res.json(updatedDish[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء تحديث بيانات الطبق", error });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "الطبق غير موجود" });
    }

    await Dish.delete(req.params.id);

    res.json({ message: "تم حذف الطبق بنجاح" });
  } catch (error) {
    if (error.success === false && error.error === "CANNOT_DELETE_RELATED_RECORDS_EXIST") {
        return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء حذف الطبق", error: error.message });
  }
};