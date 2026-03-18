import { db } from "@/db";
import { comics } from "@/db/schema";
import { desc, lte } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function Archive() {
  const all = await db.select().from(comics).where(lte(comics.publishedAt, new Date())).orderBy(desc(comics.publishedAt));

  const strips = all.filter((c) => c.comicType === "strip");
  const gags = all.filter((c) => c.comicType === "gag");
  const doodles = all.filter((c) => c.comicType === "doodle");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Archive</h1>

      {strips.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-800">Comic Strips</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {strips.map((comic) => (
              <Link key={comic.id} href={`/comic/${comic.slug}`} className="group block">
                <Image
                  src={comic.imagePath}
                  alt={comic.title}
                  width={400}
                  height={300}
                  className="w-full h-auto rounded group-hover:opacity-80 transition-opacity"
                />
                <p className="mt-2 text-sm font-medium group-hover:text-gray-400">{comic.title}</p>
                <p className="text-xs text-gray-400">{new Date(comic.publishedAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {gags.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-800">Gag Comics</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {gags.map((comic) => (
              <Link key={comic.id} href={`/comic/${comic.slug}`} className="group block">
                <Image
                  src={comic.imagePath}
                  alt={comic.title}
                  width={400}
                  height={300}
                  className="w-full h-auto rounded group-hover:opacity-80 transition-opacity"
                />
                <p className="mt-2 text-sm font-medium group-hover:text-gray-400">{comic.title}</p>
                <p className="text-xs text-gray-400">{new Date(comic.publishedAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {doodles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-800">Doodles</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {doodles.map((comic) => (
              <Link key={comic.id} href={`/comic/${comic.slug}`} className="group block">
                <Image
                  src={comic.imagePath}
                  alt={comic.title}
                  width={400}
                  height={300}
                  className="w-full h-auto rounded group-hover:opacity-80 transition-opacity"
                />
                <p className="mt-2 text-sm font-medium group-hover:text-gray-400">{comic.title}</p>
                <p className="text-xs text-gray-400">{new Date(comic.publishedAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {all.length === 0 && (
        <p className="text-gray-500">No comics yet. Check back soon!</p>
      )}
    </div>
  );
}
