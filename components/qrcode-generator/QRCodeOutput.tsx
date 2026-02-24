"use client";

interface QRCodeOutputProps {
  dataUrl: string;
  onDownload: () => void;
  onReset: () => void;
  size: number;
  errorLevel: string;
}

export function QRCodeOutput({
  dataUrl,
  onDownload,
  onReset,
  size,
  errorLevel,
}: QRCodeOutputProps) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          QR Code
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onDownload}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-900 text-gray-900 bg-white hover:bg-gray-50 rounded-lg transition-all duration-150"
          >
            ⬇ Download PNG
          </button>
          <button
            onClick={onReset}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-400 transition-all duration-150"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex justify-center py-6 px-4 bg-gray-50 border border-gray-100 rounded-xl">
        <img
          src={dataUrl}
          alt="Generated QR code"
          className="max-w-full rounded-lg"
          style={{ width: size, height: size }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-300">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Info
        </span>
        <span>
          {size}×{size}px · {errorLevel} error correction
        </span>
      </div>
    </div>
  );
}
