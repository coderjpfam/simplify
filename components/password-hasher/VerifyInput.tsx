interface VerifyInputProps {
  value: string;
  onChange: (v: string) => void;
  onResultClear: () => void;
  onErrorClear: () => void;
}

export function VerifyInput({ value, onChange, onResultClear, onErrorClear }: VerifyInputProps) {
  return (
    <div className="mt-3 border border-gray-200 rounded-xl p-4">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">
        Paste bcrypt Hash to Verify
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onResultClear();
          onErrorClear();
        }}
        placeholder="$2b$10$..."
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-mono text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150"
      />
    </div>
  );
}
