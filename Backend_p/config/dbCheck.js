const sql = require("./db");

async function checkDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    return {
      connected: true,
      message: "Successfully connected to Supabase PostgreSQL",
      timestamp: result[0].now,
    };
  } catch (err) {
    return {
      connected: false,
      message: `Connection failed: ${err.message}`,
      error: err,
    };
  }
}

module.exports = checkDatabaseConnection;
