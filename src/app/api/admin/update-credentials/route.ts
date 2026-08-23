import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { currentPassword, newUsername, newPassword } = await req.json();

    if (!currentPassword || !newUsername || !newPassword) {
      return NextResponse.json({ error: "All parameters are required" }, { status: 400 });
    }

    // 1. Verify current password
    const checkRes = await pool.query(
      "SELECT * FROM admin_credentials WHERE id = 'admin' AND password = $1",
      [currentPassword]
    );

    if (checkRes.rows.length === 0) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    // 2. Perform credentials update
    await pool.query(
      "UPDATE admin_credentials SET username = $1, password = $2, updated_at = CURRENT_TIMESTAMP WHERE id = 'admin'",
      [newUsername, newPassword]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Credentials update failed:", err);
    return NextResponse.json({ error: "Failed to update credentials: " + err.message }, { status: 500 });
  }
}
