// src/app/main/carousel/page.tsx
"use client";

import {
  useState,
  useEffect,
  type CSSProperties,
} from "react";
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

import { BottomNav } from "@/components/navigation/BottomNav";
import { CoachIntroModal } from "@/components/main/CoachIntroModal";

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
  icon: React.ReactNode;
  glowClass: string;
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

/* ========= Theme / gradient types ========= */

type SpotlightThemeId =
  | "nightDusk"
  | "berrySoft"
  | "forestSoft"
  | "warmSand"
  | "coolNotebook"
  | "cleanPaper";

type GradientLevel = 0 | 1 | 2 | 3 | 4 | 5;

type InsightsTheme = {
  id: SpotlightThemeId;
  label: string;
  pageBgBaseClass: string;
  pageTextMutedClass: string;
  sectionLabelClass: string;
  ambientTopLeftClass: string;
  ambientRightClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  chipBgClass: string;
  chipBorderClass: string;
};

type GradientConfig = {
  level: GradientLevel;
  ambientOpacity: number;
};

/* ========= Themes (aligned with Spotlight / Questions) ========= */

const INSIGHTS_THEMES: InsightsTheme[] = [
  {
    id: "nightDusk",
    label: "Night",
    pageBgBaseClass: "bg-[#020617] text-slate-50",
    pageTextMutedClass: "text-slate-300/90",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400",
    ambientTopLeftClass: "bg-indigo-400",
    ambientRightClass: "bg-sky-400",
    cardBgClass: "bg-slate-950/85",
    cardBorderClass: "border-slate-800/80",
    chipBgClass: "bg-slate-900/80",
    chipBorderClass: "border-slate-700/80",
  },
  {
    id: "berrySoft",
    label: "Berry",
    pageBgBaseClass: "bg-[#f7ecff] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-violet-500",
    ambientTopLeftClass: "bg-fuchsia-200",
    ambientRightClass: "bg-violet-200",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-fuchsia-100",
    chipBgClass: "bg-fuchsia-50",
    chipBorderClass: "border-fuchsia-100",
  },
  {
    id: "forestSoft",
    label: "Teal",
    pageBgBaseClass: "bg-[#e7f5f1] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald-500",
    ambientTopLeftClass: "bg-emerald-200",
    ambientRightClass: "bg-teal-200",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-emerald-100",
    chipBgClass: "bg-emerald-50",
    chipBorderClass: "border-emerald-100",
  },
  {
    id: "warmSand",
    label: "Sand",
    pageBgBaseClass: "bg-[#f5ebe0] text-stone-900",
    pageTextMutedClass: "text-stone-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-stone-500",
    ambientTopLeftClass: "bg-amber-200",
    ambientRightClass: "bg-orange-200",
    cardBgClass: "bg-[#fdf7ef]/95",
    cardBorderClass: "border-amber-200",
    chipBgClass: "bg-amber-50",
    chipBorderClass: "border-amber-100",
  },
  {
    id: "coolNotebook",
    label: "Cool",
    pageBgBaseClass: "bg-[#e5f0ff] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500",
    ambientTopLeftClass: "bg-sky-200",
    ambientRightClass: "bg-indigo-200",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-slate-200",
    chipBgClass: "bg-slate-50",
    chipBorderClass: "border-slate-200",
  },
  {
    id: "cleanPaper",
    label: "Paper",
    pageBgBaseClass: "bg-[#f9fafb] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500",
    ambientTopLeftClass: "bg-slate-200",
    ambientRightClass: "bg-amber-100",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-slate-200",
    chipBgClass: "bg-slate-50",
    chipBorderClass: "border-slate-200",
  },
];

const GRADIENT_CONFIGS: GradientConfig[] = [
  { level: 0, ambientOpacity: 0 },
  { level: 1, ambientOpacity: 0.1 },
  { level: 2, ambientOpacity: 0.18 },
  { level: 3, ambientOpacity: 0.3 },
  { level: 4, ambientOpacity: 0.45 },
  { level: 5, ambientOpacity: 0.6 },
];

/* ========= Bg helper ========= */

function getPageBackgroundImage(themeId: SpotlightThemeId): string {
  switch (themeId) {
    case "nightDusk":
      return [
        "radial-gradient(circle at top left, rgba(129,140,248,0.22), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(56,189,248,0.18), transparent 55%)",
      ].join(", ");
    case "berrySoft":
      return [
        "radial-gradient(circle at top left, rgba(244,219,255,0.9), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(234,222,255,0.8), transparent 55%)",
      ].join(", ");
    case "forestSoft":
      return [
        "radial-gradient(circle at top left, rgba(209,250,229,0.9), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(204,251,241,0.85), transparent 55%)",
      ].join(", ");
    case "warmSand":
      return [
        "radial-gradient(circle at top left, rgba(253,230,200,0.9), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(254,249,195,0.9), transparent 55%)",
      ].join(", ");
    case "coolNotebook":
      return [
        "radial-gradient(circle at top left, rgba(191,219,254,0.85), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(226,232,240,0.9), transparent 55%)",
      ].join(", ");
    case "cleanPaper":
    default:
      return [
        "radial-gradient(circle at top left, rgba(248,250,252,1), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(241,245,249,1), transparent 55%)",
      ].join(", ");
  }
}

/* ========= Toggles ========= */

type ThemeToggleProps = {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
};

function ThemeToggle({ activeId, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm md:bg-slate-900/70">
      {INSIGHTS_THEMES.map((theme) => {
        const isActive = theme.id === activeId;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`h-5 w-5 rounded-full transition ${
              isActive
                ? "bg-sky-300 shadow-sm shadow-sky-300/60"
                : "bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            aria-label={theme.label}
          />
        );
      })}
    </div>
  );
}

type GradientToggleProps = {
  activeLevel: GradientLevel;
  onChange: (level: GradientLevel) => void;
};

function GradientToggle({ activeLevel, onChange }: GradientToggleProps) {
  const levels: GradientLevel[] = [0, 1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm md:bg-slate-900/70">
      {levels.map((level) => {
        const isActive = level === activeLevel;
        const isZero = level === 0;

        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex items-center justify-center rounded-full transition ${
              isZero
                ? isActive
                  ? "h-4 w-4 border border-amber-300 bg-transparent"
                  : "h-4 w-4 border border-slate-600/80 bg-transparent hover:border-slate-400"
                : isActive
                ? "h-4 w-4 bg-amber-300 shadow-sm shadow-amber-300/60"
                : "h-4 w-4 bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            aria-label={
              isZero ? "No gradient" : `Gradient level ${level}`
            }
          />
        );
      })}
    </div>
  );
}

/* ========= Guide opener ========= */

function openGuide() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "insights_header_orb" },
    })
  );
}

/* ========= Main page ========= */

export default function YouMapPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(
    null
  );
  const [whyOpen, setWhyOpen] = useState(false);

  const [themeId, setThemeId] =
    useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    useState<GradientLevel>(3);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const activeArea = areas[activeIndex];

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ??
    INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const pageBgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(theme.id);

  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  const isDarkTheme = theme.id === "nightDusk";

  const hintClasses = isDarkTheme
    ? "rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-rose-500/20 px-4 py-2 text-xs text-amber-50 shadow-[0_12px_30px_rgba(0,0,0,0.8)]"
    : "rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-2 text-xs text-amber-900 shadow-sm";

  const signalChipClasses = isDarkTheme
    ? "flex flex-shrink-0 items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-slate-100"
    : "flex flex-shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-800";

  const insightCardBase = isDarkTheme
    ? "rounded-3xl border shadow-[0_18px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl"
    : "rounded-3xl border shadow-sm bg-white";

  const insightCardDefaultBorder = isDarkTheme
    ? "border-slate-700/80 bg-slate-950/70 hover:border-sky-400/50"
    : "border-slate-200 bg-white hover:border-sky-300";

  const insightCardExpandedBorder = isDarkTheme
    ? "border-sky-400/70 bg-slate-950/80"
    : "border-sky-300 bg-sky-50";

  const whyHeaderClasses = isDarkTheme
    ? "flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 hover:bg-slate-900/80"
    : "flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 hover:bg-slate-50";

  const whyBodyClasses = isDarkTheme
    ? "mt-2 rounded-2xl border border-slate-800/80 bg-slate-950/85 px-4 py-3 text-sm text-slate-200/90"
    : "mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700";

  const areaChipLabelClasses = isDarkTheme
    ? "text-[0.65rem] text-slate-300/80"
    : "text-[0.65rem] text-slate-600";

  const areaCardInactiveBg = `${theme.cardBgClass} ${theme.cardBorderClass} opacity-80 hover:opacity-100`;
  const areaCardActiveBg = isDarkTheme
    ? `${theme.cardBgClass} border-sky-400/70 shadow-lg shadow-slate-950/80`
    : `${theme.cardBgClass} border-sky-300 shadow-md shadow-sky-100`;

  // much softer carousel shadow
const carouselShadowClasses = isDarkTheme
  ? "shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
  : "shadow-[0_14px_36px_rgba(15,23,42,0.18)]";

  return (
    <>
      {/* Intro modal explaining Insights */}
      <CoachIntroModal
        open={showIntro}
        onClose={() => setShowIntro(false)}
        subtitle="This is your Insights space. As you answer questions and try tiny actions, Everleap turns your patterns into simple signals and recommendations. The more you interact, the sharper these insights get."
        enableTyping
      />

      <div
        className={`min-h-screen ${theme.pageBgBaseClass}`}
        style={pageBgStyle}
      >
        <main className="relative flex min-h-screen flex-col">
          {/* Ambient blobs */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: gradient.ambientOpacity }}
          >
            <div
              className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-8">
            {/* Header */}
            <header className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className={theme.sectionLabelClass}>About you</div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                  Let&apos;s focus on {activeArea.label}
                </h1>
                <p
                  className={`mt-2 max-w-xl text-sm ${theme.pageTextMutedClass}`}
                >
                  Swipe to see how Everleap is reading your patterns—this
                  is just a starting point.
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
                <ThemeToggle
                  activeId={themeId}
                  onChange={setThemeId}
                />
                <GradientToggle
                  activeLevel={gradientLevel}
                  onChange={setGradientLevel}
                />

                {/* Simple Guide orb */}
                <button
                  type="button"
                  onClick={openGuide}
                  className="group relative mt-2 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-fuchsia-400 to-amber-300 shadow-lg shadow-sky-400/40 transition-transform duration-200 hover:scale-110 md:mt-0"
                  aria-label="Open Everleap Guide"
                >
                  <span className="absolute inset-0 rounded-full bg-sky-400/30 blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-slate-50">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </header>

            {/* Area carousel */}
            <section className="mb-5">
              <div
                className={`relative overflow-hidden rounded-[32px] px-4 py-4 sm:px-6 sm:py-5 ${theme.cardBgClass} ${theme.cardBorderClass} ${carouselShadowClasses}`}
              >
                {/* inner glow, clamped + softened */}
                <div
                  className={`pointer-events-none absolute inset-3 rounded-[28px] bg-gradient-to-br ${activeArea.glowClass} opacity-20 blur-xl`}
                />

                <div className="relative flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedCardId(null);
                      setWhyOpen(false);
                      setActiveIndex((i) =>
                        i === 0 ? areas.length - 1 : i - 1
                      );
                    }}
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
                                ? areaCardActiveBg
                                : areaCardInactiveBg
                            }`}
                          >
                            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/70 text-slate-50">
                              {area.icon}
                            </div>
                            <div className="text-[0.7rem] font-semibold">
                              {area.label}
                            </div>
                            <div className={areaChipLabelClasses}>
                              {area.chip}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setExpandedCardId(null);
                      setWhyOpen(false);
                      setActiveIndex((i) => (i + 1) % areas.length);
                    }}
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
              <div className={hintClasses}>
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
                    <div key={sig} className={signalChipClasses}>
                      <Star className="h-3 w-3 text-amber-300" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Insight cards – vertical list, no inner scrollbar */}
            <section className="mb-3">
              <div className="space-y-3">
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
                      className={`flex w-full flex-col px-4 py-4 text-left transition ${insightCardBase} ${
                        expanded
                          ? insightCardExpandedBorder
                          : insightCardDefaultBorder
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {card.icon && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-slate-900/80 text-lg text-slate-50">
                            {card.icon}
                          </div>
                        )}
                        <div className="text-sm font-semibold">
                          {card.title}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200/90 dark:text-slate-200/90">
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
            </section>

            {/* Why this matters drawer */}
            <section className="mt-1">
              <button
                type="button"
                onClick={() => setWhyOpen((o) => !o)}
                className={whyHeaderClasses}
              >
                <span>Why this area matters</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    whyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {whyOpen && (
                <div className={whyBodyClasses}>{activeArea.about}</div>
              )}
            </section>
          </div>
        </main>

        <BottomNav />
      </div>
    </>
  );
}
