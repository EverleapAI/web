// src/app/main/explore/renderers/RecommendationsRenderer.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

import type { ExploreRendererProps, VisualBreak } from "../content/types";
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

type RecAccent = {
  rail: string;
  chip: string;
  ctaDark: string;
  halo: string;
};

const REC_ACCENTS: RecAccent[] = [
  // #1 — Sky / Cyan / Indigo
  {
    rail: "from-sky-300 via-cyan-300 to-indigo-300",
    chip: "bg-sky-300/15 text-sky-100 border-sky-200/20",
    ctaDark: "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/25",
    halo: "from-sky-500/10 via-cyan-400/6 to-indigo-500/6",
  },
  // #2 — Amber / Orange / Rose
  {
    rail: "from-amber-300 via-orange-300 to-rose-300",
    chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
    ctaDark:
      "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
    halo: "from-amber-500/9 via-orange-400/6 to-rose-500/6",
  },
  // #3 — Emerald / Teal / Sky
  {
    rail: "from-emerald-300 via-teal-300 to-sky-300",
    chip: "bg-emerald-300/15 text-emerald-100 border-emerald-200/20",
    ctaDark:
      "bg-emerald-300 text-slate-950 hover:bg-emerald-200 shadow-emerald-300/25",
    halo: "from-emerald-500/9 via-teal-400/6 to-sky-500/6",
  },
  // #4 — Violet / Fuchsia / Sky
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

type ExploreRecommendationCard = {
  id: string;
  title: string;
  short: string;
  icon?: string;
  why?: string[];
  hint?: string;
  tags?: string[];
  visualBreak?: VisualBreak;
};

type ExploreRecommendationsArea = {
  hint?: string;
  signals?: string[];
  cards?: ExploreRecommendationCard[];
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

      const why = Array.isArray(it?.why)
        ? (it.why as unknown[]).map((x) => String(x))
        : undefined;

      const hint = typeof it?.hint === "string" ? it.hint : undefined;

      const tags = Array.isArray(it?.tags)
        ? (it.tags as unknown[]).map((x) => String(x))
        : undefined;

      const visualBreak =
        typeof it?.visualBreak === "object" && it.visualBreak
          ? (it.visualBreak as VisualBreak)
          : undefined;

      if (id && title)
        out.push({ id, title, short, icon, why, hint, tags, visualBreak });
    }

    return out;
  };

  return {
    hint: typeof obj.hint === "string" ? obj.hint : undefined,
    signals: toStrArr(obj.signals),
    cards: toCards(obj.cards),
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function hashString(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/**
 * IMPORTANT:
 * We include why/hint/tags AND visualBreak so the feedbackStore batch refreshes
 * when copy/visuals change (otherwise it can “stick”).
 */
function areaSignature(area: ExploreRecommendationsArea): string {
  const cards = Array.isArray(area.cards) ? area.cards : [];
  const payload =
    "cards:" +
    cards
      .map((c) => {
        const why = Array.isArray(c.why) ? c.why.join("|") : "";
        const tags = Array.isArray(c.tags) ? c.tags.join("|") : "";
        const vb = c.visualBreak?.asset?.src
          ? `vb:${c.visualBreak.asset.kind ?? ""}|${c.visualBreak.asset.src}|${
              c.visualBreak.asset.alt
            }`
          : "vb:";
        return `${c.id}~${c.title}~${c.icon ?? ""}~${c.short}~why:${why}~hint:${
          c.hint ?? ""
        }~tags:${tags}~${vb}`;
      })
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

  // Lane-level are OPTIONAL fallbacks only
  const laneSignals = Array.isArray(area.signals) ? area.signals : [];
  const laneHint = typeof area.hint === "string" ? area.hint.trim() : "";

  return cards.map((c, idx) => {
    const laneId = String(c.id ?? `lane_${idx}`);
    const recId = `explore.recommendations.${laneId}.v1`;

    const cardWhy = Array.isArray(c.why)
      ? c.why.map((s) => String(s).trim()).filter(Boolean).slice(0, 3)
      : [];

    const cardTags = Array.isArray(c.tags)
      ? c.tags.map((s) => String(s).trim()).filter(Boolean)
      : [];

    const fallbackWhy = laneSignals
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 3);

    return {
      recId,
      claimId: recId,
      source: "explore",
      domain: "career",
      title: String(c.title ?? "Recommendation"),
      summary: String(c.short ?? ""),

      // ✅ card-specific first, lane-level only as a fallback
      why: cardWhy.length
        ? cardWhy
        : fallbackWhy.length
        ? fallbackWhy
        : ["Based on your answers so far."],
      nextStep:
        typeof c.hint === "string" && c.hint.trim()
          ? c.hint.trim()
          : laneHint
          ? laneHint
          : undefined,
      tags: cardTags.length ? cardTags : [],

      // ✅ carry visualBreak through for rendering
      visualBreak: c.visualBreak,

      signals: undefined,
      modelScore: 0.5,
      constraints: [],
      antiFit: [],
      generationRunId: runId,
      generatedAt,
      model: "placeholder",
    } as RecommendationItem & { visualBreak?: VisualBreak };
  });
}

function laneIdFromRec(rec: RecommendationItem): string {
  const parts = rec.recId.split(".");
  return parts.length >= 4 ? parts[2] : rec.recId;
}

function splitSpokenParagraphs(input: string): string[] {
  const raw = String(input ?? "");
  const normalized = raw.replace(/\r\n/g, "\n");

  // Keep your narratives clean if they include “Tiny test:” lines
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

type TinyTest = {
  title: string;
  steps: string[];
  eta: string;
};

const TINY_TESTS: Record<string, TinyTest> = {
  // ✅ NEW — Game Designer
  gameDesigner: {
    title: "Tiny task: change one rule",
    eta: "10–20 min",
    steps: [
      "Pick a simple game you already know (cards, sport drill, phone game).",
      "Change ONE rule.",
      "Predict how the feeling changes (easier/harder, calmer/more tense, more/less fun).",
      "Ask a friend which version they’d rather play — and why.",
    ],
  },

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

/**
 * Fix the awkward phrasing:
 * This function must *finish* the “If you’re the type who likes…” lead-in.
 */
function teenCoachWhy(why: string[]): string {
  const bits = (why ?? [])
    .map((s) => String(s).trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!bits.length) return "it matches the vibe of how you’ve been answering.";

  const clean = (s: string) => s.replace(/[.]+$/, "");

  if (bits.length === 1) return `${clean(bits[0])}, this usually clicks.`;

  return `${clean(bits[0])} and ${clean(bits[1])}, this usually clicks.`;
}

function VisualBreakBlock({
  visual,
  dark,
}: {
  visual: VisualBreak;
  dark: boolean;
}) {
  const src = (visual?.asset?.src ?? "").trim();
  const alt = String(visual?.asset?.alt ?? "").trim();
  if (!src) return null;

  return (
    <div className="mt-3">
      <div
        className={`overflow-hidden rounded-2xl border ${
          dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="relative h-[140px] w-full sm:h-[160px] lg:h-[180px]">
          {/* NOTE: unoptimized avoids needing remotePatterns while you prototype */}
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
            loading="lazy"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsRenderer({
  chip,
  dark,
}: ExploreRendererProps) {
  const [visible, setVisible] = React.useState<RecommendationItem[]>([]);
  const [pending, setPending] = React.useState<PendingFeedback>(null);
  const [ack, setAck] = React.useState<AckState>(null);

  const [savedTinyByRec, setSavedTinyByRec] = React.useState<
    Record<string, boolean>
  >({});
  const [justSavedRecId, setJustSavedRecId] = React.useState<string | null>(
    null
  );
  const [showStepsByRec, setShowStepsByRec] = React.useState<
    Record<string, boolean>
  >({});
  const [expandedRecId, setExpandedRecId] = React.useState<string | null>(null);

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
  }, [chip.id, chip.area]);

  const state = getExploreFeedbackState();
  const batchStatus = state.batch?.status ?? "active";
  const suggestRecal = shouldSuggestRecalibrate();

  function toggleExpanded(recId: string) {
    setExpandedRecId((cur) => (cur === recId ? null : recId));
  }

  function openFeedback(rec: RecommendationItem, response: FeedbackResponse) {
    const existing = getLatestFeedbackForRecommendation(rec.recId);

    // Tap the same choice again => clear it (nice “undo”)
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
        message: "Got it. Want me to tweak your next set based on what you wrote?",
      });
    }

    setPending(null);
    setVisible(getAndMarkVisibleRecommendations());
  }

  function onSaveTinyTest(rec: RecommendationItem, laneId: string) {
    setSavedTinyByRec((prev) => ({ ...prev, [rec.recId]: true }));
    setJustSavedRecId(rec.recId);
    window.setTimeout(() => {
      setJustSavedRecId((cur) => (cur === rec.recId ? null : cur));
    }, 1400);

    // placeholder wiring (no-op in production; keeps eslint happy)
    void rec;
    void laneId;
  }

  function toggleSteps(recId: string) {
    setShowStepsByRec((prev) => ({ ...prev, [recId]: !prev[recId] }));
  }

  // Shared button language (Tiny Task + Quick Check)
  const pillBase =
    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95";
  const pillNeutral = dark
    ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

  function pillSelected(kind: "agree" | "mixed" | "disagree") {
    if (dark) {
      if (kind === "agree")
        return "border-emerald-300/30 bg-emerald-300/10 text-emerald-50 ring-2 ring-emerald-300/25";
      if (kind === "mixed")
        return "border-amber-300/30 bg-amber-300/10 text-amber-50 ring-2 ring-amber-300/25";
      return "border-rose-300/30 bg-rose-300/10 text-rose-50 ring-2 ring-rose-300/25";
    }
    if (kind === "agree")
      return "border-emerald-200 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200/60";
    if (kind === "mixed")
      return "border-amber-200 bg-amber-50 text-amber-900 ring-2 ring-amber-200/60";
    return "border-rose-200 bg-rose-50 text-rose-900 ring-2 ring-rose-200/60";
  }

  const showRecalBanner =
    Boolean(suggestRecal) && batchStatus === "active" && !ack;

  return (
    <section className="space-y-3">
      {ack ? (
        <div
          className={`rounded-2xl border px-4 py-3 ${
            dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
          }`}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className={`${
                dark ? "text-slate-200" : "text-slate-800"
              } mt-0.5 h-5 w-5`}
            />
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-semibold ${titleC}`}>
                Okay — noted
              </div>
              <div className={`mt-1 text-sm ${muted}`}>{ack.message}</div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecalibrate}
                  className={`${pillBase} ${
                    dark
                      ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                      : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                  }`}
                >
                  Recalibrate
                </button>

                <button
                  type="button"
                  onClick={() => setAck(null)}
                  className={`${pillBase} ${pillNeutral}`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showRecalBanner ? (
        <div
          className={`rounded-2xl border px-4 py-3 ${
            dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                dark ? "bg-amber-300/80" : "bg-amber-500"
              }`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-semibold ${titleC}`}>
                Want a fresh set?
              </div>
              <div className={`mt-1 text-sm ${muted}`}>
                I can recalibrate based on what you’ve liked/disliked so far.
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecalibrate}
                  className={`${pillBase} ${
                    dark
                      ? "border-amber-300/30 bg-amber-300/10 text-amber-50 hover:bg-amber-300/15"
                      : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  }`}
                >
                  Recalibrate suggestions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // keep it lightweight: just hide for now
                    setAck({
                      kind: "comment_disagree",
                      feedbackId: "dismiss-recal",
                      message: "All good — keeping the current set.",
                    });
                  }}
                  className={`${pillBase} ${pillNeutral}`}
                >
                  Not yet
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {visible.length ? (
        <div className="space-y-4 lg:space-y-5 lg:mx-auto lg:max-w-4xl">
          {visible.slice(0, 4).map((rec, slotIdx) => {
            const a = REC_ACCENTS[slotIdx] ?? REC_ACCENTS[0];
            const laneId = laneIdFromRec(rec);

            const feedback = getLatestFeedbackForRecommendation(rec.recId);
            const selected = feedback?.response;

            const spoken = rec.summary ? splitSpokenParagraphs(rec.summary) : [];
            const teaser = spoken.slice(0, 2);
            const extra = spoken.slice(2);

            const tiny = tinyTestForLane(laneId);
            const tinySaved = Boolean(savedTinyByRec[rec.recId]);
            const tinyJustSaved = justSavedRecId === rec.recId;

            const showSteps = Boolean(showStepsByRec[rec.recId]);
            const expanded = expandedRecId === rec.recId;

            const n = slotIdx + 1;

            const visualBreak = (rec as unknown as { visualBreak?: VisualBreak })
              .visualBreak;

            return (
              <div
                key={rec.recId}
                className={`relative overflow-hidden rounded-3xl border p-[1px] ${
                  dark
                    ? "border-white/10 bg-white/5"
                    : "border-slate-200 bg-white/80"
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                    a.halo
                  } ${expanded ? "opacity-45 lg:opacity-35" : "opacity-85 lg:opacity-65"}`}
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-4 h-[70%] ${
                    expanded
                      ? "w-[3px] opacity-70 lg:opacity-55"
                      : "w-[4px] opacity-90 lg:opacity-70"
                  } rounded-full bg-gradient-to-b ${a.rail}`}
                />

                <div
                  className={`relative rounded-3xl px-5 py-4 lg:px-7 lg:py-5 ${
                    dark
                      ? expanded
                        ? "bg-slate-950/25"
                        : "bg-slate-950/22"
                      : expanded
                      ? "bg-white/70"
                      : "bg-white/65"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpanded(rec.recId)}
                    className="w-full text-left"
                    aria-expanded={expanded}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                              dark
                                ? `border-white/10 ${a.chip}`
                                : "border-slate-200 bg-white text-slate-800"
                            }`}
                          >
                            #{n}
                          </span>
                          <div
                            className={`min-w-0 text-base font-semibold lg:text-[1.05rem] ${titleC}`}
                          >
                            <span className="truncate">{rec.title}</span>
                          </div>
                        </div>

                        {!expanded && (teaser[0] ?? "").trim().length ? (
                          <div className="mt-2">
                            <p
                              className={`text-sm lg:text-[0.95rem] ${
                                dark ? "text-slate-100/85" : "text-slate-700"
                              } line-clamp-2`}
                            >
                              {teaser[0]}
                            </p>
                          </div>
                        ) : null}

                        {expanded && teaser.length ? (
                          <div className="mt-2 space-y-2">
                            {teaser.map((p, i) => (
                              <p
                                key={i}
                                className={`text-sm lg:text-[0.95rem] ${muted}`}
                              >
                                {p}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <span
                        className={`mt-1 inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border ${
                          dark ? "border-white/10" : "border-slate-200"
                        }`}
                        aria-hidden
                      >
                        {!expanded ? (
                          <span className="relative h-full w-full">
                            <span
                              className={`absolute inset-0 bg-gradient-to-br ${
                                a.rail
                              } ${dark ? "opacity-55" : "opacity-50"}`}
                            />
                            <span
                              className={`absolute inset-0 ${
                                dark ? "bg-slate-950/25" : "bg-white/20"
                              }`}
                            />
                            <span
                              className={`relative flex h-full w-full items-center justify-center ${
                                dark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </span>
                          </span>
                        ) : (
                          <span
                            className={`flex h-full w-full items-center justify-center ${
                              dark
                                ? "bg-white/5 text-white/80"
                                : "bg-white text-slate-800"
                            }`}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </span>
                        )}
                      </span>
                    </div>
                  </button>

                  {expanded ? (
                    <div className="mt-4 lg:mt-5">
                      {extra.length ? (
                        <div className="space-y-2 lg:space-y-2.5">
                          {extra.map((p, i) => (
                            <p
                              key={i}
                              className={`text-sm lg:text-[0.95rem] ${muted}`}
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-3 space-y-3">
                        <p className={`text-sm lg:text-[0.95rem] ${muted}`}>
                          <span
                            className={`${
                              dark ? "text-white/70" : "text-slate-700"
                            } font-semibold`}
                          >
                            If you’re the type who likes…
                          </span>{" "}
                          {teenCoachWhy(rec.why)}
                        </p>

                        {visualBreak ? (
                          <VisualBreakBlock visual={visualBreak} dark={dark} />
                        ) : null}

                        <div
                          className={`relative overflow-hidden rounded-2xl border p-3 lg:p-4 ${
                            dark
                              ? "border-white/10 bg-white/5"
                              : "border-slate-200 bg-white/80"
                          }`}
                        >
                          <div
                            className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${
                              a.rail
                            } ${dark ? "opacity-16" : "opacity-10"}`}
                            aria-hidden
                          />
                          <div
                            className={`pointer-events-none absolute inset-0 ${
                              dark ? "bg-slate-950/10" : "bg-white/20"
                            }`}
                            aria-hidden
                          />

                          <div className="relative">
                            <div className="flex items-center justify-between gap-3">
                              <div
                                className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                                  dark ? "text-white/80" : "text-slate-700"
                                }`}
                              >
                                Tiny task
                              </div>

                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                  dark
                                    ? "border-white/10 bg-white/5 text-white/70"
                                    : "border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                <span aria-hidden>⏱</span> {tiny.eta}
                              </span>
                            </div>

                            <div className="mt-2">
                              <div
                                className={`text-sm font-semibold lg:text-[0.95rem] ${
                                  dark ? "text-white/90" : "text-slate-900"
                                }`}
                              >
                                Try this first — don’t overthink it:
                              </div>
                              <div
                                className={`mt-1 text-sm lg:text-[0.95rem] ${muted}`}
                              >
                                {tiny.steps?.[0] ??
                                  "Try a super small version of it today."}
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleSteps(rec.recId)}
                                className={`${pillBase} ${pillNeutral}`}
                              >
                                {showSteps ? (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    Hide steps
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    Show steps
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => onSaveTinyTest(rec, laneId)}
                                disabled={tinySaved}
                                className={`${pillBase} ${
                                  tinySaved
                                    ? dark
                                      ? "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
                                      : "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                                    : pillNeutral
                                }`}
                              >
                                {tinySaved ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Saved
                                  </>
                                ) : (
                                  <>
                                    <span aria-hidden>📁</span>
                                    Add to my Actions
                                  </>
                                )}
                              </button>
                            </div>

                            {tinyJustSaved ? (
                              <div
                                className={`mt-2 text-xs font-semibold ${
                                  dark ? "text-white/70" : "text-slate-700"
                                }`}
                              >
                                ✅ Added to Actions
                              </div>
                            ) : null}

                            {showSteps ? (
                              <div
                                className={`mt-3 rounded-2xl border p-3 lg:p-4 ${
                                  dark
                                    ? "border-white/10 bg-white/5"
                                    : "border-slate-200 bg-white/80"
                                }`}
                              >
                                <div
                                  className={`text-sm font-semibold lg:text-[0.95rem] ${titleC}`}
                                >
                                  {tiny.title}
                                </div>

                                <div className="mt-2 space-y-1.5 lg:space-y-2">
                                  {tiny.steps.map((step, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2"
                                    >
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
                                      <div
                                        className={`text-sm lg:text-[0.95rem] ${muted}`}
                                      >
                                        {step}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div
                                  className={`mt-2 text-xs font-semibold ${
                                    dark ? "text-white/55" : "text-slate-600"
                                  }`}
                                >
                                  Time: {tiny.eta}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-5">
                        <div
                          className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                            dark ? "text-slate-300/60" : "text-slate-500"
                          }`}
                        >
                          Quick check on:{" "}
                          <span
                            className={`${
                              dark ? "text-slate-200/90" : "text-slate-700"
                            }`}
                          >
                            {rec.title}
                          </span>
                        </div>

                        <div
                          className={`mt-1 text-xs ${
                            dark ? "text-white/55" : "text-slate-600"
                          }`}
                        >
                          Be honest — we’ll adjust what you see next.
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openFeedback(rec, "agree")}
                            className={`${pillBase} ${
                              selected === "agree"
                                ? pillSelected("agree")
                                : pillNeutral
                            }`}
                          >
                            <span aria-hidden>👍</span>
                            {selected === "agree" ? "This fits ✓" : "This fits"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openFeedback(rec, "mixed")}
                            className={`${pillBase} ${
                              selected === "mixed"
                                ? pillSelected("mixed")
                                : pillNeutral
                            }`}
                          >
                            <span aria-hidden>🙂</span>
                            {selected === "mixed" ? "Kinda ✓" : "Kinda"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openFeedback(rec, "disagree")}
                            className={`${pillBase} ${
                              selected === "disagree"
                                ? pillSelected("disagree")
                                : pillNeutral
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
                          See what this career is really like{" "}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ) : null}
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
            No recommendations yet
          </div>
          <div className={`mt-1 text-sm ${muted}`}>
            Add items to{" "}
            <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
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
