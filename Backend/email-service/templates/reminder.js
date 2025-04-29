module.exports = (options = {}) => {
    const { name = 'صديقي', link = '#' } = options;
    return {
      subject: `📬 فيه حاجة نسيتها؟`,
      html: `
        <h1>يا ${name}، مستنيينك!</h1>
        <p>لاحظنا إنك فتحت الإيميل بس ما كملت الخطوة.</p>
        <a href="${link}" style="padding: 10px 20px; background-color: #C54A4A; color: white; text-decoration: none;">
          رجع وكمل الخطوة 💪
        </a>
      `
    };
  };
  