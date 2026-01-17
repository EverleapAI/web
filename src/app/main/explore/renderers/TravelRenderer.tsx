// src/app/main/explore/renderers/TravelRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

import type { ExploreRendererProps } from "../content/types";
import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

import FeedbackModal from "../components/FeedbackModal";

/* =============================================================================
   Explore › TravelRenderer (Careers mobile structure)
   - Single vertical list
   - 4 cards, collapsed teaser, tap-to-expand
   - Tiny Test block (toggle steps + Add to Actions placeholder + saved ack)
   - Quick check per card (FeedbackModal)
   - ✅ UPDATED: number marker pill (#1–#4) instead of emoji marker pill

   Spacing fix (travel cards):
   - Remove “double padding” between card shells (outer + inner)
   - Normalize list spacing to match other lanes (tight on mobile, airy on lg)
   - Ensure expanded content doesn’t add extra bottom gap
============================================================================= */

type TravelCard = {
  id: string;
  title: string;
  short: string;
  icon?: string;
  href?: string;
};

type NextMove = {
  id: string;
  title: string;
  blurb: string;
};

type TravelArea = {
  glowClass?: string;
  headline?: string;
  summary?: string;
  hint?: string;
  signals?: string[];
  cards?: TravelCard[];
  nextMoves?: NextMove[];
};

function asTravelArea(input: unknown): TravelArea {
  const obj = (input ?? {}) as Record<string, unknown>;

  const toStrArr = (v: unknown): string[] | undefined =>
    Array.isArray(v) ? v.map((x) => String(x)) : undefined;

  const toCards = (v: unknown): TravelCard[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: TravelCard[] = [];
    for (const item of v) {
      const it = item as Record<string, unknown>;
      const id = typeof it?.id === "string" ? it.id : "";
      const title = typeof it?.title === "string" ? it.title : "";
      const short = typeof it?.short === "string" ? it.short : "";
      const icon = typeof it?.icon === "string" ? it.icon : undefined;
      const href = typeof it?.href === "string" ? it.href : undefined;
      if (id && title) out.push({ id, title, short, icon, href });
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

const TRAVEL_ACCENTS: Accent[] = [
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
    rail: "from-amber-300 via-orange-300 to-rose-300",
    chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
    ctaDark:
      "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
    halo: "from-amber-500/12 via-orange-400/7 to-rose-500/7",
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

const TRAVEL_TINY_TESTS: Record<string, TinyTest> = {
  "coastal-weekend": {
    title: "Tiny test: plan a micro coastal reset",
    eta: "20–35 min",
    steps: [
      "Pick one coastal town within 2–3 hours (drive or short flight).",
      "Choose ONE anchor: sunrise walk, bookstore café, or beach loop.",
      "Pick lodging *or* a day plan — not both.",
      "Text one person: “Want to do this with me?” (or commit solo).",
    ],
    tip: "Tip: the win is “I booked / scheduled it,” not “I planned perfectly.”",
  },
  "mountain-reset": {
    title: "Tiny test: pick your mountain version",
    eta: "20–35 min",
    steps: [
      "Pick your goal: quiet cabin, trail day, or cozy town + views.",
      "Choose one easy hike (or just a scenic walk).",
      "Pick one ‘warm’ thing: hot drink spot, sauna, or fireplace vibe.",
      "Decide the date window (even if it’s a maybe).",
    ],
    tip: "Tip: mountains are for nervous systems, not achievements.",
  },
  "education-abroad": {
    title: "Tiny test: see if structured travel is your thing",
    eta: "25–45 min",
    steps: [
      "Pick a country + one skill: language, art, cooking, coding, etc.",
      "Search 2 program styles: guided immersion + short course format.",
      "Write 3 constraints: budget, time window, comfort level (solo/with group).",
      "Save 2 links and rank them: “more me” vs “less me.”",
    ],
    tip: "Tip: you’re not choosing forever — you’re testing your style.",
  },
  "work-abroad": {
    title: "Tiny test: map one realistic way to work abroad",
    eta: "25–45 min",
    steps: [
      "Pick a ‘container’: seasonal work, internship, volunteering, exchange.",
      "Choose one country and one timeframe (summer / gap term / after grad).",
      "Write a 5-line plan: what you’d do, where you’d live, how you’d afford it.",
      "Find one community thread or guide and save it.",
    ],
    tip: "Tip: momentum starts when it becomes *a plan*, not a vibe.",
  },
  "virtual-travel": {
    title: "Tiny test: travel your brain without spending money",
    eta: "15–25 min",
    steps: [
      "Pick a city and a theme (food, museums, street life, architecture).",
      "Do one street-view walk + one short local video.",
      "Make a 5-song playlist that matches the city.",
      "Write: “Would I actually go here?” yes/maybe/no — and why.",
    ],
    tip: "Tip: virtual travel is a scouting mission, not a compromise.",
  },
};

function tinyTestForTopic(topicId: string): TinyTest {
  return (
    TRAVEL_TINY_TESTS[topicId] ?? {
      title: "Tiny test: do one micro-explore",
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

function areaSignature(area: TravelArea): string {
  const cards = Array.isArray(area.cards) ? area.cards : [];
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const hint = area.hint ?? "";

  const payload =
    `hint:${hint}||signals:${signals.join("|")}||cards:` +
    cards.map((c) => `${c.id}~${c.title}~${c.icon ?? ""}~${c.short}`).join("||");

  return hashString(payload);
}

function toRecFromTravelCard(
  c: TravelCard,
  area: TravelArea,
  runId: string
): RecommendationItem {
  const generatedAt = nowIso();
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const tags = signals.map((s) => s.trim()).filter(Boolean);

  const recId = `explore.travel.${String(c.id)}.v1`;

  return {
    recId,
    claimId: recId,
    source: "explore",
    domain: "travel",
    title: String(c.title ?? "Travel vibe"),
    summary: String(c.short ?? ""),
    why: signals.length
      ? signals.slice(0, 3)
      : ["A travel experiment that matches your vibe."],
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

export default function TravelRenderer({ chip, dark }: ExploreRendererProps) {
  const area = React.useMemo(() => asTravelArea(chip.area), [chip.area]);

  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const [showStepsById, setShowStepsById] = React.useState<
    Record<string, boolean>
  >({});
  const [savedTinyById, setSavedTinyById] = React.useState<
    Record<string, boolean>
  >({});
  const [justSavedId, setJustSavedId] = React.useState<string | null>(null);

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

  function onSaveTinyTest(topicId: string) {
    setSavedTinyById((prev) => ({ ...prev, [topicId]: true }));
    setJustSavedId(topicId);
    window.setTimeout(() => {
      setJustSavedId((cur) => (cur === topicId ? null : cur));
    }, 1400);
  }

  function getSelectedFor(recId: string): FeedbackResponse | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(
        `explore.travel.feedback.${recId}`
      );
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
        `explore.travel.feedback.${recId}`,
        JSON.stringify(payload)
      );
    } catch {
      // ignore
    }
  }

  function clearSelectedFor(recId: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(`explore.travel.feedback.${recId}`);
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

    // ✅ ensure any prior ack doesn't linger
    setAck(null);

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
    setAck(null);
  }

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

  return (
    // ✅ IMPORTANT: section spacing should not stack with the lane shell in page.tsx
    <section className="space-y-4">
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
              <div className={`text-sm font-semibold ${titleC}`}>Okay — noted</div>
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

      {cards.length ? (
        // ✅ spacing fix: avoid “double vertical whitespace” (mobile tighter)
        <div className="space-y-4 lg:space-y-6">
          {cards.slice(0, 4).map((c, slotIdx) => {
            const a = TRAVEL_ACCENTS[slotIdx] ?? TRAVEL_ACCENTS[0];

            const spoken = splitSpokenParagraphs(c.short ?? "");
            const teaser = spoken.slice(0, 2);
            const extra = spoken.slice(2);

            const expanded = expandedId === c.id;

            const deepDiveHref =
              typeof c.href === "string" && c.href.trim().length
                ? c.href
                : c.id
                ? `/main/explore/travel/${encodeURIComponent(c.id)}`
                : "/main/explore/travel";

            const tiny = tinyTestForTopic(c.id);
            const showSteps = Boolean(showStepsById[c.id]);
            const tinySaved = Boolean(savedTinyById[c.id]);
            const tinyJustSaved = justSavedId === c.id;

            const rec = toRecFromTravelCard(c, area, runId);
            const selected = getSelectedFor(rec.recId);

            const n = slotIdx + 1;

            return (
              <div
                key={c.id}
                className={`relative overflow-hidden rounded-3xl border p-[1px] shadow-sm ${
                  dark
                    ? "border-white/10 bg-white/5 shadow-black/20"
                    : "border-slate-200 bg-white/80 shadow-slate-200/60"
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo} ${
                    expanded ? "opacity-45 lg:opacity-35" : "opacity-75 lg:opacity-55"
                  }`}
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-4 h-[70%] ${
                    expanded
                      ? "w-[3px] opacity-70 lg:opacity-55"
                      : "w-[4px] opacity-85 lg:opacity-65"
                  } rounded-full bg-gradient-to-b ${a.rail}`}
                />

                {/* ✅ spacing fix: reduce inner padding slightly and avoid adding extra bottom margin via nested blocks */}
                <div
                  className={`relative rounded-3xl px-5 py-4 lg:px-7 lg:py-6 ${
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
                    onClick={() => toggleExpanded(c.id)}
                    className="w-full text-left"
                    aria-expanded={expanded}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {/* ✅ UPDATED: number marker pill (#1–#4) */}
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                              dark
                                ? "border-white/10 bg-white/5 text-white/80"
                                : "border-slate-200 bg-white text-slate-800"
                            }`}
                            aria-hidden
                          >
                            #{n}
                          </span>

                          <div
                            className={`min-w-0 text-base font-semibold lg:text-[1.05rem] ${titleC}`}
                          >
                            <span className="truncate">{c.title}</span>
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
                              className={`absolute inset-0 bg-gradient-to-br ${a.rail} ${
                                dark ? "opacity-55" : "opacity-50"
                              }`}
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
                              dark ? "bg-white/5 text-white/80" : "bg-white text-slate-800"
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

                      <div className="mt-4 lg:mt-5">
                        <div
                          className={`relative overflow-hidden rounded-2xl border p-3 lg:p-4 ${
                            dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                          }`}
                        >
                          <div
                            className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${a.rail} ${
                              dark ? "opacity-16" : "opacity-10"
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
                              <div className={`mt-1 text-sm lg:text-[0.95rem] ${muted}`}>
                                {tiny.steps?.[0] ??
                                  "Try a super small version of it today."}
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleSteps(c.id)}
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
                                onClick={() => onSaveTinyTest(c.id)}
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
                                <div className={`text-sm font-semibold lg:text-[0.95rem] ${titleC}`}>
                                  {tiny.title}
                                </div>

                                <div className="mt-2 space-y-1.5 lg:space-y-2">
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
                                      <div className={`text-sm lg:text-[0.95rem] ${muted}`}>
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
                            {c.title}
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
                          href={deepDiveHref}
                          className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition active:scale-95 ${
                            dark
                              ? `${a.ctaDark} shadow-[0_12px_34px_rgba(0,0,0,0.35)]`
                              : "bg-emerald-600 text-white hover:bg-emerald-500"
                          }`}
                        >
                          Go deeper (real options) <ArrowRight className="h-4 w-4" />
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
          <div className={`text-sm font-semibold ${titleC}`}>No travel items yet</div>
          <div className={`mt-1 text-sm ${muted}`}>
            Add items to <span className="font-mono text-[0.9em]">cards[]</span>{" "}
            in{" "}
            <span className="font-mono text-[0.9em]">
              explore/content/travel.ts
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
