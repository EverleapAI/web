// src/app/main/you/page.tsx
"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

export default function YouIntroPage() {
  const router = useRouter();

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient = GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ?? GRADIENT_CONFIGS[3];

  const pageBgImage = gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const pageBgStyle = pageBgImage ? ({ backgroundImage: pageBgImage } as React.CSSProperties) : {};
  const dark = isDarkTheme(themeId);

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";
  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="you_intro_orb"
      ambientCap={0.35}
    >
      <div className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`} style={pageBgStyle}>
        {/* Ambient blobs */}
        {gradientLevel > 0 && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: gradient.ambientOpacity }}>
            <div className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`} />
            <div className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`} />
          </div>
        )}

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-28 pt-10">
          <div className="w-full max-w-3xl">
            <div className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}>
              <div className="mx-auto max-w-xl text-center">
                <div className="mx-auto mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60">
                  Internal map
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                  You
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-slate-200/85 md:text-base">
                  This is the “learn about you” section — a bidirectional conversation with Everleap. It’s not a profile.
                  It’s where the app asks one question at a time, saves what you share, and builds a living thread of
                  what matters to you.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 px-5 py-4 text-left">
                  <div className="text-sm font-semibold text-slate-100">What belongs here</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-200/80">
                    <li>• Q&amp;A flows (conversation style, one prompt at a time)</li>
                    <li>• Your answers + reflections (saved locally and later synced)</li>
                    <li>• Badges / “what we’ve learned” snapshots</li>
                    <li>• Gentle follow-ups that improve insights over time</li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => router.push("/main/questions")}
                    className="
                      inline-flex items-center gap-2 rounded-full
                      border border-sky-300/80 bg-sky-400/90 px-6 py-2.5
                      text-sm font-semibold text-slate-950
                      shadow-[0_0_35px_rgba(56,189,248,0.9)]
                      transition hover:bg-sky-300 active:scale-95
                    "
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 text-xs text-slate-200/60">
                  Profile + settings will live in the “+” menu (separate from this section).
                </div>
              </div>
            </div>
          </div>
        </main>

        <BottomNav activeKey="you" />
      </div>
    </AppChrome>
  );
}
