interface VerifyResultProps {
  match: boolean;
}

export function VerifyResult({ match }: VerifyResultProps) {
  return (
    <div
      className={`mt-4 flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold ${
        match
          ? "bg-green-50 border-green-200 text-green-600"
          : "bg-red-50 border-red-200 text-red-500"
      }`}
    >
      <span className="text-xl">{match ? "✓" : "✕"}</span>
      <div>
        <p>{match ? "Password matches!" : "Password does not match."}</p>
        <p className="text-xs font-normal mt-0.5 opacity-70">
          {match
            ? "The password is correct for this hash."
            : "The password is incorrect for this hash."}
        </p>
      </div>
    </div>
  );
}
