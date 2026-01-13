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
   - page.tsx owns the lane shell (one border like Insights)
   - this renderer outputs ONLY: ack/recal + recommendation cards + modal

   IMPORTANT:
   - feedbackStore caches a "batch" and only refreshes when generationRunId changes.
   - we include a stable hash of current content in runId so copy edits show instantly.
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
    // toned down vs before
    halo: "from-sky-500/10 via-cyan-400/6 to-indigo-500/6",
  },
  {
    rail: "from-emerald-300 via-teal-300 to-sky-300",
    chip: "bg-emerald-300/15 text-emerald-100 border-emerald-200/20",
    ctaDark:
      "bg-emerald-300 text-slate-950 hover:bg-emerald-200 shadow-emerald-300/25",
    halo: "from-emerald-500/9 via-teal-400/6 to-sky-500/6",
  },
  {
    rail: "from-amber-300 via-orange-300 to-rose-300",
    chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
    ctaDark:
      "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
    halo: "from-amber-500/9 via-orange-400/6 to-rose-500/6",
  },
  {
    rail: "from-violet-300 via-fuchsia-300 to-sky-300",
    chip: "bg-violet-300/15 text-violet-100 border-violet-200/20",
    ctaDark:
      "bg-violet-300 text-slate-950 hover:bg-violet-200 shadow-violet-300/25",
    halo: "from-violet-500/9 via-fuchsia-400/6 to-sky-500/6",
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
   Minimal typing for chip.area
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

/**
 * Stable lightweight hash → base36.
 * Used ONLY to invalidate cached batches when copy changes.
 */
function hashString(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function areaSignature(area: ExploreRecommendationsArea): string {
  const cards = Array.isArray(area.cards) ? area.cards : [];
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const hint = area.hint ?? "";

  const payload =
    `hint:${hint}||signals:${signals.join("|")}||cards:` +
    cards
      .map((c) => `${c.id}~${c.title}~${c.icon ?? ""}~${c.short}`)
      .join("||");

  return hashString(payload);
}

function mapCardsToRecommendations(
  chipId: string,
  area: ExploreRecommendationsArea,
  runId: string
): RecommendationItem[] {
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

function iconForLane(area: ExploreRecommendationsArea, laneId: string): string {
  const cards = Array.isArray(area.cards) ? area.cards : [];
  const match = cards.find((c) => String(c.id) === laneId);
  return match?.icon && typeof match.icon === "string" ? match.icon : "🧭";
}

/**
 * Render summary as spoken paragraphs:
 * - Primary separator: blank line blocks (\n\n)
 * - Fallback: single newlines (\n)
 *
 * Also: strip any legacy "Tiny test:" line(s) from authored copy,
 * because Tiny Tests now live in a dedicated UI block below.
 */
function splitSpokenParagraphs(input: string): string[] {
  const raw = String(input ?? "");
  const normalized = raw.replace(/\r\n/g, "\n");

  const withoutTiny = normalized
    .split("\n")
    .filter((line) => !/^\s*tiny test\s*:/i.test(line.trim()))
    .join("\n")
    .trim();

  const blocks = withoutTiny
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (blocks.length > 1) return blocks;

  const lines = withoutTiny
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : [];
}

/* ============================================================================
   Tiny Tests (career-specific placeholders)
============================================================================ */

type TinyTest = {
  title: string;
  steps: string[];
  eta: string;
};

const TINY_TESTS: Record<string, TinyTest> = {
  productUx: {
    title: "Tiny test: redesign one real screen",
    eta: "20–30 min",
    steps: [
      "Pick one app you use daily.",
      "Screenshot one confusing screen.",
      "Sketch a cleaner version (paper is fine).",
      "Show it to 2 people: “Which is clearer and why?”",
    ],
  },
  healthHumanSupport: {
    title: "Tiny test: do one small ‘help’ shift",
    eta: "30–45 min",
    steps: [
      "Find a simple way to help someone today (family, neighbor, teammate).",
      "Ask: “What would make this easier right now?”",
      "Do the smallest helpful thing.",
      "Write 2 lines: “What felt good / what felt heavy.”",
    ],
  },
  educationCommunityPrograms: {
    title: "Tiny test: teach one micro-thing",
    eta: "20–30 min",
    steps: [
      "Pick something you’re decent at (study trick, sport move, app feature).",
      "Teach it to someone in 10 minutes.",
      "Notice what confused them.",
      "Write 3 improvements for how you’d teach it next time.",
    ],
  },
  independentBuilder: {
    title: "Tiny test: ship a mini thing in public",
    eta: "30–60 min",
    steps: [
      "Pick a tiny idea (template, checklist, mini tutorial, simple webpage).",
      "Build the smallest version.",
      "Post it somewhere (text, IG story, small community, friend group).",
      "Track reactions: “What did people ask for?”",
    ],
  },
  dataAi: {
    title: "Tiny test: find a pattern from real data",
    eta: "25–40 min",
    steps: [
      "Pick 1 question (sleep vs mood, practice time vs results, screen time, etc.).",
      "Track it for 3 days (notes app is fine).",
      "Make one mini chart or bullet summary.",
      "Write 1 hypothesis you’d test next.",
    ],
  },
  operationsProjects: {
    title: "Tiny test: make a process 20% smoother",
    eta: "20–35 min",
    steps: [
      "Pick one annoying process (homework flow, team scheduling, chores, practice).",
      "List the steps (even if messy).",
      "Remove 1 step OR make 1 step easier.",
      "Test it once and note what improved.",
    ],
  },
  creativeStorytelling: {
    title: "Tiny test: tell the same story 3 ways",
    eta: "25–45 min",
    steps: [
      "Pick a real moment (win, fail, awkward, proud).",
      "Write it as: 1) short text 2) 15-sec script 3) 5-image storyboard.",
      "Share one version with a friend.",
      "Ask: “What did you feel?”",
    ],
  },
  businessPartnerships: {
    title: "Tiny test: do 5 problem interviews",
    eta: "30–45 min",
    steps: [
      "Pick a topic (school stress, fitness, transportation, team stuff).",
      "Ask 5 people: “What’s annoying about this?”",
      "Write the top 3 repeated problems.",
      "Propose 1 simple solution and see reactions.",
    ],
  },
};

function tinyTestForLane(laneId: string): TinyTest {
  const fallback: TinyTest = {
    title: "Tiny test: try one micro-skill",
    eta: "15–25 min",
    steps: [
      "Pick 1 micro-skill tied to this direction.",
      "Try it for 15 minutes.",
      "Rate it: 🔥 / 🙂 / 😬",
      "Write 1 sentence: “Do I want more of this?”",
    ],
  };
  return TINY_TESTS[laneId] ?? fallback;
}

export default function RecommendationsRenderer({
  chip,
  dark,
}: ExploreRendererProps) {
  const area = React.useMemo(() => asRecommendationsArea(chip.area), [chip.area]);

  const [visible, setVisible] = React.useState<RecommendationItem[]>([]);
  const [pending, setPending] = React.useState<PendingFeedback>(null);
  const [ack, setAck] = React.useState<AckState>(null);

  // Save to Actions (UI-only for now)
  const [savedTinyByRec, setSavedTinyByRec] = React.useState<
    Record<string, boolean>
  >({});
  const [justSavedRecId, setJustSavedRecId] = React.useState<string | null>(null);

  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  React.useEffect(() => {
    const areaNow = asRecommendationsArea(chip.area);
    const sigNow = areaSignature(areaNow);

    const runId = `explore_${chip.id}_${sigNow}`;
    const recs = mapCardsToRecommendations(chip.id, areaNow, runId);

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
  }, [chip.id, chip.area]); // ✅ constant length; HMR-safe

  const state = getExploreFeedbackState();
  const batchStatus = state.batch?.status ?? "active";
  const suggestRecal = shouldSuggestRecalibrate();

  function openFeedback(rec: RecommendationItem, response: FeedbackResponse) {
    const existing = getLatestFeedbackForRecommendation(rec.recId);

    if (existing && existing.response === response) {
      clearFeedbackForRecommendation(rec.recId);
      setVisible(getAndMarkVisibleRecommendations());
      return;
    }

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
        message:
          "Got it — want me to recalibrate your suggestions based on what you wrote?",
      });
    }

    setPending(null);
    setVisible(getAndMarkVisibleRecommendations());
  }

  function onSaveTinyTest(rec: RecommendationItem, laneId: string) {
    // UI-only now — later we’ll route this into an Actions store.
    setSavedTinyByRec((prev) => ({ ...prev, [rec.recId]: true }));
    setJustSavedRecId(rec.recId);
    window.setTimeout(() => {
      setJustSavedRecId((cur) => (cur === rec.recId ? null : cur));
    }, 1400);

    console.log("[TinyTest] save-to-actions (placeholder)", {
      recId: rec.recId,
      laneId,
      title: rec.title,
      tinyTest: tinyTestForLane(laneId),
    });
  }

  return (
    <section className="space-y-3">
      {/* ACK + RECALIBRATE live INSIDE the lane shell (page.tsx) now */}
      {ack ? (
        <div
          className={`rounded-2xl border px-4 py-3 ${
            dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
          }`}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className={`${dark ? "text-slate-200" : "text-slate-800"} mt-0.5 h-5 w-5`}
            />
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

      {visible.length ? (
        <div className="space-y-3">
          {visible.slice(0, 4).map((rec, slotIdx) => {
            const a = REC_ACCENTS[slotIdx] ?? REC_ACCENTS[0];
            const laneId = laneIdFromRec(rec);

            const feedback = getLatestFeedbackForRecommendation(rec.recId);
            const locked = Boolean(feedback);
            const selected = feedback?.response;

            const icon = iconForLane(area, laneId);
            const spoken = rec.summary ? splitSpokenParagraphs(rec.summary) : [];

            const tiny = tinyTestForLane(laneId);
            const tinySaved = Boolean(savedTinyByRec[rec.recId]);
            const tinyJustSaved = justSavedRecId === rec.recId;

            return (
              <div
                key={rec.recId}
                className={`relative overflow-hidden rounded-3xl border p-[1px] ${
                  dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                }`}
              >
                {/* smaller, darker halo (less “wash out”) */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo}`} />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-4 h-[70%] w-[3px] rounded-full bg-gradient-to-b ${a.rail} opacity-80`}
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
                        Try this
                      </span>

                      <div className={`text-base font-semibold ${titleC}`}>
                        <span className="mr-2" aria-hidden>
                          {icon}
                        </span>
                        {rec.title}
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

                  {/* Tiny Test */}
                  <div className="mt-4">
                    <div
                      className={`flex items-center justify-between gap-3 ${
                        dark ? "text-slate-300/60" : "text-slate-500"
                      }`}
                    >
                      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em]">
                        Tiny test
                      </div>

                      <button
                        type="button"
                        onClick={() => onSaveTinyTest(rec, laneId)}
                        disabled={tinySaved}
                        className={`shrink-0 inline-flex items-center justify-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                          tinySaved
                            ? dark
                              ? "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
                              : "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                            : dark
                            ? "border-white/10 bg-slate-950/40 text-white hover:bg-slate-950/60"
                            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {tinySaved ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Saved ✓
                          </>
                        ) : (
                          <>
                            <span aria-hidden>🗂️</span>
                            Save to Actions
                          </>
                        )}
                      </button>
                    </div>

                    <div
                      className={`mt-2 rounded-2xl border p-3 ${
                        dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                      }`}
                    >
                      <div className={`text-sm font-semibold ${titleC}`}>{tiny.title}</div>

                      <div className="mt-2 space-y-1.5">
                        {tiny.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span
                              className={`mt-[0.18rem] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold ${
                                dark
                                  ? "border-white/10 bg-white/5 text-white/70"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                              aria-hidden
                            >
                              {i + 1}
                            </span>
                            <div className={`text-sm ${muted}`}>{step}</div>
                          </div>
                        ))}
                      </div>

                      <div className={`mt-2 text-xs font-semibold ${dark ? "text-white/55" : "text-slate-600"}`}>
                        Time: {tiny.eta}
                      </div>

                      {tinySaved ? (
                        <div className={`mt-2 text-xs font-semibold ${dark ? "text-white/60" : "text-slate-600"}`}>
                          In your Actions tab as a to-do.
                        </div>
                      ) : tinyJustSaved ? (
                        <div className={`mt-2 text-xs font-semibold ${dark ? "text-white/70" : "text-slate-700"}`}>
                          ✅ Added to Actions
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Feedback + Dive deeper */}
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
                        disabled={locked && selected !== "agree"}
                        onClick={() => openFeedback(rec, "agree")}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                          selected === "agree"
                            ? "border-emerald-400 bg-emerald-400/25 text-emerald-50 ring-2 ring-emerald-400/30"
                            : locked
                            ? "opacity-40 cursor-not-allowed"
                            : dark
                            ? "border-emerald-200/12 bg-emerald-300/8 text-emerald-50 hover:bg-emerald-300/12"
                            : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                        }`}
                      >
                        <span aria-hidden>👍</span>
                        {selected === "agree" ? "This fits ✓" : "This fits"}
                      </button>

                      <button
                        type="button"
                        disabled={locked && selected !== "mixed"}
                        onClick={() => openFeedback(rec, "mixed")}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                          selected === "mixed"
                            ? "border-amber-400 bg-amber-400/25 text-amber-50 ring-2 ring-amber-400/30"
                            : locked
                            ? "opacity-40 cursor-not-allowed"
                            : dark
                            ? "border-amber-200/12 bg-amber-300/8 text-amber-50 hover:bg-amber-300/12"
                            : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                        }`}
                      >
                        <span aria-hidden>🙂</span>
                        {selected === "mixed" ? "Kinda ✓" : "Kinda"}
                      </button>

                      <button
                        type="button"
                        disabled={locked && selected !== "disagree"}
                        onClick={() => openFeedback(rec, "disagree")}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                          selected === "disagree"
                            ? "border-rose-400 bg-rose-400/25 text-rose-50 ring-2 ring-rose-400/30"
                            : locked
                            ? "opacity-40 cursor-not-allowed"
                            : dark
                            ? "border-rose-200/12 bg-rose-300/8 text-rose-50 hover:bg-rose-300/12"
                            : "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100"
                        }`}
                      >
                        <span aria-hidden>👎</span>
                        {selected === "disagree" ? "Nope ✓" : "Nope"}
                      </button>
                    </div>

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
        <div
          className={`rounded-2xl border p-5 ${
            dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
          }`}
        >
          <div className={`text-sm font-semibold ${titleC}`}>No recommendations yet</div>
          <div className={`mt-1 text-sm ${muted}`}>
            Add items to <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
            <span className="font-mono text-[0.9em]">
              explore/content/recommendations.ts
            </span>
            .
          </div>
        </div>
      )}

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
