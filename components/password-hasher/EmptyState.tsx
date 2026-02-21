interface EmptyStateProps {
  verifyMode: boolean;
}

export function EmptyState({ verifyMode }: EmptyStateProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center">
      <div className="text-3xl mb-3">🔒</div>
      <p className="text-sm font-medium text-gray-400">{verifyMode ? "Ready to verify" : "No hash yet"}</p>
      <p className="text-xs text-gray-300 mt-1">
        {verifyMode
          ? "Enter your password and paste a hash above"
          : "Enter a password and hit Hash Password"}
      </p>
    </div>
  );
}
