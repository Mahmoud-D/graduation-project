const express = require('express');
const bodyParser = require('body-parser');
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

const cors = require('cors');


const app = express();

app.use(bodyParser.json());
const User = require('./models/User');
const db = require('./config/db');



app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/execute-sql', (req, res) => {
  const query = req.body.query?.replace(/[\r\n]+/g, '').trim();;

  
 
 
if (!query) {
    return res.status(400).json({ message: 'لا يوجد استعلام لتنفيذه' });
  }

  try {
    console.log('تنفيذ الكويري:', query);
    db.query(query, (err, result) => {
      if (err) {
        console.error('خطأ في تنفيذ الاستعلام:', err);
        return res.status(500).json({
          message: 'حدث خطأ أثناء تنفيذ الاستعلام',
          error: {
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
            sql: err.sql
          }
        });
      }
      console.log('النتيجة:', result);
      return res.status(200).json({query, message: 'تم تنفيذ الاستعلام بنجاح', result });
    });
  } catch (error) {
    console.error('حدث خطأ غير متوقع:', error);
    return res.status(500).json({
      message: 'حدث خطأ غير متوقع',
      error: error.message
    });
  }
});





// Routes
app.use('/api/users', userRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/apply-coupon', couponUsesRoutes); 


app.use('/api/orderDishes', orderDishRoutes);
app.use('/api/auth', authRoutes);


 

 

app.get('/api', (req, res) => {
  res.send('API is working');
});



 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
