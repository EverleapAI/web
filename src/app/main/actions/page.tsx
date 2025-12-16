// src/app/main/actions/page.tsx
"use client";

import * as React from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Repeat,
  Clock3,
  Zap,
  Moon,
  Flame,
  HeartHandshake,
  MessageCircle,
  CheckCircle2,
  Waves,
  FlaskConical,
  Search,
  Hammer,
  Boxes,
  RefreshCw,
} from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

/* =========================
   Guide helper (shared event)
========================= */

function openGuide(detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "actions", ...(detail ?? {}) },
    })
  );
}

/* =========================
   Types + mock data
========================= */

type ActionStatus = "idea" | "in_progress" | "done";

type ActionRec = {
  id: string;
  title: string;
  summary: string;
  accent: "sky" | "violet" | "emerald" | "amber";
  tags: { label: string; icon: React.ReactNode }[];

  nextMove: {
    title: string;
    description: string;
    nextStep: string;
    whyChips: string[];
    todayBullets: string[];
    status: ActionStatus;
    frequencyLabel: string;
    moodTag?: string;
  };

  activities: ActivityCard[];
};

type ActivityCard = {
  id: string;
  title: string;
  description: string;
  nextStep: string;
  frequencyLabel: string;
  moodTag?: string;
  status: ActionStatus;
  accent: "sky" | "violet" | "emerald" | "amber";
  iconKey:
    | "repeat"
    | "time"
    | "energy"
    | "sleep"
    | "connect"
    | "learn"
    | "build"
    | "test"
    | "map"
    | "observe";
};

const ACTION_RECS: ActionRec[] = [
  {
    id: "marine-bio",
    title: "Marine Biology",
    summary:
      "Tiny moves that keep your curiosity alive without turning this into a giant plan. Low pressure. Real-world learning.",
    accent: "sky",
    tags: [
      { label: "Nature + science", icon: <Waves className="h-4 w-4" /> },
      { label: "Hands-on", icon: <FlaskConical className="h-4 w-4" /> },
      { label: "Curiosity", icon: <Search className="h-4 w-4" /> },
    ],
    nextMove: {
      title: "Weekly check-in (5 minutes)",
      description:
        "A simple reset so you keep momentum: what worked, what didn’t, and one tiny tweak for next week.",
      nextStep: "Today: write 1 win + 1 stuck point + 1 tiny tweak.",
      whyChips: ["Easy", "Keeps momentum", "No perfection"],
      todayBullets: ["Write 1 win", "Write 1 stuck point", "Pick 1 tiny tweak"],
      status: "in_progress",
      frequencyLabel: "Once a week",
      moodTag: "Reflect",
    },
    activities: [
      {
        id: "mb-tiny-experiment",
        title: "One tiny experiment",
        description:
          "Pick one tiny change in how you learn (video vs article vs real-world observation). Try it for a few days.",
        nextStep: "Choose 1 format for 3 days. Notice what feels easiest.",
        frequencyLabel: "3–5 days",
        moodTag: "Experiment",
        status: "idea",
        accent: "emerald",
        iconKey: "test",
      },
      {
        id: "mb-observe",
        title: "2-minute observe cue",
        description:
          "When you see something in nature (or even a photo), pause and ask: “What’s happening here?”",
        nextStep: "Do 1 quick observation today. Write 1 question.",
        frequencyLabel: "Anytime",
        moodTag: "Curiosity",
        status: "idea",
        accent: "sky",
        iconKey: "observe",
      },
      {
        id: "mb-glossary",
        title: "10-word mini glossary",
        description:
          "Learn a tiny set of words so videos and posts feel less confusing.",
        nextStep: "Write 10 terms + 1 sentence each.",
        frequencyLabel: "20 minutes",
        moodTag: "Learn",
        status: "idea",
        accent: "violet",
        iconKey: "learn",
      },
      {
        id: "mb-sleep-curfew",
        title: "Screen curfew (2 nights)",
        description:
          "Pick two nights to put your phone away 30 minutes before sleep and see how it feels.",
        nextStep: "Pick the 2 nights now. Set a reminder.",
        frequencyLabel: "2 nights this week",
        moodTag: "Sleep",
        status: "idea",
        accent: "amber",
        iconKey: "sleep",
      },
    ],
  },

  {
    id: "product-builder",
    title: "Product Builder",
    summary:
      "Tiny moves to help you ship small, test fast, and stay energized without burning out.",
    accent: "amber",
    tags: [
      { label: "Build + ship", icon: <Hammer className="h-4 w-4" /> },
      { label: "Systems", icon: <Boxes className="h-4 w-4" /> },
      { label: "Iteration", icon: <Zap className="h-4 w-4" /> },
    ],
    nextMove: {
      title: "3-day mini sprint",
      description:
        "Pick one tiny problem. Make a rough solution. Test it with one person. Done.",
      nextStep: "Today: write a 5-sentence problem statement (who + pain + why).",
      whyChips: ["Ship small", "Fast feedback", "Real users"],
      todayBullets: ["Write 5 sentences", "List 3 constraints", "Pick 1 tiny test"],
      status: "in_progress",
      frequencyLabel: "3 days",
      moodTag: "Build",
    },
    activities: [
      {
        id: "pb-weekly-checkin",
        title: "Weekly check-in",
        description:
          "What shipped? What blocked you? What’s one tiny move that makes next week easier?",
        nextStep: "Write: Ship / Block / Next tiny move.",
        frequencyLabel: "Once a week",
        moodTag: "Reflect",
        status: "idea",
        accent: "sky",
        iconKey: "repeat",
      },
      {
        id: "pb-micro-reset",
        title: "2-minute reset",
        description:
          "When you feel fried: water + stretch + look away from screens.",
        nextStep: "Do 1 reset today when you notice overload.",
        frequencyLabel: "Anytime",
        moodTag: "Energy",
        status: "idea",
        accent: "amber",
        iconKey: "energy",
      },
      {
        id: "pb-test-one",
        title: "Test with one person",
        description:
          "A 7-minute test reveals what to build next (and what to delete).",
        nextStep: "Ask: “What would you expect to happen if you click this?”",
        frequencyLabel: "Once this week",
        moodTag: "Test",
        status: "idea",
        accent: "emerald",
        iconKey: "test",
      },
      {
        id: "pb-map-5boxes",
        title: "5-box journey map",
        description:
          "Draw start → finish. Circle the confusing step. Fix only that.",
        nextStep: "Draw 5 boxes. Circle 1 problem spot.",
        frequencyLabel: "15 minutes",
        moodTag: "Clarity",
        status: "idea",
        accent: "violet",
        iconKey: "map",
      },
    ],
  },

  {
    id: "community-leader",
    title: "Community Leader",
    summary:
      "Tiny moves that build momentum with people—without overplanning or social burnout.",
    accent: "violet",
    tags: [
      { label: "People-first", icon: <MessageCircle className="h-4 w-4" /> },
      { label: "Momentum", icon: <Zap className="h-4 w-4" /> },
      { label: "Organize", icon: <Boxes className="h-4 w-4" /> },
    ],
    nextMove: {
      title: "Two-text invite",
      description:
        "A tiny invite beats planning forever. Keep it simple and low-pressure.",
      nextStep: "Today: text 2 people about a 20-minute hang / study / walk.",
      whyChips: ["Low pressure", "People energy", "Fast iteration"],
      todayBullets: ["Text 2 people", "Pick a 20-minute window"],
      status: "in_progress",
      frequencyLabel: "Today",
      moodTag: "Connection",
    },
    activities: [
      {
        id: "cl-reachout-reminder",
        title: "Reach-out reminder",
        description:
          "Add one reminder to text someone who supports you—even just a quick check-in.",
        nextStep: "Pick 1 person. Set 1 reminder.",
        frequencyLabel: "Once a week",
        moodTag: "Connection",
        status: "idea",
        accent: "emerald",
        iconKey: "connect",
      },
      {
        id: "cl-question-checkin",
        title: "One-question check-in",
        description:
          "Use one question to deepen a conversation.",
        nextStep: "Ask: “What’s been taking up most of your brain lately?”",
        frequencyLabel: "2–3 times",
        moodTag: "People",
        status: "idea",
        accent: "sky",
        iconKey: "time",
      },
      {
        id: "cl-weekly-reflect",
        title: "Weekly check-in",
        description:
          "Notice what gave you energy with people—and what drained you.",
        nextStep: "Write 1 energizer + 1 drain + 1 boundary.",
        frequencyLabel: "Once a week",
        moodTag: "Reflect",
        status: "idea",
        accent: "violet",
        iconKey: "repeat",
      },
      {
        id: "cl-screen-curfew",
        title: "Screen curfew",
        description:
          "Two nights with less scrolling = more energy for real people.",
        nextStep: "Pick 2 nights. Put phone away 30 minutes before sleep.",
        frequencyLabel: "2 nights",
        moodTag: "Sleep",
        status: "idea",
        accent: "amber",
        iconKey: "sleep",
      },
    ],
  },

  {
    id: "visual-creative",
    title: "Visual Creative",
    summary:
      "Tiny moves that help you make things consistently, without needing motivation to be perfect.",
    accent: "emerald",
    tags: [
      { label: "Visual thinking", icon: <Sparkles className="h-4 w-4" /> },
      { label: "Make + remix", icon: <RefreshCw className="h-4 w-4" /> },
      { label: "Story", icon: <MessageCircle className="h-4 w-4" /> },
    ],
    nextMove: {
      title: "3-day remix sprint",
      description:
        "Pick one thing you like. Rebuild it. Add your twist. Done.",
      nextStep: "Today: save 3 screenshots + write what you like about each.",
      whyChips: ["Make to learn", "Low stakes", "Style confidence"],
      todayBullets: ["Save 3 screenshots", "Write 1 sentence each"],
      status: "in_progress",
      frequencyLabel: "3 days",
      moodTag: "Make",
    },
    activities: [
      {
        id: "vc-tiny-experiment",
        title: "One tiny experiment",
        description:
          "Change one variable (color / type / spacing) and see how it changes the vibe.",
        nextStep: "Pick 1 variable. Try 3 variations.",
        frequencyLabel: "3–5 days",
        moodTag: "Experiment",
        status: "idea",
        accent: "sky",
        iconKey: "test",
      },
      {
        id: "vc-move-break",
        title: "Movement cue",
        description:
          "A tiny walk/stretch helps your brain reconnect patterns and ideas.",
        nextStep: "Tie a 3–5 min stretch to finishing a task.",
        frequencyLabel: "A few times",
        moodTag: "Body",
        status: "idea",
        accent: "emerald",
        iconKey: "energy",
      },
      {
        id: "vc-weekly-checkin",
        title: "Weekly check-in",
        description:
          "What did you make? What did you learn? What do you want to try next?",
        nextStep: "Write: Made / Learned / Next.",
        frequencyLabel: "Once a week",
        moodTag: "Reflect",
        status: "idea",
        accent: "violet",
        iconKey: "repeat",
      },
      {
        id: "vc-screen-curfew",
        title: "Screen curfew",
        description:
          "A calmer brain makes cleaner creative decisions.",
        nextStep: "Pick 2 nights. Phone away 30 minutes early.",
        frequencyLabel: "2 nights",
        moodTag: "Sleep",
        status: "idea",
        accent: "amber",
        iconKey: "sleep",
      },
    ],
  },
];

/* =========================
   Styling helpers (match Goals)
========================= */

function accentBarClass(accent: ActionRec["accent"]): string {
  switch (accent) {
    case "sky":
      return "from-sky-300/90 via-cyan-300/70 to-indigo-300/60";
    case "violet":
      return "from-violet-300/90 via-fuchsia-300/70 to-sky-300/60";
    case "emerald":
      return "from-emerald-300/90 via-teal-300/70 to-sky-300/60";
    case "amber":
      return "from-amber-300/90 via-orange-300/70 to-rose-300/60";
    default:
      return "from-sky-300/90 via-cyan-300/70 to-indigo-300/60";
  }
}

function subtleTintClass(accent: ActivityCard["accent"]): string {
  // very minimal: faint left gradient + slightly different border tone
  switch (accent) {
    case "sky":
      return "before:from-sky-400/20 before:via-cyan-400/5 before:to-transparent border-white/10";
    case "violet":
      return "before:from-violet-400/20 before:via-fuchsia-400/5 before:to-transparent border-white/10";
    case "emerald":
      return "before:from-emerald-400/20 before:via-teal-400/5 before:to-transparent border-white/10";
    case "amber":
      return "before:from-amber-400/20 before:via-orange-400/5 before:to-transparent border-white/10";
    default:
      return "before:from-sky-400/20 before:via-cyan-400/5 before:to-transparent border-white/10";
  }
}

function iconForActivity(key: ActivityCard["iconKey"]) {
  const cls = "h-4 w-4";
  switch (key) {
    case "repeat":
      return <Repeat className={cls} />;
    case "time":
      return <Clock3 className={cls} />;
    case "energy":
      return <Zap className={cls} />;
    case "sleep":
      return <Moon className={cls} />;
    case "connect":
      return <HeartHandshake className={cls} />;
    case "learn":
      return <FlaskConical className={cls} />;
    case "build":
      return <Hammer className={cls} />;
    case "test":
      return <CheckCircle2 className={cls} />;
    case "map":
      return <Boxes className={cls} />;
    case "observe":
      return <Search className={cls} />;
    default:
      return <Sparkles className={cls} />;
  }
}

function statusChipClasses(status: ActionStatus, dark: boolean) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] border";
  if (dark) {
    if (status === "in_progress")
      return base + " border-emerald-400/70 bg-emerald-500/15 text-emerald-200";
    if (status === "done")
      return base + " border-sky-400/70 bg-sky-500/15 text-sky-200";
    if (status === "idea")
      return base + " border-white/10 bg-white/5 text-slate-200/80";
    return base + " border-slate-600/80 bg-slate-900/80 text-slate-300/90";
  }
  return base + " border-slate-200 bg-white text-slate-700";
}

function frequencyChipClasses(dark: boolean) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] border";
  return dark
    ? base + " border-white/10 bg-white/5 text-slate-100/85"
    : base + " border-slate-200 bg-white text-slate-700";
}

/* =========================
   Page
========================= */

const SWIPE_HINT_KEY = "everleap.actions.swipeHint.v1";

export default function ActionsPage() {
  // Shared AppChrome visual state (match Goals)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  // Which recommendation we’re on (1..4)
  const [recIndex, setRecIndex] = React.useState(0);
  const rec = ACTION_RECS[recIndex];

  // One-time swipe hint
  const [showSwipeHint, setShowSwipeHint] = React.useState(false);

  // Infinite feed
  const [feedCount, setFeedCount] = React.useState(6);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  // Surface styles match Goals
  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";
  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/70"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";

  const pageTextMutedClass = dark ? "text-slate-300/90" : "text-slate-600";

  // One-time swipe hint (show for a few seconds, then never again)
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const seen = window.localStorage.getItem(SWIPE_HINT_KEY);
    if (seen === "1") return;

    setShowSwipeHint(true);
    const t = window.setTimeout(() => {
      setShowSwipeHint(false);
      window.localStorage.setItem(SWIPE_HINT_KEY, "1");
    }, 3200);

    return () => window.clearTimeout(t);
  }, []);

  // Keep feed consistent per recommendation
  React.useEffect(() => {
    setFeedCount(6);
  }, [recIndex]);

  // Infinite scroll observer
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        setFeedCount((n) => Math.min(n + 4, rec.activities.length));
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [recIndex, rec.activities.length]);

  // Swipe on the header area (minimal + reliable)
  const drag = React.useRef<{ x: number; active: boolean } | null>(null);

  const goPrev = React.useCallback(() => {
    setRecIndex((i) => (i - 1 + ACTION_RECS.length) % ACTION_RECS.length);
  }, []);

  const goNext = React.useCallback(() => {
    setRecIndex((i) => (i + 1) % ACTION_RECS.length);
  }, []);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    drag.current = { x: e.clientX, active: true };
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) return;

    const dx = e.clientX - d.x;
    if (Math.abs(dx) < 40) return;

    if (dx < 0) goNext();
    else goPrev();
  };

  const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = () => {
    drag.current = null;
  };

  const startNextMove = () => {
    openGuide({
      source: "actions_start_next_move",
      rec: { id: rec.id, title: rec.title },
      action: rec.nextMove,
      prompt:
        "User wants to start this tiny move. Ask ONE question to fit it to their week (time/energy/place), then confirm a simple plan.",
    });
  };

  const swapNextMove = () => {
    openGuide({
      source: "actions_swap_next_move",
      rec: { id: rec.id, title: rec.title },
      prompt:
        "Give ONE alternative tiny move for this direction. Keep it doable in under 10 minutes and include the first step.",
    });
  };

  const openCoachFeedback = (choice: "yes" | "not_quite") => {
    openGuide({
      source: "actions_coach_check",
      choice,
      rec: { id: rec.id, title: rec.title },
      prompt:
        choice === "yes"
          ? "User says this feels doable. Ask ONE follow-up question to lock in the smallest first step."
          : "User says this does not feel doable. Ask ONE question (energy/time/stress) and offer a smaller alternative.",
    });
  };

  const surpriseMe = () => {
    openGuide({
      source: "actions_surprise_me",
      rec: { id: rec.id, title: rec.title },
      prompt:
        "Surprise me with ONE tiny activity I can try this week. Keep it simple, low-pressure, and give the first step.",
    });
  };

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="actions_orb"
      ambientCap={0.35}
    >
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
          {/* =========================
              HEADER (swipe-able)
             ========================= */}
          <section
            className={`relative rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            style={{ touchAction: "pan-y" }}
            aria-label="Swipe left or right to change direction"
          >
            {gradientLevel > 0 && (
              <div
                className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-transparent via-white/10 to-transparent blur-3xl"
                style={{ opacity: 0.18 }}
              />
            )}

            {/* subtle accent bar */}
            <div
              className={`pointer-events-none absolute left-0 top-8 hidden h-[70%] w-[2px] rounded-full bg-gradient-to-b ${accentBarClass(
                rec.accent
              )} sm:block`}
              style={{ opacity: 0.75 }}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                        dark
                          ? "bg-white/10 text-slate-100"
                          : "bg-slate-900/5 text-slate-900"
                      }`}
                    >
                      <Flame className="h-4 w-4" />
                    </div>
                    <div className={`${sectionLabelClass} opacity-90`}>
                      Activities
                    </div>
                  </div>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Tiny moves for: {rec.title}
                  </h1>

                  <p className={`mt-2 max-w-2xl text-sm ${pageTextMutedClass}`}>
                    {rec.summary}
                  </p>

                  {/* tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {rec.tags.map((t) => (
                      <span
                        key={t.label}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          dark
                            ? "border-white/10 bg-white/5 text-slate-100/90"
                            : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        <span
                          className={`${
                            dark ? "text-slate-100/80" : "text-slate-600"
                          }`}
                        >
                          {t.icon}
                        </span>
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pager (chevrons + dots + hint pill) */}
                <div className="shrink-0">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-95 ${
                        dark
                          ? "border-white/10 bg-slate-950/35 text-slate-100 hover:bg-slate-950/55"
                          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                      aria-label="Previous direction"
                      title="Previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {ACTION_RECS.map((_, i) => {
                          const on = i === recIndex;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRecIndex(i)}
                              className={`h-2 w-2 rounded-full transition ${
                                on
                                  ? "bg-sky-300"
                                  : dark
                                  ? "bg-white/10 hover:bg-white/20"
                                  : "bg-slate-300 hover:bg-slate-400"
                              }`}
                              aria-label={`Go to direction ${i + 1} of ${ACTION_RECS.length}`}
                              title={`${i + 1}/${ACTION_RECS.length}`}
                            />
                          );
                        })}
                      </div>

                      <div
                        className={`text-xs ${
                          dark ? "text-slate-300/70" : "text-slate-600"
                        }`}
                      >
                        {recIndex + 1}/{ACTION_RECS.length}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={goNext}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-95 ${
                        dark
                          ? "border-white/10 bg-slate-950/35 text-slate-100 hover:bg-slate-950/55"
                          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                      aria-label="Next direction"
                      title="Next"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {showSwipeHint ? (
                    <div className="mt-2 flex justify-end">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.7rem] font-semibold ${
                          dark
                            ? "border-white/10 bg-white/5 text-slate-100/90"
                            : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        <span className="opacity-80">Swipe</span>
                        <span className="opacity-80">↔</span>
                      </div>
                    </div>
                  ) : null}

                  <div
                    className={`mt-2 text-right text-[0.7rem] ${
                      dark ? "text-slate-300/50" : "text-slate-500"
                    }`}
                  >
                    Swipe or tap dots
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              NEXT MOVE
             ========================= */}
          <section className="mt-5">
            <div className={`relative rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}>
              {/* accent rail */}
              <div
                className={`pointer-events-none absolute left-0 top-7 h-[78%] w-[2px] rounded-full bg-gradient-to-b ${accentBarClass(
                  rec.accent
                )}`}
                style={{ opacity: 0.6 }}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className={`${sectionLabelClass} opacity-90`}>Your next move</div>

                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {rec.nextMove.title}
                  </div>

                  <p className={`mt-2 text-sm ${pageTextMutedClass}`}>
                    {rec.nextMove.description}
                  </p>

                  <div className={`mt-4 text-sm ${dark ? "text-slate-200/90" : "text-slate-800"}`}>
                    <span className="font-semibold">Next step:</span> {rec.nextMove.nextStep}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-semibold ${dark ? "text-slate-300/70" : "text-slate-600"}`}>
                      Why this:
                    </span>
                    {rec.nextMove.whyChips.map((c) => (
                      <span
                        key={c}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          dark ? "border-white/10 bg-white/5 text-slate-100/90" : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                    <span className={frequencyChipClasses(dark)}>
                      <Clock3 className="h-3 w-3" />
                      <span>{rec.nextMove.frequencyLabel}</span>
                    </span>
                  </div>

                  <div
                    className={`mt-5 rounded-3xl border px-4 py-4 ${
                      dark ? "border-white/10 bg-slate-950/35" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className={`${sectionLabelClass} opacity-90`}>Today</div>
                    <div className="mt-3 space-y-2">
                      {rec.nextMove.todayBullets.map((b) => (
                        <div key={b} className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                              dark
                                ? "border-sky-300/30 bg-sky-300/10 text-sky-200"
                                : "border-sky-300 bg-sky-50 text-sky-700"
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </span>
                          <div className={`text-sm ${dark ? "text-slate-100/95" : "text-slate-900"}`}>
                            {b}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={startNextMove}
                      className="inline-flex items-center justify-center rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-300/35 transition hover:bg-sky-200 active:scale-95"
                    >
                      Start this <ArrowRight className="ml-2 h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={swapNextMove}
                      className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition active:scale-95 ${
                        dark
                          ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Swap it <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={statusChipClasses(rec.nextMove.status, dark)}>
                    <Repeat className="h-3 w-3" />
                    <span>
                      {rec.nextMove.status === "in_progress" ? "In progress" : rec.nextMove.status}
                    </span>
                  </span>

                  {rec.nextMove.moodTag ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] ${
                        dark ? "bg-white/5 text-slate-100/80" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {rec.nextMove.moodTag}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              COACH CHECK
             ========================= */}
          <section className="mt-5">
            <div className={`rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className={`${sectionLabelClass} opacity-90`}>Coach check</div>
                  <div className="mt-2 text-lg font-semibold">Does this feel doable this week?</div>
                  <p className={`mt-1 text-sm ${pageTextMutedClass}`}>
                    Tell the Guide, and Everleap will shrink the next step until it fits your real life.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openCoachFeedback("yes")}
                    className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Yes, lock it in
                  </button>
                  <button
                    type="button"
                    onClick={() => openCoachFeedback("not_quite")}
                    className="inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-amber-300/25 transition hover:bg-amber-200 active:scale-95"
                  >
                    Not really
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              ACTIVITIES FEED
             ========================= */}
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className={`${sectionLabelClass} opacity-90`}>More tiny moves (scroll)</div>
                <div className={`mt-1 text-sm ${pageTextMutedClass}`}>
                  Pick one. Everleap will help you make it smaller and easier.
                </div>
              </div>

              <button
                type="button"
                onClick={surpriseMe}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                  dark
                    ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                Surprise me <ArrowRight className="h-4 w-4 opacity-70" />
              </button>
            </div>

            <div className="space-y-3">
              {rec.activities.slice(0, feedCount).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                    openGuide({
                      source: "actions_feed_pick",
                      rec: { id: rec.id, title: rec.title },
                      activity: a,
                      prompt:
                        "User tapped a tiny move. Offer ONE way to make the next step smaller, then ask if they want to try it this week.",
                    })
                  }
                  className={`
                    relative w-full overflow-hidden rounded-[28px] border px-5 py-5 text-left transition
                    ${surface}
                    hover:brightness-[1.06] active:scale-[0.99]
                    before:absolute before:inset-0 before:bg-gradient-to-r before:opacity-100
                    ${subtleTintClass(a.accent)}
                  `}
                >
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className={`${sectionLabelClass} opacity-90`}>
                        Tiny move
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border ${
                            dark
                              ? "border-white/10 bg-white/5 text-slate-100"
                              : "border-slate-200 bg-white text-slate-900"
                          }`}
                        >
                          {iconForActivity(a.iconKey)}
                        </span>
                        <div className="text-base font-semibold">{a.title}</div>
                        {a.moodTag ? (
                          <span
                            className={`ml-1 inline-flex items-center rounded-full px-2 py-1 text-[0.65rem] ${
                              dark ? "bg-white/5 text-slate-100/80" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {a.moodTag}
                          </span>
                        ) : null}
                      </div>

                      <div className={`mt-2 text-sm ${pageTextMutedClass}`}>
                        {a.description}
                      </div>

                      <div className={`mt-4 text-sm ${dark ? "text-slate-200/90" : "text-slate-800"}`}>
                        <span className="font-semibold">Next:</span> {a.nextStep}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={frequencyChipClasses(dark)}>
                        <Clock3 className="h-3 w-3" />
                        <span>{a.frequencyLabel}</span>
                      </span>

                      <span className={statusChipClasses(a.status, dark)}>
                        <Sparkles className="h-3 w-3" />
                        <span>{a.status === "idea" ? "Idea" : a.status}</span>
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {/* sentinel for infinite load */}
              <div ref={sentinelRef} className="h-6" />

              {feedCount >= rec.activities.length ? (
                <div className={`mt-2 text-center text-xs ${dark ? "text-slate-300/50" : "text-slate-500"}`}>
                  End of feed for this direction. Swipe up top to switch.
                </div>
              ) : null}
            </div>
          </section>

          <div className="h-6" />
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
