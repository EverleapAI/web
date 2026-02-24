// src/app/(app)/main/insights/fun-facts/time-twin/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock3, Sparkles } from "lucide-react";

import { isDarkTheme, type SpotlightThemeId, type GradientLevel } from "@/theme/everleapVisuals";

/* =============================================================================
   Self-contained UI helpers (match Insights page tone)
   ============================================================================= */

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[28px] border",
    "px-4 py-5 md:px-6 md:py-6",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/20" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function subtleDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function sectionKicker(dark: boolean) {
  return [
    "text-[12px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-white/50" : "text-slate-600",
  ].join(" ");
}

function sectionTitle(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function bodyText(dark: boolean) {
  return dark ? "text-slate-200/90" : "text-slate-700";
}

function mutedText(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
}

function pill(dark: boolean) {
  return [
    "inline-flex items-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-sm font-semibold transition active:scale-95",
    dark
      ? "border-white/10 bg-white/6 text-white/78 hover:bg-white/10"
      : "border-black/10 bg-white/85 text-slate-800 hover:bg-white",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10",
  ].join(" ");
}

function washCard(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border",
    "backdrop-blur-2xl",
    dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/80",
  ].join(" ");
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function firstName(raw: string) {
  const cleaned = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const first = cleaned.split(" ")[0] ?? "";
  return first.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

function niceName(raw: string) {
  const n = firstName(raw);
  if (!n) return "";
  return n.length === 1 ? n.toUpperCase() : `${n[0]!.toUpperCase()}${n.slice(1)}`;
}

/* =============================================================================
   Data sources (local-only, self-contained)
   - onboarding: name
   - story answers: use text to generate a playful “bio mirror”
   ============================================================================= */

type OnboardingV4 = {
  name?: string;
};

type Saved = { answer?: string; skipped?: boolean };

const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";

function readOnboardingV4(): OnboardingV4 {
  if (typeof window === "undefined") return {};
  return safeJsonParse<OnboardingV4>(window.localStorage.getItem(ONBOARDING_STORAGE_KEY)) ?? {};
}

function loadStorySaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  return safeJsonParse<Record<string, Saved>>(window.localStorage.getItem(STORY_STORAGE_KEY_V3)) ?? {};
}

function pickSomeClues(saved: Record<string, Saved>, max = 6) {
  // Prefer a mix across motivations/strengths/skills, but keep it cheap + deterministic.
  const ids: string[] = [];
  for (let i = 1; i <= 5; i += 1) ids.push(`motivations_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`strengths_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`skills_${i}`);

  const prefer =
    /\b(build|make|ship|create|practice|train|team|coach|learn|explore|music|art|outside|friends?|project|school)\b/i;

  const out: string[] = [];
  for (const id of ids) {
    const a = cleanOneLine(saved[id]?.answer ?? "");
    if (!a) continue;
    if (prefer.test(a) || a.length >= 18) out.push(a);
    if (out.length >= max) break;
  }

  // fallback: any answers
  if (out.length < 2) {
    for (const id of ids) {
      const a = cleanOneLine(saved[id]?.answer ?? "");
      if (!a) continue;
      if (!out.includes(a)) out.push(a);
      if (out.length >= max) break;
    }
  }

  return out.slice(0, max);
}

function quoteSnippet(raw: string) {
  const s = cleanOneLine(raw);
  if (!s) return "";
  if (s.length <= 84) return s;
  return `${s.slice(0, 81)}…`;
}

/* =============================================================================
   Time Twin generator (playful narrative, grounded)
   ============================================================================= */

function buildTimeTwinStory(name: string, clues: string[]) {
  const n = name ? name : "you";

  if (!clues.length) {
    return {
      title: "Your Time Twin (needs signal)",
      dek: "Give me a few answers and I’ll generate a biography-style mirror.",
      blocks: [
        {
          kicker: "How this works",
          body:
            "Time Twin is a playful reflection: a tiny biography that mirrors your patterns. It’s not a test. It’s a story that helps you notice what you keep doing.",
        },
        {
          kicker: "Unlock it fast",
          body:
            "Answer a few Motivations / Strengths / Skills prompts, then come back. The more concrete your examples, the better the mirror.",
        },
      ],
      epilogue:
        "No pressure. Just give me 3 real examples — and I’ll make this feel uncomfortably accurate (in a good way).",
    };
  }

  const c0 = clues[0] ? `“${quoteSnippet(clues[0])}”` : "";
  const c1 = clues[1] ? `“${quoteSnippet(clues[1])}”` : "";
  const c2 = clues[2] ? `“${quoteSnippet(clues[2])}”` : "";

  // Lightweight tone: “biography mirror” with short sections.
  return {
    title: `Time Twin: a mirror for ${n}`,
    dek: "A biography-style reflection — creative, technical, and real-world impact (without turning you into a quiz).",
    blocks: [
      {
        kicker: "Origin story",
        body:
          `Some people become clear by thinking. ${n} becomes clear by moving.` +
          (c0 ? ` The evidence keeps sounding like ${c0}.` : ""),
      },
      {
        kicker: "Signature move",
        body:
          `You don’t just like ideas — you like *proof*. You get calmer when something becomes real.` +
          (c1 ? ` A clue: ${c1}.` : ""),
      },
      {
        kicker: "The environment that unlocks you",
        body:
          `You level up fastest with a feedback loop: people, pressure, a deadline, or a coach-like mirror. Alone is fine — but “alone forever” dulls you.` +
          (c2 ? ` Another clue: ${c2}.` : ""),
      },
      {
        kicker: "What you’re secretly building",
        body:
          "Not a single destination. A *stack*: skills, identity, momentum. Something that lets you choose harder problems later — on purpose.",
      },
      {
        kicker: "Watchout (the plot twist)",
        body:
          "When you’re capable, you can start living like you must earn rest. Your next level is learning to recover like it’s part of the craft.",
      },
    ],
    epilogue:
      "If you want, we can turn this into a 7-day micro-arc: one tiny artifact per day, one line of reflection. The mirror gets sharper fast.",
  };
}

/* =============================================================================
   Page
   ============================================================================= */

export default function TimeTwinPage() {
  const router = useRouter();

  // Keep deterministic with Insights page
  const themeId: SpotlightThemeId = "nightDusk";
  const gradientLevel: GradientLevel = 3;
  void gradientLevel;

  const dark = isDarkTheme(themeId);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const story = React.useMemo(() => {
    if (!mounted || typeof window === "undefined") {
      return buildTimeTwinStory("", []);
    }
    const onboarding = readOnboardingV4();
    const saved = loadStorySaved();
    const name = niceName(onboarding.name ?? "");
    const clues = pickSomeClues(saved, 6);
    return buildTimeTwinStory(name, clues);
  }, [mounted]);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-5 md:px-8 md:pb-24 md:pt-7">
      {/* Top row */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <button type="button" className={pill(dark)} onClick={() => router.push("/main/insights?tab=funFacts")}>
          <ArrowLeft className="h-4 w-4 opacity-85" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={[
              "inline-flex h-10 w-10 items-center justify-center rounded-full border",
              dark ? "border-white/10 bg-white/6" : "border-black/10 bg-white",
            ].join(" ")}
          >
            <Clock3 className={["h-5 w-5", dark ? "text-violet-200/85" : "text-violet-700/80"].join(" ")} />
          </span>
        </div>
      </div>

      <section className="mb-6">
        <div className={readingSurface(dark)}>
          <div className="flex items-center gap-2">
            <Sparkles className={["h-4 w-4", dark ? "text-fuchsia-200/80" : "text-fuchsia-700/80"].join(" ")} />
            <div className={sectionKicker(dark)}>Fun Facts</div>
          </div>

          <div className={["mt-2 text-[26px] leading-snug md:text-[30px] font-semibold tracking-tight", sectionTitle(dark)].join(" ")}>
            {story.title}
          </div>

          <div className={["mt-2 text-[15px] leading-relaxed", mutedText(dark)].join(" ")}>
            {story.dek}
          </div>

          <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {story.blocks.map((b) => (
              <div key={b.kicker} className={[washCard(dark), "px-4 py-4"].join(" ")}>
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <div
                    className={[
                      "absolute -top-14 -right-16 h-56 w-56 rounded-full blur-3xl",
                      dark ? "bg-violet-300/9" : "bg-violet-400/9",
                    ].join(" ")}
                  />
                  <div
                    className={[
                      "absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl",
                      dark ? "bg-fuchsia-300/7" : "bg-fuchsia-400/7",
                    ].join(" ")}
                  />
                </div>

                <div className="relative">
                  <div className={sectionKicker(dark)}>{b.kicker}</div>
                  <div className={["mt-2 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
                    {b.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={["mt-6 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
            {story.epilogue}
          </div>

          <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

          <div className={["text-xs", mutedText(dark)].join(" ")}>
            This is generated locally from your answers (for now). When the backend is wired, Time Twin can evolve over time — without losing the “human counselor” vibe.
          </div>
        </div>
      </section>

      {/* tiny spacer */}
      <AnimatePresence initial={false}>
        {mounted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}