// authController.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/emailService");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // التحقق من وجود البيانات المطلوبة
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "يجب إدخال البريد الإلكتروني وكلمة المرور",
    });
  }

  try {
    // البحث عن المستخدم
    const user = await User.findByEmail(email);

    // حالة عدم وجود المستخدم
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "الحساب غير موجود",
        hint: "قد يكون البريد الإلكتروني غير صحيح",
      });
    }

    // حالة الحساب غير المفعل
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "حساب غير مفعل",
        action_required: "التحقق من البريد الإلكتروني وتفعيل الحساب",
      });
    }

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "معلومات الدخول غير صحيحة",
        hint: "كلمة المرور غير صحيحة",
      });
    }

    // إنشاء Token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "JWT_SECRET",
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // إرجاع الاستجابة الناجحة
    res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في الخادم",
      system_message: error.message,
      error: error,
      hint: "الرجاء المحاولة مرة أخرى لاحقًا",
    });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(req.body);

  // return

  try {
    const newUser = new User(name, email, password, role || "user");
    const userId = await newUser.create();

    const token = generateToken(userId);

    const frontendUrl = process.env.FRONTEND_URL; // fallback إذا لم يكن موجودًا في الـ headers
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    console.log(verificationLink);

    const subject = "مرحبًا بك في مطعمنا م";
    const text = `مرحبًا ${name},\n\nشكرًا لتسجيلك في مطعمنا! نحن متحمسون أن تكون جزءًا من عائلتنا. لبدء تجربتك مع أفضل الأطباق لدينا، يرجى التحقق من بريدك الإلكتروني عبر الرابط أدناه:\n\n${verificationLink}\n\nنتمنى لك تجربة لذيذة! 🍴`;

    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
         
          .content {
            margin-top: 20px;
            text-align: center;
          }
          .cta-button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 16px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
         
          <div class="content">
             <a href="${verificationLink}" class="cta-button">تحقق من بريدك الإلكتروني</a>
          </div>
         
        </div>
      </body>
    </html>
  `;

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
    const userId = decoded.userId;
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    if (user.is_verified) {
      return res.status(404).json({ message: "المستخدم تم توثيقة بالفعل  " });
    }

    await User.update(user.id, { is_verified: true });

    res.status(200).json({ message: "تم التحقق من البريد الإلكتروني بنجاح!" });
  } catch (error) {
    console.error("❌ Error in verifyEmail:", error);
    res.status(500).json({
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

    res
      .status(200)
      .json({ message: "تم إعادة إرسال رابط التوثيق إلى بريدك الإلكتروني" });
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
      return res.status(404).json({
        message: "إن كنت مسجلا فقد ارسلنا الان لك رسالة بها خطوات التسجيل ",
      });
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

    res.status(200).json({
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
  } catch (error) {
    console.error("❌ Error in sendResetPasswordEmail:", error);
    res.status(500).json({
      message:
        error.message || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    // 1. التحقق من صحة التوكين
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
    const userId = decoded.userId;

    // 2. التحقق أن المستخدم موجود
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // 3. تحديث كلمة السر
    const hashedPassword = await User.hashPassword(newPassword);
    await User.update(user.id, { password: hashedPassword });

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    res.status(500).json({
      message: error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور",
    });
  }
};
