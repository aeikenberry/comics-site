import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const comicId = searchParams.get("comicId");
  const all = searchParams.get("all"); // admin: fetch all including unapproved

  if (comicId) {
    const conditions = all
      ? [eq(comments.comicId, parseInt(comicId))]
      : [eq(comments.comicId, parseInt(comicId)), eq(comments.approved, true)];
    const rows = await db.select().from(comments).where(and(...conditions));
    return NextResponse.json(rows);
  }

  // Admin: return all comments
  const rows = await db.select().from(comments);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { comicId, authorName, content } = await request.json();

  const [comment] = await db
    .insert(comments)
    .values({ comicId, authorName, content, approved: false })
    .returning();

  return NextResponse.json(comment, { status: 201 });
}
