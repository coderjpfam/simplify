"use client";

type Mode = "encrypt" | "decrypt";

interface EmptyStateProps {
  mode: Mode;
}

export function EmptyState({ mode }: EmptyStateProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center">
      <div className="text-3xl mb-3">{mode === "encrypt" ? "🔒" : "🔓"}</div>
      <p className="text-sm font-medium text-gray-400">
        {mode === "encrypt" ? "Nothing encrypted yet" : "Nothing decrypted yet"}
      </p>
      <p className="text-xs text-gray-300 mt-1">
        {mode === "encrypt"
          ? "Enter your text and password, then hit Encrypt"
          : "Paste the encrypted output and enter the password"}
      </p>
    </div>
  );
}
