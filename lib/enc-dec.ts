// ── Types ─────────────────────────────────────────────────────────────────────
export type AlgorithmKey = "AES-GCM" | "AES-CBC" | "AES-CTR";
export type EncodingKey = "base64" | "hex";

export interface AlgorithmConfig {
  label: string;
  keyBits: number[];
  ivBytes: number;
  description: string;
}

// ── Algorithm config ──────────────────────────────────────────────────────────
export const ALGORITHMS: Record<AlgorithmKey, AlgorithmConfig> = {
  "AES-GCM": {
    label: "AES-GCM",
    keyBits: [128, 192, 256],
    ivBytes: 12,
    description: "Authenticated encryption · Recommended",
  },
  "AES-CBC": {
    label: "AES-CBC",
    keyBits: [128, 192, 256],
    ivBytes: 16,
    description: "Classic block cipher · Requires padding",
  },
  "AES-CTR": {
    label: "AES-CTR",
    keyBits: [128, 192, 256],
    ivBytes: 16,
    description: "Stream mode · No padding needed",
  },
};

export const ENCODINGS: Record<EncodingKey, { label: string }> = {
  base64: { label: "Base64" },
  hex: { label: "Hex" },
};

// ── Strength ──────────────────────────────────────────────────────────────────
export function strengthLabel(bits: number): {
  text: string;
  color: string;
  bar: string;
} {
  if (bits === 128) return { text: "Good", color: "text-yellow-500", bar: "w-1/3 bg-yellow-300" };
  if (bits === 192) return { text: "Strong", color: "text-green-500", bar: "w-2/3 bg-green-400" };
  return { text: "Excellent", color: "text-emerald-600", bar: "w-full bg-emerald-400" };
}

// ── Copy util ─────────────────────────────────────────────────────────────────
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* ignore */
    }
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.cssText =
      "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
    document.body.appendChild(el);
    el.focus();
    el.select();
    el.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

// ── Encoding helpers ──────────────────────────────────────────────────────────
function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...arr));
}

function base64ToBuf(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

function bufToHex(buf: ArrayBuffer | Uint8Array): string {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBuf(str: string): Uint8Array {
  if (str.length % 2 !== 0) throw new Error("Invalid hex string (odd length).");
  return new Uint8Array(
    str.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );
}

function encode(buf: ArrayBuffer | Uint8Array, encoding: EncodingKey): string {
  return encoding === "hex" ? bufToHex(buf) : bufToBase64(buf);
}

function decode(str: string, encoding: EncodingKey): Uint8Array {
  try {
    return encoding === "hex"
      ? hexToBuf(str.trim())
      : base64ToBuf(str.trim());
  } catch {
    throw new Error(
      `Invalid ${encoding === "hex" ? "hex" : "base64"} string.`
    );
  }
}

// ── Key derivation (PBKDF2) ───────────────────────────────────────────────────
async function deriveKey(
  password: string,
  salt: Uint8Array,
  algorithm: AlgorithmKey,
  keyBits: number
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 200000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: algorithm, length: keyBits },
    false,
    ["encrypt", "decrypt"]
  );
}

// ── Encryption ────────────────────────────────────────────────────────────────
export async function encryptText(
  plaintext: string,
  password: string,
  algorithm: AlgorithmKey,
  keyBits: number,
  encoding: EncodingKey
): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(
    new Uint8Array(ALGORITHMS[algorithm].ivBytes)
  );
  const key = await deriveKey(password, salt, algorithm, keyBits);

  const algoParams =
    algorithm === "AES-CTR"
      ? { name: algorithm, counter: iv, length: 64 }
      : { name: algorithm, iv };

  const cipherBuf = await crypto.subtle.encrypt(
    algoParams,
    key,
    enc.encode(plaintext)
  );

  const saltHex = bufToHex(salt);
  const ivHex = bufToHex(iv);
  const cipherStr = encode(cipherBuf, encoding);

  return `${algorithm}:${keyBits}:${encoding}:${saltHex}:${ivHex}:${cipherStr}`;
}

// ── Decryption ────────────────────────────────────────────────────────────────
export async function decryptText(
  ciphertext: string,
  password: string
): Promise<string> {
  const parts = ciphertext.trim().split(":");
  if (parts.length < 6)
    throw new Error(
      "Invalid ciphertext format. Make sure you paste the full encrypted output."
    );

  const [algorithm, keyBitsStr, encoding, saltHex, ivHex, ...rest] = parts;
  const cipherStr = rest.join(":");
  const keyBits = parseInt(keyBitsStr, 10);

  const algoKey = algorithm as AlgorithmKey;
  if (!ALGORITHMS[algoKey])
    throw new Error(
      `Unknown algorithm: ${algorithm}. Only AES-GCM, AES-CBC, AES-CTR are supported.`
    );

  const encKey = encoding as EncodingKey;
  const salt = hexToBuf(saltHex);
  const iv = hexToBuf(ivHex);
  const cipherBuf = decode(cipherStr, encKey);
  const key = await deriveKey(password, salt, algoKey, keyBits);

  const algoParams =
    algoKey === "AES-CTR"
      ? { name: algoKey, counter: iv, length: 64 }
      : { name: algoKey, iv };

  try {
    const plainBuf = await crypto.subtle.decrypt(
      algoParams,
      key,
      cipherBuf as BufferSource
    );
    return new TextDecoder().decode(plainBuf);
  } catch {
    throw new Error(
      "Decryption failed. The password may be incorrect or the ciphertext is corrupted."
    );
  }
}
