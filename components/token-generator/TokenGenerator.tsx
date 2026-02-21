"use client";

import Link from "next/link";
import { copyText } from "@/lib/token-generator/clipboard";
import { calcEntropy, generateToken, strengthLabel } from "@/lib/token-generator/token";
import { CharsetKey } from "@/lib/token-generator/types";
import { useState, useCallback, useRef } from "react";
import { ControlsCard } from "./ControlsCard";
import { EmptyState } from "./EmptyState";
import { TokenList } from "./TokenList";


export function TokenGenerator() {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(1);
  const [charsetKey, setCharsetKey] = useState<CharsetKey>("hex");
  const [tokens, setTokens] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [masked, setMasked] = useState(false);
  const [generated, setGenerated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bits = calcEntropy(length, charsetKey);
  const strength = strengthLabel(bits);

  const generate = useCallback(() => {
    setTokens(Array.from({ length: count }, () => generateToken(length, charsetKey)));
    setCopied(null);
    setCopyError(false);
    setGenerated(true);
    setMasked(false);
  }, [length, count, charsetKey]);

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
        {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Token Generator
          </h1>
          <p className="text-sm text-gray-400">
            Cryptographically secure · Web Crypto API · Bias-free CSPRNG
          </p>
        </div>

        {/* Controls card */}
        <ControlsCard
          length={length}
          onLengthChange={setLength}
          count={count}
          onCountChange={setCount}
          charsetKey={charsetKey}
          onCharsetChange={setCharsetKey}
          strengthLabel={strength.text}
          strengthColor={strength.color}
          strengthBar={strength.bar}
          bits={bits}
        />

        {/* Generate button */}
        <button
          onClick={generate}
          className="mt-3 w-full py-3.5 bg-gray-900 hover:bg-gray-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition-all duration-150"
        >
          {generated ? "Regenerate" : "Generate"} {count > 1 ? `${count} Tokens` : "Token"}
        </button>

        {/* Copy error */}
        {copyError && (
          <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
            Copy failed — select the token and press Ctrl+C / Cmd+C manually.
          </div>
        )}

        {/* Empty state */}
        {!generated && <EmptyState />}

        {/* Results */}
        {tokens.length > 0 && (
          <TokenList
            tokens={tokens}
            masked={masked}
            copied={copied}
            charsetKey={charsetKey}
            bits={bits}
            strengthColor={strength.color}
            onCopy={handleCopy}
            onMaskToggle={() => setMasked((m) => !m)}
          />
        )}
      </div>
    </div>
  );
}
