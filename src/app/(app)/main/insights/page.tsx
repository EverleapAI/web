// src/app/(app)/main/insights/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock3, Rocket } from "lucide-react";

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

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";

import { getInsightLens } from "@/app/(app)/main/content/insightLenses";

import { MotivationsTab } from "./tabs/MotivationsTab";
import { StrengthsTab } from "./tabs/StrengthsTab";
import { SkillsTab } from "./tabs/SkillsTab";

/* =============================================================================
   Tabs
   ============================================================================= */

type TabDef = { id: InsightsTab; label: string; blurb?: string };

const TABS: TabDef[] = [
  { id: "summary", label: "Summary", blurb: "Your read so far" },
  { id: "motivations", label: "Motivation(s)", blurb: "What drives you" },
  { id: "strengths", label: "Strength(s)", blurb: "How you think + behave" },
  { id: "skills", label: "Skill(s)", blurb: "Tools + technical knowledge" },
  // NOTE: Superpowers + Time Twin live inside Summary as collapsible sections.
];

type CalibrationChoice = "Mostly right" | "Somewhat" | "Not really";

/* =============================================================================
   Storage keys (local only)
   ============================================================================= */

const INSIGHTS_CALIBRATION_KEY = "everleap.insights.calibration.v1";

/* =============================================================================
   URL helpers
   ============================================================================= */

function coerceTab(raw: string | null | undefined): InsightsTab {
  const v = (raw ?? "").toLowerCase();
  if (v === "summary") return "summary";
  if (v === "motivations") return "motivations";
  if (v === "strengths") return "strengths";
  if (v === "skills") return "skills";
  // back-compat: old links route to summary now
  if (v === "superpowers") return "summary";
  if (v === "doppelganger") return "summary";
  if (v.includes("doppel")) return "summary";
  if (v.includes("time") && v.includes("twin")) return "summary";
  return "summary";
}

/* =============================================================================
   UI helpers
   ============================================================================= */

function sectionTitle(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function sectionMuted(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function textAffordance(dark: boolean) {
  return [
    "inline-flex items-center gap-2",
    "text-sm font-semibold",
    "transition",
    dark ? "text-white/70 hover:text-white/90" : "text-slate-700 hover:text-slate-900",
    "focus-visible:outline-none",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-white/14"
      : "focus-visible:ring-2 focus-visible:ring-slate-900/10",
  ].join(" ");
}

function fadeMaskStyle(mode: "story"): React.CSSProperties {
  const cut = mode === "story" ? "70%" : "70%";
  return {
    WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${cut}, rgba(0,0,0,0) 100%)`,
    maskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${cut}, rgba(0,0,0,0) 100%)`,
  };
}

/* =============================================================================
   Readability surfaces (Weather-like “calm cards”)
   ============================================================================= */

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[26px] border",
    "px-4 py-4 md:px-5 md:py-5",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/22" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function surfaceTitle(dark: boolean) {
  return [
    "text-[13px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-white/55" : "text-slate-600",
  ].join(" ");
}

function surfaceSubtle(dark: boolean) {
  return dark ? "text-white/55" : "text-slate-600";
}

function calmBodyText(dark: boolean) {
  return dark ? "text-slate-200/90" : "text-slate-700";
}

/* ===== Word styling (multi-color words, deterministic) ===== */

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function wordSizePx(weight: number) {
  const w = clamp01(weight);
  return 14 + Math.round(w * 10); // 14..24
}

function wordOpacity(weight: number) {
  const w = clamp01(weight);
  return 0.72 + w * 0.24; // 0.72..0.96
}

function wordColorClasses(dark: boolean, term: string) {
  const paletteDark = [
    "text-sky-200/90",
    "text-fuchsia-200/85",
    "text-amber-200/90",
    "text-emerald-200/85",
    "text-violet-200/85",
    "text-rose-200/85",
    "text-cyan-200/90",
    "text-lime-200/85",
  ] as const;

  const paletteLight = [
    "text-sky-700/95",
    "text-fuchsia-700/90",
    "text-amber-700/95",
    "text-emerald-700/90",
    "text-violet-700/90",
    "text-rose-700/90",
    "text-cyan-700/95",
    "text-lime-700/90",
  ] as const;

  const i = hashString(term.toLowerCase()) % paletteDark.length;

  return [
    dark ? paletteDark[i] : paletteLight[i],
    dark ? "drop-shadow-[0_1px_10px_rgba(0,0,0,0.38)]" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function wordChaosVars(term: string, weight: number): CSSVars {
  const h = hashString(term.toLowerCase());
  const w = clamp01(weight);
  const allow = w < 0.92 && (h % 10) < 3;

  const rot = allow ? ((h % 5) - 2) * 0.35 : 0;
  const ty = allow ? ((h % 7) - 3) * 0.25 : 0;
  const ls = w > 0.78 ? 0.15 : 0;

  return {
    "--el-rot": `${rot}deg`,
    "--el-ty": `${ty}px`,
    "--el-ls": `${ls}px`,
  };
}

function topTerms(items: WordCloudItem[]) {
  const sorted = [...items].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  return new Set(sorted.slice(0, 3).map((x) => x.term.toLowerCase()));
}

function highlightWrap(dark: boolean) {
  return dark ? "bg-white/8 ring-1 ring-white/10" : "bg-black/4 ring-1 ring-black/8";
}

/* =============================================================================
   Color accents
   ============================================================================= */

function tabAccent(id: InsightsTab) {
  if (id === "motivations") return { dot: "bg-amber-300/85", ring: "ring-amber-300/25" };
  if (id === "strengths") return { dot: "bg-fuchsia-300/85", ring: "ring-fuchsia-300/25" };
  if (id === "skills") return { dot: "bg-cyan-300/85", ring: "ring-cyan-300/25" };
  return { dot: "bg-sky-300/75", ring: "ring-sky-300/20" };
}

function tabPillClasses(dark: boolean, selected: boolean, id: InsightsTab) {
  const acc = tabAccent(id);

  const base = [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-sm font-semibold transition active:scale-95",
  ];

  const skin = dark
    ? "border-white/10 bg-slate-950/18 text-white/78 hover:bg-slate-950/28"
    : "border-black/10 bg-white/80 text-slate-800 hover:bg-white";

  const on = selected
    ? dark
      ? `bg-white/14 text-white border-white/16 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_16px_44px_rgba(0,0,0,0.40)] ring-2 ${acc.ring}`
      : "bg-white text-slate-900 border-slate-200 shadow-[0_14px_40px_rgba(0,0,0,0.12)] ring-2 ring-slate-900/10"
    : "";

  return [...base, skin, on].join(" ");
}

function accentDot(id: InsightsTab) {
  const acc = tabAccent(id);
  return <span aria-hidden className={["h-2 w-2 rounded-full", acc.dot].join(" ")} />;
}

/* =============================================================================
   Welcome copy keyword colorizer
   ============================================================================= */

function keywordClass(dark: boolean, token: string) {
  const t = token.toLowerCase();
  if (t === "everleap") return dark ? "text-emerald-200" : "text-emerald-700";
  if (t === "insights") return dark ? "text-sky-200" : "text-sky-700";
  if (t.startsWith("motivation")) return dark ? "text-amber-200" : "text-amber-700";
  if (t.startsWith("strength")) return dark ? "text-fuchsia-200" : "text-fuchsia-700";
  if (t.startsWith("skill")) return dark ? "text-cyan-200" : "text-cyan-700";
  return "";
}

function colorizeKeywords(dark: boolean, text: string): React.ReactNode {
  const s = (text ?? "").trim();
  if (!s) return s;

  const rx = /\b(Everleap|Insights|Motivation(?:s)?|Strength(?:s)?|Skill(?:s)?)\b/g;

  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const m of s.matchAll(rx)) {
    const idx = m.index ?? 0;
    const hit = m[0] ?? "";
    if (idx > last) parts.push(s.slice(last, idx));

    const cls = keywordClass(dark, hit);
    parts.push(
      <span
        key={`${idx}_${hit}`}
        className={[
          cls,
          "font-semibold",
          dark ? "drop-shadow-[0_1px_12px_rgba(0,0,0,0.42)]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {hit}
      </span>
    );

    last = idx + hit.length;
  }

  if (last < s.length) parts.push(s.slice(last));
  return parts;
}

/* =============================================================================
   Lens sections (editorial blocks)
   ============================================================================= */

type LensId = "superpowers" | "timeTwin" | "nextSteps";

function lensPalette(lensId: LensId) {
  if (lensId === "superpowers") {
    return {
      dot: "bg-lime-300/85",
      pillRing: "ring-lime-300/20",
      railA: "from-lime-300/50",
      railB: "to-emerald-300/32",
      glowA: "bg-lime-300/5",
      glowB: "bg-emerald-300/4",
    };
  }
  if (lensId === "timeTwin") {
    return {
      dot: "bg-violet-300/85",
      pillRing: "ring-violet-300/18",
      railA: "from-violet-300/46",
      railB: "to-fuchsia-300/30",
      glowA: "bg-violet-300/5",
      glowB: "bg-fuchsia-300/4",
    };
  }
  return {
    dot: "bg-sky-300/80",
    pillRing: "ring-sky-300/16",
    railA: "from-sky-300/40",
    railB: "to-cyan-300/26",
    glowA: "bg-sky-300/5",
    glowB: "bg-cyan-300/4",
  };
}

function lensIcon(lensId: LensId) {
  if (lensId === "superpowers") return Sparkles;
  if (lensId === "timeTwin") return Clock3;
  return Rocket;
}

function headerSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-2xl",
    "px-4 py-3 md:px-5 md:py-3.5",
    "backdrop-blur-xl",
    "border",
    dark ? "border-white/10 bg-slate-950/20" : "border-black/10 bg-white/80",
  ].join(" ");
}

function contentWash(dark: boolean) {
  return [
    "relative overflow-hidden rounded-2xl",
    "px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-4",
    "backdrop-blur-xl",
    "border",
    dark ? "border-white/10 bg-slate-950/18" : "border-black/10 bg-white/75",
  ].join(" ");
}

function lensPill(
  dark: boolean,
  label: string,
  dotClass: string,
  selected?: boolean,
  ringClass?: string
) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1",
        "text-xs font-semibold",
        dark ? "border-white/10 bg-white/6 text-white/86" : "border-black/10 bg-white text-slate-800",
        selected ? (dark ? `ring-2 ${ringClass ?? "ring-white/12"}` : "ring-2 ring-black/10") : "",
      ].join(" ")}
    >
      <span aria-hidden className={["h-2 w-2 rounded-full", dotClass].join(" ")} />
      {label}
    </span>
  );
}

function RowCTA(props: { dark: boolean; open: boolean }) {
  const { dark, open } = props;
  return (
    <span
      className={[
        "inline-flex items-center gap-2",
        "text-sm font-semibold",
        "select-none",
        dark ? "text-white/70" : "text-slate-700",
      ].join(" ")}
      aria-hidden
    >
      {open ? "Hide" : "Open"}
      <span aria-hidden className="opacity-80">
        {open ? "▾" : "▸"}
      </span>
    </span>
  );
}

type ContentStyle = "wash" | "none";

function LensSectionRow(props: {
  dark: boolean;
  lensId: LensId;
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  contentStyle?: ContentStyle;
  children?: React.ReactNode;
}) {
  const { dark, lensId, title, subtitle, open, onToggle, contentStyle = "wash", children } = props;
  const pal = lensPalette(lensId);
  const Icon = lensIcon(lensId);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        aria-expanded={open}
        className={[
          headerSurface(dark),
          "w-full text-left cursor-pointer",
          "transition",
          dark ? "hover:bg-slate-950/28" : "hover:bg-white/90",
          dark
            ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/14"
            : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-y-4 left-4 hidden w-[3px] rounded-full md:block">
          <div
            className={[
              "h-full w-full rounded-full",
              "bg-gradient-to-b",
              pal.railA,
              pal.railB,
              dark ? "opacity-70" : "opacity-45",
            ].join(" ")}
          />
          <div
            className={[
              "absolute inset-0 rounded-full blur-lg",
              "bg-gradient-to-b",
              pal.railA,
              pal.railB,
              dark ? "opacity-18" : "opacity-10",
            ].join(" ")}
          />
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className={["absolute -top-12 -left-16 h-44 w-44 rounded-full blur-3xl", pal.glowA].join(" ")} />
          <div className={["absolute -bottom-16 -right-16 h-52 w-52 rounded-full blur-3xl", pal.glowB].join(" ")} />
        </div>

        {!open ? (
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
            <Icon className={["h-10 w-10", dark ? "text-white/10" : "text-slate-900/8"].join(" ")} />
          </div>
        ) : null}

        <div className="relative pl-0 md:pl-5">
          <div className="flex flex-wrap items-center gap-3">
            {lensPill(dark, title, pal.dot, open, pal.pillRing)}
            <RowCTA dark={dark} open={open} />
          </div>

          <div className={["mt-2 text-sm leading-relaxed", dark ? "text-white/70" : "text-slate-700"].join(" ")}>
            {subtitle}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key={`${lensId}_content`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative mt-3"
          >
            {contentStyle === "wash" ? (
              <div className={contentWash(dark)}>
                <div className="pointer-events-none absolute inset-y-4 left-4 hidden w-[2px] rounded-full md:block">
                  <div className={["h-full w-full rounded-full", "bg-gradient-to-b", pal.railA, pal.railB, dark ? "opacity-40" : "opacity-24"].join(" ")} />
                </div>

                <div className="relative pl-0 md:pl-5">{children}</div>
              </div>
            ) : (
              <div className="relative pl-0 md:pl-5">
                <div className="pointer-events-none absolute -left-3 top-0 hidden h-full w-[2px] rounded-full md:block">
                  <div className={["h-full w-full rounded-full", "bg-gradient-to-b", pal.railA, pal.railB, dark ? "opacity-28" : "opacity-18"].join(" ")} />
                </div>
                {children}
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* =============================================================================
   Quote callout (no inner card)
   ============================================================================= */

function QuoteCallout(props: { dark: boolean; tint: "lime" | "violet"; quote: string }) {
  const { dark, tint, quote } = props;

  const rail =
    tint === "violet"
      ? dark
        ? "from-violet-300/50 to-fuchsia-300/30"
        : "from-violet-500/40 to-fuchsia-500/25"
      : dark
      ? "from-lime-300/46 to-emerald-300/30"
      : "from-lime-500/36 to-emerald-500/22";

  return (
    <div className="mt-4 flex gap-3">
      <div className="relative w-[3px] shrink-0 overflow-hidden rounded-full">
        <div className={["absolute inset-0 bg-gradient-to-b", rail].join(" ")} />
        <div className={["absolute inset-0 blur-lg bg-gradient-to-b", rail, dark ? "opacity-18" : "opacity-10"].join(" ")} />
      </div>

      <div className="min-w-0">
        <div className={["text-[11px] font-semibold uppercase tracking-[0.16em]", dark ? "text-white/45" : "text-slate-500"].join(" ")}>
          Quote
        </div>
        <div className={["mt-1 text-[15px] leading-relaxed", dark ? "text-white/75" : "text-slate-700"].join(" ")}>
          “{quote}”
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Page
   ============================================================================= */

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Must match layout.tsx (kept explicit here so "dark" stays deterministic)
  const themeId: SpotlightThemeId = "nightDusk";
  const gradientLevel: GradientLevel = 3;
  void gradientLevel;

  const dark = isDarkTheme(themeId);

  const initialTabFromUrl = React.useMemo<InsightsTab>(() => {
    const raw = searchParams?.get("tab") ?? searchParams?.get("section");
    return coerceTab(raw);
  }, [searchParams]);

  const [tab, setTab] = React.useState<InsightsTab>(initialTabFromUrl);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const vm = React.useMemo(() => buildInsightsViewModel(tab, { useLocal: mounted }), [tab, mounted]);

  const [calibration, setCalibration] = React.useState<CalibrationChoice | null>(null);

  React.useEffect(() => {
    if (!mounted) return;
    const saved = safeJsonParse<{ value: CalibrationChoice }>(
      window.localStorage.getItem(INSIGHTS_CALIBRATION_KEY)
    );
    if (saved?.value) setCalibration(saved.value);
  }, [mounted]);

  function setCalibrationAndPersist(next: CalibrationChoice) {
    setCalibration(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        INSIGHTS_CALIBRATION_KEY,
        JSON.stringify({ value: next })
      );
    }
  }

  const [storyExpanded, setStoryExpanded] = React.useState(false);

  const [superpowersOpen, setSuperpowersOpen] = React.useState(false);
  const [timeTwinOpen, setTimeTwinOpen] = React.useState(false);
  const [nextStepsOpen, setNextStepsOpen] = React.useState(false);

  const calibrationOptions: CalibrationChoice[] = ["Mostly right", "Somewhat", "Not really"];

  function setTabAndSync(next: InsightsTab) {
    setTab(next);

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", next);
    params.delete("section");
    router.replace(`/main/insights?${params.toString()}`);
  }

  const wordCloudRaw = vm.summary.wordCloud;
  const wordCloud = React.useMemo<WordCloudItem[]>(() => wordCloudRaw ?? [], [wordCloudRaw]);
  const topWordSet = React.useMemo(() => topTerms(wordCloud), [wordCloud]);

  const primaryUnlock = vm.summary.primaryUnlock;

  const story = vm.summary.storySoFar ?? [];
  const storyCollapsed = story.slice(0, 2);
  const storyExpandedItems = story.slice(0, 7);

  const storyTextCollapsed = React.useMemo(() => {
    const parts = storyCollapsed.map((s) => (s ?? "").trim()).filter(Boolean);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }, [storyCollapsed]);

  const storyTextExpanded = React.useMemo(() => {
    const parts = storyExpandedItems.map((s) => (s ?? "").trim()).filter(Boolean);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }, [storyExpandedItems]);

  const canToggleStory = storyExpandedItems.length > 0 && story.length > 2;

  const nextStepsBase = React.useMemo(() => getNextStepsDefinition("insights.summary"), []);

  const nextSteps = React.useMemo(() => {
    if (!nextStepsBase) return null;
    return { ...nextStepsBase, bridgeLine: "" };
  }, [nextStepsBase]);

  const superDef = React.useMemo(() => getInsightLens("superpowers"), []);
  const timeDef = React.useMemo(() => getInsightLens("timeTwin"), []);

  const wordCloudDisplay = React.useMemo(() => {
    if (!wordCloud?.length) return [];
    const sorted = [...wordCloud].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
    return sorted.slice(0, 26);
  }, [wordCloud]);

  return (
    <>
      <style jsx global>{`
        .el-word {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(1);
          letter-spacing: var(--el-ls, 0px);
          will-change: transform;
          transition: transform 160ms ease;
        }
        .el-word:hover {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(1.03);
        }
        .el-word:active {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(0.988);
        }
      `}</style>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-5 md:px-8 md:pb-24 md:pt-7">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className={`text-2xl font-semibold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
              Insights
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1",
                  "text-xs font-semibold",
                  dark ? "border-white/10 bg-slate-950/18 text-white/78" : "border-black/10 bg-white/80 text-slate-800",
                ].join(" ")}
              >
                <span aria-hidden className="opacity-85">
                  ✦
                </span>
                <span>What it all means</span>
              </span>
            </div>
          </div>

          {/* Desktop pills (core only) */}
          <div className="hidden md:flex md:max-w-[70%] md:flex-wrap md:justify-end md:gap-2">
            {TABS.map((t) => {
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={tabPillClasses(dark, selected, t.id)}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setTabAndSync(t.id)}
                >
                  {accentDot(t.id)}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile lens pills (always visible) */}
        <div className="md:hidden">
          <div className="relative">
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((t) => {
                const selected = t.id === tab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={tabPillClasses(dark, selected, t.id)}
                    aria-current={selected ? "page" : undefined}
                    onClick={() => setTabAndSync(t.id)}
                  >
                    {accentDot(t.id)}
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* right fade to hint scroll */}
            <div
              aria-hidden
              className={[
                "pointer-events-none absolute right-0 top-0 h-full w-10",
                dark ? "bg-gradient-to-l from-[#0b1220] to-transparent" : "bg-gradient-to-l from-white to-transparent",
              ].join(" ")}
            />
          </div>
        </div>

        {tab === "summary" ? (
          <section className="mb-6">
            <div className="relative">
              {/* HERO GRID */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.15fr_0.85fr] md:items-start">
                {/* Agentic intro */}
                <div className="relative pt-1 md:pt-2">
                  <div className={readingSurface(dark)}>
                    <div
                      className={[
                        "pointer-events-none absolute inset-0",
                        dark ? "opacity-100" : "opacity-90",
                      ].join(" ")}
                      aria-hidden
                    >
                      <div
                        className={[
                          "absolute -top-14 -right-14 h-48 w-48 rounded-full blur-3xl",
                          dark ? "bg-sky-300/7" : "bg-sky-400/6",
                        ].join(" ")}
                      />
                      <div
                        className={[
                          "absolute -bottom-20 -left-14 h-56 w-56 rounded-full blur-3xl",
                          dark ? "bg-emerald-300/6" : "bg-emerald-400/5",
                        ].join(" ")}
                      />
                    </div>

                    <div className="relative">
                      <div className={`text-[26px] leading-snug md:text-[30px] ${dark ? "text-white" : "text-slate-900"}`}>
                        {colorizeKeywords(dark, vm.summary.headline)}
                      </div>

                      <div className="mt-3">
                        {!storyExpanded ? (
                          <div className="relative" style={fadeMaskStyle("story")}>
                            <p className={`text-[16px] leading-7 md:text-[17px] ${calmBodyText(dark)}`}>
                              {colorizeKeywords(dark, storyTextCollapsed || storyTextExpanded)}
                            </p>
                          </div>
                        ) : (
                          <AnimatePresence initial={false}>
                            <motion.p
                              key="storyExpanded"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.18 }}
                              className={`text-[16px] leading-7 md:text-[17px] ${calmBodyText(dark)}`}
                            >
                              {colorizeKeywords(dark, storyTextExpanded)}
                            </motion.p>
                          </AnimatePresence>
                        )}
                      </div>

                      {canToggleStory ? (
                        <div className="mt-3">
                          <button
                            type="button"
                            className={textAffordance(dark)}
                            onClick={() => setStoryExpanded((v) => !v)}
                          >
                            <span aria-hidden className="opacity-80">
                              {storyExpanded ? "▾" : "▸"}
                            </span>
                            {storyExpanded ? "Read less" : "Read more"}
                          </button>
                        </div>
                      ) : null}

                      {primaryUnlock?.items?.length ? (
                        <div className="mt-4">
                          <div
                            className={[
                              "relative overflow-hidden rounded-[22px] border px-4 py-3",
                              "backdrop-blur-2xl",
                              dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/85",
                            ].join(" ")}
                          >
                            <div className="pointer-events-none absolute inset-0" aria-hidden>
                              <div
                                className={[
                                  "absolute -top-10 -right-12 h-36 w-36 rounded-full blur-3xl",
                                  dark ? "bg-amber-300/10" : "bg-amber-400/8",
                                ].join(" ")}
                              />
                              <div
                                className={[
                                  "absolute -bottom-14 -left-12 h-44 w-44 rounded-full blur-3xl",
                                  dark ? "bg-rose-300/7" : "bg-rose-400/6",
                                ].join(" ")}
                              />
                            </div>

                            <div className="relative">
                              <div className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                                Want this to get more specific?
                              </div>

                              <div className={`mt-1 text-[13px] leading-relaxed ${dark ? "text-white/72" : "text-slate-700"}`}>
                                Finish one more section and I’ll get way more specific.
                              </div>

                              <div className="mt-2.5 flex flex-wrap gap-2">
                                {primaryUnlock.items.slice(0, 2).map((it) =>
                                  it.href ? (
                                    <button
                                      key={it.id}
                                      type="button"
                                      className={[
                                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                                        "text-xs font-semibold transition active:scale-95",
                                        dark ? "border-white/12 bg-white/6 text-white/85 hover:bg-white/10" : "border-black/10 bg-white text-slate-900 hover:bg-white",
                                      ].join(" ")}
                                      onClick={() => router.push(it.href!)}
                                    >
                                      <span aria-hidden className="opacity-85">
                                        ↗
                                      </span>
                                      <span>{it.label}</span>
                                    </button>
                                  ) : null
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Themes */}
                <div className="relative pt-1 md:pt-2">
                  <div className={readingSurface(dark)}>
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className={surfaceTitle(dark)}>Themes</div>
                          <div className={`mt-1 text-sm leading-relaxed ${surfaceSubtle(dark)}`}>
                            The words that keep showing up in your answers.
                          </div>
                        </div>

                        <div
                          className={[
                            "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            dark ? "border-white/10 bg-white/6 text-white/60" : "border-black/10 bg-white text-slate-600",
                          ].join(" ")}
                          aria-hidden
                        >
                          {wordCloudDisplay.length ? `${wordCloudDisplay.length} tags` : "—"}
                        </div>
                      </div>

                      <div className="mt-3">
                        {wordCloudDisplay.length ? (
                          <div className="flex flex-wrap gap-x-3 gap-y-2 leading-none">
                            {wordCloudDisplay.map((w) => {
                              const isTop = topWordSet.has(w.term.toLowerCase());
                              return (
                                <span
                                  key={w.term}
                                  className={[
                                    "select-none el-word",
                                    wordColorClasses(dark, w.term),
                                    isTop ? ["rounded-full px-2.5 py-1", highlightWrap(dark)].join(" ") : "",
                                  ].join(" ")}
                                  style={{
                                    fontSize: `${wordSizePx(w.weight)}px`,
                                    opacity: wordOpacity(w.weight),
                                    ...wordChaosVars(w.term, w.weight),
                                  }}
                                >
                                  {w.term}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={`text-[14px] leading-relaxed ${dark ? "text-white/72" : "text-slate-700"}`}>
                            Nothing to map yet — answer a few questions and this will fill in.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`my-6 h-px ${dark ? "bg-white/10" : "bg-black/10"}`} />

              <LensSectionRow
                dark={dark}
                lensId="superpowers"
                title="Superpowers"
                subtitle={superDef.subtitle || "What you naturally do well when it matters."}
                open={superpowersOpen}
                onToggle={() => setSuperpowersOpen((v) => !v)}
              >
                <div className={`text-[15px] leading-relaxed ${dark ? "text-white/78" : "text-slate-700"}`}>
                  {superDef.body}
                </div>

                {superDef.bullets?.length ? (
                  <ul className="mt-3 space-y-2">
                    {superDef.bullets.map((b, i) => (
                      <li key={`sp_b_${i}`} className="flex gap-2 text-[15px] leading-relaxed">
                        <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                          •
                        </span>
                        <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {superDef.quote ? <QuoteCallout dark={dark} tint="lime" quote={superDef.quote} /> : null}
              </LensSectionRow>

              <div className="mt-3">
                <LensSectionRow
                  dark={dark}
                  lensId="timeTwin"
                  title="Time Twin"
                  subtitle={timeDef.subtitle || "A historical mirror — creative + technical + real-world impact."}
                  open={timeTwinOpen}
                  onToggle={() => setTimeTwinOpen((v) => !v)}
                >
                  <div className={`text-[15px] leading-relaxed ${dark ? "text-white/78" : "text-slate-700"}`}>
                    {timeDef.body}
                  </div>

                  {timeDef.bullets?.length ? (
                    <ul className="mt-3 space-y-2">
                      {timeDef.bullets.map((b, i) => (
                        <li key={`tt_b_${i}`} className="flex gap-2 text-[15px] leading-relaxed">
                          <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                            •
                          </span>
                          <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {timeDef.quote ? <QuoteCallout dark={dark} tint="violet" quote={timeDef.quote} /> : null}
                </LensSectionRow>
              </div>

              {nextSteps ? (
                <div className="mt-3">
                  <LensSectionRow
                    dark={dark}
                    lensId="nextSteps"
                    title="Next steps"
                    subtitle="A quick reflection + a real-world action."
                    open={nextStepsOpen}
                    onToggle={() => setNextStepsOpen((v) => !v)}
                    contentStyle="none"
                  >
                    <NextStepsStack
                      dark={dark}
                      useLocal={mounted}
                      definition={nextSteps}
                      variant="embedded"
                      collapsible={false}
                      defaultOpen
                      // no changes
                    />
                  </LensSectionRow>
                </div>
              ) : null}

              <div className="mt-6">
                <div className={surfaceTitle(dark)}>Quick check</div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {calibrationOptions.map((opt) => {
                    const selected = calibration === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        className={[
                          "inline-flex items-center justify-center",
                          "rounded-full border px-3.5 py-2",
                          "text-sm font-semibold transition active:scale-95",
                          dark ? "border-white/10 bg-slate-950/18 text-white/78 hover:bg-slate-950/28" : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                          selected
                            ? dark
                              ? "bg-white/14 text-white border-white/16 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_16px_44px_rgba(0,0,0,0.40)] ring-2 ring-white/22"
                              : "bg-white text-slate-900 border-slate-200 shadow-[0_14px_40px_rgba(0,0,0,0.12)] ring-2 ring-slate-900/10"
                            : "",
                        ].join(" ")}
                        onClick={() => setCalibrationAndPersist(opt)}
                        aria-pressed={selected}
                      >
                        <span className="mr-2" aria-hidden>
                          {selected ? "✓" : opt === "Mostly right" ? "👍" : opt === "Somewhat" ? "😐" : "👎"}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className={`mt-2 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>
                  (We’ll use this later to recalibrate Insights.)
                </div>
              </div>
            </div>
          </section>
        ) : tab === "motivations" ? (
          <MotivationsTab dark={dark} mounted={mounted} vm={vm} router={router} />
        ) : tab === "strengths" ? (
          <StrengthsTab dark={dark} mounted={mounted} vm={vm} router={router} />
        ) : tab === "skills" ? (
          <SkillsTab dark={dark} mounted={mounted} vm={vm} router={router} />
        ) : (
          <section className="mb-6">
            <div
              className={[
                "rounded-[28px] px-5 py-5",
                "shadow-[0_28px_95px_rgba(0,0,0,0.70)]",
                "backdrop-blur-xl",
                dark ? "text-white/80 bg-slate-950/25" : "text-slate-800 bg-white/80",
              ].join(" ")}
            >
              <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>
                {TABS.find((t) => t.id === tab)?.label ?? "Section"}
              </div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>This section is scaffolded.</div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}