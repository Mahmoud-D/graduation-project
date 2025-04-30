// PAYPAL_CLIENT_ID=AYlQQJ-gh5bkJYxu3TM1k1USm7VsExVq6AzGCvY1fKr_USKv2-ChKMlB69kL_LW3kce6R-3ydPDQ9nFN
// PAYPAL_SECRET_KEY=ELzf2B4j_va7Vbfv0PEL01LgjGQ5F7TW2m6FL7LXnvxYY4q9HRguZkLnWfOzQr2BivopjXTzdYhDlS5A

// # sb-5tsb4741151860@personal.example.com
// Esd#xZ8Q


require('dotenv').config(); // تحميل المتغيرات البيئية

const express = require('express');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// تمكين CORS
app.use(cors());
app.use(express.json()); // لتمكين معالجة البيانات بتنسيق JSON

// تكوين PayPal باستخدام المتغيرات البيئية
paypal.configure({
  'mode': 'sandbox', // استخدم 'sandbox' أثناء التطوير و 'live' عند الإنتاج
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_SECRET_KEY
});

// إعداد الـ endpoint لإنشاء الدفع
app.post('/pay', (req, res) => {
  const { amount } = req.body; // استلام المبلغ من الـ Frontend

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": amount // استخدام المبلغ الذي أرسله الـ Frontend
      },
      "description": "Test payment"
    }]
  };

  // إنشاء الدفع باستخدام PayPal API
  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error creating payment');
    } else {
      // العثور على رابط الدفع للموافقة عليه من PayPal
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
      res.json({ approvalUrl }); // إرجاع رابط الدفع إلى الـ Frontend
    }
  });
});

// صفحة النجاح
app.get('/success', (req, res) => {
  res.send('Payment Success!');
});

// صفحة الفشل
app.get('/cancel', (req, res) => {
  res.send('Payment Cancelled');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
