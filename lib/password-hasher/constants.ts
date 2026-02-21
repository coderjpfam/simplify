export const ALGORITHMS = {
  bcrypt:    { label: "bcrypt",  hasSalt: false, hasRounds: true,  hasEncoding: false, canVerify: true  },
  "SHA-256": { label: "SHA-256", hasSalt: true,  hasRounds: false, hasEncoding: true,  canVerify: false },
  "SHA-384": { label: "SHA-384", hasSalt: true,  hasRounds: false, hasEncoding: true,  canVerify: false },
  "SHA-512": { label: "SHA-512", hasSalt: true,  hasRounds: false, hasEncoding: true,  canVerify: false },
  "SHA-1":   { label: "SHA-1",   hasSalt: true,  hasRounds: false, hasEncoding: true,  canVerify: false },
} as const;

export const ENCODINGS = { hex: "Hex", base64: "Base64" } as const;

export const SHA_BITS = { "SHA-256": 256, "SHA-384": 384, "SHA-512": 512, "SHA-1": 160 } as const;

export const ALGORITHMS_COMPARE = {
  bcrypt:    { label: "bcrypt",  isBcrypt: true,  hasEncoding: false, bits: null as number | null },
  "SHA-256": { label: "SHA-256", isBcrypt: false, hasEncoding: true,  bits: 256 },
  "SHA-384": { label: "SHA-384", isBcrypt: false, hasEncoding: true,  bits: 384 },
  "SHA-512": { label: "SHA-512", isBcrypt: false, hasEncoding: true,  bits: 512 },
  "SHA-1":   { label: "SHA-1",   isBcrypt: false, hasEncoding: true,  bits: 160 },
} as const;
