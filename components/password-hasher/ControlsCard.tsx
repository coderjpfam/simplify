import { ALGORITHMS, ENCODINGS, SHA_BITS } from "@/lib/password-hasher";
import type { AlgorithmKey, EncodingKey } from "@/lib/password-hasher";
import { generateSalt } from "@/lib/password-hasher";

interface ControlsCardProps {
  password: string;
  onPasswordChange: (v: string) => void;
  onErrorClear: () => void;
  showPass: boolean;
  onShowPassToggle: () => void;
  algorithm: AlgorithmKey;
  onAlgorithmChange: (key: AlgorithmKey) => void;
  rounds: number;
  onRoundsChange: (v: number) => void;
  useSalt: boolean;
  onUseSaltToggle: () => void;
  salt: string;
  onSaltChange: (v: string) => void;
  encoding: EncodingKey;
  onEncodingChange: (key: EncodingKey) => void;
  strength: { text: string; color: string; bar: string };
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function ControlsCard({
  password,
  onPasswordChange,
  onErrorClear,
  showPass,
  onShowPassToggle,
  algorithm,
  onAlgorithmChange,
  rounds,
  onRoundsChange,
  useSalt,
  onUseSaltToggle,
  salt,
  onSaltChange,
  encoding,
  onEncodingChange,
  strength,
  onKeyDown,
}: ControlsCardProps) {
  const algo = ALGORITHMS[algorithm];

  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-6">
      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password-input" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Password
          </label>
          <div className="flex items-center gap-3">
            {password.length > 0 && <span className="text-xs text-gray-300">{password.length} chars</span>}
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
          onChange={(e) => { onPasswordChange(e.target.value); onErrorClear(); }}
          onKeyDown={onKeyDown}
          placeholder="Enter your password…"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-150"
        />
      </div>

      {/* Algorithm */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Algorithm</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ALGORITHMS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => onAlgorithmChange(key as AlgorithmKey)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                algorithm === key
                  ? "border-gray-900 text-gray-900 bg-gray-100"
                  : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* bcrypt: Rounds */}
      {algo.hasRounds && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="rounds-slider" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Rounds (Cost Factor)
            </label>
            <span className="text-sm font-bold text-gray-900">
              {rounds}
              <span className="text-xs font-normal text-gray-400 ml-1.5">
                ({(2 ** rounds).toLocaleString()} iterations)
              </span>
            </span>
          </div>
          <input
            id="rounds-slider"
            type="range"
            min={4}
            max={16}
            value={rounds}
            onChange={(e) => onRoundsChange(Number(e.target.value))}
            className="w-full accent-gray-900 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>4 — fastest</span>
            <span>16 — slowest</span>
          </div>
          {rounds >= 14 && (
            <p className="mt-2 text-xs text-yellow-500 font-medium">
              ⚠ Rounds {rounds} may take {rounds >= 15 ? "30+" : "10+"} seconds to compute.
            </p>
          )}
        </div>
      )}

      {/* SHA: Salt */}
      {algo.hasSalt && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Salt</span>
              <button
                role="switch"
                aria-checked={useSalt}
                onClick={() => { onUseSaltToggle(); onErrorClear(); }}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-200 ${
                  useSalt ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform duration-200 ${
                    useSalt ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {useSalt && (
              <button
                onClick={() => onSaltChange(generateSalt(16))}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors duration-150"
              >
                ↺ Generate
              </button>
            )}
          </div>
          {useSalt && (
            <input
              type="text"
              value={salt}
              onChange={(e) => onSaltChange(e.target.value)}
              placeholder="Enter or generate a salt…"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-800 placeholder-gray-300 focus:outline-none transition-colors duration-150 ${
                !salt.trim() ? "border-yellow-200 focus:border-yellow-400" : "border-gray-200 focus:border-gray-400"
              }`}
            />
          )}
          {useSalt && !salt.trim() && (
            <p className="mt-1.5 text-xs text-yellow-500">Salt is empty — hash will not be salted.</p>
          )}
        </div>
      )}

      {/* SHA: Encoding */}
      {algo.hasEncoding && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Output Encoding</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ENCODINGS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onEncodingChange(key as EncodingKey)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  encoding === key
                    ? "border-gray-900 text-gray-900 bg-gray-100"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Strength meter */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Strength</p>
          <span className={`text-xs font-bold ${strength.color}`}>
            {strength.text}
            {algorithm !== "bcrypt" && (
              <span className="font-normal text-gray-400 ml-1">
                · {SHA_BITS[algorithm as keyof typeof SHA_BITS]} bits
              </span>
            )}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${strength.bar}`} />
        </div>
      </div>
    </div>
  );
}
