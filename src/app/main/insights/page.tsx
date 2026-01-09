// src/app/main/insights/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  ArrowRight,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import {
  INSIGHTS_AREAS,
  type CareerSuggestion,
  type TraitCard,
  type TraitCardVariant,
} from "./insightsContent";

/* ============================================================
   Local guide modal types
   ============================================================ */

type FeedbackRating = "mostly" | "somewhat" | "nope";
type GuideMsg = { role: "guide" | "user"; text: string };

function labelForRating(r: FeedbackRating) {
  if (r === "mostly") return "Mostly right";
  if (r === "somewhat") return "Somewhat";
  return "Not really";
}

/* ============================================================
   Page
   ============================================================ */

export default function InsightsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const [activeIndex, setActiveIndex] = React.useState(0);

  // Context toggles
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [recContextOpen, setRecContextOpen] = React.useState(false);
  const [laneContextOpen, setLaneContextOpen] = React.useState(false);

  // Deep dive modal
  const [deepOpen, setDeepOpen] = React.useState(false);
  const deepCloseBtnRef = React.useRef<HTMLButtonElement | null>(null);

  // Guide modal
  const [guideOpen, setGuideOpen] = React.useState(false);
  const [guideDraft, setGuideDraft] = React.useState("");
  const [guideMsgs, setGuideMsgs] = React.useState<GuideMsg[]>([]);
  const [guideCtx, setGuideCtx] = React.useState<{
    areaId: string;
    areaLabel: string;
    rating: FeedbackRating;
    source: "page" | "deep" | "recommendation_pick";
  } | null>(null);
  const guideInputRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Chip scroller affordance
  const chipsWrapRef = React.useRef<HTMLDivElement | null>(null);
  const [chipsHintSeen, setChipsHintSeen] = React.useState(false);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const dark = isDarkTheme(themeId);
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  // map url param -> index (only if it matches)
  const areaParam = searchParams?.get("area") ?? "";
  React.useEffect(() => {
    if (!areaParam) return;

    const idx = INSIGHTS_AREAS.findIndex((a) =>
      a.id === "career" ? areaParam === "career" : areaParam === a.id
    );
    if (idx >= 0) setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaParam]);

  const activeArea = INSIGHTS_AREAS[activeIndex];
  const isRecommendations = activeArea.id === "career";

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/60"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";

  const pageTextMutedClass = dark ? "text-slate-300/90" : "text-slate-600";

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";

  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const microText = dark ? "text-slate-400" : "text-slate-500";

  const areaChipBase = dark
    ? "border-slate-800/80 bg-slate-950/60 text-slate-200 hover:bg-slate-950/75"
    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white";

  const areaChipActive = dark
    ? `
      border-white/18 text-slate-50
      bg-gradient-to-r from-white/10 via-white/6 to-white/5
      shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_28px_rgba(56,189,248,0.18)]
    `
    : `
      border-sky-300 text-slate-900
      bg-gradient-to-r from-sky-50 via-white to-white
      shadow-[0_0_0_1px_rgba(56,189,248,0.22),0_10px_24px_rgba(56,189,248,0.16)]
    `;

  const accentGlow = `bg-gradient-to-br ${activeArea.glowClass}`;
  const chipAccentBar = `bg-gradient-to-b ${activeArea.glowClass}`;

  const topSignals = activeArea.signals.slice(0, 3);
  const extraSignals = Math.max(activeArea.signals.length - topSignals.length, 0);

  function goToArea(nextIndex: number) {
    setWhyOpen(false);
    setRecContextOpen(false);
    setLaneContextOpen(false);
    setActiveIndex(nextIndex);

    // Keep URL in sync (nice for refresh/share)
    const id = INSIGHTS_AREAS[nextIndex]?.id ?? "career";
    router.replace(`/main/insights?area=${encodeURIComponent(id)}`);
  }

  function openDeepDive() {
    setDeepOpen(true);
  }
  function closeDeepDive() {
    setDeepOpen(false);
  }

  function openGuide(rating: FeedbackRating, source: "page" | "deep") {
    const ctx = {
      areaId: activeArea.id,
      areaLabel: activeArea.label,
      rating,
      source,
    } as const;

    setGuideCtx(ctx);

    const seed: GuideMsg[] = [
      {
        role: "guide",
        text:
          `Calibration for **${activeArea.label}**: you said “${labelForRating(
            rating
          )}.”\n\n` + `What part felt most true — and what part is wrong?`,
      },
      {
        role: "guide",
        text:
          "If you rewrote this insight in your own words, what would it say (one or two sentences)?",
      },
    ];

    setGuideMsgs(seed);
    setGuideDraft("");
    setGuideOpen(true);

    window.setTimeout(() => guideInputRef.current?.focus(), 50);
  }

  function openRecommendationGuide(c: CareerSuggestion) {
    const ctx = {
      areaId: activeArea.id,
      areaLabel: activeArea.label,
      rating: "somewhat" as FeedbackRating,
      source: "recommendation_pick" as const,
    };

    setGuideCtx(ctx);

    const seed: GuideMsg[] = [
      {
        role: "guide",
        text:
          `Ok cool.\n\nYou picked **${c.title}**.\n\n` +
          `Quick 3-day test:\n${c.starterExperiment}\n\n` +
          `When could you do the *first step* — today or tomorrow?`,
      },
    ];

    setGuideMsgs(seed);
    setGuideDraft("");
    setGuideOpen(true);

    window.setTimeout(() => guideInputRef.current?.focus(), 50);
  }

  function closeGuide() {
    setGuideOpen(false);
  }

  function submitGuide() {
    const text = guideDraft.trim();
    if (!text) return;

    setGuideMsgs((prev) => [...prev, { role: "user", text }]);
    setGuideDraft("");

    const followUp =
      guideCtx?.source === "recommendation_pick"
        ? "Nice. What would make this test feel *easy*—time, place, or who you do it with?"
        : guideCtx?.rating === "nope"
        ? "Got it. What’s the *truer* pattern for you (and when does it show up most)?"
        : guideCtx?.rating === "somewhat"
        ? "Helpful. Which part should I tone down or flip, and what’s the better version?"
        : "Nice. What’s one specific example from your life that proves this is true?";

    setGuideMsgs((prev) => [...prev, { role: "guide", text: followUp }]);
  }

  React.useEffect(() => {
    if (!deepOpen) return;

    window.setTimeout(() => deepCloseBtnRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDeepDive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deepOpen]);

  React.useEffect(() => {
    if (!guideOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGuide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guideOpen]);

  function computeChipScrollState() {
    const el = chipsWrapRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }

  React.useEffect(() => {
    computeChipScrollState();
    const onResize = () => computeChipScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function scrollChips(dir: "left" | "right") {
    const el = chipsWrapRef.current;
    if (!el) return;
    setChipsHintSeen(true);
    el.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
    window.setTimeout(computeChipScrollState, 250);
  }

  const feedbackButtonBase =
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95";
  const feedbackButtonDark =
    "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10";
  const feedbackButtonLight =
    "border-slate-200 bg-white/85 text-slate-800 hover:bg-white";

  /* ============================================================
     Recommendations styling (LOCKED)
     ============================================================ */

  const careerDeepHref = (id: CareerSuggestion["id"]) =>
    `/main/career/${id}?mode=explore`;

  const recAccents = [
    {
      rail: "from-sky-300 via-cyan-300 to-indigo-300",
      chip: "bg-sky-300/15 text-sky-100 border-sky-200/20",
      cta: "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/25",
      halo: "from-sky-500/18 via-cyan-400/10 to-indigo-500/10",
    },
    {
      rail: "from-emerald-300 via-teal-300 to-sky-300",
      chip: "bg-emerald-300/15 text-emerald-100 border-emerald-200/20",
      cta: "bg-emerald-300 text-slate-950 hover:bg-emerald-200 shadow-emerald-300/25",
      halo: "from-emerald-500/16 via-teal-400/10 to-sky-500/10",
    },
    {
      rail: "from-amber-300 via-orange-300 to-rose-300",
      chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
      cta: "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
      halo: "from-amber-500/16 via-orange-400/10 to-rose-500/10",
    },
    {
      rail: "from-violet-300 via-fuchsia-300 to-sky-300",
      chip: "bg-violet-300/15 text-violet-100 border-violet-200/20",
      cta: "bg-violet-300 text-slate-950 hover:bg-violet-200 shadow-violet-300/25",
      halo: "from-violet-500/16 via-fuchsia-400/10 to-sky-500/10",
    },
  ] as const;

  /* ============================================================
     Trait card rendering (supports your variants)
     IMPORTANT: vertical stack always
     ============================================================ */

  // Allow story / warning / micro payloads (e.g. Historical Doppelganger)
  type StoryPayload = {
    title?: string;
    lead?: string;
    beats?: string[];
    closer?: string;
  };

  type WarningPayload = {
    title?: string;
    text?: string;
    bullets?: string[];
  };

  type MicroPayload = {
    facts?: string[];
  };

  type ExtendedTraitCard = TraitCard & {
    story?: StoryPayload;
    warning?: WarningPayload;
    micro?: MicroPayload;
  };

  function chipForVariant(v?: TraitCardVariant) {
    if (!v) return null;
    const label =
      v === "micro"
        ? "micro"
        : v === "quote"
        ? "quote"
        : v === "contrast"
        ? "contrast"
        : v === "checklist"
        ? "checklist"
        : v === "story"
        ? "story"
        : v === "warning"
        ? "watchout"
        : "exercise";

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
          dark
            ? "border-white/10 bg-white/5 text-slate-100"
            : "border-slate-200 bg-white/85 text-slate-800"
        }`}
      >
        {label}
      </span>
    );
  }

  function TraitTile({ c }: { c: TraitCard }) {
    const card = c as ExtendedTraitCard;

    const base =
      dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80";

    const insetPanel =
      dark
        ? "border-white/10 bg-slate-950/45 text-slate-100"
        : "border-slate-200 bg-white/75 text-slate-800";

    return (
      <div className={`rounded-3xl border px-5 py-4 backdrop-blur-xl ${base}`}>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              dark ? "bg-slate-950/60 text-slate-50" : "bg-slate-900/5 text-slate-800"
            }`}
            aria-hidden
          >
            <span className="text-lg">{c.icon ?? "✨"}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div
                className={`text-base font-semibold ${
                  dark ? "text-slate-50" : "text-slate-900"
                }`}
              >
                {c.title}
              </div>
              {chipForVariant(c.variant)}
            </div>

            <div className={`mt-1 text-sm ${pageTextMutedClass}`}>{c.short}</div>

            {c.variant === "quote" && c.quote ? (
              <div
                className={`mt-3 rounded-2xl border px-4 py-3 text-sm italic ${
                  dark
                    ? "border-white/10 bg-slate-950/35 text-slate-100"
                    : "border-slate-200 bg-white/70 text-slate-800"
                }`}
              >
                “{c.quote}”
              </div>
            ) : null}

            {c.variant === "checklist" && c.bullets?.length ? (
              <ul className={`mt-3 space-y-1 text-sm ${pageTextMutedClass}`}>
                {c.bullets.slice(0, 6).map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className={`mt-1 inline-block h-1.5 w-1.5 rounded-full ${
                        dark ? "bg-slate-200/70" : "bg-slate-500"
                      }`}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {c.variant === "contrast" && c.contrast ? (
              <div className="mt-3 space-y-2">
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    dark
                      ? "border-emerald-200/10 bg-emerald-500/10 text-slate-100"
                      : "border-emerald-200 bg-emerald-50 text-slate-800"
                  }`}
                >
                  <span className="font-semibold">Do: </span>
                  {c.contrast.do}
                </div>
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    dark
                      ? "border-rose-200/10 bg-rose-500/10 text-slate-100"
                      : "border-rose-200 bg-rose-50 text-slate-800"
                  }`}
                >
                  <span className="font-semibold">Avoid: </span>
                  {c.contrast.avoid}
                </div>
              </div>
            ) : null}

            {c.variant === "exercise" && c.prompt ? (
              <div className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${insetPanel}`}>
                <span className="font-semibold">Exercise: </span>
                {c.prompt}
              </div>
            ) : null}

            {c.variant === "story" && (card.story?.lead || card.story?.beats?.length) ? (
              <div
                className={`mt-3 overflow-hidden rounded-2xl border ${
                  dark ? "border-white/10" : "border-slate-200"
                }`}
              >
                <div className={`px-4 py-3 ${dark ? "bg-slate-950/40" : "bg-white/70"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className={`text-sm font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                      {card.story?.title ?? "Mini story"}
                    </div>
                    <span className={`text-xs font-semibold ${dark ? "text-slate-300/70" : "text-slate-600/80"}`}>
                      playful read
                    </span>
                  </div>

                  {card.story?.lead ? (
                    <div className={`mt-2 text-sm ${pageTextMutedClass}`}>{card.story.lead}</div>
                  ) : null}
                </div>

                {card.story?.beats?.length ? (
                  <div className={`px-4 py-3 ${dark ? "bg-slate-950/55" : "bg-white/85"}`}>
                    <ol className="space-y-2">
                      {card.story.beats.slice(0, 4).map((b, idx) => (
                        <li key={`${c.id}-beat-${idx}`} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              dark ? "bg-white/10 text-slate-100" : "bg-slate-900/5 text-slate-800"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className={`text-sm ${pageTextMutedClass}`}>{b}</div>
                        </li>
                      ))}
                    </ol>

                    {card.story?.closer ? (
                      <div
                        className={`mt-3 rounded-xl border px-3 py-2 text-xs leading-relaxed ${
                          dark
                            ? "border-white/10 bg-white/5 text-slate-200/85"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">Try this lens: </span>
                        {card.story.closer}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {c.variant === "warning" && (card.warning?.text || card.warning?.bullets?.length) ? (
              <div
                className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${
                  dark
                    ? "border-amber-200/10 bg-amber-500/10 text-slate-100"
                    : "border-amber-200 bg-amber-50 text-slate-800"
                }`}
              >
                <div className="font-semibold">{card.warning?.title ?? "Watch out"}</div>

                {card.warning?.text ? (
                  <div className={`mt-1 ${pageTextMutedClass}`}>{card.warning.text}</div>
                ) : null}

                {card.warning?.bullets?.length ? (
                  <ul className={`mt-2 space-y-1 text-sm ${pageTextMutedClass}`}>
                    {card.warning.bullets.slice(0, 5).map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1">
                          ⚠️
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {c.variant === "micro" && card.micro?.facts?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {card.micro.facts.slice(0, 6).map((f) => (
                  <span
                    key={f}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100"
                        : "border-slate-200 bg-white/80 text-slate-800"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            ) : null}

            {c.long ? (
              <div
                className={`mt-3 text-xs leading-relaxed ${
                  dark ? "text-slate-200/75" : "text-slate-700/80"
                }`}
              >
                {c.long}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     Non-recommendation lane card (vertical tiles)
     ============================================================ */

  function LaneCard() {
    // ✅ Force Historical Doppelganger to appear right after Skills (if both exist)
    const orderedCards = React.useMemo(() => {
      const cards = (activeArea.cards ?? []).slice();
      if (!cards.length) return cards;

      const NEW_ID = "historical_doppelganger";
      const ANCHOR_ID = "skills";

      const newIdx = cards.findIndex((c) => c.id === NEW_ID);
      if (newIdx < 0) return cards; // new card not in this lane

      const [newCard] = cards.splice(newIdx, 1);
      const anchorIdx = cards.findIndex((c) => c.id === ANCHOR_ID);

      if (anchorIdx >= 0) {
        cards.splice(anchorIdx + 1, 0, newCard);
        return cards;
      }

      // If skills isn't present for some reason, put new card at end
      cards.push(newCard);
      return cards;
    }, [activeArea.cards]);

    return (
      <section className="mb-5">
        <div
          className={`relative overflow-hidden rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}
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
            <div className={sectionLabelClass}>{activeArea.label}</div>

            <div className="mt-2 max-w-2xl">
              <div
                className={`text-lg font-semibold ${
                  dark ? "text-slate-50" : "text-slate-900"
                }`}
              >
                {activeArea.summary}
              </div>
              <div className={`mt-1 text-sm ${pageTextMutedClass}`}>
                {activeArea.hint}
              </div>
            </div>

            {/* ===== Tiles: ALWAYS VERTICAL ===== */}
            {orderedCards.length ? (
              <div className="mt-5 flex flex-col gap-3">
                {orderedCards.slice(0, 6).map((c) => (
                  <TraitTile key={c.id} c={c} />
                ))}
              </div>
            ) : null}

            {/* next moves */}
            {activeArea.nextMoves?.length ? (
              <div className="mt-6">
                <div
                  className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${microText}`}
                >
                  Next moves
                </div>

                <div className="space-y-2">
                  {activeArea.nextMoves.slice(0, 4).map((m, idx) => (
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
                          {idx + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div
                              className={`text-sm font-semibold ${
                                dark ? "text-slate-50" : "text-slate-900"
                              }`}
                            >
                              {m.title}
                            </div>

                            {m.timebox ? (
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold ${
                                  dark
                                    ? "border-white/10 bg-white/5 text-slate-100"
                                    : "border-slate-200 bg-white/80 text-slate-800"
                                }`}
                              >
                                {m.timebox}
                              </span>
                            ) : null}

                            {m.difficulty ? (
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold ${
                                  dark
                                    ? "border-white/10 bg-white/5 text-slate-100"
                                    : "border-slate-200 bg-white/80 text-slate-800"
                                }`}
                              >
                                {m.difficulty}
                              </span>
                            ) : null}
                          </div>

                          <div className={`mt-1 text-sm ${pageTextMutedClass}`}>
                            {m.blurb}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* signals */}
            <div className="mt-6">
              <div
                className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${microText}`}
              >
                Signals
              </div>
              <div className="flex flex-wrap gap-2">
                {topSignals.map((sig) => (
                  <span
                    key={sig}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100"
                        : "border-slate-200 bg-white/80 text-slate-800"
                    }`}
                  >
                    {sig}
                  </span>
                ))}
                {extraSignals > 0 ? (
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs opacity-85 ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100"
                        : "border-slate-200 bg-white/80 text-slate-800"
                    }`}
                  >
                    +{extraSignals} more
                  </span>
                ) : null}
              </div>
            </div>

            {/* quick check */}
            <div className="mt-6">
              <div
                className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${microText}`}
              >
                Quick check
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openGuide("mostly", "page")}
                  className={`${feedbackButtonBase} ${
                    dark ? feedbackButtonDark : feedbackButtonLight
                  }`}
                >
                  👍 This fits
                </button>
                <button
                  type="button"
                  onClick={() => openGuide("somewhat", "page")}
                  className={`${feedbackButtonBase} ${
                    dark ? feedbackButtonDark : feedbackButtonLight
                  }`}
                >
                  😐 Kinda
                </button>
                <button
                  type="button"
                  onClick={() => openGuide("nope", "page")}
                  className={`${feedbackButtonBase} ${
                    dark ? feedbackButtonDark : feedbackButtonLight
                  }`}
                >
                  👎 Nope
                </button>
              </div>
            </div>

            {/* context + go deeper */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setLaneContextOpen((o) => !o)}
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  dark
                    ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                }`}
                aria-expanded={laneContextOpen}
              >
                More context
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    laneContextOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={openDeepDive}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/35 transition hover:bg-amber-200 active:scale-95"
              >
                Go deeper <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {laneContextOpen ? (
              <div className="mt-4 space-y-4">
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    dark
                      ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90"
                      : "border-slate-200 bg-white/80 text-slate-700"
                  }`}
                >
                  <div className="font-semibold">What I’m noticing</div>
                  <div className={`mt-2 ${pageTextMutedClass}`}>
                    <span className={dark ? "text-slate-100" : "text-slate-900"}>
                      {activeArea.summary}
                    </span>
                  </div>
                  <div className={`mt-2 ${pageTextMutedClass}`}>
                    {activeArea.hint}
                  </div>
                  <div className={`mt-3 whitespace-pre-wrap ${pageTextMutedClass}`}>
                    {activeArea.coachRead}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setWhyOpen((o) => !o)}
                    className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      dark
                        ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                    }`}
                    aria-expanded={whyOpen}
                  >
                    What I’m basing this on
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        whyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {whyOpen ? (
                    <div
                      className={`relative mt-3 rounded-2xl border px-4 py-3 text-sm ${
                        dark
                          ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90"
                          : "border-slate-200 bg-white/80 text-slate-700"
                      }`}
                    >
                      {activeArea.about}
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

  /* ============================================================
     Render
   ============================================================ */

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="insights_orb"
      ambientCap={0.35}
    >
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
          {/* top row */}
          <div className="relative mb-5 flex flex-col gap-3">
            <div
              aria-hidden
              className={`pointer-events-none absolute left-0 top-1 h-10 w-[3px] rounded-full ${chipAccentBar} opacity-60`}
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={sectionLabelClass}>Insights</span>
              </div>
            </div>

            {/* chips row + scroll affordance */}
            <div className="relative mt-2">
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 w-10 ${
                  dark
                    ? "bg-gradient-to-r from-slate-950/70 to-transparent"
                    : "bg-gradient-to-r from-white/80 to-transparent"
                } ${canScrollLeft ? "opacity-100" : "opacity-0"} transition-opacity`}
              />
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 right-0 w-10 ${
                  dark
                    ? "bg-gradient-to-l from-slate-950/70 to-transparent"
                    : "bg-gradient-to-l from-white/80 to-transparent"
                } ${canScrollRight ? "opacity-100" : "opacity-0"} transition-opacity`}
              />

              {canScrollLeft ? (
                <button
                  type="button"
                  onClick={() => scrollChips("left")}
                  className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border p-2 shadow-lg transition active:scale-95 ${
                    dark
                      ? "border-white/10 bg-slate-950/55 text-slate-100 hover:bg-slate-950/70"
                      : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
                  }`}
                  aria-label="Scroll insights left"
                  title="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : null}

              {canScrollRight ? (
                <button
                  type="button"
                  onClick={() => scrollChips("right")}
                  className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border p-2 shadow-lg transition active:scale-95 ${
                    dark
                      ? "border-white/10 bg-slate-950/55 text-slate-100 hover:bg-slate-950/70"
                      : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
                  }`}
                  aria-label="Scroll insights right"
                  title="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : null}

              <div
                ref={chipsWrapRef}
                onScroll={() => {
                  computeChipScrollState();
                  setChipsHintSeen(true);
                }}
                className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="flex items-stretch gap-2 pr-2">
                  {INSIGHTS_AREAS.map((area, idx) => {
                    const active = idx === activeIndex;
                    const dot = `bg-gradient-to-br ${area.glowClass}`;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => goToArea(idx)}
                        className={`relative inline-flex shrink-0 flex-col items-start gap-0.5 rounded-2xl border px-4 py-2.5 text-left transition ${
                          active ? areaChipActive : areaChipBase
                        }`}
                      >
                        {active && (
                          <span
                            aria-hidden
                            className={`absolute left-1 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b ${area.glowClass}`}
                          />
                        )}

                        <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                          <span className={`h-2.5 w-2.5 rounded-full ${dot} opacity-90`} />
                          {area.label}
                        </span>
                        <span className={`text-xs leading-tight ${microText}`}>
                          {area.chip}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {!chipsHintSeen && canScrollRight ? (
                <div
                  className={`mt-2 text-center text-xs ${
                    dark ? "text-slate-300/60" : "text-slate-600/70"
                  }`}
                >
                  Swipe <span className="mx-1">←</span>
                  <span className="mx-1">→</span> to explore
                </div>
              ) : null}
            </div>
          </div>

          {/* =========================
             LANE CONTENT
             ========================= */}
          {isRecommendations ? (
            // ==========================================================
            // RECOMMENDATIONS (LOCKED — DO NOT CHANGE)
            // ==========================================================
            <section className="mb-5">
              <div
                className={`relative overflow-hidden rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}
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
                  <div className={sectionLabelClass}>Recommendations</div>
                  <div className="mt-2 max-w-2xl">
                    <div
                      className={`text-lg font-semibold ${
                        dark ? "text-slate-50" : "text-slate-900"
                      }`}
                    >
                      4 Everleap recommendations for you
                    </div>
                    <div className={`mt-1 text-sm ${pageTextMutedClass}`}>
                      Not a forever decision. Pick one lane, run a tiny test,
                      then adjust.
                    </div>
                  </div>

                  {activeArea.careerSuggestions?.length ? (
                    <div className="mt-5 space-y-3">
                      {activeArea.careerSuggestions.slice(0, 4).map((c, idx) => {
                        const a = recAccents[idx] ?? recAccents[0];
                        return (
                          <div
                            key={c.id}
                            className={`
                              relative overflow-hidden rounded-3xl border p-[1px]
                              ${
                                dark
                                  ? "border-white/10 bg-white/5"
                                  : "border-slate-200 bg-white/80"
                              }
                            `}
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
                                  <div
                                    className={`text-base font-semibold ${
                                      dark ? "text-slate-50" : "text-slate-900"
                                    }`}
                                  >
                                    {c.title}
                                  </div>
                                </div>

                                <div className={`mt-2 text-sm ${pageTextMutedClass}`}>
                                  {c.why}
                                </div>

                                <div
                                  className={`mt-2 text-xs ${
                                    dark ? "text-slate-300/70" : "text-slate-600/80"
                                  }`}
                                >
                                  <span className="font-semibold">Best if:</span>{" "}
                                  {c.bestFor}
                                </div>

                                <div
                                  className={`mt-3 text-xs ${
                                    dark ? "text-slate-200/80" : "text-slate-700"
                                  }`}
                                >
                                  <span className="font-semibold">3-day test:</span>{" "}
                                  {c.starterExperiment}
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                <Link
                                  href={careerDeepHref(c.id)}
                                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition active:scale-95 ${
                                    dark
                                      ? `${a.cta} shadow-[0_12px_34px_rgba(0,0,0,0.35)]`
                                      : "bg-sky-600 text-white hover:bg-sky-500"
                                  }`}
                                >
                                  Dive deeper <ArrowRight className="h-4 w-4" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => openRecommendationGuide(c)}
                                  className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                                    dark
                                      ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                                      : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
                                  }`}
                                >
                                  Try this
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openGuide("somewhat", "page")}
                                  className={`ml-auto text-xs font-semibold ${
                                    dark
                                      ? "text-slate-200/70 hover:text-slate-50"
                                      : "text-slate-700/70 hover:text-slate-900"
                                  }`}
                                  title="Tell Everleap what to change about these picks"
                                >
                                  React to these
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <div
                      className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${microText}`}
                    >
                      Quick check
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openGuide("mostly", "page")}
                        className={`${feedbackButtonBase} ${
                          dark ? feedbackButtonDark : feedbackButtonLight
                        }`}
                      >
                        👍 These fit
                      </button>
                      <button
                        type="button"
                        onClick={() => openGuide("somewhat", "page")}
                        className={`${feedbackButtonBase} ${
                          dark ? feedbackButtonDark : feedbackButtonLight
                        }`}
                      >
                        😐 Kinda
                      </button>
                      <button
                        type="button"
                        onClick={() => openGuide("nope", "page")}
                        className={`${feedbackButtonBase} ${
                          dark ? feedbackButtonDark : feedbackButtonLight
                        }`}
                      >
                        👎 Nope
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setRecContextOpen((o) => !o)}
                      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                        dark
                          ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                          : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                      }`}
                      aria-expanded={recContextOpen}
                    >
                      More context
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          recContextOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={openDeepDive}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/35 transition hover:bg-amber-200 active:scale-95"
                    >
                      Go deeper <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {recContextOpen ? (
                    <div className="mt-4 space-y-4">
                      <div
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          dark
                            ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90"
                            : "border-slate-200 bg-white/80 text-slate-700"
                        }`}
                      >
                        <div className="font-semibold">What I’m noticing</div>
                        <div className={`mt-2 ${pageTextMutedClass}`}>
                          <span className={dark ? "text-slate-100" : "text-slate-900"}>
                            {activeArea.summary}
                          </span>
                        </div>
                        <div className={`mt-2 ${pageTextMutedClass}`}>
                          {activeArea.hint}
                        </div>
                        <div className={`mt-3 whitespace-pre-wrap ${pageTextMutedClass}`}>
                          {activeArea.coachRead}
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setWhyOpen((o) => !o)}
                          className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            dark
                              ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                              : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                          }`}
                          aria-expanded={whyOpen}
                        >
                          What I’m basing this on
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              whyOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {whyOpen ? (
                          <div
                            className={`relative mt-3 rounded-2xl border px-4 py-3 text-sm ${
                              dark
                                ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90"
                                : "border-slate-200 bg-white/80 text-slate-700"
                            }`}
                          >
                            {activeArea.about}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : (
            <LaneCard />
          )}
        </main>

        <BottomNav />

        {/* =========================
            GO DEEPER MODAL / SHEET
           ========================= */}
        {deepOpen ? (
          <div className="fixed inset-0 z-[60]">
            <button
              type="button"
              onClick={closeDeepDive}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              aria-label="Close"
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl md:inset-0 md:flex md:items-center md:justify-center">
              <div
                className="
                  relative w-full
                  rounded-t-[28px] border border-white/10 bg-slate-950/80
                  shadow-[0_45px_140px_rgba(0,0,0,0.65)] backdrop-blur-2xl
                  md:rounded-[28px] md:max-h-[82vh]
                "
                role="dialog"
                aria-modal="true"
                aria-label={activeArea.deepDive.title}
              >
                <div className="sticky top-0 z-10 rounded-t-[28px] border-b border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-2xl md:rounded-t-[28px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
                        Go deeper
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-50">
                        {activeArea.deepDive.title}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-300/70">Accurate?</span>
                        <button
                          type="button"
                          onClick={() => openGuide("mostly", "deep")}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                        >
                          👍 Mostly
                        </button>
                        <button
                          type="button"
                          onClick={() => openGuide("somewhat", "deep")}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                        >
                          😐 Somewhat
                        </button>
                        <button
                          type="button"
                          onClick={() => openGuide("nope", "deep")}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                        >
                          👎 Not really
                        </button>
                      </div>

                      {activeArea.id === "career" && activeArea.careerSuggestions?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activeArea.careerSuggestions.slice(0, 4).map((c) => (
                            <Link
                              key={c.id}
                              href={careerDeepHref(c.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                            >
                              {c.id.toUpperCase()} <ArrowRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <button
                      ref={deepCloseBtnRef}
                      type="button"
                      onClick={closeDeepDive}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 active:scale-95"
                      aria-label="Close modal"
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[72vh] overflow-y-auto px-5 pb-6 pt-4 md:max-h-[72vh]">
                  <div className="space-y-6">
                    {activeArea.deepDive.sections.map((s) => (
                      <section key={s.h} className="space-y-2">
                        <div className="text-sm font-semibold text-slate-50">{s.h}</div>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200/85">
                          {s.p}
                        </div>
                      </section>
                    ))}

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={closeDeepDive}
                        className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/40 hover:bg-amber-200 active:scale-[0.99]"
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-3 md:hidden" />
              </div>
            </div>
          </div>
        ) : null}

        {/* =========================
            GUIDE FEEDBACK MODAL
           ========================= */}
        {guideOpen ? (
          <div className="fixed inset-0 z-[70]">
            <button
              type="button"
              onClick={closeGuide}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="Close"
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl md:inset-0 md:flex md:items-center md:justify-center">
              <div
                className="
                  relative w-full
                  rounded-t-[28px] border border-white/10 bg-slate-950/85
                  shadow-[0_45px_140px_rgba(0,0,0,0.72)] backdrop-blur-2xl
                  md:rounded-[28px] md:max-h-[82vh]
                "
                role="dialog"
                aria-modal="true"
                aria-label="Everleap Guide"
              >
                <div className="sticky top-0 z-10 rounded-t-[28px] border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-2xl md:rounded-t-[28px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
                        Guide
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-50">
                        Calibration
                      </div>
                      {guideCtx ? (
                        <div className="mt-1 text-sm text-slate-300/85">
                          {guideCtx.areaLabel}
                          {guideCtx.source === "recommendation_pick"
                            ? " • picked a lane"
                            : ` • ${labelForRating(guideCtx.rating)}`}
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={closeGuide}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 active:scale-95"
                      aria-label="Close"
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[58vh] overflow-y-auto px-5 pb-4 pt-4 md:max-h-[58vh]">
                  <div className="space-y-3">
                    {guideMsgs.map((m, i) => {
                      const isGuide = m.role === "guide";
                      return (
                        <div
                          key={i}
                          className={`flex ${isGuide ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                              isGuide
                                ? "border border-white/10 bg-white/5 text-slate-100"
                                : "bg-sky-300 text-slate-950"
                            }`}
                          >
                            {m.text.split(/\*\*(.*?)\*\*/g).map((chunk, idx) =>
                              idx % 2 === 1 ? (
                                <strong key={idx}>{chunk}</strong>
                              ) : (
                                <span key={idx}>{chunk}</span>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/10 bg-slate-950/70 px-5 py-4">
                  <div className="flex items-end gap-3">
                    <textarea
                      ref={guideInputRef}
                      value={guideDraft}
                      onChange={(e) => setGuideDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submitGuide();
                        }
                      }}
                      rows={2}
                      placeholder="Tell me what you’re thinking…"
                      className="min-h-[52px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400/70"
                    />

                    <button
                      type="button"
                      onClick={submitGuide}
                      disabled={!guideDraft.trim()}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95 ${
                        guideDraft.trim()
                          ? "bg-sky-300 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:bg-sky-200"
                          : "bg-white/10 text-slate-200/50"
                      }`}
                      aria-label="Send"
                      title="Send"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-slate-300/50">
                    Placeholder guide flow for now (no AI API yet). Your responses can be stored later for learning.
                  </div>
                </div>

                <div className="h-3 md:hidden" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppChrome>
  );
}
