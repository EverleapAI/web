import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactHooks from "eslint-plugin-react-hooks";

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

  // ── Rules of Hooks ─────────────────────────────────────────────────────────
  // This SHOULD arrive with next/core-web-vitals, but it does not survive the
  // FlatCompat shim — so it was silently off, and a conditional hook shipped:
  // ExploreSummary called useBadgeStats() below an `if (!isReady) return null`,
  // so on the first render the hook never ran and on the next one it did. React
  // matches hooks by call order, so the 5th slot was `undefined` one render and a
  // useState the next. That is the class of bug that hands one hook's state to
  // another, and nothing in CI would have said a word.
  {
    files: ["src/**/*.tsx", "src/**/*.ts"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

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