"use client";

import {
  ALGORITHMS,
  ENCODINGS,
  strengthLabel,
} from "@/lib/enc-dec";
import type {
  AlgorithmKey,
  AlgorithmConfig,
  EncodingKey,
} from "@/lib/enc-dec";

type Mode = "encrypt" | "decrypt";

interface ControlsCardProps {
  mode: Mode;
  input: string;
  onInputChange: (v: string) => void;
  onReset: () => void;
  password: string;
  onPasswordChange: (v: string) => void;
  showPass: boolean;
  onShowPassToggle: () => void;
  algorithm: AlgorithmKey;
  onAlgorithmChange: (key: AlgorithmKey) => void;
  keyBits: number;
  onKeyBitsChange: (b: number) => void;
  encoding: EncodingKey;
  onEncodingChange: (key: EncodingKey) => void;
  onRun: () => void;
}

export function ControlsCard({
  mode,
  input,
  onInputChange,
  onReset,
  password,
  onPasswordChange,
  showPass,
  onShowPassToggle,
  algorithm,
  onAlgorithmChange,
  keyBits,
  onKeyBitsChange,
  encoding,
  onEncodingChange,
  onRun,
}: ControlsCardProps) {
  const algo = ALGORITHMS[algorithm];
  const strength = strengthLabel(keyBits);

  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-6">
      {/* Input text */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="input-text"
            className="text-xs font-semibold text-gray-400 uppercase tracking-widest"
          >
            {mode === "encrypt" ? "Plaintext" : "Ciphertext"}
          </label>
          {input.length > 0 && (
            <span className="text-xs text-gray-300">{input.length} chars</span>
          )}
        </div>
        <textarea
          id="input-text"
          value={input}
          onChange={(e) => {
            onInputChange(e.target.value);
            onReset();
          }}
          placeholder={
            mode === "encrypt"
              ? "Enter the text you want to encrypt…"
              : "Paste the encrypted output here…"
          }
          rows={4}
          spellCheck={false}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-mono text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150 resize-none leading-relaxed"
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="password-input"
            className="text-xs font-semibold text-gray-400 uppercase tracking-widest"
          >
            Password
          </label>
          <div className="flex items-center gap-3">
            {password.length > 0 && (
              <span className="text-xs text-gray-300">{password.length} chars</span>
            )}
            <button
              onClick={onShowPassToggle}
              className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors duration-150"
            >
              {showPass ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
        </div>
        <input
          id="password-input"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => {
            onPasswordChange(e.target.value);
            onReset();
          }}
          onKeyDown={(e) => e.key === "Enter" && onRun()}
          placeholder="Enter encryption password…"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150"
        />
      </div>

      {/* Algorithm — only shown in encrypt mode */}
      {mode === "encrypt" && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
            Algorithm
          </p>
          <div className="flex flex-col gap-2">
            {(Object.entries(ALGORITHMS) as [AlgorithmKey, AlgorithmConfig][]).map(
              ([key, { label, description }]) => (
                <button
                  key={key}
                  onClick={() => {
                    onAlgorithmChange(key);
                    onReset();
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                    algorithm === key
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      algorithm === key ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-xs text-gray-400 ml-4 text-right">
                    {description}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Key size — only shown in encrypt mode */}
      {mode === "encrypt" && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
            Key Size
          </p>
          <div className="flex gap-2">
            {algo.keyBits.map((b) => (
              <button
                key={b}
                onClick={() => {
                  onKeyBitsChange(b);
                  onReset();
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  keyBits === b
                    ? "border-gray-900 text-gray-900 bg-gray-100"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
                }`}
              >
                {b}-bit
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Output encoding — only shown in encrypt mode */}
      {mode === "encrypt" && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
            Output Encoding
          </p>
          <div className="flex gap-2">
            {(Object.entries(ENCODINGS) as [EncodingKey, { label: string }][]).map(
              ([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => {
                    onEncodingChange(key);
                    onReset();
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    encoding === key
                      ? "border-gray-900 text-gray-900 bg-gray-100"
                      : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Strength meter — only shown in encrypt mode */}
      {mode === "encrypt" && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Key Strength
            </p>
            <span className={`text-xs font-bold ${strength.color}`}>
              {strength.text} · {keyBits}-bit key
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${strength.bar}`}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-300">
            PBKDF2 · SHA-256 · 200,000 iterations · random salt per encryption
          </p>
        </div>
      )}

      {/* Decrypt mode info */}
      {mode === "decrypt" && (
        <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-500">
          ℹ Paste the full encrypted output — the algorithm, key size, salt and
          IV are all embedded automatically.
        </div>
      )}
    </div>
  );
}
