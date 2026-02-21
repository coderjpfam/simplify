import { FORMATS } from "@/lib/uuid-generator";
import type { VersionKey, FormatKey } from "@/lib/uuid-generator";

interface UUIDListProps {
  uuids: string[];
  version: VersionKey;
  format: FormatKey;
  entropyBits: number;
  strengthColor: string;
  copied: number | "all" | null;
  onCopy: (text: string, key: number | "all") => void;
}

export function UUIDList({
  uuids,
  version,
  format,
  entropyBits,
  strengthColor,
  copied,
  onCopy,
}: UUIDListProps) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {uuids.length} UUID{uuids.length > 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          {uuids.length > 1 && (
            <button
              onClick={() => onCopy(uuids.join("\n"), "all")}
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

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 transition-all duration-150"
          >
            {uuids.length > 1 && (
              <span className="text-xs font-bold text-gray-300 w-5 shrink-0 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <code className="flex-1 text-xs font-mono text-gray-700 break-all leading-relaxed select-all">{uuid}</code>
            <button
              aria-label={`Copy UUID ${i + 1}`}
              onClick={() => onCopy(uuid, i)}
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

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Info</span>
        <span className={`text-sm font-bold ${strengthColor}`}>UUID {version.toUpperCase()}</span>
        <span className="text-xs text-gray-300">
          {entropyBits} bits random · {FORMATS[format].label} format · RFC 4122
          {version === "v7" && " · sortable"}
          {version === "v1" && " · timestamp-based"}
        </span>
      </div>

      {version === "v1" && (
        <div className="mt-3 px-4 py-2.5 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-600">
          ⚠ v1 UUIDs embed a timestamp. Avoid using them where creation time should not be exposed.
        </div>
      )}

      {version === "v7" && (
        <div className="mt-3 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-500">
          ℹ v7 UUIDs are lexicographically sortable by creation time — ideal for database primary keys.
        </div>
      )}
    </div>
  );
}
