const Category = require('../models/category'); // تأكد من وجود الموديل الخاص بالفئات

// جلب جميع الفئات
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الفئات", error });
  }
};

// إضافة فئة جديدة
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "يرجى تقديم الاسم والوصف" });
  }

  try {
    const newCategory = await Category.create(name, description);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة الفئة", error });
  }
};

// تعديل فئة
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "يرجى تقديم الاسم والوصف" });
  }

  try {
    const updatedCategory = await Category.update(id, name, description);
    if (updatedCategory) {
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "الفئة غير موجودة" });
    }
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تعديل الفئة", error });
  }
};

// حذف فئة
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.delete(id);
    if (deletedCategory) {
      res.json({ message: "تم حذف الفئة بنجاح" });
    } else {
      res.status(404).json({ message: "الفئة غير موجودة" });
    }
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف الفئة", error });
  }
};





exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.delete(id);
    if (deletedCategory) {
      res.json({ message: "تم حذف الفئة بنجاح" });
    } else {
      res.status(404).json({ message: "الفئة غير موجودة" });
    }
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف الفئة", error });
  }
};
