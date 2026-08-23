import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

if (!process.env.DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL is not set. Database operations will fail at runtime.");
}

export const pool = new Pool({
  connectionString,
});

export function escapeValue(val: any) {
  if (val === null || val === undefined) return null;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val;
  return String(val);
}
