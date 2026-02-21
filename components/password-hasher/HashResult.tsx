import { SHA_BITS } from "@/lib/password-hasher";
import type { AlgorithmKey, EncodingKey } from "@/lib/password-hasher";

interface HashResultProps {
  hash: string;
  masked: boolean;
  copied: boolean;
  algorithm: AlgorithmKey;
  encoding: EncodingKey;
  rounds: number;
  useSalt: boolean;
  salt: string;
  strengthColor: string;
  onMaskToggle: () => void;
  onCopy: () => void;
  onReset: () => void;
}

export function HashResult({
  hash,
  masked,
  copied,
  algorithm,
  encoding,
  rounds,
  useSalt,
  salt,
  strengthColor,
  onMaskToggle,
  onCopy,
  onReset,
}: HashResultProps) {
  return (
    <div className="mt-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Hash Output</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onMaskToggle}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all duration-150"
          >
            {masked ? "👁 Reveal" : "🙈 Hide"}
          </button>
          <button
            onClick={onCopy}
            className={`text-xs font-semibold px-3 py-1.5 border rounded-lg transition-all duration-150 ${
              copied ? "border-gray-900 text-gray-900 bg-gray-50" : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button
            onClick={onReset}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-400 transition-all duration-150"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Hash display */}
      <div className="bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 transition-all duration-150">
        <code className="text-xs font-mono text-gray-700 break-all leading-relaxed select-all block">
          {masked ? "•".repeat(Math.min(hash.length, 40)) : hash}
        </code>
      </div>

      {/* Meta footer */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-300">
        <span className="font-semibold text-gray-400 uppercase tracking-widest">Info</span>
        <span className={`font-bold text-sm ${strengthColor}`}>{algorithm}</span>
        {algorithm === "bcrypt" ? (
          <span>
            rounds {rounds} · 2^{rounds} = {(2 ** rounds).toLocaleString()} iterations · {hash.length} chars
          </span>
        ) : (
          <span>
            {SHA_BITS[algorithm as keyof typeof SHA_BITS]}-bit · {encoding.toUpperCase()} · {hash.length} chars
            {useSalt && salt ? " · Salted" : ""}
          </span>
        )}
      </div>

      {/* Notices */}
      {algorithm === "SHA-1" && (
        <div className="mt-3 px-4 py-2.5 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-600">
          ⚠ SHA-1 is cryptographically weak. Use SHA-256 or higher for security-sensitive use cases.
        </div>
      )}
      {algorithm === "bcrypt" && (
        <div className="mt-3 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-500">
          ℹ bcrypt auto-embeds a random salt — each hash is unique even for the same password. Use Verify mode
          to check a password against this hash.
        </div>
      )}
    </div>
  );
}
