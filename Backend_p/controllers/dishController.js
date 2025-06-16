const Dish = require("../models/Dish"); // استيراد موديل الطبق
const upload = require("../utils/upload"); // استيراد إعدادات Multer من utils

exports.getAllDishes = async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    name, 
    q
  } = req.query;

  try {
    let dishes;
    if (q) {
      dishes = await Dish.search(q);
    } else { 
        dishes = await Dish.getAll({
        category,
        minPrice,
        maxPrice,
        name
      });
    }

    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الأطباق", error });
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
    res.status(500).json({ message: "Error fetching dish", error: error.message });
  }
};

exports.createDish = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    try {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ message: 'حدث خطأ أثناء رفع الصورة', error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'لم يتم رفع الصورة' });
      }

      const imagePath = `uploads/${req.file.filename}`;
      const { name, description, price, category } = req.body;

      const parsedCategories = JSON.parse(category);

      console.log('Received data:', { name, description, price, parsedCategories, imagePath });

      const newDishId = await Dish.create(name, description, price, imagePath);


      for (const catId of parsedCategories) {
        await Dish.linkCategory(newDishId, catId);
      }


      


 

      const newDish = await Dish.getById(newDishId);
      
      res.status(201).json({
        message: "تم إنشاء الطبق وربطه بالتصنيفات بنجاح",
        dish: newDish,
       });

    } catch (error) {
      console.error('Create dish error:', error);
      res.status(500).json({ 
        message: 'حدث خطأ أثناء إنشاء الطبق',
        error: error.message 
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
    const updatedDish = await Dish.getById(req.params.id);
    res.json(updatedDish);
  } catch (error) {
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء تحديث بيانات الطبق", error });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.getById(req.params.id);
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
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ message: "لا يمكن حذف الطبق لأنه مرتبط بعروض ترويجية" });
    }
    res.status(500).json({ message: "حدث خطأ أثناء حذف الطبق", error: error.message });
  }
  
};


