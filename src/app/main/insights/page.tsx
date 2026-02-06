// src/app/main/insights/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

/* =============================================================================
   Tabs
   ============================================================================= */

type TabDef = { id: InsightsTab; label: string };

const TABS: TabDef[] = [
  { id: "summary", label: "Summary" },
  { id: "superpowers", label: "Superpowers" },
  { id: "motivations", label: "Motivations" },
  { id: "strengths", label: "Strengths" },
  { id: "skills", label: "Skills" },
  { id: "doppelganger", label: "Time Twin" },
];

type CalibrationChoice = "Mostly right" | "Somewhat" | "Not really";

/* =============================================================================
   Storage keys (local only)
   ============================================================================= */

const INSIGHTS_CALIBRATION_KEY = "everleap.insights.calibration.v1";
const INSIGHTS_EXPERIMENTS_KEY = "everleap.insights.experiments.v1";

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

function pillBase(dark: boolean) {
  return [
    "inline-flex items-center justify-center",
    "rounded-full border",
    "px-3.5 py-2",
    "text-sm font-semibold",
    "transition active:scale-95",
    dark
      ? "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function pillSelected(dark: boolean) {
  return dark
    ? "bg-white/18 text-white border-white/18 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_55px_rgba(0,0,0,0.45)]"
    : "bg-white text-slate-900 border-slate-200 shadow-[0_14px_40px_rgba(0,0,0,0.12)]";
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type LoggedExperiment = {
  id: string;
  createdAt: number;
  title?: string;
  tried: string;
  feel: "energized" | "neutral" | "drained";
  learned?: string;
};

type WashKind = "primary" | "signals" | "suggests" | "watchouts" | "experiment";

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/**
 * The new rule:
 * - NO gradients per section.
 * - Each section gets one flat pastel tint (translucent).
 * - One subtle ring for definition.
 */
function sectionTint(dark: boolean, kind: WashKind) {
  if (!dark) {
    if (kind === "primary") return "bg-fuchsia-500/8";
    if (kind === "signals") return "bg-sky-500/8";
    if (kind === "suggests") return "bg-amber-500/10";
    if (kind === "watchouts") return "bg-emerald-500/9";
    return "bg-violet-500/8";
  }

  if (kind === "primary") return "bg-fuchsia-200/10";
  if (kind === "signals") return "bg-sky-200/10";
  if (kind === "suggests") return "bg-amber-200/11";
  if (kind === "watchouts") return "bg-emerald-200/10";
  return "bg-violet-200/10";
}

function sectionRing(dark: boolean) {
  return dark ? "ring-1 ring-white/10" : "ring-1 ring-black/8";
}

function accentBar(dark: boolean, kind: WashKind) {
  if (!dark) {
    if (kind === "primary") return "bg-fuchsia-500/45";
    if (kind === "signals") return "bg-sky-500/45";
    if (kind === "suggests") return "bg-amber-500/55";
    if (kind === "watchouts") return "bg-emerald-500/50";
    return "bg-violet-500/45";
  }

  if (kind === "primary") return "bg-fuchsia-200/45";
  if (kind === "signals") return "bg-sky-200/45";
  if (kind === "suggests") return "bg-amber-200/55";
  if (kind === "watchouts") return "bg-emerald-200/50";
  return "bg-violet-200/45";
}

function chipClasses(dark: boolean, kind: WashKind) {
  // chip is small; tint is on the section. keep chip crisp.
  if (!dark) {
    if (kind === "signals")
      return "border-sky-500/20 bg-sky-500/10 text-sky-700";
    if (kind === "suggests")
      return "border-amber-500/20 bg-amber-500/10 text-amber-800";
    if (kind === "watchouts")
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-800";
    if (kind === "experiment")
      return "border-violet-500/20 bg-violet-500/10 text-violet-800";
    return "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-800";
  }

  if (kind === "signals")
    return "border-sky-200/18 bg-sky-200/10 text-sky-100";
  if (kind === "suggests")
    return "border-amber-200/18 bg-amber-200/10 text-amber-100";
  if (kind === "watchouts")
    return "border-emerald-200/18 bg-emerald-200/10 text-emerald-100";
  if (kind === "experiment")
    return "border-violet-200/18 bg-violet-200/10 text-violet-100";
  return "border-fuchsia-200/18 bg-fuchsia-200/10 text-fuchsia-100";
}

function relativeTime(ts: number) {
  const d = Date.now() - ts;
  const min = Math.floor(d / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
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

function SectionHeader({
  dark,
  kind,
  title,
  subtitle,
  icon,
}: {
  dark: boolean;
  kind: WashKind;
  title: string;
  subtitle?: string;
  icon: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <span
          className={[
            "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
            "text-xs font-semibold",
            chipClasses(dark, kind),
          ].join(" ")}
        >
          <span aria-hidden className="opacity-90">
            {icon}
          </span>
          <span>{title}</span>
        </span>

        {subtitle ? (
          <div
            className={`mt-2 text-sm leading-relaxed ${
              dark ? "text-white/70" : "text-slate-700"
            }`}
          >
            {subtitle}
          </div>
        ) : null}
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

  const [showAllStory, setShowAllStory] = React.useState(false);

  const [experiments, setExperiments] = React.useState<LoggedExperiment[]>([]);
  const [logOpen, setLogOpen] = React.useState(false);

  const [logTried, setLogTried] = React.useState("");
  const [logFeel, setLogFeel] = React.useState<
    LoggedExperiment["feel"] | null
  >(null);
  const [logLearned, setLogLearned] = React.useState("");

  React.useEffect(() => {
    if (!mounted) return;
    const parsed = safeJsonParse<LoggedExperiment[]>(
      window.localStorage.getItem(INSIGHTS_EXPERIMENTS_KEY)
    );
    if (Array.isArray(parsed)) setExperiments(parsed);
  }, [mounted]);

  function persistExperiments(next: LoggedExperiment[]) {
    setExperiments(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        INSIGHTS_EXPERIMENTS_KEY,
        JSON.stringify(next.slice(0, 25))
      );
    }
  }

  function openLogModal() {
    setLogTried("");
    setLogFeel(null);
    setLogLearned("");
    setLogOpen(true);
  }

  function closeLogModal() {
    setLogOpen(false);
  }

  function saveLog() {
    const tried = (logTried ?? "").trim();
    if (!tried || !logFeel) return;

    const next: LoggedExperiment[] = [
      {
        id: `exp_${Date.now()}`,
        createdAt: Date.now(),
        title: vm.summary.experiment?.title ?? undefined,
        tried,
        feel: logFeel,
        learned: (logLearned ?? "").trim() || undefined,
      },
      ...experiments,
    ];

    persistExperiments(next);
    setLogOpen(false);
  }

  const lastExperiment = experiments[0] ?? null;

  const cardShadow = dark
    ? "shadow-[0_28px_95px_rgba(0,0,0,0.70)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.16)]";

  // Calm stage surface: not a border, just the "panel" we read in.
  const stageSurface = [
    "relative rounded-[32px] overflow-hidden",
    "px-5 py-5 sm:px-7 sm:py-6",
    theme.cardBgClass,
    cardShadow,
    "backdrop-blur-xl",
    dark ? "bg-slate-950/25" : "",
  ].join(" ");

  const narrativeText = dark ? "text-slate-200/88" : "text-slate-700";

  const bottomDockFade = dark
    ? "bg-gradient-to-t from-slate-950/92 via-slate-950/78 to-slate-950/0"
    : "bg-gradient-to-t from-white/95 via-white/80 to-white/0";

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

  // Stable memo for deps (fix exhaustive-deps warning)
  const wordCloudRaw = vm.summary.wordCloud;
  const wordCloud = React.useMemo<WordCloudItem[]>(
    () => wordCloudRaw ?? [],
    [wordCloudRaw]
  );

  const topWordSet = React.useMemo(() => topTerms(wordCloud), [wordCloud]);

  const primaryUnlock = vm.summary.primaryUnlock;

  const story = vm.summary.storySoFar ?? [];
  const storyCollapsed = story.slice(0, 2);
  const storyExpanded = story.slice(0, 7);
  const storyToShow = showAllStory ? storyExpanded : storyCollapsed;
  const canToggleStory = story.length > 2;

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
      `}</style>

      <div className="relative flex min-h-[100svh] flex-col">
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
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                Your patterns so far — and what to do next.
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
                      pillBase(dark),
                      selected ? pillSelected(dark) : "",
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
              <div className={stageSurface}>
                {/* ONE subtle stage glow (not per-section) */}
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className={[
                      "absolute -top-14 -left-14 h-72 w-72 rounded-full blur-3xl",
                      dark ? "bg-fuchsia-400/10" : "bg-fuchsia-400/8",
                    ].join(" ")}
                  />
                  <div
                    className={[
                      "absolute -bottom-20 -right-16 h-80 w-80 rounded-full blur-3xl",
                      dark ? "bg-sky-400/10" : "bg-sky-400/8",
                    ].join(" ")}
                  />
                </div>

                <div className="relative">
                  {/* Agentic intro */}
                  <div className="pb-1">
                    <div
                      className={`text-[22px] leading-snug md:text-[26px] ${
                        dark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {vm.summary.headline}
                    </div>

                    <div className="mt-4 space-y-4">
                      {storyToShow.map((p, idx) => (
                        <p
                          key={`sum_story_${idx}`}
                          className={`text-[15px] leading-7 md:text-[16px] ${narrativeText}`}
                        >
                          {p}
                        </p>
                      ))}
                    </div>

                    {canToggleStory ? (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          className={[
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                            "text-xs font-semibold transition active:scale-95",
                            dark
                              ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                              : "border-black/10 bg-white/80 text-slate-900 hover:bg-white",
                          ].join(" ")}
                          onClick={() => setShowAllStory((v) => !v)}
                        >
                          <span aria-hidden>{showAllStory ? "▾" : "▸"}</span>
                          {showAllStory ? "Hide details" : "Show more"}
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* PRIMARY CTA */}
                  {primaryUnlock?.items?.length ? (
                    <div
                      className={[
                        "mt-4 relative overflow-hidden rounded-3xl px-4 py-3 sm:px-5 sm:py-3.5",
                        sectionTint(dark, "primary"),
                        sectionRing(dark),
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
                          {primaryUnlock.title ?? "If you want this to get sharper…"}
                        </div>

                        <div
                          className={`mt-1 text-sm leading-relaxed ${
                            dark ? "text-white/78" : "text-slate-700"
                          }`}
                        >
                          Give me a little more signal so I’m not guessing.{" "}
                          <span className={dark ? "text-white/92" : "text-slate-900"}>
                            Two short answers is enough.
                          </span>
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

                  {/* WORD CLOUD */}
                  <div
                    className={[
                      "mt-6 relative overflow-hidden rounded-3xl px-5 py-4",
                      sectionTint(dark, "signals"),
                      sectionRing(dark),
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
                      <SectionHeader
                        dark={dark}
                        kind="signals"
                        title="Word cloud"
                        icon="✨"
                        subtitle="This isn’t a score — it’s a reading. Bigger words show up more because they show up more in what you wrote."
                      />

                      <div className="mt-4">
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
                                      ? [
                                          "rounded-full px-2.5 py-1",
                                          highlightWrap(dark),
                                        ].join(" ")
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
                          <div className={`text-sm ${dark ? "text-white/70" : "text-slate-700"}`}>
                            Nothing to map yet — answer a few questions and this turns into a real word cloud.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`my-6 h-px ${dark ? "bg-white/10" : "bg-black/10"}`} />

                  {/* SUGGESTS */}
                  <div
                    className={[
                      "relative overflow-hidden rounded-3xl px-5 py-4",
                      sectionTint(dark, "suggests"),
                      sectionRing(dark),
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
                      <SectionHeader
                        dark={dark}
                        kind="suggests"
                        title="What this suggests"
                        icon="🧭"
                        subtitle="Plain English — not labels."
                      />

                      <ul className="mt-4 space-y-2">
                        {vm.summary.suggests.map((it) => (
                          <li key={it.id} className="flex items-start gap-3">
                            <span
                              aria-hidden
                              className={`mt-2 inline-block h-1.5 w-1.5 rounded-full ${
                                dark ? "bg-white/35" : "bg-slate-900/35"
                              }`}
                            />
                            <div className={`text-sm leading-relaxed ${dark ? "text-slate-200/88" : "text-slate-700"}`}>
                              {it.text}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* WATCH-OUTS */}
                  <div className="mt-6">
                    <div
                      className={[
                        "relative overflow-hidden rounded-3xl px-5 py-4",
                        sectionTint(dark, "watchouts"),
                        sectionRing(dark),
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
                        <SectionHeader
                          dark={dark}
                          kind="watchouts"
                          title="Watch-outs"
                          icon="🛟"
                          subtitle="Guardrails — no shame, just reality."
                        />

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
                                <div className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                                  {e.title}
                                </div>
                                <div className={`mt-1 text-sm leading-relaxed ${dark ? "text-white/70" : "text-slate-700"}`}>
                                  {e.text}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* EXPERIMENT */}
                  <div className="mt-6">
                    <div
                      className={[
                        "relative overflow-hidden rounded-3xl px-5 py-4",
                        sectionTint(dark, "experiment"),
                        sectionRing(dark),
                      ].join(" ")}
                    >
                      <div className="pointer-events-none absolute inset-0">
                        <div
                          className={[
                            "absolute left-0 top-0 h-full w-1",
                            accentBar(dark, "experiment"),
                          ].join(" ")}
                        />
                      </div>

                      <div className="relative">
                        <SectionHeader
                          dark={dark}
                          kind="experiment"
                          title={vm.summary.experiment.title}
                          icon="⚡"
                        />

                        <div className={`mt-3 whitespace-pre-line text-sm leading-relaxed ${dark ? "text-white/75" : "text-slate-700"}`}>
                          {vm.summary.experiment.text}
                        </div>

                        {lastExperiment ? (
                          <div className={`mt-3 text-xs ${dark ? "text-white/60" : "text-slate-600"}`}>
                            Last logged:{" "}
                            <span className={dark ? "text-white/85" : "text-slate-900"}>
                              {lastExperiment.tried}
                            </span>{" "}
                            •{" "}
                            {lastExperiment.feel === "energized"
                              ? "energizing"
                              : lastExperiment.feel === "drained"
                              ? "draining"
                              : "neutral"}{" "}
                            • {relativeTime(lastExperiment.createdAt)}
                          </div>
                        ) : null}

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className={`text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>
                            Logging is how we turn “advice” into “you.”
                          </div>

                          <button
                            type="button"
                            className={[
                              "rounded-full border px-3 py-1.5",
                              "text-xs font-semibold transition active:scale-95",
                              dark
                                ? "border-white/12 bg-white/10 text-white/90 hover:bg-white/14"
                                : "border-black/10 bg-white text-slate-900 hover:bg-white",
                            ].join(" ")}
                            onClick={openLogModal}
                          >
                            Log my result →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick check */}
                  <div className="mt-6">
                    <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/50" : "text-slate-500"}`}>
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
                              pillBase(dark),
                              selected ? pillSelected(dark) : "",
                              selected
                                ? dark
                                  ? "ring-2 ring-white/25"
                                  : "ring-2 ring-slate-900/10"
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

                    <div className={`mt-2 text-xs ${dark ? "text-white/45" : "text-slate-500"}`}>
                      (We’ll use this later to recalibrate Insights.)
                    </div>
                  </div>
                </div>
              </div>

              {/* Log Modal */}
              {logOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={closeLogModal}
                    aria-hidden
                  />

                  <div
                    role="dialog"
                    aria-modal="true"
                    className={[
                      "relative w-full max-w-xl overflow-hidden rounded-[28px] border",
                      "backdrop-blur-xl",
                      dark
                        ? "border-white/12 bg-slate-950/70"
                        : "border-black/10 bg-white/85",
                      "shadow-[0_28px_95px_rgba(0,0,0,0.55)]",
                    ].join(" ")}
                  >
                    <div className="relative px-5 py-5 sm:px-7 sm:py-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                            Log your experiment
                          </div>
                          <div className={`mt-1 text-sm ${dark ? "text-white/65" : "text-slate-600"}`}>
                            Quick and small. This is how Insights gets personal.
                          </div>
                        </div>

                        <button
                          type="button"
                          className={[
                            "rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95",
                            dark
                              ? "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                              : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                          ].join(" ")}
                          onClick={closeLogModal}
                        >
                          Close
                        </button>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div>
                          <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/45" : "text-slate-500"}`}>
                            What did you try?
                          </div>
                          <input
                            value={logTried}
                            onChange={(e) => setLogTried(e.target.value)}
                            placeholder="e.g., Sketched a game level idea for 25 minutes"
                            className={[
                              "mt-2 w-full rounded-2xl border px-4 py-3 text-sm",
                              "outline-none",
                              dark
                                ? "border-white/10 bg-white/6 text-white placeholder:text-white/35 focus:border-white/18"
                                : "border-black/10 bg-white text-slate-900 placeholder:text-slate-400 focus:border-black/15",
                            ].join(" ")}
                          />
                        </div>

                        <div>
                          <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/45" : "text-slate-500"}`}>
                            How did it feel?
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {[
                              { id: "energized", label: "Energizing", icon: "🔥" },
                              { id: "neutral", label: "Neutral", icon: "😐" },
                              { id: "drained", label: "Draining", icon: "🫠" },
                            ].map((x) => {
                              const selected = logFeel === x.id;
                              return (
                                <button
                                  key={x.id}
                                  type="button"
                                  className={[
                                    "rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95",
                                    dark
                                      ? "border-white/10 bg-white/6 text-white/80 hover:bg-white/10"
                                      : "border-black/10 bg-white text-slate-800 hover:bg-white",
                                    selected ? pillSelected(dark) : "",
                                  ].join(" ")}
                                  onClick={() => setLogFeel(x.id as LoggedExperiment["feel"])}
                                  aria-pressed={selected}
                                >
                                  <span className="mr-2" aria-hidden>
                                    {selected ? "✓" : x.icon}
                                  </span>
                                  {x.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/45" : "text-slate-500"}`}>
                            What did you learn? (optional)
                          </div>
                          <textarea
                            value={logLearned}
                            onChange={(e) => setLogLearned(e.target.value)}
                            placeholder="One sentence is enough."
                            rows={3}
                            className={[
                              "mt-2 w-full resize-none rounded-2xl border px-4 py-3 text-sm",
                              "outline-none",
                              dark
                                ? "border-white/10 bg-white/6 text-white placeholder:text-white/35 focus:border-white/18"
                                : "border-black/10 bg-white text-slate-900 placeholder:text-slate-400 focus:border-black/15",
                            ].join(" ")}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className={`text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>
                          Stored locally for now.
                        </div>

                        <button
                          type="button"
                          className={[
                            "rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95",
                            dark
                              ? "border-white/12 bg-white/10 text-white/90 hover:bg-white/14"
                              : "border-black/10 bg-white text-slate-900 hover:bg-white",
                            (!logFeel || !(logTried ?? "").trim()) ? "opacity-50" : "",
                          ].join(" ")}
                          onClick={saveLog}
                          disabled={!logFeel || !(logTried ?? "").trim()}
                        >
                          Save log →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
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
                  This section is scaffolded. We’ll implement it next after Summary is locked.
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Mobile sticky nav pills */}
        <div className="fixed inset-x-0 bottom-[72px] z-40 md:hidden">
          <div className={`pointer-events-none h-10 w-full ${bottomDockFade}`} />
          <div className="pointer-events-auto px-3 pb-3">
            <div
              className={[
                "mx-auto flex max-w-5xl gap-2 overflow-x-auto",
                "rounded-[20px] border px-2 py-2",
                "backdrop-blur-xl",
                dark
                  ? "border-white/10 bg-slate-950/35"
                  : "border-black/10 bg-white/75",
              ].join(" ")}
            >
              {TABS.map((t) => {
                const selected = t.id === tab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={[
                      "shrink-0",
                      pillBase(dark),
                      selected ? pillSelected(dark) : "",
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
        </div>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
