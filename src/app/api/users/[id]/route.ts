import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  try {
    const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userRes.rows.length > 0) {
      return NextResponse.json(userRes.rows[0]);
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (err: any) {
    console.error("Failed to fetch user:", err);
    return NextResponse.json({ error: "Database read failed: " + err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  try {
    const { displayName, email, phoneNumber, photoURL, bio, location } = await req.json();
    await pool.query(
      `INSERT INTO users (id, name, email, phone_number, photo_url, bio, location, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) 
       ON CONFLICT (id) DO UPDATE SET 
         name = EXCLUDED.name, 
         email = EXCLUDED.email, 
         phone_number = EXCLUDED.phone_number, 
         photo_url = EXCLUDED.photo_url, 
         bio = EXCLUDED.bio, 
         location = EXCLUDED.location, 
         updated_at = CURRENT_TIMESTAMP;`,
      [userId, displayName || null, email, phoneNumber || null, photoURL || null, bio || null, location || null]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to save user profile:", err);
    return NextResponse.json({ error: "Failed to write user profile: " + err.message }, { status: 500 });
  }
}
