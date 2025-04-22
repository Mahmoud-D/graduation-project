// ├───config
// │       db.js
const postgres = require('postgres');

// connection string
const connectionString = 'postgresql://postgres.oeeireubrxukwihvtxji:gpgpgpgpgpgpgpgpgpgp@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

// connection options
const options = {
  ssl: {
    rejectUnauthorized: false // لازم تكون false عشان Supabase تستخدم شهادة عامة
  },
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connection: {
    application_name: 'graduation-project'
  }
};

// create client
const sql = postgres(connectionString, options);

// test connection
async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Connected to PostgreSQL at:', result[0].now);
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL:', err);
  }
}

testConnection();

module.exports = sql;
