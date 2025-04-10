const Dish = require('../models/Dish'); // استيراد موديل الطبق
const upload = require('../utils/upload'); // استيراد إعدادات Multer من utils


// الحصول على جميع الأطباق
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.getAll(); // جلب جميع الأطباق من قاعدة البيانات
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الأطباق', error });
  }
};

// الحصول على طبق بواسطة الـ ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.getById(req.params.id); // جلب الطبق باستخدام الـ ID
    if (!dish) {
      return res.status(404).json({ message: 'الطبق غير موجود' });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات الطبق', error });
  }
};


exports.createDish = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'حدث خطأ أثناء رفع الصورة', error: err });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'لم يتم رفع الصورة' });
    }

    const imagePath = `uploads/${req.file.filename}`;
    
    const { name, description, price, category } = req.body;
    
    try {
      const newDishId = await Dish.create(name, description, price, category, imagePath);
      
      const newDish = await Dish.getById(newDishId);
      
      res.status(201).json(newDish);
    } catch (error) {
      res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الطبق', error });
    }
  });
};










// تحديث بيانات طبق
exports.updateDish = async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const updatedRows = await Dish.update(req.params.id, name, description, price, category);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'الطبق غير موجود' });
    }
    // بعد التحديث، جلب الطبق الذي تم تحديثه
    const updatedDish = await Dish.getById(req.params.id);
    res.json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث بيانات الطبق', error });
  }
};

// حذف طبق
exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.getById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'الطبق غير موجود' });
    }
    // يمكنك إضافة حذف الطبق من قاعدة البيانات هنا إذا لزم الأمر
    // حذف الطبق باستخدام الـ ID
    const deletedRows = await Dish.delete(req.params.id);
    if (deletedRows > 0) {
      res.json({ message: 'تم حذف الطبق بنجاح' });
    } else {
      res.status(500).json({ message: 'حدث خطأ أثناء حذف الطبق' });
    }
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الطبق', error });
  }
};
