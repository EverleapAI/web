// src/app/main/page.tsx
"use client";

import {
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { Sparkles, Clock, Smile } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { CoachIntroModal } from "@/components/main/CoachIntroModal";

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

type SpotlightThemeId =
  | "nightDusk"
  | "berrySoft"
  | "forestSoft"
  | "warmSand"
  | "coolNotebook"
  | "cleanPaper";

type GradientLevel = 0 | 1 | 2 | 3 | 4 | 5;

type SpotlightTheme = {
  id: SpotlightThemeId;
  label: string;
  pageBgBaseClass: string;
  pageTextMutedClass: string;
  sectionLabelClass: string;
  ambientTopLeftClass: string;
  ambientRightClass: string;
  heroCardBgClass: string;
  heroCardBorderClass: string;
  heroMeterTrackClass: string;
  tinyCardBgClass: string;
  tinyCardBorderClass: string;
  deepCardBgClass: string;
  deepCardBorderClass: string;
  primaryButtonClass: string;
};

type GradientConfig = {
  level: GradientLevel;
  ambientOpacity: number;
  heroGlowOpacity: number;
};

/* ========= Data ========= */

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

/* ========= Theme configs (1 dark, 5 light pastels/earth tones) ========= */

const SPOTLIGHT_THEMES: SpotlightTheme[] = [
  // 1. Night Dusk – existing dark navy
  {
    id: "nightDusk",
    label: "Night",
    pageBgBaseClass: "bg-[#020617] text-slate-50",
    pageTextMutedClass: "text-slate-300/90",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400",
    ambientTopLeftClass: "bg-indigo-400",
    ambientRightClass: "bg-sky-400",
    heroCardBgClass: "bg-slate-950/85",
    heroCardBorderClass: "border-slate-700/75",
    heroMeterTrackClass: "bg-slate-900/70",
    tinyCardBgClass: "bg-slate-950/85",
    tinyCardBorderClass: "border-slate-700/75",
    deepCardBgClass: "bg-slate-950/85",
    deepCardBorderClass: "border-slate-800/80",
    primaryButtonClass:
      "inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/40 transition hover:bg-amber-200",
  },

  // 2. Berry Soft – light lavender / berry
  {
    id: "berrySoft",
    label: "Berry",
    pageBgBaseClass: "bg-[#f7ecff] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-violet-500",
    ambientTopLeftClass: "bg-fuchsia-200",
    ambientRightClass: "bg-violet-200",
    heroCardBgClass: "bg-white",
    heroCardBorderClass: "border-fuchsia-100",
    heroMeterTrackClass: "bg-fuchsia-100",
    tinyCardBgClass: "bg-white",
    tinyCardBorderClass: "border-fuchsia-100",
    deepCardBgClass: "bg-white",
    deepCardBorderClass: "border-fuchsia-100",
    primaryButtonClass:
      "inline-flex items-center justify-center rounded-full bg-fuchsia-300 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-fuchsia-300/40 transition hover:bg-fuchsia-200",
  },

  // 3. Forest Soft – light mint / sage
  {
    id: "forestSoft",
    label: "Teal",
    pageBgBaseClass: "bg-[#e7f5f1] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald-500",
    ambientTopLeftClass: "bg-emerald-200",
    ambientRightClass: "bg-teal-200",
    heroCardBgClass: "bg-white",
    heroCardBorderClass: "border-emerald-100",
    heroMeterTrackClass: "bg-emerald-100",
    tinyCardBgClass: "bg-white",
    tinyCardBorderClass: "border-emerald-100",
    deepCardBgClass: "bg-white",
    deepCardBorderClass: "border-emerald-100",
    primaryButtonClass:
      "inline-flex items-center justify-center rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-emerald-300/40 transition hover:bg-emerald-200",
  },

  // 4. Warm Sand – mid-light warm neutral
  {
    id: "warmSand",
    label: "Sand",
    pageBgBaseClass: "bg-[#f5ebe0] text-stone-900",
    pageTextMutedClass: "text-stone-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-stone-500",
    ambientTopLeftClass: "bg-amber-200",
    ambientRightClass: "bg-orange-200",
    heroCardBgClass: "bg-[#fdf7ef]",
    heroCardBorderClass: "border-amber-200",
    heroMeterTrackClass: "bg-amber-100",
    tinyCardBgClass: "bg-[#fdf7ef]",
    tinyCardBorderClass: "border-amber-100",
    deepCardBgClass: "bg-[#fdf7ef]",
    deepCardBorderClass: "border-amber-100",
    primaryButtonClass:
      "inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-md shadow-amber-300/40 transition hover:bg-amber-200",
  },

  // 5. Cool Notebook – light cool blue-grey
  {
    id: "coolNotebook",
    label: "Cool",
    pageBgBaseClass: "bg-[#e5f0ff] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500",
    ambientTopLeftClass: "bg-sky-200",
    ambientRightClass: "bg-indigo-200",
    heroCardBgClass: "bg-white",
    heroCardBorderClass: "border-slate-200",
    heroMeterTrackClass: "bg-slate-200",
    tinyCardBgClass: "bg-white",
    tinyCardBorderClass: "border-slate-200",
    deepCardBgClass: "bg-white",
    deepCardBorderClass: "border-slate-200",
    primaryButtonClass:
      "inline-flex items-center justify-center rounded-full bg-sky-300 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-sky-300/40 transition hover:bg-sky-200",
  },

  // 6. Clean Paper – almost white, very neutral
  {
    id: "cleanPaper",
    label: "Paper",
    pageBgBaseClass: "bg-[#f9fafb] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500",
    ambientTopLeftClass: "bg-slate-200",
    ambientRightClass: "bg-amber-100",
    heroCardBgClass: "bg-white",
    heroCardBorderClass: "border-slate-200",
    heroMeterTrackClass: "bg-slate-200",
    tinyCardBgClass: "bg-white",
    tinyCardBorderClass: "border-slate-200",
    deepCardBgClass: "bg-white",
    deepCardBorderClass: "border-slate-200",
    primaryButtonClass:
      "inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-amber-300/40 transition hover:bg-amber-200",
  },
];

/* ========= Gradient strength ========= */

const GRADIENT_CONFIGS: GradientConfig[] = [
  { level: 0, ambientOpacity: 0, heroGlowOpacity: 0 },
  { level: 1, ambientOpacity: 0.1, heroGlowOpacity: 0.06 },
  { level: 2, ambientOpacity: 0.18, heroGlowOpacity: 0.12 },
  { level: 3, ambientOpacity: 0.3, heroGlowOpacity: 0.2 },
  { level: 4, ambientOpacity: 0.45, heroGlowOpacity: 0.32 },
  { level: 5, ambientOpacity: 0.6, heroGlowOpacity: 0.42 },
];

/* ========= Background image per theme ========= */

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

/* ========= Utility ========= */

function openGuide() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "spotlight_orb" },
    })
  );
}

/* ========= Toggles ========= */

type ThemeToggleProps = {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
};

function ThemeToggle({ activeId, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm md:bg-slate-900/70">
      {SPOTLIGHT_THEMES.map((theme) => {
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

function GradientToggle({
  activeLevel,
  onChange,
}: GradientToggleProps) {
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

/* ========= Main page ========= */

export default function SpotlightPage() {
  const [showIntro, setShowIntro] = useState(false);
  const [themeId, setThemeId] =
    useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    useState<GradientLevel>(3);

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const handleIntroClose = () => setShowIntro(false);

  const theme =
    SPOTLIGHT_THEMES.find((t) => t.id === themeId) ??
    SPOTLIGHT_THEMES[0];

  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const pageBgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(theme.id);

  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  const isDarkTheme = theme.id === "nightDusk";

  return (
    <>
      <CoachIntroModal
        open={showIntro}
        onClose={handleIntroClose}
        subtitle="This Spotlight page is your launchpad in Everleap. Here I’ll surface one good starting move—like beginning your Story—plus tiny tasks and deeper explorations that will change over time as I learn more about what matters to you."
        enableTyping
      />

      <div
        className={`min-h-screen ${theme.pageBgBaseClass}`}
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

          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
            {/* Header */}
            <header className="mb-4 flex items-start justify-between gap-4 md:mb-5">
              <div>
                <div className={theme.sectionLabelClass}>
                  Spotlight
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                  Let&apos;s start where you are.
                </h1>
                <p
                  className={`mt-2 max-w-xl text-sm ${theme.pageTextMutedClass}`}
                >
                  Choose one step that matches your energy. You can
                  always come back later.
                </p>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <ThemeToggle
                  activeId={themeId}
                  onChange={setThemeId}
                />
                <GradientToggle
                  activeLevel={gradientLevel}
                  onChange={setGradientLevel}
                />
                <button
                  type="button"
                  onClick={openGuide}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-fuchsia-400 to-amber-300 shadow-lg shadow-sky-400/40 transition-transform duration-200 hover:scale-110"
                >
                  <span className="absolute inset-0 rounded-full bg-sky-400/30 blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-slate-50 text-lg">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </header>

            {/* Hero card */}
            <section className="mb-6">
              <div
                className={`relative rounded-[32px] border px-5 py-5 shadow-[0_28px_80px_rgba(0,0,0,0.75)] sm:px-7 sm:py-6 ${theme.heroCardBgClass} ${theme.heroCardBorderClass}`}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-transparent via-white/10 to-transparent blur-3xl"
                  style={{ opacity: gradient.heroGlowOpacity }}
                />

                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-xl">
                    <div
                      className={`mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                        isDarkTheme
                          ? "text-slate-100/90"
                          : "text-amber-700/90"
                      }`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] ${
                          isDarkTheme
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
                      Answer a few quick questions so I&apos;m not
                      guessing who you are. You can pause anytime and
                      come back.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.7rem] opacity-80">
                        <span className="font-medium uppercase tracking-[0.16em]">
                          Setup · 0–20% complete
                        </span>
                      </div>
                      <div
                        className={`h-1.5 w-full overflow-hidden rounded-full ${theme.heroMeterTrackClass}`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-300 to-sky-300"
                          style={{
                            width: `${Math.min(
                              storyPercent || 8,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch gap-2 md:w-52">
                    <Link href="/main/questions" className={theme.primaryButtonClass}>
                      Start my Story
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Tiny tasks */}
            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <div className={theme.sectionLabelClass}>
                  Tiny tasks
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {tinyTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={task.href}
                    className={`flex flex-col rounded-3xl border px-4 py-4 shadow-[0_16px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl transition ${theme.tinyCardBgClass} ${theme.tinyCardBorderClass}`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
                            isDarkTheme
                              ? "bg-slate-900/90 text-slate-50"
                              : "bg-slate-900/5 text-slate-800"
                          }`}
                        >
                          {task.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] opacity-70">
                            {task.tag}
                          </span>
                          <span className="text-sm font-semibold">
                            {task.label}
                          </span>
                        </div>
                      </div>
                      <span className="text-[0.7rem] opacity-70">
                        {task.minutes}
                      </span>
                    </div>
                    <p className="mt-1 text-xs opacity-85">
                      {task.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Deep explorations */}
            <section className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className={theme.sectionLabelClass}>
                  Deep explorations
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {deepCards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.href}
                    className={`flex flex-col rounded-3xl border px-4 py-4 shadow-[0_20px_55px_rgba(0,0,0,0.7)] ${theme.deepCardBgClass} ${theme.deepCardBorderClass}`}
                  >
                    <div
                      className={`mb-2 h-1.5 w-16 rounded-full bg-gradient-to-r ${card.gradientClass}`}
                    />
                    <h3 className="text-sm font-semibold">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs opacity-85">
                      {card.summary}
                    </p>
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
