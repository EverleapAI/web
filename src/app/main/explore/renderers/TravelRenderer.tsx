// src/app/main/explore/renderers/TravelRenderer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

import type { ExploreRendererProps } from "../content/types";
import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

import FeedbackModal from "../components/FeedbackModal";
import { addAction, hasAction, subscribeActionsStore } from "../state/actionsStore";

/* =============================================================================
   Explore › TravelRenderer (Careers structure parity)

   REQUIRED parity:
   - Disable scroll anchoring in card list
   - No-jump expand/collapse (anchor capture/restore)
   - Only one card expanded
   - Collapsed shows 1 teaser paragraph + “Tap to expand”
   - Expanded order:
       1) Expanded copy
       2) Go deeper CTA
       3) Media (VisualBreak / card image)
       4) Tiny task block
       5) Quick check
       6) Collapse button at bottom
   - Dim sibling cards when one is expanded (opacity + saturate)
   - Media standardization:
       header media (in content): /images/travel/6.mp4 fallback /images/travel/5.jpg
       card images: /images/travel/1.jpg..4.jpg by slot order
       paths live in TS content when provided; renderer supplies safe defaults
   - Safe media behavior: never show broken icons; tolerate network issues
============================================================================= */

type TravelCard = {
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

type TravelArea = {
  glowClass?: string;
  headline?: string;
  summary?: string;
  hint?: string;
  signals?: string[];
  cards?: TravelCard[];
  nextMoves?: NextMove[];

  /**
   * Optional media configuration (preferred: defined in TS content).
   * If absent, renderer falls back safely to /images/travel defaults.
   */
  mediaBasePath?: string;
  headerMedia?: { mp4?: string; jpg?: string; alt?: string };
};

function asTravelArea(input: unknown): TravelArea {
  const obj = (input ?? {}) as Record<string, unknown>;

  const toStrArr = (v: unknown): string[] | undefined =>
    Array.isArray(v) ? v.map((x) => String(x)) : undefined;

  const toMedia = (v: unknown): { src?: string; alt?: string } | undefined => {
    if (!v || typeof v !== "object") return undefined;
    const it = v as Record<string, unknown>;
    const src = typeof it?.src === "string" ? it.src : undefined;
    const alt = typeof it?.alt === "string" ? it.alt : undefined;
    if (!src && !alt) return undefined;
    return { src, alt };
  };

  const toHeaderMedia = (
    v: unknown
  ): { mp4?: string; jpg?: string; alt?: string } | undefined => {
    if (!v || typeof v !== "object") return undefined;
    const it = v as Record<string, unknown>;
    const mp4 = typeof it?.mp4 === "string" ? it.mp4 : undefined;
    const jpg = typeof it?.jpg === "string" ? it.jpg : undefined;
    const alt = typeof it?.alt === "string" ? it.alt : undefined;
    if (!mp4 && !jpg && !alt) return undefined;
    return { mp4, jpg, alt };
  };

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
    mediaBasePath:
      typeof obj.mediaBasePath === "string" ? obj.mediaBasePath : undefined,
    headerMedia: toHeaderMedia(obj.headerMedia),
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
 * (Keeps copy-authoring simple in travel.ts: "Explore: https://...")
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

type TinyTask = {
  title: string;
  steps: string[];
  eta: string;
  tip?: string;
};

const TRAVEL_TINY_TASKS: Record<string, TinyTask> = {
  "ef-gap-year": {
    title: "Tiny task: shortlist one EF-style program",
    eta: "20–30 min",
    steps: [
      "Pick ONE region you’re curious about (Europe / Asia / LatAm).",
      "Choose ONE growth focus: language, service, internship, or leadership.",
      "Open the program site and save 2 options that feel real.",
      "Write a 1-sentence why: “I’m doing this because ____.”",
    ],
    tip: "Keep it small: you’re choosing a *direction*, not a forever plan.",
  },
  "ciee-study-abroad": {
    title: "Tiny task: find a program that actually counts",
    eta: "20–35 min",
    steps: [
      "Pick a city you’d be proud to say out loud.",
      "Choose a length: summer / semester / short term.",
      "Save 2 programs and note what you’d study there.",
      "Write the ‘proof’: credit, portfolio, language level, or internship.",
    ],
    tip: "If you can name the outcome, it’s not just travel — it’s a strategy.",
  },
  "au-pair-cultural-care": {
    title: "Tiny task: test-fit the au pair lifestyle",
    eta: "20–35 min",
    steps: [
      "List your non-negotiables: hours, age group, country, independence level.",
      "Write your ‘I’m great at’: 3 strengths (patience, cooking, tutoring, etc.).",
      "Open the program site and read the eligibility + expectations.",
      "Decide: “Would I like being part of a host family?” yes/maybe/no.",
    ],
    tip: "Au pair is immersive — the win is clarity, even if it’s a ‘no.’",
  },
  "soliya-virtual-exchange": {
    title: "Tiny task: do a real cross-cultural conversation",
    eta: "15–25 min",
    steps: [
      "Pick one topic you care about: identity, education, future work, media.",
      "Sign up / bookmark a virtual exchange option.",
      "Do one session (or commit to a start date).",
      "After: write 3 things you learned and 1 thing you’d ask next time.",
    ],
    tip: "Virtual exchange is travel for your worldview. It counts.",
  },
};

function tinyTaskForTopic(topicId: string): TinyTask {
  return (
    TRAVEL_TINY_TASKS[topicId] ?? {
      title: "Tiny task: do one micro-explore",
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
    cards
      .map((c) => {
        const mediaSig = c.media?.src
          ? `|media:${c.media.src}|${c.media.alt ?? ""}`
          : "";
        return `${c.id}~${c.title}~${c.icon ?? ""}~${c.short}${mediaSig}`;
      })
      .join("||");

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
    title: String(c.title ?? "Travel"),
    summary: String(c.short ?? ""),
    why: signals.length
      ? signals.slice(0, 3)
      : ["A travel experiment that grows your worldview."],
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

/* ---- Motion / Anchor helpers (no-jump expand) ---- */

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

function useStableExpandAnchoring() {
  const pendingRef = React.useRef<{
    anchorId: string;
    anchorTop: number;
  } | null>(null);

  const capture = React.useCallback((anchorId: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(anchorId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    pendingRef.current = { anchorId, anchorTop: rect.top };
  }, []);

  const restore = React.useCallback(() => {
    if (typeof window === "undefined") return;
    const pending = pendingRef.current;
    if (!pending) return;

    pendingRef.current = null;

    const run = () => {
      const el = document.getElementById(pending.anchorId);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const delta = rect.top - pending.anchorTop;
      if (Math.abs(delta) > 0.5) {
        window.scrollTo({ top: window.scrollY + delta, left: 0, behavior: "auto" });
      }
    };

    requestAnimationFrame(() => {
      run();
      requestAnimationFrame(() => run());
    });
  }, []);

  return { capture, restore };
}

/* ---- Media helpers (Safe media, standardized paths) ---- */

function clamp1to4(n: number): number {
  return Math.max(1, Math.min(4, n));
}

function normalizeBasePath(p: string): string {
  const raw = String(p ?? "").trim();
  if (!raw) return "/images/travel";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

type SafeMediaProps = {
  mp4Src?: string;
  jpgCandidates: string[];
  alt: string;
  dark: boolean;
  className?: string;
};

function SafeMedia({ mp4Src, jpgCandidates, alt, dark, className }: SafeMediaProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [videoFailed, setVideoFailed] = React.useState(false);
  const [imgIdx, setImgIdx] = React.useState(0);

  const candidates = React.useMemo(() => {
    const out: string[] = [];
    for (const c of jpgCandidates) {
      const v = String(c ?? "").trim();
      if (v) out.push(v);
    }
    return out;
  }, [jpgCandidates]);

  const currentImg = candidates[imgIdx] ?? "";

  const showVideo = Boolean(mp4Src && !reducedMotion && !videoFailed);

  const onVideoTrouble = React.useCallback(() => {
    setVideoFailed(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${
        dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
      } ${className ?? ""}`}
    >
      {showVideo ? (
        <video
          className="relative h-[120px] w-full object-cover sm:h-[140px] lg:h-[150px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={currentImg || undefined}
          onError={onVideoTrouble}
          onStalled={onVideoTrouble}
          onAbort={onVideoTrouble}
        >
          <source src={mp4Src} type="video/mp4" />
        </video>
      ) : currentImg ? (
        <img
          // eslint-disable-next-line @next/next/no-img-element
          src={currentImg}
          alt={alt}
          className="relative h-[120px] w-full object-cover sm:h-[140px] lg:h-[150px]"
          onError={() => setImgIdx((i) => i + 1)}
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
  );
}

function TravelCardMediaBreak({
  dark,
  slotIdx,
  area,
  overrideSrc,
  overrideAlt,
}: {
  dark: boolean;
  slotIdx: number;
  area: TravelArea;
  overrideSrc?: string;
  overrideAlt?: string;
}) {
  const base = normalizeBasePath(area.mediaBasePath ?? "/images/travel");

  const slot = clamp1to4(slotIdx + 1);
  const slotJpg = `${base}/${slot}.jpg`;

  const poster = (area.headerMedia?.jpg ?? "").trim() || `${base}/5.jpg`;
  const mp4Src = (area.headerMedia?.mp4 ?? "").trim() || `${base}/6.mp4`;

  const imgCandidates = [(overrideSrc ?? "").trim(), slotJpg, poster];
  const alt = (overrideAlt ?? "").trim() || "";

  return (
    <div className="mt-4" style={{ overflowAnchor: "none" }}>
      <SafeMedia mp4Src={mp4Src} jpgCandidates={imgCandidates} alt={alt} dark={dark} />
    </div>
  );
}

/* ---- Actions helpers (stable IDs) ---- */

function actionIdForTiny(topicId: string) {
  return `action.travel.tiny.${topicId}`;
}

/* ---- Renderer ---- */

export default function TravelRenderer({ chip, dark }: ExploreRendererProps) {
  const area = React.useMemo(() => asTravelArea(chip.area), [chip.area]);

  const titleC = dark ? "text-slate-50" : "text-slate-900";
  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [showStepsById, setShowStepsById] = React.useState<Record<string, boolean>>(
    {}
  );

  const [justSavedActionId, setJustSavedActionId] = React.useState<string | null>(
    null
  );

  const [pending, setPending] = React.useState<PendingFeedback>(null);
  const [ack, setAck] = React.useState<AckState>(null);

  const { capture, restore } = useStableExpandAnchoring();

  const [, bumpFeedback] = React.useState(0);

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

  React.useEffect(() => {
    restore();
  }, [expandedId, restore]);

  function toggleExpanded(id: string) {
    const anchorId = `travel-card-anchor-${id}`;
    capture(anchorId);
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
      const raw = window.localStorage.getItem(`explore.travel.feedback.${recId}`);
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
      bumpFeedback((v) => v + 1);
    } catch {
      // ignore
    }
  }

  function clearSelectedFor(recId: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(`explore.travel.feedback.${recId}`);
      bumpFeedback((v) => v + 1);
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

  const anyExpanded = Boolean(expandedId);

  return (
    <section className="space-y-4">
      {ack ? (
        <div
          className={`rounded-2xl border px-4 py-3 ${
            dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
          }`}
          style={{ overflowAnchor: "none" }}
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
        <div className="space-y-4 lg:space-y-6" style={{ overflowAnchor: "none" }}>
          {cards.slice(0, 4).map((c, slotIdx) => {
            const a = TRAVEL_ACCENTS[slotIdx] ?? TRAVEL_ACCENTS[0];

            const spoken = splitSpokenParagraphs(c.short ?? "");
            const teaserOne = spoken.slice(0, 1);

            const expanded = expandedId === c.id;

            const deepDiveHref =
              typeof c.href === "string" && c.href.trim().length
                ? c.href
                : c.id
                ? `/main/explore/travel/${encodeURIComponent(c.id)}`
                : "/main/explore/travel";

            const tiny = tinyTaskForTopic(c.id);
            const showSteps = Boolean(showStepsById[c.id]);

            const tinyActionId = actionIdForTiny(c.id);
            const tinySaved = hasAction(tinyActionId);
            const tinyJustSaved = justSavedActionId === tinyActionId;

            const rec = toRecFromTravelCard(c, area, runId);
            const selected = getSelectedFor(rec.recId);

            const n = slotIdx + 1;

            const siblingDim =
              anyExpanded && !expanded ? "opacity-70 saturate-50" : "opacity-100 saturate-100";

            const anchorId = `travel-card-anchor-${c.id}`;

            return (
              <div
                key={c.id}
                className={`relative overflow-hidden rounded-3xl border p-[1px] shadow-sm transition ${siblingDim} ${
                  dark
                    ? "border-white/10 bg-white/5 shadow-black/20"
                    : "border-slate-200 bg-white/80 shadow-slate-200/60"
                }`}
                style={{ overflowAnchor: "none" }}
              >
                <div id={anchorId} className="h-0 w-0" aria-hidden />

                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo} ${
                    expanded
                      ? "opacity-45 lg:opacity-35"
                      : "opacity-75 lg:opacity-55"
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
                  style={{ overflowAnchor: "none" }}
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

                          <div
                            className={`min-w-0 text-base font-semibold lg:text-[1.05rem] ${titleC}`}
                          >
                            <span className="truncate">{c.title}</span>
                          </div>
                        </div>

                        {!expanded && (teaserOne[0] ?? "").trim().length ? (
                          <div className="mt-2">
                            <p
                              className={`text-sm lg:text-[0.95rem] ${
                                dark ? "text-slate-100/85" : "text-slate-700"
                              } line-clamp-2`}
                            >
                              {renderTextWithLinks(teaserOne[0])}
                            </p>
                            <div
                              className={`mt-2 text-xs font-semibold ${
                                dark ? "text-white/55" : "text-slate-600"
                              }`}
                            >
                              Tap to expand
                            </div>
                          </div>
                        ) : null}

                        {expanded && spoken.length ? (
                          <div className="mt-2 space-y-2">
                            {spoken.map((p, i) => (
                              <p key={i} className={`text-sm lg:text-[0.95rem] ${muted}`}>
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
                    <div className="mt-4 lg:mt-5" style={{ overflowAnchor: "none" }}>
                      {/* 2) Go deeper CTA */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                          href={deepDiveHref}
                          className={`${pillBase} ${
                            dark
                              ? "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          Go deeper
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>

                      {/* 3) Media */}
                      <TravelCardMediaBreak
                        dark={dark}
                        slotIdx={slotIdx}
                        area={area}
                        overrideSrc={c.media?.src}
                        overrideAlt={c.media?.alt}
                      />

                      {/* 4) Tiny task block */}
                      <div className="mt-5 lg:mt-6" style={{ overflowAnchor: "none" }}>
                        <div
                          className={`rounded-2xl border p-4 ${
                            dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div
                                className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                                  dark ? "text-slate-300/60" : "text-slate-500"
                                }`}
                              >
                                Tiny task
                              </div>
                              <div className={`mt-1 text-sm font-semibold ${titleC}`}>{tiny.title}</div>
                              <div className={`mt-1 text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>
                                ETA: {tiny.eta}
                              </div>
                            </div>

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
                          </div>

                          {showSteps ? (
                            <div className="mt-3 space-y-2">
                              <ol className="space-y-2">
                                {tiny.steps.map((s, idx) => (
                                  <li key={idx} className={`flex gap-2 text-sm ${muted}`}>
                                    <span
                                      className={`mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[0.75rem] font-semibold ${
                                        dark
                                          ? "border-white/10 bg-white/5 text-white/75"
                                          : "border-slate-200 bg-white text-slate-800"
                                      }`}
                                      aria-hidden
                                    >
                                      {idx + 1}
                                    </span>
                                    <span className="min-w-0">{renderTextWithLinks(s)}</span>
                                  </li>
                                ))}
                              </ol>

                              {tiny.tip ? (
                                <div
                                  className={`mt-2 rounded-xl border px-3 py-2 text-xs ${
                                    dark
                                      ? "border-white/10 bg-slate-950/35 text-white/70"
                                      : "border-slate-200 bg-white text-slate-700"
                                  }`}
                                >
                                  {renderTextWithLinks(tiny.tip)}
                                </div>
                              ) : null}
                            </div>
                          ) : null}

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (tinySaved) return;

                                addAction({
                                  id: tinyActionId,
                                  kind: "tiny_task",
                                  title: "Tiny task",
                                  detail: `${tiny.eta} • ${tiny.title}`,
                                  lane: "travel",
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
                                  Added to Actions
                                </>
                              ) : (
                                <>
                                  <span aria-hidden>📌</span>
                                  Add to my Actions
                                </>
                              )}
                            </button>

                            {tinyJustSaved ? (
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                                  dark
                                    ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-50"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-900"
                                }`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Saved
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* 5) Quick check */}
                      <div className="mt-5 lg:mt-6" style={{ overflowAnchor: "none" }}>
                        <div
                          className={`rounded-2xl border p-4 ${
                            dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                          }`}
                        >
                          <div
                            className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                              dark ? "text-slate-300/60" : "text-slate-500"
                            }`}
                          >
                            Quick check on {c.title}
                          </div>
                          <div className={`mt-1 text-sm ${muted}`}>
                            Does this feel like a good direction to test next?
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openFeedback(rec, "agree")}
                              className={`${pillBase} ${
                                selected === "agree"
                                  ? pillSelected("agree")
                                  : pillNeutral
                              }`}
                            >
                              👍 Yes
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
                              🤔 Maybe
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
                              👎 Not me
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 6) Collapse button at bottom */}
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(c.id)}
                          className={`${pillBase} ${pillNeutral}`}
                        >
                          <ChevronUp className="h-4 w-4" />
                          Collapse
                        </button>
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
          style={{ overflowAnchor: "none" }}
        >
          <div className={`text-sm font-semibold ${titleC}`}>No travel items yet</div>
          <div className={`mt-1 text-sm ${muted}`}>
            Add items to <span className="font-mono text-[0.9em]">cards[]</span> in{" "}
            <span className="font-mono text-[0.9em]">explore/content/travel.ts</span>.
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
