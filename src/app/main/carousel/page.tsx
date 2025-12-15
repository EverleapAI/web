// src/app/main/carousel/page.tsx
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Star, ArrowRight } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

/* ========= Data types ========= */

type TraitCard = {
  id: string;
  title: string;
  short: string;
  long?: string;
  icon?: string;
};

type YouMapArea = {
  id: string;
  label: string;
  chip: string;
  icon: ReactNode;
  glowClass: string;

  /** Option B: short hero summary */
  summary: string;

  /** Coach note (secondary) */
  hint: string;

  signals: string[];
  about: string;
  cards: TraitCard[];
};

/* ========= Areas content ========= */

const areas: YouMapArea[] = [
  {
    id: "motivations",
    label: "Motivations",
    chip: "What drives you",
    icon: <span aria-hidden>🔥</span>,
    glowClass: "from-amber-400 via-orange-500 to-rose-500",
    summary:
      "You’re most energized when what you’re doing feels meaningful and you can see momentum building.",
    hint:
      "Notice when you feel secretly energized vs secretly drained. Those signals are more honest than what you think you ‘should’ care about.",
    signals: [
      "High-meaning seeker",
      "Momentum driven",
      "Energy leaks: busywork",
      "Most engaged when progress is visible",
    ],
    about:
      "Motivations are the reasons your brain and heart actually show up. When you understand what pulls you forward—and what quietly drains you—you can choose environments, classes, and work that fit how you’re wired, not how you’re ‘supposed’ to be.",
    cards: [
      {
        id: "lights-you-up",
        title: "What lights you up",
        short:
          "You get energized when there’s a clear purpose behind what you’re doing.",
        long:
          "You’d rather work hard on something you care about than coast on something that feels empty. When a project feels connected to real people or impact, you can push through effort and struggle in a way that doesn’t happen with tasks that feel meaningless.",
        icon: "🔥",
      },
      {
        id: "drains-you",
        title: "What drains you",
        short: "Endless busywork and unclear expectations drain your energy fast.",
        long:
          "When nobody seems to care, or you’re just checking boxes, your brain taps out. You need to understand the ‘why’ behind what you’re doing—otherwise it starts to feel like you’re wasting time instead of building something.",
        icon: "💤",
      },
      {
        id: "how-you-stay-engaged",
        title: "How you stay engaged",
        short:
          "You stay engaged when you can see progress, get feedback, and feel movement.",
        long:
          "Seeing small wins, milestones, or real reactions from people keeps you in the game. Long stretches with no feedback or visible progress make everything feel heavier than it is.",
        icon: "📈",
      },
      {
        id: "energy-pattern",
        title: "Your energy pattern",
        short:
          "Your energy spikes when a project feels real and connected to people.",
        long:
          "You light up fastest when there’s a person, story, or outcome attached to the work. When everything turns into pure busywork or endless grind, your motivation drops and distractions start looking way more interesting.",
        icon: "⚡",
      },
      {
        id: "when-youre-most-motivated",
        title: "When you’re most motivated",
        short:
          "You’re most motivated when there’s a clear win in sight—like finishing something or hitting a checkpoint.",
        long:
          "Your brain likes momentum. Deadlines, visible goals, and small ‘wins’ along the way help you stay locked in. Open-ended tasks with no finish line feel harder to care about, even if they’re important.",
        icon: "🏁",
      },
      {
        id: "watch-these-flags",
        title: "Flags to watch",
        short:
          "If you catch yourself doom-scrolling or avoiding simple tasks, your energy might be leaking—not because you’re lazy.",
        long:
          "When your motivation disappears, it’s often a sign that the work feels pointless or disconnected—not that you’re broken. Your brain is protesting the environment, not effort itself.",
        icon: "🚩",
      },
    ],
  },
  {
    id: "strengths",
    label: "Strengths",
    chip: "How you naturally show up",
    icon: <span aria-hidden>✨</span>,
    glowClass: "from-violet-500 via-fuchsia-500 to-sky-400",
    summary:
      "Your strengths are the moves you make without thinking—skills that feel “normal” to you but stand out to others.",
    hint:
      "These are the muscles you use without thinking. You may underestimate them because they feel ‘normal’.",
    signals: ["Pattern spotter", "Reliable under pressure", "Learns fast"],
    about:
      "Strengths are the things you do so naturally that you sometimes forget they’re rare. When you name them, it’s easier to choose paths where those strengths actually matter.",
    cards: [
      {
        id: "strengths-placeholder",
        title: "Your strengths story",
        short:
          "Soon, Everleap will pull specific strengths from your answers and tiny wins.",
        long:
          "As you keep using Everleap—answering questions, logging wins, and exploring—you’ll see clearer patterns around how you think, work, and support people.",
        icon: "✨",
      },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    chip: "What you can already do",
    icon: <span aria-hidden>🛠️</span>,
    glowClass: "from-cyan-400 via-sky-500 to-indigo-500",
    summary:
      "These are tools you’ve already picked up—some obvious, some hidden—and they’ll compound fast when paired with the right motivation.",
    hint:
      "Skills are tools you’ve picked up along the way. Some are obvious, some are hidden.",
    signals: ["Emerging builder", "Comfortable learning tools"],
    about:
      "Skills are the tools you already have. When you combine them with your motivations and strengths, new paths start to show up that didn’t look possible before.",
    cards: [
      {
        id: "skills-placeholder",
        title: "Skills snapshot",
        short:
          "As you share more of your story, this section will highlight skills you might be underestimating.",
        icon: "🛠️",
      },
    ],
  },
  {
    id: "friends",
    label: "Friends",
    chip: "Your people patterns",
    icon: <span aria-hidden>🧑‍🤝‍👩</span>,
    glowClass: "from-emerald-400 via-teal-400 to-sky-400",
    summary:
      "The people around you shape your energy. This helps spot what kind of connection helps you thrive (and what quietly drains you).",
    hint: "The people you’re around change how you feel, think, and move.",
    signals: ["Values deep conversations", "Sensitive to group energy"],
    about:
      "Your friendships and social patterns say a lot about how you connect, how you recharge, and what kind of environments you feel safe in.",
    cards: [
      {
        id: "friends-placeholder",
        title: "Friendship patterns",
        short:
          "Soon, Everleap will surface how your relationships support—or drain—your energy.",
        icon: "🧑‍🤝‍🧑",
      },
    ],
  },
  {
    id: "family",
    label: "Family",
    chip: "Where you’re coming from",
    icon: <span aria-hidden>🏠</span>,
    glowClass: "from-rose-400 via-amber-400 to-fuchsia-500",
    summary:
      "Family patterns shape how you interpret pressure, safety, and success—so you can keep what helps and rewrite what doesn’t.",
    hint: "Family shapes how you see safety, pressure, and success.",
    signals: ["Carries responsibility", "Notices emotions in the room"],
    about:
      "You don’t have to become your family—or run away from it. Understanding the patterns you grew up around helps you choose what you want to keep and what you want to do differently.",
    cards: [
      {
        id: "family-placeholder",
        title: "Family lens",
        short:
          "This area will grow as you share more about your home life and the expectations around you.",
        icon: "🏠",
      },
    ],
  },
  {
    id: "career",
    label: "Career",
    chip: "Paths that might fit",
    icon: <span aria-hidden>🧭</span>,
    glowClass: "from-sky-400 via-indigo-500 to-slate-400",
    summary:
      "We’re exploring directions that match your wiring—not locking you into a single job title. Think patterns, not labels.",
    hint:
      "We’re not locking you into one path. We’re exploring directions that fit your wiring.",
    signals: ["Curious explorer", "Values impact over titles"],
    about:
      "Career for you isn’t just a job title. It’s a mix of impact, lifestyle, people, and the kind of problems you like solving.",
    cards: [
      {
        id: "career-placeholder",
        title: "Early signals",
        short:
          "As your story grows, this section will suggest directions that match your energy and strengths—not just your grades.",
        icon: "🧭",
      },
    ],
  },
];

export default function YouMapPage() {
  // Shared visual state (AppChrome, same pattern as Spotlight)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [expandedCardId, setExpandedCardId] = React.useState<string | null>(null);
  const [whyOpen, setWhyOpen] = React.useState(false);

  const detailsRef = React.useRef<HTMLDivElement | null>(null);


  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const activeArea = areas[activeIndex];
  const topSignals = activeArea.signals.slice(0, 3);
  const extraSignals = Math.max(activeArea.signals.length - topSignals.length, 0);

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";

  const pageTextMutedClass = dark ? "text-slate-300/90" : "text-slate-600";

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";

  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const chipClasses = dark
    ? `inline-flex items-center gap-1 rounded-full border ${theme.chipBorderClass} ${theme.chipBgClass} px-3 py-1.5 text-xs text-slate-100`
    : `inline-flex items-center gap-1 rounded-full border ${theme.chipBorderClass} ${theme.chipBgClass} px-3 py-1.5 text-xs text-slate-800`;

  const microText = dark ? "text-slate-400" : "text-slate-500";

  const areaPillInactive = dark
    ? "border-slate-800/80 bg-slate-950/65 text-slate-200 hover:bg-slate-950/80"
    : "border-slate-200 bg-white/90 text-slate-800 hover:bg-white";

  const areaPillActive = dark
    ? "border-sky-400/60 bg-slate-950/80 text-slate-50 shadow-sm shadow-sky-400/20"
    : "border-sky-300 bg-white text-slate-900 shadow-sm";

  const detailCardBase = dark
    ? "rounded-3xl border border-slate-800/80 bg-slate-950/70 shadow-[0_14px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
    : "rounded-3xl border border-slate-200 bg-white/95 shadow-sm";

  const detailCardExpanded = dark
    ? "border-sky-400/70 bg-slate-950/80"
    : "border-sky-300 bg-sky-50/70";

  const detailShortText = dark ? "text-slate-200/90" : "text-slate-700";
  const detailLongText = dark ? "text-slate-300/90" : "text-slate-600";

  const accentGlow = `bg-gradient-to-br ${activeArea.glowClass}`;

  function goToArea(nextIndex: number) {
    setExpandedCardId(null);
    setWhyOpen(false);
    setActiveIndex(nextIndex);
  }

  function scrollToDetails() {
    const node = detailsRef.current;
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="youmap_orb"
      ambientCap={0.35}
    >
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
          {/* Header */}
          <header className="mb-4 md:mb-5">
            <div className={sectionLabelClass}>Insights</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              About you • {activeArea.label}
            </h1>
            <p className={`mt-2 max-w-xl text-sm ${pageTextMutedClass}`}>
              A calm starting point. Open details only if you want them.
            </p>
          </header>

          {/* Area selector */}
          <section className="mb-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  goToArea(activeIndex === 0 ? areas.length - 1 : activeIndex - 1)
                }
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-95 ${
                  dark
                    ? "border-slate-800/80 bg-slate-950/70 text-slate-100 hover:bg-slate-950/90"
                    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                }`}
                aria-label="Previous area"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-2 pr-2">
                  {areas.map((area, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => goToArea(idx)}
                        className={`group inline-flex min-w-[150px] items-center gap-2 rounded-2xl border px-3 py-2 text-left transition ${
                          active ? areaPillActive : areaPillInactive
                        }`}
                      >
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border ${
                            dark
                              ? "border-slate-800/80 bg-slate-950/70"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <span className="text-sm leading-none">{area.icon}</span>
                        </span>
                        <span className="flex flex-col">
                          <span className="text-[0.75rem] font-semibold">
                            {area.label}
                          </span>
                          <span className={`text-[0.65rem] ${microText}`}>
                            {area.chip}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToArea((activeIndex + 1) % areas.length)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-95 ${
                  dark
                    ? "border-slate-800/80 bg-slate-950/70 text-slate-100 hover:bg-slate-950/90"
                    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                }`}
                aria-label="Next area"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Coach Read hero */}
          <section className="mb-6">
            <div className={`relative overflow-hidden rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}>
              {/* subtle area glow */}
              <div className="pointer-events-none absolute inset-0">
                <div
                  className={`absolute -top-10 -left-10 h-56 w-56 rounded-full blur-3xl opacity-25 ${accentGlow}`}
                />
                <div
                  className={`absolute -bottom-16 -right-10 h-64 w-64 rounded-full blur-3xl opacity-20 ${accentGlow}`}
                />
              </div>

              <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-xl">
                  <h2 className="mb-1 text-xl font-semibold sm:text-2xl">
                    {activeArea.summary}
                  </h2>

                  <p className={`mt-2 text-sm ${pageTextMutedClass}`}>
                    {activeArea.hint}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {topSignals.map((sig) => (
                      <span key={sig} className={chipClasses}>
                        <Star className="h-3 w-3" />
                        <span>{sig}</span>
                      </span>
                    ))}
                    {extraSignals > 0 && (
                      <span className={`${chipClasses} opacity-90`}>
                        +{extraSignals} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-row gap-2 md:w-56 md:flex-col md:items-end">
                  <button
                    type="button"
                    onClick={scrollToDetails}
                    className="
                      inline-flex w-full items-center justify-center gap-2 rounded-full
                      bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950
                      shadow-lg shadow-amber-300/40 transition hover:bg-amber-200
                    "
                  >
                    See details
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setWhyOpen((o) => !o)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                      dark
                        ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                    }`}
                  >
                    Why this matters
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${whyOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {whyOpen && (
                <div
                  className={`relative mt-4 rounded-2xl border px-4 py-3 text-sm ${
                    dark
                      ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90"
                      : "border-slate-200 bg-white/80 text-slate-700"
                  }`}
                >
                  {activeArea.about}
                </div>
              )}
            </div>
          </section>

          {/* Details */}
          <section ref={detailsRef} className="mb-3">
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <div className={sectionLabelClass}>Details</div>
                <div className={`mt-1 text-sm ${pageTextMutedClass}`}>
                  Tap a card if you want to go deeper.
                </div>
              </div>
              <div className={`text-[0.7rem] ${microText}`}>
                {activeArea.cards.length} cards
              </div>
            </div>

            <div className="space-y-3">
              {activeArea.cards.map((card) => {
                const expanded = expandedCardId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() =>
                      setExpandedCardId((prev) => (prev === card.id ? null : card.id))
                    }
                    className={`w-full text-left transition ${detailCardBase} ${
                      expanded ? detailCardExpanded : ""
                    }`}
                  >
                    <div className="px-4 py-4 sm:px-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {card.icon && (
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-2xl border text-lg ${
                                dark
                                  ? "border-slate-800/80 bg-slate-950/70 text-slate-50"
                                  : "border-slate-200 bg-white text-slate-900"
                              }`}
                            >
                              {card.icon}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold">{card.title}</div>
                            <div className={`mt-1 text-xs ${detailShortText}`}>
                              {card.short}
                            </div>
                          </div>
                        </div>

                        <div className={`pt-1 text-[0.7rem] ${microText}`}>
                          {expanded ? "Close" : "Open"}
                        </div>
                      </div>

                      {expanded && card.long && (
                        <div className={`mt-3 text-[0.8rem] ${detailLongText}`}>
                          {card.long}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
