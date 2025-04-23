const sql = require('../config/dbEmail');

// Function to log email details into the database
const logEmailInDatabase = async (recipient, subject, body) => {
  try {
    // Inserting email details into the table
    await sql`
      INSERT INTO email_logs (email, subject, body, sent_at)
      VALUES (${recipient}, ${subject}, ${body}, DEFAULT)
    `;
    console.log(`✅ Email log saved for ${recipient}`);
  } catch (err) {
    console.error('❌ Error logging email in database:', err);
  }
};

// Export the function so it can be used in other files
module.exports = { logEmailInDatabase };



