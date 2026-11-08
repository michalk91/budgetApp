import { tw } from "./palette";

// Single source of truth for theme colors. Tailwind exposes every token as a
// utility (e.g. `bg-surface`, `text-fg-muted`) backed by a CSS variable that
// switches with the `.dark` class, so components never need `dark:` variants.

// Muted blue-grey palette for dark mode, tuned to sit with slate and the blue accents.
const night = {
  50: "#eef1f6",
  200: "#c3cad6",
  300: "#9aa4b5",
  400: "#6f7a8e",
  600: "#374052",
  700: "#2a3242",
  800: "#202735",
  900: "#171c26",
  950: "#10141b",
} as const;

const withAlpha = (color: string, alpha: number) =>
  `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;

const light = {
  // Page
  "page-from": "#d6dbdc",
  "page-to": tw.white,
  chrome: tw.slate[300],

  // Surfaces
  surface: tw.white,
  "surface-muted": tw.gray[100],
  "surface-sunken": tw.gray[200],
  field: tw.gray[50],
  "field-focus": tw.white,
  selected: tw.slate[400],
  indicator: tw.slate[700],

  // Text
  fg: tw.black,
  "fg-muted": tw.gray[500],
  "fg-subtle": tw.gray[700],
  "fg-hover": tw.slate[600],

  // Borders
  "line-subtle": tw.gray[200],
  line: tw.gray[300],
  "line-strong": tw.black,

  // Links and accents
  link: tw.blue[500],
  "link-active": tw.blue[800],
  "link-danger": tw.red[500],
  "link-danger-active": tw.red[800],
  accent: tw.blue[700],

  // Amounts
  positive: tw.green[600],
  negative: tw.red[600],

  // Tinted backgrounds
  "danger-soft": tw.red[200],
  "success-soft": tw.green[200],

  // Disabled buttons
  "primary-disabled": tw.blue[300],
  "danger-disabled": tw.red[300],
  "success-disabled": tw.green[300],
  "on-disabled": tw.white,
};

export type ThemeToken = keyof typeof light;

const dark: Record<ThemeToken, string> = {
  "page-from": night[950],
  "page-to": night[900],
  chrome: night[800],

  surface: night[800],
  "surface-muted": night[700],
  "surface-sunken": night[900],
  field: night[700],
  "field-focus": night[600],
  selected: night[600],
  indicator: night[200],

  fg: night[50],
  "fg-muted": night[300],
  "fg-subtle": night[200],
  "fg-hover": night[200],

  "line-subtle": night[700],
  line: night[600],
  "line-strong": night[400],

  link: tw.blue[400],
  "link-active": tw.blue[200],
  "link-danger": tw.red[400],
  "link-danger-active": tw.red[200],
  accent: tw.blue[300],

  positive: tw.green[400],
  negative: tw.red[400],

  "danger-soft": withAlpha(tw.red[500], 0.25),
  "success-soft": withAlpha(tw.green[500], 0.25),

  "primary-disabled": withAlpha(tw.blue[500], 0.25),
  "danger-disabled": withAlpha(tw.red[500], 0.25),
  "success-disabled": withAlpha(tw.green[500], 0.25),
  "on-disabled": withAlpha(tw.white, 0.5),
};

export const themeTokens = { light, dark };

export const tokenNames = Object.keys(light) as ThemeToken[];

export const tokenVar = (token: ThemeToken) => `var(--color-${token})`;

// Tailwind `theme.colors` entries: { surface: "var(--color-surface)", ... }
export const tailwindTokenColors = Object.fromEntries(
  tokenNames.map((token) => [token, tokenVar(token)])
);

// CSS custom properties for one theme: { "--color-surface": "#fff", ... }
export const tokenCssVars = (theme: Record<ThemeToken, string>) =>
  Object.fromEntries(
    tokenNames.map((token) => [`--color-${token}`, theme[token]])
  );
