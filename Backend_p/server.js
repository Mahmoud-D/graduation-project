const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs"); 
// Import routes
const userRoutes = require("./routes/userRoutes"); 
const dishRoutes = require("./routes/dishRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderDishRoutes = require("./routes/orderDishRoutes");
const authRoutes = require("./routes/authRoutes");
const reportsRoutes = require("./routes/reportsRoutes.js");
const promotionsRoutes = require("./routes/promotionsRoutes");
const reviewRoutes = require("./routes/reviewsRoutes");
const restaurantReviewsRoutes = require("./routes/restaurantReviewsRoutes");
  
const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const distinctiveDishRoutes = require("./routes/distinctiveDishRoutes");
const offersRoutes = require("./routes/offersRoutes");
const imageController = require("./controllers/imageController");

const { executeSqlQuery } = require("./controllers/sqlController");

const cors = require("cors");
const checkDatabaseConnection = require("./config/dbCheck.js");
 
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
app.use("/api/dishes", dishRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/restaurantReviews", restaurantReviewsRoutes);




app.use("/api/distinctive-dishes", distinctiveDishRoutes);

app.use("/api/offers", offersRoutes);

 app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes); 
 
// app.post('/send-email', emailController.sendEmail);
// app.get('/track/open', async (req, res) => {
//   const email = req.query.email;
//   await supabase.from('email_logs').update({ opened: true, opened_at: new Date() }).eq('email', email);

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
//   const staticData = {
//     to: "vimav57250@cotigz.com",  
//     subject: "Test Email", 
//     html: "<h1>This is a test email</h1>", 
//     text: "This is a test email", 
  // templateName: "testTemplate", 

  // templateData: {}, 
//     language: "ar", 
 // bcc: "bcc@example.com", 
//  attachments: [] 
//   };

//   try {
//     const emailResult = await sendEmail(staticData);

//     res.status(200).json({ message: "Email sent successfully!", result: emailResult });
//   } catch (error) {
//     console.error("Error in sending email:", error);
//     res.status(500).json({ message: "Failed to send email", error: error.message });
//   }
// });

// app.get("/api", (req, res) => {
//   res.send("API is working");
// });


app.use(express.static(path.join(__dirname, 'public')));

 app.get('/status', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'HTML.html'));
});

app.get("/api", async (req, res) => {
  try {
     const dbCheck = await checkDatabaseConnection();
    
     const uploadsDirExists = fs.existsSync(path.join(__dirname, "uploads"));
    
     const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };

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
        "/api/reports",
         "/api/execute-sql",
        "/api/send-email",
        "/api/track/click",]
    });

  } catch (error) {
    res.status(500).json({
      status: "API check failed",
      error: error.message,
      details: error.stack
    });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
