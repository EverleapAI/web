// src/components/navigation/JourneyMenuPopover.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Trophy, LifeBuoy } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";
import {
  DEFAULT_THEME_ID,
  DEFAULT_GRADIENT_LEVEL,
  getThemeById,
  getGradientConfig,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

// The three related "where am I / how am I doing / how does this work" surfaces,
// gathered under the Journey tab. Your journey is a new place; achievements and
// the guide already exist — achievements opens as a modal from anywhere (the
// same door the awards meter uses), the guide is its own screen.

type JourneyMenuPopoverProps = {
  open: boolean;
  onClose: () => void;
  themeId?: SpotlightThemeId;
  gradientLevel?: GradientLevel;
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function JourneyMenuPopover({
  open,
  onClose,
  themeId = DEFAULT_THEME_ID,
  gradientLevel = DEFAULT_GRADIENT_LEVEL,
}: JourneyMenuPopoverProps) {
  const theme = getThemeById(themeId);
  const grad = getGradientConfig(gradientLevel);
  const ambient = Math.min(clamp01(grad.ambientOpacity), 0.16);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const rowClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-white/85 transition hover:bg-white/[0.08]";
  const iconWrap =
    "grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5";

  return (
    <div className="fixed inset-0 z-[85]">
      {/* Outside-click catcher */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-transparent"
      />

      {/* Anchored above the Journey tab, at the right end of the bottom nav. */}
      <div className="absolute right-3 bottom-[calc(env(safe-area-inset-bottom,0px)+92px)]">
        <div className="relative w-[268px] overflow-hidden rounded-2xl border border-white/12 bg-black/60 shadow-2xl shadow-black/55 backdrop-blur-xl">
          {ambient > 0 && (
            <>
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -left-14 -top-16 h-[200px] w-[200px] rounded-full blur-[70px]",
                  theme.ambientTopLeftClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.26 }}
              />
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -right-16 -bottom-16 h-[220px] w-[220px] rounded-full blur-[80px]",
                  theme.ambientRightClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.26 }}
              />
            </>
          )}

          <div className="relative p-2">
            <div className="px-3 pt-2 pb-1 text-micro font-semibold uppercase tracking-eyebrow text-white/55">
              Journey
            </div>

            <div className="space-y-1">
              <Link href="/main/journey" onClick={onClose} className={rowClass}>
                <div className={iconWrap}>
                  <Sparkles className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-label font-medium">Your journey</div>
              </Link>

              {/* Achievements is a modal, not a route — same door the awards
                  meter opens from every screen. */}
              <button
                type="button"
                onClick={() => {
                  emitOpenAchievements();
                  onClose();
                }}
                className={rowClass}
              >
                <div className={iconWrap}>
                  <Trophy className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-label font-medium">Your achievements</div>
              </button>

              <Link href="/main/guide" onClick={onClose} className={rowClass}>
                <div className={iconWrap}>
                  <LifeBuoy className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-label font-medium">Lunorica Guide</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JourneyMenuPopover;
