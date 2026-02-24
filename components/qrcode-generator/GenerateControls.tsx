"use client";

import { ERROR_LEVELS } from "@/lib/qrcode-generator";
import type { ErrorLevel } from "@/lib/qrcode-generator";

const SIZES = [128, 192, 256, 320, 512] as const;
const MARGINS = [0, 1, 2, 4, 8] as const;

const PRESET_COLORS: { fg: string; bg: string; label: string }[] = [
  { fg: "#000000", bg: "#ffffff", label: "Black / White" },
  { fg: "#1e3a5f", bg: "#f0f4f8", label: "Navy / Light" },
  { fg: "#059669", bg: "#ecfdf5", label: "Green / Mint" },
  { fg: "#7c3aed", bg: "#f5f3ff", label: "Purple / Lavender" },
  { fg: "#dc2626", bg: "#fef2f2", label: "Red / Rose" },
];

interface GenerateControlsProps {
  text: string;
  onTextChange: (v: string) => void;
  size: number;
  onSizeChange: (v: number) => void;
  errorLevel: ErrorLevel;
  onErrorLevelChange: (v: ErrorLevel) => void;
  fgColor: string;
  bgColor: string;
  onColorsChange: (fg: string, bg: string) => void;
  margin: number;
  onMarginChange: (v: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function GenerateControls({
  text,
  onTextChange,
  size,
  onSizeChange,
  errorLevel,
  onErrorLevelChange,
  fgColor,
  bgColor,
  onColorsChange,
  margin,
  onMarginChange,
  onKeyDown,
}: GenerateControlsProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-6">
      {/* Text / URL input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="qr-text-input"
            className="text-xs font-semibold text-gray-400 uppercase tracking-widest"
          >
            Text or URL
          </label>
          {text.length > 0 && (
            <span className="text-xs text-gray-300">{text.length} chars</span>
          )}
        </div>
        <textarea
          id="qr-text-input"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter text, URL, vCard, Wi‑Fi config…"
          rows={3}
          spellCheck={false}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150 resize-none leading-relaxed"
        />
      </div>

      {/* Size */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onSizeChange(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                size === s
                  ? "border-gray-900 text-gray-900 bg-gray-100"
                  : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
              }`}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      {/* Error correction level */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
          Error correction
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(ERROR_LEVELS) as [ErrorLevel, { label: string; resistance: string }][]).map(
            ([key, { label, resistance }]) => (
              <button
                key={key}
                onClick={() => onErrorLevelChange(key)}
                title={`Recovery: ${resistance}`}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  errorLevel === key
                    ? "border-gray-900 text-gray-900 bg-gray-100"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
                }`}
              >
                {label} ({resistance})
              </button>
            )
          )}
        </div>
      </div>

      {/* Margin */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="margin-slider"
            className="text-xs font-semibold text-gray-400 uppercase tracking-widest"
          >
            Quiet zone
          </label>
          <span className="text-sm font-bold text-gray-900">{margin} modules</span>
        </div>
        <input
          id="margin-slider"
          type="range"
          min={0}
          max={8}
          value={margin}
          onChange={(e) => onMarginChange(Number(e.target.value))}
          className="w-full accent-gray-900 cursor-pointer"
        />
      </div>

      {/* Color presets */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
          Colors
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => {
            const active = fgColor === preset.fg && bgColor === preset.bg;
            return (
              <button
                key={preset.label}
                onClick={() => onColorsChange(preset.fg, preset.bg)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                  active
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span
                  className="w-4 h-4 rounded border border-gray-200"
                  style={{ backgroundColor: preset.fg }}
                />
                <span
                  className="w-4 h-4 rounded border border-gray-200"
                  style={{ backgroundColor: preset.bg }}
                />
                <span className="text-xs font-medium text-gray-600">{preset.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Foreground</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => onColorsChange(e.target.value, bgColor)}
              className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Background</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onColorsChange(fgColor, e.target.value)}
              className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
