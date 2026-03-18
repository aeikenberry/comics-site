import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comics } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(comics).where(eq(comics.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const [updated] = await db
    .update(comics)
    .set(body)
    .where(eq(comics.id, parseInt(id)))
    .returning();
  return NextResponse.json(updated);
}
