import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const blogId = params.id;
  try {
    const { id, userId, userName, userPhoto, text, parentId } = await req.json();

    // 1. Check/Create user record first to satisfy foreign key
    const userEmail = `${userId}@temporary.com`;
    await pool.query(
      "INSERT INTO users (id, name, email, role) VALUES ($1, $2, $3, 'user') ON CONFLICT (id) DO NOTHING;",
      [userId, userName || "Guest", userEmail]
    );

    // 2. Insert comment
    await pool.query(
      "INSERT INTO blog_comments (id, blog_id, user_id, user_name, user_avatar, content, parent_comment_id) VALUES ($1, $2, $3, $4, $5, $6, $7);",
      [id, blogId, userId, userName || "Guest", userPhoto || null, text, parentId || null]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to save blog comment:", err);
    return NextResponse.json({ error: "Failed to write comment to PostgreSQL database: " + err.message }, { status: 500 });
  }
}
