"use client";

import { useState } from "react";

interface DecodeControlsProps {
  onFileSelect: (file: File) => void;
  error: string | null;
}

export function DecodeControls({
  onFileSelect,
  error,
}: DecodeControlsProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-6">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          QR code image
        </p>
        <label
          htmlFor="decode-file-input"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer ${
            isDragging
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
          }`}
        >
          <span className="text-3xl mb-3">📷</span>
          <p className="text-sm font-medium text-gray-600">
            Drop an image here or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, WebP, GIF
          </p>
          <input
            id="decode-file-input"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="sr-only"
          />
        </label>
      </div>

      {error && (
        <div className="px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-500">
        ℹ Decoding runs entirely in your browser. Images are never uploaded to a server.
      </div>
    </div>
  );
}
