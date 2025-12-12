// src/app/main/actions/page.tsx
"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  Sparkles,
  Flame,
  Repeat,
  Clock3,
  HeartHandshake,
  Moon,
  Zap,
  ArrowRight,
} from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { CoachIntroModal } from "@/components/main/CoachIntroModal";

/* ========= Types ========= */

type SpotlightThemeId =
  | "nightDusk"
  | "berrySoft"
  | "forestSoft"
  | "warmSand"
  | "coolNotebook"
  | "cleanPaper";

type GradientLevel = 0 | 1 | 2 | 3 | 4 | 5;

type ActionsTheme = {
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

type ActionCard = {
  id: string;
  kindChip: string;
  title: string;
  description: string;
  frequencyLabel: string;
  moodTag?: string;
};

/* ========= Sample data ========= */

const weeklyActions: ActionCard[] = [
  {
    id: "weekly-check-in",
    kindChip: "WEEKLY",
    title: "Weekly check-in",
    description:
      "Take 5 minutes to reflect on what worked, what didn’t, and one small thing to try next.",
    frequencyLabel: "Once a week",
    moodTag: "Reflect",
  },
  {
    id: "tiny-experiment",
    kindChip: "TINY EXPERIMENT",
    title: "One tiny experiment",
    description:
      "Pick a small change in how you study, work, or rest. Run it for a few days and notice what shifts.",
    frequencyLabel: "3–5 days",
    moodTag: "Experiment",
  },
  {
    id: "support-cue",
    kindChip: "SUPPORT CUE",
    title: "Reach-out reminder",
    description:
      "Add one reminder to text or talk to someone who supports you—even just a quick check-in.",
    frequencyLabel: "Once a week",
    moodTag: "Connection",
  },
];

const resetIdeas: ActionCard[] = [
  {
    id: "screen-curfew",
    kindChip: "RESET & RECHARGE",
    title: "Screen curfew",
    description:
      "Pick two nights this week to put your phone away 30 minutes before sleep and see how it feels.",
    frequencyLabel: "2 nights this week",
    moodTag: "Sleep",
  },
  {
    id: "micro-reset",
    kindChip: "MICRO RESET",
    title: "2-minute reset",
    description:
      "When you feel fried, step away for just 2 minutes—water, stretch, look away from screens.",
    frequencyLabel: "Anytime you feel overloaded",
    moodTag: "Energy",
  },
  {
    id: "move-break",
    kindChip: "MOVE BREAK",
    title: "Movement cue",
    description:
      "Tie a 3–5 minute walk or stretch to something you already do, like finishing a class or snack.",
    frequencyLabel: "A few times a week",
    moodTag: "Body",
  },
];

/* ========= Themes (aligned with other pages) ========= */

const ACTIONS_THEMES: ActionsTheme[] = [
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
      {ACTIONS_THEMES.map((theme) => {
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

/* ========= Guide openers ========= */

function openGuide() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "actions_header_orb" },
    })
  );
}

function openTinyHabitGuide() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: {
        source: "actions_hero_tiny_habit",
        prompt:
          "Suggest one tiny habit or action I could try this week that fits my energy and goals. Think simple: one weekly check-in, a short screen-curfew, or a 3-day experiment.",
      },
    })
  );
}

/* ========= Helpers ========= */

function frequencyChipClasses(isDark: boolean): string {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] border";
  return isDark
    ? base + " border-slate-600/80 bg-slate-900/80 text-slate-300/90"
    : base + " border-slate-200 bg-slate-50 text-slate-600";
}

/* ========= Main page ========= */

export default function ActionsPage() {
  const [themeId, setThemeId] =
    useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    useState<GradientLevel>(3);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const theme =
    ACTIONS_THEMES.find((t) => t.id === themeId) ??
    ACTIONS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const pageBgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(theme.id);

  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  const isDarkTheme = theme.id === "nightDusk";

  const heroShadowClasses = isDarkTheme
    ? "shadow-[0_20px_70px_rgba(0,0,0,0.65)]"
    : "shadow-[0_20px_60px_rgba(15,23,42,0.25)]";

  const cardBase = isDarkTheme
    ? "rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_14px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl"
    : "rounded-3xl border border-slate-200 bg-white shadow-sm";

  const mutedText = theme.pageTextMutedClass;

  return (
    <>
      {/* Intro modal explaining Actions */}
      <CoachIntroModal
        open={showIntro}
        onClose={() => setShowIntro(false)}
        subtitle="This is your Actions space. Everleap turns your goals into tiny, repeatable moves—like one weekly check-in or a short reset ritual—so you can keep going without burning out."
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
              className={`absolute -top-24 -left-20 h-60 w-60 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute bottom-0 right-[-40px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-8">
            {/* Header */}
            <header className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className={theme.sectionLabelClass}>
                  Actions &amp; habits
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                  Tiny moves to keep you going
                </h1>
                <p className={`mt-2 max-w-xl text-sm ${mutedText}`}>
                  This isn&apos;t a giant to-do list. It&apos;s a short
                  set of tiny habits that match your energy this week.
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

                {/* AI Guide orb */}
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

            {/* Hero: Action deck */}
            <section className="mb-6">
              <div
                className={`relative overflow-hidden rounded-[32px] px-5 py-5 sm:px-7 sm:py-6 ${theme.cardBgClass} ${theme.cardBorderClass} ${heroShadowClasses}`}
              >
                <div className="pointer-events-none absolute inset-2 rounded-[28px] bg-gradient-to-br from-sky-500/40 via-fuchsia-500/35 to-amber-300/30 opacity-40 blur-2xl" />

                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-emerald-500/15 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                      <Repeat className="h-3 w-3" />
                      <span>Action deck</span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold md:text-2xl">
                      This week’s tiny actions.
                    </h2>
                    <p className={`mt-2 text-sm ${mutedText}`}>
                      Start with one or two repeatable moves you can
                      actually do—then add more once you see what
                      works.
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch gap-2 md:w-64">
                    <button
                      type="button"
                      onClick={openTinyHabitGuide}
                      className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(56,189,248,0.65)] transition hover:bg-sky-300 hover:shadow-[0_18px_50px_rgba(56,189,248,0.8)] active:scale-95"
                    >
                      Ask for a tiny habit
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </button>
                    <p className={`text-[0.7rem] ${mutedText}`}>
                      Everleap will suggest one simple starting habit
                      based on your goals.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions from your goals */}
            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">
                    Actions from your goals
                  </div>
                  <p className={`mt-1 text-xs ${mutedText}`}>
                    These are simple, repeatable actions that connect
                    to your current goals and profile.
                  </p>
                </div>
                <div
                  className={`hidden items-center gap-1 text-[0.7rem] ${mutedText} md:flex`}
                >
                  <Flame className="h-3.5 w-3.5" />
                  <span>Built from what motivates you.</span>
                </div>
              </div>

              <div className="space-y-3">
                {weeklyActions.map((action) => (
                  <div
                    key={action.id}
                    className={`flex flex-col gap-3 px-4 py-4 ${cardBase}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-[0.65rem] font-semibold tracking-[0.16em] ${
                              isDarkTheme
                                ? "border-sky-300/70 bg-sky-500/10 text-sky-100"
                                : "border-sky-300 bg-sky-50 text-sky-700"
                            }`}
                          >
                            {action.kindChip}
                          </span>
                          {action.moodTag && (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-[0.65rem] ${
                                isDarkTheme
                                  ? "bg-slate-900/80 text-slate-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {action.moodTag}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold">
                          {action.title}
                        </h3>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          {action.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={frequencyChipClasses(isDarkTheme)}
                        >
                          <Clock3 className="h-3 w-3" />
                          <span>{action.frequencyLabel}</span>
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between text-[0.7rem] ${
                        isDarkTheme
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      <span>Tap to adjust the timing or swap it out.</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reset & recharge ideas */}
            <section className="mb-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">
                    Reset &amp; recharge ideas
                  </div>
                  <p className={`mt-1 text-xs ${mutedText}`}>
                    When things feel heavy, these moves help you reset
                    without needing a full life overhaul.
                  </p>
                </div>
                <div
                  className={`hidden items-center gap-1 text-[0.7rem] ${mutedText} md:flex`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>Good for low-energy days.</span>
                </div>
              </div>

              <div className="space-y-3">
                {resetIdeas.map((action) => (
                  <div
                    key={action.id}
                    className={`flex flex-col gap-3 px-4 py-4 ${cardBase}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-[0.65rem] font-semibold tracking-[0.16em] ${
                              isDarkTheme
                                ? "border-amber-300/70 bg-amber-500/10 text-amber-100"
                                : "border-amber-300 bg-amber-50 text-amber-800"
                            }`}
                          >
                            {action.kindChip}
                          </span>
                          {action.moodTag && (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-[0.65rem] ${
                                isDarkTheme
                                  ? "bg-slate-900/80 text-slate-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {action.moodTag}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold">
                          {action.title}
                        </h3>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          {action.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={frequencyChipClasses(isDarkTheme)}
                        >
                          <Zap className="h-3 w-3" />
                          <span>{action.frequencyLabel}</span>
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between text-[0.7rem] ${
                        isDarkTheme
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      <span>Tap one to try it for a week.</span>
                    </div>
                  </div>
                ))}
              </div>

              <p
                className={`mt-3 text-[0.7rem] flex items-center gap-1 ${mutedText}`}
              >
                <HeartHandshake className="h-3.5 w-3.5" />
                <span>
                  Over time, Everleap will keep only the actions that
                  actually help you.
                </span>
              </p>
            </section>
          </div>
        </main>

        <BottomNav />
      </div>
    </>
  );
}
