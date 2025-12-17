// src/app/consent/page.tsx  (or wherever your consent page lives)
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";

import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
} from "@/theme/everleapVisuals";

/* ========= Page ========= */

export default function ConsentPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

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

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const consentCardBg = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const bodyTextClass = dark ? "text-slate-200/90" : "text-slate-700/95";
  const microTextClass = dark ? "text-slate-300/70" : "text-slate-600/70";

  const bulletDot = dark ? "bg-sky-400" : "bg-sky-600";

  // NEW: “Under 18” state + link
  const [under18, setUnder18] = React.useState(false);

  const handleAgree = () => {
    // (optional) stash consent info for later use
    try {
      localStorage.setItem(
        "everleap_consent_v1",
        JSON.stringify({
          agreedAt: new Date().toISOString(),
          under18,
          themeId,
          gradientLevel,
        })
      );
    } catch {}

    window.location.assign("/onboarding");
  };

  const handleNotNow = () => {
    window.location.assign("/");
  };

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="consent_orb"
      ambientCap={0.35}
    >
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

        {/* Brand badge */}
        <BrandBadge />

        {/* CENTERED: headline + card as ONE unit */}
        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          {/* The key fix: wrap header + card together and center that wrapper */}
          <div className="w-full max-w-xl -translate-y-6">
            {/* headline (now visually part of the centered stack) */}
            <div className="mb-5">
              <p className={theme.sectionLabelClass}>Everleap · Before we start</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                To really help you, we need your permission.
              </h1>
              <p className={`mt-2 max-w-2xl text-sm md:text-[0.95rem] ${bodyTextClass}`}>
                Everleap learns from your answers so it can give you better insights and ideas.
                Big dreams start with small conversations — let&apos;s begin.
              </p>
            </div>

            {/* consent card */}
            <section className="w-full">
              <div
                className={`relative w-full overflow-hidden rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${consentCardBg}`}
              >
                {/* subtle micro-accent (very mild pop) */}
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className={`absolute -top-10 -left-10 h-44 w-44 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${
                      dark
                        ? "from-sky-400 via-cyan-300 to-indigo-400"
                        : "from-sky-300 via-cyan-200 to-indigo-300"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-14 -right-10 h-52 w-52 rounded-full blur-3xl opacity-15 bg-gradient-to-br ${
                      dark
                        ? "from-fuchsia-400 via-violet-400 to-sky-400"
                        : "from-fuchsia-200 via-violet-200 to-sky-200"
                    }`}
                  />
                </div>

                <div className="relative">
                  {/* top row inside card: label + under-18 toggle */}
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                        dark
                          ? "border-white/10 bg-white/5 text-slate-100"
                          : "border-slate-200 bg-white/80 text-slate-800"
                      }`}
                    >
                      Consent
                    </div>

                    <label
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        dark
                          ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                          : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                      }`}
                      title="If you’re under 18, we’ll show parent/guardian info."
                    >
                      <span
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition ${
                          under18
                            ? dark
                              ? "bg-sky-400"
                              : "bg-sky-500"
                            : dark
                            ? "bg-white/15"
                            : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 translate-x-0.5 rounded-full bg-white shadow transition ${
                            under18 ? "translate-x-3.5" : ""
                          }`}
                        />
                      </span>
                      <span>Under 18</span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={under18}
                        onChange={(e) => setUnder18(e.target.checked)}
                        aria-label="Under 18"
                      />
                    </label>
                  </div>

                  {/* bullets */}
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span
                        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${bulletDot}`}
                      />
                      <span className={bodyTextClass}>
                        We store your name and contact information to keep your account connected to you.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span
                        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${bulletDot}`}
                      />
                      <span className={bodyTextClass}>
                        We use your responses to spot patterns and generate personalized insights and recommendations.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span
                        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${bulletDot}`}
                      />
                      <span className={bodyTextClass}>
                        We keep your data private and protect it as described in our{" "}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 hover:text-sky-400"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </li>
                  </ul>

                  {/* under-18 extra info */}
                  {under18 ? (
                    <div
                      className={`mt-4 rounded-2xl border px-4 py-3 text-xs ${
                        dark
                          ? "border-white/10 bg-white/5 text-slate-200/90"
                          : "border-slate-200 bg-white/75 text-slate-700"
                      }`}
                    >
                      <div className="font-semibold">If you’re under 18</div>
                      <div className={`mt-1 ${microTextClass}`}>
                        A parent/guardian may need to review how Everleap uses data.
                      </div>
                      <a
                        href="/parent-info"
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold underline underline-offset-2 ${
                          dark ? "text-sky-300 hover:text-sky-200" : "text-sky-600 hover:text-sky-500"
                        }`}
                      >
                        Parent / guardian info
                        <span aria-hidden>↗</span>
                      </a>
                    </div>
                  ) : null}

                  {/* buttons */}
                  <div className="mt-6 space-y-3">
                    <button
                      type="button"
                      onClick={handleAgree}
                      className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition active:scale-[0.99] ${
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
                      className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition active:scale-[0.99] ${
                        dark
                          ? "border border-slate-600/70 bg-slate-900/70 text-slate-200 hover:bg-slate-900"
                          : "border border-slate-300/70 bg-white/70 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Not now
                    </button>
                  </div>

                  <p className={`mt-3 text-[0.7rem] ${microTextClass}`}>
                    You can update your consent settings later.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

        <OnboardingFooterNav />
      </div>
    </AppChrome>
  );
}
