import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const blogId = params.id;
  try {
    const [likesRes, commentsRes] = await Promise.all([
      pool.query("SELECT * FROM blog_likes WHERE blog_id = $1", [blogId]),
      pool.query("SELECT * FROM blog_comments WHERE blog_id = $1 ORDER BY created_at ASC", [blogId])
    ]);

    const likes = likesRes.rows.map(l => ({ id: l.id, blogId: l.blog_id, userId: l.user_id }));
    const comments = commentsRes.rows.map(c => ({
      id: c.id,
      blogId: c.blog_id,
      userId: c.user_id,
      userName: c.user_name,
      userPhoto: c.user_avatar,
      text: c.content,
      parentId: c.parent_comment_id,
      date: c.created_at
    }));

    return NextResponse.json({ likes, comments });
  } catch (err: any) {
    console.error("Failed to fetch blog likes-comments:", err);
    return NextResponse.json({ error: "Database error: " + err.message }, { status: 500 });
  }
}
