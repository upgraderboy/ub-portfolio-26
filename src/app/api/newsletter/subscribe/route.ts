import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await pool.query("INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING;", [email]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to subscribe email:", err);
    return NextResponse.json({ error: "Failed to save subscriber: " + err.message }, { status: 500 });
  }
}
