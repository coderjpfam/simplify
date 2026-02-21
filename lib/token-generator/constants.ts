export const CHARSETS = {
  hex: {
    chars: "0123456789abcdef",
    label: "Hex",
  },
  alphanumeric: {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    label: "Alphanumeric",
  },
  base64url: {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    label: "Base64url",
  },
  symbols: {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
    label: "Symbols",
  },
} as const;
