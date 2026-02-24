"use client";

type Mode = "generate" | "decode";

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (m: Mode) => void;
}

const TABS: [Mode, string][] = [
  ["generate", "Generate QR Code"],
  ["decode", "Decode QR Code"],
];

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 mb-3">
      {TABS.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onModeChange(key)}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-150 ${
            mode === key
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
