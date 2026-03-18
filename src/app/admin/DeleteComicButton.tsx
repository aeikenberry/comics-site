"use client";

import { useRouter } from "next/navigation";

export default function DeleteComicButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this comic? This cannot be undone.")) return;

    await fetch(`/api/comics/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:underline">
      Delete
    </button>
  );
}
