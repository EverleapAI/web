// src/app/main/page.tsx
"use client";

import * as React from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Clock, Smile, Sparkles, SlidersHorizontal } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { CoachIntroModal } from "@/components/main/CoachIntroModal";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

import { ThemeToggle, GradientToggle } from "@/components/site/VisualToggles";

/* ========= Types ========= */

type TinyTask = {
  id: string;
  label: string;
  tag: string;
  minutes: string;
  summary: string;
  href: string;
  icon: ReactNode;
};

type DeepCard = {
  id: string;
  title: string;
  summary: string;
  href: string;
  gradientClass: string;
};

/* ========= Mock data (until agent exists) ========= */

const storyCompletion = 0;
const storyPercent = Math.round(storyCompletion * 100);

const tinyTasks: TinyTask[] = [
  {
    id: "check-in",
    label: "1-minute check-in",
    tag: "Now",
    minutes: "1 min",
    summary: "Quick mood + energy snapshot.",
    href: "/main/questions",
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
];

const deepCards: DeepCard[] = [
  {
    id: "skills-explorer",
    title: "Skills Explorer",
    summary: "Play with strengths and interests—no decisions needed.",
    href: "/main/carousel",
    gradientClass: "from-violet-300 via-fuchsia-300 to-sky-300",
  },
  {
    id: "future-you",
    title: "Future You",
    summary: "Test-drive possible futures and see what feels right.",
    href: "/main/carousel",
    gradientClass: "from-amber-300 via-orange-300 to-rose-300",
  },
];

export default function SpotlightPage() {
  // Modal remains available, but never auto-opens
  const [showIntro, setShowIntro] = React.useState(false);

  // Shared visual system
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const dark = isDarkTheme(themeId);

  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  // Calm the ambient visuals
  const ambientOpacity = Math.min(gradient.ambientOpacity, 0.35);

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";

  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";

  const pageTextMutedClass = dark ? "text-slate-300/90" : "text-slate-600";

  // Appearance toggles hidden behind one button
  const [showAppearance, setShowAppearance] = React.useState(false);

  return (
    <>
      <CoachIntroModal
        open={showIntro}
        onClose={() => setShowIntro(false)}
        title="Spotlight"
        subtitle="This is your home base. Everleap will surface one good next move, plus a few tiny tasks and deeper explorations that change over time as it learns what matters to you."
        enableTyping
      />

      <div
        className={`relative min-h-[100svh] ${theme.pageBgBaseClass}`}
        style={bgStyle}
      >
        {/* Ambient blobs */}
        {gradientLevel > 0 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: ambientOpacity }}
          >
            <div
              className={`absolute -top-28 -left-20 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute top-40 -right-8 h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>
        )}

        {/* Top-right controls */}
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 md:right-6 md:top-6">
          <button
            type="button"
            onClick={() => setShowAppearance((v) => !v)}
            className="
              inline-flex h-11 w-11 items-center justify-center rounded-full
              border border-slate-600/60 bg-slate-950/70 text-slate-200
              shadow-[0_10px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl
              hover:text-slate-50 transition
            "
            aria-label="Appearance"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          <AiGuideOrb minimal source="spotlight_orb" />
        </div>

        {showAppearance && (
          <div className="fixed right-4 top-[4.2rem] z-50 flex flex-col gap-2 md:right-6 md:top-[5.2rem]">
            <ThemeToggle activeId={themeId} onChange={setThemeId} />
            <GradientToggle
              activeLevel={gradientLevel}
              onChange={setGradientLevel}
            />
          </div>
        )}

        <div className="relative flex min-h-[100svh] flex-col">
          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
            {/* Header */}
            <header className="mb-4 md:mb-5">
              <div className={sectionLabelClass}>Spotlight</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                Let&apos;s start where you are.
              </h1>
              <p className={`mt-2 max-w-xl text-sm ${pageTextMutedClass}`}>
                One good step. No pressure. You can always come back later.
              </p>
            </header>

            {/* Hero card */}
            <section className="mb-6">
              <div
                className={`relative rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}
              >
                {gradientLevel > 0 && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-transparent via-white/10 to-transparent blur-3xl"
                    style={{ opacity: 0.18 }}
                  />
                )}

                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-xl">
                    <div
                      className={`mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                        dark ? "text-slate-100/90" : "text-amber-700/90"
                      }`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] ${
                          dark
                            ? "bg-amber-200/90 text-slate-950"
                            : "bg-amber-400 text-slate-900"
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                      </span>
                      <span>Today&apos;s spotlight</span>
                    </div>

                    <h2 className="mb-1 text-xl font-semibold sm:text-2xl">
                      First step: your Story
                    </h2>
                    <p className="text-sm opacity-90">
                      Answer a few quick questions so I&apos;m not guessing who you are.
                      You can pause anytime and come back.
                    </p>

                    <div className="mt-4 space-y-2">
                      <span className="text-[0.7rem] uppercase tracking-[0.16em] opacity-80">
                        Setup · 0–20% complete
                      </span>

                      <div
                        className={`h-1.5 w-full overflow-hidden rounded-full ${
                          dark ? "bg-slate-900/70" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-300 to-sky-300"
                          style={{ width: `${Math.min(storyPercent || 8, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex md:w-52">
                    <Link
                      href="/main/questions"
                      className="
                        inline-flex w-full items-center justify-center rounded-full
                        bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950
                        shadow-lg shadow-amber-300/40 transition hover:bg-amber-200
                      "
                    >
                      Start my Story
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Tiny tasks */}
            <section className="mb-6">
              <div className="mb-2">
                <div className={sectionLabelClass}>Tiny tasks</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {tinyTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={task.href}
                    className={`flex flex-col rounded-3xl border px-4 py-4 ${theme.cardBgClass} ${theme.cardBorderClass} shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
                            dark
                              ? "bg-slate-900/90 text-slate-50"
                              : "bg-slate-900/5 text-slate-800"
                          }`}
                        >
                          {task.icon}
                        </div>
                        <div>
                          <div className="text-[0.7rem] uppercase tracking-[0.16em] opacity-70">
                            {task.tag}
                          </div>
                          <div className="text-sm font-semibold">
                            {task.label}
                          </div>
                        </div>
                      </div>
                      <span className="text-[0.7rem] opacity-70">
                        {task.minutes}
                      </span>
                    </div>
                    <p className="text-xs opacity-85">{task.summary}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Explore */}
            <section className="mb-4">
              <div className="mb-2">
                <div className={sectionLabelClass}>Explore</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {deepCards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.href}
                    className={`flex flex-col rounded-3xl border px-4 py-4 ${theme.cardBgClass} ${theme.cardBorderClass} shadow-[0_12px_36px_rgba(0,0,0,0.38)] backdrop-blur-xl`}
                  >
                    <div
                      className={`mb-2 h-1.5 w-16 rounded-full bg-gradient-to-r ${card.gradientClass}`}
                    />
                    <h3 className="text-sm font-semibold">{card.title}</h3>
                    <p className="mt-2 text-xs opacity-85">{card.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          <BottomNav />
        </div>
      </div>
    </>
  );
}
