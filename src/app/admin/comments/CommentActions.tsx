"use client";

import { useRouter } from "next/navigation";

export default function CommentActions({
  id,
  approved,
}: {
  id: number;
  approved: boolean;
}) {
  const router = useRouter();

  async function handleApprove() {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });
    router.refresh();
  }

  async function handleUnapprove() {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: false }),
    });
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 text-sm shrink-0">
      {!approved ? (
        <button onClick={handleApprove} className="text-green-600 hover:underline">
          Approve
        </button>
      ) : (
        <button onClick={handleUnapprove} className="text-yellow-600 hover:underline">
          Unapprove
        </button>
      )}
      <button onClick={handleDelete} className="text-red-500 hover:underline">
        Delete
      </button>
    </div>
  );
}
