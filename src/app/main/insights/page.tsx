// src/app/main/insights/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock3, Rocket } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import { isDarkTheme, type SpotlightThemeId, type GradientLevel } from "@/theme/everleapVisuals";

import { buildInsightsViewModel, type InsightsTab, type WordCloudItem } from "./app/buildInsightsViewModel";

import { NextStepsStack } from "@/app/main/components/nextSteps/NextStepsStack";
import { getNextStepsDefinition } from "@/app/main/content/nextSteps";

import { getInsightLens } from "@/app/main/content/insightLenses";

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

function pillButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-xs font-semibold transition active:scale-95",
    dark ? "border-white/10 bg-white/6 text-white/78 hover:bg-white/10" : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    dark ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function textAffordance(dark: boolean) {
  return [
    "inline-flex items-center gap-2",
    "text-sm font-semibold",
    "transition",
    dark ? "text-white/70 hover:text-white/90" : "text-slate-700 hover:text-slate-900",
    "focus-visible:outline-none",
    dark ? "focus-visible:ring-2 focus-visible:ring-white/14" : "focus-visible:ring-2 focus-visible:ring-slate-900/10",
  ].join(" ");
}

function fadeMaskStyle(mode: "story"): React.CSSProperties {
  const cut = mode === "story" ? "62%" : "70%";
  return {
    WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${cut}, rgba(0,0,0,0) 100%)`,
    maskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${cut}, rgba(0,0,0,0) 100%)`,
  };
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
  return 13 + Math.round(w * 14);
}

function wordOpacity(weight: number) {
  const w = clamp01(weight);
  return 0.65 + w * 0.35;
}

function wordColorClasses(dark: boolean, term: string) {
  const paletteDark = [
    "text-sky-200",
    "text-fuchsia-200",
    "text-amber-200",
    "text-emerald-200",
    "text-violet-200",
    "text-rose-200",
    "text-cyan-200",
    "text-lime-200",
  ] as const;

  const paletteLight = [
    "text-sky-700",
    "text-fuchsia-700",
    "text-amber-700",
    "text-emerald-700",
    "text-violet-700",
    "text-rose-700",
    "text-cyan-700",
    "text-lime-700",
  ] as const;

  const i = hashString(term.toLowerCase()) % paletteDark.length;

  return [dark ? paletteDark[i] : paletteLight[i], dark ? "drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]" : ""]
    .filter(Boolean)
    .join(" ");
}

function wordChaosVars(term: string, weight: number): CSSVars {
  const h = hashString(term.toLowerCase());
  const w = clamp01(weight);
  const mode = h % 10;
  const allow = mode < 4 && w < 0.95;

  const rot = allow ? ((h % 5) - 2) * 1 : 0;
  const ty = allow ? ((h % 7) - 3) * 0.6 : 0;
  const ls = w > 0.75 ? 0.2 : 0;

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
  return dark ? "bg-white/10 ring-1 ring-white/10" : "bg-black/5 ring-1 ring-black/8";
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

  const base = ["inline-flex items-center justify-center gap-2", "rounded-full border px-3.5 py-2", "text-sm font-semibold transition active:scale-95"];

  const skin = dark ? "border-white/10 bg-white/5 text-white/75 hover:bg-white/10" : "border-black/10 bg-white/80 text-slate-800 hover:bg-white";

  const on = selected
    ? dark
      ? `bg-white/18 text-white border-white/18 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_55px_rgba(0,0,0,0.45)] ring-2 ${acc.ring}`
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
        className={[cls, "font-semibold", dark ? "drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]" : ""].filter(Boolean).join(" ")}
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
      railA: "from-lime-300/55",
      railB: "to-emerald-300/35",
      glowA: "bg-lime-300/7",
      glowB: "bg-emerald-300/6",
    };
  }
  if (lensId === "timeTwin") {
    return {
      dot: "bg-violet-300/85",
      pillRing: "ring-violet-300/18",
      railA: "from-violet-300/50",
      railB: "to-fuchsia-300/35",
      glowA: "bg-violet-300/7",
      glowB: "bg-fuchsia-300/6",
    };
  }
  return {
    dot: "bg-sky-300/80",
    pillRing: "ring-sky-300/16",
    railA: "from-sky-300/45",
    railB: "to-cyan-300/30",
    glowA: "bg-sky-300/7",
    glowB: "bg-cyan-300/6",
  };
}

function lensIcon(lensId: LensId) {
  if (lensId === "superpowers") return Sparkles;
  if (lensId === "timeTwin") return Clock3;
  return Rocket;
}

function headerSurface(dark: boolean) {
  return ["relative overflow-hidden rounded-2xl", "px-4 py-3 md:px-5 md:py-3.5", "backdrop-blur-xl", dark ? "bg-white/5" : "bg-white/75"].join(" ");
}

function contentWash(dark: boolean) {
  return ["relative overflow-hidden rounded-2xl", "px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-4", "backdrop-blur-xl", dark ? "bg-white/3" : "bg-white/55"].join(" ");
}

function lensPill(dark: boolean, label: string, dotClass: string, selected?: boolean, ringClass?: string) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1",
        "text-xs font-semibold",
        dark ? "border-white/10 bg-white/6 text-white/82" : "border-black/10 bg-white text-slate-800",
        selected ? (dark ? `ring-2 ${ringClass ?? "ring-white/12"}` : "ring-2 ring-black/10") : "",
      ].join(" ")}
    >
      <span aria-hidden className={["h-2 w-2 rounded-full", dotClass].join(" ")} />
      {label}
    </span>
  );
}

/**
 * Visual affordance ONLY (no nested button).
 * Whole header is clickable + keyboard accessible.
 */
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
      {/* HEADER (click anywhere to toggle) */}
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
          dark ? "hover:bg-white/7" : "hover:bg-white/85",
          dark ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/14" : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10",
        ].join(" ")}
      >
        {/* Slim left rail */}
        <div className="pointer-events-none absolute inset-y-3 left-3 hidden w-[3px] rounded-full md:block">
          <div className={["h-full w-full rounded-full", "bg-gradient-to-b", pal.railA, pal.railB, dark ? "opacity-80" : "opacity-55"].join(" ")} />
          <div className={["absolute inset-0 rounded-full blur-lg", "bg-gradient-to-b", pal.railA, pal.railB, dark ? "opacity-25" : "opacity-16"].join(" ")} />
        </div>

        {/* soft ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className={["absolute -top-12 -left-16 h-44 w-44 rounded-full blur-3xl", pal.glowA].join(" ")} />
          <div className={["absolute -bottom-16 -right-16 h-52 w-52 rounded-full blur-3xl", pal.glowB].join(" ")} />
        </div>

        {/* right icon only when collapsed */}
        {!open ? (
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
            <Icon className={["h-10 w-10", dark ? "text-white/10" : "text-slate-900/8"].join(" ")} />
          </div>
        ) : null}

        <div className="relative pl-0 md:pl-3.5">
          <div className="flex flex-wrap items-center gap-3">
            {lensPill(dark, title, pal.dot, open, pal.pillRing)}
            <RowCTA dark={dark} open={open} />
          </div>

          <div className={["mt-2 text-sm", dark ? "text-white/70" : "text-slate-700"].join(" ")}>{subtitle}</div>
        </div>
      </div>

      {/* CONTENT */}
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
                {/* faint rail continuation */}
                <div className="pointer-events-none absolute inset-y-3 left-3 hidden w-[2px] rounded-full md:block">
                  <div className={["h-full w-full rounded-full", "bg-gradient-to-b", pal.railA, pal.railB, dark ? "opacity-50" : "opacity-30"].join(" ")} />
                </div>

                <div className="relative pl-0 md:pl-3.5">{children}</div>
              </div>
            ) : (
              <div className="relative pl-0 md:pl-3.5">
                {/* no wrapper surface — avoids card-in-card for Next steps */}
                <div className="pointer-events-none absolute -left-3 top-0 hidden h-full w-[2px] rounded-full md:block">
                  <div className={["h-full w-full rounded-full", "bg-gradient-to-b", pal.railA, pal.railB, dark ? "opacity-35" : "opacity-22"].join(" ")} />
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
        ? "from-violet-300/55 to-fuchsia-300/35"
        : "from-violet-500/45 to-fuchsia-500/30"
      : dark
      ? "from-lime-300/50 to-emerald-300/35"
      : "from-lime-500/40 to-emerald-500/28";

  return (
    <div className="mt-4 flex gap-3">
      <div className="relative w-[3px] shrink-0 overflow-hidden rounded-full">
        <div className={["absolute inset-0 bg-gradient-to-b", rail].join(" ")} />
        <div className={["absolute inset-0 blur-lg bg-gradient-to-b", rail, dark ? "opacity-25" : "opacity-16"].join(" ")} />
      </div>

      <div className="min-w-0">
        <div className={["text-[11px] font-semibold uppercase tracking-[0.16em]", dark ? "text-white/45" : "text-slate-500"].join(" ")}>Quote</div>
        <div className={["mt-1 text-sm leading-relaxed", dark ? "text-white/70" : "text-slate-700"].join(" ")}>“{quote}”</div>
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

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  void gradientLevel;

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
    const saved = safeJsonParse<{ value: CalibrationChoice }>(window.localStorage.getItem(INSIGHTS_CALIBRATION_KEY));
    if (saved?.value) setCalibration(saved.value);
  }, [mounted]);

  function setCalibrationAndPersist(next: CalibrationChoice) {
    setCalibration(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(INSIGHTS_CALIBRATION_KEY, JSON.stringify({ value: next }));
    }
  }

  const [storyExpanded, setStoryExpanded] = React.useState(false);
  const [sectionsOpen, setSectionsOpen] = React.useState(false);

  const [superpowersOpen, setSuperpowersOpen] = React.useState(false);
  const [timeTwinOpen, setTimeTwinOpen] = React.useState(false);
  const [nextStepsOpen, setNextStepsOpen] = React.useState(false);

  const narrativeText = dark ? "text-slate-200/88" : "text-slate-700";

  const calibrationOptions: CalibrationChoice[] = ["Mostly right", "Somewhat", "Not really"];

  function setTabAndSync(next: InsightsTab) {
    setTab(next);

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", next);
    params.delete("section");
    router.replace(`/main/insights?${params.toString()}`);
  }

  const tabLabel = TABS.find((t) => t.id === tab)?.label ?? (tab as string) ?? "Summary";

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

  return (
    <AppChrome themeId={themeId} setThemeId={setThemeId} gradientLevel={gradientLevel} setGradientLevel={setGradientLevel} orbSource="insights_orb" ambientCap={0.35}>
      <style jsx global>{`
        .el-word {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(1);
          letter-spacing: var(--el-ls, 0px);
          will-change: transform;
          transition: transform 160ms ease;
        }
        .el-word:hover {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(1.035);
        }
        .el-word:active {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(0.985);
        }
      `}</style>

      <div className="el-insights relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-5 md:px-8 md:pb-24 md:pt-7">
          {/* Header */}
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className={`text-2xl font-semibold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>Insights</div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1",
                    "text-xs font-semibold",
                    dark ? "border-white/10 bg-white/6 text-white/75" : "border-black/10 bg-white/80 text-slate-800",
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

          {tab === "summary" ? (
            <section className="mb-6">
              <div className="relative">
                {/* HERO GRID */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-start">
                  {/* Agentic intro */}
                  <div className="relative pt-3 md:pt-4">
                    <div className={`text-[24px] leading-snug md:text-[28px] ${dark ? "text-white" : "text-slate-900"}`}>{colorizeKeywords(dark, vm.summary.headline)}</div>

                    <div className="mt-3">
                      {!storyExpanded ? (
                        <div className="relative" style={fadeMaskStyle("story")}>
                          <p className={`text-[15px] leading-7 md:text-[16px] ${narrativeText}`}>{colorizeKeywords(dark, storyTextCollapsed || storyTextExpanded)}</p>
                        </div>
                      ) : (
                        <AnimatePresence initial={false}>
                          <motion.p
                            key="storyExpanded"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className={`text-[15px] leading-7 md:text-[16px] ${narrativeText}`}
                          >
                            {colorizeKeywords(dark, storyTextExpanded)}
                          </motion.p>
                        </AnimatePresence>
                      )}
                    </div>

                    {canToggleStory ? (
                      <div className="mt-3">
                        <button type="button" className={textAffordance(dark)} onClick={() => setStoryExpanded((v) => !v)}>
                          <span aria-hidden className="opacity-80">
                            {storyExpanded ? "▾" : "▸"}
                          </span>
                          {storyExpanded ? "Read less" : "Read more"}
                        </button>
                      </div>
                    ) : null}

                    {/* WANT THIS TO GET MORE SPECIFIC? (compact width) */}
                    {primaryUnlock?.items?.length ? (
                      <div className="mt-5">
                        <div className="flex justify-start">
                          <div
                            className={[
                              "relative w-full overflow-hidden rounded-[22px] border px-4 py-3",
                              "backdrop-blur-2xl",
                              "md:max-w-[420px]",
                              dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/80",
                            ].join(" ")}
                          >
                            <div className="pointer-events-none absolute inset-0">
                              <div className={["absolute -top-12 -right-14 h-40 w-40 rounded-full blur-3xl", dark ? "bg-amber-300/12" : "bg-amber-400/10"].join(" ")} />
                              <div className={["absolute -bottom-16 -left-14 h-44 w-44 rounded-full blur-3xl", dark ? "bg-rose-300/8" : "bg-rose-400/8"].join(" ")} />
                            </div>

                            <div className="relative">
                              <div className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Want this to get more specific?</div>

                              <div className={`mt-1 text-sm leading-relaxed ${dark ? "text-white/72" : "text-slate-700"}`}>Finish one more section and I’ll get way more specific.</div>

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
                      </div>
                    ) : null}
                  </div>

                  {/* Word cloud area */}
                  <div className="relative pt-3 md:pt-4">
                    <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/55" : "text-slate-600"}`}>Themes showing up</div>

                    <div className="relative mt-3">
                      <div className="relative">
                        {wordCloud.length ? (
                          <div className="flex flex-wrap gap-x-3 gap-y-2 leading-none">
                            {wordCloud.map((w) => {
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
                          <div className={`text-sm ${dark ? "text-white/70" : "text-slate-700"}`}>Nothing to map yet — answer a few questions and this will fill in.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className={`my-6 h-px ${dark ? "bg-white/10" : "bg-black/10"}`} />

                {/* Superpowers */}
                <LensSectionRow
                  dark={dark}
                  lensId="superpowers"
                  title="Superpowers"
                  subtitle={superDef.subtitle || "What you naturally do well when it matters."}
                  open={superpowersOpen}
                  onToggle={() => setSuperpowersOpen((v) => !v)}
                >
                  <div className={`text-sm leading-relaxed ${dark ? "text-white/72" : "text-slate-700"}`}>{superDef.body}</div>

                  {superDef.bullets?.length ? (
                    <ul className="mt-3 space-y-2">
                      {superDef.bullets.map((b, i) => (
                        <li key={`sp_b_${i}`} className="flex gap-2 text-sm">
                          <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                            •
                          </span>
                          <span className={dark ? "text-white/75" : "text-slate-700"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {superDef.quote ? <QuoteCallout dark={dark} tint="lime" quote={superDef.quote} /> : null}
                </LensSectionRow>

                {/* Time Twin */}
                <div className="mt-3">
                  <LensSectionRow
                    dark={dark}
                    lensId="timeTwin"
                    title="Time Twin"
                    subtitle={timeDef.subtitle || "A historical mirror — creative + technical + real-world impact."}
                    open={timeTwinOpen}
                    onToggle={() => setTimeTwinOpen((v) => !v)}
                  >
                    <div className={`text-sm leading-relaxed ${dark ? "text-white/72" : "text-slate-700"}`}>{timeDef.body}</div>

                    {timeDef.bullets?.length ? (
                      <ul className="mt-3 space-y-2">
                        {timeDef.bullets.map((b, i) => (
                          <li key={`tt_b_${i}`} className="flex gap-2 text-sm">
                            <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                              •
                            </span>
                            <span className={dark ? "text-white/75" : "text-slate-700"}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {timeDef.quote ? <QuoteCallout dark={dark} tint="violet" quote={timeDef.quote} /> : null}
                  </LensSectionRow>
                </div>

                {/* Next steps (NO inner wash to avoid card-in-card) */}
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
                      <NextStepsStack dark={dark} useLocal={mounted} definition={nextSteps} variant="embedded" collapsible={false} defaultOpen />
                    </LensSectionRow>
                  </div>
                ) : null}

                {/* Quick check */}
                <div className="mt-6">
                  <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/50" : "text-slate-500"}`}>Quick check</div>

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
                            dark ? "border-white/10 bg-white/5 text-white/75 hover:bg-white/10" : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                            selected
                              ? dark
                                ? "bg-white/18 text-white border-white/18 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_55px_rgba(0,0,0,0.45)] ring-2 ring-white/25"
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

                  <div className={`mt-2 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>(We’ll use this later to recalibrate Insights.)</div>
                </div>
              </div>
            </section>
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
                <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>{TABS.find((t) => t.id === tab)?.label ?? "Section"}</div>
                <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>This section is scaffolded. We’ll implement it next after Summary is locked.</div>
              </div>
            </section>
          )}
        </main>

        {/* Mobile “Sections” pill */}
        <div className="fixed inset-x-0 bottom-[78px] z-40 md:hidden">
          <div className="pointer-events-auto px-4 pb-3">
            <div className="mx-auto flex max-w-5xl justify-center">
              <button
                type="button"
                className={[
                  "inline-flex items-center gap-2",
                  "rounded-full border px-4 py-2.5",
                  "backdrop-blur-xl",
                  "text-sm font-semibold",
                  "shadow-[0_18px_60px_rgba(0,0,0,0.22)]",
                  dark ? "border-white/12 bg-slate-950/35 text-white/88 hover:bg-slate-950/45" : "border-black/10 bg-white/75 text-slate-900 hover:bg-white",
                ].join(" ")}
                onClick={() => setSectionsOpen(true)}
              >
                <span aria-hidden className="opacity-85">
                  ☰
                </span>
                <span>Sections</span>
                <span className={dark ? "text-white/55" : "text-slate-600"}>· {tabLabel}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sections modal */}
        <AnimatePresence>
          {sectionsOpen ? (
            <motion.div className="fixed inset-0 z-[60] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/28" onClick={() => setSectionsOpen(false)} aria-hidden />

              <motion.div
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 22, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-x-0 bottom-0 px-4 pb-4"
              >
                <div
                  className={[
                    "relative mx-auto w-full max-w-[520px]",
                    "overflow-hidden rounded-[26px] border",
                    "backdrop-blur-2xl",
                    dark ? "border-white/12 bg-slate-950/40" : "border-black/10 bg-white/90",
                    "shadow-[0_28px_95px_rgba(0,0,0,0.45)]",
                  ].join(" ")}
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="relative px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className={`text-base font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                          Sections
                          <span className={`ml-2 text-sm font-semibold ${dark ? "text-white/55" : "text-slate-500"}`}>· {tabLabel}</span>
                        </div>
                        <div className={`mt-1 text-sm ${dark ? "text-white/60" : "text-slate-600"}`}>Jump anywhere — you won’t lose your place.</div>
                      </div>

                      <button type="button" className={pillButton(dark)} onClick={() => setSectionsOpen(false)}>
                        Close
                      </button>
                    </div>

                    <div
                      className={["mt-4 overflow-hidden rounded-2xl border", "backdrop-blur-xl", dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/80"].join(" ")}
                      style={{ maxHeight: "56vh" }}
                    >
                      <div className="max-h-[56vh] overflow-auto">
                        {TABS.map((t) => {
                          const selected = t.id === tab;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              className={[
                                "relative w-full text-left px-4 py-3",
                                "transition active:scale-[0.995]",
                                dark ? "text-white/88 hover:bg-white/6" : "text-slate-900 hover:bg-black/2",
                                selected ? (dark ? "bg-white/8" : "bg-black/2") : "",
                              ].join(" ")}
                              onClick={() => {
                                setTabAndSync(t.id);
                                setSectionsOpen(false);
                              }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 text-sm font-semibold">
                                    {accentDot(t.id)}
                                    <span>{t.label}</span>
                                  </div>

                                  {t.blurb ? <div className={`mt-0.5 text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>{t.blurb}</div> : null}
                                </div>

                                <div
                                  className={[
                                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                    dark ? "border-white/10 bg-white/6 text-white/60" : "border-black/10 bg-white text-slate-600",
                                    selected ? (dark ? "text-white/80" : "text-slate-800") : "",
                                  ].join(" ")}
                                  aria-hidden
                                >
                                  {selected ? "You are here" : "Open"}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
