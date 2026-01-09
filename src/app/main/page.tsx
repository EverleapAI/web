// src/app/main/page.tsx
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Clock, Smile, Sparkles } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { CoachIntroModal } from "@/components/main/CoachIntroModal";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import type { SpotlightPayload } from "@/types/spotlight";

/* ========= Mock payload (until agent exists) ========= */

const mockSpotlightPayload: SpotlightPayload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  spotlight: {
    id: "story-first-step",
    headline: "Your Story",
    summary: "Help me get to know you so I can guide you better.",
    ctaLabel: "Start my Story",
    ctaHref: "/main/questions",
    progress: {
      label: "Progress toward your Story badge",
      value: 0,
    },
  },
  tinyTasks: [
    {
      id: "check-in",
      label: "1-minute check-in",
      summary: "Quick mood + energy snapshot.",
      minutes: 1,
      href: "/main/questions",
      iconKey: "clock",
    },
    {
      id: "pick-vibe",
      label: "Pick today’s vibe",
      summary: "Choose how you want today to feel.",
      minutes: 2,
      href: "/main/questions",
      iconKey: "smile",
    },
  ],
  explore: [
    {
      id: "skills-explorer",
      title: "Skills Explorer",
      summary: "Play with strengths and interests—no decisions needed.",
      href: "/main/insights",
      accentKey: "violet",
    },
    {
      id: "future-you",
      title: "Future You",
      summary: "Test-drive possible futures and see what feels right.",
      href: "/main/insights",
      accentKey: "amber",
    },
  ],
};

/* ========= Local story progress (shared with Questions) ========= */

const STORY_TOTAL = 30;
const STORY_STORAGE_KEY = "everleap.story.answers.v1";

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function countAnsweredStory(): number {
  if (typeof window === "undefined") return 0;
  const parsed =
    safeJsonParse<Record<string, { answer?: string; skipped?: boolean }>>(
      window.localStorage.getItem(STORY_STORAGE_KEY)
    );
  if (!parsed || typeof parsed !== "object") return 0;

  let n = 0;
  for (const v of Object.values(parsed)) {
    const ans = (v?.answer ?? "").trim();
    const skipped = Boolean(v?.skipped);
    if (!skipped && ans.length > 0) n += 1;
  }
  return n;
}

/* ========= UI helpers ========= */

function iconFromKey(
  key: SpotlightPayload["tinyTasks"][number]["iconKey"]
): ReactNode {
  switch (key) {
    case "clock":
      return <Clock className="h-4 w-4" />;
    case "smile":
      return <Smile className="h-4 w-4" />;
    case "sparkles":
      return <Sparkles className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
}

function accentGradientClass(
  key: SpotlightPayload["explore"][number]["accentKey"]
): string {
  switch (key) {
    case "violet":
      return "from-violet-300 via-fuchsia-300 to-sky-300";
    case "amber":
      return "from-amber-300 via-orange-300 to-rose-300";
    case "sky":
      return "from-sky-300 via-cyan-300 to-indigo-300";
    case "emerald":
      return "from-emerald-300 via-teal-300 to-sky-300";
    default:
      return "from-violet-300 via-fuchsia-300 to-sky-300";
  }
}

type ListCard =
  | {
      kind: "tiny";
      id: string;
      title: string;
      summary: string;
      href: string;
      minutes?: number;
      icon: ReactNode;
    }
  | {
      kind: "explore";
      id: string;
      title: string;
      summary: string;
      href: string;
      accentKey: SpotlightPayload["explore"][number]["accentKey"];
    };

export default function SpotlightPage() {
  // Modal still exists, but never auto-opens
  const [showIntro, setShowIntro] = React.useState(false);

  // Shared visual state (AppChrome)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const payload: SpotlightPayload = mockSpotlightPayload;

  const dark = isDarkTheme(themeId);
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  // Story progress (answered only; skips do not count)
  const [storyAnswered, setStoryAnswered] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setStoryAnswered(countAnsweredStory());
    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORY_STORAGE_KEY) refresh();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const started = storyAnswered > 0;
  const progressIndex = Math.min(Math.max(storyAnswered, 0), STORY_TOTAL - 1);

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";

  const pageTextMutedClass = dark ? "text-slate-300/90" : "text-slate-600";

  // Shared surface class derived from theme primitives
  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";

  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const ctaLabel = started ? "Continue your Story" : "Start my Story";

  // Smaller / calmer CTA once they’ve started
  const ctaClass = started
    ? "bg-amber-300/95 hover:bg-amber-200 shadow-md shadow-amber-300/30"
    : "bg-amber-300 hover:bg-amber-200 shadow-lg shadow-amber-300/40";

  const ctaPad = started ? "py-2.5" : "py-3.5";

  // One vertical list: tiny tasks + explore
  const listCards: ListCard[] = [
    ...payload.tinyTasks.map((t) => ({
      kind: "tiny" as const,
      id: t.id,
      title: t.label,
      summary: t.summary,
      href: t.href,
      minutes: t.minutes,
      icon: iconFromKey(t.iconKey),
    })),
    ...payload.explore.map((c) => ({
      kind: "explore" as const,
      id: c.id,
      title: c.title,
      summary: c.summary,
      href: c.href,
      accentKey: c.accentKey,
    })),
  ];

  return (
    <>
      <CoachIntroModal
        open={showIntro}
        onClose={() => setShowIntro(false)}
        title="Spotlight"
        subtitle="This is your home base. Everleap will surface one good next move, plus a few tiny tasks and deeper explorations that change over time as it learns what matters to you."
        enableTyping
      />

      <AppChrome
        themeId={themeId}
        setThemeId={setThemeId}
        gradientLevel={gradientLevel}
        setGradientLevel={setGradientLevel}
        orbSource="spotlight_orb"
        ambientCap={0.35}
      >
        <div className="relative flex min-h-[100svh] flex-col">
          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
            {/* HERO */}
            <section className="mb-5">
              <div
                className={`relative rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}
              >
                {gradientLevel > 0 && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-transparent via-white/10 to-transparent blur-3xl"
                    style={{ opacity: 0.18 }}
                  />
                )}

                <div className="relative flex flex-col gap-4">
                  {/* Mini label only */}
                  <div
                    className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] ${
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
                    <span>Spotlight</span>
                  </div>

                  <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {payload.spotlight.headline}
                    </h1>
                    <p className={`mt-2 text-sm ${pageTextMutedClass}`}>
                      {payload.spotlight.summary}
                    </p>
                  </div>

                  {/* Progress: dots colored up to current */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className={`${sectionLabelClass} opacity-90`}>
                        Progress toward your Story badge
                      </div>
                      <div className="text-xs opacity-70">
                        {storyAnswered}/{STORY_TOTAL}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5">
                      {Array.from({ length: STORY_TOTAL }).map((_, i) => {
                        const filled = i <= progressIndex && storyAnswered > 0;
                        return (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full transition ${
                              filled ? "bg-sky-300" : "bg-white/10"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-3 flex">
                    <Link
                      href={payload.spotlight.ctaHref}
                      className={`inline-flex w-full items-center justify-center rounded-full px-5 text-sm font-semibold text-slate-950 transition ${ctaPad} ${ctaClass}`}
                    >
                      {ctaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* TINY TASKS + EXPLORATIONS (VERTICAL LIST) */}
            {listCards.length > 0 && (
              <section className="mt-2">
                <div className="mb-3">
                  <div className={`${sectionLabelClass} mb-1`}>
                    Tiny tasks + explorations
                  </div>
                  <div className="text-sm opacity-70">
                    Scroll for quick wins and deeper dives.
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:gap-4">
                  {listCards.map((c) => (
                    <Link
                      key={`${c.kind}_${c.id}`}
                      href={c.href}
                      className={`rounded-3xl border px-5 py-4 transition hover:translate-y-[-1px] ${
                        theme.cardBgClass
                      } ${theme.cardBorderClass} shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl`}
                    >
                      {c.kind === "explore" ? (
                        <div
                          className={`mb-2 h-1.5 w-16 rounded-full bg-gradient-to-r ${accentGradientClass(
                            c.accentKey
                          )}`}
                        />
                      ) : (
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
                                dark
                                  ? "bg-slate-900/90 text-slate-50"
                                  : "bg-slate-900/5 text-slate-800"
                              }`}
                            >
                              {c.icon}
                            </div>
                            <div className={`${sectionLabelClass} opacity-90`}>
                              Tiny task
                            </div>
                          </div>
                          {typeof c.minutes === "number" && (
                            <div className="text-[0.7rem] uppercase tracking-[0.16em] opacity-70">
                              {c.minutes}m
                            </div>
                          )}
                        </div>
                      )}

                      <h3 className="text-base font-semibold">{c.title}</h3>
                      <p className={`mt-2 text-sm ${pageTextMutedClass}`}>
                        {c.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>

          <BottomNav />
        </div>
      </AppChrome>
    </>
  );
}
