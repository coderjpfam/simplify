export const VERSIONS = {
  v4: { label: "v4 — Random", description: "Randomly generated · RFC 4122" },
  v1: { label: "v1 — Timestamp", description: "Time-based · MAC address · RFC 4122" },
  v7: { label: "v7 — Sortable", description: "Unix timestamp prefix · lexicographically sortable" },
} as const;

export const FORMATS = {
  standard: { label: "Standard", example: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
  compact: { label: "No Dashes", example: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
  upper: { label: "Uppercase", example: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" },
  braces: { label: "Braces", example: "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}" },
} as const;
