// src/app/main/insights/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import {
  buildInsightsViewModel,
  type InsightsTab,
  type WordCloudItem,
} from "./app/buildInsightsViewModel";

import { NextStepsStack } from "@/app/main/components/nextSteps/NextStepsStack";
import { getNextStepsDefinition } from "@/app/main/content/nextSteps";

/* =============================================================================
   Tabs
   ============================================================================= */

type TabDef = { id: InsightsTab; label: string; blurb?: string };

const TABS: TabDef[] = [
  { id: "summary", label: "Summary", blurb: "Your read so far" },
  { id: "motivations", label: "Motivations", blurb: "What pulls you" },
  { id: "strengths", label: "Strengths", blurb: "How you operate" },
  { id: "skills", label: "Skills", blurb: "What you can do" },
  { id: "superpowers", label: "Superpowers", blurb: "What you’re good at" },
  { id: "doppelganger", label: "Time Twin", blurb: "A mirror / archetype" },
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
  if (v === "superpowers") return "superpowers";
  if (v === "motivations") return "motivations";
  if (v === "strengths") return "strengths";
  if (v === "skills") return "skills";
  if (v === "doppelganger") return "doppelganger";
  if (v.includes("doppel")) return "doppelganger";
  if (v.includes("time") && v.includes("twin")) return "doppelganger";
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

type WashKind = "primary" | "signals" | "suggests" | "watchouts";

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function sectionTint(dark: boolean, kind: WashKind) {
  if (!dark) {
    if (kind === "primary") return "bg-fuchsia-500/8";
    if (kind === "signals") return "bg-sky-500/8";
    if (kind === "suggests") return "bg-amber-500/10";
    return "bg-emerald-500/9";
  }

  if (kind === "primary") return "bg-fuchsia-200/10";
  if (kind === "signals") return "bg-sky-200/10";
  if (kind === "suggests") return "bg-amber-200/11";
  return "bg-emerald-200/10";
}

function sectionRing(dark: boolean) {
  return dark ? "ring-1 ring-white/10" : "ring-1 ring-black/8";
}

function accentBar(dark: boolean, kind: WashKind) {
  if (!dark) {
    if (kind === "primary") return "bg-fuchsia-500/45";
    if (kind === "signals") return "bg-sky-500/45";
    if (kind === "suggests") return "bg-amber-500/55";
    return "bg-emerald-500/50";
  }

  if (kind === "primary") return "bg-fuchsia-200/45";
  if (kind === "signals") return "bg-sky-200/45";
  if (kind === "suggests") return "bg-amber-200/55";
  return "bg-emerald-200/50";
}

function pillButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-xs font-semibold transition active:scale-95",
    dark
      ? "border-white/10 bg-white/6 text-white/78 hover:bg-white/10"
      : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function chipClasses(dark: boolean, kind: WashKind) {
  if (!dark) {
    if (kind === "suggests")
      return "border-amber-500/20 bg-amber-500/10 text-amber-900";
    if (kind === "watchouts")
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-900";
    return "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-900";
  }

  if (kind === "suggests")
    return "border-amber-200/18 bg-amber-200/10 text-amber-100";
  if (kind === "watchouts")
    return "border-emerald-200/18 bg-emerald-200/10 text-emerald-100";
  return "border-fuchsia-200/18 bg-fuchsia-200/10 text-fuchsia-100";
}

function fadeMaskStyle(mode: "story" | "suggests"): React.CSSProperties {
  // Used only in collapsed state; if mask isn't supported it simply won't fade.
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

  return [
    dark ? paletteDark[i] : paletteLight[i],
    dark ? "drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function wordChaosVars(term: string, weight: number): CSSVars {
  const h = hashString(term.toLowerCase());
  const w = clamp01(weight);
  const mode = h % 10;
  const allow = mode < 4 && w < 0.95;

  const rot = allow ? ((h % 5) - 2) * 1 : 0; // -2..+2 deg
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
  return dark
    ? "bg-white/10 ring-1 ring-white/10"
    : "bg-black/5 ring-1 ring-black/8";
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
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const initialTabFromUrl = React.useMemo<InsightsTab>(() => {
    const raw = searchParams?.get("tab") ?? searchParams?.get("section");
    return coerceTab(raw);
  }, [searchParams]);

  const [tab, setTab] = React.useState<InsightsTab>(initialTabFromUrl);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const vm = React.useMemo(
    () => buildInsightsViewModel(tab, { useLocal: mounted }),
    [tab, mounted]
  );

  const [calibration, setCalibration] =
    React.useState<CalibrationChoice | null>(null);

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
  const [suggestsExpanded, setSuggestsExpanded] = React.useState(false);

  const [sectionsOpen, setSectionsOpen] = React.useState(false);

  const cardShadow = dark
    ? "shadow-[0_28px_95px_rgba(0,0,0,0.70)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.16)]";

  const narrativeText = dark ? "text-slate-200/88" : "text-slate-700";

  const calibrationOptions: CalibrationChoice[] = [
    "Mostly right",
    "Somewhat",
    "Not really",
  ];

  function setTabAndSync(next: InsightsTab) {
    setTab(next);

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", next);
    params.delete("section");
    router.replace(`/main/insights?${params.toString()}`);
  }

  const tabLabel =
    TABS.find((t) => t.id === tab)?.label ?? (tab as string) ?? "Summary";

  const wordCloudRaw = vm.summary.wordCloud;
  const wordCloud = React.useMemo<WordCloudItem[]>(
    () => wordCloudRaw ?? [],
    [wordCloudRaw]
  );
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
    const parts = storyExpandedItems
      .map((s) => (s ?? "").trim())
      .filter(Boolean);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }, [storyExpandedItems]);

  const canToggleStory = storyExpandedItems.length > 0 && story.length > 2;

  const suggestsItems = vm.summary.suggests ?? [];
  const suggestsCollapsedCount = 2; // ensures "Read more" shows up even when suggestsItems is short-ish
  const suggestsShort = suggestsItems.slice(0, suggestsCollapsedCount);
  const suggestsLong = suggestsItems;

  const suggestsCanExpand = suggestsItems.length > suggestsCollapsedCount;
  const suggestsToShow = suggestsExpanded ? suggestsLong : suggestsShort;

  const nextStepsBase = React.useMemo(
    () => getNextStepsDefinition("insights.summary"),
    []
  );

  // Override the bridge line here (so we don't have to change registry yet)
  const nextSteps = React.useMemo(() => {
    if (!nextStepsBase) return null;
    return { ...nextStepsBase, bridgeLine: "" };
  }, [nextStepsBase]);

  const missingProfileSignal =
    (vm?.summary?.primaryUnlock?.items?.length ?? 0) > 0;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="insights_orb"
      ambientCap={0.35}
    >
      <style jsx global>{`
        .el-word {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg))
            scale(1);
          letter-spacing: var(--el-ls, 0px);
          will-change: transform;
          transition: transform 160ms ease;
        }
        .el-word:hover {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg))
            scale(1.035);
        }
        .el-word:active {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg))
            scale(0.985);
        }

        /* ============================================================
           Insights polish overrides (scoped)
           - Lighten "Log your result" style (common dialog classes)
           - De-box NextSteps a bit (reduce inner “boxed UI” feeling)
           ============================================================ */

        /* Softer overlays (covers many Tailwind overlay variants) */
        .el-insights
          :where(
            .bg-black\\/80,
            .bg-black\\/75,
            .bg-black\\/70,
            .bg-black\\/65,
            .bg-black\\/60
          ) {
          background-color: rgba(0, 0, 0, 0.38) !important;
        }

        /* Brighter frosted panels (covers common dark modal surfaces) */
        .el-insights
          :where(
            .bg-slate-950\\/95,
            .bg-slate-950\\/90,
            .bg-slate-950\\/85,
            .bg-slate-950\\/80,
            .bg-slate-950\\/75,
            .bg-slate-950\\/70,
            .bg-slate-900\\/90,
            .bg-slate-900\\/80,
            .bg-slate-900\\/75,
            .bg-black\\/55,
            .bg-black\\/60
          ) {
          background-color: rgba(255, 255, 255, 0.09) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
        }

        /* Nudge borders toward “glass” instead of “box” */
        .el-insights
          :where(
            .border-white\\/20,
            .border-white\\/18,
            .border-white\\/15,
            .border-white\\/12,
            .border-white\\/10
          ) {
          border-color: rgba(255, 255, 255, 0.16) !important;
        }

        /* Inputs inside dialogs often look too cave-like; lighten a touch */
        .el-insights
          :where(.bg-white\\/5, .bg-white\\/6, .bg-white\\/8, .bg-white\\/10) {
          background-color: rgba(255, 255, 255, 0.07);
        }

        /* “Boxed UI” inside NextSteps (steps containers / inner panels) */
        .el-insights .el-nextsteps :where(.rounded-2xl.border, .rounded-3xl.border) {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .el-insights .el-nextsteps :where(.bg-white\\/10, .bg-white\\/12, .bg-white\\/15) {
          background-color: rgba(255, 255, 255, 0.07) !important;
        }
        .el-insights
          .el-nextsteps
          :where(.ring-1.ring-white\\/10, .ring-1.ring-white\\/12, .ring-1.ring-white\\/15) {
          box-shadow: none !important;
        }
      `}</style>

      <div className="el-insights relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-5 md:px-8 md:pb-24 md:pt-7">
          {/* Header */}
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div
                className={`text-2xl font-semibold tracking-tight ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                Insights
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1",
                    "text-xs font-semibold",
                    dark
                      ? "border-white/10 bg-white/6 text-white/75"
                      : "border-black/10 bg-white/80 text-slate-800",
                  ].join(" ")}
                >
                  <span aria-hidden className="opacity-85">
                    ✦
                  </span>
                  <span>What it all means</span>
                </span>
              </div>
            </div>

            {/* Desktop pills */}
            <div className="hidden md:flex md:max-w-[70%] md:flex-wrap md:justify-end md:gap-2">
              {TABS.map((t) => {
                const selected = t.id === tab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={[
                      "inline-flex items-center justify-center",
                      "rounded-full border px-3.5 py-2",
                      "text-sm font-semibold transition active:scale-95",
                      dark
                        ? "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                        : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                      selected
                        ? dark
                          ? "bg-white/18 text-white border-white/18 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_55px_rgba(0,0,0,0.45)]"
                          : "bg-white text-slate-900 border-slate-200 shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
                        : "",
                    ].join(" ")}
                    aria-current={selected ? "page" : undefined}
                    onClick={() => setTabAndSync(t.id)}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================
              SUMMARY TAB
             ========================= */}
          {tab === "summary" ? (
            <section className="mb-6">
              {/* Removed the big outer “stage box”.
                  Keep the cinematic glows as a backdrop only. */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 -z-10">
                  <div
                    className={[
                      "absolute -top-16 -left-16 h-80 w-80 rounded-full blur-3xl",
                      dark ? "bg-fuchsia-400/10" : "bg-fuchsia-400/8",
                    ].join(" ")}
                  />
                  <div
                    className={[
                      "absolute -bottom-20 -right-20 h-96 w-96 rounded-full blur-3xl",
                      dark ? "bg-sky-400/10" : "bg-sky-400/8",
                    ].join(" ")}
                  />
                </div>

                {/* HERO: agentic paragraph + word cloud (desktop side-by-side) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.15fr_0.85fr] md:items-start">
                  {/* Agentic intro */}
                  <div
                    className={[
                      "relative overflow-hidden rounded-3xl px-5 py-4",
                      sectionRing(dark),
                      dark ? "bg-white/5" : "bg-white/80",
                      dark
                        ? "shadow-[0_22px_80px_rgba(0,0,0,0.35)]"
                        : "shadow-[0_14px_40px_rgba(0,0,0,0.12)]",
                      "backdrop-blur-xl",
                    ].join(" ")}
                  >
                    <div className="relative">
                      <div
                        className={`text-[22px] leading-snug md:text-[26px] ${
                          dark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {vm.summary.headline}
                      </div>

                      <div className="mt-3">
                        {!storyExpanded ? (
                          <div className="relative" style={fadeMaskStyle("story")}>
                            <p
                              className={`text-[15px] leading-7 md:text-[16px] ${narrativeText}`}
                            >
                              {storyTextCollapsed || storyTextExpanded}
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
                              className={`text-[15px] leading-7 md:text-[16px] ${narrativeText}`}
                            >
                              {storyTextExpanded}
                            </motion.p>
                          </AnimatePresence>
                        )}
                      </div>

                      {canToggleStory ? (
                        <div className="mt-3">
                          <button
                            type="button"
                            className={pillButton(dark)}
                            onClick={() => setStoryExpanded((v) => !v)}
                          >
                            <span aria-hidden className="opacity-85">
                              {storyExpanded ? "▾" : "▸"}
                            </span>
                            {storyExpanded ? "Read less" : "Read more"}
                          </button>
                        </div>
                      ) : null}

                      {/* PRIMARY CTA */}
                      {primaryUnlock?.items?.length ? (
                        <div
                          className={[
                            "mt-4 relative overflow-hidden rounded-3xl px-4 py-3 sm:px-5 sm:py-3.5",
                            sectionTint(dark, "primary"),
                            sectionRing(dark),
                            "backdrop-blur-xl",
                          ].join(" ")}
                        >
                          <div className="pointer-events-none absolute inset-0">
                            <div
                              className={[
                                "absolute left-0 top-0 h-full w-1",
                                accentBar(dark, "primary"),
                              ].join(" ")}
                            />
                          </div>

                          <div className="relative">
                            <div
                              className={`text-sm font-semibold ${
                                dark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {missingProfileSignal
                                ? "Before this gets real…"
                                : primaryUnlock.title ??
                                  "If you want this to get sharper…"}
                            </div>

                            <div
                              className={`mt-1 text-sm leading-relaxed ${
                                dark ? "text-white/78" : "text-slate-700"
                              }`}
                            >
                              Finish a little more of your profile (Motivations,
                              Strengths, Skills) and this becomes noticeably more
                              personal — less “pretty accurate,” more “yeah, that’s me.”
                            </div>

                            <div className="mt-2.5 flex flex-wrap gap-2">
                              {primaryUnlock.items.slice(0, 3).map((it) =>
                                it.href ? (
                                  <button
                                    key={it.id}
                                    type="button"
                                    className={[
                                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                                      "text-xs font-semibold transition active:scale-95",
                                      dark
                                        ? "border-white/12 bg-white/10 text-white/92 hover:bg-white/14"
                                        : "border-black/10 bg-white text-slate-900 hover:bg-white",
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
                      ) : null}
                    </div>
                  </div>

                  {/* Word cloud (NO pill / NO description — cloud speaks for itself) */}
                  <div
                    className={[
                      "relative overflow-hidden rounded-3xl px-5 py-4",
                      sectionTint(dark, "signals"),
                      sectionRing(dark),
                      "backdrop-blur-xl",
                      dark
                        ? "shadow-[0_22px_80px_rgba(0,0,0,0.28)]"
                        : "shadow-[0_14px_40px_rgba(0,0,0,0.12)]",
                    ].join(" ")}
                  >
                    <div className="pointer-events-none absolute inset-0">
                      <div
                        className={[
                          "absolute left-0 top-0 h-full w-1",
                          accentBar(dark, "signals"),
                        ].join(" ")}
                      />
                    </div>

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
                                  isTop
                                    ? ["rounded-full px-2.5 py-1", highlightWrap(dark)].join(
                                        " "
                                      )
                                    : "",
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
                        <div
                          className={`text-sm ${
                            dark ? "text-white/70" : "text-slate-700"
                          }`}
                        >
                          Nothing to map yet — answer a few questions and this will fill in.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className={`my-6 h-px ${dark ? "bg-white/10" : "bg-black/10"}`} />

                {/* WHAT THIS SUGGESTS (agentic, fade + Read more under content) */}
                <div
                  className={[
                    "relative overflow-hidden rounded-3xl px-5 py-4",
                    sectionTint(dark, "suggests"),
                    sectionRing(dark),
                    "backdrop-blur-xl",
                    dark
                      ? "shadow-[0_18px_70px_rgba(0,0,0,0.22)]"
                      : "shadow-[0_14px_40px_rgba(0,0,0,0.12)]",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div
                      className={[
                        "absolute left-0 top-0 h-full w-1",
                        accentBar(dark, "suggests"),
                      ].join(" ")}
                    />
                  </div>

                  <div className="relative">
                    <div className="min-w-0">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
                          "text-xs font-semibold",
                          chipClasses(dark, "suggests"),
                        ].join(" ")}
                      >
                        <span aria-hidden className="opacity-90">
                          🧭
                        </span>
                        <span>What this suggests</span>
                      </span>

                      <div
                        className={`mt-2 text-sm leading-relaxed ${
                          dark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        A directional read — something you can test in real life.
                      </div>
                    </div>

                    <div className="mt-4">
                      {!suggestsExpanded ? (
                        <div className="relative" style={fadeMaskStyle("suggests")}>
                          <div className="space-y-3">
                            {suggestsToShow.map((it) => (
                              <p
                                key={it.id}
                                className={`text-sm leading-relaxed ${
                                  dark ? "text-slate-200/88" : "text-slate-700"
                                }`}
                              >
                                {it.text}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <AnimatePresence initial={false}>
                          <motion.div
                            key="suggestsExpanded"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-3"
                          >
                            {suggestsToShow.map((it) => (
                              <p
                                key={it.id}
                                className={`text-sm leading-relaxed ${
                                  dark ? "text-slate-200/88" : "text-slate-700"
                                }`}
                              >
                                {it.text}
                              </p>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>

                    {/* CTA now sits under the faded content, left-aligned */}
                    {suggestsCanExpand ? (
                      <div className="mt-3">
                        <button
                          type="button"
                          className={pillButton(dark)}
                          onClick={() => setSuggestsExpanded((v) => !v)}
                        >
                          <span aria-hidden className="opacity-85">
                            {suggestsExpanded ? "▾" : "▸"}
                          </span>
                          {suggestsExpanded ? "Read less" : "Read more"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* WATCH-OUTS */}
                <div className="mt-6">
                  <div
                    className={[
                      "relative overflow-hidden rounded-3xl px-5 py-4",
                      sectionTint(dark, "watchouts"),
                      sectionRing(dark),
                      "backdrop-blur-xl",
                      dark
                        ? "shadow-[0_18px_70px_rgba(0,0,0,0.22)]"
                        : "shadow-[0_14px_40px_rgba(0,0,0,0.12)]",
                    ].join(" ")}
                  >
                    <div className="pointer-events-none absolute inset-0">
                      <div
                        className={[
                          "absolute left-0 top-0 h-full w-1",
                          accentBar(dark, "watchouts"),
                        ].join(" ")}
                      />
                    </div>

                    <div className="relative">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
                          "text-xs font-semibold",
                          chipClasses(dark, "watchouts"),
                        ].join(" ")}
                      >
                        <span aria-hidden className="opacity-90">
                          🛟
                        </span>
                        <span>Watch-outs</span>
                      </span>

                      <div
                        className={`mt-2 text-sm leading-relaxed ${
                          dark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        Guardrails — no shame, just reality.
                      </div>

                      <ul className="mt-4 space-y-3">
                        {vm.summary.tripUps.map((e) => (
                          <li key={e.id} className="flex items-start gap-3">
                            <span
                              aria-hidden
                              className={`mt-2 inline-block h-1.5 w-1.5 rounded-full ${
                                dark ? "bg-white/35" : "bg-slate-900/35"
                              }`}
                            />
                            <div className="min-w-0">
                              <div
                                className={`text-sm font-semibold ${
                                  dark ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {e.title}
                              </div>
                              <div
                                className={`mt-1 text-sm leading-relaxed ${
                                  dark ? "text-white/70" : "text-slate-700"
                                }`}
                              >
                                {e.text}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* TINY TASK → ACTION (standardized)
                    - bridge line removed via override above */}
                {nextSteps ? (
                  <div className="el-nextsteps mt-6">
                    <NextStepsStack
                      dark={dark}
                      useLocal={mounted}
                      definition={nextSteps}
                      heading=""
                      subheading=""
                    />
                  </div>
                ) : null}

                {/* Quick check */}
                <div className="mt-6">
                  <div
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      dark ? "text-white/50" : "text-slate-500"
                    }`}
                  >
                    Quick check
                  </div>

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
                            dark
                              ? "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                              : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
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
                            {selected
                              ? "✓"
                              : opt === "Mostly right"
                              ? "👍"
                              : opt === "Somewhat"
                              ? "😐"
                              : "👎"}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`mt-2 text-xs ${
                      dark ? "text-white/45" : "text-slate-500"
                    }`}
                  >
                    (We’ll use this later to recalibrate Insights.)
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="mb-6">
              <div
                className={[
                  "rounded-[28px] px-5 py-5",
                  theme.cardBgClass,
                  cardShadow,
                  "backdrop-blur-xl",
                  dark ? "text-white/80 bg-slate-950/25" : "text-slate-800",
                ].join(" ")}
              >
                <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>
                  {TABS.find((t) => t.id === tab)?.label ?? "Section"}
                </div>
                <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                  This section is scaffolded. We’ll implement it next after Summary is
                  locked.
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Mobile “Sections” pill (centered) */}
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
                  dark
                    ? "border-white/12 bg-slate-950/35 text-white/88 hover:bg-slate-950/45"
                    : "border-black/10 bg-white/75 text-slate-900 hover:bg-white",
                ].join(" ")}
                onClick={() => setSectionsOpen(true)}
              >
                <span aria-hidden className="opacity-85">
                  ☰
                </span>
                <span>Sections</span>
                <span className={dark ? "text-white/55" : "text-slate-600"}>
                  · {tabLabel}
                </span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {sectionsOpen ? (
            <motion.div
              className="fixed inset-0 z-[60] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Softer overlay */}
              <div
                className="absolute inset-0 bg-black/28"
                onClick={() => setSectionsOpen(false)}
                aria-hidden
              />

              {/* Centered sheet */}
              <motion.div
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 22, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-x-0 bottom-0 px-4 pb-4"
              >
                <div
                  className={[
                    "relative mx-auto w-full max-w-[640px]",
                    "overflow-hidden rounded-[28px] border",
                    "backdrop-blur-2xl",
                    dark
                      ? "border-white/12 bg-slate-950/40"
                      : "border-black/10 bg-white/90",
                    "shadow-[0_28px_95px_rgba(0,0,0,0.45)]",
                  ].join(" ")}
                  role="dialog"
                  aria-modal="true"
                >
                  {/* gentle color glow */}
                  <div className="pointer-events-none absolute inset-0">
                    <div
                      className={[
                        "absolute -top-20 -left-24 h-64 w-64 rounded-full blur-3xl",
                        dark ? "bg-fuchsia-400/14" : "bg-fuchsia-400/10",
                      ].join(" ")}
                    />
                    <div
                      className={[
                        "absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl",
                        dark ? "bg-sky-400/14" : "bg-sky-400/10",
                      ].join(" ")}
                    />
                  </div>

                  <div className="relative px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div
                          className={`text-base font-semibold ${
                            dark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          Sections
                          <span
                            className={`ml-2 text-sm font-semibold ${
                              dark ? "text-white/55" : "text-slate-500"
                            }`}
                          >
                            · {tabLabel}
                          </span>
                        </div>
                        <div
                          className={`mt-1 text-sm ${
                            dark ? "text-white/60" : "text-slate-600"
                          }`}
                        >
                          Jump anywhere — you won’t lose your place.
                        </div>
                      </div>

                      <button
                        type="button"
                        className={pillButton(dark)}
                        onClick={() => setSectionsOpen(false)}
                      >
                        Close
                      </button>
                    </div>

                    {/* Unified menu panel (less “stack of boxes”) */}
                    <div
                      className={[
                        "mt-4 overflow-hidden rounded-2xl border",
                        "backdrop-blur-xl",
                        dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/80",
                      ].join(" ")}
                      style={{ maxHeight: "62vh" }}
                    >
                      <div className="max-h-[62vh] overflow-auto">
                        {TABS.map((t, idx) => {
                          const selected = t.id === tab;
                          const isLast = idx === TABS.length - 1;

                          return (
                            <button
                              key={t.id}
                              type="button"
                              className={[
                                "relative w-full text-left",
                                "px-4 py-3.5",
                                "transition active:scale-[0.995]",
                                dark
                                  ? "text-white/88 hover:bg-white/6"
                                  : "text-slate-900 hover:bg-black/2",
                                !isLast
                                  ? dark
                                    ? "border-b border-white/10"
                                    : "border-b border-black/10"
                                  : "",
                                selected ? (dark ? "bg-white/8" : "bg-black/2") : "",
                              ].join(" ")}
                              onClick={() => {
                                setTabAndSync(t.id);
                                setSectionsOpen(false);
                              }}
                            >
                              {/* Selected accent rail */}
                              {selected ? (
                                <span
                                  aria-hidden
                                  className={[
                                    "absolute left-0 top-0 h-full w-1.5",
                                    "rounded-r-full",
                                    "bg-fuchsia-300/65",
                                  ].join(" ")}
                                />
                              ) : null}

                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold">
                                    {t.label}
                                  </div>
                                  {t.blurb ? (
                                    <div
                                      className={`mt-0.5 text-xs ${
                                        dark ? "text-white/55" : "text-slate-600"
                                      }`}
                                    >
                                      {t.blurb}
                                    </div>
                                  ) : null}
                                </div>

                                <div
                                  className={[
                                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                    dark
                                      ? "border-white/10 bg-white/6 text-white/60"
                                      : "border-black/10 bg-white text-slate-600",
                                    selected
                                      ? dark
                                        ? "text-white/80"
                                        : "text-slate-800"
                                      : "",
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

                    <div
                      className={`mt-3 text-xs ${
                        dark ? "text-white/45" : "text-slate-500"
                      }`}
                    >
                      Tip: you can always come back here — nothing gets “lost.”
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
