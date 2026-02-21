import type { AlgorithmKey, EncodingKey } from "./types";
import type { StrengthLabel } from "./types";
import { ALGORITHMS, SHA_BITS } from "./constants";
import { hashBcrypt } from "./bcrypt";

export function strengthLabel(algorithm: AlgorithmKey, rounds: number): StrengthLabel {
  if (algorithm === "SHA-1")   return { text: "Weak",        color: "text-red-400",     bar: "w-1/4 bg-red-300"      };
  if (algorithm === "SHA-256") return { text: "Strong",      color: "text-green-500",   bar: "w-3/5 bg-green-400"    };
  if (algorithm === "SHA-384") return { text: "Very Strong", color: "text-green-600",   bar: "w-4/5 bg-green-500"    };
  if (algorithm === "SHA-512") return { text: "Excellent",   color: "text-emerald-600", bar: "w-full bg-emerald-400" };
  if (rounds <= 8)  return { text: "Weak",      color: "text-red-400",     bar: "w-1/4 bg-red-300"      };
  if (rounds <= 10) return { text: "Good",      color: "text-yellow-500",  bar: "w-2/4 bg-yellow-300"   };
  if (rounds <= 12) return { text: "Strong",    color: "text-green-500",   bar: "w-3/4 bg-green-400"    };
  return                   { text: "Excellent", color: "text-emerald-600", bar: "w-full bg-emerald-400" };
}

export async function hashSHA(
  password: string,
  algorithm: AlgorithmKey,
  encoding: EncodingKey,
  salt: string
): Promise<string> {
  const input = salt ? `${salt}:${password}` : password;
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest(algorithm, buf);
  const arr = Array.from(new Uint8Array(hash));
  if (encoding === "hex") return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return btoa(arr.map((b) => String.fromCharCode(b)).join(""));
}

export async function hashPassword(
  password: string,
  algorithm: AlgorithmKey,
  encoding: EncodingKey,
  salt: string,
  useSalt: boolean,
  rounds: number
): Promise<string> {
  if (algorithm === "bcrypt") {
    return hashBcrypt(password, rounds);
  }
  return hashSHA(password, algorithm, encoding, useSalt ? salt : "");
}

export { SHA_BITS };
