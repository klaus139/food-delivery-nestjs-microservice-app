// tailwind.config.ts
import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        Poppins: ["var(--font-Poppins)"],
      },
      textColor: {
        white: "var(--textcolor)", // Ensure white is using var(--textcolor)
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
