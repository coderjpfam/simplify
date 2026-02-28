"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type FlagKey = "g" | "i" | "m";

const FLAGS: { key: FlagKey; label: string; description: string }[] = [
  { key: "g", label: "g", description: "Global — all matches" },
  { key: "i", label: "i", description: "Case insensitive" },
  { key: "m", label: "m", description: "Multiline — ^ and $ match line breaks" },
];

function buildRegex(pattern: string, flags: Set<FlagKey>): RegExp | null {
  try {
    const flagStr = Array.from(flags).sort().join("");
    return new RegExp(pattern, flagStr || undefined);
  } catch {
    return null;
  }
}

function getMatches(pattern: string, flags: Set<FlagKey>, testString: string): RegExpExecArray[] {
  const regex = buildRegex(pattern, flags);
  if (!regex || !pattern.trim()) return [];

  const matches: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  const r = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  while ((m = r.exec(testString)) !== null) {
    matches.push(m);
    if (m[0] === "") r.lastIndex++; // prevent infinite loop for zero-width matches
  }
  return matches;
}

function HighlightedText({
  testString,
  matches,
}: {
  testString: string;
  matches: RegExpExecArray[];
}) {
  if (matches.length === 0) {
    return <span className="whitespace-pre-wrap break-words">{testString}</span>;
  }

  const parts: { text: string; isMatch: boolean }[] = [];
  let lastEnd = 0;

  for (const m of matches) {
    if (m.index > lastEnd) {
      parts.push({ text: testString.slice(lastEnd, m.index), isMatch: false });
    }
    parts.push({ text: m[0], isMatch: true });
    lastEnd = m.index + m[0].length;
  }
  if (lastEnd < testString.length) {
    parts.push({ text: testString.slice(lastEnd), isMatch: false });
  }

  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((p, i) =>
        p.isMatch ? (
          <mark key={i} className="bg-amber-200 text-amber-900 rounded-sm px-0.5">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState<Set<FlagKey>>(new Set(["g"]));

  const toggleFlag = (key: FlagKey) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const regex = useMemo(() => buildRegex(pattern, flags), [pattern, flags]);
  const matches = useMemo(
    () => getMatches(pattern, flags, testString),
    [pattern, flags, testString]
  );

  const isValid = pattern === "" || regex !== null;

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-xl">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            aria-label="Back to home"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Regex Tester
          </h1>
          <p className="text-sm text-gray-400">
            Test regular expressions · Matches highlighted · Client-side only
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 space-y-6">
          {/* Pattern input */}
          <div>
            <label
              htmlFor="pattern-input"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2"
            >
              Pattern
            </label>
            <input
              id="pattern-input"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="/\d+/ or \w+"
              spellCheck={false}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-800 placeholder-gray-300 focus:outline-none transition-colors duration-150 ${
                pattern && !isValid
                  ? "border-red-300 bg-red-50/50 focus:border-red-400"
                  : "border-gray-200 focus:border-gray-400"
              }`}
            />
            {pattern && !isValid && (
              <p className="mt-1.5 text-xs text-red-400">Invalid regex</p>
            )}
          </div>

          {/* Flags */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              Flags
            </p>
            <div className="flex flex-wrap gap-2">
              {FLAGS.map(({ key, label, description }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFlag(key)}
                  title={description}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    flags.has(key)
                      ? "border-gray-900 text-gray-900 bg-gray-100"
                      : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Test string input */}
          <div>
            <label
              htmlFor="test-string"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2"
            >
              Test string
            </label>
            <textarea
              id="test-string"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against the pattern…"
              rows={5}
              spellCheck={false}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Results: highlighted matches */}
        <div className="mt-6 border border-gray-200 rounded-xl p-6 bg-gray-50/50">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Matches
            </p>
            {pattern && testString && (
              <span className="text-xs text-gray-500">
                {isValid
                  ? `${matches.length} match${matches.length !== 1 ? "es" : ""}`
                  : "—"}
              </span>
            )}
          </div>
          <div className="min-h-[4rem] rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
            {testString ? (
              <HighlightedText testString={testString} matches={matches} />
            ) : (
              <span className="text-gray-300">Test string matches appear here…</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
