"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  generateQRCode,
  decodeQRCode,
  ERROR_LEVELS,
} from "@/lib/qrcode-generator";
import type { ErrorLevel } from "@/lib/qrcode-generator";
import { ModeToggle } from "./ModeToggle";
import { GenerateControls } from "./GenerateControls";
import { DecodeControls } from "./DecodeControls";
import { QRCodeOutput } from "./QRCodeOutput";
import { DecodeOutput } from "./DecodeOutput";

type Mode = "generate" | "decode";

export function QRCodeGenerator() {
  const [mode, setMode] = useState<Mode>("generate");
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(4);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [decodedContent, setDecodedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setDataUrl(null);
    setDecodedContent(null);
    setError(null);
    setDecodeError(null);
    setCopied(false);
  }, []);

  const clearAll = useCallback(() => {
    setText("");
    setDecodedContent(null);
    reset();
  }, [reset]);

  const handleModeSwitch = useCallback(
    (m: Mode) => {
      setMode(m);
      setText("");
      setDecodeError(null);
      reset();
    },
    [reset]
  );

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError("Please enter text or a URL.");
      return;
    }
    setError(null);
    setLoading(true);
    setDataUrl(null);
    try {
      const url = await generateQRCode({
        text: text.trim(),
        size,
        errorCorrectionLevel: errorLevel,
        fgColor,
        bgColor,
        margin,
      });
      setDataUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  }, [text, size, errorLevel, fgColor, bgColor, margin]);

  const handleDownload = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }, [dataUrl]);

  const handleFileSelect = useCallback(async (file: File) => {
    setDecodeError(null);
    setDecodedContent(null);
    setLoading(true);
    try {
      const result = await decodeQRCode(file);
      if (result) {
        setDecodedContent(result);
      } else {
        setDecodeError("No QR code found in this image.");
      }
    } catch (e) {
      setDecodeError(
        e instanceof Error ? e.message : "Failed to decode QR code."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!decodedContent) return;
    try {
      await navigator.clipboard.writeText(decodedContent);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [decodedContent]);

  const handleDecodeReset = useCallback(() => {
    setDecodedContent(null);
    setDecodeError(null);
    setCopied(false);
  }, []);

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-xl">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            aria-label="Back to home"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            QR Code Generator
          </h1>
          <p className="text-sm text-gray-400">
            Generate and decode QR codes · Client-side only · Nothing uploaded
          </p>
        </div>

        <ModeToggle mode={mode} onModeChange={handleModeSwitch} />

        {mode === "generate" ? (
          <>
            <GenerateControls
              text={text}
              onTextChange={(v) => {
                setText(v);
                setError(null);
              }}
              size={size}
              onSizeChange={setSize}
              errorLevel={errorLevel}
              onErrorLevelChange={setErrorLevel}
              fgColor={fgColor}
              bgColor={bgColor}
              onColorsChange={(fg, bg) => {
                setFgColor(fg);
                setBgColor(bg);
              }}
              margin={margin}
              onMarginChange={setMargin}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleGenerate()}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-3 w-full py-3.5 bg-gray-900 hover:bg-gray-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150"
            >
              {loading ? "Generating…" : dataUrl ? "Regenerate" : "Generate QR Code"}
            </button>

            {error && (
              <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}

            {!dataUrl && !loading && !error && (
              <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center">
                <div className="text-3xl mb-3">📱</div>
                <p className="text-sm font-medium text-gray-400">
                  No QR code yet
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Enter text or a URL, then hit Generate
                </p>
              </div>
            )}

            {dataUrl && !loading && (
              <QRCodeOutput
                dataUrl={dataUrl}
                onDownload={handleDownload}
                onReset={clearAll}
                size={size}
                errorLevel={ERROR_LEVELS[errorLevel].label}
              />
            )}
          </>
        ) : (
          <>
            <DecodeControls
              onFileSelect={handleFileSelect}
              error={decodeError}
            />

            {loading && (
              <div className="mt-4 flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Decoding…
              </div>
            )}

            {!decodedContent && !loading && !decodeError && (
              <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center">
                <div className="text-3xl mb-3">🔍</div>
                <p className="text-sm font-medium text-gray-400">
                  No image decoded yet
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Drop or select a QR code image
                </p>
              </div>
            )}

            {decodedContent && !loading && (
              <DecodeOutput
                content={decodedContent}
                copied={copied}
                onCopy={handleCopy}
                onReset={handleDecodeReset}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
