import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        platform: {
          navy: "#102A43",
          teal: "#167D8D",
          ice: "#F3F7FB",
          amber: "#F0B77B",
          white: "#FFFFFF",
          slate: "#64748B",
          border: "#D9E2EC",
        },
        brand: {
          blue: "#F26B5B",
          green: "#218C82",
          ink: "#17324D",
          paper: "#FFFDF7",
          cream: "#FFF6E9",
          coral: "#F26B5B",
          teal: "#218C82",
          yellow: "#F4C95D",
        },
      },
      boxShadow: {
        card: "0 14px 34px rgba(23, 50, 77, 0.08)",
        paper: "0 18px 42px rgba(23, 50, 77, 0.10)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
