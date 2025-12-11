// src/app/main/carousel/page.tsx
"use client";

import { useState } from "react";
import {
  Sparkles,
  Zap,
  Flame,
  Users2,
  HeartHandshake,
  Briefcase,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { BottomNav } from "@/components/navigation/BottomNav";

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
  icon: React.ReactNode;
  glowClass: string;
  hint: string;
  signals: string[];
  about: string;
  cards: TraitCard[];
};

const areas: YouMapArea[] = [
  {
    id: "motivations",
    label: "Motivations",
    chip: "What drives you",
    icon: <Flame className="h-5 w-5" />,
    glowClass: "from-amber-400 via-orange-500 to-rose-500",
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
        short:
          "Endless busywork and unclear expectations drain your energy fast.",
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

  // Placeholder areas – you can fill these out later with real content.
  {
    id: "strengths",
    label: "Strengths",
    chip: "How you naturally show up",
    icon: <Sparkles className="h-5 w-5" />,
    glowClass: "from-violet-500 via-fuchsia-500 to-sky-400",
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
    icon: <Zap className="h-5 w-5" />,
    glowClass: "from-cyan-400 via-sky-500 to-indigo-500",
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
    icon: <Users2 className="h-5 w-5" />,
    glowClass: "from-emerald-400 via-teal-400 to-sky-400",
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
    icon: <HeartHandshake className="h-5 w-5" />,
    glowClass: "from-rose-400 via-amber-400 to-fuchsia-500",
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
    icon: <Briefcase className="h-5 w-5" />,
    glowClass: "from-sky-400 via-indigo-500 to-slate-400",
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);

  const activeArea = areas[activeIndex];

  const handlePrev = () => {
    setExpandedCardId(null);
    setWhyOpen(false);
    setActiveIndex((i) => (i === 0 ? areas.length - 1 : i - 1));
  };

  const handleNext = () => {
    setExpandedCardId(null);
    setWhyOpen(false);
    setActiveIndex((i) => (i + 1) % areas.length);
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.16), transparent 55%)",
      }}
    >
      <main className="relative flex min-h-screen flex-col">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-fuchsia-500 blur-3xl" />
          <div className="absolute top-40 right-[-32px] h-72 w-72 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-8">
          {/* Header */}
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                About you
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Let&apos;s focus on {activeArea.label}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300/90">
                Swipe through the areas to see how Everleap is starting to read
                your patterns. You don&apos;t have to agree with everything—this
                is a starting point.
              </p>
            </div>

            <AiGuideOrb
              subline={`How Everleap sees your ${activeArea.label.toLowerCase()}.`}
              source={`youmap_${activeArea.id}_orb`}
            />
          </header>

          {/* Carousel */}
          <section className="mb-5">
            <div className="relative rounded-[32px] bg-slate-950/80 border border-slate-800/90 px-4 py-4 sm:px-6 sm:py-5 shadow-[0_26px_80px_rgba(0,0,0,0.95)]">
              {/* Glow behind */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br ${activeArea.glowClass} opacity-40 blur-3xl`}
              />

              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-100 hover:bg-slate-800/90 active:scale-95 transition"
                  aria-label="Previous area"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex items-center gap-3">
                    {areas.map((area, idx) => {
                      const active = idx === activeIndex;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => {
                            setExpandedCardId(null);
                            setWhyOpen(false);
                            setActiveIndex(idx);
                          }}
                          className={`flex min-w-[120px] flex-col items-center justify-center rounded-2xl px-3 py-3 transition ${
                            active
                              ? "bg-slate-950/80 border border-white/20 shadow-lg shadow-slate-950/80"
                              : "bg-slate-900/60 border border-slate-700/70 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80 text-slate-50">
                            {area.icon}
                          </div>
                          <div className="text-[0.7rem] font-semibold text-slate-50">
                            {area.label}
                          </div>
                          <div className="mt-0.5 text-[0.65rem] text-slate-300/80">
                            {area.chip}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-100 hover:bg-slate-800/90 active:scale-95 transition"
                  aria-label="Next area"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Hint bar */}
          <section className="mb-3">
            <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-rose-500/20 px-4 py-2 text-xs text-amber-50 shadow-[0_12px_30px_rgba(0,0,0,0.8)]">
              <div className="flex items-start gap-2">
                <div className="mt-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/80 text-[0.55rem] text-slate-950">
                  !
                </div>
                <p>{activeArea.hint}</p>
              </div>
            </div>
          </section>

          {/* Signals row */}
          <section className="mb-4">
            <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Signals I&apos;m seeing
            </div>
            <div className="-mx-4 pl-4">
              <div className="flex gap-2 overflow-x-auto pb-1 pr-6 text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {activeArea.signals.map((sig) => (
                  <div
                    key={sig}
                    className="flex flex-shrink-0 items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-slate-100"
                  >
                    <Star className="h-3 w-3 text-amber-300" />
                    <span>{sig}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Swipeable insight cards */}
          <section className="mb-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                In this area
              </div>
              {activeArea.cards.length > 1 && (
                <div className="text-[0.7rem] text-slate-400">
                  Swipe to see more cards
                </div>
              )}
            </div>

            <div className="-mx-4 pl-4">
              <div className="flex gap-3 overflow-x-auto pb-2 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {activeArea.cards.map((card) => {
                  const expanded = expandedCardId === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() =>
                        setExpandedCardId((prev) =>
                          prev === card.id ? null : card.id
                        )
                      }
                      className={`flex h-full w-64 flex-shrink-0 flex-col rounded-3xl border px-4 py-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl transition ${
                        expanded
                          ? "border-sky-400/70 bg-slate-950/80"
                          : "border-slate-700/80 bg-slate-950/70 hover:border-sky-400/50"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {card.icon && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-slate-900/80 text-lg">
                            {card.icon}
                          </div>
                        )}
                        <div className="text-sm font-semibold text-slate-50">
                          {card.title}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200/90">
                        {card.short}
                      </p>
                      {expanded && card.long && (
                        <p className="mt-2 text-[0.7rem] text-slate-300/90">
                          {card.long}
                        </p>
                      )}
                      <div className="mt-3 text-[0.65rem] text-slate-400">
                        {expanded ? "Tap to collapse" : "Tap to see more"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Why this matters drawer */}
          <section className="mt-1">
            <button
              type="button"
              onClick={() => setWhyOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 hover:bg-slate-900/80"
            >
              <span>Why this area matters</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  whyOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {whyOpen && (
              <div className="mt-2 rounded-2xl border border-slate-800/80 bg-slate-950/85 px-4 py-3 text-sm text-slate-200/90">
                {activeArea.about}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Bottom nav – same pattern as Spotlight */}
      <BottomNav />
    </div>
  );
}
