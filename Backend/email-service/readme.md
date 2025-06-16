.env

# if use   Gmail

```
MAIL_SERVICE=gmail
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=your-app-password
```

# if use SMTP 
```
MAIL_SERVICE=smtp
SMTP_HOST=smtp.mailprovider.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@smtp.com
SMTP_PASS=your_smtp_password
```



```
require('dotenv').config(); // لو بتستخدم .env
const { sendEmail } = require('./sendEmail');

(async () => {
  try {
    const result = await sendEmail({
      to: ['test1@example.com', 'test2@example.com'], // أو مجرد 'test@example.com'
      bcc: 'hidden@example.com',                      // يمكن تركها فاضية
      subject: '🚀 تجربة إرسال بريد',
      text: 'هذه نسخة fallback نصية من الرسالة.',
      html: '<h1>مرحبا بك</h1><p>هذه تجربة باستخدام <b>HTML</b>.</p>',
      templateName: 'welcomeTemplate',               // اسم قالب من مجلد templates (اختياري)
      templateData: { userName: 'Khaled' },          // بيانات يتم تمريرها للقالب (اختياري)
      log: true,                                     // افتراضياً مفعل
      attachments: [                                 // مثال لمرفقات
        {
          filename: 'hello.txt',
          content: 'Hello from attached file!'
        },
        // {
        //   path: './path/to/your/file.pdf'
        // }
      ]
    });

    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
})();

```