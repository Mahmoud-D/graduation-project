module.exports = (options = {}) => {
    const { name = 'صديقي', link = '#' } = options;
    return {
      subject: `🎉 يلا نبدأ مع بعض!`,
      html: `
        <h1>أهلاً ${name} 👋</h1>
        <p>مبسوطين إنك بدأت معانا!</p>
        <a href="${link}" style="padding: 10px 20px; background-color: #4A88C5; color: white; text-decoration: none;">
          اضغط هنا وابدأ الرحلة 💡
        </a>
      `
    };
  };
  