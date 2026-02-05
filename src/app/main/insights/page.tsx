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
  type SignalId,
} from "./app/buildInsightsViewModel";

/* =============================================================================
   Tabs
   ============================================================================= */

type TabDef = { id: InsightsTab; label: string };

const TABS: TabDef[] = [
  { id: "summary", label: "Summary" },
  { id: "superpowers", label: "Superpowers" },
  { id: "patterns", label: "Patterns" },
  { id: "edges", label: "Edges" },
  { id: "directions", label: "Directions" },
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
  if (v === "patterns") return "patterns";
  if (v === "edges") return "edges";
  if (v === "directions") return "directions";
  if (v === "doppelganger") return "doppelganger";
  if (v.includes("doppel")) return "doppelganger";
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
  // stronger “pressed” state so it’s obvious
  return dark
    ? "bg-white/18 text-white border-white/18 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_18px_55px_rgba(0,0,0,0.45)]"
    : "bg-white text-slate-900 border-slate-200 shadow-[0_14px_40px_rgba(0,0,0,0.12)]";
}

function chipTone(dark: boolean, tone?: "neutral" | "good" | "watch") {
  const base = [
    "inline-flex items-center gap-2",
    "rounded-full border px-3 py-1.5",
    "text-xs font-semibold",
    "backdrop-blur-xl",
  ];

  if (dark) {
    if (tone === "good")
      return base.concat(["border-white/12 bg-white/10 text-white/90"]).join(" ");
    if (tone === "watch")
      return base.concat(["border-white/12 bg-white/8 text-white/80"]).join(" ");
    return base.concat(["border-white/10 bg-white/7 text-white/80"]).join(" ");
  }

  if (tone === "good")
    return base.concat(["border-black/10 bg-white/90 text-slate-900"]).join(" ");
  if (tone === "watch")
    return base.concat(["border-black/10 bg-white/85 text-slate-800"]).join(" ");
  return base.concat(["border-black/10 bg-white/85 text-slate-800"]).join(" ");
}

function signalGradient(dark: boolean, id: SignalId) {
  const base = "bg-gradient-to-br";
  if (!dark) {
    return [
      base,
      id === "action"
        ? "from-amber-500/35 via-rose-500/30 to-fuchsia-500/25"
        : id === "people"
        ? "from-sky-500/35 via-fuchsia-500/30 to-amber-500/22"
        : id === "curiosity"
        ? "from-emerald-500/32 via-sky-500/26 to-fuchsia-500/22"
        : "from-violet-500/35 via-sky-500/26 to-emerald-500/20",
    ].join(" ");
  }

  return [
    base,
    id === "action"
      ? "from-amber-300/65 via-rose-300/55 to-fuchsia-300/40"
      : id === "people"
      ? "from-sky-300/65 via-fuchsia-300/55 to-amber-300/38"
      : id === "curiosity"
      ? "from-emerald-300/60 via-sky-300/50 to-fuchsia-300/36"
      : "from-violet-300/65 via-sky-300/50 to-emerald-300/32",
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

type LoggedExperiment = {
  id: string;
  createdAt: number;
  title?: string;
  tried: string;
  feel: "energized" | "neutral" | "drained";
  learned?: string;
};

function sectionWash(dark: boolean, kind: "suggests" | "watchouts" | "experiment" | "signals") {
  if (!dark) {
    if (kind === "signals")
      return "bg-gradient-to-br from-sky-500/10 via-fuchsia-500/8 to-amber-500/7";
    if (kind === "suggests")
      return "bg-gradient-to-br from-amber-500/10 via-rose-500/8 to-fuchsia-500/8";
    if (kind === "watchouts")
      return "bg-gradient-to-br from-violet-500/10 via-sky-500/8 to-emerald-500/6";
    return "bg-gradient-to-br from-emerald-500/10 via-sky-500/8 to-fuchsia-500/6";
  }
  if (kind === "signals")
    return "bg-gradient-to-br from-sky-300/14 via-fuchsia-300/10 to-amber-300/9";
  if (kind === "suggests")
    return "bg-gradient-to-br from-amber-300/14 via-rose-300/10 to-fuchsia-300/10";
  if (kind === "watchouts")
    return "bg-gradient-to-br from-violet-300/14 via-sky-300/10 to-emerald-300/8";
  return "bg-gradient-to-br from-emerald-300/14 via-sky-300/10 to-fuchsia-300/8";
}

function sectionEdge(dark: boolean, kind: "suggests" | "watchouts" | "experiment" | "signals") {
  if (!dark) {
    if (kind === "signals")
      return "bg-gradient-to-b from-sky-500/45 via-fuchsia-500/30 to-amber-500/20";
    if (kind === "suggests")
      return "bg-gradient-to-b from-amber-500/50 via-rose-500/35 to-fuchsia-500/25";
    if (kind === "watchouts")
      return "bg-gradient-to-b from-violet-500/45 via-sky-500/30 to-emerald-500/20";
    return "bg-gradient-to-b from-emerald-500/45 via-sky-500/30 to-fuchsia-500/20";
  }
  if (kind === "signals")
    return "bg-gradient-to-b from-sky-200/55 via-fuchsia-200/40 to-amber-200/28";
  if (kind === "suggests")
    return "bg-gradient-to-b from-amber-200/55 via-rose-200/40 to-fuchsia-200/28";
  if (kind === "watchouts")
    return "bg-gradient-to-b from-violet-200/55 via-sky-200/40 to-emerald-200/28";
  return "bg-gradient-to-b from-emerald-200/55 via-sky-200/40 to-fuchsia-200/28";
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

function wordSizePx(w: number) {
  // w 0..1 -> 12..22 (mobile friendly)
  return 12 + Math.round(Math.max(0, Math.min(1, w)) * 10);
}

function wordOpacity(w: number) {
  // w 0..1 -> 0.55..1
  return 0.55 + Math.max(0, Math.min(1, w)) * 0.45;
}

/* =============================================================================
   Page
   ============================================================================= */

export default function InsightsPage() {
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
  const [showSignalsInfo, setShowSignalsInfo] = React.useState(false);

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
  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const heroGlow = dark
    ? "from-sky-400 via-fuchsia-500 to-amber-300"
    : "from-sky-300 via-fuchsia-300 to-amber-200";

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

  const receipts = vm.summary.receipts ?? [];
  const signalBar = vm.summary.signalBar ?? [];
  const wordCloud: WordCloudItem[] = vm.summary.wordCloud ?? [];
  const unlock = vm.summary.unlock;

  const story = vm.summary.storySoFar ?? [];
  const storyCollapsed = story.slice(0, 2);
  const storyExpanded = story.slice(0, 6);
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
            <div className="hidden md:flex md:max-w-[60%] md:flex-wrap md:justify-end md:gap-2">
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
              <div
                className={`relative overflow-hidden rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}
              >
                {/* cinematic glow */}
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className={`absolute -top-12 -left-12 h-64 w-64 rounded-full bg-gradient-to-br ${heroGlow} blur-3xl opacity-18`}
                  />
                  <div
                    className={`absolute -bottom-16 -right-14 h-72 w-72 rounded-full bg-gradient-to-br ${heroGlow} blur-3xl opacity-14`}
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

                  {/* BASED ON WHAT YOU’VE SHARED */}
                  {(receipts.length || unlock?.items?.length) ? (
                    <div className="mt-6">
                      <div
                        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                          dark ? "text-white/45" : "text-slate-500"
                        }`}
                      >
                        Based on what you’ve shared
                      </div>

                      {/* Receipts chips (life receipts only) */}
                      {receipts.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {receipts.slice(0, 6).map((r) => (
                            <span key={r.id} className={chipTone(dark, r.tone)}>
                              <span aria-hidden>
                                {r.tone === "good" ? "✦" : r.tone === "watch" ? "◔" : "•"}
                              </span>
                              <span>{r.label}</span>
                              {r.detail ? (
                                <span className={dark ? "text-white/65" : "text-slate-600"}>
                                  {r.detail}
                                </span>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {/* Unlock CTAs */}
                      {unlock?.items?.length ? (
                        <div className="mt-3">
                          <div
                            className={`text-sm leading-relaxed ${
                              dark ? "text-white/70" : "text-slate-700"
                            }`}
                          >
                            If you want this to get sharper, give me a little more signal.
                            <span className={dark ? "text-white/80" : "text-slate-800"}>
                              {" "}
                              Two more answers can change the quality of what I can say.
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {unlock.items.slice(0, 3).map((it) =>
                              it.href ? (
                                <button
                                  key={it.id}
                                  type="button"
                                  className={[
                                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                                    "text-xs font-semibold transition active:scale-95",
                                    dark
                                      ? "border-white/12 bg-white/8 text-white/90 hover:bg-white/12"
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
                      ) : null}
                    </div>
                  ) : null}

                  {/* SIGNALS (word cloud + tiny signal chips) */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div
                        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                          dark ? "text-white/45" : "text-slate-500"
                        }`}
                      >
                        Signals
                      </div>

                      <button
                        type="button"
                        className={[
                          "rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95",
                          dark
                            ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                            : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                        ].join(" ")}
                        onClick={() => setShowSignalsInfo((v) => !v)}
                      >
                        {showSignalsInfo ? "Hide what this is" : "What is this?"}
                      </button>
                    </div>

                    {showSignalsInfo ? (
                      <div
                        className={[
                          "mt-2 rounded-2xl px-4 py-3",
                          dark ? "bg-white/6" : "bg-white/75",
                          "ring-1",
                          dark ? "ring-white/10" : "ring-black/10",
                        ].join(" ")}
                      >
                        <div
                          className={`text-sm font-semibold ${
                            dark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          Not a score — a reading.
                        </div>
                        <div
                          className={`mt-1 text-sm leading-relaxed ${
                            dark ? "text-white/70" : "text-slate-700"
                          }`}
                        >
                          These are repeated themes in your answers. Bigger words show up more in what you wrote.
                        </div>
                      </div>
                    ) : null}

                    <div
                      className={[
                        "mt-3 relative overflow-hidden rounded-3xl px-5 py-4",
                        sectionWash(dark, "signals"),
                        dark ? "ring-1 ring-white/12" : "ring-1 ring-black/10",
                      ].join(" ")}
                    >
                      <div className="pointer-events-none absolute inset-0">
                        <div
                          className={[
                            "absolute left-0 top-0 h-full w-1.5 opacity-70",
                            sectionEdge(dark, "signals"),
                          ].join(" ")}
                        />
                        <div
                          className={[
                            "absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl opacity-25",
                            dark
                              ? "bg-gradient-to-br from-sky-300/25 via-fuchsia-300/18 to-amber-300/15"
                              : "bg-gradient-to-br from-sky-500/14 via-fuchsia-500/12 to-amber-500/10",
                          ].join(" ")}
                        />
                      </div>

                      <div className="relative">
                        {/* Tiny signal chips (no ugly blocks) */}
                        {signalBar.length ? (
                          <div className="flex flex-wrap gap-2">
                            {signalBar.slice(0, 4).map((s) => (
                              <span
                                key={s.id}
                                className={[
                                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                                  dark
                                    ? "border-white/12 bg-white/8 text-white/85"
                                    : "border-black/10 bg-white/80 text-slate-800",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "h-2.5 w-2.5 rounded-full",
                                    signalGradient(dark, s.id as SignalId),
                                  ].join(" ")}
                                  aria-hidden
                                />
                                <span>{s.label}</span>
                                <span className={dark ? "text-white/55" : "text-slate-500"}>
                                  {Math.round((s.strength ?? 0) * 100)}
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {/* Word cloud */}
                        <div className="mt-4">
                          {wordCloud.length ? (
                            <div className="flex flex-wrap gap-x-3 gap-y-2 leading-none">
                              {wordCloud.map((w) => (
                                <span
                                  key={w.term}
                                  className={[
                                    "select-none rounded-full border px-3 py-1",
                                    "transition active:scale-95",
                                    dark
                                      ? "border-white/10 bg-white/6 text-white hover:bg-white/10"
                                      : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
                                  ].join(" ")}
                                  style={{
                                    fontSize: `${wordSizePx(w.weight)}px`,
                                    opacity: wordOpacity(w.weight),
                                  }}
                                >
                                  {w.term}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div
                              className={`text-sm ${
                                dark ? "text-white/70" : "text-slate-700"
                              }`}
                            >
                              No themes yet — answer a few questions and this turns into a real word cloud.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`my-6 h-px ${dark ? "bg-white/10" : "bg-black/10"}`} />

                  {/* WHAT THIS SUGGESTS */}
                  <div
                    className={[
                      "relative overflow-hidden rounded-3xl px-5 py-4",
                      sectionWash(dark, "suggests"),
                      dark ? "ring-1 ring-white/12" : "ring-1 ring-black/10",
                    ].join(" ")}
                  >
                    <div className="pointer-events-none absolute inset-0">
                      <div
                        className={[
                          "absolute left-0 top-0 h-full w-1.5 opacity-70",
                          sectionEdge(dark, "suggests"),
                        ].join(" ")}
                      />
                    </div>

                    <div className="relative">
                      <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>
                        What this suggests
                      </div>
                      <div className={`mt-0.5 text-sm ${sectionMuted(dark)}`}>
                        Plain English — not labels.
                      </div>

                      <ul className="mt-3 space-y-2">
                        {vm.summary.suggests.map((it) => (
                          <li key={it.id} className="flex items-start gap-3">
                            <span
                              aria-hidden
                              className={`mt-2 inline-block h-1.5 w-1.5 rounded-full ${
                                dark ? "bg-white/35" : "bg-slate-900/35"
                              }`}
                            />
                            <div
                              className={`text-sm leading-relaxed ${
                                dark ? "text-slate-200/88" : "text-slate-700"
                              }`}
                            >
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
                        sectionWash(dark, "watchouts"),
                        dark ? "ring-1 ring-white/12" : "ring-1 ring-black/10",
                      ].join(" ")}
                    >
                      <div className="pointer-events-none absolute inset-0">
                        <div
                          className={[
                            "absolute left-0 top-0 h-full w-1.5 opacity-70",
                            sectionEdge(dark, "watchouts"),
                          ].join(" ")}
                        />
                      </div>

                      <div className="relative">
                        <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>
                          Watch-outs
                        </div>
                        <div className={`mt-0.5 text-sm ${sectionMuted(dark)}`}>
                          Guardrails — no shame, just reality.
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                          {vm.summary.tripUps.map((e) => (
                            <div
                              key={e.id}
                              className={[
                                "rounded-2xl px-4 py-3",
                                dark ? "bg-white/6" : "bg-white/75",
                                dark ? "ring-1 ring-white/10" : "ring-1 ring-black/10",
                              ].join(" ")}
                            >
                              <div
                                className={`text-sm font-semibold ${
                                  dark ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {e.title}
                              </div>
                              <div
                                className={`mt-1 text-sm leading-relaxed ${
                                  dark ? "text-white/70" : "text-slate-600"
                                }`}
                              >
                                {e.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EXPERIMENT */}
                  <div className="mt-6">
                    <div
                      className={[
                        "relative overflow-hidden rounded-3xl px-5 py-4",
                        sectionWash(dark, "experiment"),
                        dark ? "ring-1 ring-white/12" : "ring-1 ring-black/10",
                      ].join(" ")}
                    >
                      <div className="pointer-events-none absolute inset-0">
                        <div
                          className={[
                            "absolute left-0 top-0 h-full w-1.5 opacity-70",
                            sectionEdge(dark, "experiment"),
                          ].join(" ")}
                        />
                      </div>

                      <div className="relative">
                        <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>
                          One small experiment
                        </div>
                        <div className={`mt-0.5 text-sm ${sectionMuted(dark)}`}>
                          Try it on purpose. Log the result. Get sharper.
                        </div>

                        <div
                          className={[
                            "mt-3 overflow-hidden rounded-3xl",
                            dark ? "ring-1 ring-white/12" : "ring-1 ring-black/10",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "px-5 py-4",
                              dark
                                ? "bg-gradient-to-br from-white/10 via-white/6 to-white/5"
                                : "bg-gradient-to-br from-white via-white/80 to-white/70",
                            ].join(" ")}
                          >
                            <div
                              className={`text-sm font-semibold ${
                                dark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {vm.summary.experiment.title}
                            </div>
                            <div
                              className={`mt-1 whitespace-pre-line text-sm leading-relaxed ${
                                dark ? "text-white/75" : "text-slate-700"
                              }`}
                            >
                              {vm.summary.experiment.text}
                            </div>

                            {lastExperiment ? (
                              <div
                                className={[
                                  "mt-4 rounded-2xl px-4 py-3",
                                  dark ? "bg-slate-950/35" : "bg-black/[0.03]",
                                  dark ? "ring-1 ring-white/10" : "ring-1 ring-black/10",
                                ].join(" ")}
                              >
                                <div
                                  className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                                    dark ? "text-white/45" : "text-slate-500"
                                  }`}
                                >
                                  Last logged
                                </div>
                                <div
                                  className={`mt-1 text-sm font-semibold ${
                                    dark ? "text-white" : "text-slate-900"
                                  }`}
                                >
                                  {lastExperiment.tried}
                                </div>
                                <div
                                  className={`mt-1 text-xs ${
                                    dark ? "text-white/60" : "text-slate-600"
                                  }`}
                                >
                                  {lastExperiment.feel === "energized"
                                    ? "Felt energizing"
                                    : lastExperiment.feel === "drained"
                                    ? "Felt draining"
                                    : "Felt neutral"}{" "}
                                  • {relativeTime(lastExperiment.createdAt)}
                                </div>
                                {lastExperiment.learned ? (
                                  <div
                                    className={`mt-2 text-sm leading-relaxed ${
                                      dark ? "text-white/70" : "text-slate-700"
                                    }`}
                                  >
                                    “{lastExperiment.learned}”
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>

                          <div
                            className={[
                              "flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between",
                              dark ? "bg-slate-950/35" : "bg-black/[0.03]",
                            ].join(" ")}
                          >
                            <div
                              className={`text-xs ${
                                dark ? "text-white/55" : "text-slate-600"
                              }`}
                            >
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
                  </div>

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
                              pillBase(dark),
                              selected ? pillSelected(dark) : "",
                              selected ? "ring-2 ring-white/20" : "",
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

                    <div
                      className={`mt-2 text-xs ${
                        dark ? "text-white/45" : "text-slate-500"
                      }`}
                    >
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
                    <div className="pointer-events-none absolute inset-0">
                      <div
                        className={[
                          "absolute -left-16 -top-16 h-60 w-60 rounded-full blur-3xl opacity-40",
                          dark
                            ? "bg-gradient-to-br from-emerald-300/30 via-sky-300/25 to-fuchsia-300/20"
                            : "bg-gradient-to-br from-emerald-500/18 via-sky-500/14 to-fuchsia-500/12",
                        ].join(" ")}
                      />
                      <div
                        className={[
                          "absolute -right-16 -bottom-20 h-72 w-72 rounded-full blur-3xl opacity-35",
                          dark
                            ? "bg-gradient-to-br from-amber-300/22 via-rose-300/18 to-fuchsia-300/14"
                            : "bg-gradient-to-br from-amber-500/14 via-rose-500/12 to-fuchsia-500/10",
                        ].join(" ")}
                      />
                    </div>

                    <div className="relative px-5 py-5 sm:px-7 sm:py-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div
                            className={`text-lg font-semibold ${
                              dark ? "text-white" : "text-slate-900"
                            }`}
                          >
                            Log your experiment
                          </div>
                          <div
                            className={`mt-1 text-sm ${
                              dark ? "text-white/65" : "text-slate-600"
                            }`}
                          >
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
                          <div
                            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                              dark ? "text-white/45" : "text-slate-500"
                            }`}
                          >
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
                          <div
                            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                              dark ? "text-white/45" : "text-slate-500"
                            }`}
                          >
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
                          <div
                            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                              dark ? "text-white/45" : "text-slate-500"
                            }`}
                          >
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
                        <div
                          className={`text-xs ${
                            dark ? "text-white/55" : "text-slate-600"
                          }`}
                        >
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
                className={`rounded-[28px] border px-5 py-5 ${surface} ${
                  dark ? "text-white/80" : "text-slate-800"
                }`}
              >
                <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>
                  {TABS.find((t) => t.id === tab)?.label ?? "Section"}
                </div>
                <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                  This section is scaffolded. We’ll implement it next after Summary is locked.
                </div>

                <div
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                    dark
                      ? "border-white/10 bg-slate-950/35 text-white/75"
                      : "border-slate-200 bg-white/75 text-slate-700"
                  }`}
                >
                  <span className="font-semibold">UI note:</span> pills + tab routing are in place; we can
                  swap in real section components without changing navigation.
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Mobile sticky nav pills */}
        <div className="fixed inset-x-0 bottom-[72px] z-40 md:hidden" aria-hidden={false}>
          <div className={`pointer-events-none h-10 w-full ${bottomDockFade}`} />
          <div className="pointer-events-auto px-3 pb-3">
            <div
              className={[
                "mx-auto flex max-w-5xl gap-2 overflow-x-auto",
                "rounded-[20px] border px-2 py-2",
                "backdrop-blur-xl",
                dark ? "border-white/10 bg-slate-950/35" : "border-black/10 bg-white/75",
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
                    {t.id === "doppelganger" ? "Time Twin" : t.label}
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
