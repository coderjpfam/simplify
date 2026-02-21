export function generateSalt(len = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const buf = new Uint8Array(len * 2);
  crypto.getRandomValues(buf);
  const result: string[] = [];
  const max = 256 - (256 % chars.length);
  for (let i = 0; i < buf.length && result.length < len; i++) {
    if (buf[i] < max) result.push(chars[buf[i] % chars.length]);
  }
  return result.join("");
}
