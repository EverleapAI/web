// src/app/main/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles, Clock, MessageCircle, Smile, Trophy } from "lucide-react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";

type TinyTask = {
  id: string;
  label: string;
  tag: string;
  minutes: string;
  summary: string;
  href: string;
  icon: React.ReactNode;
};

type DeepCard = {
  id: string;
  title: string;
  summary: string;
  href: string;
  gradientClass: string;
};

const userName = "Tom";

// TODO: replace with real story completion from backend once wired up
const storyCompletion = 0; // 0 to 1
const isStorySetupIncomplete = storyCompletion < 0.2;

const baseTinyTasks: TinyTask[] = [
  {
    id: "story-3-questions",
    label: "Answer 3 questions",
    tag: "Story",
    minutes: "3 min",
    summary: "Add a few more pieces to how I see you.",
    href: "/main/questions",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: "check-in",
    label: "1-minute check-in",
    tag: "Now",
    minutes: "1 min",
    summary: "Quick mood + energy snapshot.",
    href: "/main/questions", // placeholder – later this may be its own flow
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "pick-vibe",
    label: "Pick today’s vibe",
    tag: "Mood",
    minutes: "2 min",
    summary: "Choose how you want today to feel.",
    href: "/main/questions",
    icon: <Smile className="h-4 w-4" />,
  },
  {
    id: "name-win",
    label: "Name one win",
    tag: "Today",
    minutes: "2 min",
    summary: "Capture one small thing that went right.",
    href: "/main/questions",
    icon: <Trophy className="h-4 w-4" />,
  },
];

const deepCards: DeepCard[] = [
  {
    id: "skills-explorer",
    title: "Skills Explorer",
    summary: "Tap to play with ideas, not make permanent decisions.",
    href: "/main/carousel",
    gradientClass: "from-violet-500 via-fuchsia-500 to-sky-500",
  },
  {
    id: "future-you",
    title: "Future You",
    summary: "Test-drive possible futures without locking anything in.",
    href: "/main/carousel",
    gradientClass: "from-amber-400 via-orange-500 to-rose-500",
  },
  {
    id: "people-patterns",
    title: "People Patterns",
    summary: "Spot the dynamics that boost or drain your energy.",
    href: "/main/carousel",
    gradientClass: "from-cyan-400 via-sky-500 to-indigo-500",
  },
];

export default function SpotlightPage() {
  // Ensure Story-related task stays first while setup is incomplete
  const tinyTasks = useMemo(() => {
    if (!isStorySetupIncomplete) return baseTinyTasks;
    const storyTask = baseTinyTasks.find((t) => t.id === "story-3-questions");
    const others = baseTinyTasks.filter((t) => t.id !== "story-3-questions");
    return storyTask ? [storyTask, ...others] : baseTinyTasks;
  }, []);

  const storyPercent = Math.round(storyCompletion * 100);

  const openGuide = (source: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("everleap-open-ai-guide", {
          detail: {
            source,
          },
        })
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.16), transparent 55%)",
      }}
    >
      <div className="relative flex min-h-screen flex-col">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-28 -left-20 h-64 w-64 rounded-full bg-fuchsia-500 blur-3xl" />
          <div className="absolute top-40 right-[-32px] h-72 w-72 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-8">
          {/* Header */}
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Spotlight
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Let&apos;s start where you are.
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300/90">
                Your guide will help you choose the next step that actually fits
                your energy today.
              </p>
            </div>

            <div className="hidden md:flex">
              <AiGuideOrb
                subline="Ask Everleap what to focus on this session."
                source="spotlight_header_orb"
              />
            </div>
          </header>

          {/* Spotlight hero card */}
          <section className="mb-6">
            <div className="relative rounded-[32px] border border-slate-700/80 bg-slate-950/80 px-5 py-5 shadow-[0_28px_80px_rgba(0,0,0,0.95)] sm:px-7 sm:py-6">
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-fuchsia-500/40 via-orange-400/35 to-cyan-400/35 blur-3xl opacity-70" />

              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200/90 text-[0.7rem] text-slate-950">
                      <Sparkles className="h-3 w-3" />
                    </span>
                    <span>Today&apos;s Spotlight</span>
                  </div>
                  <h2 className="mb-1 text-xl font-semibold text-slate-50 sm:text-2xl">
                    First step: your Story
                  </h2>
                  <p className="text-sm text-slate-100/90">
                    Answer a few quick questions so I&apos;m not guessing who
                    you are. You can stop anytime and come back later.
                  </p>

                  {/* Story setup meter */}
                  <div className="mt-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-slate-200">
                      <span className="font-medium uppercase tracking-[0.16em] text-slate-300">
                        Setup · 0–20% complete
                      </span>
                      <span className="text-slate-200/90">
                        About 30 questions total
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-300 to-sky-300"
                        style={{
                          width: `${Math.min(storyPercent || 8, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 md:w-52">
                  <Link
                    href="/main/questions"
                    className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/40 transition hover:bg-amber-200"
                  >
                    Start my Story
                  </Link>
                  <button
                    type="button"
                    onClick={() => openGuide("spotlight_hero_link")}
                    className="text-[0.75rem] text-slate-200 underline-offset-4 hover:underline"
                  >
                    Not sure where to start? Ask Everleap.
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Tiny tasks – action cards */}
          <section className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tiny tasks
              </div>
              <div className="text-[0.7rem] text-slate-400">
                Tap one. You can always come back.
              </div>
            </div>

            <div className="-mx-4 pl-4">
              <div className="flex gap-3 overflow-x-auto pb-2 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {tinyTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={task.href}
                    className="flex w-64 flex-shrink-0 flex-col rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-sky-400/60 hover:bg-slate-900/80"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900/90 text-slate-50">
                          {task.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {task.tag}
                          </span>
                          <span className="text-sm font-semibold text-slate-50">
                            {task.label}
                          </span>
                        </div>
                      </div>
                      <span className="text-[0.7rem] text-slate-300">
                        {task.minutes}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-200/90">
                      {task.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Deep explorations – smaller swipeable cards */}
          <section className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Deep explorations
              </div>
              <div className="text-[0.7rem] text-slate-400">
                Swipe to browse. Totally optional.
              </div>
            </div>

            <div className="-mx-4 pl-4">
              <div className="flex gap-3 overflow-x-auto pb-2 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {deepCards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.href}
                    className="flex w-64 flex-shrink-0 flex-col rounded-3xl border border-slate-800/80 bg-slate-950/80 px-4 py-4 shadow-[0_20px_55px_rgba(0,0,0,0.95)]"
                  >
                    <div
                      className={`mb-2 h-1.5 w-16 rounded-full bg-gradient-to-r ${card.gradientClass}`}
                    />
                    <h3 className="text-sm font-semibold text-slate-50">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-200/90">
                      {card.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Streak / momentum */}
          <section className="mt-auto">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Streak &amp; progress
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-50">
                    You&apos;re building momentum
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    Tiny moves add up. Even one small action today keeps your
                    story moving.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80">
                    <div className="absolute inset-1.5 rounded-full bg-slate-950" />
                    <div className="relative text-xs font-semibold text-slate-50">
                      72%
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[72%] rounded-full bg-sky-400" />
                    </div>
                    <div className="mt-1 text-[0.7rem] text-slate-400">
                      This week&apos;s tiny moves
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom nav (shared) */}
        <BottomNav />
      </div>
    </div>
  );
}
