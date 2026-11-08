// Subset of Tailwind v3 default colors used by the theme tokens. Kept as plain
// values so client code (e.g. charts) can import tokens without pulling the
// whole `tailwindcss/colors` module into the browser bundle.
export const tw = {
  white: "#fff",
  black: "#000",
  slate: {
    300: "#cbd5e1",
    400: "#94a3b8",
    600: "#475569",
    700: "#334155",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    500: "#6b7280",
    700: "#374151",
  },
  blue: {
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    700: "#1d4ed8",
    800: "#1e40af",
  },
  red: {
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    800: "#991b1b",
  },
  green: {
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
  },
} as const;
