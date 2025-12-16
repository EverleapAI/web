// src/app/main/goals/page.tsx
"use client";

import * as React from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Waves,
  FlaskConical,
  Search,
  Zap,
  Hammer,
  Boxes,
  RefreshCw,
  CheckCircle2,
  Clock3,
  MessageCircle,
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
      detail: { source: "goals", ...(detail ?? {}) },
    })
  );
}


// fallback if CustomAvoidEvent isn’t defined in your env
function CustomAvoidEvent(type: string, init?: CustomEventInit) {
  return new CustomEvent(type, init);
}

/* =========================
   Types + mock data
========================= */

type GoalStatus = "not_started" | "in_progress" | "done" | "idea";

type AlignedGoal = {
  id: string;
  title: string;
  description: string;
  nextStep: string;
  status: GoalStatus;
  accent: "sky" | "violet" | "emerald" | "amber";
  iconKey: "talk" | "glossary" | "field" | "read" | "build" | "test" | "map" | "ship";
};

type InsightRec = {
  id: string;
  title: string;
  summary: string;
  tags: { label: string; icon: React.ReactNode }[];
  accent: "sky" | "violet" | "emerald" | "amber";
  nextMove: {
    title: string;
    description: string;
    nextStep: string;
    whyChips: string[];
    todayBullets: string[];
    status: GoalStatus;
  };
  alignedIdeas: AlignedGoal[];
};

const RECS: InsightRec[] = [
  {
    id: "marine-bio",
    title: "Marine Biology",
    summary:
      "You seem energized by nature + science + hands-on observation. Marine Biology could be a strong fit to explore next.",
    tags: [
      { label: "Nature + science", icon: <Waves className="h-4 w-4" /> },
      { label: "Hands-on", icon: <FlaskConical className="h-4 w-4" /> },
      { label: "Curiosity-driven", icon: <Search className="h-4 w-4" /> },
    ],
    accent: "sky",
    nextMove: {
      title: "3-day Marine Bio micro-sprint",
      description:
        "A tiny test-drive: learn one concept, notice one thing in the real world, and capture one question.",
      nextStep: "Today: watch one 6–8 min reef ecology video, write 2 questions.",
      whyChips: ["Real-world learning", "Short sprints", "Fast feedback"],
      todayBullets: ["Watch 1 short reef ecology video (6–8 min)", "Write 2 questions"],
      status: "in_progress",
    },
    alignedIdeas: [
      {
        id: "mb-talk",
        title: "Talk to one Marine Bio person",
        description:
          "One conversation can save you months. Find a student, teacher, or researcher and ask the right question.",
        nextStep: 'Message one person: “What surprised you most about the field?”',
        status: "idea",
        accent: "sky",
        iconKey: "talk",
      },
      {
        id: "mb-glossary",
        title: "10-word mini glossary",
        description:
          "Confidence comes from language. Learn a tiny set of terms so videos and articles make sense.",
        nextStep: "Write 10 terms (reef, tidepool, ecosystem…) + 1-line meaning each.",
        status: "idea",
        accent: "violet",
        iconKey: "glossary",
      },
      {
        id: "mb-tidepool",
        title: "Plan one tidepool visit",
        description:
          "Turn curiosity into a real experience—simple logistics, no perfection.",
        nextStep: "Pick a location + day; set a 30-minute “just observe” window.",
        status: "idea",
        accent: "emerald",
        iconKey: "field",
      },
      {
        id: "mb-onepager",
        title: "One-page “What is Marine Biology?”",
        description:
          "Make the field feel real: one page that answers the basics in your own words.",
        nextStep: "Write: what they do, where they work, one cool sub-area you’d try.",
        status: "idea",
        accent: "amber",
        iconKey: "read",
      },
    ],
  },

  {
    id: "product-builder",
    title: "Product Builder",
    summary: "You’re drawn to building practical things: ship small, test fast, learn from real users.",
    tags: [
      { label: "Build + ship", icon: <Hammer className="h-4 w-4" /> },
      { label: "Systems thinking", icon: <Boxes className="h-4 w-4" /> },
      { label: "Iteration", icon: <Zap className="h-4 w-4" /> },
    ],
    accent: "amber",
    nextMove: {
      title: "3-day mini product sprint",
      description: "Pick one tiny problem. Make a rough solution. Test it with one person.",
      nextStep: "Today: write a 5-sentence problem statement + who it’s for.",
      whyChips: ["Ship small", "Test fast", "Real users"],
      todayBullets: ["Write 5 sentences: problem + user", "List 3 constraints (time, money, tools)"],
      status: "in_progress",
    },
    alignedIdeas: [
      {
        id: "pb-landing",
        title: "One-screen landing page",
        description: "Make a single screen that explains the problem + promise.",
        nextStep: "Write headline + 3 bullets. No design perfection.",
        status: "idea",
        accent: "sky",
        iconKey: "build",
      },
      {
        id: "pb-test",
        title: "Test with one person",
        description: "A 7-minute test reveals what to build next.",
        nextStep: "Ask: “What would you expect to happen if you click this?”",
        status: "idea",
        accent: "emerald",
        iconKey: "test",
      },
      {
        id: "pb-map",
        title: "Tiny user journey map",
        description: "Draw 5 boxes: start → finish. Find the confusing step.",
        nextStep: "Circle the step you’d simplify first.",
        status: "idea",
        accent: "violet",
        iconKey: "map",
      },
      {
        id: "pb-ship",
        title: "Ship a micro version",
        description: "Cut it down until you can finish in 45 minutes.",
        nextStep: "Delete 1 feature. Keep 1 core action.",
        status: "idea",
        accent: "amber",
        iconKey: "ship",
      },
    ],
  },

  {
    id: "community-leader",
    title: "Community Leader",
    summary: "You get energy from people + momentum. You’re good at making things happen with others.",
    tags: [
      { label: "People-first", icon: <MessageCircle className="h-4 w-4" /> },
      { label: "Momentum", icon: <Zap className="h-4 w-4" /> },
      { label: "Organize", icon: <Boxes className="h-4 w-4" /> },
    ],
    accent: "violet",
    nextMove: {
      title: "3-day micro-community experiment",
      description: "Start tiny: one invite, one moment, one follow-up. See what sticks.",
      nextStep: "Today: invite 2 people to a 20-minute hang / study / walk.",
      whyChips: ["Low pressure", "People energy", "Fast iteration"],
      todayBullets: ["Invite 2 people (simple text)", "Pick a 20-minute window"],
      status: "in_progress",
    },
    alignedIdeas: [
      {
        id: "cl-invite",
        title: "Two-text invite",
        description: "A tiny invite beats planning forever.",
        nextStep: "Text: “Want to do a 20-min ___ after school tomorrow?”",
        status: "idea",
        accent: "emerald",
        iconKey: "talk",
      },
      {
        id: "cl-role",
        title: "Pick one role to try",
        description: "Leader doesn’t mean “boss.” Try one role: host, connector, planner.",
        nextStep: "Choose 1 role for 3 days. Notice what feels natural.",
        status: "idea",
        accent: "violet",
        iconKey: "map",
      },
      {
        id: "cl-question",
        title: "One question check-in",
        description: "Use one question to deepen a conversation.",
        nextStep: "Ask: “What’s been taking up most of your brain lately?”",
        status: "idea",
        accent: "sky",
        iconKey: "read",
      },
      {
        id: "cl-follow",
        title: "Follow-up loop",
        description: "Leaders close loops. That’s the magic.",
        nextStep: "Send one follow-up: “Thanks—should we do it again next week?”",
        status: "idea",
        accent: "amber",
        iconKey: "ship",
      },
    ],
  },

  {
    id: "visual-creative",
    title: "Visual Creative",
    summary: "You think in visuals: patterns, style, mood, story. You learn by making.",
    tags: [
      { label: "Visual thinking", icon: <Sparkles className="h-4 w-4" /> },
      { label: "Make + remix", icon: <RefreshCw className="h-4 w-4" /> },
      { label: "Story", icon: <MessageCircle className="h-4 w-4" /> },
    ],
    accent: "emerald",
    nextMove: {
      title: "3-day visual remix sprint",
      description: "Pick one thing you like. Rebuild it. Add your twist. Done.",
      nextStep: "Today: screenshot 3 designs you like + write what you like about each.",
      whyChips: ["Make to learn", "Low stakes", "Style confidence"],
      todayBullets: ["Save 3 screenshots", "Write 1 sentence: what you like (color/type/layout)"],
      status: "in_progress",
    },
    alignedIdeas: [
      {
        id: "vc-moodboard",
        title: "Mini moodboard",
        description: "Collect 9 images that match your vibe.",
        nextStep: "Pick 3 words for your vibe (calm, electric, warm…).",
        status: "idea",
        accent: "emerald",
        iconKey: "read",
      },
      {
        id: "vc-remix",
        title: "Remix one screen",
        description: "Rebuild one screen with your own choices.",
        nextStep: "Change only 3 things: headline, color accent, spacing.",
        status: "idea",
        accent: "sky",
        iconKey: "build",
      },
      {
        id: "vc-share",
        title: "Show it to one person",
        description: "Confidence grows with tiny shares.",
        nextStep: "Ask: “What’s the first thing you notice?”",
        status: "idea",
        accent: "violet",
        iconKey: "test",
      },
      {
        id: "vc-ship",
        title: "Ship a tiny post",
        description: "Make a 1-slide post (or story) and publish it.",
        nextStep: "One slide: before/after remix.",
        status: "idea",
        accent: "amber",
        iconKey: "ship",
      },
    ],
  },
];

function accentBarClass(accent: InsightRec["accent"]): string {
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

function subtleTintClass(accent: AlignedGoal["accent"]): string {
  // very minimal: just a faint left gradient + slightly different border tone
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

function iconForAligned(key: AlignedGoal["iconKey"]) {
  const cls = "h-4 w-4";
  switch (key) {
    case "talk":
      return <MessageCircle className={cls} />;
    case "glossary":
      return <FlaskConical className={cls} />;
    case "field":
      return <Waves className={cls} />;
    case "read":
      return <Search className={cls} />;
    case "build":
      return <Hammer className={cls} />;
    case "test":
      return <CheckCircle2 className={cls} />;
    case "map":
      return <Boxes className={cls} />;
    case "ship":
      return <Zap className={cls} />;
    default:
      return <Sparkles className={cls} />;
  }
}

function statusChipClasses(status: GoalStatus, dark: boolean) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] border";
  if (dark) {
    if (status === "in_progress") return base + " border-emerald-400/70 bg-emerald-500/15 text-emerald-200";
    if (status === "done") return base + " border-sky-400/70 bg-sky-500/15 text-sky-200";
    if (status === "idea") return base + " border-white/10 bg-white/5 text-slate-200/80";
    return base + " border-slate-600/80 bg-slate-900/80 text-slate-300/90";
  }
  // light fallback (rare for now)
  return base + " border-slate-200 bg-white text-slate-700";
}

/* =========================
   Page
========================= */

const SWIPE_HINT_KEY = "everleap.goals.swipeHint.v1";

export default function GoalsPage() {
  // Shared AppChrome visual state
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  // Which recommendation we’re on (1..4)
  const [recIndex, setRecIndex] = React.useState(0);

  // One-time swipe hint
  const [showSwipeHint, setShowSwipeHint] = React.useState(false);

  // Infinite feed
  const [feedCount, setFeedCount] = React.useState(6);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const rec = RECS[recIndex];

  // Surface styles match Spotlight/Insights
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

  // Infinite scroll observer (fixed deps)
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        setFeedCount((n) => Math.min(n + 4, rec.alignedIdeas.length));
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [recIndex, rec.alignedIdeas.length]);

  // Swipe on the hero header area (minimal + reliable)
  const drag = React.useRef<{ x: number; active: boolean } | null>(null);

  const goPrev = React.useCallback(() => {
    setRecIndex((i) => (i - 1 + RECS.length) % RECS.length);
  }, []);

  const goNext = React.useCallback(() => {
    setRecIndex((i) => (i + 1) % RECS.length);
  }, []);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    drag.current = { x: e.clientX, active: true };
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) return;

    const dx = e.clientX - d.x;
    // Ignore small drags
    if (Math.abs(dx) < 40) return;

    if (dx < 0) goNext();
    else goPrev();
  };

  const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = () => {
    drag.current = null;
  };

  const openCoachFeedback = (choice: "yes" | "not_quite") => {
    openGuide({
      source: "goals_coach_check",
      choice,
      rec: { id: rec.id, title: rec.title },
      prompt:
        choice === "yes"
          ? "User says this direction feels right. Ask ONE follow-up question to make their goals fit even better."
          : "User says this direction does NOT feel right. Ask ONE question to correct course and pick a better direction.",
    });
  };

  const surpriseMe = () => {
    openGuide({
      source: "goals_surprise_me",
      rec: { id: rec.id, title: rec.title },
      prompt:
        "Surprise me with ONE tiny goal aligned to this direction. Keep it 3 days max and give the first step.",
    });
  };

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="goals_orb"
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
            aria-label="Swipe left or right to change recommendation"
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
                        dark ? "bg-white/10 text-slate-100" : "bg-slate-900/5 text-slate-900"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className={`${sectionLabelClass} opacity-90`}>Goals</div>
                  </div>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    From your Insights: {rec.title}
                  </h1>

                  <p className={`mt-2 max-w-2xl text-sm ${pageTextMutedClass}`}>{rec.summary}</p>

                  {/* tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {rec.tags.map((t) => (
                      <span
                        key={t.label}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          dark ? "border-white/10 bg-white/5 text-slate-100/90" : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        <span className={`${dark ? "text-slate-100/80" : "text-slate-600"}`}>{t.icon}</span>
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pager (chevrons + dots + one-time hint pill) */}
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
                      aria-label="Previous recommendation"
                      title="Previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {RECS.map((_, i) => {
                          const on = i === recIndex;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRecIndex(i)}
                              className={`h-2 w-2 rounded-full transition ${
                                on ? "bg-sky-300" : dark ? "bg-white/10 hover:bg-white/20" : "bg-slate-300 hover:bg-slate-400"
                              }`}
                              aria-label={`Go to recommendation ${i + 1} of ${RECS.length}`}
                              title={`${i + 1}/${RECS.length}`}
                            />
                          );
                        })}
                      </div>

                      <div className={`text-xs ${dark ? "text-slate-300/70" : "text-slate-600"}`}>
                        {recIndex + 1}/{RECS.length}
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
                      aria-label="Next recommendation"
                      title="Next"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* one-time hint (minimal) */}
                  {showSwipeHint ? (
                    <div className="mt-2 flex justify-end">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.7rem] font-semibold ${
                          dark ? "border-white/10 bg-white/5 text-slate-100/90" : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        <span className="opacity-80">Swipe</span>
                        <span className="opacity-80">↔</span>
                      </div>
                    </div>
                  ) : null}

                  <div className={`mt-2 text-right text-[0.7rem] ${dark ? "text-slate-300/50" : "text-slate-500"}`}>
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
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{rec.nextMove.title}</div>
                  <p className={`mt-2 text-sm ${pageTextMutedClass}`}>{rec.nextMove.description}</p>

                  <div className={`mt-4 text-sm ${dark ? "text-slate-200/90" : "text-slate-800"}`}>
                    <span className="font-semibold">Next step:</span> {rec.nextMove.nextStep}
                  </div>

                  {/* why chips */}
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
                  </div>

                  {/* today box */}
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
                              dark ? "border-sky-300/30 bg-sky-300/10 text-sky-200" : "border-sky-300 bg-sky-50 text-sky-700"
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </span>
                          <div className={`text-sm ${dark ? "text-slate-100/95" : "text-slate-900"}`}>{b}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA row */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        openGuide({
                          source: "goals_lets_do_this",
                          rec: { id: rec.id, title: rec.title },
                          goal: rec.nextMove,
                          prompt:
                            "User wants to start this goal. Ask ONE question to personalize the first step (time/place/energy), then confirm a simple plan.",
                        })
                      }
                      className="inline-flex items-center justify-center rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-300/35 transition hover:bg-sky-200 active:scale-95"
                    >
                      Let’s do this <ArrowRight className="ml-2 h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={surpriseMe}
                      className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition active:scale-95 ${
                        dark
                          ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Surprise me <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                    </button>
                  </div>
                </div>

                <span className={statusChipClasses(rec.nextMove.status, dark)}>
                  <Clock3 className="h-3 w-3" />
                  <span>{rec.nextMove.status === "in_progress" ? "In progress" : rec.nextMove.status}</span>
                </span>
              </div>
            </div>
          </section>

          {/* =========================
              COACH CHECK (feedback CTA)
             ========================= */}
          <section className="mt-5">
            <div className={`rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className={`${sectionLabelClass} opacity-90`}>Coach check</div>
                  <div className="mt-2 text-lg font-semibold">Does this direction feel right so far?</div>
                  <p className={`mt-1 text-sm ${pageTextMutedClass}`}>
                    Tell the Guide, and Everleap will tune your goals to better match your Insights.
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
                    Yes, keep going
                  </button>
                  <button
                    type="button"
                    onClick={() => openCoachFeedback("not_quite")}
                    className="inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-amber-300/25 transition hover:bg-amber-200 active:scale-95"
                  >
                    Not quite
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              ALIGNED IDEAS (true-ish infinite scroll)
             ========================= */}
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className={`${sectionLabelClass} opacity-90`}>Aligned ideas (scroll)</div>
                <div className={`mt-1 text-sm ${pageTextMutedClass}`}>A feed of tiny goals that match this direction.</div>
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
                Get one new goal <ArrowRight className="h-4 w-4 opacity-70" />
              </button>
            </div>

            <div className="space-y-3">
              {rec.alignedIdeas.slice(0, feedCount).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() =>
                    openGuide({
                      source: "goals_feed_pick",
                      rec: { id: rec.id, title: rec.title },
                      idea: g,
                      prompt:
                        "User tapped an aligned idea. Offer ONE way to make the next step smaller and easier, then ask if they want to add it as their goal.",
                    })
                  }
                  className={`
                    relative w-full overflow-hidden rounded-[28px] border px-5 py-5 text-left transition
                    ${surface}
                    hover:brightness-[1.06] active:scale-[0.99]
                    before:absolute before:inset-0 before:bg-gradient-to-r before:opacity-100
                    ${subtleTintClass(g.accent)}
                  `}
                >
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className={`${sectionLabelClass} opacity-90`}>
                        Aligned: {rec.title}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border ${
                            dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white text-slate-900"
                          }`}
                        >
                          {iconForAligned(g.iconKey)}
                        </span>
                        <div className="text-base font-semibold">{g.title}</div>
                      </div>

                      <div className={`mt-2 text-sm ${pageTextMutedClass}`}>{g.description}</div>

                      <div className={`mt-4 text-sm ${dark ? "text-slate-200/90" : "text-slate-800"}`}>
                        <span className="font-semibold">Next:</span> {g.nextStep}
                      </div>
                    </div>

                    <span className={statusChipClasses(g.status, dark)}>
                      <Clock3 className="h-3 w-3" />
                      <span>{g.status === "idea" ? "Idea" : g.status}</span>
                    </span>
                  </div>
                </button>
              ))}

              {/* sentinel for infinite load */}
              <div ref={sentinelRef} className="h-6" />

              {feedCount >= rec.alignedIdeas.length ? (
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
