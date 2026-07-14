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
            "Arbitrary font size. Use a token: text-micro/meta/label/body/lede/read/title/display (globals.css @theme).",
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

  /* ===========================================================================
     THE READING LANE: A STRICTER RATCHET, BECAUSE THE FIRST ONE HAD TWO HOLES
     ===========================================================================
     The original rule banned `text-[13.5px]` — the PIXEL form, and only that. It
     therefore never saw:

       1. `text-[1.2rem]` — the same crime in a different unit. MotivatorCard, the
          most-rendered card on Insights, set its title at text-[1.2rem]/[1.05rem]
          (19.2px / 16.8px), sizes that exist nowhere in the scale, and sailed
          through every build.
       2. `text-sm` / `text-2xl` — Tailwind's OWN scale. Perfectly legal, and
          perfectly off OUR ladder. 523 uses across 73 files.

     There is a third hole this cannot close by regex: `text-body font-semibold
     tracking-title text-white` is a legal recipe made of legal tokens, and it was
     how twenty-two different card titles got invented. That one is closed
     structurally instead, by lib/ui/card.tsx — the header is now a component, so
     there is nothing to hand-roll.

     WHY THIS IS SCOPED rather than global: the 600 off-ladder call sites live
     mostly in surfaces the design system never reached (onboarding, the public
     pages, the unlinked career/productUx prototype). Turning this on everywhere
     would fail the build on all of them at once, and a rule that cannot be
     satisfied gets deleted. So it guards the lane that IS on the system, and the
     rest is recorded as debt rather than pretended away.

     A REASON THIS IS NOT MERELY TIDINESS: an off-ladder size does not multiply by
     --type-scale, so it will not grow with the rest of the ladder on a phone. Every
     one of these is a block that stays stubbornly small while everything around it
     responds.
     ========================================================================== */
  {
    files: [
      // The reading lane.
      "src/app/(app)/main/components/**/*.tsx",
      "src/app/(app)/main/insights/components/**/*.tsx",
      "src/app/(app)/main/explore/_components/**/*.tsx",
      "src/app/(app)/main/profile/**/*.tsx",
      "src/app/(app)/main/you/**/*.tsx",
      // The coach funnel — onboarding, Story, the question flows, the reveal, ready.
      // Eleven distinct hero recipes lived here, of which ONE was on the ladder, and
      // five of them were arbitrary rem literals — which is why not one hero in the
      // funnel responded to --type-scale. See src/lib/ui/coach.tsx.
      "src/app/onboarding/**/*.tsx",
      "src/app/(app)/main/story/**/*.tsx",
      "src/app/(app)/main/questions/**/*.tsx",
      "src/app/(app)/main/intro/**/*.tsx",
      "src/app/(app)/main/ready/**/*.tsx",
      "src/lib/ui/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/(?:^|\\s)(?:sm:|md:|lg:|xl:|hover:|focus:|active:|group-hover:|dark:)*text-\\[[0-9.]+(?:px|rem|em|pt)\\]/]",
          message:
            "Arbitrary font size (any unit). Use a token: text-micro/meta/label/body/lede/read/title/display. Inside a card, use <CardTitle>/<CardBody>/<RowTitle>/<RowMeta> from @/lib/ui/card.",
        },
        {
          selector:
            "Literal[value=/(?:^|\\s)(?:sm:|md:|lg:|xl:|hover:|focus:|active:|group-hover:|dark:)*text-(?:xs|sm|base|lg|xl|[2-9]xl)(?:\\s|$)/]",
          message:
            "Tailwind's built-in type scale is not our ladder. Use a token: text-micro/meta/label/body/lede/read/title/display (globals.css @theme).",
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