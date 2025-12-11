// src/app/goals/page.tsx
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { BottomNav } from "@/components/navigation/BottomNav";

type GoalStyle = {
  id: string;
  title: string;
  tagLine: string;
};

type ExampleGoal = {
  id: string;
  label: string;
  style: string;
  title: string;
  description: string;
};

const goalStyles: GoalStyle[] = [
  {
    id: "tiny-experiments",
    title: "Tiny experiments",
    tagLine: "Try something for 7 days and just see what happens.",
  },
  {
    id: "anchor-habits",
    title: "Anchor habits",
    tagLine: "Attach a small action to something you already do.",
  },
  {
    id: "support-goals",
    title: "Support goals",
    tagLine: "Check-ins, asking for help, being accountable.",
  },
  {
    id: "reset-recharge",
    title: "Reset & recharge",
    tagLine: "Rest, screens, boundaries — real recovery counts.",
  },
];

const exampleGoals: ExampleGoal[] = [
  {
    id: "focus-test",
    label: "Tiny experiment",
    style: "Tiny experiment",
    title: "3-day focus test",
    description:
      "Pick one class or project. Try a 20-minute no-phone focus block each day for three days.",
  },
  {
    id: "after-school-reset",
    label: "Anchor habit",
    style: "Anchor habit",
    title: "After-school reset",
    description:
      "When you get home, take 10 minutes to decompress before touching homework or your phone.",
  },
  {
    id: "weekly-checkin",
    label: "Support goal",
    style: "Support goal",
    title: "Weekly check-in",
    description:
      "Text or talk to one trusted person once a week and share one win + one stress.",
  },
  {
    id: "screen-curfew",
    label: "Reset & recharge",
    style: "Reset & recharge",
    title: "Screen curfew",
    description:
      "Pick two nights this week to put your phone away 30 minutes before bed and see how you sleep.",
  },
];

export default function GoalsPage() {
  const examplesRef = useRef<HTMLDivElement | null>(null);

  const handleShowExamples = () => {
    if (examplesRef.current) {
      examplesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /** Opens the AI Guide with the passed example goals */
  const openGuideWithGoals = (source: string, primaryId?: string) => {
    const suggestedGoals = exampleGoals.map((g) => ({
      id: g.id,
      title: g.title,
      style: g.style,
      description: g.description,
    }));

    // Bring chosen goal to the front if provided
    if (primaryId) {
      suggestedGoals.sort((a, b) =>
        a.id === primaryId ? -1 : b.id === primaryId ? 1 : 0
      );
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("everleap-open-ai-guide", {
          detail: { source, suggestedGoals },
        })
      );
    }
  };

  const handleGoalIdeaClick = () => {
    openGuideWithGoals("goals_page_goal_idea");
  };

  const handleExampleClick = (goalId: string) => {
    openGuideWithGoals("goals_page_example_click", goalId);
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.16), transparent 55%)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24 pt-20 md:px-8">
        <main className="w-full space-y-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                Goals
              </p>
              <h1 className="text-3xl font-bold text-slate-50 md:text-4xl">
                Turn your insights into small, doable goals
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300 md:text-base">
                Everleap generates realistic goals based on who you are. Pick
                what matches your energy today.
              </p>

              {/* Mobile AI guide */}
              <div className="mt-3 md:hidden">
                <AiGuideOrb
                  subline="Ask Everleap for a goal that fits your energy today."
                  source="goals_page_orb"
                />
              </div>
            </div>

            {/* AI guide orb (desktop) */}
            <div className="hidden md:block">
              <AiGuideOrb
                subline="Ask Everleap for a goal that fits your energy today."
                source="goals_page_orb"
              />
            </div>
          </div>

          {/* Goal Lab */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-700/60 bg-[radial-gradient(circle_at_top_left,#4f46e5,transparent_55%),radial-gradient(circle_at_bottom_right,#ec4899,transparent_55%),#020617] px-5 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.55)] md:px-8 md:py-8"
          >
            <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 md:space-y-3">
                <div className="inline-flex items-center rounded-full border border-sky-500/40 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-sky-200">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Goal Lab
                </div>

                <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                  Start with something small this week.
                </h2>

                <p className="max-w-xl text-sm text-slate-200/80">
                  No giant life plan. Just one experiment you can actually
                  start.
                </p>
              </div>

              <div className="flex w-full max-w-xs shrink-0 flex-col gap-3 md:items-end">
                <button
                  type="button"
                  onClick={handleGoalIdeaClick}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_rgba(56,189,248,0.55)] transition hover:bg-sky-300 active:scale-95"
                >
                  I want a goal idea
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleShowExamples}
                  className="text-xs text-slate-200/80 underline-offset-2 hover:text-slate-50 hover:underline md:text-sm"
                >
                  Just show me examples for now
                </button>
              </div>
            </div>

            {/* Glow overlays */}
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
            </div>
          </motion.section>

          {/* Goal styles */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
                Goal styles Everleap loves
              </h3>
              <span className="text-[11px] text-slate-400 md:text-xs">
                Pick the mode that matches your energy.
              </span>
            </div>

            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1 pt-1">
              {goalStyles.map((style) => (
                <motion.article
                  key={style.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                  className="min-w-[220px] max-w-xs rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.8)]"
                >
                  <h4 className="mb-1 text-base font-semibold text-slate-50">
                    {style.title}
                  </h4>
                  <p className="text-xs text-slate-300">{style.tagLine}</p>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Example goals */}
          <section ref={examplesRef} className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
                Example goals Everleap might suggest
              </h3>
              <span className="text-[11px] text-slate-400 md:text-xs">
                These adapt to your story and your patterns.
              </span>
            </div>

            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 pt-1">
              {exampleGoals.map((goal) => (
                <motion.button
                  key={goal.id}
                  type="button"
                  onClick={() => handleExampleClick(goal.id)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                  className="flex min-w-[260px] max-w-sm flex-col justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4 text-left shadow-[0_10px_35px_rgba(15,23,42,0.9)]"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center rounded-full border border-sky-500/50 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-200">
                      {goal.label}
                    </span>
                    <h4 className="text-base font-semibold text-slate-50">
                      {goal.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {goal.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Bottom nav, same as other main pages */}
      <BottomNav />
    </div>
  );
}
