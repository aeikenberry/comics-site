"use client";

import { useState } from "react";
import type { Comment } from "@/db/schema";

export default function CommentSection({
  comicId,
  initialComments,
}: {
  comicId: number;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId, authorName: name, content }),
    });

    if (!res.ok) {
      setError("Failed to submit comment. Please try again.");
      return;
    }

    setSubmitted(true);
    setName("");
    setContent("");
  }

  return (
    <section className="mt-10 border-t border-gray-800 pt-8">
      <h2 className="text-xl font-semibold mb-6">Comments</h2>

      {comments.length === 0 && (
        <p className="text-gray-500 mb-6">No comments yet. Be the first!</p>
      )}

      <div className="flex flex-col gap-4 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-900 rounded p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{comment.authorName}</span>
              <span className="text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>

      {submitted ? (
        <p className="text-green-600">Thanks! Your comment is awaiting moderation.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
          <h3 className="font-medium">Leave a comment</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="self-start bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
          >
            Submit
          </button>
        </form>
      )}
    </section>
  );
}
