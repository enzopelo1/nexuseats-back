import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border: "hsl(214 32% 91%)",
        input: "hsl(214 32% 91%)",
        ring: "hsl(24 95% 53%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222 47% 11%)",
        primary: { DEFAULT: "hsl(24 95% 53%)", foreground: "hsl(0 0% 100%)" },
        secondary: { DEFAULT: "hsl(210 40% 96%)", foreground: "hsl(222 47% 11%)" },
        muted: { DEFAULT: "hsl(210 40% 96%)", foreground: "hsl(215 16% 47%)" },
        destructive: { DEFAULT: "hsl(0 84% 60%)", foreground: "hsl(0 0% 100%)" },
        card: { DEFAULT: "hsl(0 0% 100%)", foreground: "hsl(222 47% 11%)" },
      },
      borderRadius: { lg: "0.75rem", md: "0.5rem", sm: "0.375rem" },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
