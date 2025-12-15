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
  SpotlightThemeId,
  GradientLevel,
} from "@/theme/everleapVisuals";

/* ========= Local Theme Toggle ========= */

function ThemeToggle({
  activeId,
  onChange,
}: {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
      {INSIGHTS_THEMES.map((theme) => {
        const active = theme.id === activeId;
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`h-5 w-5 rounded-full transition ${
              active
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

/* ========= Local Gradient Toggle ========= */

function GradientToggle({
  activeLevel,
  onChange,
}: {
  activeLevel: GradientLevel;
  onChange: (l: GradientLevel) => void;
}) {
  const levels: GradientLevel[] = [0, 1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
      {levels.map((level) => {
        const isActive = level === activeLevel;
        const isZero = level === 0;
        return (
          <button
            key={level}
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
          />
        );
      })}
    </div>
  );
}

/* ========= Main Page ========= */

export default function PrivacyPage() {
  /* Theme + Gradient State */
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const dark = isDarkTheme(themeId);

  /* Background */
  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);

  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  /* Card styles */
  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const bodyText = dark ? "text-slate-200/90" : "text-slate-700/95";
  const mutedText = dark ? "text-slate-400/90" : "text-slate-500";

  return (
    <div
      className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`}
      style={bgStyle}
    >
      {/* Ambient Blobs */}
      {gradientLevel > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: gradient.ambientOpacity }}
        >
          <div
            className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
          />
          <div
            className={`absolute top-40 -right-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
          />
        </div>
      )}

      {/* Top-Right Toggles */}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2 md:right-6 md:top-6 md:flex-row">
        <ThemeToggle activeId={themeId} onChange={setThemeId} />
        <GradientToggle activeLevel={gradientLevel} onChange={setGradientLevel} />
      </div>

      {/* Everleap Badge */}
      <BrandBadge />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
        <section className="w-full max-w-3xl">
          <div
            className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
            role="region"
            aria-labelledby="privacy-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={theme.sectionLabelClass}>Everleap · Privacy</p>

                <h1
                  id="privacy-title"
                  className="mt-3 mb-1 text-2xl font-semibold tracking-tight md:text-3xl"
                >
                  Privacy Policy
                </h1>

                <p className={`mb-2 text-sm ${mutedText}`}>
                  Last updated October 4, 2025
                </p>
              </div>

              {/* Sign In Button */}
              <a
                href="/login"
                className={`mt-1 inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition active:scale-[0.98] ${
                  dark
                    ? "border border-slate-600/80 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                    : "border border-slate-300 bg-white/80 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Sign in
              </a>
            </div>

            {/* Legal Content */}
            <article className="mt-3 prose prose-sm prose-invert max-w-none">
              <h2>Overview</h2>
              <p className={bodyText}>
                We respect your privacy. This page summarizes what we collect,
                why we collect it, and how we protect it. Replace this stub with
                your finalized policy text.
              </p>

              <h2>Information We Collect</h2>
              <ul className={bodyText}>
                <li>Account details (name, email) you provide</li>
                <li>Usage data to improve product performance</li>
                <li>Optional responses to questions you choose to answer</li>
              </ul>

              <h2>How We Use Information</h2>
              <ul className={bodyText}>
                <li>Provide and improve Everleap services</li>
                <li>Communicate updates and support</li>
                <li>Maintain safety, security, and integrity</li>
              </ul>

              <h2>Data Sharing</h2>
              <p className={bodyText}>
                We don’t sell your personal information. We may share data with
                trusted processors who help us operate Everleap, bound by
                confidentiality and security obligations.
              </p>

              <h2>Security</h2>
              <p className={bodyText}>
                We use industry-standard safeguards. No system is perfectly
                secure, so please use a strong password and keep it
                confidential.
              </p>

              <h2>Your Choices</h2>
              <ul className={bodyText}>
                <li>Access, update, or delete your data (subject to legal limits)</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <OnboardingFooterNav />
    </div>
  );
}
