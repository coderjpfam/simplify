"use client";

interface DecodeOutputProps {
  content: string;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
}

export function DecodeOutput({
  content,
  copied,
  onCopy,
  onReset,
}: DecodeOutputProps) {
  const isUrl = /^https?:\/\//i.test(content.trim());
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Decoded content
        </span>
        <div className="flex items-center gap-2">
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
            onClick={onReset}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-400 transition-all duration-150"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 transition-all duration-150">
        <code className="text-xs font-mono text-gray-700 break-all leading-relaxed select-all block">
          {content}
        </code>
      </div>

      {isUrl && (
        <a
          href={content.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Open link
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}

      <div className="mt-3 px-4 py-2.5 bg-green-50 border border-green-100 rounded-lg text-xs text-green-600">
        ✓ QR code decoded successfully. {content.length} characters.
      </div>
    </div>
  );
}
