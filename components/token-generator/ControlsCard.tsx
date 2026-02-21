import { CHARSETS } from "@/lib/token-generator/constants";
import { CharsetKey } from "@/lib/token-generator/types";

interface ControlsCardProps {
  length: number;
  onLengthChange: (v: number) => void;
  count: number;
  onCountChange: (v: number) => void;
  charsetKey: CharsetKey;
  onCharsetChange: (key: CharsetKey) => void;
  strengthLabel: string;
  strengthColor: string;
  strengthBar: string;
  bits: number;
}

export function ControlsCard({
  length,
  onLengthChange,
  count,
  onCountChange,
  charsetKey,
  onCharsetChange,
  strengthLabel,
  strengthColor,
  strengthBar,
  bits,
}: ControlsCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-6">
      {/* Length */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="length-slider" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Length
          </label>
          <span className="text-sm font-bold text-gray-900">{length} chars</span>
        </div>
        <input
          id="length-slider"
          type="range"
          min={8}
          max={256}
          value={length}
          onChange={(e) => onLengthChange(Number(e.target.value))}
          className="w-full accent-gray-900 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>8</span>
          <span>256</span>
        </div>
      </div>

      {/* Count */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="count-slider" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Count
          </label>
          <span className="text-sm font-bold text-gray-900">
            {count} token{count > 1 ? "s" : ""}
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

      {/* Format */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Format</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CHARSETS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => onCharsetChange(key as CharsetKey)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                charsetKey === key
                  ? "border-gray-900 text-gray-900 bg-gray-100"
                  : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Strength meter */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Strength</p>
          <span className={`text-xs font-bold ${strengthColor}`}>
            {strengthLabel} · {bits} bits
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${strengthBar}`} />
        </div>
      </div>
    </div>
  );
}
