"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { generateUUID, applyFormat, copyText } from "@/lib/uuid-generator";
import type { VersionKey, FormatKey } from "@/lib/uuid-generator";
import { ControlsCard } from "./ControlsCard";
import { EmptyState } from "./EmptyState";
import { UUIDList } from "./UUIDList";

export function UUIDGenerator() {
  const [version, setVersion] = useState<VersionKey>("v4");
  const [format, setFormat] = useState<FormatKey>("standard");
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [generated, setGenerated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entropyBits = version === "v4" ? 122 : version === "v7" ? 74 : 62;
  const strength =
    entropyBits >= 122
      ? { text: "Excellent", color: "text-emerald-600", bar: "w-full bg-emerald-400" }
      : entropyBits >= 74
        ? { text: "Strong", color: "text-green-500", bar: "w-3/4 bg-green-400" }
        : { text: "Good", color: "text-yellow-500", bar: "w-2/4 bg-yellow-300" };

  const reset = useCallback(() => {
    setUuids([]);
    setGenerated(false);
    setCopied(null);
    setCopyError(false);
  }, []);

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, () => applyFormat(generateUUID(version), format)));
    setCopied(null);
    setCopyError(false);
    setGenerated(true);
  }, [version, format, count]);

  const handleCopy = async (text: string, key: number | "all") => {
    const ok = await copyText(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (ok) {
      setCopied(key);
      setCopyError(false);
      timerRef.current = setTimeout(() => setCopied(null), 2000);
    } else {
      setCopyError(true);
      timerRef.current = setTimeout(() => setCopyError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-xl">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">UUID Generator</h1>
          <p className="text-sm text-gray-400">Cryptographically secure · Web Crypto API · RFC 4122</p>
        </div>

        <ControlsCard
          version={version}
          onVersionChange={setVersion}
          format={format}
          onFormatChange={setFormat}
          count={count}
          onCountChange={setCount}
          strengthText={strength.text}
          strengthColor={strength.color}
          strengthBar={strength.bar}
          entropyBits={entropyBits}
          onReset={reset}
        />

        <button
          onClick={generate}
          className="mt-3 w-full py-3.5 bg-gray-900 hover:bg-gray-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition-all duration-150"
        >
          {generated ? "Regenerate" : "Generate"} {count > 1 ? `${count} UUIDs` : "UUID"}
        </button>

        {copyError && (
          <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
            Copy failed — select the UUID and press Ctrl+C / Cmd+C manually.
          </div>
        )}

        {!generated && <EmptyState />}

        {uuids.length > 0 && (
          <UUIDList
            uuids={uuids}
            version={version}
            format={format}
            entropyBits={entropyBits}
            strengthColor={strength.color}
            copied={copied}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
}
