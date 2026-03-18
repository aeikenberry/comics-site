import { NextResponse } from "next/server";
import { db } from "@/db";
import { comics } from "@/db/schema";
import { desc, lte } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE ?? "My Comics";
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Comic strips and gag comics";

export async function GET() {
  const allComics = await db.select().from(comics).where(lte(comics.publishedAt, new Date())).orderBy(desc(comics.publishedAt)).limit(50);

  const items = allComics
    .map(
      (comic) => `
    <item>
      <title>${escapeXml(comic.title)}</title>
      <link>${SITE_URL}/comic/${comic.slug}</link>
      <guid>${SITE_URL}/comic/${comic.slug}</guid>
      <pubDate>${comic.publishedAt.toUTCString()}</pubDate>
      <description>${escapeXml(comic.description ?? "")}</description>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
