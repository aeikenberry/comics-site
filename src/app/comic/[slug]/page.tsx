import { db } from "@/db";
import { comics, comments } from "@/db/schema";
import { eq, and, gt, lt, lte, desc, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CommentSection from "./CommentSection";

export const revalidate = 60;

export default async function ComicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [comic] = await db.select().from(comics).where(and(eq(comics.slug, slug), lte(comics.publishedAt, new Date())));
  if (!comic) notFound();

  const now = new Date();

  // Newer = published after this one but not in the future
  const [newer] = await db
    .select({ slug: comics.slug })
    .from(comics)
    .where(and(gt(comics.publishedAt, comic.publishedAt), lte(comics.publishedAt, now)))
    .orderBy(asc(comics.publishedAt))
    .limit(1);

  // Older = published before this one
  const [older] = await db
    .select({ slug: comics.slug })
    .from(comics)
    .where(lt(comics.publishedAt, comic.publishedAt))
    .orderBy(desc(comics.publishedAt))
    .limit(1);

  // Get all published slugs for random navigation
  const allSlugs = await db
    .select({ slug: comics.slug })
    .from(comics)
    .where(lte(comics.publishedAt, now));

  const approved = await db
    .select()
    .from(comments)
    .where(and(eq(comments.comicId, comic.id), eq(comments.approved, true)));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{comic.title}</h1>
      <div className="flex gap-4 text-sm text-gray-400 mb-6">
        <span>{new Date(comic.publishedAt).toLocaleDateString()}</span>
        <span className="capitalize">{comic.comicType}</span>
      </div>

      <Image
        src={comic.imagePath}
        alt={comic.title}
        width={800}
        height={600}
        className="w-full h-auto rounded mb-6"
        priority
      />

      <ComicNav
        newerSlug={newer?.slug}
        olderSlug={older?.slug}
        allSlugs={allSlugs.map((s) => s.slug)}
        currentSlug={comic.slug}
      />

      {comic.description && (
        <p className="text-gray-400 mb-8">{comic.description}</p>
      )}

      <CommentSection comicId={comic.id} initialComments={approved} />
    </div>
  );
}

function ComicNav({
  newerSlug,
  olderSlug,
  allSlugs,
  currentSlug,
}: {
  newerSlug?: string;
  olderSlug?: string;
  allSlugs: string[];
  currentSlug: string;
}) {
  const otherSlugs = allSlugs.filter((s) => s !== currentSlug);
  const randomSlug = otherSlugs.length > 0
    ? otherSlugs[Math.floor(Math.random() * otherSlugs.length)]
    : null;

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        {olderSlug ? (
          <Link
            href={`/comic/${olderSlug}`}
            className="text-sm text-blue-400 hover:underline"
          >
            ← Older
          </Link>
        ) : (
          <span className="text-sm text-gray-600">← Older</span>
        )}
      </div>
      <div>
        {randomSlug && (
          <Link
            href={`/comic/${randomSlug}`}
            className="text-sm text-blue-400 hover:underline"
          >
            Random
          </Link>
        )}
      </div>
      <div>
        {newerSlug ? (
          <Link
            href={`/comic/${newerSlug}`}
            className="text-sm text-blue-400 hover:underline"
          >
            Newer →
          </Link>
        ) : (
          <span className="text-sm text-gray-600">Newer →</span>
        )}
      </div>
    </div>
  );
}
