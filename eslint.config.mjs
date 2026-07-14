import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/deploy/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/*.generated.*",
      "next-env.d.ts",
      "lint-output.txt",
    ],
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ── The design system's ratchet ────────────────────────────────────────────
  // Without this rule the tokens decay straight back into 86 hex colours, 30 font
  // sizes and 24 radii — that is exactly how the app got there the first time, and
  // a tidier starting point does not change the mechanism. A token file is a
  // suggestion; a build error is a system.
  //
  // Banned in src/: arbitrary Tailwind values for anything the tokens own.
  // Still allowed, deliberately: arbitrary sizing/layout (w-[220px], max-w-[640px]),
  // the accent hues, and gradient strings — none of those are tokenised yet, and a
  // rule that cries wolf gets switched off.
  {
    files: ["src/**/*.tsx", "src/**/*.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/(?:^|\\s)(?:sm:|md:|lg:|xl:|hover:|focus:|active:|group-hover:|dark:)*text-\\[[0-9.]+px\\]/]",
          message:
            "Arbitrary font size. Use a token: text-micro/meta/label/body/read/title/display (globals.css @theme).",
        },
        {
          selector:
            "Literal[value=/(?:^|\\s)(?:sm:|md:|lg:|xl:|hover:|focus:|active:|group-hover:|dark:)*rounded-\\[[0-9.]+(?:px|rem)\\]/]",
          message:
            "Arbitrary radius. Use a token: rounded-chip/control/panel/card (globals.css @theme).",
        },
        {
          selector:
            "Literal[value=/(?:^|\\s)(?:sm:|md:|lg:|xl:|hover:|focus:|active:|group-hover:|dark:)*tracking-\\[/]",
          message:
            "Arbitrary letter-spacing. Use a token: tracking-display/title/normal/label/eyebrow (globals.css @theme).",
        },
        {
          selector:
            "Literal[value=/(?:^|\\s)(?:sm:|md:|lg:|xl:|hover:|focus:|active:|group-hover:|dark:)*leading-\\[[0-9.]+\\]/]",
          message:
            "Arbitrary line-height. Use a token: leading-display/title/body/read (globals.css @theme).",
        },
      ],
    },
  },
];