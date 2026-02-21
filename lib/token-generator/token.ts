import { CHARSETS } from "./constants";
import { CharsetKey, StrengthLabel } from "./types";


export function generateToken(length: number, charsetKey: CharsetKey): string {
  const { chars } = CHARSETS[charsetKey];
  const needed = length;
  const result: string[] = [];
  while (result.length < needed) {
    const buf = new Uint8Array(needed * 2);
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && result.length < needed; i++) {
      const max = 256 - (256 % chars.length);
      if (buf[i] < max) result.push(chars[buf[i] % chars.length]);
    }
  }
  return result.join("");
}

export function calcEntropy(length: number, charsetKey: CharsetKey): number {
  return Math.floor(length * Math.log2(CHARSETS[charsetKey].chars.length));
}

export function strengthLabel(bits: number): StrengthLabel {
  if (bits < 64) return { text: "Weak", color: "text-red-400", bar: "w-1/4  bg-red-300" };
  if (bits < 128) return { text: "Good", color: "text-yellow-500", bar: "w-2/4  bg-yellow-300" };
  if (bits < 192) return { text: "Strong", color: "text-green-500", bar: "w-3/4  bg-green-400" };
  return { text: "Excellent", color: "text-emerald-600", bar: "w-full bg-emerald-400" };
}
