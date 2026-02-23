"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { encryptText, decryptText, copyText } from "@/lib/enc-dec";
import type { AlgorithmKey, EncodingKey } from "@/lib/enc-dec";
import { Spinner } from "./Spinner";
import { ModeToggle } from "./ModeToggle";
import { ControlsCard } from "./ControlsCard";
import { OutputSection } from "./OutputSection";
import { EmptyState } from "./EmptyState";

type Mode = "encrypt" | "decrypt";

export function EncryptDecrypt() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("AES-GCM");
  const [keyBits, setKeyBits] = useState(256);
  const [encoding, setEncoding] = useState<EncodingKey>("base64");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [masked, setMasked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setOutput("");
    setError(null);
    setDone(false);
    setMasked(false);
    setCopied(false);
    setCopyError(false);
  }, []);

  const clearAll = useCallback(() => {
    setInput("");
    setPassword("");
    reset();
  }, [reset]);

  const handleModeSwitch = useCallback(
    (m: Mode) => {
      setMode(m);
      setInput("");
      setPassword("");
      reset();
    },
    [reset]
  );

  const handleRun = useCallback(async () => {
    if (!input.trim()) {
      setError("Please enter text to " + mode + ".");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }
    setError(null);
    setOutput("");
    setLoading(true);
    setDone(false);
    try {
      let result: string;
      if (mode === "encrypt") {
        result = await encryptText(
          input,
          password,
          algorithm,
          keyBits,
          encoding
        );
      } else {
        result = await decryptText(input, password);
      }
      setOutput(result);
      setDone(true);
      setMasked(false);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : mode === "encrypt"
            ? "Encryption failed."
            : "Decryption failed."
      );
    } finally {
      setLoading(false);
    }
  }, [input, password, algorithm, keyBits, encoding, mode]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    const ok = await copyText(output);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (ok) {
      setCopied(true);
      setCopyError(false);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyError(true);
      timerRef.current = setTimeout(() => setCopyError(false), 3000);
    }
  }, [output]);

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
            Encryption / Decryption
          </h1>
          <p className="text-sm text-gray-400">
            AES encryption · PBKDF2 key derivation · Web Crypto API ·
            Client-side only
          </p>
        </div>

        <ModeToggle mode={mode} onModeChange={handleModeSwitch} />

        <ControlsCard
          mode={mode}
          input={input}
          onInputChange={setInput}
          onReset={reset}
          password={password}
          onPasswordChange={setPassword}
          showPass={showPass}
          onShowPassToggle={() => setShowPass((v) => !v)}
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          keyBits={keyBits}
          onKeyBitsChange={setKeyBits}
          encoding={encoding}
          onEncodingChange={setEncoding}
          onRun={handleRun}
        />

        {/* Action button */}
        <button
          onClick={handleRun}
          disabled={loading}
          className="mt-3 w-full py-3.5 bg-gray-900 hover:bg-gray-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              {mode === "encrypt" ? "Encrypting…" : "Decrypting…"}
            </span>
          ) : done ? (
            mode === "encrypt" ? "Re-encrypt" : "Re-decrypt"
          ) : mode === "encrypt" ? (
            "Encrypt"
          ) : (
            "Decrypt"
          )}
        </button>

        {/* Errors */}
        {error && (
          <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
            {error}
          </div>
        )}
        {copyError && (
          <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
            Copy failed — select the output and press Ctrl+C / Cmd+C manually.
          </div>
        )}

        {/* Empty state */}
        {!done && !loading && !error && (
          <EmptyState mode={mode} />
        )}

        {/* Output */}
        {done && !loading && (
          <OutputSection
            mode={mode}
            output={output}
            masked={masked}
            onMaskedToggle={() => setMasked((m) => !m)}
            onCopy={handleCopy}
            onClear={clearAll}
            copied={copied}
            algorithm={algorithm}
            keyBits={keyBits}
            encoding={encoding}
          />
        )}
      </div>
    </div>
  );
}
