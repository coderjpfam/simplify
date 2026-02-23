"use client";

import { strengthLabel } from "@/lib/enc-dec";
import type { AlgorithmKey, EncodingKey } from "@/lib/enc-dec";

type Mode = "encrypt" | "decrypt";

interface OutputSectionProps {
  mode: Mode;
  output: string;
  masked: boolean;
  onMaskedToggle: () => void;
  onCopy: () => void;
  onClear: () => void;
  copied: boolean;
  algorithm?: AlgorithmKey;
  keyBits?: number;
  encoding?: EncodingKey;
}

function maskOutput(o: string): string {
  return "•".repeat(Math.min(o.length, 40));
}

export function OutputSection({
  mode,
  output,
  masked,
  onMaskedToggle,
  onCopy,
  onClear,
  copied,
  algorithm = "AES-GCM",
  keyBits = 256,
  encoding = "base64",
}: OutputSectionProps) {
  const strength = strengthLabel(keyBits);

  return (
    <div className="mt-6">
      {/* Output toolbar */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {mode === "encrypt" ? "Encrypted Output" : "Decrypted Text"}
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label={masked ? "Reveal output" : "Hide output"}
            onClick={onMaskedToggle}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all duration-150"
          >
            {masked ? "👁 Reveal" : "🙈 Hide"}
          </button>
          <button
            onClick={onCopy}
            className={`text-xs font-semibold px-3 py-1.5 border rounded-lg transition-all duration-150 ${
              copied
                ? "border-gray-900 text-gray-900 bg-gray-50"
                : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button
            onClick={onClear}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-400 transition-all duration-150"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Output box */}
      <div className="bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 transition-all duration-150">
        <code className="text-xs font-mono text-gray-700 break-all leading-relaxed select-all block">
          {masked ? maskOutput(output) : output}
        </code>
      </div>

      {/* Meta footer */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-300">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Info
        </span>
        {mode === "encrypt" ? (
          <>
            <span className={`text-sm font-bold ${strength.color}`}>
              {algorithm}
            </span>
            <span>
              {keyBits}-bit key · PBKDF2 · {encoding.toUpperCase()} ·{" "}
              {output.length} chars
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-bold text-emerald-600">Decrypted</span>
            <span>
              {output.length} chars · algorithm auto-detected from ciphertext
            </span>
          </>
        )}
      </div>

      {/* AES-CBC warning */}
      {mode === "encrypt" && algorithm === "AES-CBC" && (
        <div className="mt-3 px-4 py-2.5 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-600">
          ⚠ AES-CBC without authentication can be vulnerable to padding oracle
          attacks. Prefer AES-GCM for new projects.
        </div>
      )}

      {/* Success decrypt notice */}
      {mode === "decrypt" && (
        <div className="mt-3 px-4 py-2.5 bg-green-50 border border-green-100 rounded-lg text-xs text-green-600">
          ✓ Decryption successful. The output above is your original plaintext.
        </div>
      )}
    </div>
  );
}
