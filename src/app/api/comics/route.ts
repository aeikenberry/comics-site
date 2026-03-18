import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comics } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const all = await db.select().from(comics).orderBy(desc(comics.publishedAt));
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, imagePath, comicType, publishedAt } = body;

  const slug = slugify(title);

  const [comic] = await db
    .insert(comics)
    .values({ title, slug, description, imagePath, comicType, publishedAt: new Date(publishedAt) })
    .returning();

  return NextResponse.json(comic, { status: 201 });
}
