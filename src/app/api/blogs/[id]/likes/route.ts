import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const blogId = params.id;
  try {
    const { id, userId } = await req.json();

    // 1. Ensure user exists
    const userEmail = `${userId}@temporary.com`;
    await pool.query(
      "INSERT INTO users (id, name, email, role) VALUES ($1, 'Liker User', $2, 'user') ON CONFLICT (id) DO NOTHING;",
      [userId, userEmail]
    );

    // 2. Add like
    await pool.query(
      "INSERT INTO blog_likes (id, blog_id, user_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;",
      [id, blogId, userId]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to save like:", err);
    return NextResponse.json({ error: "Failed to write like to PostgreSQL database: " + err.message }, { status: 500 });
  }
}
