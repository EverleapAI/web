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
  { id: "doppelganger", label: "Historical Doppelgänger" },
];

type CalibrationChoice = "Mostly right" | "Somewhat" | "Not really";

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
  return dark ? "text-white/60" : "text-slate-600";
}

function hairline(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function pillBase(dark: boolean) {
  return [
    "inline-flex items-center justify-center",
    "rounded-full border",
    "px-3.5 py-2",
    "text-sm font-semibold",
    "transition active:scale-95",
    dark
      ? "border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/[0.10]"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
}

function pillSelected(dark: boolean) {
  return dark
    ? "bg-white/[0.16] text-white border-white/[0.16]"
    : "bg-white text-slate-900 border-slate-200";
}

function chipTone(dark: boolean, tone?: "neutral" | "good" | "watch") {
  const base = [
    "inline-flex items-center gap-2",
    "rounded-full border px-3 py-1.5",
    "text-xs font-semibold",
    "backdrop-blur-xl",
    "transition",
  ];

  if (dark) {
    if (tone === "good")
      return base
        .concat([
          "border-white/14 bg-white/[0.12] text-white/90 hover:bg-white/[0.16]",
        ])
        .join(" ");
    if (tone === "watch")
      return base
        .concat([
          "border-white/12 bg-white/[0.10] text-white/78 hover:bg-white/[0.14]",
        ])
        .join(" ");
    return base
      .concat([
        "border-white/10 bg-white/[0.09] text-white/78 hover:bg-white/[0.13]",
      ])
      .join(" ");
  }

  if (tone === "good")
    return base.concat(["border-black/10 bg-white/90 text-slate-900"]).join(" ");
  if (tone === "watch")
    return base.concat(["border-black/10 bg-white/85 text-slate-800"]).join(" ");
  return base.concat(["border-black/10 bg-white/85 text-slate-800"]).join(" ");
}

function signalFillGradient(id: string) {
  if (id === "action")
    return "bg-gradient-to-r from-amber-300/95 via-orange-400/80 to-pink-500/70";
  if (id === "people")
    return "bg-gradient-to-r from-sky-300/95 via-cyan-400/80 to-emerald-400/70";
  if (id === "curiosity")
    return "bg-gradient-to-r from-fuchsia-400/95 via-violet-500/80 to-sky-400/70";
  if (id === "clarity")
    return "bg-gradient-to-r from-emerald-300/95 via-lime-300/80 to-amber-200/70";
  return "bg-gradient-to-r from-white/35 via-white/22 to-white/16";
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
  const unlock = vm.summary.unlock;

  // ✅ your real public path
  const HERO_BG = "/images/insights/insights-cosmos-hero.png";

  const bottomDockClass = "fixed inset-x-0 bottom-[72px] z-40 md:hidden";
  const bottomDockFade = dark
    ? "bg-gradient-to-t from-slate-950/92 via-slate-950/48 to-transparent"
    : "bg-gradient-to-t from-white/95 via-white/70 to-transparent";

  // MUCH lighter panels so image shows through
  const glassPanel = [
    "rounded-[26px] border backdrop-blur-2xl",
    dark
      ? "border-white/12 bg-slate-950/10 shadow-[0_30px_110px_rgba(0,0,0,0.55)]"
      : "border-black/10 bg-white/78 shadow-[0_18px_60px_rgba(0,0,0,0.14)]",
  ].join(" ");

  const neonEdge = dark
    ? "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_70px_rgba(56,189,248,0.18),0_0_100px_rgba(217,70,239,0.16),0_0_110px_rgba(251,191,36,0.12)]"
    : "";

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="insights_orb"
      ambientCap={0.22}
    >
      <div className="relative flex min-h-[100svh] flex-col">
        {/* IMMERSIVE COLOR BACKDROP (LOUD PASS) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-100"
            style={{
              backgroundImage: `url('${HERO_BG}')`,
              // stronger so it reads under glass
              filter: "saturate(1.45) contrast(1.18) brightness(1.08)",
              transform: "scale(1.03)",
            }}
          />

          {/* nearly no dark wash */}
          <div className="absolute inset-0 bg-slate-950/0" />

          {/* light leaks */}
          <div className="absolute inset-0">
            <div className="absolute -top-28 left-[-14%] h-[420px] w-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/65 via-sky-400/32 to-amber-300/18 blur-3xl mix-blend-screen" />
            <div className="absolute top-[10%] right-[-18%] h-[520px] w-[780px] rounded-full bg-gradient-to-br from-cyan-400/60 via-violet-500/32 to-fuchsia-500/22 blur-3xl mix-blend-screen" />
            <div className="absolute bottom-[-22%] left-[0%] h-[640px] w-[980px] rounded-full bg-gradient-to-br from-amber-300/38 via-pink-500/36 to-sky-400/30 blur-3xl mix-blend-screen" />
          </div>

          {/* softer vignette (do NOT ink the whole page) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.00)_0%,rgba(2,6,23,0.18)_52%,rgba(2,6,23,0.62)_100%)]" />

          {/* top/bottom fades */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/70 via-slate-950/18 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/88 via-slate-950/38 to-transparent" />
        </div>

        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-5 md:px-8 md:pb-24 md:pt-7">
          {/* Header */}
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div
                className={`text-3xl font-semibold tracking-tight ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                Insights
              </div>
              <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                A living read of what you’ve shared so far.
              </div>

              <div className="mt-3 h-[2px] w-24 rounded-full bg-gradient-to-r from-fuchsia-500/90 via-sky-400/85 to-amber-300/85" />
            </div>

            {/* Desktop tabs rail */}
            <div
              className={[
                "hidden md:flex md:max-w-[62%] md:flex-wrap md:justify-end md:gap-2",
                "rounded-full border px-2 py-2 backdrop-blur-2xl",
                dark
                  ? "border-white/10 bg-slate-950/10 shadow-[0_18px_70px_rgba(0,0,0,0.45)]"
                  : "border-black/10 bg-white/70",
              ].join(" ")}
            >
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
                    {t.id === "doppelganger" ? "Doppelgänger" : t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {tab === "summary" ? (
            <section className="mb-6 space-y-4">
              {/* HERO */}
              <div
                className={[
                  glassPanel,
                  neonEdge,
                  "px-5 py-5 sm:px-7 sm:py-6",
                ].join(" ")}
              >
                <div
                  className={`text-[24px] font-semibold leading-snug tracking-tight md:text-[30px] ${
                    dark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {vm.summary.headline}
                </div>

                <div className="mt-4 space-y-4">
                  {vm.summary.storySoFar.map((p, idx) => (
                    <p
                      key={`sum_story_${idx}`}
                      className={`text-[15.5px] leading-7 md:text-[16px] ${
                        dark ? "text-slate-200/92" : "text-slate-700"
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {(receipts.length || unlock?.items?.length) && (
                  <div className="mt-5 flex flex-col gap-3">
                    {receipts.length ? (
                      <div>
                        <div
                          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                            dark ? "text-white/45" : "text-slate-500"
                          }`}
                        >
                          What I’m using
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {receipts.slice(0, 8).map((r) => (
                            <span key={r.id} className={chipTone(dark, r.tone)}>
                              <span aria-hidden className="opacity-80">
                                {r.tone === "good"
                                  ? "✦"
                                  : r.tone === "watch"
                                  ? "◔"
                                  : "•"}
                              </span>
                              <span>{r.label}</span>
                              {r.detail ? (
                                <span
                                  className={
                                    dark ? "text-white/60" : "text-slate-600"
                                  }
                                >
                                  {r.detail}
                                </span>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {unlock?.items?.length ? (
                      <div>
                        <div
                          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                            dark ? "text-white/45" : "text-slate-500"
                          }`}
                        >
                          {unlock.title ?? "Next"}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {unlock.items.slice(0, 4).map((it) =>
                            it.href ? (
                              <button
                                key={it.id}
                                type="button"
                                className={[
                                  "group inline-flex items-center gap-2",
                                  "rounded-full border px-3 py-1.5",
                                  "text-xs font-semibold",
                                  "transition active:scale-95",
                                  dark
                                    ? "border-white/12 bg-white/[0.12] text-white/90 hover:bg-white/[0.16]"
                                    : "border-black/10 bg-white/80 text-slate-900 hover:bg-white",
                                ].join(" ")}
                                onClick={() => router.push(it.href!)}
                              >
                                <span aria-hidden className="opacity-80">
                                  ↗
                                </span>
                                <span>{it.label}</span>
                                <span
                                  aria-hidden
                                  className="opacity-0 transition group-hover:opacity-70"
                                >
                                  →
                                </span>
                              </button>
                            ) : (
                              <span
                                key={it.id}
                                className={chipTone(dark, "neutral")}
                              >
                                <span aria-hidden>↗</span>
                                <span>{it.label}</span>
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* SIGNALS */}
              <div
                className={[glassPanel, "px-5 py-5 sm:px-7 sm:py-6"].join(" ")}
              >
                <div className="flex items-end justify-between">
                  <div className={`text-sm font-semibold ${sectionTitle(dark)}`}>
                    Signals
                  </div>
                  <div
                    className={`text-xs ${
                      dark ? "text-white/45" : "text-slate-500"
                    }`}
                  >
                    based on your words so far
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2.5">
                  {signalBar.slice(0, 4).map((s) => {
                    const pct = Math.round((s.strength ?? 0) * 100);
                    return (
                      <div key={s.id} className="flex items-center gap-3">
                        <div
                          className={`w-28 shrink-0 text-xs font-semibold ${
                            dark ? "text-white/70" : "text-slate-700"
                          }`}
                        >
                          {s.label}
                        </div>

                        <div
                          className={`relative h-3 flex-1 overflow-hidden rounded-full ${
                            dark ? "bg-white/10" : "bg-black/10"
                          }`}
                        >
                          <div
                            className={[
                              "absolute inset-y-0 left-0 rounded-full blur-md",
                              signalFillGradient(s.id),
                            ].join(" ")}
                            style={{
                              width: `${Math.max(6, pct)}%`,
                              opacity: 0.9,
                            }}
                          />
                          <div
                            className={[
                              "absolute inset-y-0 left-0 rounded-full",
                              signalFillGradient(s.id),
                            ].join(" ")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div
                          className={`w-12 text-right text-xs font-semibold ${
                            dark ? "text-white/60" : "text-slate-600"
                          }`}
                        >
                          {pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* IMPLICATIONS + WATCH-OUTS */}
              <div
                className={[glassPanel, "px-5 py-5 sm:px-7 sm:py-6"].join(" ")}
              >
                <div>
                  <div className={`text-sm font-semibold ${sectionTitle(dark)}`}>
                    What this suggests
                  </div>
                  <ul className="mt-3 space-y-2">
                    {vm.summary.suggests.map((it) => (
                      <li key={it.id} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-400 opacity-70"
                        />
                        <div
                          className={`text-sm leading-relaxed ${
                            dark ? "text-slate-200/85" : "text-slate-700"
                          }`}
                        >
                          {it.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`my-6 h-px ${hairline(dark)}`} />

                <div>
                  <div className={`text-sm font-semibold ${sectionTitle(dark)}`}>
                    Watch-outs
                  </div>
                  <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                    Common ways this goes sideways — so you can avoid them.
                  </div>

                  <div className="mt-3 space-y-3">
                    {vm.summary.tripUps.map((e) => (
                      <div key={e.id} className="space-y-1">
                        <div
                          className={`text-sm font-semibold ${
                            dark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {e.title}
                        </div>
                        <div
                          className={`text-sm leading-relaxed ${
                            dark ? "text-white/72" : "text-slate-600"
                          }`}
                        >
                          {e.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* EXPERIMENT */}
              <div
                className={[
                  glassPanel,
                  neonEdge,
                  "px-5 py-5 sm:px-7 sm:py-6",
                ].join(" ")}
              >
                <div className={`text-sm font-semibold ${sectionTitle(dark)}`}>
                  One small experiment
                </div>
                <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                  Do it once. The result is the point.
                </div>

                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold ${
                        dark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {vm.summary.experiment.title}
                    </div>
                    <div
                      className={`mt-2 whitespace-pre-line text-sm leading-relaxed ${
                        dark ? "text-white/82" : "text-slate-700"
                      }`}
                    >
                      {vm.summary.experiment.text}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={[
                      "w-full md:w-auto",
                      "rounded-full border px-4 py-2",
                      "text-sm font-semibold transition active:scale-95",
                      dark
                        ? "border-white/14 bg-white/[0.14] text-white/95 hover:bg-white/[0.18]"
                        : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
                    ].join(" ")}
                    onClick={() => router.push("/main/explore")}
                  >
                    Explore →
                  </button>
                </div>

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
                          ].join(" ")}
                          onClick={() => setCalibration(opt)}
                        >
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
                    We’ll use this later to recalibrate Insights.
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="mb-6">
              <div
                className={[
                  "rounded-[28px] border px-5 py-5 backdrop-blur-2xl",
                  theme.cardBorderClass,
                  dark
                    ? "border-white/12 bg-slate-950/10 text-white/80"
                    : "border-black/10 bg-white/78 text-slate-800",
                ].join(" ")}
              >
                <div className={`text-lg font-semibold ${sectionTitle(dark)}`}>
                  {TABS.find((t) => t.id === tab)?.label ?? "Section"}
                </div>
                <div className={`mt-1 text-sm ${sectionMuted(dark)}`}>
                  This section is scaffolded. We’ll implement it next after
                  Summary is locked.
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Mobile sticky nav pills */}
        <div className={bottomDockClass} aria-hidden={false}>
          <div className={`pointer-events-none h-10 w-full ${bottomDockFade}`} />
          <div className="pointer-events-auto px-3 pb-3">
            <div
              className={[
                "mx-auto flex max-w-5xl gap-2 overflow-x-auto",
                "rounded-[22px] border px-2 py-2",
                "backdrop-blur-2xl",
                dark
                  ? "border-white/10 bg-slate-950/10 shadow-[0_16px_60px_rgba(0,0,0,0.55)]"
                  : "border-black/10 bg-white/70",
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
                    {t.id === "doppelganger" ? "Doppelgänger" : t.label}
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
