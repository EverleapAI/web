// src/app/main/explore/renderers/EducationRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

import type {
  ExploreRendererProps,
  ExploreOpportunity,
  ExploreOpportunityGroup,
} from "../content/types";
import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

import FeedbackModal from "../components/FeedbackModal";
import {
  addAction,
  hasAction,
  subscribeActionsStore,
} from "../state/actionsStore";

/* =============================================================================
   Explore › EducationRenderer (Careers-structure parity)
   UPDATE:
   - Support `opportunities` buckets per card: local / national / online
   - Add “Add to my Actions” for Tiny test + for each opportunity item
   - Add an in-card media break right before “Real doors to walk through”
============================================================================= */

type EducationCard = {
  id: string;
  title: string;
  short: string;
  icon?: string;
  href?: string;
  opportunities?: ExploreOpportunityGroup;
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

  const toOpp = (v: unknown): ExploreOpportunity | null => {
    const it = (v ?? {}) as Record<string, unknown>;
    const name = typeof it?.name === "string" ? it.name : "";
    if (!name) return null;

    const provider = typeof it?.provider === "string" ? it.provider : undefined;
    const location = typeof it?.location === "string" ? it.location : undefined;
    const note = typeof it?.note === "string" ? it.note : undefined;
    const url = typeof it?.url === "string" ? it.url : undefined;
    const meta = typeof it?.meta === "string" ? it.meta : undefined;

    return { name, provider, location, note, url, meta };
  };

  const toOppList = (v: unknown): ExploreOpportunity[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: ExploreOpportunity[] = [];
    for (const item of v) {
      const parsed = toOpp(item);
      if (parsed) out.push(parsed);
    }
    return out.length ? out : undefined;
  };

  const toOppGroup = (v: unknown): ExploreOpportunityGroup | undefined => {
    if (!v || typeof v !== "object") return undefined;
    const it = v as Record<string, unknown>;
    const local = toOppList(it.local);
    const national = toOppList(it.national);
    const online = toOppList(it.online);

    if (!local && !national && !online) return undefined;
    return { local, national, online };
  };

  const toCards = (v: unknown): EducationCard[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: EducationCard[] = [];
    for (const item of v) {
      const it = item as Record<string, unknown>;
      const id = typeof it?.id === "string" ? it.id : "";
      const title = typeof it?.title === "string" ? it.title : "";
      const short = typeof it?.short === "string" ? it.short : "";
      const icon = typeof it?.icon === "string" ? it.icon : undefined;
      const href = typeof it?.href === "string" ? it.href : undefined;
      const opportunities = toOppGroup(it.opportunities);

      if (id && title) out.push({ id, title, short, icon, href, opportunities });
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
  "self-directed-micro-credentials": {
    title: "Tiny test: pick a 7-day sprint + define your proof",
    eta: "15–25 min",
    steps: [
      "Pick ONE skill sprint (7 days) you’d actually do.",
      "Define your proof in one sentence (before you start).",
      "Find one resource + one schedule block.",
      "Do the first 15 minutes today (just start).",
    ],
    tip: "Tip: proof beats motivation. Make the proof small and real.",
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
    cards
      .map((c) => {
        const opp = c.opportunities ?? {};
        const flat =
          [
            ...(opp.local ?? []),
            ...(opp.national ?? []),
            ...(opp.online ?? []),
          ]
            .map(
              (o) =>
                `${o.name}|${o.provider ?? ""}|${o.location ?? ""}|${o.url ?? ""}`
            )
            .join("~") || "";
        return `${c.id}~${c.title}~${c.icon ?? ""}~${c.href ?? ""}~${c.short}~opp:${flat}`;
      })
      .join("||");

  return hashString(payload);
}

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
    why: signals.length ? signals.slice(0, 3) : ["A good next learning experiment."],
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
   Media helpers
--------------------------------------------------------------------------- */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(Boolean(mq.matches));
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

/**
 * In-card media break shown before “Real doors to walk through”.
 * Uses the lane assets for now.
 *
 * Primary: /images/education/education.mp4
 * Fallback: /images/education/education.jpg
 */
function EducationCardMediaBreak({ dark }: { dark: boolean }) {
  const reducedMotion = usePrefersReducedMotion();

  const [videoFailed, setVideoFailed] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);

  // static assets
  const srcMp4 = "/images/education/education.mp4";
  const poster = "/images/education/education.jpg";

  const showVideo = !reducedMotion && !videoFailed;
  const showImage = !imageFailed;

  return (
    <div className="mt-4">
      <div
        className={`relative overflow-hidden rounded-2xl border ${
          dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
        }`}
      >
        {showVideo ? (
          <video
            className="relative h-[120px] w-full object-cover sm:h-[140px] lg:h-[150px]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onError={() => setVideoFailed(true)}
          >
            <source src={srcMp4} type="video/mp4" />
          </video>
        ) : showImage ? (
          <img
            src={poster}
            alt=""
            className="relative h-[120px] w-full object-cover sm:h-[140px] lg:h-[150px]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="relative h-[120px] w-full sm:h-[140px] lg:h-[150px]" />
        )}

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
  return `action.education.tiny.${topicId}`;
}

function actionIdForOpp(
  topicId: string,
  bucket: string,
  item: ExploreOpportunity
) {
  const seed = `${topicId}|${bucket}|${item.name}|${item.provider ?? ""}|${
    item.location ?? ""
  }|${item.url ?? ""}`;
  return `action.education.opp.${hashString(seed)}`;
}

/* ---------------------------------------------------------------------------
   Opportunities UI
--------------------------------------------------------------------------- */

type OppBucketKey = keyof ExploreOpportunityGroup; // "local" | "national" | "online"

type OppBucket = {
  key: OppBucketKey;
  label: string;
  emoji: string;
  items: ExploreOpportunity[];
};

const OPP_BUCKETS: Array<Pick<OppBucket, "key" | "label" | "emoji">> = [
  { key: "local", label: "Near you", emoji: "📍" },
  { key: "national", label: "Bigger programs", emoji: "🧭" },
  { key: "online", label: "Online anytime", emoji: "🌐" },
];

function OppItem({
  item,
  dark,
  saved,
  onSave,
}: {
  item: ExploreOpportunity;
  dark: boolean;
  saved: boolean;
  onSave: () => void;
}) {
  const muted = dark ? "text-slate-300/90" : "text-slate-600";
  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const sub = [item.provider, item.location].filter(Boolean).join(" • ");

  const pillBase =
    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95";
  const pillNeutral = dark
    ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

  return (
    <div
      className={`rounded-2xl border p-3 ${
        dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
      }`}
    >
      <div className="min-w-0">
        <div className={`text-sm font-semibold ${titleC}`}>{item.name}</div>
        {sub ? <div className={`mt-0.5 text-xs ${muted}`}>{sub}</div> : null}
        {item.note ? (
          <div className={`mt-1 text-sm ${muted}`}>{item.note}</div>
        ) : null}
        {item.meta ? (
          <div
            className={`mt-1 text-xs ${dark ? "text-white/55" : "text-slate-600"}`}
          >
            {item.meta}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.url && item.url.trim().length ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className={`${pillBase} ${pillNeutral}`}
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
        ) : null}

        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className={`${pillBase} ${
            saved
              ? dark
                ? "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
                : "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
              : pillNeutral
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <span aria-hidden>📌</span>
              Add to my Actions
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function OpportunitiesBlock({
  opp,
  dark,
  topicId,
  onSaved,
}: {
  opp?: ExploreOpportunityGroup;
  dark: boolean;
  topicId: string;
  onSaved: (actionId: string) => void;
}) {
  const buckets: OppBucket[] = OPP_BUCKETS.map((b) => ({
    ...b,
    items: opp?.[b.key] ?? [],
  })).filter((b) => b.items.length > 0);

  if (!buckets.length) return null;

  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  return (
    <div className="mt-4 lg:mt-5">
      {/* ✅ Added media break before this section header */}
      <EducationCardMediaBreak dark={dark} />

      <div
        className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
          dark ? "text-slate-300/60" : "text-slate-500"
        }`}
      >
        Real doors to walk through
      </div>
      <div className={`mt-1 text-xs ${muted}`}>
        Pick one. If it looks even 10% interesting, you’re allowed to try it.
      </div>

      <div className="mt-3 space-y-3">
        {buckets.map((b) => (
          <div key={b.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  dark
                    ? "border-white/10 bg-white/5 text-white/75"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                <span aria-hidden>{b.emoji}</span>
                {b.label}
              </span>

              <div className={`text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>
                {b.items.length} option{b.items.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="grid gap-2 lg:grid-cols-2">
              {b.items.slice(0, 6).map((item, idx) => {
                const aid = actionIdForOpp(String(topicId), String(b.key), item);
                const saved = hasAction(aid);

                return (
                  <OppItem
                    key={`${b.key}-${idx}-${item.name}`}
                    item={item}
                    dark={dark}
                    saved={saved}
                    onSave={() => {
                      if (saved) return;

                      addAction({
                        id: aid,
                        kind: "opportunity",
                        title: item.name,
                        detail: [item.provider, item.location].filter(Boolean).join(" • "),
                        lane: "education",
                        topicId: String(topicId),
                        href: item.url ?? undefined,
                        recId: undefined,
                      });

                      onSaved(aid);
                    }}
                  />
                );
              })}
            </div>

            {b.items.length > 6 ? (
              <div className={`text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>
                + {b.items.length - 6} more (we can show these in the deep dive)
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Renderer
--------------------------------------------------------------------------- */

export default function EducationRenderer({ chip, dark }: ExploreRendererProps) {
  const area = React.useMemo(() => asEducationArea(chip.area), [chip.area]);

  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const [showStepsById, setShowStepsById] = React.useState<Record<string, boolean>>(
    {}
  );

  // toast id (tiny or opp)
  const [justSavedActionId, setJustSavedActionId] = React.useState<string | null>(
    null
  );

  const [pending, setPending] = React.useState<PendingFeedback>(null);
  const [ack, setAck] = React.useState<AckState>(null);

  // Re-render when Actions store changes (so Saved states update)
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

  function toggleExpanded(id: string) {
    setExpandedId((cur) => (cur === id ? null : id));
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
    <section className="space-y-3">
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
        <div className="space-y-4 lg:space-y-5 lg:mx-auto lg:max-w-4xl">
          {cards.slice(0, 4).map((c, slotIdx) => {
            const a = EDU_ACCENTS[slotIdx] ?? EDU_ACCENTS[0];

            const spoken = splitSpokenParagraphs(c.short ?? "");
            const teaser = spoken.slice(0, 2);
            const extra = spoken.slice(2);

            const expanded = expandedId === c.id;

            const deepDiveHref =
              typeof c.href === "string" && c.href.trim().length
                ? c.href
                : c.id
                ? `/main/explore/education/${encodeURIComponent(c.id)}`
                : "/main/explore/education";

            const tiny = tinyTestForTopic(c.id);
            const showSteps = Boolean(showStepsById[c.id]);

            const tinyActionId = actionIdForTiny(c.id);
            const tinySaved = hasAction(tinyActionId);
            const tinyJustSaved = justSavedActionId === tinyActionId;

            const rec = toRecFromEducationCard(c, area, runId);
            const selected = getSelectedFor(rec.recId);

            const n = slotIdx + 1;

            return (
              <div
                key={c.id}
                className={`relative overflow-hidden rounded-3xl border p-[1px] ${
                  dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo} ${
                    expanded ? "opacity-45 lg:opacity-35" : "opacity-85 lg:opacity-65"
                  }`}
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
                    onClick={() => toggleExpanded(c.id)}
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
                            #{n}
                          </span>

                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                              dark
                                ? "border-white/10 bg-white/5 text-white/80"
                                : "border-slate-200 bg-white text-slate-800"
                            }`}
                            aria-hidden
                          >
                            {c.icon ?? "🎓"}
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
                              <p key={i} className={`text-sm lg:text-[0.95rem] ${muted}`}>
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
                            <p key={i} className={`text-sm lg:text-[0.95rem] ${muted}`}>
                              {p}
                            </p>
                          ))}
                        </div>
                      ) : null}

                      <OpportunitiesBlock
                        opp={c.opportunities}
                        dark={dark}
                        topicId={c.id}
                        onSaved={(aid) => toastSaved(aid)}
                      />

                      <div className="mt-3 space-y-3">
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
                                {tiny.steps?.[0] ?? "Try a super small version of it today."}
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
                                    title: "Tiny test",
                                    detail: `${tiny.eta} • ${tiny.title}`,
                                    lane: "education",
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
                                  dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                                }`}
                              >
                                <div
                                  className={`text-sm font-semibold lg:text-[0.95rem] ${titleC}`}
                                >
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
                          <span className={`${dark ? "text-slate-200/90" : "text-slate-700"}`}>
                            {c.title}
                          </span>
                        </div>

                        <div className={`mt-1 text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>
                          Be honest — we’ll adjust what you see next.
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openFeedback(rec, "agree")}
                            className={`${pillBase} ${
                              selected === "agree" ? pillSelected("agree") : pillNeutral
                            }`}
                          >
                            <span aria-hidden>👍</span>
                            {selected === "agree" ? "This fits ✓" : "This fits"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openFeedback(rec, "mixed")}
                            className={`${pillBase} ${
                              selected === "mixed" ? pillSelected("mixed") : pillNeutral
                            }`}
                          >
                            <span aria-hidden>🙂</span>
                            {selected === "mixed" ? "Kinda ✓" : "Kinda"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openFeedback(rec, "disagree")}
                            className={`${pillBase} ${
                              selected === "disagree" ? pillSelected("disagree") : pillNeutral
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
                          See real learning options <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>

                      {justSavedActionId ? (
                        <div
                          className={`mt-3 text-xs font-semibold ${
                            dark ? "text-white/70" : "text-slate-700"
                          }`}
                        >
                          ✅ Added to Actions
                        </div>
                      ) : null}
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
          <div className={`text-sm font-semibold ${titleC}`}>No education items yet</div>
          <div className={`mt-1 text-sm ${muted}`}>
            Add items to <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
            <span className="font-mono text-[0.9em]">explore/content/education.ts</span>.
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
