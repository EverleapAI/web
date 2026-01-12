// src/app/main/explore/renderers/RecommendationsRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, CheckCircle2, Sparkles } from "lucide-react";

import type { ExploreRendererProps } from "../content/types";
import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

import FeedbackModal from "../components/FeedbackModal";

import {
  createExploreBatchFromRecommendations,
  initializeExploreFeedbackStore,
  subscribeExploreFeedbackStore,
  getAndMarkVisibleRecommendations,
  recordFeedback,
  shouldSuggestRecalibrate,
  requestRecalibration,
  getExploreFeedbackState,
  supersedeWithNewBatch,
  getLatestFeedbackForRecommendation,
  clearFeedbackForRecommendation,
} from "../state/feedbackStore";

/* ============================================================================
   Explore › RecommendationsRenderer
   - NO arrow nav controls (top lane pills handle navigation)
   - NO “Pick one / Dive deeper / Tell us” mini-pills (redundant)
   - Removes redundant lane header inside this renderer
   - Per-card feedback buttons live right above “Dive deeper”
   - Removes “Because:” line (too system-y)
   - Keeps “what this is” explainer line before the vibe line
   - Keeps Dive deeper (core feature)
============================================================================ */

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
  return `/main/career/${encodeURIComponent(laneId)}?mode=explore`;
}

type PendingFeedback =
  | { rec: RecommendationItem; response: FeedbackResponse }
  | null;

type AckState =
  | { kind: "comment_disagree"; feedbackId: string; message: string }
  | null;

/* ============================================================================
   Minimal typing for the lane “area”
============================================================================ */

type ExploreRecommendationCard = {
  id: string;
  title: string;
  short: string;
  icon?: string;
};

type ExploreNextMove = {
  id: string;
  title: string;
  blurb: string;
};

type ExploreRecommendationsArea = {
  glowClass?: string;
  headline?: string;
  summary?: string;
  hint?: string;
  signals?: string[];
  cards?: ExploreRecommendationCard[];
  nextMoves?: ExploreNextMove[];
};

function asRecommendationsArea(input: unknown): ExploreRecommendationsArea {
  const obj = (input ?? {}) as Record<string, unknown>;

  const toStrArr = (v: unknown): string[] | undefined =>
    Array.isArray(v) ? v.map((x) => String(x)) : undefined;

  const toCards = (v: unknown): ExploreRecommendationCard[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: ExploreRecommendationCard[] = [];
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

  const toMoves = (v: unknown): ExploreNextMove[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: ExploreNextMove[] = [];
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
    signals: toStrArr(obj.signals),
    cards: toCards(obj.cards),
    nextMoves: toMoves(obj.nextMoves),
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function mapCardsToRecommendations(
  chipId: string,
  area: ExploreRecommendationsArea
): RecommendationItem[] {
  const runId = `explore_${chipId}`;
  const generatedAt = nowIso();
  const cards = Array.isArray(area.cards) ? area.cards : [];
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const tags: string[] = signals.map((s) => s.trim()).filter(Boolean);

  return cards.map((c, idx) => {
    const laneId = String(c.id ?? `lane_${idx}`);
    const recId = `explore.recommendations.${laneId}.v1`;

    return {
      recId,
      claimId: recId,
      source: "explore",
      domain: "career",
      title: String(c.title ?? "Recommendation"),
      summary: String(c.short ?? ""),
      why: signals.length
        ? signals.slice(0, 3)
        : ["A good next experiment based on your answers."],
      nextStep: area.hint ? String(area.hint) : undefined,
      tags,
      signals: undefined,
      modelScore: 0.5,
      constraints: [],
      antiFit: [],
      generationRunId: runId,
      generatedAt,
      model: "placeholder",
    };
  });
}

function laneIdFromRec(rec: RecommendationItem): string {
  const parts = rec.recId.split(".");
  return parts.length >= 4 ? parts[2] : rec.recId;
}

/* ============================================================================
   “What this is” explainer line (simple + human; can be replaced with data later)
============================================================================ */

function roleExplainer(title: string): string {
  const t = title.toLowerCase();

  if (t.includes("product") && (t.includes("ux") || t.includes("ui"))) {
    return "Product UX is designing how an app feels: flows, screens, wording, and the little details people notice.";
  }
  if (t.includes("software") || t.includes("developer") || t.includes("engineer")) {
    return "Software is building and improving apps and tools using code.";
  }
  if (t.includes("data") && (t.includes("science") || t.includes("analyst"))) {
    return "Data work is turning messy info into clear insights and better decisions.";
  }
  if (t.includes("marketing") || t.includes("brand")) {
    return "Marketing is helping the right people discover something and actually care.";
  }
  if (t.includes("sales")) {
    return "Sales is understanding what someone needs and matching them with a solution.";
  }
  if (t.includes("founder") || t.includes("startup") || t.includes("entrepreneur")) {
    return "This is the “build something real” path: test, ship, learn, repeat.";
  }
  if (t.includes("product manager") || t.includes("pm")) {
    return "Product management is deciding what to build next and getting a team to ship it.";
  }

  return "A direction to explore — what you’d do, who you’d help, and what skills it uses.";
}

export default function RecommendationsRenderer({ chip, dark }: ExploreRendererProps) {
  const area = asRecommendationsArea(chip.area);

  const [visible, setVisible] = React.useState<RecommendationItem[]>([]);
  const [pending, setPending] = React.useState<PendingFeedback>(null);
  const [ack, setAck] = React.useState<AckState>(null);

  const shell = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";
  const micro = dark ? "text-slate-300/70" : "text-slate-600/80";

  const accentGlow = `bg-gradient-to-br ${area.glowClass ?? ""}`;

  React.useEffect(() => {
    const recs = mapCardsToRecommendations(chip.id, area);
    const runId = `explore_${chip.id}`;

    const current = getExploreFeedbackState();

    if (current.batch && current.batch.generationRunId !== runId) {
      const newBatch = createExploreBatchFromRecommendations(recs, runId);
      supersedeWithNewBatch(newBatch);
    } else if (!current.batch) {
      const batch = createExploreBatchFromRecommendations(recs, runId);
      initializeExploreFeedbackStore(batch);
    }

    const unsub = subscribeExploreFeedbackStore(() => {
      setVisible(getAndMarkVisibleRecommendations());
    });

    setVisible(getAndMarkVisibleRecommendations());
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chip.id]);

  const state = getExploreFeedbackState();
  const batchStatus = state.batch?.status ?? "active";
  const suggestRecal = shouldSuggestRecalibrate();

  function openFeedback(rec: RecommendationItem, response: FeedbackResponse) {
    const existing = getLatestFeedbackForRecommendation(rec.recId);

    // If user taps the same pill again → clear feedback + reset pills
    if (existing && existing.response === response) {
      clearFeedbackForRecommendation(rec.recId);
      setVisible(getAndMarkVisibleRecommendations());
      return;
    }

    // Otherwise open modal
    setPending({ rec, response });
  }

  function closeModal() {
    setPending(null);
  }

  function handleRecalibrate() {
    setAck(null);
    requestRecalibration();
    setVisible(getAndMarkVisibleRecommendations());
  }

  function submitModal(payload: {
    response: FeedbackResponse;
    comment: string | null;
    reasons?: string[];
  }) {
    if (!pending) return;

    const fb = recordFeedback({
      rec: pending.rec,
      response: payload.response,
      comment: payload.comment,
    });

    if (fb && fb.response === "disagree" && (fb.comment?.trim() ?? "").length) {
      setAck({
        kind: "comment_disagree",
        feedbackId: fb.feedbackId,
        message: "Got it — want me to recalibrate your suggestions based on what you wrote?",
      });
    }

    setPending(null);
    setVisible(getAndMarkVisibleRecommendations());
  }

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
          {/* ✅ Removed redundant header (page.tsx already provides the lane header) */}

          {/* Acknowledgement + recalibrate (only when relevant) */}
          {ack ? (
            <div
              className={`rounded-2xl border px-4 py-3 ${
                dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className={`${dark ? "text-slate-200" : "text-slate-800"} mt-0.5 h-5 w-5`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-semibold ${titleC}`}>Thanks — noted</div>
                  <div className={`mt-1 text-sm ${muted}`}>{ack.message}</div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRecalibrate}
                      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                        dark
                          ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                          : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                      }`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Recalibrate
                    </button>

                    <button
                      type="button"
                      onClick={() => setAck(null)}
                      className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                        dark
                          ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                          : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
                      }`}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {suggestRecal && batchStatus === "active" && !ack ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleRecalibrate}
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition active:scale-95 ${
                  dark
                    ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                Recalibrate
              </button>

              <div className={`text-xs ${dark ? "text-slate-300/55" : "text-slate-500"}`}>
                Uses your feedback to tune what shows up next.
              </div>
            </div>
          ) : null}

          {/* Cards */}
          {visible.length ? (
            <div className={`${suggestRecal || ack ? "mt-4" : ""} space-y-3`}>
              {visible.slice(0, 4).map((rec, slotIdx) => {
                const a = REC_ACCENTS[slotIdx] ?? REC_ACCENTS[0];
                const laneId = laneIdFromRec(rec);
                const whatItIs = roleExplainer(rec.title);

                const feedback = getLatestFeedbackForRecommendation(rec.recId);
                const locked = Boolean(feedback);
                const selected = feedback?.response;

                return (
                  <div
                    key={rec.recId}
                    className={`relative overflow-hidden rounded-3xl border p-[1px] ${
                      dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                    }`}
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo}`} />
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute left-0 top-4 h-[70%] w-[3px] rounded-full bg-gradient-to-b ${a.rail} opacity-90`}
                    />

                    <div className={`relative rounded-3xl px-5 py-4 ${dark ? "bg-slate-950/35" : "bg-white/70"}`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                              dark ? `border-white/10 ${a.chip}` : "border-slate-200 bg-white text-slate-800"
                            }`}
                          >
                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                            Try this
                          </span>

                          <div className={`text-base font-semibold ${titleC}`}>
                            <span className="mr-2" aria-hidden>
                              {"🧭"}
                            </span>
                            {rec.title}
                          </div>
                        </div>

                        {/* 1) What it is */}
                        <div className={`mt-2 text-sm ${muted}`}>{whatItIs}</div>

                        {/* 2) Vibe / energy line (your narrative lives here) */}
                        {rec.summary ? <div className={`mt-2 text-sm ${muted}`}>{rec.summary}</div> : null}

                        {area.hint ? (
                          <div className={`mt-3 text-xs ${micro}`}>
                            <span className="font-semibold">Note:</span> {area.hint}
                          </div>
                        ) : null}
                      </div>

                      {/* Feedback (right above Dive deeper) */}
                      <div className="mt-4">
                        <div
                          className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                            dark ? "text-slate-300/60" : "text-slate-500"
                          }`}
                        >
                          Quick check
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {/* 👍 This fits */}
                          <button
                            type="button"
                            disabled={locked && selected !== "agree"}
                            onClick={() => openFeedback(rec, "agree")}
                            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                              selected === "agree"
                                ? "border-emerald-400 bg-emerald-400/30 text-emerald-50 ring-2 ring-emerald-400/40"
                                : locked
                                ? "opacity-40 cursor-not-allowed"
                                : dark
                                ? "border-emerald-200/15 bg-emerald-300/10 text-emerald-50 hover:bg-emerald-300/15"
                                : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                            }`}
                          >
                            <span aria-hidden>👍</span>
                            {selected === "agree" ? "This fits ✓" : "This fits"}
                          </button>

                          {/* 🙂 Kinda */}
                          <button
                            type="button"
                            disabled={locked && selected !== "mixed"}
                            onClick={() => openFeedback(rec, "mixed")}
                            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                              selected === "mixed"
                                ? "border-amber-400 bg-amber-400/30 text-amber-50 ring-2 ring-amber-400/40"
                                : locked
                                ? "opacity-40 cursor-not-allowed"
                                : dark
                                ? "border-amber-200/15 bg-amber-300/10 text-amber-50 hover:bg-amber-300/15"
                                : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                            }`}
                          >
                            <span aria-hidden>🙂</span>
                            {selected === "mixed" ? "Kinda ✓" : "Kinda"}
                          </button>

                          {/* 👎 Nope */}
                          <button
                            type="button"
                            disabled={locked && selected !== "disagree"}
                            onClick={() => openFeedback(rec, "disagree")}
                            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                              selected === "disagree"
                                ? "border-rose-400 bg-rose-400/30 text-rose-50 ring-2 ring-rose-400/40"
                                : locked
                                ? "opacity-40 cursor-not-allowed"
                                : dark
                                ? "border-rose-200/15 bg-rose-300/10 text-rose-50 hover:bg-rose-300/15"
                                : "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100"
                            }`}
                          >
                            <span aria-hidden>👎</span>
                            {selected === "disagree" ? "Nope ✓" : "Nope"}
                          </button>
                        </div>

                        {/* Dive deeper (core feature) */}
                        <Link
                          href={careerDeepHref(laneId)}
                          className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition active:scale-95 ${
                            dark
                              ? `${a.ctaDark} shadow-[0_12px_34px_rgba(0,0,0,0.35)]`
                              : "bg-sky-600 text-white hover:bg-sky-500"
                          }`}
                        >
                          Dive deeper <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`mt-4 rounded-2xl border p-5 ${dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}`}>
              <div className={`text-sm font-semibold ${titleC}`}>No recommendations yet</div>
              <div className={`mt-1 text-sm ${muted}`}>
                Add items to <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
                <span className="font-mono text-[0.9em]">explore/content/recommendations.ts</span>.
              </div>
            </div>
          )}
        </div>
      </div>

      <FeedbackModal
        open={Boolean(pending)}
        onClose={closeModal}
        rec={pending?.rec ?? null}
        response={pending?.response ?? null}
        onSubmit={submitModal}
        showReasons={false}
      />
    </section>
  );
}
