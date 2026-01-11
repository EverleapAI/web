// src/app/main/explore/renderers/RecommendationsRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import type { ExploreRendererProps } from "../content/types";

type RecAccent = {
  rail: string;
  chip: string;
  ctaDark: string;
  halo: string;
};

const REC_ACCENTS: RecAccent[] = [
  {
    rail: "from-sky-300 via-cyan-300 to-indigo-300",
    chip: "bg-sky-300/15 text-sky-100 border-sky-200/20",
    ctaDark: "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/25",
    halo: "from-sky-500/18 via-cyan-400/10 to-indigo-500/10",
  },
  {
    rail: "from-emerald-300 via-teal-300 to-sky-300",
    chip: "bg-emerald-300/15 text-emerald-100 border-emerald-200/20",
    ctaDark:
      "bg-emerald-300 text-slate-950 hover:bg-emerald-200 shadow-emerald-300/25",
    halo: "from-emerald-500/16 via-teal-400/10 to-sky-500/10",
  },
  {
    rail: "from-amber-300 via-orange-300 to-rose-300",
    chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
    ctaDark:
      "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
    halo: "from-amber-500/16 via-orange-400/10 to-rose-500/10",
  },
  {
    rail: "from-violet-300 via-fuchsia-300 to-sky-300",
    chip: "bg-violet-300/15 text-violet-100 border-violet-200/20",
    ctaDark:
      "bg-violet-300 text-slate-950 hover:bg-violet-200 shadow-violet-300/25",
    halo: "from-violet-500/16 via-fuchsia-400/10 to-sky-500/10",
  },
];

function careerDeepHref(laneId: string) {
  // IMPORTANT: Explore is separate, but it can still deep-link into the career lane UI.
  // This expects laneId to match StepperLaneId (productUx, healthHumanSupport, etc.).
  return `/main/career/${encodeURIComponent(laneId)}?mode=explore`;
}

export default function RecommendationsRenderer({
  chip,
  dark,
}: ExploreRendererProps) {
  const area = chip.area;

  const [contextOpen, setContextOpen] = React.useState(false);

  const shell = dark
    ? "border-white/10 bg-white/5"
    : "border-black/10 bg-white";
  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";
  const micro = dark ? "text-slate-300/70" : "text-slate-600/80";

  const accentGlow = `bg-gradient-to-br ${area.glowClass}`;

  const headline =
    area.headline?.trim() || "4 Everleap recommendations for you";
  const summary =
    area.summary?.trim() ||
    "Not a forever decision. Pick one lane, run a tiny test, then adjust.";

  // Treat cards[] as the 4 recommendation lanes (id must match StepperLaneId)
  const lanes = (area.cards ?? []).slice(0, 4);

  return (
    <section className="space-y-3">
      {/* Big lane card (match Insights vibe) */}
      <div
        className={`relative overflow-hidden rounded-[32px] border px-5 py-5 shadow-sm backdrop-blur-xl sm:px-7 sm:py-6 ${shell}`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -top-10 -left-10 h-56 w-56 rounded-full blur-3xl opacity-25 ${accentGlow}`}
          />
          <div
            className={`absolute -bottom-16 -right-10 h-64 w-64 rounded-full blur-3xl opacity-20 ${accentGlow}`}
          />
        </div>

        <div className="relative">
          <div
            className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
              dark ? "text-slate-300/60" : "text-slate-500"
            }`}
          >
            Recommendations
          </div>

          <div className="mt-2 max-w-2xl">
            <div className={`text-lg font-semibold ${titleC}`}>{headline}</div>
            <div className={`mt-1 text-sm ${muted}`}>{summary}</div>
          </div>

          {/* ===== 4 stacked recommendation cards ===== */}
          {lanes.length ? (
            <div className="mt-5 space-y-3">
              {lanes.map((c, idx) => {
                const a = REC_ACCENTS[idx] ?? REC_ACCENTS[0];

                return (
                  <div
                    key={c.id}
                    className={`relative overflow-hidden rounded-3xl border p-[1px] ${
                      dark
                        ? "border-white/10 bg-white/5"
                        : "border-slate-200 bg-white/80"
                    }`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo}`}
                    />

                    <div
                      aria-hidden
                      className={`pointer-events-none absolute left-0 top-4 h-[70%] w-[3px] rounded-full bg-gradient-to-b ${a.rail} opacity-90`}
                    />

                    <div
                      className={`relative rounded-3xl px-5 py-4 ${
                        dark ? "bg-slate-950/35" : "bg-white/70"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                              dark
                                ? `border-white/10 ${a.chip}`
                                : "border-slate-200 bg-white text-slate-800"
                            }`}
                          >
                            #{idx + 1}
                          </span>

                          <div className={`text-base font-semibold ${titleC}`}>
                            <span className="mr-2" aria-hidden>
                              {c.icon ?? "🧭"}
                            </span>
                            {c.title}
                          </div>
                        </div>

                        <div className={`mt-2 text-sm ${muted}`}>{c.short}</div>

                        {/* In Explore we don’t have bestFor/starterExperiment typed yet.
                           We’ll show signals + hint as supporting copy (still matches the “feel”). */}
                        {area.signals?.length ? (
                          <div className={`mt-2 text-xs ${micro}`}>
                            <span className="font-semibold">Signals:</span>{" "}
                            {area.signals.slice(0, 4).join(" • ")}
                          </div>
                        ) : null}

                        {area.hint ? (
                          <div className={`mt-3 text-xs ${micro}`}>
                            <span className="font-semibold">Note:</span>{" "}
                            {area.hint}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                          href={careerDeepHref(c.id)}
                          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition active:scale-95 ${
                            dark
                              ? `${a.ctaDark} shadow-[0_12px_34px_rgba(0,0,0,0.35)]`
                              : "bg-sky-600 text-white hover:bg-sky-500"
                          }`}
                        >
                          Dive deeper <ArrowRight className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                            dark
                              ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                              : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
                          }`}
                          title="Placeholder (no action wired yet)"
                        >
                          Try this
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`mt-5 rounded-2xl border p-5 ${
                dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
              }`}
            >
              <div className={`text-sm font-semibold ${titleC}`}>
                No recommendations yet
              </div>
              <div className={`mt-1 text-sm ${muted}`}>
                Add 4 items to{" "}
                <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
                <span className="font-mono text-[0.9em]">
                  explore/content/recommendations.ts
                </span>
                .
              </div>
            </div>
          )}

          {/* Context toggle (keeps the Insights “More context” vibe) */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setContextOpen((o) => !o)}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                dark
                  ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
              }`}
              aria-expanded={contextOpen}
            >
              More context
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  contextOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`text-xs ${dark ? "text-slate-300/55" : "text-slate-500"}`}
            >
              Explore-only lane • separate from Insights
            </div>
          </div>

          {contextOpen ? (
            <div className="mt-4 space-y-3">
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  dark
                    ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90"
                    : "border-slate-200 bg-white/80 text-slate-700"
                }`}
              >
                <div className="font-semibold">What this is</div>
                <div className={`mt-2 ${muted}`}>
                  This Explore lane is a browsing surface. It can link into the
                  career lane stepper for deeper detail, but the content + UI
                  remain separate from Insights.
                </div>

                {area.nextMoves?.length ? (
                  <div className="mt-3">
                    <div
                      className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                        dark ? "text-slate-300/60" : "text-slate-500"
                      }`}
                    >
                      Next moves
                    </div>

                    <div className="space-y-2">
                      {area.nextMoves.slice(0, 3).map((m, i) => (
                        <div
                          key={m.id}
                          className={`rounded-2xl border px-4 py-3 ${
                            dark
                              ? "border-white/10 bg-slate-950/35"
                              : "border-slate-200 bg-white/75"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                dark
                                  ? "bg-white/10 text-slate-100"
                                  : "bg-slate-900/5 text-slate-800"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-sm font-semibold ${titleC}`}>
                                {m.title}
                              </div>
                              <div className={`mt-1 text-sm ${muted}`}>{m.blurb}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
