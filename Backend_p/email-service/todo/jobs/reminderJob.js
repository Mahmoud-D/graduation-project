const cron = require("node-cron");
const emailService = require("../../emailServices/emailService");
const supabase = require("..//config/db");

// إعداد تذكير عبر الإيميل للمستخدمين الذين لم يتفاعلوا
const sendReminder = async () => {
  const { data: users, error } = await supabase
    .from("email_logs")
    .select("*")
    .eq("link_clicked", false)
    .lt("sent_at", new Date() - 48 * 60 * 60 * 1000); // التفاعل بعد 48 ساعة

  if (error) {
    console.error("Error fetching users for reminder:", error);
    return;
  }

  for (let user of users) {
    await emailService.sendEmail(
      user.email,
      "Reminder: Please Check Our Offer",
      "We noticed you didn’t click on the link in our previous email."
    );
  }
};

// تشغيل المهام المجدولة
cron.schedule("0 9 * * *", sendReminder); // تنفيذ المهمة كل يوم في الساعة 9 صباحًا

module.exports = sendReminder;
