const User = require('../models/User'); // استيراد موديل المستخدم



 

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين' });
  }
};

 exports.getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المستخدم' });
  }
};



exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User(name, email, password, role);
    const userId = await user.create();
    res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح', userId });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل المستخدم' });
  }
};  


exports.updateUser = async (req, res) => {
  try {
 
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = new User(name, email, password, role);
    await user.update(id);
    res.json({ message: 'تم تحديث بيانات المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث بيانات المستخدم' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المستخدم' });
  }
};




exports.deactivateUser = async (req, res) => {
  
  try {
    const { id } = req.params;


    console.log(id);

     
    
    await User.toggleActiveStatus(id);
    res.json({ message: 'تم التعديل المستخدم بنجاح' });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'حدث خطأ أثناء  التعديل المستخدم' ,error});
  }
};