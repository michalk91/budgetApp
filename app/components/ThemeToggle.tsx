"use client";

import { useTheme } from "next-themes";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ICON_SIZE = 26;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // resolvedTheme is unknown until mounted; reserve the space so the nav doesn't shift.
  if (!resolvedTheme) {
    return (
      <span
        className="block"
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="flex items-center justify-center text-link hover:text-link-active transition-colors"
    >
      {isDark ? (
        <MdLightMode size={ICON_SIZE} />
      ) : (
        <MdDarkMode size={ICON_SIZE} />
      )}
    </button>
  );
}
