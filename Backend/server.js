const express = require('express');
const bodyParser = require('body-parser');
// Import routes
const userRoutes = require('./routes/userRoutes'); // تأكد من إنشاء routes لمستخدميك
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderDishRoutes = require('./routes/orderDishRoutes');
const chefRoutes = require('./routes/chefRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
const User = require('./models/User');
const db = require('./config/db');



app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));




app.post('/execute-sql', async (req, res) => {


  const token = req.header('Authorization');


  const query = token; // استلام الكويري من الـ body

  if (!query) {
    return res.status(400).json({ message: 'لا يوجد استعلام لتنفيذه' });
  }

  try {
    console.log('تنفيذ الكويري:', query); // سجل الكويري التي سيتم تنفيذه
    db.query(query, (err, result) => {
      if (err) {
        console.error('خطأ في تنفيذ الاستعلام:', err); // سجل الخطأ في حال حدوثه
        return res.status(500).json({ message: 'حدث خطأ أثناء تنفيذ الاستعلام', error: err });
      }
      console.log('النتيجة:', result); // سجل النتيجة إذا تم تنفيذ الاستعلام بنجاح
      return res.status(200).json({ message: 'تم تنفيذ الاستعلام بنجاح', result });
    });
  } catch (error) {
    console.error('حدث خطأ غير متوقع:', error); // سجل الخطأ العام هنا
    return res.status(500).json({ message: 'حدث خطأ غير متوقع', error });
  }
});




// Routes
app.use('/api/users', userRoutes);

app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orderDishes', orderDishRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
  res.send('API is working');
});



// بدء تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
