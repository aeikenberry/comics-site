import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="bg-gray-900 text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold">Admin</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="hover:text-gray-300">Dashboard</Link>
            <Link href="/admin/upload" className="hover:text-gray-300">Upload</Link>
            <Link href="/admin/comments" className="hover:text-gray-300">Comments</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-gray-300">← View Site</Link>
          <LogoutButton />
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
