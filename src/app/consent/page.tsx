"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

/* ========= Local toggles (reuseable pattern) ========= */

type ThemeToggleProps = {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
};

function ThemeToggle({ activeId, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
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
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
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
            aria-label={isZero ? "No gradient" : `Gradient level ${level}`}
          />
        );
      })}
    </div>
  );
}

/* ========= Main page ========= */

export default function ConsentPage() {
  // local state for now (no global store yet)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    React.useState<GradientLevel>(3);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const pageBgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  const dark = isDarkTheme(themeId);
  const bulletColor = dark ? "bg-sky-400" : "bg-sky-600";

  const consentCardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const consentCardBg = `${theme.cardBgClass} ${theme.cardBorderClass} ${consentCardShadow} backdrop-blur-xl`;

  const bodyTextClass = dark
    ? "text-slate-200/90"
    : "text-slate-700/95";

  const handleAgree = () => {
    // For now just navigate into the onboarding flow
    window.location.assign("/onboarding");
  };

  const handleNotNow = () => {
    // Bounce back to the public landing page
    window.location.assign("/");
  };

  return (
    <div
      className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`}
      style={pageBgStyle}
    >
      {/* Ambient blobs */}
      {gradientLevel > 0 && (
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
      )}

      {/* Toggles top-right */}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2 md:right-6 md:top-6 md:flex-row">
        <ThemeToggle activeId={themeId} onChange={setThemeId} />
        <GradientToggle
          activeLevel={gradientLevel}
          onChange={setGradientLevel}
        />
      </div>

      {/* Brand badge */}
      <BrandBadge />

      {/* Centered consent card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-8 md:pt-10">
        <section className="w-full max-w-lg">
          <div className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${consentCardBg}`}>
            <p className={theme.sectionLabelClass}>
              Everleap · Before we start
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              To really help you, we need your permission.
            </h1>

            <p className={`mt-3 text-sm md:text-[0.95rem] ${bodyTextClass}`}>
              Everleap learns from your answers so it can give you better
              insights and ideas. Big dreams start with small conversations.
              Let&apos;s begin.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex gap-2">
                <span
                  className={`mt-[6px] h-1.5 w-1.5 rounded-full ${bulletColor}`}
                />
                <span className={bodyTextClass}>
                  We store your name and contact information to keep your
                  account connected to you.
                </span>
              </li>
              <li className="flex gap-2">
                <span
                  className={`mt-[6px] h-1.5 w-1.5 rounded-full ${bulletColor}`}
                />
                <span className={bodyTextClass}>
                  We use your responses to spot patterns and generate
                  personalized insights and recommendations.
                </span>
              </li>
              <li className="flex gap-2">
                <span
                  className={`mt-[6px] h-1.5 w-1.5 rounded-full ${bulletColor}`}
                />
                <span className={bodyTextClass}>
                  We keep your data private and protect it as described in our{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-sky-500"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleAgree}
                className={`inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm active:scale-[0.99] transition ${
                  dark
                    ? "border border-sky-400/80 bg-sky-500/90 text-white hover:bg-sky-400 shadow-sky-500/40"
                    : "border border-sky-500/70 bg-sky-500 text-white hover:bg-sky-400"
                }`}
              >
                I agree and want to continue
              </button>

              <button
                type="button"
                onClick={handleNotNow}
                className={`inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium active:scale-[0.99] transition ${
                  dark
                    ? "border border-slate-600/70 bg-slate-900/70 text-slate-200 hover:bg-slate-900"
                    : "border border-slate-300/70 bg-white/70 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Not now
              </button>
            </div>

            <p className={`mt-3 text-[0.7rem] ${bodyTextClass}`}>
              You can update your consent settings later.
            </p>
          </div>
        </section>
      </main>

      <OnboardingFooterNav />
    </div>
  );
}
