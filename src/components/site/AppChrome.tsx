// src/components/site/AppChrome.tsx
"use client";

import * as React from "react";
import type { CSSProperties, ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { ThemeToggle, GradientToggle } from "@/components/site/VisualToggles";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

type AppChromeProps = {
  themeId: SpotlightThemeId;
  setThemeId: (id: SpotlightThemeId) => void;
  gradientLevel: GradientLevel;
  setGradientLevel: (lvl: GradientLevel) => void;

  /** where the orb click came from */
  orbSource?: string;

  /** optional: render additional controls in the top-right row */
  rightExtras?: ReactNode;

  /** main content */
  children: ReactNode;

  /** optional: cap ambient strength further for calmer pages */
  ambientCap?: number; // default 0.35
};

export function AppChrome({
  themeId,
  setThemeId,
  gradientLevel,
  setGradientLevel,
  orbSource = "app_orb",
  rightExtras,
  children,
  ambientCap = 0.35,
}: AppChromeProps) {
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  const ambientOpacity = Math.min(gradient.ambientOpacity, ambientCap);
  const dark = isDarkTheme(themeId);

  const [showAppearance, setShowAppearance] = React.useState(false);

  return (
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
        {/* Appearance (toggles behind this) */}
        <button
          type="button"
          onClick={() => setShowAppearance((v) => !v)}
          className={`
            inline-flex h-11 w-11 items-center justify-center rounded-full
            border border-slate-600/60 bg-slate-950/70 text-slate-200
            shadow-[0_10px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl
            hover:text-slate-50 transition
          `}
          aria-label="Appearance"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        {rightExtras}

        <AiGuideOrb minimal source={orbSource} />
      </div>

      {/* Appearance panel */}
      {showAppearance && (
        <div className="fixed right-4 top-[4.2rem] z-50 flex flex-col gap-2 md:right-6 md:top-[5.2rem]">
          <ThemeToggle activeId={themeId} onChange={setThemeId} />
          <GradientToggle
            activeLevel={gradientLevel}
            onChange={setGradientLevel}
          />
          {/* Optional micro-hint for light themes */}
          {!dark && (
            <div className="rounded-xl border border-slate-200 bg-white/75 px-3 py-2 text-[0.7rem] text-slate-600 shadow-sm backdrop-blur">
              Appearance
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
