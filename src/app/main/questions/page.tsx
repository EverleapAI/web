// src/app/main/questions/page.tsx
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Sparkles, Mic, ArrowUpRight } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { CoachIntroModal } from "@/components/main/CoachIntroModal";

/* ========= Story / badge logic ========= */

const TOTAL_QUESTIONS = 30;

type Badge = {
  threshold: number;
  title: string;
  message: string;
};

const BADGES: Badge[] = [
  {
    threshold: 5,
    title: "Curious Starter",
    message:
      "Nice — a few answers already give Everleap something real to work with.",
  },
  {
    threshold: 10,
    title: "Momentum Builder",
    message: "You’re on a roll. This is starting to look like a real map.",
  },
  {
    threshold: 20,
    title: "Deep Diver",
    message:
      "Most people never get this far. You’re going deeper than most people do.",
  },
  {
    threshold: 30,
    title: "Story Snapshot (For Now)",
    message: "You’ve finished this set. Everleap has a solid snapshot of you.",
  },
];

/* ========= Question & reaction content ========= */

const QUESTION_TEXTS: string[] = [
  "If you could experiment with one new direction in your life, what would you be curious to try?",
  "When do you feel most like yourself — what are you usually doing, and who (if anyone) are you with?",
  "What’s something you’re proud of that most people don’t know about?",
  "If you had a totally free afternoon with no obligations, how would you actually spend it?",
  "What’s one thing you’d like to get better at over the next year?",
];

function getQuestion(index: number): string {
  if (index < QUESTION_TEXTS.length) return QUESTION_TEXTS[index];
  // Fallback: reuse last one for now
  return QUESTION_TEXTS[QUESTION_TEXTS.length - 1];
}

function getReaction(answerNumber: number): string {
  if (answerNumber <= 1) {
    return "Nice start — even one honest answer gives me something real to work with. 😊";
  }
  if (answerNumber === 2) {
    return "Cool, I’m starting to see what feels like ‘you’ instead of just a profile.";
  }
  if (answerNumber === 3) {
    return "That kind of detail is gold. It helps me spot patterns you might miss.";
  }
  if (answerNumber === 4) {
    return "You’re doing this exactly right — no rush, just real answers.";
  }
  if (answerNumber === 5) {
    return "That’s enough for a strong first snapshot. Anything more from here is bonus signal.";
  }
  if (answerNumber < 10) {
    return "You’re giving me a really clear picture now. This will make your suggestions feel way more personal.";
  }
  if (answerNumber < 20) {
    return "Most people never share this much. You’re going deep in a really useful way.";
  }
  return "At this point I know a lot more about you than most apps ever do — we can get pretty smart with this. 🚀";
}

/* ========= Theme & gradient types ========= */

type SpotlightThemeId =
  | "nightDusk"
  | "berrySoft"
  | "forestSoft"
  | "warmSand"
  | "coolNotebook"
  | "cleanPaper";

type GradientLevel = 0 | 1 | 2 | 3 | 4 | 5;

type QuestionsTheme = {
  id: SpotlightThemeId;
  label: string;
  pageBgBaseClass: string;
  pageTextMutedClass: string;
  sectionLabelClass: string;
  ambientTopLeftClass: string;
  ambientRightClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  textAreaShellBorderClass: string;
  textAreaShellBgClass: string;
  textAreaInnerBgClass: string;
  skipButtonClass: string;
};

type GradientConfig = {
  level: GradientLevel;
  ambientOpacity: number;
};

/* ========= Shared theme set (aligned with Spotlight) ========= */

const QUESTIONS_THEMES: QuestionsTheme[] = [
  // 1. Dark navy
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
    cardBorderClass: "border-slate-700/70",
    textAreaShellBorderClass: "border-sky-400/50",
    textAreaShellBgClass: "bg-slate-950/90",
    textAreaInnerBgClass:
      "bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/90",
    skipButtonClass:
      "px-4 py-2 rounded-full border border-slate-700 bg-slate-900/70 text-sm text-slate-200 hover:bg-slate-800/80 transition-colors",
  },

  // 2. Light berry / lavender
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
    textAreaShellBorderClass: "border-fuchsia-300/70",
    textAreaShellBgClass: "bg-white",
    textAreaInnerBgClass:
      "bg-gradient-to-br from-fuchsia-50 via-white to-violet-50",
    skipButtonClass:
      "px-4 py-2 rounded-full border border-fuchsia-100 bg-fuchsia-50 text-sm text-slate-800 hover:bg-fuchsia-100 transition-colors",
  },

  // 3. Light mint / sage
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
    textAreaShellBorderClass: "border-emerald-300/70",
    textAreaShellBgClass: "bg-white",
    textAreaInnerBgClass:
      "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    skipButtonClass:
      "px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50 text-sm text-slate-800 hover:bg-emerald-100 transition-colors",
  },

  // 4. Warm sand
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
    textAreaShellBorderClass: "border-amber-300/70",
    textAreaShellBgClass: "bg-[#fffaf3]",
    textAreaInnerBgClass:
      "bg-gradient-to-br from-amber-50 via-[#fffaf3] to-orange-50",
    skipButtonClass:
      "px-4 py-2 rounded-full border border-amber-100 bg-amber-50 text-sm text-stone-800 hover:bg-amber-100 transition-colors",
  },

  // 5. Cool notebook
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
    textAreaShellBorderClass: "border-sky-300/70",
    textAreaShellBgClass: "bg-white",
    textAreaInnerBgClass:
      "bg-gradient-to-br from-sky-50 via-white to-slate-50",
    skipButtonClass:
      "px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-800 hover:bg-slate-100 transition-colors",
  },

  // 6. Clean paper
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
    textAreaShellBorderClass: "border-amber-300/70",
    textAreaShellBgClass: "bg-white",
    textAreaInnerBgClass:
      "bg-gradient-to-br from-amber-50 via-white to-slate-50",
    skipButtonClass:
      "px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-800 hover:bg-slate-100 transition-colors",
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

/* ========= Background image helper ========= */

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

/* ========= Small toggle controls ========= */

type ThemeToggleProps = {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
};

function ThemeToggle({ activeId, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm md:bg-slate-900/70">
      {QUESTIONS_THEMES.map((theme) => {
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

/* ========= Helper ========= */

function openGuide() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "your_story_questions_orb" },
    })
  );
}

/* ========= Main page ========= */

export default function YourStoryQuestionsPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const [answer, setAnswer] = useState("");
  const [highestBadgeThreshold, setHighestBadgeThreshold] =
    useState(0);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  const [showIntro, setShowIntro] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const [themeId, setThemeId] =
    useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    useState<GradientLevel>(3);

  const [isThinking, setIsThinking] = useState(false);
  const [aiReaction, setAiReaction] = useState<string | null>(null);

  // Question typing animation
  const [displayedQuestion, setDisplayedQuestion] = useState(
    getQuestion(0)
  );
  const [isTypingQuestion, setIsTypingQuestion] = useState(false);

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const theme =
    QUESTIONS_THEMES.find((t) => t.id === themeId) ??
    QUESTIONS_THEMES[0];

  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const pageBgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(theme.id);

  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  const isDarkTheme = theme.id === "nightDusk";

  const textAreaTextClass = isDarkTheme
    ? "text-slate-50/95 placeholder:text-slate-400"
    : "text-slate-900 placeholder:text-slate-500";

  const progressPercent = useMemo(
    () => Math.min(100, (answeredCount / TOTAL_QUESTIONS) * 100),
    [answeredCount]
  );

  const questionText = getQuestion(currentQuestionIndex);

  // Animate question text typing whenever the question changes
  useEffect(() => {
    setIsTypingQuestion(true);
    setDisplayedQuestion("");

    const text = questionText;
    let index = 0;

    const intervalId = window.setInterval(() => {
      index += 1;
      setDisplayedQuestion(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
        setIsTypingQuestion(false);
      }
    }, 18);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [questionText]);

  // Badge logic: keep highest badge visible and fire modal at first 5
  useEffect(() => {
    if (answeredCount === 0) return;

    const badge = BADGES.slice()
      .reverse()
      .find((b) => answeredCount >= b.threshold);

    if (!badge) return;

    if (badge.threshold > highestBadgeThreshold) {
      setHighestBadgeThreshold(badge.threshold);
      setActiveBadge(badge);

      if (badge.threshold === 5) {
        setShowBadgeModal(true);
      }
    }
  }, [answeredCount, highestBadgeThreshold]);

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;

    const nextAnswered = answeredCount + 1;
    setAnswer("");
    setAnsweredCount(nextAnswered);

    // Simulate Everleap "thinking" before next question / reaction
    setIsThinking(true);
    setAiReaction(null);

    const nextIndex = Math.min(
      QUESTION_TEXTS.length - 1,
      currentQuestionIndex + 1
    );

    window.setTimeout(() => {
      setCurrentQuestionIndex(nextIndex);
      setIsThinking(false);
      setAiReaction(getReaction(nextAnswered));
    }, 650);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleIntroClose = () => setShowIntro(false);

  // Shared chip styles based on theme
  const thinkingChipClass = isDarkTheme
    ? "inline-flex items-center gap-2 rounded-full bg-slate-900/40 px-3 py-1 text-[0.75rem] text-slate-200"
    : "inline-flex items-center gap-2 rounded-full bg-white/85 border border-slate-200 px-3 py-1 text-[0.75rem] text-slate-700";

  const reactionChipClass = isDarkTheme
    ? "inline-flex rounded-full bg-slate-900/40 px-3 py-1 text-[0.75rem] text-slate-200"
    : "inline-flex rounded-full bg-white/90 border border-slate-200 px-3 py-1 text-[0.75rem] text-slate-700";

  const badgeStripClass = isDarkTheme
    ? "inline-flex items-start gap-2 rounded-2xl border border-amber-300/60 bg-slate-950/90 px-4 py-3 text-xs text-slate-50 shadow-lg shadow-amber-300/30"
    : "inline-flex items-start gap-2 rounded-2xl border border-amber-300/70 bg-white px-4 py-3 text-xs text-slate-900 shadow-md shadow-amber-200/40";

  const badgeTitleClass = isDarkTheme
    ? "text-[0.8rem] font-semibold text-amber-200"
    : "text-[0.8rem] font-semibold text-amber-600";

  const badgeBodyClass = isDarkTheme
    ? "mt-0.5 text-[0.72rem] text-slate-100"
    : "mt-0.5 text-[0.72rem] text-slate-700";

  return (
    <>
      {/* Intro coach modal */}
      <CoachIntroModal
        open={showIntro}
        onClose={handleIntroClose}
        subtitle="Now we’ll start getting to know what makes you, you. These questions are based on real psychology and career science, but they’re meant to feel like a conversation. Take your time, answer honestly, and skip anything that doesn’t feel right."
        enableTyping
      />

      {/* Badge congrats modal at 5 answers */}
      <CoachIntroModal
        open={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        subtitle="Nice work — you’ve unlocked your first badge. Even a handful of honest answers gives Everleap enough to start shaping real suggestions for you."
        enableTyping
      />

      <div
        className={`min-h-screen flex flex-col ${theme.pageBgBaseClass}`}
        style={pageBgStyle}
      >
        <div className="relative flex min-h-screen flex-col">
          {/* Ambient blobs */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: gradient.ambientOpacity }}
          >
            <div
              className={`absolute -top-28 -left-20 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>

          {/* Content */}
          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-8">
            {/* Header row */}
            <header className="mb-4 flex items-start justify-between gap-4 md:mb-5">
              <div>
                <div className={theme.sectionLabelClass}>
                  Your story
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                  Let&apos;s sketch out who you are (for now).
                </h1>
                <p
                  className={`mt-2 max-w-xl text-sm ${theme.pageTextMutedClass}`}
                >
                  Answer a few questions so Everleap can start mapping
                  what matters to you and where you might go next.
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

                {/* Guide orb – same placement as Spotlight */}
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

            {/* Progress bar – minimal, no Q x of y text */}
            <div className="mb-6 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[0.7rem] text-slate-400">
                <span>Start</span>
                <span>Finish</span>
              </div>
              <div className="relative flex items-center gap-3">
                <div className="h-3 w-3 rounded-full border border-slate-500 bg-transparent" />
                <div className="flex-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="h-3 w-3 rounded-full border border-sky-400 bg-slate-900 shadow-[0_0_10px_rgba(56,189,248,0.7)]" />
              </div>
            </div>

            {/* Persistent badge strip if any unlocked */}
            {activeBadge && (
              <div className="mb-4">
                <div className={badgeStripClass}>
                  <div className="mt-[2px] h-6 w-6 rounded-full bg-amber-300 text-center text-[0.75rem] font-bold text-slate-900">
                    ★
                  </div>
                  <div>
                    <div className={badgeTitleClass}>
                      {activeBadge.title}
                    </div>
                    <p className={badgeBodyClass}>
                      {activeBadge.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Question card */}
            <section className="flex-1">
              <div
                className={`rounded-[32px] border px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.85)] md:px-8 ${theme.cardBgClass} ${theme.cardBorderClass}`}
              >
                {/* Question text with typing effect */}
                <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
                  {displayedQuestion || questionText}
                  {isTypingQuestion && (
                    <span className="inline-block w-3 animate-pulse">
                      |
                    </span>
                  )}
                </h2>

                {/* AI thinking / reaction strip */}
                <div className="mt-2 min-h-[1.25rem] text-[0.8rem]">
                  {isThinking ? (
                    <div className={thinkingChipClass}>
                      <span>Everleap is choosing your next question</span>
                      <span className="flex gap-[2px]">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.05s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                      </span>
                    </div>
                  ) : aiReaction ? (
                    <div className={reactionChipClass}>
                      <span className="font-medium mr-1">Your guide:</span>
                      <span>{aiReaction}</span>
                    </div>
                  ) : null}
                </div>

                {/* Answer area – text block only */}
                <div
                  className={`mt-5 rounded-[28px] border p-[3px] ${theme.textAreaShellBorderClass} ${theme.textAreaShellBgClass}`}
                >
                  <div
                    className={`rounded-[24px] px-5 py-4 ${theme.textAreaInnerBgClass}`}
                  >
                    <textarea
                      className={`flex-1 w-full bg-transparent outline-none resize-none text-sm md:text-base min-h-[120px] ${textAreaTextClass}`}
                      placeholder=""
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>

                {/* Controls row: mic is primary, outside the text block */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {/* Mic: big, prominent */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-medium transition ${
                        isDarkTheme
                          ? "border-sky-400/80 bg-slate-950 text-sky-100 shadow-lg shadow-sky-500/40 hover:bg-slate-900"
                          : "border-sky-300 bg-sky-50 text-sky-800 shadow-md shadow-sky-200/80 hover:bg-sky-100"
                      }`}
                      aria-label="Answer with your voice"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                    <span className="text-[0.75rem] text-slate-400">
                      Talk instead of typing
                    </span>
                  </div>

                  {/* Send arrow – secondary but still visible */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-slate-950 text-lg font-semibold shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
                    aria-label="Send answer"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Skip */}
                <div className="mt-4 flex">
                  <button type="button" className={theme.skipButtonClass}>
                    I&apos;m not sure · Skip
                  </button>
                </div>
              </div>
            </section>
          </main>

          {/* Bottom navigation */}
          <BottomNav />
        </div>
      </div>
    </>
  );
}
