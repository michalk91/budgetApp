import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import {
  tailwindTokenColors,
  themeTokens,
  tokenCssVars,
  tokenVar,
} from "./app/theme/tokens";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: tailwindTokenColors,
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        decreaseWidth: {
          "0%": { borderRadius: "0px", minWidth: "100%" },
          "10%": { borderRadius: "9999px", minWidth: "100%" },
          "20%": { minWidth: "100%" },
          "100%": { minWidth: "0", borderRadius: "9999px" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 700ms 800ms ease-in-out forwards",
        decreaseWidth: "decreaseWidth 500ms ease-in-out forwards",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": tokenCssVars(themeTokens.light),
        ".dark": tokenCssVars(themeTokens.dark),
        "*, ::before, ::after": { borderColor: tokenVar("line-subtle") },
      });
    }),
  ],
};
export default config;
