import { VERSIONS, FORMATS } from "@/lib/uuid-generator";
import type { VersionKey, FormatKey } from "@/lib/uuid-generator";

interface ControlsCardProps {
  version: VersionKey;
  onVersionChange: (key: VersionKey) => void;
  format: FormatKey;
  onFormatChange: (key: FormatKey) => void;
  count: number;
  onCountChange: (v: number) => void;
  strengthText: string;
  strengthColor: string;
  strengthBar: string;
  entropyBits: number;
  onReset: () => void;
}

export function ControlsCard({
  version,
  onVersionChange,
  format,
  onFormatChange,
  count,
  onCountChange,
  strengthText,
  strengthColor,
  strengthBar,
  entropyBits,
  onReset,
}: ControlsCardProps) {
  const handleVersionChange = (key: VersionKey) => {
    onVersionChange(key);
    onReset();
  };

  const handleFormatChange = (key: FormatKey) => {
    onFormatChange(key);
    onReset();
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-6">
      {/* Version */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Version</p>
        <div className="flex flex-col gap-2">
          {Object.entries(VERSIONS).map(([key, { label, description }]) => (
            <button
              key={key}
              onClick={() => handleVersionChange(key as VersionKey)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                version === key ? "border-gray-900 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className={`text-xs font-bold ${version === key ? "text-gray-900" : "text-gray-500"}`}>{label}</span>
              <span className="text-xs text-gray-400 ml-4 text-right">{description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Format</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(FORMATS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleFormatChange(key as FormatKey)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                format === key
                  ? "border-gray-900 text-gray-900 bg-gray-100"
                  : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs font-mono text-gray-300 tracking-wide">{FORMATS[format].example}</p>
      </div>

      {/* Count */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="count-slider" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Count
          </label>
          <span className="text-sm font-bold text-gray-900">
            {count} UUID{count > 1 ? "s" : ""}
          </span>
        </div>
        <input
          id="count-slider"
          type="range"
          min={1}
          max={20}
          value={count}
          onChange={(e) => onCountChange(Number(e.target.value))}
          className="w-full accent-gray-900 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      {/* Strength meter */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Randomness</p>
          <span className={`text-xs font-bold ${strengthColor}`}>
            {strengthText} · {entropyBits} bits
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${strengthBar}`} />
        </div>
      </div>
    </div>
  );
}
