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
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-[#fafaf9]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900 transition-opacity hover:opacity-80"
          >
            <Image src="/logo.png" alt="Simplify" width={28} height={28} className="shrink-0" priority />
            Simplify
          </Link>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
              className="w-44 rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200/50 sm:w-56"
              aria-label="Search tools"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mb-12">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Developer tools
          </h1>
          <p className="text-base text-gray-500">
            Client-side utilities. Nothing leaves your browser.
          </p>
        </div>

        <div className="space-y-3">
          {filteredTools.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 py-16 text-center">
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
                className={`group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 ${tool.borderHover} hover:shadow-md`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.accent} text-xl transition-transform duration-200 group-hover:scale-105`}
                >
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 group-hover:text-gray-800">
                    {tool.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">{tool.description}</p>
                </div>
                <span className="shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-500">
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
