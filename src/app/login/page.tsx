// src/app/login/page.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

/* ========= Main Page ========= */

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = React.useState("");

  // Shared AppChrome visual state (NO local toggle UI here)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient = GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ?? GRADIENT_CONFIGS[3];

  const dark = isDarkTheme(themeId);

  const bgImage = gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;
  const mutedText = dark ? "text-slate-300/75" : "text-slate-600/75";

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/onboarding");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder only: route into the app.
    router.push("/main");
  }

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="login_orb"
      ambientCap={0.35}
    >
      <div className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`} style={bgStyle}>
        {/* Ambient blobs */}
        {gradientLevel > 0 && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: gradient.ambientOpacity }}>
            <div className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`} />
            <div className={`absolute top-40 -right-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`} />
          </div>
        )}

        <BrandBadge />

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          <section className="w-full max-w-md">
            <div
              className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
              role="region"
              aria-labelledby="login-title"
            >
              {/* Back */}
              <div className="mb-4 flex items-center justify-start">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`
                    inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold
                    transition active:scale-95
                    ${
                      dark
                        ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                        : "border-slate-200/80 bg-white/70 text-slate-700 hover:bg-white"
                    }
                  `}
                  aria-label="Go back"
                  title="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>

              {/* Header */}
              <div className="mb-5">
                <p className={theme.sectionLabelClass}>Everleap · Sign in</p>

                <h1 id="login-title" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                  Sign in securely
                </h1>

                <p className={`mt-2 text-sm ${mutedText}`}>
                  Use the email or phone you shared with Everleap. If you’re new, we’ll still walk you into the app.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <label
                  className={`block text-xs font-medium uppercase tracking-[0.18em] ${
                    dark ? "text-slate-300/70" : "text-slate-700/70"
                  }`}
                >
                  Email or phone
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com or (555) 555-1234"
                    inputMode="email"
                    autoComplete="email"
                    className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-50 placeholder:text-slate-400/60 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/60"
                        : "border-slate-200/80 bg-white/75 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-400/50"
                    }`}
                  />
                </label>

                <button
                  type="submit"
                  className={`mt-2 inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
                    dark ? "bg-sky-400 text-slate-950 hover:bg-sky-300" : "bg-sky-500 text-white hover:bg-sky-400"
                  }`}
                >
                  Continue to Everleap
                </button>

                <p className={`mt-2 text-[0.7rem] ${mutedText}`}>
                  No passwords here—just a simple way back into your Everleap journey.
                </p>
              </form>
            </div>
          </section>
        </main>

        <OnboardingFooterNav />
      </div>
    </AppChrome>
  );
}
