// src/app/main/explore/page.tsx
"use client";

import * as React from "react";

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

export default function ExplorePage() {
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
      orbSource="explore_orb"
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

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          <div className="w-full max-w-3xl">
            <div className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}>
              <div className="mx-auto max-w-xl text-center">
                <div className="mx-auto mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60">
                  Coming soon
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                  Explore
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-slate-200/85 md:text-base">
                  This is where you’ll discover paths, roles, programs, and opportunities beyond your current insights.
                  We’ll keep it mobile-friendly: short summaries first, then “tap to expand” when you want more detail.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 px-5 py-4 text-left">
                  <div className="text-sm font-semibold text-slate-100">What will live here</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-200/80">
                    <li>• Career clusters & real roles (with links and next steps)</li>
                    <li>• Education options: college, community college, certificates, apprenticeships</li>
                    <li>• Local + global opportunities that match your interests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <BottomNav activeKey="explore" />
      </div>
    </AppChrome>
  );
}
