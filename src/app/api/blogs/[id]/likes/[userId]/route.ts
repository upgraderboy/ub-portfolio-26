import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; userId: string } }
) {
  const blogId = params.id;
  const userId = params.userId;
  try {
    await pool.query("DELETE FROM blog_likes WHERE blog_id = $1 AND user_id = $2", [blogId, userId]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to delete like:", err);
    return NextResponse.json({ error: "Database delete failed: " + err.message }, { status: 500 });
  }
}
