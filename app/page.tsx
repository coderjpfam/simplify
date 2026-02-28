"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

const TOOLS = [
  {
    href: "/token-generator",
    name: "Token Generator",
    description: "Generate cryptographically secure random tokens",
    icon: "🔑",
    accent: "from-amber-500/10 to-orange-500/5",
    borderHover: "hover:border-amber-200",
  },
  {
    href: "/password-hasher",
    name: "Password Hasher",
    description: "Hash passwords and verify against bcrypt hashes",
    icon: "🔒",
    accent: "from-emerald-500/10 to-teal-500/5",
    borderHover: "hover:border-emerald-200",
  },
  {
    href: "/uuid-generator",
    name: "UUID Generator",
    description: "Generate UUIDs v1, v4, v7 — RFC 4122 compliant",
    icon: "🪪",
    accent: "from-violet-500/10 to-indigo-500/5",
    borderHover: "hover:border-violet-200",
  },
  {
    href: "/enc-dec",
    name: "Encryption & Decryption",
    description: "AES encrypt/decrypt with password · PBKDF2 · client-side only",
    icon: "🔐",
    accent: "from-sky-500/10 to-blue-500/5",
    borderHover: "hover:border-sky-200",
  },
  {
    href: "/qrcode-generator",
    name: "QR Code Generator",
    description: "Generate and decode QR codes · Custom colors · Client-side only",
    icon: "📱",
    accent: "from-emerald-500/10 to-cyan-500/5",
    borderHover: "hover:border-emerald-200",
  },
  {
    href: "/regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions · Matches highlighted · Flags g, i, m",
    icon: "🔍",
    accent: "from-rose-500/10 to-pink-500/5",
    borderHover: "hover:border-rose-200",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#fafaf9]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-[#fafaf9]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#fafaf9]/80 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 sm:gap-4">
          <Link
            href="/"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2 text-base font-semibold tracking-tight text-gray-900 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 rounded-lg sm:text-lg"
            aria-label="Simplify home"
          >
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="shrink-0"
              priority
            />
            Simplify
          </Link>
          <div className="relative flex-1 max-w-[200px] sm:max-w-[240px]">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-h-[44px] rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200/50"
              aria-label="Search tools"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-12 sm:pb-[calc(3rem+env(safe-area-inset-bottom))] md:py-16 md:pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="mb-1.5 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
            Developer tools
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Client-side utilities. Nothing leaves your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTools.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 py-12 sm:py-16 text-center col-span-full">
              <p className="text-sm text-gray-500">
                No tools match &quot;{search}&quot;
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Try a different search term
              </p>
            </div>
          ) : (
            filteredTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group flex min-h-[88px] sm:min-h-[96px] items-center gap-3 sm:gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${tool.borderHover} hover:shadow-md`}
              >
                <div
                  className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.accent} text-lg sm:text-xl transition-transform duration-200 group-hover:scale-105`}
                >
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-gray-800 line-clamp-1">
                    {tool.name}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                <span className="shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-500" aria-hidden>
                  →
                </span>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
