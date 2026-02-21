import { CHARSETS } from "@/lib/token-generator/constants";
import { CharsetKey } from "@/lib/token-generator/types";


function maskToken(token: string): string {
  return "•".repeat(Math.min(token.length, 24));
}

interface TokenListProps {
  tokens: string[];
  masked: boolean;
  copied: number | "all" | null;
  charsetKey: CharsetKey;
  bits: number;
  strengthColor: string;
  onCopy: (text: string, key: number | "all") => void;
  onMaskToggle: () => void;
}

export function TokenList({
  tokens,
  masked,
  copied,
  charsetKey,
  bits,
  strengthColor,
  onCopy,
  onMaskToggle,
}: TokenListProps) {
  return (
    <div className="mt-6">
      {/* Results toolbar */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {tokens.length} Token{tokens.length > 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-2">
          <button
            aria-label={masked ? "Reveal tokens" : "Hide tokens"}
            onClick={onMaskToggle}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all duration-150"
          >
            {masked ? "👁 Reveal" : "🙈 Hide"}
          </button>

          {tokens.length > 1 && (
            <button
              onClick={() => onCopy(tokens.join("\n"), "all")}
              className={`text-xs font-semibold px-3 py-1.5 border rounded-lg transition-all duration-150 ${
                copied === "all"
                  ? "border-gray-900 text-gray-900 bg-gray-50"
                  : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {copied === "all" ? "✓ Copied all" : "Copy all"}
            </button>
          )}
        </div>
      </div>

      {/* Token list */}
      <div className="space-y-2">
        {tokens.map((token, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 transition-all duration-150"
          >
            {tokens.length > 1 && (
              <span className="text-xs font-bold text-gray-300 w-5 shrink-0 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}

            <code className="flex-1 text-xs font-mono text-gray-700 break-all leading-relaxed select-all">
              {masked ? maskToken(token) : token}
            </code>

            <button
              aria-label={`Copy token ${i + 1}`}
              onClick={() => onCopy(token, i)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 border rounded-lg bg-white transition-all duration-150 ${
                copied === i
                  ? "border-gray-900 text-gray-900"
                  : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {copied === i ? "✓ Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      {/* Entropy footer */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Entropy</span>
        <span className={`text-sm font-bold ${strengthColor}`}>~{bits} bits</span>
        <span className="ml-auto text-xs text-gray-300">
          per token · {CHARSETS[charsetKey].chars.length}-char alphabet · CSPRNG
        </span>
      </div>
    </div>
  );
}
