"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setError("Invalid password");
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-100">Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2"
          suppressHydrationWarning
        />
        <button type="submit" className="bg-gray-700 text-white py-2 rounded hover:bg-gray-600">
          Login
        </button>
      </form>
    </div>
  );
}
