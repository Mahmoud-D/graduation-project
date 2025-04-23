const sql = require("../config/dbEmail");

// Function to create the email_logs table if it doesn't exist, and insert default data
const createEmailLogsTableIfNotExist = async () => {
  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,            
        email VARCHAR(255) NOT NULL,      
        subject VARCHAR(255) NOT NULL,    
        body TEXT NOT NULL,              
        sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP      
      );
    `;
    console.log("✅ email_logs table is ready or created.");

    // Insert default data (optional)
    const defaultEmails = [
      {
        email: "test1@example.com",
        subject: "Test Subject 1",
        body: "Test Body 1",
      },
      {
        email: "test2@example.com",
        subject: "Test Subject 2",
        body: "Test Body 2",
      },
    ];

    for (let email of defaultEmails) {
      await sql`
        INSERT INTO email_logs (email, subject, body, sent_at)
        VALUES (${email.email}, ${email.subject}, ${email.body}, DEFAULT)
      `;
    }
    console.log("✅ Default email data inserted.");
  } catch (err) {
    console.error(
      "❌ Error creating email_logs table or inserting default data:",
      err
    );
  }
};

// Call this function separately to set up the table and insert default data
createEmailLogsTableIfNotExist();

module.exports = { createEmailLogsTableIfNotExist };
