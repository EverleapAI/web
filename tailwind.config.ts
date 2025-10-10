// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic mappings to your CSS variables
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        // Allows using opacity modifiers like bg-surface/80
        surface: "rgb(var(--surface) / <alpha-value>)",
      },
    },
  },
  plugins: [typography],
};

export default config;
