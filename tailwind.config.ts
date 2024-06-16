import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
  plugins: [],
};
export default config;
