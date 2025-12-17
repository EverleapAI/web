// src/app/contact/page.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { Mail, Send } from "lucide-react";

import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

export default function ContactPage() {
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

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const bodyText = dark ? "text-slate-200/90" : "text-slate-700/95";
  const mutedText = dark ? "text-slate-300/70" : "text-slate-600/70";
  const sectionTitleClass = dark ? "text-slate-50" : "text-slate-900";

  const inputBase =
    "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition";
  const inputTheme = dark
    ? "border-slate-700/60 bg-slate-950/40 text-slate-100 placeholder:text-slate-400/70 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-400/15"
    : "border-slate-200/80 bg-white/60 text-slate-900 placeholder:text-slate-500/70 focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/15";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // intentionally not wired yet
  };

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="contact_orb"
      ambientCap={0.35}
    >
      <div
        className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`}
        style={bgStyle}
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
              className={`absolute top-40 -right-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>
        )}

        <BrandBadge />

        {/* Centered layout */}
        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          <div className="w-full max-w-4xl -translate-y-4">
            {/* Header */}
            <div className="mb-5">
              <p className={theme.sectionLabelClass}>Everleap · Contact</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Contact us
              </h1>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Have a question or need help? Send a note. (The form doesn’t
                have to work yet.)
              </p>
            </div>

            {/* Card */}
            <section className="w-full">
              <div
                className={`relative w-full overflow-hidden rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
                role="region"
                aria-labelledby="contact-title"
              >
                {/* subtle pop */}
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

                <div className="relative space-y-7">
                  {/* Mini intro */}
                  <section className="space-y-2">
                    <h2 className={`text-xl font-semibold ${sectionTitleClass}`}>
                      Send a message
                    </h2>
                    <p className={`text-sm leading-relaxed ${bodyText}`}>
                      Tell us what you need. We’ll use this page for support,
                      feedback, and accessibility issues.
                    </p>
                  </section>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`mb-1.5 block text-xs ${mutedText}`}>
                        Your name
                      </label>
                      <input
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="e.g., Jordan"
                        aria-label="Your name"
                      />
                    </div>

                    <div>
                      <label className={`mb-1.5 block text-xs ${mutedText}`}>
                        Email
                      </label>
                      <input
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="e.g., you@example.com"
                        aria-label="Email"
                      />
                    </div>

                    <div>
                      <label className={`mb-1.5 block text-xs ${mutedText}`}>
                        Message
                      </label>
                      <textarea
                        className={`${inputBase} ${inputTheme} min-h-[140px] resize-none`}
                        placeholder="Tell us what’s going on…"
                        aria-label="Message"
                      />
                    </div>

                    <button
                      type="submit"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition active:scale-[0.99] ${
                        dark
                          ? "border border-sky-400/70 bg-sky-500/85 text-white hover:bg-sky-400 shadow-sm shadow-sky-500/30"
                          : "border border-sky-500/70 bg-sky-500 text-white hover:bg-sky-400"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      Send message
                    </button>

                    <div className={`text-xs ${mutedText}`}>
                      Not wired yet — this is a design placeholder.
                    </div>
                  </form>

                  {/* Direct email line (optional but nice) */}
                  <div
                    className={`flex items-center gap-2 rounded-2xl border px-4 py-3 ${
                      dark
                        ? "border-slate-700/60 bg-slate-950/30"
                        : "border-slate-200/70 bg-white/50"
                    }`}
                  >
                    <Mail className={`h-4 w-4 ${dark ? "text-slate-200/80" : "text-slate-700/80"}`} />
                    <div className="min-w-0">
                      <div className={`text-sm ${bodyText}`}>
                        Or email:{" "}
                        <a
                          href="mailto:info@everleap.ai"
                          className={`underline underline-offset-2 ${
                            dark ? "hover:text-sky-300" : "hover:text-sky-600"
                          }`}
                        >
                          info@everleap.ai
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bottom actions (MATCH TERMS PAGE SIGN-IN BLOCK) */}
                  <div className="pt-2">
                    <div
                      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                        dark
                          ? "border-slate-700/60 bg-slate-950/30"
                          : "border-slate-200/70 bg-white/50"
                      }`}
                    >
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                            dark ? "text-slate-300/70" : "text-slate-600/70"
                          }`}
                        >
                          Account
                        </div>
                        <div className={`mt-1 text-sm ${bodyText}`}>
                          Already have an account?
                        </div>
                      </div>

                      <a
                        href="/login"
                        className={`shrink-0 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.99] ${
                          dark
                            ? "border border-sky-400/70 bg-sky-500/85 text-white hover:bg-sky-400 shadow-sm shadow-sky-500/30"
                            : "border border-sky-500/70 bg-sky-500 text-white hover:bg-sky-400"
                        }`}
                      >
                        Sign in
                      </a>
                    </div>
                  </div>
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
