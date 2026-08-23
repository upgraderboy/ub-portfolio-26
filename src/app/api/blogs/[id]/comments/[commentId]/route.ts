import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const commentId = params.commentId;
  try {
    await pool.query("DELETE FROM blog_comments WHERE id = $1", [commentId]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to delete comment:", err);
    return NextResponse.json({ error: "Database delete failed: " + err.message }, { status: 500 });
  }
}
