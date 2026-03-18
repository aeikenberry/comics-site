"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comicType, setComicType] = useState("strip");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      // Upload image
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const { error: msg } = await uploadRes.json();
        throw new Error(msg ?? "Upload failed");
      }
      const { path: imagePath } = await uploadRes.json();

      // Save comic metadata
      const comicRes = await fetch("/api/comics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, imagePath, comicType, publishedAt }),
      });
      if (!comicRes.ok) throw new Error("Failed to save comic");

      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Upload Comic</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded shadow p-6 max-w-xl flex flex-col gap-5">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 w-full text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 w-full text-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={comicType}
              onChange={(e) => setComicType(e.target.value)}
              className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 w-full text-sm"
            >
              <option value="strip">Strip</option>
              <option value="gag">Gag</option>
              <option value="doodle">Doodle</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Publish Date *</label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
              className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 w-full text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image * (PNG, JPG, WebP — max 10MB)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            required
            className="text-sm"
          />
          {preview && (
            <div className="mt-3">
              <Image src={preview} alt="Preview" width={400} height={300} className="rounded border w-full h-auto" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-gray-700 text-white py-2 rounded hover:bg-gray-600 disabled:opacity-50 text-sm font-medium"
        >
          {uploading ? "Uploading…" : "Publish Comic"}
        </button>
      </form>
    </div>
  );
}
