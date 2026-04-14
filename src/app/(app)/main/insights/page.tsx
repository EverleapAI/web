"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

import {
  buildInsightsViewModel,
  type InsightsTab,
  type WordCloudItem,
} from "./app/buildInsightsViewModel";
import {
  buildMotivationProfile,
  type MotivationProfile,
  type MotivationHit,
} from "./content/motivationsTaxonomy";

import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";
import { getInsightLens } from "@/app/(app)/main/content/insightLenses";

import MotivationsTab from "./components/MotivationsTab";
import StrengthsTab from "./components/StrengthsTab";
import SkillsTab from "./components/SkillsTab";
import FunFactsTab from "./components/FunFactsTab";

import InsightsSummaryCard from "./components/sections/InsightsSummaryCard";
import InsightsThemesCard from "./components/sections/InsightsThemesCard";
import InsightsSuperpowersCard from "./components/sections/InsightsSuperpowersCard";
import InsightsWatchoutsCard from "./components/sections/InsightsWatchoutsCard";
import InsightsTinyTaskCard from "./components/sections/InsightsTinyTaskCard";
import InsightsActionCard from "./components/sections/InsightsActionCard";
import InsightsQuickCheckCard from "./components/sections/InsightsQuickCheckCard";

/* =============================================================================
   Tabs
   ============================================================================= */

type LocalTab = InsightsTab | "funFacts";
type RGB = { r: number; g: number; b: number };

type TabDef = {
  id: LocalTab;
  label: string;
  blurb?: string;
  accent: RGB;
};

const TABS: TabDef[] = [
  {
    id: "summary",
    label: "Summary",
    blurb: "What it all means",
    accent: { r: 255, g: 180, b: 120 },
  },
  {
    id: "motivations",
    label: "Motivations",
    blurb: "What drives you",
    accent: { r: 120, g: 200, b: 255 },
  },
  {
    id: "strengths",
    label: "Strengths",
    blurb: "How you show up",
    accent: { r: 190, g: 140, b: 255 },
  },
  {
    id: "skills",
    label: "Skills",
    blurb: "Tools you reach for",
    accent: { r: 120, g: 255, b: 190 },
  },
  {
    id: "funFacts",
    label: "Fun Facts",
    blurb: "Lighter + playful",
    accent: { r: 255, g: 150, b: 230 },
  },
];

/* =============================================================================
   URL helpers
   ============================================================================= */

function coerceTab(raw: string | null | undefined): LocalTab {
  const v = (raw ?? "").toLowerCase();

  if (v === "summary") return "summary";
  if (v === "motivations") return "motivations";
  if (v === "strengths") return "strengths";
  if (v === "skills") return "skills";
  if (v === "funfacts" || v === "fun-facts" || v === "fun") return "funFacts";

  if (v === "superpowers") return "summary";
  if (v === "doppelganger") return "summary";
  if (v.includes("doppel")) return "summary";
  if (v.includes("time") && v.includes("twin")) return "summary";

  return "summary";
}

/* =============================================================================
   UI helpers
   ============================================================================= */

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function rgb(a: RGB) {
  return `${a.r}, ${a.g}, ${a.b}`;
}

function tabPillBaseClass() {
  return [
    "relative inline-flex items-center gap-2",
    "rounded-full border",
    "px-4 py-2.5",
    "text-sm font-semibold tracking-[-0.01em]",
    "backdrop-blur-xl",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200",
    "active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30 focus-visible:ring-offset-0",
    "select-none",
    "whitespace-nowrap",
  ].join(" ");
}

function tabPillStyle(args: {
  dark: boolean;
  selected: boolean;
  accent: RGB;
}): React.CSSProperties {
  const { dark, selected, accent } = args;
  const c = rgb(accent);

  const inactiveBg = dark ? `rgba(${c}, 0.08)` : `rgba(${c}, 0.14)`;
  const inactiveBorder = dark ? `rgba(${c}, 0.22)` : `rgba(${c}, 0.30)`;

  const activeBg = dark
    ? `linear-gradient(180deg, rgba(${c}, 0.22), rgba(255,255,255,0.04))`
    : `linear-gradient(180deg, rgba(${c}, 0.22), rgba(255,255,255,0.85))`;

  const glow = dark
    ? `0 0 0 1px rgba(${c}, 0.24), 0 16px 36px rgba(0,0,0,0.42)`
    : `0 0 0 1px rgba(${c}, 0.22), 0 14px 40px rgba(0,0,0,0.16)`;

  const idleShadow = dark
    ? `inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 20px rgba(0,0,0,0.24)`
    : `inset 0 1px 0 rgba(255,255,255,0.60), 0 8px 18px rgba(0,0,0,0.09)`;

  return selected
    ? {
        background: activeBg,
        borderColor: dark ? `rgba(${c}, 0.32)` : `rgba(${c}, 0.35)`,
        color: dark ? "rgba(255,255,255,0.88)" : "rgba(15,23,42,0.96)",
        boxShadow: glow,
      }
    : {
        background: inactiveBg,
        borderColor: inactiveBorder,
        color: dark ? "rgba(255,255,255,0.70)" : "rgba(15,23,42,0.82)",
        boxShadow: idleShadow,
      };
}

function tabDotStyle(args: {
  dark: boolean;
  selected: boolean;
  accent: RGB;
}): React.CSSProperties {
  const { dark, selected, accent } = args;
  const c = rgb(accent);

  return {
    background: selected
      ? `rgba(${c}, 0.88)`
      : `rgba(${c}, ${dark ? 0.38 : 0.55})`,
    boxShadow: selected
      ? `0 0 10px rgba(${c}, 0.34)`
      : `0 0 6px rgba(${c}, 0.18)`,
  };
}

/* =============================================================================
   Summary extraction
   ============================================================================= */

type SignalId = "action" | "people" | "curiosity" | "clarity";

type SignalBarItemLike = {
  id?: unknown;
  label?: unknown;
  strength?: unknown;
  meaning?: unknown;
  why?: unknown;
  examples?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string")
    : [];
}

function asSignalId(v: unknown): SignalId | null {
  return v === "action" ||
    v === "people" ||
    v === "curiosity" ||
    v === "clarity"
    ? v
    : null;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function normalizeSignals(raw: unknown): Array<{
  id: SignalId;
  label: string;
  strength: number;
  meaning: string;
  why: string;
  examples: string[];
}> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{
    id: SignalId;
    label: string;
    strength: number;
    meaning: string;
    why: string;
    examples: string[];
  }> = [];

  for (const it of raw as SignalBarItemLike[]) {
    if (!isRecord(it)) continue;
    const id = asSignalId(it.id);
    if (!id) continue;

    out.push({
      id,
      label: asString(it.label, ""),
      strength: clamp01(asNumber(it.strength, 0)),
      meaning: asString(it.meaning, ""),
      why: asString(it.why, ""),
      examples: asStringArray(it.examples).slice(0, 2),
    });
  }

  return out;
}

function topTwoSignals<T extends { strength: number }>(items: T[]) {
  const sorted = [...items].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  return { top: sorted[0], second: sorted[1] };
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function extractNameFromHeadline(headline: string) {
  const h = cleanOneLine(headline);
  const m =
    h.match(/,\s*([A-Za-z0-9]+)\.?$/) ??
    h.match(/\b([A-Za-z0-9]+)\s+—/);
  const candidate = (m?.[1] ?? "").trim();
  if (!candidate) return "";
  if (candidate.length > 16) return "";
  if (/^(here|alright|hey|lets|let’s|im|i’m|i)$/i.test(candidate)) return "";
  return candidate;
}

function pickQuote(signals: Array<{ examples: string[] }>) {
  for (const s of signals) {
    const ex = (s.examples ?? [])
      .map((x) => cleanOneLine(x))
      .filter(Boolean)[0];
    if (ex && ex.length >= 3) return ex;
  }
  return "";
}

function pickWatchoutSentence(watchouts: { bullets: string[] }) {
  const first = cleanOneLine((watchouts?.bullets ?? [])[0] ?? "");
  return first;
}

/* =============================================================================
   Agentic Summary Note
   ============================================================================= */

type AgenticNote = {
  title: string;
  paragraph: string;
  motivatorsLine: string;
  strengthsLine: string;
  skillsLine: string;
  confidenceTag: "strong" | "early";
};

function joinLabels(labels: string[], max = 5) {
  const clean = labels.map((s) => cleanOneLine(s)).filter(Boolean);
  const unique: string[] = [];
  for (const x of clean) {
    const k = x.toLowerCase();
    if (unique.some((u) => u.toLowerCase() === k)) continue;
    unique.push(x);
    if (unique.length >= max) break;
  }
  return unique.join(" • ");
}

function bestReceipt(profile: MotivationProfile | null) {
  const r = profile?.top?.receipts?.[0]
    ? cleanOneLine(String(profile.top.receipts[0]))
    : "";
  return r.replace(/^Theme:\s*/i, "").replace(/^“|”$/g, "");
}

function buildAgenticSummaryNote(args: {
  headline: string;
  signals: Array<{
    id: SignalId;
    strength: number;
    why: string;
    examples: string[];
  }>;
  motivationProfile: MotivationProfile | null;
  wordCloudDisplay: WordCloudItem[];
  watchoutLine: string;
  energyBoosters: string[];
  energyDrainers: string[];
}): AgenticNote {
  const name = extractNameFromHeadline(args.headline || "");
  const who = name ? `${name}, ` : "";

  const { top } = topTwoSignals(args.signals);
  const topSignalStrength = top?.strength ?? 0;

  const topMotivationScore = args.motivationProfile?.top?.score ?? 0;
  const hasMotivationSignal = topMotivationScore >= 0.2;
  const hasSignal = topSignalStrength >= 0.22 || hasMotivationSignal;

  const confidenceTag: AgenticNote["confidenceTag"] = hasSignal
    ? "strong"
    : "early";

  const boosters = (args.energyBoosters ?? []).map(cleanOneLine).filter(Boolean);
  const drainers = (args.energyDrainers ?? []).map(cleanOneLine).filter(Boolean);

  const topBooster = boosters[0] ?? "";
  const topDrainer = drainers[0] ?? "";

  const top5 = (args.motivationProfile?.top5 ?? []) as MotivationHit[];
  const motivatorLabels = top5.map((h) => h?.def?.label ?? "").filter(Boolean);

  const motivatorsLine =
    motivatorLabels.length >= 2
      ? `Right now your motivators look like: ${joinLabels(motivatorLabels, 5)}`
      : args.wordCloudDisplay?.length
        ? `Right now your themes look like: ${joinLabels(
            args.wordCloudDisplay.slice(0, 5).map((w) => w.term),
            5
          )}`
        : `Right now I’m still collecting signal — give me 1–2 real examples and this tightens fast.`;

  const superShort = (args.signals ?? [])
    .sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0))
    .slice(0, 2)
    .map((s) => s.id);

  const strengthsLine = superShort.includes("people")
    ? "Strengths I’d bet on: reading the room, learning fast through feedback."
    : superShort.includes("action")
      ? "Strengths I’d bet on: momentum-building, shipping real progress."
      : superShort.includes("curiosity")
        ? "Strengths I’d bet on: pattern-spotting, learning by investigation."
        : "Strengths I’d bet on: making fog clearer and turning it into a next step.";

  const skillsLine = superShort.includes("action")
    ? "Skills you’re building: closing loops, starting before you feel ready."
    : superShort.includes("people")
      ? "Skills you’re building: using feedback without collapsing, getting sharper with others."
      : superShort.includes("curiosity")
        ? "Skills you’re building: better questions, better mental models."
        : "Skills you’re building: decision clarity and follow-through.";

  const receipt = bestReceipt(args.motivationProfile);
  const quote = pickQuote(args.signals);
  const proof = receipt || quote;

  const opener = hasSignal
    ? `${who}okay — here’s what I think is true about you right now.`
    : `${who}okay — this is an early read, but it’s already pointing somewhere.`;

  const parts: string[] = [opener];

  if (topBooster || topDrainer) {
    const b = topBooster ? `You light up when ${topBooster}` : "";
    const d = topDrainer ? `and you lose energy when ${topDrainer}` : "";
    const line = [b, d].filter(Boolean).join(" ");
    if (line) parts.push(`${line}.`);
  } else {
    parts.push(
      "I’m watching for what reliably creates energy for you — and what quietly drains it."
    );
  }

  if (motivatorLabels.length) {
    parts.push(`Under that, I keep seeing ${joinLabels(motivatorLabels, 3)}.`);
  }

  if (proof) {
    parts.push(`I’m not guessing — you literally gave me clues like: “${proof}.”`);
  }

  const watch = cleanOneLine(args.watchoutLine)
    ? `Watchout: ${cleanOneLine(args.watchoutLine).replace(/\.$/, "")}.`
    : "Watchout: when you care about getting it right, it’s easy to overthink the first step.";

  const move = hasSignal
    ? "So here’s your move: pick one thing you care about this week and do a 15-minute rep today. Start imperfect, finish real."
    : "So here’s your move: give me one real example — a time you felt locked-in and a time you felt drained — and I’ll tighten this fast.";

  parts.push(watch);
  parts.push(move);

  return {
    title: "Summary",
    paragraph: parts.join(" "),
    motivatorsLine,
    strengthsLine,
    skillsLine,
    confidenceTag,
  };
}

/* =============================================================================
   Watchouts
   ============================================================================= */

function guessWatchoutsFromSuperpowers(
  superBullets: string[] | undefined | null
) {
  const bullets = (superBullets ?? [])
    .map((s) => (s ?? "").trim())
    .filter(Boolean);

  const patterns = [
    {
      rx: /\b(detail|precise|accuracy|quality|craft)\b/i,
      out: "This can slide into perfection-pressure: “not ready yet” becomes the default.",
    },
    {
      rx: /\b(people|team|relationship|empath|care|support)\b/i,
      out: "You can over-carry the emotional load — fixing the room before naming what you need.",
    },
    {
      rx: /\b(drive|ambit|goal|push|grit|work)\b/i,
      out: "Your engine can outrun your recovery — momentum turns into quiet burnout.",
    },
    {
      rx: /\b(logic|analysis|think|reason|strategy)\b/i,
      out: "You can get stuck optimizing — the plan gets perfect while the step doesn’t happen.",
    },
    {
      rx: /\b(creat|idea|vision|imagin)\b/i,
      out: "Ideas can multiply faster than closure — it starts to feel like you’re behind your own brain.",
    },
    {
      rx: /\b(lead|own|responsib|standard)\b/i,
      out: "You might take responsibility for outcomes you don’t fully control.",
    },
  ] as const;

  const chosen: string[] = [];

  for (const b of bullets) {
    const hit = patterns.find((p) => p.rx.test(b));
    if (hit && !chosen.includes(hit.out)) chosen.push(hit.out);
    if (chosen.length >= 3) break;
  }

  const defaults = [
    "When you’re good at reading the room, you can start self-editing mid-sentence.",
    "When you’re reliable, you can become the default adult — even in your own life.",
    "When you’re capable, you can delay asking for help until it’s urgent.",
  ];

  while (chosen.length < 3) {
    const next = defaults[chosen.length];
    if (next) chosen.push(next);
    else break;
  }

  return {
    intro:
      "These aren’t flaws. They’re what a strength can look like when it’s overused, stressed, or pointed at the wrong problem.",
    bullets: chosen.slice(0, 4),
  };
}

/* =============================================================================
   Motivations
   ============================================================================= */

type DriverId =
  | "meaning"
  | "mastery"
  | "people"
  | "freedom"
  | "curiosity"
  | "momentum";

type DriverDef = {
  id: DriverId;
  label: string;
  accent: RGB;
  whenItHits: string;
  looksLike: string;
  drainsWhen: string;
  tryThis: string;
};

const MOTIVATION_DRIVERS: DriverDef[] = [
  {
    id: "meaning",
    label: "Meaning",
    accent: { r: 255, g: 180, b: 120 },
    whenItHits: "when the work connects to real impact or a real “why.”",
    looksLike:
      "You care more, stay longer, and you’ll push through friction because it matters.",
    drainsWhen: "it’s busywork, status, or the point feels foggy.",
    tryThis:
      "Pick one thing you’re doing this week and write the real reason in one sentence. Then do one 20-minute rep.",
  },
  {
    id: "mastery",
    label: "Mastery",
    accent: { r: 190, g: 140, b: 255 },
    whenItHits: "when you can feel yourself getting better through reps.",
    looksLike:
      "You chase feedback, refine fast, and you like a clean skill ladder.",
    drainsWhen:
      "there’s no measurable improvement (same loop, same result).",
    tryThis:
      "Choose one skill. Do 3 short reps this week and track one metric: speed, accuracy, clarity, or time.",
  },
  {
    id: "people",
    label: "People",
    accent: { r: 120, g: 200, b: 255 },
    whenItHits:
      "when there’s real interaction: feedback, challenge, shared effort.",
    looksLike:
      "You sharpen around mentors or teammates and move faster with a real loop.",
    drainsWhen:
      "it’s isolated for too long or you can’t get honest feedback.",
    tryThis:
      "Get one real mirror: ask someone smart for a 30-second critique on something you made or did.",
  },
  {
    id: "freedom",
    label: "Freedom",
    accent: { r: 120, g: 255, b: 190 },
    whenItHits: "when you can choose the approach and own the path.",
    looksLike:
      "You work best when you can design, test, and adjust your own system.",
    drainsWhen: "everything is pre-scripted or you’re micromanaged.",
    tryThis:
      "Take one task and redesign the method. Same goal — your approach. Then run it once.",
  },
  {
    id: "curiosity",
    label: "Curiosity",
    accent: { r: 255, g: 150, b: 230 },
    whenItHits: "when there’s something real to figure out.",
    looksLike:
      "You ask better questions, connect dots, and get energy from learning.",
    drainsWhen:
      "nothing new is happening and it feels repetitive without insight.",
    tryThis:
      "Pick one question you actually care about. Spend 15 minutes finding one surprising answer and write it down.",
  },
  {
    id: "momentum",
    label: "Momentum",
    accent: { r: 255, g: 210, b: 110 },
    whenItHits: "when things move: start → ship → done.",
    looksLike:
      "You get clarity through action and confidence through finishing.",
    drainsWhen: "progress stalls, decisions drag, or it’s all planning.",
    tryThis:
      "Choose a tiny finish line you can hit today (10–20 minutes). Ship it imperfectly.",
  },
];

function includesAny(haystack: string, words: string[]) {
  const s = (haystack ?? "").toLowerCase();
  return words.some((w) => s.includes(w));
}

function scoreDrivers(args: {
  signals: Array<{
    id: SignalId;
    strength: number;
    why: string;
    examples: string[];
  }>;
  terms: WordCloudItem[];
}) {
  const { signals, terms } = args;

  const textFromSignals = signals
    .flatMap((s) => [s.why, ...(s.examples ?? [])])
    .map((x) => (x ?? "").toString())
    .join(" | ")
    .toLowerCase();

  const termText = (terms ?? [])
    .slice(0, 26)
    .map((t) => (t.term ?? "").toString().toLowerCase())
    .join(" | ");

  const blob = `${textFromSignals} | ${termText}`;

  const bySignal = new Map<SignalId, number>();
  for (const s of signals) bySignal.set(s.id, clamp01(s.strength ?? 0));

  const base: Record<DriverId, number> = {
    meaning: 0.08,
    mastery: 0.08,
    people: 0.08,
    freedom: 0.08,
    curiosity: 0.08,
    momentum: 0.08,
  };

  base.people += (bySignal.get("people") ?? 0) * 0.65;
  base.curiosity += (bySignal.get("curiosity") ?? 0) * 0.65;
  base.momentum += (bySignal.get("action") ?? 0) * 0.45;
  base.mastery += (bySignal.get("action") ?? 0) * 0.35;
  base.meaning += (bySignal.get("clarity") ?? 0) * 0.28;
  base.momentum += (bySignal.get("clarity") ?? 0) * 0.18;

  if (
    includesAny(blob, [
      "impact",
      "meaning",
      "purpose",
      "help",
      "contribute",
      "difference",
      "community",
    ])
  ) {
    base.meaning += 0.22;
  }
  if (
    includesAny(blob, [
      "practice",
      "reps",
      "improve",
      "progress",
      "skill",
      "craft",
      "master",
    ])
  ) {
    base.mastery += 0.22;
  }
  if (
    includesAny(blob, [
      "team",
      "people",
      "mentor",
      "coach",
      "friends",
      "collab",
      "together",
      "feedback",
    ])
  ) {
    base.people += 0.22;
  }
  if (
    includesAny(blob, [
      "freedom",
      "choice",
      "autonomy",
      "independent",
      "own",
      "self",
      "design",
    ])
  ) {
    base.freedom += 0.2;
  }
  if (
    includesAny(blob, [
      "learn",
      "curious",
      "explore",
      "research",
      "science",
      "data",
      "stats",
      "statistics",
      "question",
      "figure out",
    ])
  ) {
    base.curiosity += 0.22;
  }
  if (
    includesAny(blob, [
      "build",
      "ship",
      "finish",
      "done",
      "execute",
      "action",
      "start",
    ])
  ) {
    base.momentum += 0.2;
  }

  const scored = MOTIVATION_DRIVERS.map((d) => ({
    def: d,
    score: clamp01(base[d.id]),
  })).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return {
    top3: scored.slice(0, 3),
    top: scored[0],
  };
}

/* =============================================================================
   Superpowers
   ============================================================================= */

type LensLike = {
  body: string;
  bullets: string[];
};

function normalizeLens(raw: unknown): LensLike {
  if (!raw || typeof raw !== "object") return { body: "", bullets: [] };
  const rec = raw as Record<string, unknown>;

  const body = typeof rec.body === "string" ? rec.body : "";

  const bullets = Array.isArray(rec.bullets)
    ? rec.bullets
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return { body, bullets };
}

/* =============================================================================
   Loose next-step normalization
   ============================================================================= */

function textFromUnknown(value: unknown): string {
  if (typeof value === "string") return cleanOneLine(value);
  return "";
}

function listFromUnknown(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return cleanOneLine(item);
      if (isRecord(item)) {
        const preferred = [
          "label",
          "title",
          "text",
          "body",
          "name",
          "subtitle",
        ];
        for (const key of preferred) {
          const v = item[key];
          if (typeof v === "string" && cleanOneLine(v)) return cleanOneLine(v);
        }
      }
      return "";
    })
    .filter(Boolean);
}

function firstString(...values: unknown[]) {
  for (const v of values) {
    const out = textFromUnknown(v);
    if (out) return out;
  }
  return "";
}

function normalizeChoice(item: unknown): { label: string; meta?: string } | null {
  if (typeof item === "string") {
    const label = cleanOneLine(item);
    return label ? { label } : null;
  }

  if (!isRecord(item)) return null;

  const label = firstString(
    item.label,
    item.title,
    item.text,
    item.name,
    item.prompt
  );
  const meta = firstString(
    item.subtitle,
    item.helper,
    item.description,
    item.body
  );

  if (!label) return null;
  return meta ? { label, meta } : { label };
}

function normalizeChoices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => normalizeChoice(item))
    .filter((item): item is { label: string; meta?: string } => !!item);
}

function normalizeTinyTask(definition: unknown) {
  const rec = isRecord(definition) ? definition : {};
  return {
    eyebrow: firstString(rec.eyebrow, rec.kicker, "Tiny Task"),
    title: firstString(
      rec.title,
      rec.name,
      rec.prompt,
      "Pick the one that’s most true this week."
    ),
    body: firstString(rec.subtitle, rec.body, rec.description),
    choices: normalizeChoices(
      rec.choices ?? rec.options ?? rec.answers ?? rec.items
    ),
  };
}

function normalizeAction(definition: unknown) {
  const rec = isRecord(definition) ? definition : {};
  const bullets = listFromUnknown(
    rec.steps ?? rec.bullets ?? rec.items ?? rec.actions
  );
  return {
    eyebrow: firstString(rec.eyebrow, rec.kicker, "Actions"),
    title: firstString(rec.title, rec.name, "Run one small test this week."),
    body: firstString(rec.subtitle, rec.body, rec.description),
    bullets,
  };
}

/* =============================================================================
   Page
   ============================================================================= */

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const themeId: SpotlightThemeId = "nightDusk";
  const gradientLevel: GradientLevel = 3;
  void gradientLevel;

  const dark = isDarkTheme(themeId);

  const initialTabFromUrl = React.useMemo<LocalTab>(() => {
    const raw = searchParams?.get("tab") ?? searchParams?.get("section");
    return coerceTab(raw);
  }, [searchParams]);

  const [tab, setTab] = React.useState<LocalTab>(initialTabFromUrl);

  React.useEffect(() => {
    setTab((prev) => (prev === initialTabFromUrl ? prev : initialTabFromUrl));
  }, [initialTabFromUrl]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const vmTab: InsightsTab = tab === "funFacts" ? "summary" : tab;
  const vm = React.useMemo(
    () => buildInsightsViewModel(vmTab, { useLocal: mounted }),
    [vmTab, mounted]
  );

  const safeSuper = React.useMemo<LensLike>(() => {
    const raw = getInsightLens("superpowers");
    return normalizeLens(raw);
  }, []);

  const superBullets = React.useMemo(
    () => safeSuper.bullets,
    [safeSuper.bullets]
  );

  const nextStepsBaseSummary = React.useMemo(
    () => getNextStepsDefinition("insights.summary"),
    []
  );
  const nextStepsSummary = React.useMemo(() => {
    if (!nextStepsBaseSummary) return null;
    return { ...nextStepsBaseSummary, bridgeLine: "" };
  }, [nextStepsBaseSummary]);

  const nextStepsBaseMotivations = React.useMemo(
    () => getNextStepsDefinition("insights.motivations"),
    []
  );
  const nextStepsMotivations = React.useMemo(() => {
    const base = nextStepsBaseMotivations ?? nextStepsBaseSummary ?? null;
    if (!base) return null;
    return { ...base, bridgeLine: "" };
  }, [nextStepsBaseMotivations, nextStepsBaseSummary]);

  const nextStepsBaseStrengths = React.useMemo(
    () => getNextStepsDefinition("insights.strengths"),
    []
  );
  const nextStepsStrengths = React.useMemo(() => {
    const base = nextStepsBaseStrengths ?? nextStepsBaseSummary ?? null;
    if (!base) return null;
    return { ...base, bridgeLine: "" };
  }, [nextStepsBaseStrengths, nextStepsBaseSummary]);

  const nextStepsBaseSkills = React.useMemo(
    () => getNextStepsDefinition("insights.skills"),
    []
  );
  const nextStepsSkills = React.useMemo(() => {
    const base = nextStepsBaseSkills ?? nextStepsBaseSummary ?? null;
    if (!base) return null;
    return { ...base, bridgeLine: "" };
  }, [nextStepsBaseSkills, nextStepsBaseSummary]);

  function setTabAndSync(next: LocalTab) {
    setTab(next);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", next);
    params.delete("section");
    router.replace(`/main/insights?${params.toString()}`);
  }

  const wordCloudRaw = vm.summary.wordCloud;
  const wordCloud = React.useMemo<WordCloudItem[]>(
    () => wordCloudRaw ?? [],
    [wordCloudRaw]
  );

  const wordCloudDisplay = React.useMemo(() => {
    if (!wordCloud?.length) return [];
    const sorted = [...wordCloud].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
    return sorted.slice(0, 26);
  }, [wordCloud]);

  const watchouts = React.useMemo(
    () => guessWatchoutsFromSuperpowers(superBullets),
    [superBullets]
  );

  const signals = React.useMemo(
    () => normalizeSignals(vm.summary.signalBar),
    [vm.summary.signalBar]
  );
  const watchoutLine = React.useMemo(
    () => pickWatchoutSentence(watchouts),
    [watchouts]
  );

  const nameFromHeadline = React.useMemo(
    () => extractNameFromHeadline(vm.summary.headline || ""),
    [vm.summary.headline]
  );

  const motivationsTop = React.useMemo(
    () => scoreDrivers({ signals, terms: wordCloudDisplay }),
    [signals, wordCloudDisplay]
  );

  const [openDriver, setOpenDriver] = React.useState<DriverId | null>(null);
  React.useEffect(() => {
    const topId = motivationsTop.top?.def?.id ?? null;
    setOpenDriver((prev) => (prev == null ? topId : prev));
  }, [motivationsTop.top?.def?.id]);

  const baseMotivationReceipts = React.useMemo(() => {
    const receipts: string[] = [];

    const q = pickQuote(signals);
    if (q) receipts.push(q);

    const more = signals
      .flatMap((s) => (s.examples ?? []).map((x) => cleanOneLine(x)))
      .filter((x) => x && x.length >= 6 && x.length <= 110);

    for (const m of more) {
      if (receipts.length >= 3) break;
      if (!receipts.includes(m)) receipts.push(m);
    }

    if (receipts.length === 0 && wordCloudDisplay.length) {
      const t = wordCloudDisplay
        .slice(0, 3)
        .map((w) => cleanOneLine(w.term))
        .filter(Boolean);
      if (t.length) receipts.push(`Themes that keep showing up: ${t.join(", ")}.`);
    }

    return receipts.slice(0, 4);
  }, [signals, wordCloudDisplay]);

  const motivationProfile = React.useMemo<MotivationProfile | null>(() => {
    try {
      return buildMotivationProfile({
        name: nameFromHeadline,
        signals,
        terms: wordCloudDisplay,
        receipts: baseMotivationReceipts,
        topN: 5,
      });
    } catch {
      return null;
    }
  }, [nameFromHeadline, signals, wordCloudDisplay, baseMotivationReceipts]);

  const energyBoosters = React.useMemo(() => {
    const maybeRaw: unknown =
      (motivationProfile as unknown as Record<string, unknown> | null)
        ?.energyBoosters ??
      (motivationProfile as unknown as Record<string, unknown> | null)
        ?.boosters;

    if (Array.isArray(maybeRaw) && maybeRaw.length) {
      const out: string[] = [];
      for (const raw of maybeRaw) {
        const t = cleanOneLine(String(raw));
        if (!t) continue;
        const k = t.toLowerCase();
        if (out.some((x) => x.toLowerCase() === k)) continue;
        out.push(t);
        if (out.length >= 6) break;
      }
      if (out.length) return out;
    }

    const base = wordCloudDisplay
      .slice(0, 10)
      .map((w) => cleanOneLine(w.term))
      .filter((t) => t.length >= 3 && t.length <= 18);

    const out: string[] = [];
    for (const b of base) {
      const k = b.toLowerCase();
      if (out.some((x) => x.toLowerCase() === k)) continue;
      out.push(b);
      if (out.length >= 6) break;
    }
    return out;
  }, [motivationProfile, wordCloudDisplay]);

  const energyDrainers = React.useMemo(() => {
    const maybeRaw: unknown =
      (motivationProfile as unknown as Record<string, unknown> | null)
        ?.energyDrainers ??
      (motivationProfile as unknown as Record<string, unknown> | null)
        ?.drainers;

    if (Array.isArray(maybeRaw) && maybeRaw.length) {
      const out: string[] = [];
      for (const raw of maybeRaw) {
        const t = cleanOneLine(String(raw));
        if (!t) continue;
        const k = t.toLowerCase();
        if (out.some((x) => x.toLowerCase() === k)) continue;
        out.push(t);
        if (out.length >= 6) break;
      }
      if (out.length) return out;
    }

    const top3 = motivationsTop.top3.map((x) => x.def.id);
    const map: Record<DriverId, string[]> = {
      people: ["no feedback loop", "working in a vacuum", "group drama / fake vibes"],
      mastery: ["no progress", "same reps forever", "unclear standards"],
      meaning: ["busywork", "point feels fuzzy", "status games"],
      curiosity: ["nothing new", "no questions allowed", "repeat without insight"],
      freedom: ["micromanaged", "pre-scripted steps", "no choice"],
      momentum: ["stalled decisions", "endless planning", "waiting on approvals"],
    };

    const out: string[] = [];
    for (const id of top3) {
      for (const d of map[id] ?? []) {
        if (!out.includes(d)) out.push(d);
        if (out.length >= 6) break;
      }
      if (out.length >= 6) break;
    }
    return out.slice(0, 6);
  }, [motivationProfile, motivationsTop.top3]);

  const agenticNote = React.useMemo(() => {
    return buildAgenticSummaryNote({
      headline: vm.summary.headline || "",
      signals,
      motivationProfile,
      wordCloudDisplay,
      watchoutLine,
      energyBoosters,
      energyDrainers,
    });
  }, [
    vm.summary.headline,
    signals,
    motivationProfile,
    wordCloudDisplay,
    watchoutLine,
    energyBoosters,
    energyDrainers,
  ]);

  const summaryNext = React.useMemo(() => {
    const rec = (nextStepsSummary ?? {}) as Record<string, unknown>;
    return {
      tinyTask: normalizeTinyTask(rec.tinyTask),
      action: normalizeAction(rec.action),
    };
  }, [nextStepsSummary]);

  const hasStrongSignal = React.useMemo(() => {
    if (!mounted) return false;
    if (wordCloudDisplay.length > 0) return true;
    if (signals.some((s) => (s.strength ?? 0) >= 0.22)) return true;
    if (baseMotivationReceipts.length > 0) return true;
    return false;
  }, [mounted, wordCloudDisplay, signals, baseMotivationReceipts]);

  const isSummaryReady = mounted;

  const skillsModel = React.useMemo(() => {
    const anyVm = vm as unknown as Record<string, unknown>;
    if (anyVm && typeof anyVm === "object" && "skills" in anyVm) {
      const maybeSkills = (anyVm as { skills?: unknown }).skills;
      if (maybeSkills) return maybeSkills;
    }
    return vm;
  }, [vm]);

  const strengthsModel = React.useMemo(() => {
    const anyVm = vm as unknown as Record<string, unknown>;
    if (anyVm && typeof anyVm === "object" && "strengths" in anyVm) {
      const maybeStrengths = (anyVm as { strengths?: unknown }).strengths;
      if (maybeStrengths) return maybeStrengths;
    }
    return vm;
  }, [vm]);

  return (
    <>
      <style jsx global>{`
        button[aria-label*="sign out" i],
        a[aria-label*="sign out" i],
        button[title*="sign out" i],
        a[title*="sign out" i] {
          display: none !important;
        }
      `}</style>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col pb-28 pt-0">
        <div className="relative mb-5">
          <div className="relative flex gap-2 overflow-x-auto pb-0 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => {
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={tabPillBaseClass()}
                  style={tabPillStyle({
                    dark,
                    selected,
                    accent: t.accent,
                  })}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setTabAndSync(t.id)}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={tabDotStyle({
                      dark,
                      selected,
                      accent: t.accent,
                    })}
                  />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div
            aria-hidden
            className={[
              "pointer-events-none absolute right-0 top-0 h-full w-10",
              dark
                ? "bg-gradient-to-l from-[#0b1220] to-transparent"
                : "bg-gradient-to-l from-white to-transparent",
            ].join(" ")}
          />
        </div>

        {tab === "summary" ? (
          isSummaryReady ? (
            <section className="space-y-4">
              <InsightsSummaryCard
                dark={dark}
                headline={vm.summary.headline || "We’re still building your signal."}
                paragraph={agenticNote.paragraph}
                hasStrongSignal={hasStrongSignal}
                startHref="/main/questions?category=motivations"
              />

              <InsightsThemesCard
                dark={dark}
                items={wordCloudDisplay}
                hasStrongSignal={hasStrongSignal}
                motivatorsLine={agenticNote.motivatorsLine}
              />

              <InsightsSuperpowersCard
                dark={dark}
                body={safeSuper.body || "What you naturally do well when it matters."}
                bullets={superBullets}
                strengthsLine={agenticNote.strengthsLine}
                skillsLine={agenticNote.skillsLine}
                hasStrongSignal={hasStrongSignal}
              />

              <InsightsWatchoutsCard
                dark={dark}
                intro={watchouts.intro}
                bullets={watchouts.bullets}
                hasStrongSignal={hasStrongSignal}
              />

              <InsightsTinyTaskCard
                dark={dark}
                eyebrow={summaryNext.tinyTask.eyebrow}
                title={summaryNext.tinyTask.title}
                body={summaryNext.tinyTask.body}
                choices={summaryNext.tinyTask.choices}
                hasStrongSignal={hasStrongSignal}
              />

              <InsightsActionCard
                dark={dark}
                eyebrow={summaryNext.action.eyebrow}
                title={summaryNext.action.title}
                body={summaryNext.action.body}
                bullets={summaryNext.action.bullets}
                hasStrongSignal={hasStrongSignal}
              />

              <InsightsQuickCheckCard
                dark={dark}
                contextTag={`insights:${tab}`}
              />
            </section>
          ) : null
        ) : tab === "motivations" ? (
          <MotivationsTab
            dark={dark}
            motivationsTop={motivationsTop}
            openDriver={openDriver}
            setOpenDriver={setOpenDriver}
            energyBoosters={energyBoosters}
            energyDrainers={energyDrainers}
            motivationReceipts={baseMotivationReceipts}
            nextStepsMotivations={nextStepsMotivations}
            mounted={mounted}
            tab={tab}
            nameFromHeadline={nameFromHeadline}
          />
        ) : tab === "strengths" ? (
          <StrengthsTab
            dark={dark}
            model={strengthsModel}
            nextStepsStrengths={nextStepsStrengths}
            mounted={mounted}
            tab={tab}
            nameFromHeadline={nameFromHeadline}
          />
        ) : tab === "skills" ? (
          <SkillsTab
            dark={dark}
            model={skillsModel}
            nextStepsSkills={nextStepsSkills}
            mounted={mounted}
            tab={tab}
            nameFromHeadline={nameFromHeadline}
          />
        ) : tab === "funFacts" ? (
          <FunFactsTab
            dark={dark}
            mounted={mounted}
            tab={tab}
            nameFromHeadline={nameFromHeadline}
            wordCloudDisplay={wordCloudDisplay}
          />
        ) : null}
      </div>
    </>
  );
}