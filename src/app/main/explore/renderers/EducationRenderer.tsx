// src/app/main/explore/renderers/EducationRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import type { ExploreRendererProps } from "../content/types";

/* ============================================================================
   Explore › EducationRenderer (Careers-style + Deep Dive CTA)
   Updates:
   - CTA copy: more “coach talking to older teen”
   - Add subtle helper microtext under CTA (prototype-only)
   - Light-mode CTA: match Education vibe (amber) instead of hard-coded emerald
============================================================================ */

type Feedback = "agree" | "mixed" | "disagree";

type EducationCard = {
  id: string;
  title: string;
  short: string;
  icon?: string;
};

type NextMove = {
  id: string;
  title: string;
  blurb: string;
};

type EducationArea = {
  glowClass?: string;
  headline?: string;
  summary?: string;
  hint?: string;
  cards?: EducationCard[];
  nextMoves?: NextMove[];
};

function asEducationArea(input: unknown): EducationArea {
  const obj = (input ?? {}) as Record<string, unknown>;

  const toCards = (v: unknown): EducationCard[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: EducationCard[] = [];
    for (const item of v) {
      const it = item as Record<string, unknown>;
      const id = typeof it?.id === "string" ? it.id : "";
      const title = typeof it?.title === "string" ? it.title : "";
      const short = typeof it?.short === "string" ? it.short : "";
      const icon = typeof it?.icon === "string" ? it.icon : undefined;
      if (id && title) out.push({ id, title, short, icon });
    }
    return out;
  };

  const toMoves = (v: unknown): NextMove[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: NextMove[] = [];
    for (const item of v) {
      const it = item as Record<string, unknown>;
      const id = typeof it?.id === "string" ? it.id : "";
      const title = typeof it?.title === "string" ? it.title : "";
      const blurb = typeof it?.blurb === "string" ? it.blurb : "";
      if (id && title) out.push({ id, title, blurb });
    }
    return out;
  };

  return {
    glowClass: typeof obj.glowClass === "string" ? obj.glowClass : undefined,
    headline: typeof obj.headline === "string" ? obj.headline : undefined,
    summary: typeof obj.summary === "string" ? obj.summary : undefined,
    hint: typeof obj.hint === "string" ? obj.hint : undefined,
    cards: toCards(obj.cards),
    nextMoves: toMoves(obj.nextMoves),
  };
}

/**
 * Spoken paragraph splitting:
 * - Primary separator: blank lines (\n\n)
 * - Fallback: single lines (\n)
 */
function splitSpokenParagraphs(input: string): string[] {
  const raw = String(input ?? "");
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const blocks = normalized
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (blocks.length > 1) return blocks;

  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : [];
}

type Accent = {
  rail: string;
  chip: string;
  ctaDark: string;
  halo: string;
};

const EDU_ACCENTS: Accent[] = [
  {
    rail: "from-amber-300 via-orange-300 to-rose-300",
    chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
    ctaDark:
      "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
    halo: "from-amber-500/16 via-orange-400/10 to-rose-500/10",
  },
  {
    rail: "from-emerald-300 via-teal-300 to-sky-300",
    chip: "bg-emerald-300/15 text-emerald-100 border-emerald-200/20",
    ctaDark:
      "bg-emerald-300 text-slate-950 hover:bg-emerald-200 shadow-emerald-300/25",
    halo: "from-emerald-500/16 via-teal-400/10 to-sky-500/10",
  },
  {
    rail: "from-sky-300 via-cyan-300 to-indigo-300",
    chip: "bg-sky-300/15 text-sky-100 border-sky-200/20",
    ctaDark: "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/25",
    halo: "from-sky-500/18 via-cyan-400/10 to-indigo-500/10",
  },
  {
    rail: "from-violet-300 via-fuchsia-300 to-sky-300",
    chip: "bg-violet-300/15 text-violet-100 border-violet-200/20",
    ctaDark:
      "bg-violet-300 text-slate-950 hover:bg-violet-200 shadow-violet-300/25",
    halo: "from-violet-500/16 via-fuchsia-400/10 to-sky-500/10",
  },
];

export default function EducationRenderer({ chip, dark }: ExploreRendererProps) {
  const area = React.useMemo(() => asEducationArea(chip.area), [chip.area]);

  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  // Big lane shell (same vibe as Careers)
  const shell = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const accentGlow = `bg-gradient-to-br ${area.glowClass ?? ""}`;

  // Local feedback (UI-only)
  const [feedbackById, setFeedbackById] = React.useState<
    Record<string, Feedback>
  >({});

  function toggleFeedback(cardId: string, next: Feedback) {
    setFeedbackById((prev) => {
      const cur = prev[cardId];
      if (cur === next) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [cardId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [cardId]: next };
    });
  }

  const cards = Array.isArray(area.cards) ? area.cards : [];

  return (
    <section className="space-y-3">
      <div
        className={`relative overflow-hidden rounded-[32px] border px-5 py-4 shadow-sm backdrop-blur-xl sm:px-7 sm:py-5 ${shell}`}
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
          {cards.length ? (
            <div className="space-y-3">
              {cards.slice(0, 4).map((c, slotIdx) => {
                const a = EDU_ACCENTS[slotIdx] ?? EDU_ACCENTS[0];
                const spoken = splitSpokenParagraphs(c.short ?? "");
                const selected = feedbackById[c.id];

                const deepDiveHref = `/main/explore/education/${encodeURIComponent(
                  c.id
                )}`;

                const ctaLight =
                  "bg-amber-600 text-white hover:bg-amber-500 shadow-lg";

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
                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                            Level up
                          </span>

                          <div className={`text-base font-semibold ${titleC}`}>
                            <span className="mr-2" aria-hidden>
                              {c.icon ?? "🎓"}
                            </span>
                            {c.title}
                          </div>
                        </div>

                        {spoken.length ? (
                          <div className="mt-2 space-y-2">
                            {spoken.map((p, i) => (
                              <p key={i} className={`text-sm ${muted}`}>
                                {p}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {/* Quick check + Deep dive CTA */}
                      <div className="mt-4">
                        <div
                          className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                            dark ? "text-slate-300/60" : "text-slate-500"
                          }`}
                        >
                          Quick check
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => toggleFeedback(c.id, "agree")}
                            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                              selected === "agree"
                                ? "border-emerald-400 bg-emerald-400/30 text-emerald-50 ring-2 ring-emerald-400/40"
                                : dark
                                ? "border-emerald-200/15 bg-emerald-300/10 text-emerald-50 hover:bg-emerald-300/15"
                                : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                            }`}
                          >
                            <span aria-hidden>👍</span>
                            {selected === "agree" ? "This fits ✓" : "This fits"}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleFeedback(c.id, "mixed")}
                            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                              selected === "mixed"
                                ? "border-amber-400 bg-amber-400/30 text-amber-50 ring-2 ring-amber-400/40"
                                : dark
                                ? "border-amber-200/15 bg-amber-300/10 text-amber-50 hover:bg-amber-300/15"
                                : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                            }`}
                          >
                            <span aria-hidden>🙂</span>
                            {selected === "mixed" ? "Kinda ✓" : "Kinda"}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleFeedback(c.id, "disagree")}
                            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                              selected === "disagree"
                                ? "border-rose-400 bg-rose-400/30 text-rose-50 ring-2 ring-rose-400/40"
                                : dark
                                ? "border-rose-200/15 bg-rose-300/10 text-rose-50 hover:bg-rose-300/15"
                                : "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100"
                            }`}
                          >
                            <span aria-hidden>👎</span>
                            {selected === "disagree" ? "Nope ✓" : "Nope"}
                          </button>
                        </div>

                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                          <div className="flex w-full flex-col items-stretch sm:w-auto">
                            <Link
                              href={deepDiveHref}
                              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition active:scale-95 sm:w-auto ${
                                dark
                                  ? `${a.ctaDark} shadow-[0_12px_34px_rgba(0,0,0,0.35)]`
                                  : ctaLight
                              }`}
                            >
                              Show me the real options{" "}
                              <ArrowRight className="h-4 w-4" />
                            </Link>

                            <div
                              className={`mt-2 text-center text-[0.72rem] ${
                                dark ? "text-white/55" : "text-slate-600"
                              }`}
                            >
                              Local + online ideas (ZIP later)
                            </div>
                          </div>
                        </div>

                        {selected ? (
                          <div
                            className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold ${
                              dark ? "text-white/60" : "text-slate-600"
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Noted.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`rounded-2xl border p-5 ${
                dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
              }`}
            >
              <div className={`text-sm font-semibold ${titleC}`}>
                No education items yet
              </div>
              <div className={`mt-1 text-sm ${muted}`}>
                Add items to{" "}
                <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
                <span className="font-mono text-[0.9em]">
                  explore/content/education.ts
                </span>
                .
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
