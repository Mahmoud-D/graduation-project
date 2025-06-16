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
const  checkDatabaseConnection  = require("./config/dbCheck.js");

const cors = require("cors");
 
const app = express();

app.use(bodyParser.json());
 
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






 


app.get("/api", async (req, res) => {
  try {
    // 1. فحص اتصال قاعدة البيانات
    const dbCheck = await checkDatabaseConnection();
    
    // 2. فحص وجود مجلد uploads
    const uploadsDirExists = fs.existsSync(path.join(__dirname, "uploads"));
    
    // 3. معلومات النظام الأساسية
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };

    // 4. الرد النهائي
    res.json({
      status: "API is operational",
      timestamp: new Date().toISOString(),
      database: dbCheck,
      filesystem: {
        uploadsDirectory: uploadsDirExists ? "Available" : "Not available"
      },
      system: systemInfo,
      routes: [
        "/api/users",
        "/api/dishes",
        "/api/orders",
        "/api/auth",
        // أضف بقية الروابط هنا
      ]
    });

  } catch (error) {
    res.status(500).json({
      status: "API check failed",
      error: error.message,
      details: error.stack
    });
  }
});
 
app.use(express.static('public'));
// إضافة هذا المسار لتقديم صفحة HTML
app.get('/api/status', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML.html'));
  });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
