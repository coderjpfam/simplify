"use client";

import { useState, useRef, useEffect } from "react";
import {
  ALGORITHMS_COMPARE,
  ENCODINGS,
  hashSHA,
  verifyBcrypt,
  copyText,
  detectAlgorithm,
  extractBcryptRounds,
  timingSafeEqual,
} from "@/lib/password-hasher";
import type { AlgorithmKey, EncodingKey } from "@/lib/password-hasher";
import { Spinner } from "./Spinner";

export function HashCompare() {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [hashInput, setHashInput] = useState("");
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("bcrypt");
  const [encoding, setEncoding] = useState<EncodingKey>("hex");
  const [salt, setSalt] = useState("");
  const [useSalt, setUseSalt] = useState(false);
  const [autoDetected, setAutoDetected] = useState<string | null>(null);
  const [rounds, setRounds] = useState(10);
  const [comparing, setComparing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<{ match: boolean; computedHash: string; timeTaken: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedComputed, setCopiedComputed] = useState(false);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const algo = ALGORITHMS_COMPARE[algorithm];

  useEffect(() => {
    const trimmed = hashInput.trim();
    if (!trimmed) {
      setAutoDetected(null);
      return;
    }
    const detected = detectAlgorithm(trimmed);
    if (detected && detected !== algorithm) {
      setAutoDetected(detected);
    } else {
      setAutoDetected(null);
    }
  }, [hashInput, algorithm]);

  useEffect(() => {
    if (comparing) {
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
  }, [comparing]);

  const reset = () => {
    setResult(null);
    setError(null);
    setCopyError(false);
    setCopiedComputed(false);
    setCopiedInput(false);
  };

  const handleCompare = async () => {
    if (!password.trim()) {
      setError("Please enter a password to compare.");
      return;
    }
    if (!hashInput.trim()) {
      setError("Please paste a hash to compare against.");
      return;
    }
    if (useSalt && !salt.trim()) {
      setError("Salt is enabled but empty. Enter a salt or disable it.");
      return;
    }

    setError(null);
    setResult(null);
    setComparing(true);
    const start = performance.now();

    try {
      let match = false;
      let computedHash = "";

      if (algo.isBcrypt) {
        match = await verifyBcrypt(password, hashInput.trim());
        computedHash = match ? hashInput.trim() : "(bcrypt hashes are one-way — computed internally)";
      } else {
        computedHash = await hashSHA(password, algorithm, encoding, useSalt ? salt : "");
        match = timingSafeEqual(computedHash, hashInput.trim());
      }

      const timeTaken = ((performance.now() - start) / 1000).toFixed(2);
      setResult({ match, computedHash, timeTaken });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed.");
    } finally {
      setComparing(false);
    }
  };

  const handleCopy = async (text: string, key: "computed" | "input") => {
    const ok = await copyText(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (ok) {
      if (key === "computed") setCopiedComputed(true);
      else setCopiedInput(true);
      setCopyError(false);
      timerRef.current = setTimeout(() => {
        setCopiedComputed(false);
        setCopiedInput(false);
      }, 2000);
    } else {
      setCopyError(true);
      timerRef.current = setTimeout(() => setCopyError(false), 3000);
    }
  };

  const hashRounds = extractBcryptRounds(hashInput);
  const displayRounds = hashRounds ?? rounds;

  return (
    <>
      <div className="border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="compare-password" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Password
            </label>
            <div className="flex items-center gap-3">
              {password.length > 0 && <span className="text-xs text-gray-300">{password.length} chars</span>}
              <button
                onClick={() => setShowPass((v) => !v)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors duration-150"
              >
                {showPass ? "🙈 Hide" : "👁 Show"}
              </button>
            </div>
          </div>
          <input
            id="compare-password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); reset(); }}
            onKeyDown={(e) => e.key === "Enter" && handleCompare()}
            placeholder="Enter the plain-text password…"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150"
          />
        </div>

        {/* Hash input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="hash-input" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Hash to Compare
            </label>
            {hashInput.length > 0 && <span className="text-xs text-gray-300">{hashInput.trim().length} chars</span>}
          </div>
          <textarea
            id="hash-input"
            value={hashInput}
            onChange={(e) => { setHashInput(e.target.value); reset(); }}
            placeholder="Paste the hash here…"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-mono text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150 resize-none leading-relaxed"
          />
          {autoDetected && (
            <div className="mt-2 flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-500">
                🔍 Detected <span className="font-bold">{autoDetected}</span> from hash format
              </p>
              <button
                onClick={() => { setAlgorithm(autoDetected as AlgorithmKey); setAutoDetected(null); reset(); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Switch →
              </button>
            </div>
          )}
        </div>

        {/* Algorithm */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Algorithm</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ALGORITHMS_COMPARE).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => { setAlgorithm(key as AlgorithmKey); reset(); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  algorithm === key
                    ? "border-gray-900 text-gray-900 bg-gray-100"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* SHA: Salt */}
        {!algo.isBcrypt && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Salt</span>
                <button
                  role="switch"
                  aria-checked={useSalt}
                  onClick={() => { setUseSalt((v) => !v); reset(); }}
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-200 ${
                    useSalt ? "bg-gray-900" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform duration-200 ${
                      useSalt ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
            {useSalt && (
              <>
                <input
                  type="text"
                  value={salt}
                  onChange={(e) => { setSalt(e.target.value); reset(); }}
                  placeholder="Enter the same salt used when hashing…"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-800 placeholder-gray-300 focus:outline-none transition-colors duration-150 ${
                    !salt.trim() ? "border-yellow-200 focus:border-yellow-400" : "border-gray-200 focus:border-gray-400"
                  }`}
                />
                {!salt.trim() && (
                  <p className="mt-1.5 text-xs text-yellow-500">Salt is empty — comparison will be made without a salt.</p>
                )}
              </>
            )}
          </div>
        )}

        {/* SHA: Encoding */}
        {algo.hasEncoding && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Hash Encoding</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ENCODINGS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setEncoding(key as EncodingKey); reset(); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    encoding === key
                      ? "border-gray-900 text-gray-900 bg-gray-100"
                      : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* bcrypt: Rounds */}
        {algo.isBcrypt && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Rounds (Cost Factor)
              </label>
              <span className="text-sm font-bold text-gray-900">
                {displayRounds}
                <span className="text-xs font-normal text-gray-400 ml-1.5">
                  ({(2 ** displayRounds).toLocaleString()} iterations)
                  {hashRounds !== null ? " · from hash" : ""}
                </span>
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              value={displayRounds}
              onChange={(e) => {
                if (hashRounds === null) {
                  setRounds(Number(e.target.value));
                  reset();
                }
              }}
              className="w-full accent-gray-900 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>4 — fastest</span>
              <span>16 — slowest</span>
            </div>
            {hashRounds !== null ? (
              <p className="mt-2 text-xs text-blue-500">
                🔢 Rounds auto-detected from hash string — slider locked to {hashRounds}.
              </p>
            ) : (
              rounds >= 14 && (
                <p className="mt-2 text-xs text-yellow-500 font-medium">
                  ⚠ Rounds {rounds} may take {rounds >= 15 ? "30+" : "10+"} seconds to compare.
                </p>
              )
            )}
            <div className="mt-3 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-500">
              ℹ bcrypt embeds rounds and salt inside the hash — comparison uses the values from the hash automatically.
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleCompare}
        disabled={comparing}
        className="mt-3 w-full py-3.5 bg-gray-900 hover:bg-gray-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150"
      >
        {comparing
          ? `Comparing… ${elapsed > 0 ? `(${elapsed}s)` : ""}`
          : result ? "Compare Again" : "Compare"}
      </button>

      {error && (
        <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">{error}</div>
      )}
      {copyError && (
        <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
          Copy failed — select the text and press Ctrl+C / Cmd+C manually.
        </div>
      )}

      {!result && !comparing && !error && (
        <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm font-medium text-gray-400">No comparison yet</p>
          <p className="text-xs text-gray-300 mt-1">Enter a password, paste a hash, and hit Compare</p>
        </div>
      )}

      {comparing && (
        <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center gap-3">
          <Spinner />
          <p className="text-sm font-medium text-gray-400">Comparing…</p>
          {algo.isBcrypt && (
            <p className="text-xs text-gray-300">
              bcrypt comparison in progress
              {hashRounds !== null ? ` · rounds ${hashRounds} (${(2 ** hashRounds).toLocaleString()} iterations)` : ""}
              {elapsed > 0 && <span className="ml-2 text-gray-400 font-medium">{elapsed}s elapsed</span>}
            </p>
          )}
        </div>
      )}

      {result && !comparing && (
        <div className="mt-6 space-y-3">
          <div
            className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${
              result.match ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <span className={`text-3xl font-bold ${result.match ? "text-green-500" : "text-red-400"}`}>
              {result.match ? "✓" : "✕"}
            </span>
            <div className="flex-1">
              <p className={`text-sm font-bold ${result.match ? "text-green-700" : "text-red-600"}`}>
                {result.match ? "Password matches the hash!" : "Password does not match."}
              </p>
              <p className={`text-xs mt-0.5 ${result.match ? "text-green-500" : "text-red-400"}`}>
                {result.match
                  ? "The plain-text password is correct for the given hash."
                  : "The plain-text password does not correspond to the given hash."}
              </p>
            </div>
            <span className="text-xs text-gray-400 font-medium shrink-0">{result.timeTaken}s</span>
          </div>

          {!algo.isBcrypt && (
            <>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-4 mb-2">
                Hash Breakdown
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-400">Computed from password</span>
                  <button
                    onClick={() => handleCopy(result.computedHash, "computed")}
                    className={`text-xs font-semibold px-3 py-1 border rounded-lg transition-all duration-150 ${
                      copiedComputed
                        ? "border-gray-900 text-gray-900 bg-gray-50"
                        : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {copiedComputed ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div
                  className={`rounded-xl px-4 py-3 border transition-all duration-150 ${
                    result.match ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <code className="text-xs font-mono text-gray-700 break-all leading-relaxed select-all block">
                    {result.computedHash}
                  </code>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-400">Provided hash</span>
                  <button
                    onClick={() => handleCopy(hashInput.trim(), "input")}
                    className={`text-xs font-semibold px-3 py-1 border rounded-lg transition-all duration-150 ${
                      copiedInput
                        ? "border-gray-900 text-gray-900 bg-gray-50"
                        : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {copiedInput ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div
                  className={`rounded-xl px-4 py-3 border transition-all duration-150 ${
                    result.match ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  }`}
                >
                  <code className="text-xs font-mono text-gray-700 break-all leading-relaxed select-all block">
                    {hashInput.trim()}
                  </code>
                </div>
              </div>
              {!result.match && (
                <div className="px-4 py-2.5 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-600">
                  ⚠ The hashes are different. Check that the algorithm, encoding, and salt match what was used when
                  the hash was originally created.
                </div>
              )}
            </>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-300">
            <span className="font-semibold text-gray-400 uppercase tracking-widest">Info</span>
            <span className="font-bold text-sm text-gray-700">{algorithm}</span>
            {algo.isBcrypt ? (
              <span>
                timing-safe comparison · salt embedded in hash
                {hashRounds !== null ? ` · rounds ${hashRounds} (${(2 ** hashRounds).toLocaleString()} iterations)` : ""}
              </span>
            ) : (
              <span>
                {algo.bits}-bit · {encoding.toUpperCase()} · timing-safe compare
                {useSalt && salt ? " · Salted" : ""}
              </span>
            )}
            <span className="ml-auto">{result.timeTaken}s</span>
          </div>

          {algorithm === "SHA-1" && (
            <div className="px-4 py-2.5 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-600">
              ⚠ SHA-1 is cryptographically weak. Use SHA-256 or higher for security-sensitive use cases.
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={() => { reset(); setPassword(""); setHashInput(""); setSalt(""); }}
              className="text-xs font-semibold px-4 py-2 border border-gray-200 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-400 transition-all duration-150"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </>
  );
}
