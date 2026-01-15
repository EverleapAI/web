// src/app/main/explore/renderers/EducationRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import type { ExploreRendererProps } from "../content/types";
import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

import FeedbackModal from "../components/FeedbackModal";

/* =============================================================================
   Explore › EducationRenderer (Careers-style mechanics)
   - Accordion cards (only one expanded at a time)
   - Tiny Test: collapsible steps + Add to my Actions (placeholder) + saved ack
   - Fit check: This fits / Kinda / Nope using FeedbackModal
   - Distinct from Careers: NO #1-4; keep emoji marker pill instead
============================================================================= */

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
  signals?: string[];
  cards?: EducationCard[];
  nextMoves?: NextMove[];
};

function asEducationArea(input: unknown): EducationArea {
  const obj = (input ?? {}) as Record<string, unknown>;

  const toStrArr = (v: unknown): string[] | undefined =>
    Array.isArray(v) ? v.map((x) => String(x)) : undefined;

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
    signals: toStrArr(obj.signals),
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
    halo: "from-amber-500/12 via-orange-400/7 to-rose-500/7",
  },
  {
    rail: "from-emerald-300 via-teal-300 to-sky-300",
    chip: "bg-emerald-300/15 text-emerald-100 border-emerald-200/20",
    ctaDark:
      "bg-emerald-300 text-slate-950 hover:bg-emerald-200 shadow-emerald-300/25",
    halo: "from-emerald-500/11 via-teal-400/7 to-sky-500/7",
  },
  {
    rail: "from-sky-300 via-cyan-300 to-indigo-300",
    chip: "bg-sky-300/15 text-sky-100 border-sky-200/20",
    ctaDark: "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/25",
    halo: "from-sky-500/12 via-cyan-400/7 to-indigo-500/7",
  },
  {
    rail: "from-violet-300 via-fuchsia-300 to-sky-300",
    chip: "bg-violet-300/15 text-violet-100 border-violet-200/20",
    ctaDark:
      "bg-violet-300 text-slate-950 hover:bg-violet-200 shadow-violet-300/25",
    halo: "from-violet-500/11 via-fuchsia-400/7 to-sky-500/7",
  },
];

type TinyTest = {
  title: string;
  steps: string[];
  eta: string;
  tip?: string;
};

const EDU_TINY_TESTS: Record<string, TinyTest> = {
  "learn-to-code": {
    title: "Tiny test: build something tiny that works",
    eta: "25–45 min",
    steps: [
      "Pick ONE tiny goal (a button that changes text, a page that saves a note).",
      "Use one tutorial — then pause and change one thing yourself.",
      "If you get stuck, write the error in plain English first.",
      "Show someone what you made (even if it’s ugly).",
    ],
    tip: "Tip: your first win is “I made it work,” not “I’m a coder now.”",
  },
  "science-deep-dive": {
    title: "Tiny test: go one layer deeper than everyone else",
    eta: "20–35 min",
    steps: [
      "Pick one question you actually care about.",
      "Find 2 sources (one video, one article).",
      "Write the answer in 5 bullets like you’re teaching a friend.",
      "Write 1 follow-up question you still don’t get.",
    ],
    tip: "Tip: chase one question until you can explain it simply.",
  },
  "public-speaking": {
    title: "Tiny test: do one micro-rep out loud",
    eta: "15–25 min",
    steps: [
      "Pick a topic you know (game, hobby, class concept).",
      "Record a 30–60 second explanation (voice memo is fine).",
      "Listen once: cut one confusing sentence.",
      "Send it to a friend and ask: “What part was clearest?”",
    ],
    tip: "Tip: confidence shows up after reps — not before.",
  },
};

function tinyTestForTopic(topicId: string): TinyTest {
  return (
    EDU_TINY_TESTS[topicId] ?? {
      title: "Tiny test: try one micro-skill",
      eta: "15–25 min",
      steps: [
        "Pick one tiny action you can finish today.",
        "Do it for 15 minutes.",
        "Rate it: 🔥 / 🙂 / 😬",
        "Write 1 sentence: “Do I want more of this?”",
      ],
    }
  );
}

type PendingFeedback =
  | { rec: RecommendationItem; response: FeedbackResponse }
  | null;

type AckState =
  | { kind: "comment_disagree"; feedbackId: string; message: string }
  | null;

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

function areaSignature(area: EducationArea): string {
  const cards = Array.isArray(area.cards) ? area.cards : [];
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const hint = area.hint ?? "";

  const payload =
    `hint:${hint}||signals:${signals.join("|")}||cards:` +
    cards.map((c) => `${c.id}~${c.title}~${c.icon ?? ""}~${c.short}`).join("||");

  return hashString(payload);
}

/**
 * We reuse the same FeedbackModal (expects a RecommendationItem).
 * We synthesize a lightweight RecommendationItem per education card.
 */
function toRecFromEducationCard(
  c: EducationCard,
  area: EducationArea,
  runId: string
): RecommendationItem {
  const generatedAt = nowIso();
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const tags = signals.map((s) => s.trim()).filter(Boolean);

  const recId = `explore.education.${String(c.id)}.v1`;

  return {
    recId,
    claimId: recId,
    source: "explore",
    domain: "education",
    title: String(c.title ?? "Learning path"),
    summary: String(c.short ?? ""),
    why: signals.length
      ? signals.slice(0, 3)
      : ["A good next learning experiment."],
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
}

export default function EducationRenderer({ chip, dark }: ExploreRendererProps) {
  const area = React.useMemo(() => asEducationArea(chip.area), [chip.area]);

  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  const shell = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const accentGlow = `bg-gradient-to-br ${area.glowClass ?? ""}`;

  // Accordion: only one expanded card at a time
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  // Tiny Test: steps toggle + save state per card
  const [showStepsById, setShowStepsById] = React.useState<
    Record<string, boolean>
  >({});
  const [savedTinyById, setSavedTinyById] = React.useState<
    Record<string, boolean>
  >({});
  const [justSavedId, setJustSavedId] = React.useState<string | null>(null);

  // FeedbackModal state (Careers-like behavior)
  const [pending, setPending] = React.useState<PendingFeedback>(null);
  const [ack, setAck] = React.useState<AckState>(null);

  const cards = Array.isArray(area.cards) ? area.cards : [];

  const runId = React.useMemo(() => {
    const sig = areaSignature(area);
    return `explore_${chip.id}_${sig}`;
  }, [chip.id, area]);

  function toggleExpanded(id: string) {
    setExpandedId((cur) => (cur === id ? null : id));
  }

  function toggleSteps(id: string) {
    setShowStepsById((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function onSaveTinyTest(topicId: string, cardTitle: string) {
    setSavedTinyById((prev) => ({ ...prev, [topicId]: true }));
    setJustSavedId(topicId);
    window.setTimeout(() => {
      setJustSavedId((cur) => (cur === topicId ? null : cur));
    }, 1400);

    // placeholder wiring
    // eslint-disable-next-line no-console
    console.log("[TinyTest] save-to-actions (placeholder)", {
      topicId,
      title: cardTitle,
      tinyTest: tinyTestForTopic(topicId),
    });
  }

  function getSelectedFor(recId: string): FeedbackResponse | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(`explore.edu.feedback.${recId}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { response?: FeedbackResponse } | null;
      const r = parsed?.response;
      return r === "agree" || r === "mixed" || r === "disagree" ? r : null;
    } catch {
      return null;
    }
  }

  function setSelectedFor(
    recId: string,
    payload: { response: FeedbackResponse; comment: string | null }
  ) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        `explore.edu.feedback.${recId}`,
        JSON.stringify(payload)
      );
    } catch {
      // ignore
    }
  }

  function clearSelectedFor(recId: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(`explore.edu.feedback.${recId}`);
    } catch {
      // ignore
    }
  }

  function openFeedback(rec: RecommendationItem, response: FeedbackResponse) {
    const existing = getSelectedFor(rec.recId);
    if (existing && existing === response) {
      clearSelectedFor(rec.recId);
      return;
    }
    setPending({ rec, response });
  }

  function closeModal() {
    setPending(null);
  }

  function submitModal(payload: {
    response: FeedbackResponse;
    comment: string | null;
    reasons?: string[];
  }) {
    if (!pending) return;

    setSelectedFor(pending.rec.recId, {
      response: payload.response,
      comment: payload.comment,
    });

    if (
      payload.response === "disagree" &&
      (payload.comment?.trim() ?? "").length
    ) {
      setAck({
        kind: "comment_disagree",
        feedbackId: pending.rec.recId,
        message:
          "Got it. Want me to tweak what you see next based on what you wrote?",
      });
    }

    setPending(null);
  }

  function handleRecalibrate() {
    // Placeholder: in Careers we refresh the batch; Education can later do the same.
    setAck(null);
    // eslint-disable-next-line no-console
    console.log("[Education] recalibrate (placeholder)");
  }

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
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
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
                const teaser = spoken.slice(0, 2);
                const extra = spoken.slice(2);

                const expanded = expandedId === c.id;

                const deepDiveHref =
                  c.id && typeof c.id === "string"
                    ? `/main/explore/education/${encodeURIComponent(c.id)}`
                    : "/main/explore/education";

                const tiny = tinyTestForTopic(c.id);
                const showSteps = Boolean(showStepsById[c.id]);
                const tinySaved = Boolean(savedTinyById[c.id]);
                const tinyJustSaved = justSavedId === c.id;

                const rec = toRecFromEducationCard(c, area, runId);
                const selected = getSelectedFor(rec.recId);
                const locked = Boolean(selected);

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
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo} ${
                        expanded
                          ? "opacity-45 lg:opacity-35"
                          : "opacity-80 lg:opacity-65"
                      }`}
                    />
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute left-0 top-4 h-[70%] ${
                        expanded ? "w-[3px] opacity-70" : "w-[4px] opacity-85"
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
                      {/* Header button (tap to expand/collapse) */}
                      <button
                        type="button"
                        onClick={() => toggleExpanded(c.id)}
                        className="w-full text-left"
                        aria-expanded={expanded}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {/* ✅ Distinct marker: emoji-only pill (NO "Path") */}
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                                  dark
                                    ? `border-white/10 ${a.chip}`
                                    : "border-slate-200 bg-white text-slate-800"
                                }`}
                                aria-label="Education path"
                              >
                                <span aria-hidden>{c.icon ?? "🎓"}</span>
                              </span>

                              <div
                                className={`min-w-0 text-base font-semibold lg:text-[1.05rem] ${titleC}`}
                              >
                                <span className="truncate">{c.title}</span>
                              </div>
                            </div>

                            {/* Collapsed-only: teaser highlight band */}
                            {!expanded && teaser.length ? (
                              <div className="relative mt-3 pr-14">
                                <div
                                  className={`pointer-events-none absolute inset-y-0 left-0 right-0 rounded-2xl bg-gradient-to-r ${a.rail} ${
                                    dark ? "opacity-20" : "opacity-14"
                                  }`}
                                  aria-hidden
                                />
                                <div
                                  className={`pointer-events-none absolute inset-y-0 left-0 right-0 rounded-2xl ${
                                    dark ? "bg-slate-950/10" : "bg-white/20"
                                  } backdrop-blur-[10px]`}
                                  aria-hidden
                                />
                                <div
                                  className={`pointer-events-none absolute inset-y-0 left-0 right-0 rounded-2xl ${
                                    dark
                                      ? "ring-1 ring-white/10"
                                      : "ring-1 ring-black/5"
                                  }`}
                                  aria-hidden
                                />

                                <div className="relative rounded-2xl px-3.5 py-2.5">
                                  <div className="space-y-2">
                                    {teaser.map((p, i) => (
                                      <p
                                        key={i}
                                        className={`text-sm lg:text-[0.95rem] ${
                                          dark
                                            ? "text-slate-100/90"
                                            : "text-slate-700"
                                        }`}
                                      >
                                        {p}
                                      </p>
                                    ))}
                                  </div>

                                  <div
                                    className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold ${
                                      dark ? "text-white/70" : "text-slate-600"
                                    }`}
                                  >
                                    <span
                                      className={`inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r ${a.rail} ${
                                        dark ? "opacity-90" : "opacity-80"
                                      }`}
                                      aria-hidden
                                    />
                                    Tap to open
                                  </div>
                                </div>
                              </div>
                            ) : null}

                            {/* Expanded-only: teaser as normal paragraphs */}
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

                            {expanded ? (
                              <div
                                className={`mt-3 text-xs font-semibold ${
                                  dark ? "text-white/55" : "text-slate-600"
                                }`}
                              >
                                Tap to close
                              </div>
                            ) : null}
                          </div>

                          {/* Chevron bubble */}
                          <span
                            className={`mt-1 inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border ${
                              dark ? "border-white/10" : "border-slate-200"
                            }`}
                            aria-hidden
                          >
                            {!expanded ? (
                              <span className="relative h-full w-full">
                                <span
                                  className={`absolute inset-0 bg-gradient-to-br ${a.rail} ${
                                    dark ? "opacity-60" : "opacity-55"
                                  }`}
                                />
                                <span
                                  className={`absolute inset-0 ${
                                    dark ? "bg-slate-950/20" : "bg-white/20"
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

                      {/* Expanded content */}
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

                          {/* Tiny Test callout (Careers-style) */}
                          <div className="mt-4 lg:mt-5">
                            <div
                              className={`relative overflow-hidden rounded-2xl border p-3 lg:p-4 ${
                                dark
                                  ? "border-white/10 bg-white/5"
                                  : "border-slate-200 bg-white/80"
                              }`}
                            >
                              {/* NO extra left rail here (avoid double-rail collision) */}
                              <div
                                className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${a.rail} ${
                                  dark ? "opacity-14" : "opacity-10"
                                }`}
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
                                    Tiny test
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
                                    onClick={() => toggleSteps(c.id)}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95 ${
                                      dark
                                        ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                                    }`}
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
                                    onClick={() => onSaveTinyTest(c.id, c.title)}
                                    disabled={tinySaved}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95 ${
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

                                    {tiny.tip ? (
                                      <div
                                        className={`mt-2 text-xs ${
                                          dark ? "text-white/55" : "text-slate-600"
                                        }`}
                                      >
                                        {tiny.tip}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {/* Fit check (Careers-style via modal) */}
                          <div className="mt-4 lg:mt-5">
                            <div
                              className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                                dark ? "text-slate-300/60" : "text-slate-500"
                              }`}
                            >
                              Fit check
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
                              href={deepDiveHref}
                              className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition active:scale-95 ${
                                dark
                                  ? `${a.ctaDark} shadow-[0_12px_34px_rgba(0,0,0,0.35)]`
                                  : "bg-amber-600 text-white hover:bg-amber-500"
                              }`}
                            >
                              Go deeper (real options){" "}
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
