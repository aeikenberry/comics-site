import { db } from "@/db";
import { comments, comics } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import CommentActions from "./CommentActions";

export default async function CommentsPage() {
  const rows = await db
    .select({
      id: comments.id,
      authorName: comments.authorName,
      content: comments.content,
      approved: comments.approved,
      createdAt: comments.createdAt,
      comicId: comments.comicId,
      comicTitle: comics.title,
      comicSlug: comics.slug,
    })
    .from(comments)
    .leftJoin(comics, eq(comments.comicId, comics.id))
    .orderBy(comments.createdAt);

  const pending = rows.filter((r) => !r.approved);
  const approved = rows.filter((r) => r.approved);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Comments</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 && <p className="text-gray-500 text-sm">Nothing to moderate.</p>}
        <div className="flex flex-col gap-3">
          {pending.map((c) => (
            <div key={c.id} className="bg-gray-900 rounded shadow p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100">{c.authorName}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    on{" "}
                    <Link href={`/comic/${c.comicSlug}`} className="hover:underline" target="_blank">
                      {c.comicTitle}
                    </Link>{" "}
                    · {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">{c.content}</p>
                </div>
                <CommentActions id={c.id} approved={c.approved} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Approved ({approved.length})</h2>
        <div className="flex flex-col gap-3">
          {approved.map((c) => (
            <div key={c.id} className="bg-gray-900 rounded shadow p-4 opacity-70">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100">{c.authorName}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    on{" "}
                    <Link href={`/comic/${c.comicSlug}`} className="hover:underline" target="_blank">
                      {c.comicTitle}
                    </Link>{" "}
                    · {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">{c.content}</p>
                </div>
                <CommentActions id={c.id} approved={c.approved} />
              </div>
            </div>
          ))}
          {approved.length === 0 && <p className="text-gray-400 text-sm">No approved comments yet.</p>}
        </div>
      </section>
    </div>
  );
}
