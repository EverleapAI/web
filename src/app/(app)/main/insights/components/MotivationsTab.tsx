// apps/web/src/app/(app)/main/insights/components/MotivationsTab.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Dumbbell,
  Trophy,
  Search,
  Compass,
  Palette,
  KeyRound,
  Users,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Scale,
  Flag,
  Rocket,
} from "lucide-react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Local types (kept local to avoid page.tsx exports)
   ============================================================================= */

type RGB = { r: number; g: number; b: number };

type DriverId = "meaning" | "mastery" | "people" | "freedom" | "curiosity" | "momentum";
type DriverHint = DriverId | "clarity";

type DriverDef = {
  id: DriverId;
  label: string;
  accent: RGB;
  whenItHits: string;
  looksLike: string;
  drainsWhen: string;
};

type ScoredDriver = {
  def: DriverDef;
  score: number;
};

type MotivationsTop = {
  top3: ScoredDriver[];
  top?: ScoredDriver;
};

type NextStepsStackProps = React.ComponentProps<typeof NextStepsStack>;
type NextStepsDefinition = NextStepsStackProps["definition"];

type QuickRating = "mostly" | "somewhat" | "not_really";

const QUICK_FEEDBACK_STORAGE_KEY = "everleap.insights.quickFeedback.v1";
const MOTIVATIONS_SELFREPORT_KEY = "everleap.insights.motivationsSelfReport.v1";

/* =============================================================================
   Motivations taxonomy (teen-friendly labels + stable IDs)
   ============================================================================= */

type MotivationId =
  | "impact"
  | "purpose"
  | "justice"
  | "mastery"
  | "competition"
  | "craft"
  | "curiosity"
  | "discovery"
  | "creativity"
  | "autonomy"
  | "ownership"
  | "variety"
  | "progress"
  | "closure"
  | "belonging"
  | "mentorship"
  | "collaboration"
  | "leadership"
  | "recognition";

type MotivationDef = {
  id: MotivationId;
  label: string;
  accent: RGB;
  // teen-facing copy
  hook: string; // “what it is” but conversational
  because: string; // “why you might be this way”
  watchOut: string; // gentle warning
  drivers: DriverHint[];
  keywords: string[];
};

type ScoredMotivation = {
  def: MotivationDef;
  score: number; // 0..1
  receipt?: string;
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/* =============================================================================
   Local UI helpers (duplicated to preserve behavior without exporting from page)
   ============================================================================= */

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function rgb(a: RGB) {
  return `${a.r}, ${a.g}, ${a.b}`;
}

function sectionKicker(dark: boolean) {
  return [
    "text-[12px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-white/50" : "text-slate-600",
  ].join(" ");
}

function bodyText(dark: boolean) {
  return dark ? "text-slate-200/90" : "text-slate-700";
}

function mutedText(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
}

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[28px] border",
    "px-4 py-5 md:px-6 md:py-6",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/20" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function softCard(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border",
    "px-4 py-4",
    "backdrop-blur-xl",
    "shadow-[0_16px_48px_rgba(0,0,0,0.14)]",
    dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white/85",
  ].join(" ");
}

function softInputShell(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border",
    "backdrop-blur-2xl",
    dark ? "border-white/10 bg-white/[0.035]" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.18)]",
  ].join(" ");
}

function pillBase(dark: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    "text-[12px] font-semibold",
    "backdrop-blur-xl",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/80"
      : "border-black/10 bg-white/80 text-slate-800",
  ].join(" ");
}

function glowBg(dark: boolean, accent: RGB, strength = 0.16): React.CSSProperties {
  const c = rgb(accent);
  return {
    background: dark
      ? `radial-gradient(420px 220px at 10% 0%, rgba(${c}, ${strength}), transparent 62%),
         radial-gradient(380px 220px at 92% 82%, rgba(${c}, ${strength * 0.6}), transparent 64%)`
      : `radial-gradient(420px 220px at 10% 0%, rgba(${c}, ${strength * 0.85}), transparent 62%),
         radial-gradient(380px 220px at 92% 82%, rgba(${c}, ${strength * 0.55}), transparent 64%)`,
  };
}

function chipButton(dark: boolean) {
  return [
    "inline-flex items-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.07]"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

function primaryLinkButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "h-10 rounded-full px-4 text-[13px] font-semibold",
    "transition active:scale-[0.99]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark ? "bg-white text-black hover:bg-white/95" : "bg-slate-900 text-white hover:bg-slate-900/90",
  ].join(" ");
}

function subtleLinkButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "h-10 rounded-full border px-4 text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-[0.99]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.07]"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

/* =============================================================================
   Copy helpers
   ============================================================================= */

/* =============================================================================
   Copy helpers
   ============================================================================= */

function motivationsIntro(top: DriverDef | null | undefined, name: string) {
  const hasName = !!(name ?? "").trim();
  const n = (name ?? "").trim();
  const prefix = hasName ? `${n}` : "Hey";

  const id: DriverId = (top?.id ?? "momentum") as DriverId;

  if (id === "people") {
    return `${prefix} — here’s what I’m seeing: you get energy from real people. Not “being social,” but having a real exchange — feedback, shared effort, challenge, someone actually seeing you.

When you’re stuck doing everything alone, your motivation can drop even if the opportunity is good. That doesn’t mean you’re being dramatic. It just means your signal system is built around connection.

We’ll use this by building in the right kind of support: a teammate, a coach, or even one honest check-in — so your week has fuel.`;
  }

  if (id === "mastery") {
    return `${prefix}, you’re the kind of person who gets motivated by getting better.

When you can feel improvement — even small — you lock in. But when you can’t see progress, it can feel like you’re pushing a boulder uphill, even if you’re working hard.

That doesn’t mean you’re doing something wrong. It just means your brain needs proof. We’ll use that by choosing goals you can measure and feel — so effort turns into confidence.`;
  }

  if (id === "meaning") {
    return `${prefix}, your motivation isn’t random. It’s tied to why something matters.

When the purpose feels real, you can do a lot. But when the “why” is fuzzy, it’s like trying to run on low battery — you might still do the thing, but it costs way more.

That’s not weakness. It’s how you’re wired. We’ll use this by getting clearer on what you care about, and connecting your actions to that — so your effort actually feels worth it.`;
  }

  if (id === "curiosity") {
    return `${prefix}, your motivation wakes up when there’s something to figure out.

You’re not bored because you’re lazy. You’re bored because your brain needs a mystery, a question, a new angle. When nothing feels new or interesting, your focus slips. When there’s something to explore, you can go deep fast.

We’ll use this by turning goals into questions and making learning part of the plan — so you’re pulled forward instead of pushed.`;
  }

  if (id === "freedom") {
    return `${prefix}, you’re most motivated when you feel like you have a real choice.

Not just the goal — the way you get there. When everything feels pre-scripted or controlled, your brain pushes back. That’s not you “being difficult.” It’s a real need for autonomy.

We’ll use this by giving you options, letting you choose the approach, and making the plan feel like yours — because that’s when you actually show up.`;
  }

  // momentum (default)
  return `${prefix} — quick check: your energy comes from motion.

When something is moving forward, you feel more like yourself. When it stalls, it’s not that you suddenly became lazy. It’s that your brain doesn’t get a clear signal that it matters.

The good news is you don’t need a huge plan to get your spark back. You usually just need one real step you can finish. We’ll use that pattern to shape your next week — and make progress feel real again.`;
}

/* =============================================================================
   Motivation taxonomy scoring
   ============================================================================= */

const MOTIVATIONS_TAXONOMY: MotivationDef[] = [
  {
    id: "impact",
    label: "Make it matter",
    accent: { r: 255, g: 180, b: 120 },
    hook: "You don’t want ‘busy work.’ You want your effort to land somewhere real.",
    because:
      "You tend to care about meaning — if you can’t see who it helps or what it changes, your energy drops.",
    watchOut:
      "If something feels fake or pointless, you’ll stall (even if you could do it easily).",
    drivers: ["meaning", "clarity"],
    keywords: ["impact", "difference", "help", "change", "community", "useful", "matter"],
  },
  {
    id: "purpose",
    label: "Know the why",
    accent: { r: 255, g: 210, b: 110 },
    hook: "You move faster when you know what this is building toward — and why you care.",
    because:
      "When the ‘why’ is clear, you can focus hard. When it’s foggy, your brain won’t fully commit.",
    watchOut: "If goals stay vague, you might drift or procrastinate even with talent.",
    drivers: ["meaning", "clarity"],
    keywords: ["why", "meaning", "purpose", "direction", "values", "mission"],
  },
  {
    id: "justice",
    label: "Fairness + respect",
    accent: { r: 190, g: 140, b: 255 },
    hook: "You notice what’s fair — and what’s not. Respect matters to you.",
    because:
      "You’re tuned to how people are treated and whether the rules actually make sense.",
    watchOut: "Unfairness can become a focus trap — it’s hard to ignore once you see it.",
    drivers: ["meaning", "people"],
    keywords: ["fair", "justice", "equity", "respect", "ethics", "rules"],
  },
  {
    id: "mastery",
    label: "Leveling up",
    accent: { r: 190, g: 140, b: 255 },
    hook: "You lock in when you can feel yourself getting better — reps, progress, skill growth.",
    because:
      "Your motivation often comes from improvement you can actually *feel*, not just ‘trying.’",
    watchOut:
      "If you can’t see progress, it can start to feel pointless (even when it isn’t).",
    drivers: ["mastery", "momentum"],
    keywords: ["improve", "practice", "reps", "skill", "progress", "better", "training"],
  },
  {
    id: "competition",
    label: "A real test",
    accent: { r: 255, g: 190, b: 110 },
    hook: "A real opponent (or a real standard) wakes you up. Stakes make you sharper.",
    because: "You respond to challenge — it turns your attention on like a switch.",
    watchOut: "If it becomes constant comparison, it can steal your joy.",
    drivers: ["mastery", "people", "momentum"],
    keywords: ["win", "compete", "rank", "tournament", "prove", "challenge", "opponent"],
  },
  {
    id: "craft",
    label: "Do it right",
    accent: { r: 120, g: 255, b: 190 },
    hook: "You care about quality — clean, precise, done the right way (your way).",
    because:
      "You notice details other people skip, and that gives you pride when it’s done well.",
    watchOut:
      "Perfection pressure can slow your starts if you try to make it flawless on day one.",
    drivers: ["mastery", "clarity"],
    keywords: ["quality", "detail", "precise", "craft", "polish", "clean", "accuracy"],
  },
  {
    id: "curiosity",
    label: "Figure it out",
    accent: { r: 255, g: 150, b: 230 },
    hook: "Questions pull you forward. You want to understand what’s true — and why.",
    because: "Learning gives you momentum. When you’re curious, effort feels lighter.",
    watchOut: "If nothing feels new, your brain quietly checks out.",
    drivers: ["curiosity"],
    keywords: ["learn", "curious", "why", "how", "research", "understand", "figure out"],
  },
  {
    id: "discovery",
    label: "New terrain",
    accent: { r: 120, g: 200, b: 255 },
    hook: "You like exploring — new topics, new places, new angles.",
    because: "Novelty isn’t chaos for you. It’s oxygen.",
    watchOut:
      "Too many options can scatter your energy if you don’t pick a lane.",
    drivers: ["curiosity", "freedom"],
    keywords: ["explore", "new", "discover", "travel", "experiment", "different"],
  },
  {
    id: "creativity",
    label: "Make something",
    accent: { r: 255, g: 150, b: 230 },
    hook:
      "You want to create — an idea, a system, a design, something that didn’t exist before.",
    because:
      "Making things feels like ownership and self-expression at the same time.",
    watchOut:
      "Ideas can multiply faster than finishing if you don’t choose what matters most.",
    drivers: ["curiosity", "freedom", "meaning"],
    keywords: ["create", "design", "build", "idea", "art", "write", "invent", "make"],
  },
  {
    id: "autonomy",
    label: "Have a say",
    accent: { r: 120, g: 255, b: 190 },
    hook: "You work best when you can choose the method. Same goal — your approach.",
    because: "Autonomy keeps you engaged. It feels like the work is actually yours.",
    watchOut: "Micromanagement can shut you down fast.",
    drivers: ["freedom"],
    keywords: ["freedom", "autonomy", "independent", "choose", "own way"],
  },
  {
    id: "ownership",
    label: "Own the outcome",
    accent: { r: 255, g: 210, b: 110 },
    hook: "You like being responsible *and* having control — so you can actually deliver.",
    because: "When you own something, your motivation gets serious.",
    watchOut: "You can end up carrying outcomes you don’t fully control.",
    drivers: ["freedom", "momentum"],
    keywords: ["own", "responsibility", "lead", "ship", "deliver", "accountable"],
  },
  {
    id: "variety",
    label: "Switch it up",
    accent: { r: 110, g: 230, b: 255 },
    hook:
      "You like changing modes — different tasks, different rhythms, different kinds of thinking.",
    because: "Variety helps you stay awake and creative.",
    watchOut:
      "Constant switching can blur priorities if you never pause to choose what’s most important.",
    drivers: ["freedom", "curiosity"],
    keywords: ["variety", "mix", "different", "change", "switch", "multiple"],
  },
  {
    id: "progress",
    label: "See progress fast",
    accent: { r: 255, g: 210, b: 110 },
    hook: "You get energy from motion you can *feel*. Small wins stack into confidence.",
    because: "Momentum makes things real for you — doing beats overthinking.",
    watchOut: "Stalled decisions can feel like quicksand.",
    drivers: ["momentum", "mastery"],
    keywords: ["progress", "move", "momentum", "today", "next", "forward", "ship"],
  },
  {
    id: "closure",
    label: "Close the loop",
    accent: { r: 255, g: 180, b: 120 },
    hook: "You like clean endings: done, shipped, settled. Open loops itch.",
    because: "Finishing gives you clarity — it’s how your brain relaxes.",
    watchOut: "If everything is ‘pending,’ you’ll lose energy fast.",
    drivers: ["momentum", "clarity"],
    keywords: ["finish", "done", "complete", "closure", "final", "wrap up"],
  },
  {
    id: "belonging",
    label: "Your people",
    accent: { r: 120, g: 200, b: 255 },
    hook:
      "You’re not chasing popularity. You want real belonging — people who feel real.",
    because: "When the vibe is good, you show up more fully.",
    watchOut: "Fake energy drains you faster than hard work.",
    drivers: ["people"],
    keywords: ["belong", "friends", "team", "community", "together", "vibe"],
  },
  {
    id: "mentorship",
    label: "Good coaching",
    accent: { r: 190, g: 140, b: 255 },
    hook:
      "You sharpen with good mirrors: coaches, mentors, people who tell the truth with respect.",
    because: "Feedback makes progress faster — and you like progress.",
    watchOut:
      "Without signal (feedback), you can feel stuck even when you’re improving.",
    drivers: ["people", "mastery"],
    keywords: ["coach", "mentor", "feedback", "critique", "lesson", "teacher"],
  },
  {
    id: "collaboration",
    label: "Build together",
    accent: { r: 120, g: 255, b: 190 },
    hook: "You like building with others — shared standards, shared effort, shared wins.",
    because:
      "Working with the right person makes everything more real and more fun.",
    watchOut:
      "Misalignment creates friction fast, and then your motivation drops.",
    drivers: ["people", "momentum"],
    keywords: ["collab", "together", "team", "partner", "group", "build"],
  },
  {
    id: "leadership",
    label: "Set the tone",
    accent: { r: 255, g: 190, b: 110 },
    hook: "You like setting direction — protecting the mission from noise.",
    because: "You notice standards. You can feel when a room needs structure.",
    watchOut:
      "You can become the ‘default adult’ and end up carrying too much.",
    drivers: ["people", "meaning", "freedom"],
    keywords: ["lead", "organize", "standard", "guide", "protect", "direction"],
  },
  {
    id: "recognition",
    label: "Be seen (for real)",
    accent: { r: 255, g: 150, b: 230 },
    hook:
      "You’re not needy — you just want real effort to be noticed when it’s earned.",
    because: "Being seen can validate that what you did mattered.",
    watchOut: "If you chase applause, it can distort the goal.",
    drivers: ["people", "momentum"],
    keywords: ["recognition", "seen", "respect", "credit", "proud", "prove"],
  },
];

function normalizeTextPieces(parts: string[]) {
  return parts
    .map((x) => (x ?? "").toString().trim())
    .filter(Boolean)
    .join(" | ")
    .toLowerCase();
}

function scoreMotivations(args: {
  top3: ScoredDriver[];
  boosters: string[];
  drainers: string[];
  receipts: string[];
}) {
  const { top3, boosters, drainers, receipts } = args;

  const driverScore = new Map<DriverId, number>();
  for (const d of top3) driverScore.set(d.def.id, clamp01(d.score ?? 0));

  const blob = normalizeTextPieces([
    ...(boosters ?? []).slice(0, 12),
    ...(drainers ?? []).slice(0, 10),
    ...(receipts ?? []).slice(0, 10),
    ...top3.map((x) => x.def.label),
    ...top3.map((x) => x.def.whenItHits),
  ]);

  const scored: ScoredMotivation[] = MOTIVATIONS_TAXONOMY
    .map((m) => {
      // baseline: always show something even if signal is weak
      let s = 0.10;

      for (const did of m.drivers) {
        if (did === "clarity") {
          s += (driverScore.get("meaning") ?? 0) * 0.16;
          s += (driverScore.get("momentum") ?? 0) * 0.08;
        } else {
          s += (driverScore.get(did) ?? 0) * 0.34;
        }
      }

      // keyword hits from receipts/boosters/drainers/self-report
      const hits = m.keywords.reduce((acc, k) => {
        const key = k.toLowerCase();
        if (!key) return acc;
        return blob.includes(key) ? acc + 1 : acc;
      }, 0);

      s += Math.min(0.24, hits * 0.055);

      const topDriverId = top3[0]?.def?.id ?? null;
      if (topDriverId && (m.drivers as DriverHint[]).includes(topDriverId)) s += 0.08;

      return { def: m, score: clamp01(s) };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const cleanReceipts = (receipts ?? [])
    .map((r) => (r ?? "").toString().trim())
    .filter((r) => r.length >= 6 && r.length <= 220);

  const attachReceipt = (m: ScoredMotivation) => {
    const safeKeywords = m.def.keywords
      .map((k) => (k ?? "").trim())
      .filter(Boolean)
      .slice(0, 12)
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    if (!safeKeywords.length) return m;

    const rx = new RegExp(`\\b(${safeKeywords.join("|")})\\b`, "i");
    const found = cleanReceipts.find((r) => rx.test(r));
    return found ? { ...m, receipt: found } : m;
  };

  const topRaw = scored.slice(0, 6).map(attachReceipt);

  const seen = new Set<MotivationId>();
  const top: ScoredMotivation[] = [];
  for (const m of topRaw) {
    if (seen.has(m.def.id)) continue;
    seen.add(m.def.id);
    top.push(m);
    if (top.length >= 4) break; // keep it simple: 4 cards
  }

  if (top.length < 4) {
    for (const m of scored.slice(6)) {
      if (top.length >= 4) break;
      if (seen.has(m.def.id)) continue;
      seen.add(m.def.id);
      top.push(attachReceipt(m));
    }
  }

  return { top };
}

/* =============================================================================
   Low-signal helpers
   ============================================================================= */

function computeSignalConfidence(top3: ScoredDriver[]): number {
  if (!Array.isArray(top3) || top3.length === 0) return 0.18;
  const xs = top3
    .map((d) => clamp01(d.score ?? 0))
    .filter((n) => Number.isFinite(n));
  if (!xs.length) return 0.18;
  const avg = xs.reduce((a, b) => a + b, 0) / xs.length;
  // compress a bit so it's not always “high”
  return clamp01(0.15 + avg * 0.75);
}

function signalLabel(sig: number) {
  if (sig >= 0.72) return "High";
  if (sig >= 0.45) return "Medium";
  return "Low";
}

/* =============================================================================
   Icons per motivation
   ============================================================================= */

function MotivationIcon({ id }: { id: MotivationId }) {
  const Icon =
    id === "impact"
      ? HeartHandshake
      : id === "purpose"
        ? Flag
        : id === "justice"
          ? Scale
          : id === "mastery"
            ? Dumbbell
            : id === "competition"
              ? Trophy
              : id === "craft"
                ? CheckCircle2
                : id === "curiosity"
                  ? Search
                  : id === "discovery"
                    ? Compass
                    : id === "creativity"
                      ? Palette
                      : id === "autonomy"
                        ? KeyRound
                        : id === "ownership"
                          ? Rocket
                          : id === "variety"
                            ? Sparkles
                            : id === "progress"
                              ? TrendingUp
                              : id === "closure"
                                ? CheckCircle2
                                : id === "belonging"
                                  ? Users
                                  : id === "mentorship"
                                    ? GraduationCap
                                    : id === "collaboration"
                                      ? Handshake
                                      : id === "leadership"
                                        ? Flag
                                        : Sparkles;

  return <Icon className="h-4.5 w-4.5" aria-hidden />;
}

/* =============================================================================
   Quick Feedback (inline expand; no overlay)
   ============================================================================= */

function quickChip(dark: boolean, active: boolean) {
  return [
    "inline-flex items-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark ? "border-white/10" : "border-black/10",
    active
      ? dark
        ? "bg-white/[0.10] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_44px_rgba(0,0,0,0.40),0_0_42px_rgba(251,146,60,0.16)]"
        : "bg-white text-slate-900 shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
      : dark
        ? "bg-white/[0.045] text-white/78 hover:bg-white/[0.07]"
        : "bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

function saveButton(dark: boolean, disabled: boolean) {
  return [
    "h-10 rounded-2xl px-4 text-[13px] font-semibold",
    "transition active:scale-[0.99]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    disabled
      ? dark
        ? "cursor-not-allowed bg-white/[0.07] text-white/40 border border-white/10"
        : "cursor-not-allowed bg-black/5 text-black/40 border border-black/10"
      : dark
        ? "bg-white text-black hover:bg-white/95"
        : "bg-slate-900 text-white hover:bg-slate-900/90",
  ].join(" ");
}

function readLocalQuickFeedback(): { rating: QuickRating; note: string; savedAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUICK_FEEDBACK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as { rating?: unknown; note?: unknown; savedAt?: unknown };
    const rating =
      rec.rating === "mostly" || rec.rating === "somewhat" || rec.rating === "not_really"
        ? rec.rating
        : null;
    const note = typeof rec.note === "string" ? rec.note : "";
    const savedAt =
      typeof rec.savedAt === "number" && Number.isFinite(rec.savedAt) ? rec.savedAt : 0;
    if (!rating) return null;
    return { rating, note, savedAt };
  } catch {
    return null;
  }
}

function writeLocalQuickFeedback(v: { rating: QuickRating; note: string }) {
  if (typeof window === "undefined") return;
  const payload = { ...v, savedAt: Date.now() };
  window.localStorage.setItem(QUICK_FEEDBACK_STORAGE_KEY, JSON.stringify(payload));
}

function QuickFeedbackInline({ dark }: { dark: boolean }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<QuickRating | null>(null);
  const [note, setNote] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const existing = readLocalQuickFeedback();
    if (!existing) return;
    setRating(existing.rating);
    setNote(existing.note ?? "");
    setSaved(true);
  }, []);

  function onPick(next: QuickRating) {
    setRating(next);
    setSaved(false);
    setOpen(true);
  }

  function onSave() {
    if (!rating) return;
    writeLocalQuickFeedback({
      rating,
      note: (note ?? "").trim(),
    });
    setSaved(true);
    setOpen(false);
  }

  const canSave = !!rating;

  return (
    <div className="mt-6">
      <div className={sectionKicker(dark)}>Quick Check</div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={quickChip(dark, rating === "mostly")}
          onClick={() => onPick("mostly")}
        >
          <span aria-hidden>👍</span>
          <span>Mostly right</span>
        </button>

        <button
          type="button"
          className={quickChip(dark, rating === "somewhat")}
          onClick={() => onPick("somewhat")}
        >
          <span aria-hidden>🙂</span>
          <span>Somewhat</span>
        </button>

        <button
          type="button"
          className={quickChip(dark, rating === "not_really")}
          onClick={() => onPick("not_really")}
        >
          <span aria-hidden>👎</span>
          <span>Not really</span>
        </button>

        {saved ? (
          <div
            className={[
              "ml-1 flex items-center text-[12px]",
              dark ? "text-white/45" : "text-slate-600",
            ].join(" ")}
          >
            (Saved locally)
          </div>
        ) : null}
      </div>

      <div
        className={[
          "mt-3 overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
          open ? "max-h-[340px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className={softInputShell(dark)}>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(520px 220px at 12% 0%, rgba(255,170,110,0.14), transparent 62%)," +
                  "radial-gradient(520px 220px at 88% 0%, rgba(120,160,255,0.10), transparent 62%)," +
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                opacity: dark ? 1 : 0.7,
              }}
            />
          </div>

          <div className="relative p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div
                  className={[
                    "text-[12px] font-semibold uppercase tracking-[0.16em]",
                    dark ? "text-white/55" : "text-slate-600",
                  ].join(" ")}
                >
                  Quick feedback
                </div>
                <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                  Add a note if something felt off (or especially accurate).
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className={[
                  "shrink-0 h-9 rounded-full px-3 text-[12px] font-semibold border backdrop-blur-xl transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
                  dark
                    ? "border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.07]"
                    : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                ].join(" ")}
              >
                Close
              </button>
            </div>

            <div className="mt-3">
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  if (saved) setSaved(false);
                }}
                rows={3}
                placeholder="Tell us what felt off / missing / dead-on…"
                className={[
                  "w-full resize-none rounded-[18px] px-4 py-3 text-[14px] leading-relaxed",
                  "bg-transparent outline-none ring-1 ring-inset",
                  dark
                    ? "text-white placeholder:text-white/32 ring-white/12 focus:ring-white/20"
                    : "text-slate-900 placeholder:text-slate-500 ring-black/10 focus:ring-black/15",
                  "focus-visible:ring-2 focus-visible:ring-orange-200/20",
                ].join(" ")}
              />
              <div className={["mt-2 text-[12px]", mutedText(dark)].join(" ")}>
                Tip: one sentence is enough.
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setNote("");
                  setSaved(false);
                  setOpen(false);
                }}
                className={[
                  "h-10 rounded-2xl px-4 text-[13px] font-semibold border backdrop-blur-xl transition active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
                  dark
                    ? "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                    : "border-black/10 bg-white/70 text-slate-800 hover:bg-white",
                ].join(" ")}
              >
                Skip note
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={!canSave}
                className={saveButton(dark, !canSave)}
              >
                Save
              </button>
            </div>

            <div
              className={[
                "mt-3 text-[11px] leading-relaxed",
                dark ? "text-white/30" : "text-slate-500",
              ].join(" ")}
            >
              Saved to localStorage:{" "}
              <span className={dark ? "text-white/40" : "text-slate-600"}>
                {QUICK_FEEDBACK_STORAGE_KEY}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Self-report (inline expand; no modal)
   ============================================================================= */

function readSelfReport(): { text: string; savedAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MOTIVATIONS_SELFREPORT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as { text?: unknown; savedAt?: unknown };
    const text = typeof rec.text === "string" ? rec.text : "";
    const savedAt =
      typeof rec.savedAt === "number" && Number.isFinite(rec.savedAt) ? rec.savedAt : 0;
    if (!text.trim()) return null;
    return { text, savedAt };
  } catch {
    return null;
  }
}

function writeSelfReport(text: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    MOTIVATIONS_SELFREPORT_KEY,
    JSON.stringify({
      text: (text ?? "").trim(),
      savedAt: Date.now(),
    })
  );
}

function LowSignalAssist({
  dark,
  isLow,
  selfReportValue,
  onSelfReportSaved,
}: {
  dark: boolean;
  isLow: boolean;
  selfReportValue: string;
  onSelfReportSaved: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(selfReportValue ?? "");
  const [saved, setSaved] = React.useState(!!selfReportValue);

  React.useEffect(() => {
    setText(selfReportValue ?? "");
    setSaved(!!selfReportValue);
  }, [selfReportValue]);

  if (!isLow) return null;

  const canSave = (text ?? "").trim().length >= 6;

  return (
    <div className="mt-4">
      <div className={softCard(dark)}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              opacity: dark ? 1 : 0.8,
              background:
                "radial-gradient(520px 240px at 12% 0%, rgba(255,170,110,0.12), transparent 62%), radial-gradient(520px 240px at 90% 80%, rgba(120,200,255,0.10), transparent 64%)",
            }}
          />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className={sectionKicker(dark)}>Signal is low</div>
              <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                That’s normal when we don’t have enough answers yet. Two quick ways to sharpen this:
              </div>
            </div>

            {saved ? (
              <div
                className={[
                  "text-[12px] font-semibold",
                  dark ? "text-white/55" : "text-slate-600",
                ].join(" ")}
              >
                (Saved)
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="https://dev.everleap.ai/main/questions?cat=motivations&returnTo=/main/insights"
              className={primaryLinkButton(dark)}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Answer more questions
            </Link>

            <button
              type="button"
              className={subtleLinkButton(dark)}
              onClick={() => setOpen((v) => !v)}
            >
              <Users className="h-4 w-4" aria-hidden />
              Tell us in your words
            </button>
          </div>

          <div
            className={[
              "mt-3 overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
              open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
            aria-hidden={!open}
          >
            <div className={softInputShell(dark)}>
              <div className="relative p-4">
                <div
                  className={[
                    "text-[13px] font-semibold",
                    dark ? "text-white" : "text-slate-900",
                  ].join(" ")}
                >
                  What usually gets you moving?
                </div>
                <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                  One or two sentences is perfect. Example: “I’m motivated when ___” or “I care
                  most about ___”.
                </div>

                <div className="mt-3">
                  <textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (saved) setSaved(false);
                    }}
                    rows={3}
                    placeholder="Type what motivates you…"
                    className={[
                      "w-full resize-none rounded-[18px] px-4 py-3 text-[14px] leading-relaxed",
                      "bg-transparent outline-none ring-1 ring-inset",
                      dark
                        ? "text-white placeholder:text-white/32 ring-white/12 focus:ring-white/20"
                        : "text-slate-900 placeholder:text-slate-500 ring-black/10 focus:ring-black/15",
                      "focus-visible:ring-2 focus-visible:ring-orange-200/20",
                    ].join(" ")}
                  />
                  <div className={["mt-2 text-[12px]", mutedText(dark)].join(" ")}>
                    We’ll use this to tune your motivations next time.
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className={chipButton(dark)}
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!canSave) return;
                      const cleaned = (text ?? "").trim();
                      writeSelfReport(cleaned);
                      onSelfReportSaved(cleaned);
                      setSaved(true);
                      setOpen(false);
                    }}
                    disabled={!canSave}
                    className={saveButton(dark, !canSave)}
                  >
                    Save
                  </button>
                </div>

                <div
                  className={[
                    "mt-3 text-[11px] leading-relaxed",
                    dark ? "text-white/30" : "text-slate-500",
                  ].join(" ")}
                >
                  Saved to localStorage:{" "}
                  <span className={dark ? "text-white/40" : "text-slate-600"}>
                    {MOTIVATIONS_SELFREPORT_KEY}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={[
              "mt-3 text-[12px] leading-relaxed",
              dark ? "text-white/45" : "text-slate-600",
            ].join(" ")}
          >
            Tip: the more you answer, the less “generic” this gets.
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Motivation card
   ============================================================================= */

function MotivationCard({
  dark,
  item,
  signal,
}: {
  dark: boolean;
  item: ScoredMotivation;
  signal: number;
}) {
  const { def, score, receipt } = item;

  // confidence: blend model score + overall signal so it feels honest
  const conf = clamp01(0.35 * clamp01(score) + 0.65 * clamp01(signal));
  const pct = Math.round(conf * 100);

  const badgeStyle: CSSVars = {
    ...glowBg(dark, def.accent, 0.14),
    ["--accent" as const]: rgb(def.accent),
  };

  return (
    <div className={softCard(dark)} style={badgeStyle}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={glowBg(dark, def.accent, 0.14)}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border",
                  "backdrop-blur-xl",
                  dark ? "border-white/10 bg-white/[0.05]" : "border-black/10 bg-white/80",
                ].join(" ")}
                style={{
                  boxShadow: `0 0 30px rgba(${rgb(def.accent)}, ${dark ? 0.22 : 0.14})`,
                }}
                aria-hidden
              >
                <span className={dark ? "text-white/85" : "text-slate-800"}>
                  <MotivationIcon id={def.id} />
                </span>
              </div>

              <div
                className={[
                  "text-[14px] font-semibold",
                  dark ? "text-white" : "text-slate-900",
                ].join(" ")}
              >
                {def.label}
              </div>
            </div>
          </div>

          <div className={pillBase(dark)}>
            <span className={dark ? "text-white/70" : "text-slate-700"}>Confidence</span>
            <span className={dark ? "text-white" : "text-slate-900"}>{pct}%</span>
          </div>
        </div>

        <div className={["mt-3 text-[13.5px] leading-relaxed", mutedText(dark)].join(" ")}>
          {def.hook}
        </div>

        <div className={["mt-2 text-[13.5px] leading-relaxed", mutedText(dark)].join(" ")}>
          <span className={dark ? "text-white/70" : "text-slate-700"}>Why this might fit: </span>
          {def.because}
        </div>

        {receipt ? (
          <div
            className={[
              "mt-3 rounded-[16px] border px-3 py-2 text-[12.5px] leading-relaxed",
              dark
                ? "border-white/10 bg-white/[0.03] text-white/70"
                : "border-black/10 bg-white/70 text-slate-700",
            ].join(" ")}
          >
            <span className={dark ? "text-white/55" : "text-slate-600"}>From your answers: </span>
            {receipt}
          </div>
        ) : null}

        <div
          className={[
            "mt-3 text-[12.5px] leading-relaxed",
            dark ? "text-white/55" : "text-slate-600",
          ].join(" ")}
        >
          <span className={dark ? "text-white/55" : "text-slate-600"}>Watch-out: </span>
          {def.watchOut}
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function MotivationsTab(props: {
  dark: boolean;
  motivationsTop?: MotivationsTop | null;

  // optional so page.tsx doesn’t have to pass it
  openDriver?: DriverId | null;
  setOpenDriver?: React.Dispatch<React.SetStateAction<DriverId | null>> | unknown;

  // page.tsx passes model={vm}; accept it (unused)
  model?: unknown;

  energyBoosters?: string[] | null;
  energyDrainers?: string[] | null;
  motivationReceipts?: string[] | null;

  nextStepsMotivations: NextStepsDefinition | null;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
}): React.JSX.Element {
const {
  dark,
  motivationsTop,
  setOpenDriver, // kept for compatibility (unused here)
  energyBoosters,
  energyDrainers,
  motivationReceipts,
  nextStepsMotivations,
  mounted,
  nameFromHeadline,
} = props;

  // default openDriver to null if not provided
  const openDriver: DriverId | null = props.openDriver ?? null;

  const safeBoosters = React.useMemo(
    () => (Array.isArray(energyBoosters) ? energyBoosters : []),
    [energyBoosters]
  );
  const safeDrainers = React.useMemo(
    () => (Array.isArray(energyDrainers) ? energyDrainers : []),
    [energyDrainers]
  );
  const safeReceiptsRaw = React.useMemo(
    () => (Array.isArray(motivationReceipts) ? motivationReceipts : []),
    [motivationReceipts]
  );

  const [selfReport, setSelfReport] = React.useState<string>("");

  React.useEffect(() => {
    const existing = readSelfReport();
    if (existing?.text) setSelfReport(existing.text);
  }, []);

  const safeTop: MotivationsTop = React.useMemo(() => {
    const raw = motivationsTop ?? null;
    const top3 =
      raw && Array.isArray((raw as MotivationsTop).top3)
        ? ((raw as MotivationsTop).top3 as ScoredDriver[]).filter(Boolean)
        : [];
    const top = raw && (raw as MotivationsTop).top
      ? (raw as MotivationsTop).top
      : undefined;
    return { top3, top };
  }, [motivationsTop]);

  const topDriver = safeTop.top?.def ?? safeTop.top3[0]?.def ?? null;

  const signal = React.useMemo(
    () => computeSignalConfidence(safeTop.top3 ?? []),
    [safeTop.top3]
  );
  const isLowSignal = signal < 0.45;

  const receipts = React.useMemo(() => {
    const list = [...safeReceiptsRaw];
    if ((selfReport ?? "").trim().length >= 6) list.unshift(selfReport.trim());
    return list;
  }, [safeReceiptsRaw, selfReport]);

  const taxonomy = React.useMemo(
    () =>
      scoreMotivations({
        top3: safeTop.top3 ?? [],
        boosters: safeBoosters,
        drainers: safeDrainers,
        receipts,
      }),
    [safeTop.top3, safeBoosters, safeDrainers, receipts]
  );

  // keep old behavior if a parent expects driver state to exist; we just avoid breaking types
  React.useEffect(() => {
    if (!safeTop.top3.length) return;
    if (openDriver) return;
    const first = safeTop.top3[0]?.def?.id ?? null;
    if (!first) return;
    if (typeof setOpenDriver === "function") {
      (setOpenDriver as React.Dispatch<React.SetStateAction<DriverId | null>>)(first);
    }
  }, [safeTop.top3, openDriver, setOpenDriver]);

  return (
    <section className="mb-6">
      <div className={readingSurface(dark)}>
        <div className="relative">
          <div className={sectionKicker(dark)}>Motivations</div>

          <div
            className={[
              "mt-2 text-[20px] md:text-[22px] font-semibold tracking-tight leading-snug",
              dark ? "text-white" : "text-slate-900",
            ].join(" ")}
          >
            What creates energy for you.
          </div>

          <p className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
            {motivationsIntro(topDriver, nameFromHeadline)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className={pillBase(dark)}>
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background:
                    signal >= 0.72
                      ? "rgba(120,255,190,0.95)"
                      : signal >= 0.45
                        ? "rgba(120,200,255,0.95)"
                        : "rgba(255,180,120,0.95)",
                  boxShadow:
                    signal >= 0.72
                      ? "0 0 18px rgba(120,255,190,0.30)"
                      : signal >= 0.45
                        ? "0 0 18px rgba(120,200,255,0.26)"
                        : "0 0 18px rgba(255,180,120,0.22)",
                }}
                aria-hidden
              />
              <span>Signal</span>
              <span className={dark ? "text-white" : "text-slate-900"}>
                {Math.round(signal * 100)}%
              </span>
              <span className={dark ? "text-white/55" : "text-slate-600"}>
                ({signalLabel(signal)})
              </span>
            </div>

            {isLowSignal ? (
              <div className={["text-[12px]", dark ? "text-white/45" : "text-slate-600"].join(" ")}>
                Low signal right now — we’ll show best-guess defaults.
              </div>
            ) : null}
          </div>

          <LowSignalAssist
            dark={dark}
            isLow={isLowSignal}
            selfReportValue={selfReport}
            onSelfReportSaved={(v) => setSelfReport(v)}
          />
        </div>

        <div className="mt-6">
          <div className={sectionKicker(dark)}>Your top motivators</div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {(taxonomy.top ?? []).map((m) => (
              <MotivationCard key={m.def.id} dark={dark} item={m} signal={signal} />
            ))}
          </div>

          <div
            className={[
              "mt-3 text-[12.5px] leading-relaxed",
              dark ? "text-white/45" : "text-slate-600",
            ].join(" ")}
          >
            These are “best guesses” that get sharper as you answer more prompts.
          </div>
        </div>

        {/* ✅ Quick Check should come BEFORE Next Steps Move */}
        <QuickFeedbackInline dark={dark} />

        {/* Next Steps Move */}
        <div className="mt-6">
          <div className={sectionKicker(dark)}>Next Steps</div>

          {nextStepsMotivations ? (
            <div className="mt-3">
              <NextStepsStack
                dark={dark}
                useLocal={mounted}
                definition={nextStepsMotivations}
                variant="embedded"
                collapsible={false}
                defaultOpen
              />
            </div>
          ) : (
            <div className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
              Next steps are loading…
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MotivationsTab;