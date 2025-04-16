const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // نحتاج مكتبة fs لفحص وجود الملف
// Import routes
const userRoutes = require('./routes/userRoutes'); // تأكد من إنشاء routes لمستخدميك
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderDishRoutes = require('./routes/orderDishRoutes');
  const authRoutes = require('./routes/authRoutes');
 const promotionsRoutes = require('./routes/promotionsRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const couponUsesRoutes = require('./routes/couponUsesRoutes');
const distinctiveDishRoutes = require('./routes/distinctiveDishRoutes');
const imageController = require('./controllers/imageController');
const {executeSqlQuery} = require('./controllers/sqlController');

const cors = require('cors');


const app = express();

app.use(bodyParser.json());
const User = require('./models/User');
const db = require('./config/db');



app.use(cors());


const corsOptions = {
  origin: 'http://localhost:3000', // أو مصفوفة للأصول المسموحة
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.use(bodyParser.urlencoded({ extended: true }));



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/:imageName', imageController.checkImageExists);

app.post('/api/execute-sql', executeSqlQuery);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/apply-coupon', couponUsesRoutes); 
app.use('/api/distinctive-dishes', distinctiveDishRoutes);


app.use('/api/orderDishes', orderDishRoutes);
app.use('/api/auth', authRoutes);


 

 

app.get('/api', (req, res) => {
  res.send('API is working');
});



 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
