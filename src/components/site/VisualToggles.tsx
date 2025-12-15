// src/components/site/VisualToggles.tsx
"use client";

import * as React from "react";
import {
  INSIGHTS_THEMES,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

export function ThemeToggle({
  activeId,
  onChange,
}: {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm backdrop-blur-xl">
      {INSIGHTS_THEMES.map((theme) => {
        const active = theme.id === activeId;
        return (
          <button
            key={theme.id}
            type="button"
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

export function GradientToggle({
  activeLevel,
  onChange,
}: {
  activeLevel: GradientLevel;
  onChange: (l: GradientLevel) => void;
}) {
  const levels: GradientLevel[] = [0, 1, 2, 3, 4, 5];
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm backdrop-blur-xl">
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
