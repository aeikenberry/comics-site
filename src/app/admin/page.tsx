import { db } from "@/db";
import { comics, comments } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import DeleteComicButton from "./DeleteComicButton";
import EditDateButton from "./EditDateButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const allComics = await db.select().from(comics).orderBy(desc(comics.publishedAt));
  const [{ value: pendingCount }] = await db
    .select({ value: count() })
    .from(comments)
    .where(eq(comments.approved, false));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          {pendingCount > 0 && (
            <Link
              href="/admin/comments"
              className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600"
            >
              {pendingCount} comment{pendingCount !== 1 ? "s" : ""} pending
            </Link>
          )}
          <Link
            href="/admin/upload"
            className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
          >
            + Upload Comic
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Comic</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Published</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allComics.map((comic) => (
              <tr key={comic.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-800">
                <td className="px-4 py-3 flex items-center gap-3">
                  <Image
                    src={comic.imagePath}
                    alt={comic.title}
                    width={60}
                    height={45}
                    className="rounded object-cover"
                  />
                  <span className="font-medium">{comic.title}</span>
                </td>
                <td className="px-4 py-3 capitalize text-gray-400">{comic.comicType}</td>
                <td className="px-4 py-3 text-gray-400">
                  <EditDateButton
                    id={comic.id}
                    currentDate={comic.publishedAt.toISOString().slice(0, 10)}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/comic/${comic.slug}`}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                    >
                      View
                    </Link>
                    <DeleteComicButton id={comic.id} />
                  </div>
                </td>
              </tr>
            ))}
            {allComics.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No comics yet.{" "}
                  <Link href="/admin/upload" className="text-blue-400 hover:underline">
                    Upload your first one!
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
