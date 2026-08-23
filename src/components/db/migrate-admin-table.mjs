import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Connected to Neon PostgreSQL.");
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'admin',
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("admin_credentials table checked/created successfully.");

  // Also seed default credentials if they don't exist
  const existing = await client.query("SELECT * FROM admin_credentials WHERE id = 'admin'");
  if (existing.rows.length === 0) {
    const defaultPassword = process.env.VITE_ADMIN_PASSWORD || "admin123";
    await client.query(
      "INSERT INTO admin_credentials (id, username, password) VALUES ('admin', 'admin', $1);",
      [defaultPassword]
    );
    console.log(`Seeded default admin credentials. Username: 'admin', Password: '${defaultPassword}'`);
  } else {
    console.log("Admin credentials already exist, skipping seeding.");
  }

  await client.end();
  console.log("Done.");
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
