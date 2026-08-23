import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const res = await pool.query(
      "SELECT * FROM admin_credentials WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (res.rows.length > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
  } catch (err: any) {
    console.error("Admin login failed:", err);
    return NextResponse.json({ error: "Database authentication failed: " + err.message }, { status: 500 });
  }
}
