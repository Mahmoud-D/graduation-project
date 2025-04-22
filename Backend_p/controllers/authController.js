// authController.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email); // استخدم الدالة المناسبة في الموديل
    if (!user) {
      return res
        .status(401)
        .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء تسجيل الدخول", error: error.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const newUser = new User(name, email, password, role || "user");
    const userId = await newUser.create();

  
 
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "تم إنشاء المستخدم بنجاح", userId, token });
  } catch (error) {
    console.error("❌ Error in register:", error);
    res.status(500).json({ message: error.message || "حدث خطأ أثناء التسجيل" });
  }
};
