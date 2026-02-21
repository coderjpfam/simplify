"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ALGORITHMS,
  strengthLabel,
  hashPassword,
  copyText,
} from "@/lib/password-hasher";
import type { AlgorithmKey, EncodingKey } from "@/lib/password-hasher";
import { ControlsCard } from "./ControlsCard";
import { EmptyState } from "./EmptyState";
import { HashCompare } from "./HashCompare";
import { HashResult } from "./HashResult";
import { LoadingState } from "./LoadingState";

export function PasswordHasher() {
  const [password, setPassword] = useState("");
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("bcrypt");
  const [encoding, setEncoding] = useState<EncodingKey>("hex");
  const [salt, setSalt] = useState("");
  const [useSalt, setUseSalt] = useState(false);
  const [rounds, setRounds] = useState(10);
  const [showPass, setShowPass] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [masked, setMasked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hashed, setHashed] = useState(false);
  const [verifyMode, setVerifyMode] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const algo = ALGORITHMS[algorithm];
  const strength = strengthLabel(algorithm, rounds);

  useEffect(() => {
    if (loading) {
      setElapsed(0);
      elapsedRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else if (elapsedRef.current) {
      clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    }
    return () => {
      if (elapsedRef.current) {
        clearInterval(elapsedRef.current);
        elapsedRef.current = null;
      }
    };
  }, [loading]);

  const reset = () => {
    setHash(null);
    setHashed(false);
    setError(null);
    setCopyError(false);
    setMasked(false);
    setCopied(false);
  };

  const handleAlgorithmChange = (key: AlgorithmKey) => {
    setAlgorithm(key);
    reset();
  };

  const handleHash = async () => {
    if (!password.trim()) {
      setError("Please enter a password to hash.");
      return;
    }
    if (useSalt && !salt.trim()) {
      setError("Salt is enabled but empty. Enter a salt or generate one.");
      return;
    }
    setError(null);
    setLoading(true);
    setHash(null);
    try {
      const result = await hashPassword(password, algorithm, encoding, salt, useSalt, rounds);
      setHash(result);
      setHashed(true);
      setMasked(false);
      setCopied(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hashing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!hash) return;
    const ok = await copyText(hash);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (ok) {
      setCopied(true);
      setCopyError(false);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Password Hasher</h1>
          <p className="text-sm text-gray-400">Client-side only · Web Crypto API · Never sent over network</p>
        </div>

        {/* Hash / Verify toggle - always at top */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setVerifyMode(false); reset(); setPassword(""); setSalt(""); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-150 ${
              !verifyMode
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            Hash
          </button>
          <button
            onClick={() => { setVerifyMode(true); reset(); setPassword(""); setSalt(""); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-150 ${
              verifyMode
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            Verify
          </button>
        </div>

        {/* Hash mode: controls card */}
        {!verifyMode && (
          <ControlsCard
            password={password}
            onPasswordChange={setPassword}
            onErrorClear={() => setError(null)}
            showPass={showPass}
            onShowPassToggle={() => setShowPass((v) => !v)}
            algorithm={algorithm}
            onAlgorithmChange={handleAlgorithmChange}
            rounds={rounds}
            onRoundsChange={setRounds}
            useSalt={useSalt}
            onUseSaltToggle={() => setUseSalt((v) => !v)}
            salt={salt}
            onSaltChange={setSalt}
            encoding={encoding}
            onEncodingChange={setEncoding}
            strength={strength}
            onKeyDown={(e) => e.key === "Enter" && handleHash()}
          />
        )}

        {verifyMode ? (
          <HashCompare />
        ) : (
          <>
            <button
              onClick={handleHash}
              disabled={loading}
              className="mt-3 w-full py-3.5 bg-gray-900 hover:bg-gray-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150"
            >
              {loading
                ? `Hashing… ${elapsed > 0 ? `(${elapsed}s)` : ""}`
                : hashed
                  ? "Rehash Password"
                  : "Hash Password"}
            </button>

            {error && (
              <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}
            {copyError && (
              <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
                Copy failed — select the hash and press Ctrl+C / Cmd+C manually.
              </div>
            )}

            {!hashed && !loading && !error && <EmptyState verifyMode={false} />}

            {loading && <LoadingState algorithm={algorithm} rounds={rounds} elapsed={elapsed} />}

            {hash && !loading && (
          <HashResult
            hash={hash}
            masked={masked}
            copied={copied}
            algorithm={algorithm}
            encoding={encoding}
            rounds={rounds}
            useSalt={useSalt}
            salt={salt}
            strengthColor={strength.color}
            onMaskToggle={() => setMasked((m) => !m)}
            onCopy={handleCopy}
            onReset={reset}
          />
            )}
          </>
        )}
      </div>
    </div>
  );
}
