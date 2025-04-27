// authController.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/emailService");

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

// exports.register = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const newUser = new User(name, email, password, role || "user");
//     const userId = await newUser.create();

//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(201).json({ message: "تم إنشاء المستخدم بنجاح", userId, token });
//   } catch (error) {
//     console.error("❌ Error in register:", error);
//     res.status(500).json({ message: error.message || "حدث خطأ أثناء التسجيل" });
//   }
// };

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. إنشاء مستخدم جديد
    const newUser = new User(name, email, password, role || "user");
    const userId = await newUser.create(); // التأكد من أن create يتم بشكل صحيح بعد تشفير كلمة السر

    // 2. توليد التوكن
    const token = generateToken(userId);

    // 3. إنشاء رابط التوثيق
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const subject = "Welcome to Our Service!";
    const text = `Hi ${name},\n\nThank you for signing up with our service. Please click the link below to verify your email address:\n\n${verificationLink}`;
    const html = `<p>Hi ${name},</p><p>Thank you for signing up with our service. Please click the link below to verify your email address:</p><a href="${verificationLink}">${verificationLink}</a>`;
    const category = "User Registration";
    const senderName = "Your Team"; // تخصيص اسم المرسل

    // 4. إرسال البريد الإلكتروني مع التوكين
    await sendEmail({
      to: email, // إرسال البريد إلى المستخدم الجديد
      subject, // الموضوع
      text, // نص البريد
      html, // نص HTML للبريد
      category, // فئة البريد الإلكتروني
      senderName, // اسم المرسل
    });

    // 5. الرد على العميل مع التوكن والمعلومات الأساسية
    res.status(201).json({
      message:
        "تم إنشاء المستخدم بنجاح، تحقق من بريدك الإلكتروني لتفعيل الحساب.",
      // userId,
      // token,
    });
  } catch (error) {
    console.error("❌ Error in register:", error);
    res.status(500).json({ message: error.message || "حدث خطأ أثناء التسجيل" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // التحقق من أن المستخدم موجود
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    if (user.is_verified) {
      return res.status(404).json({ message: "المستخدم تم توثيقة بالفعل  " });
    }

    console.log(user);

    await User.update(user.id, { is_verified: true });

    res.status(200).json({ message: "تم التحقق من البريد الإلكتروني بنجاح!" });
  } catch (error) {
    console.error("❌ Error in verifyEmail:", error);
    res
      .status(500)
      .json({
        message: error.message || "حدث خطأ أثناء التحقق من البريد الإلكتروني",
      });
  }
};



exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
     const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

     if (user.is_verified) {
      return res.status(400).json({ message: "المستخدم موثّق بالفعل" });
    }

     const token = generateToken(user.id);

 
 
 
     const subject = "تأكيد بريدك الإلكتروني مجددًا";
    const text = `مرحبًا ${user.name},\n\nاضغط على الرابط التالي لتوثيق حسابك:\n${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = `<p>مرحبًا ${user.name},</p><p>اضغط على الرابط التالي لتوثيق حسابك:</p><a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">توثيق البريد</a>`;

    const category = "Resend Verification";
    const senderName = "Your Team";

    // 5. إرسال الإيميل
    await sendEmail({
      to: email,
      subject,
      text,
      html,
      category,
      senderName,
    });

    res.status(200).json({ message: "تم إعادة إرسال رابط التوثيق إلى بريدك الإلكتروني" });

  } catch (error) {
    console.error("❌ Error in resendVerificationEmail:", error);
    res.status(500).json({
      message: error.message || "حدث خطأ أثناء إعادة إرسال رابط التوثيق",
    });
  }
};



exports.sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. التأكد أن المستخدم موجود
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "إن كنت مسجلا فقد ارسلنا الان لك رسالة بها خطوات التسجيل " });
    }

    // 2. إنشاء توكين جديد
    const token = generateToken(user.id); // ممكن تخصص نوع التوكين لو تحب
    
    // 3. تحضير محتوى الإيميل
    const subject = "إعادة تعيين كلمة المرور";
    const text = `مرحبًا ${user.name},\n\nاضغط على الرابط التالي لإعادة تعيين كلمة المرور:\n${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = `<p>مرحبًا ${user.name},</p><p>اضغط على الرابط التالي لإعادة تعيين كلمة المرور:</p><a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">إعادة تعيين كلمة المرور</a>`;

    const category = "Password Reset";
    const senderName = "Your Team";

    // 4. إرسال الإيميل
    await sendEmail({
      to: email,
      subject,
      text,
      html,
      category,
      senderName,
    });

    res.status(200).json({ message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" });

  } catch (error) {
    console.error("❌ Error in sendResetPasswordEmail:", error);
    res.status(500).json({
      message: error.message || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور",
    });
  }
};



exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    // 1. التحقق من صحة التوكين
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // 2. التحقق أن المستخدم موجود
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // 3. تحديث كلمة السر
    const hashedPassword = await User.hashPasswordStatic(newPassword);
    await User.update(user.id, { password: hashedPassword });

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });

  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    res.status(500).json({
      message: error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور",
    });
  }
};
