const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs"); // نحتاج مكتبة fs لفحص وجود الملف
// Import routes
const userRoutes = require("./routes/userRoutes"); // تأكد من إنشاء routes لمستخدميك
const dishRoutes = require("./routes/dishRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderDishRoutes = require("./routes/orderDishRoutes");
const authRoutes = require("./routes/authRoutes");
 const reportsRoutes = require("./routes/reportsRoutes.js");
const promotionsRoutes = require("./routes/promotionsRoutes");
const reviewRoutes = require("./routes/reviewsRoutes");
const restaurantReviewsRoutes = require("./routes/restaurantReviewsRoutes");
// paypalRoutes
const paypalRoutes = require("./routes/paypalRoutes");

const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const couponUsesRoutes = require("./routes/couponUsesRoutes");
const distinctiveDishRoutes = require("./routes/distinctiveDishRoutes");
 
const imageController = require("./controllers/imageController");

const { executeSqlQuery } = require("./controllers/sqlController");

const cors = require("cors");

const app = express();

app.use(bodyParser.json());
//  const  {sendEmail}  = require('./email-service/emailServices/emailService');

app.use(cors());

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*", 
   methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/uploads/:imageName", imageController.checkImageExists);

app.post("/api/execute-sql", executeSqlQuery);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/restaurantReviews", restaurantReviewsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/apply-coupon", couponUsesRoutes);
app.use("/api/distinctive-dishes", distinctiveDishRoutes);
 
app.use("/api/orderDishes", orderDishRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/paypal", paypalRoutes);









// app.post('/send-email', emailController.sendEmail);
// app.get('/track/open', async (req, res) => {
//   const email = req.query.email;
//   await supabase.from('email_logs').update({ opened: true, opened_at: new Date() }).eq('email', email);

//   // إرجاع صورة 1x1 شفافة
//   const img = Buffer.from(
//     'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'
//   );
//   res.writeHead(200, {
//     'Content-Type': 'image/gif',
//     'Content-Length': img.length,
//   });
//   res.end(img);
// });
// app.get('/track/click', async (req, res) => {
//   const { email, url } = req.query;
//   const originalUrl = decodeURIComponent(url);

//   await supabase.from('email_logs').update({ link_clicked: true, clicked_at: new Date() }).eq('email', email);

//   res.redirect(originalUrl);
// });

// app.get("/send-email", async (req, res) => {
//   // إدخال البيانات كـ Static Data
//   const staticData = {
//     to: "vimav57250@cotigz.com", // البريد الإلكتروني للمستلم
//     subject: "Test Email", // الموضوع
//     html: "<h1>This is a test email</h1>", // المحتوى HTML
//     text: "This is a test email", // المحتوى النصي
//     // templateName: "testTemplate", // اسم القالب (إذا كان موجودًا)
//     // templateData: {}, // البيانات التي سيتم استخدامها في القالب
//     language: "ar", // اللغة
//     // bcc: "bcc@example.com", // Cc إذا كنت ترغب في إضافته
//     // attachments: [] // المرفقات
//   };

//   try {
//     // استدعاء دالة إرسال البريد الإلكتروني مع البيانات الثابتة
//     const emailResult = await sendEmail(staticData);

//     // إرجاع نتيجة النجاح
//     res.status(200).json({ message: "Email sent successfully!", result: emailResult });
//   } catch (error) {
//     console.error("Error in sending email:", error);
//     res.status(500).json({ message: "Failed to send email", error: error.message });
//   }
// });

app.get("/api", (req, res) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
