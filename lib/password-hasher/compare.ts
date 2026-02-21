export function detectAlgorithm(hash: string): string | null {
  const trimmed = hash.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("$2b$") || trimmed.startsWith("$2a$") || trimmed.startsWith("$2y$")) return "bcrypt";
  if (/^[0-9a-f]+$/i.test(trimmed)) {
    if (trimmed.length === 40) return "SHA-1";
    if (trimmed.length === 64) return "SHA-256";
    if (trimmed.length === 96) return "SHA-384";
    if (trimmed.length === 128) return "SHA-512";
  }
  if (trimmed.length === 28) return "SHA-1";
  if (trimmed.length === 44) return "SHA-256";
  if (trimmed.length === 64) return "SHA-384";
  if (trimmed.length === 88) return "SHA-512";
  return null;
}

export function extractBcryptRounds(hash: string): number | null {
  const match = hash.trim().match(/^\$2[aby]\$(\d+)\$/);
  return match ? parseInt(match[1], 10) : null;
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
