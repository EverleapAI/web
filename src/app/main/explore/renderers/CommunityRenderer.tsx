// src/app/main/explore/renderers/CommunityRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

import type { ExploreRendererProps } from "../content/types";
import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

import FeedbackModal from "../components/FeedbackModal";
import {
  addAction,
  hasAction,
  subscribeActionsStore,
} from "../state/actionsStore";

/* =============================================================================
   Explore › CommunityRenderer (Education-aligned / Careers-style mobile structure)
   - 4 cards, vertical list, strong per-card separation (no “one big shell” feel)
   - Rank pill (#1–#4) + emoji as secondary vibe marker (subtle)
   - Expand/collapse per card (one expanded at a time)
   - Media break (safe image) inside expanded card (like Education’s in-card media)
   - Tiny task: collapsible steps + Add to Actions + saved ack (wired to actionsStore)
   - Quick check: This fits / Kinda / Nope using FeedbackModal

   NOTE:
   - Header-shell media (inside the lane header card) is controlled by explore/page.tsx.

   Media standardization:
   - In-card VisualBreak image defaults to /images/community/<n>.jpg (n=1..4)
   - Optional per-card override via card.media.src
   - SafeImage behavior: never show broken image icon; hide on failure (optional fallback -> /images/community/5.jpg)
============================================================================= */

type CommunityCard = {
  id: string;
  title: string;
  short: string;
  icon?: string;
  href?: string;
  media?: { src?: string; alt?: string };
};

type NextMove = {
  id: string;
  title: string;
  blurb: string;
};

type CommunityArea = {
  glowClass?: string;
  headline?: string;
  summary?: string;
  hint?: string;
  signals?: string[];
  cards?: CommunityCard[];
  nextMoves?: NextMove[];
};

function asCommunityArea(input: unknown): CommunityArea {
  const obj = (input ?? {}) as Record<string, unknown>;

  const toStrArr = (v: unknown): string[] | undefined =>
    Array.isArray(v) ? v.map((x) => String(x)) : undefined;

  const toMedia = (
    v: unknown
  ): { src?: string; alt?: string } | undefined => {
    if (!v || typeof v !== "object") return undefined;
    const it = v as Record<string, unknown>;
    const src = typeof it?.src === "string" ? it.src : undefined;
    const alt = typeof it?.alt === "string" ? it.alt : undefined;
    if (!src && !alt) return undefined;
    return { src, alt };
  };

  const toCards = (v: unknown): CommunityCard[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: CommunityCard[] = [];
    for (const item of v) {
      const it = item as Record<string, unknown>;
      const id = typeof it?.id === "string" ? it.id : "";
      const title = typeof it?.title === "string" ? it.title : "";
      const short = typeof it?.short === "string" ? it.short : "";
      const icon = typeof it?.icon === "string" ? it.icon : undefined;
      const href = typeof it?.href === "string" ? it.href : undefined;
      const media = toMedia(it.media);
      if (id && title) out.push({ id, title, short, icon, href, media });
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

/**
 * Turn plain URLs inside text into clickable links.
 * (Keeps copy-authoring simple in community.ts: "Explore: https://...")
 */
function renderTextWithLinks(text: string): React.ReactNode[] {
  const s = String(text ?? "");
  const urlRe = /(https?:\/\/[^\s)]+)(?![^<]*>)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRe.exec(s)) !== null) {
    const url = match[1];
    const start = match.index;
    const end = start + url.length;

    if (start > lastIndex) parts.push(s.slice(lastIndex, start));

    parts.push(
      <a
        key={`${url}-${start}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4"
      >
        {url}
      </a>
    );

    lastIndex = end;
  }

  if (lastIndex < s.length) parts.push(s.slice(lastIndex));
  return parts.length ? parts : [s];
}

type Accent = {
  rail: string;
  chip: string;
  ctaDark: string;
  halo: string;
};

const COM_ACCENTS: Accent[] = [
  {
    rail: "from-violet-300 via-fuchsia-300 to-sky-300",
    chip: "bg-violet-300/15 text-violet-100 border-violet-200/20",
    ctaDark:
      "bg-violet-300 text-slate-950 hover:bg-violet-200 shadow-violet-300/25",
    halo: "from-violet-500/11 via-fuchsia-400/7 to-sky-500/7",
  },
  {
    rail: "from-rose-300 via-pink-300 to-amber-300",
    chip: "bg-rose-300/15 text-rose-100 border-rose-200/20",
    ctaDark:
      "bg-rose-300 text-slate-950 hover:bg-rose-200 shadow-rose-300/25",
    halo: "from-rose-500/11 via-pink-400/7 to-amber-500/7",
  },
  {
    rail: "from-sky-300 via-cyan-300 to-emerald-300",
    chip: "bg-sky-300/15 text-sky-100 border-sky-200/20",
    ctaDark: "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/25",
    halo: "from-sky-500/11 via-cyan-400/7 to-emerald-500/7",
  },
  {
    rail: "from-amber-300 via-orange-300 to-rose-300",
    chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
    ctaDark:
      "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
    halo: "from-amber-500/11 via-orange-400/7 to-rose-500/7",
  },
];

type TinyTask = {
  title: string;
  steps: string[];
  eta: string;
  tip?: string;
};

const COM_TINY_TASKS: Record<string, TinyTask> = {
  "interest-crew": {
    title: "Tiny task: enter the room without overthinking it",
    eta: "20–35 min",
    steps: [
      "Find one club/meetup/event (online or in-person) around something you already like.",
      "Write your intro sentence: “Hey, I’m ___ — I’m into ___.”",
      "Ask one safe question: “How did you get into this?”",
      "Stay 10 minutes longer than your comfort zone.",
    ],
    tip: "Your goal isn’t ‘make friends.’ Your goal is ‘collect proof it’s safe to belong.’",
  },
  "cause-team": {
    title: "Tiny task: do one real helpful thing",
    eta: "25–45 min",
    steps: [
      "Pick one cause (local clean-up, food bank, tutoring, mutual aid).",
      "Choose the smallest first action: sign up, message, or show up.",
      "Do one task fully (even if it’s boring).",
      "After: write 1 sentence—“Did I feel more steady or more drained?”",
    ],
    tip: "The vibe matters. ‘Good cause’ + ‘bad culture’ is still bad.",
  },
  "mentor-circle": {
    title: "Tiny task: ask for one piece of guidance",
    eta: "15–25 min",
    steps: [
      "Pick one person who seems kind + competent (coach, teacher, older friend).",
      "Send a short message: “Could I ask you one question about ___?”",
      "Ask: “What’s one mistake you’d help me avoid?”",
      "Thank them + do one small follow-up action.",
    ],
    tip: "Good mentors don’t lecture. They help you choose your next step.",
  },
  "local-spot": {
    title: "Tiny task: find your ‘third place’",
    eta: "30–60 min",
    steps: [
      "Pick one local place that has events (library, community center, makerspace, gym, café).",
      "Go once with a simple goal: observe the vibe.",
      "Say hi to one person (even just the staff).",
      "Decide: “Would I come back if I had a boring day?”",
    ],
    tip: "Belonging is built by repetition, not a perfect first impression.",
  },
};

function tinyTaskForTopic(topicId: string): TinyTask {
  return (
    COM_TINY_TASKS[topicId] ?? {
      title: "Tiny task: try one social micro-step",
      eta: "15–25 min",
      steps: [
        "Pick one low-pressure place to show up.",
        "Say one sentence to one person.",
        "Stay 10 minutes.",
        "Write: “Do I want to do this again?”",
      ],
      tip: "The first time can feel weird. That doesn’t mean it’s wrong.",
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

function areaSignature(area: CommunityArea): string {
  const cards = Array.isArray(area.cards) ? area.cards : [];
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const hint = area.hint ?? "";

  const payload =
    `hint:${hint}||signals:${signals.join("|")}||cards:` +
    cards
      .map((c) => {
        const mediaSig = c.media?.src
          ? `|media:${c.media.src}|${c.media.alt ?? ""}`
          : "";
        return `${c.id}~${c.title}~${c.icon ?? ""}~${c.short}~${c.href ?? ""}${mediaSig}`;
      })
      .join("||");

  return hashString(payload);
}

function toRecFromCommunityCard(
  c: CommunityCard,
  area: CommunityArea,
  runId: string
): RecommendationItem {
  const generatedAt = nowIso();
  const signals = Array.isArray(area.signals) ? area.signals : [];
  const tags = signals.map((s) => s.trim()).filter(Boolean);

  const recId = `explore.community.${String(c.id)}.v1`;

  return {
    recId,
    claimId: recId,
    source: "explore",
    domain: "community",
    title: String(c.title ?? "Community path"),
    summary: String(c.short ?? ""),
    why: signals.length ? signals.slice(0, 3) : ["A good belonging experiment."],
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

/* ---------------------------------------------------------------------------
   In-card VisualBreak (safe image, standardized paths)
--------------------------------------------------------------------------- */

function standardizedCommunityCardImageSrc(slotIdx: number): string {
  const n = Math.max(1, Math.min(4, slotIdx + 1));
  return `/images/community/${n}.jpg`;
}

function SafeImage({
  src,
  alt,
  className,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  className: string;
  fallbackSrc?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const [fallbackFailed, setFallbackFailed] = React.useState(false);

  if (failed && (!fallbackSrc || fallbackFailed)) return null;

  const useSrc = failed ? (fallbackSrc as string) : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={useSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!failed) setFailed(true);
        else setFallbackFailed(true);
      }}
    />
  );
}

function CommunityCardMediaBreak({
  dark,
  slotIdx,
  overrideSrc,
  overrideAlt,
}: {
  dark: boolean;
  slotIdx: number;
  overrideSrc?: string;
  overrideAlt?: string;
}) {
  const primary =
    (overrideSrc ?? "").trim() || standardizedCommunityCardImageSrc(slotIdx);
  const fallback = "/images/community/5.jpg";

  return (
    <div className="mt-4">
      <div
        className={`relative overflow-hidden rounded-2xl border ${
          dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
        }`}
      >
        <SafeImage
          src={primary}
          fallbackSrc={fallback}
          alt={(overrideAlt ?? "").trim()}
          className="relative h-[120px] w-full object-cover sm:h-[140px] lg:h-[150px]"
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            dark
              ? "bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/35"
              : "bg-gradient-to-r from-white/25 via-transparent to-white/25"
          }`}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Actions helpers (stable IDs)
--------------------------------------------------------------------------- */

function actionIdForTiny(topicId: string) {
  return `action.community.tiny.${topicId}`;
}

/* ---------------------------------------------------------------------------
   Renderer
--------------------------------------------------------------------------- */

export default function CommunityRenderer({ chip, dark }: ExploreRendererProps) {
  const area = React.useMemo(() => asCommunityArea(chip.area), [chip.area]);

  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  const [expandedRecId, setExpandedRecId] = React.useState<string | null>(null);

  const [showStepsById, setShowStepsById] = React.useState<
    Record<string, boolean>
  >({});

  const [justSavedActionId, setJustSavedActionId] = React.useState<
    string | null
  >(null);

  const [pending, setPending] = React.useState<PendingFeedback>(null);
  const [ack, setAck] = React.useState<AckState>(null);

  const [, bump] = React.useState(0);
  React.useEffect(() => {
    const unsub = subscribeActionsStore(() => bump((v) => v + 1));
    return () => unsub();
  }, []);

  const cards = Array.isArray(area.cards) ? area.cards : [];

  const runId = React.useMemo(() => {
    const sig = areaSignature(area);
    return `explore_${chip.id}_${sig}`;
  }, [chip.id, area]);

  function toggleExpanded(recId: string) {
    setExpandedRecId((cur) => (cur === recId ? null : recId));
  }

  function toggleSteps(id: string) {
    setShowStepsById((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toastSaved(actionId: string) {
    setJustSavedActionId(actionId);
    window.setTimeout(() => {
      setJustSavedActionId((cur) => (cur === actionId ? null : cur));
    }, 1400);
  }

  function getSelectedFor(recId: string): FeedbackResponse | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(
        `explore.community.feedback.${recId}`
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
        `explore.community.feedback.${recId}`,
        JSON.stringify(payload)
      );
    } catch {
      // ignore
    }
  }

  function clearSelectedFor(recId: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(`explore.community.feedback.${recId}`);
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

  function emojiForCard(c: CommunityCard): string | null {
    const raw = (c.icon ?? "").trim();
    return raw.length ? raw : null;
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
        <div className="space-y-4 lg:space-y-5">
          {cards.slice(0, 4).map((c, slotIdx) => {
            const a = COM_ACCENTS[slotIdx] ?? COM_ACCENTS[0];

            const spoken = splitSpokenParagraphs(c.short ?? "");
            const teaser = spoken.slice(0, 2);
            const extra = spoken.slice(2);

            const rec = toRecFromCommunityCard(c, area, runId);
            const selected = getSelectedFor(rec.recId);

            const expanded = expandedRecId === rec.recId;

            const deepDiveHref =
              typeof c.href === "string" && c.href.trim().length
                ? c.href
                : c.id
                ? `/main/explore/community/${encodeURIComponent(c.id)}`
                : "/main/explore/community";

            const tiny = tinyTaskForTopic(c.id);
            const showSteps = Boolean(showStepsById[c.id]);

            const tinyActionId = actionIdForTiny(c.id);
            const tinySaved = hasAction(tinyActionId);
            const tinyJustSaved = justSavedActionId === tinyActionId;

            const rank = slotIdx + 1;
            const emoji = emojiForCard(c);

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
                  } ${
                    expanded
                      ? "opacity-45 lg:opacity-35"
                      : "opacity-85 lg:opacity-65"
                  }`}
                  aria-hidden
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
                                ? "border-white/10 bg-white/5 text-white/80"
                                : "border-slate-200 bg-white text-slate-800"
                            }`}
                            aria-hidden
                          >
                            #{rank}
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
                              {renderTextWithLinks(teaser[0])}
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
                                {renderTextWithLinks(p)}
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
                              {renderTextWithLinks(p)}
                            </p>
                          ))}
                        </div>
                      ) : null}

                      {/* Visual break (standardized safe image) */}
                      <CommunityCardMediaBreak
                        dark={dark}
                        slotIdx={slotIdx}
                        overrideSrc={c.media?.src}
                        overrideAlt={c.media?.alt}
                      />

                      <div
                        className={`mt-4 lg:mt-5 relative overflow-hidden rounded-2xl border p-3 lg:p-4 ${
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
                              Try this first — keep it small:
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
                              onClick={() => {
                                if (tinySaved) return;

                                addAction({
                                  id: tinyActionId,
                                  kind: "tiny_task",
                                  title: "Tiny task",
                                  detail: `${tiny.eta} • ${tiny.title}`,
                                  lane: "community",
                                  topicId: c.id,
                                  href: deepDiveHref,
                                  recId: undefined,
                                });

                                toastSaved(tinyActionId);
                              }}
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
                              : "bg-slate-900 text-white hover:bg-slate-800"
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
            No community items yet
          </div>
          <div className={`mt-1 text-sm ${muted}`}>
            Add items to{" "}
            <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
            <span className="font-mono text-[0.9em]">
              explore/content/community.ts
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
