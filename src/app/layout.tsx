import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE ?? "My Comics",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Comic strips and gag comics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600;700&family=Schoolbell&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] text-gray-100 min-h-screen flex flex-col">
        <header className="border-b border-gray-800 py-4 px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-gray-400" style={{ fontFamily: "'Schoolbell', cursive" }}>
            {process.env.NEXT_PUBLIC_SITE_TITLE ?? "My Comics"}
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-gray-400">Latest</Link>
            <Link href="/archive" className="hover:text-gray-400">Archive</Link>
            <Link href="/api/rss" className="hover:text-gray-400">RSS</Link>
          </nav>
        </header>
        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-800 py-4 px-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} — All comics are mine.
        </footer>
      </body>
    </html>
  );
}
