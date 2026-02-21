import { Spinner } from "./Spinner";
import type { AlgorithmKey } from "@/lib/password-hasher";

interface LoadingStateProps {
  algorithm: AlgorithmKey;
  rounds: number;
  elapsed: number;
}

export function LoadingState({ algorithm, rounds, elapsed }: LoadingStateProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center gap-3">
      <Spinner />
      <p className="text-sm font-medium text-gray-400">Hashing password…</p>
      {algorithm === "bcrypt" && (
        <p className="text-xs text-gray-300">
          bcrypt · {rounds} rounds · {(2 ** rounds).toLocaleString()} iterations
          {elapsed > 0 && <span className="ml-2 text-gray-400 font-medium">{elapsed}s elapsed</span>}
        </p>
      )}
    </div>
  );
}
