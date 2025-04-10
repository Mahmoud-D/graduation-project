const Chef = require('../models/Chef'); // استيراد موديل الطاهي

// دالة للحصول على جميع الطهاة
exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await Chef.find(); // جلب جميع الطهاة من قاعدة البيانات
    res.status(200).json(chefs); // إرسال الطهاة كاستجابة
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الطهاة" }); // إرسال رسالة خطأ إذا فشل العملية
  }
};

// دالة للحصول على طاهٍ حسب الـ ID
exports.getChefById = async (req, res) => {
  const { id } = req.params; // الحصول على الـ id من الـ params
  
  try {
    const chef = await Chef.findById(id); // البحث عن الطاهي بواسطة الـ id
    if (!chef) {
      return res.status(404).json({ message: "لم يتم العثور على الطاهي" }); // إذا لم يتم العثور على الطاهي
    }
    res.status(200).json(chef); // إرسال بيانات الطاهي إذا تم العثور عليه
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الطاهي" }); // إرسال رسالة خطأ إذا فشل العملية
  }
};

// دالة لإنشاء طاهٍ جديد
exports.createChef = async (req, res) => {
  const { name, experience, cuisine } = req.body; // الحصول على بيانات الطاهي من الـ body
  
  try {
    const newChef = new Chef({ name, experience, cuisine }); // إنشاء طاهي جديد
    await newChef.save(); // حفظ الطاهي في قاعدة البيانات
    res.status(201).json({ message: "تم إضافة الطاهي بنجاح", newChef }); // إرسال رد بنجاح إضافة الطاهي
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة الطاهي" }); // إرسال رسالة خطأ في حال الفشل
  }
};

// دالة لتحديث بيانات الطاهي
exports.updateChef = async (req, res) => {
  const { id } = req.params; // الحصول على الـ id من الـ params
  const { name, experience, cuisine } = req.body; // الحصول على بيانات التحديث من الـ body
  
  try {
    const chef = await Chef.findByIdAndUpdate(id, { name, experience, cuisine }, { new: true }); // تحديث الطاهي
    if (!chef) {
      return res.status(404).json({ message: "لم يتم العثور على الطاهي" }); // إذا لم يتم العثور على الطاهي
    }
    res.status(200).json({ message: "تم تحديث الطاهي بنجاح", chef }); // إرسال رد بنجاح التحديث
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تحديث الطاهي" }); // إرسال رسالة خطأ في حال الفشل
  }
};

// دالة لحذف طاهٍ
exports.deleteChef = async (req, res) => {
  const { id } = req.params; // الحصول على الـ id من الـ params
  
  try {
    const chef = await Chef.findByIdAndDelete(id); // البحث عن الطاهي وحذفه
    if (!chef) {
      return res.status(404).json({ message: "لم يتم العثور على الطاهي" }); // إذا لم يتم العثور على الطاهي
    }
    res.status(200).json({ message: "تم حذف الطاهي بنجاح" }); // إرسال رد بنجاح الحذف
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف الطاهي" }); // إرسال رسالة خطأ في حال الفشل
  }
};
