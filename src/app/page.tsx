import { db } from "@/db";
import { comics } from "@/db/schema";
import { desc, lte } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function Home() {
  const latest = await db.select().from(comics).where(lte(comics.publishedAt, new Date())).orderBy(desc(comics.publishedAt)).limit(10);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Latest Comics</h1>
      {latest.length === 0 && (
        <p className="text-gray-500">No comics yet. Check back soon!</p>
      )}
      <div className="flex flex-col gap-12">
        {latest.map((comic) => (
          <article key={comic.id} className="border-b border-gray-800 pb-12 last:border-0">
            <Link href={`/comic/${comic.slug}`}>
              <h2 className="text-xl font-semibold mb-3 hover:text-gray-400">{comic.title}</h2>
            </Link>
            <Link href={`/comic/${comic.slug}`} className="block">
              <Image
                src={comic.imagePath}
                alt={comic.title}
                width={800}
                height={600}
                className="w-full h-auto rounded"
                style={{ maxWidth: "800px" }}
              />
            </Link>
            {comic.description && (
              <p className="mt-3 text-gray-400">{comic.description}</p>
            )}
            <div className="mt-2 flex gap-4 text-sm text-gray-400">
              <span>{new Date(comic.publishedAt).toLocaleDateString()}</span>
              <span className="capitalize">{comic.comicType}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
