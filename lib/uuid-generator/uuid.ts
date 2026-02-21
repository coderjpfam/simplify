import type { VersionKey, FormatKey } from "./types";

function genV4(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function genV1(): string {
  const now = Date.now();
  const OFFSET = BigInt("122192928000000000");
  const ts = BigInt(now) * BigInt(10000) + OFFSET;

  const timeLow = Number(ts & BigInt(0xffffffff)).toString(16).padStart(8, "0");
  const timeMid = Number((ts >> BigInt(32)) & BigInt(0xffff)).toString(16).padStart(4, "0");
  const timeHi = (Number((ts >> BigInt(48)) & BigInt(0x0fff)) | 0x1000).toString(16).padStart(4, "0");

  const b = new Uint8Array(8);
  crypto.getRandomValues(b);
  const clockSeq = ((b[0] & 0x3f) | 0x80).toString(16).padStart(2, "0") + b[1].toString(16).padStart(2, "0");
  const node = Array.from(b.slice(2), (x) => x.toString(16).padStart(2, "0")).join("");

  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
}

function genV7(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);

  const ms = BigInt(Date.now());
  b[0] = Number((ms >> BigInt(40)) & BigInt(0xff));
  b[1] = Number((ms >> BigInt(32)) & BigInt(0xff));
  b[2] = Number((ms >> BigInt(24)) & BigInt(0xff));
  b[3] = Number((ms >> BigInt(16)) & BigInt(0xff));
  b[4] = Number((ms >> BigInt(8)) & BigInt(0xff));
  b[5] = Number(ms & BigInt(0xff));
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;

  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUUID(version: VersionKey): string {
  switch (version) {
    case "v1":
      return genV1();
    case "v7":
      return genV7();
    default:
      return genV4();
  }
}

export function applyFormat(uuid: string, format: FormatKey): string {
  switch (format) {
    case "compact":
      return uuid.replace(/-/g, "");
    case "upper":
      return uuid.toUpperCase();
    case "braces":
      return `{${uuid}}`;
    default:
      return uuid;
  }
}
