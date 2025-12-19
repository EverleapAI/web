// src/app/main/career/[laneId]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import { StepperShell } from "@/components/career/StepperShell";
import { getCareerLane } from "@/components/career/lanes";
import type { StepperLaneId } from "@/components/career/stepperTypes";
import { resolveLaneId } from "@/components/career/laneAliases";

import {
  INSIGHTS_THEMES,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

/** Minimal, safe defaults to avoid TS “{}” issues in steps. */
type BaseProgress = Record<string, unknown>;
type ProductUxProgress = BaseProgress & {
  picks: string[]; // used by Specialties step
  intensity: "light" | "medium" | "full"; // used by plan UI
  zip: string; // used by local links UI
};

function initialProgressForLane(laneId: StepperLaneId): BaseProgress {
  if (laneId === "productUx") {
    const p: ProductUxProgress = {
      picks: [],
      intensity: "medium",
      zip: "",
    };
    return p;
  }
  // placeholders can start empty
  return {};
}

export default function CareerLanePage() {
  const params = useParams<{ laneId?: string }>();
  const router = useRouter();

  const raw = params?.laneId ?? "";
  const laneId = resolveLaneId(raw);

  // shared visuals (match your other pages)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);
  const dark = isDarkTheme(themeId);
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  if (!laneId) {
    return (
      <AppChrome
        themeId={themeId}
        setThemeId={setThemeId}
        gradientLevel={gradientLevel}
        setGradientLevel={setGradientLevel}
        orbSource="career_orb"
        ambientCap={0.35}
      >
        <div className="relative flex min-h-[100svh] flex-col">
          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8">
            <div
              className={`rounded-[32px] border p-6 backdrop-blur-2xl ${
                dark
                  ? "border-white/10 bg-slate-950/35 text-slate-100"
                  : "border-slate-200 bg-white/80 text-slate-900"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                Career lane
              </div>
              <div className="mt-2 text-2xl font-semibold">Unknown lane</div>
              <div className="mt-2 text-sm opacity-80">
                That lane id doesn’t exist.
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => router.push("/main/carousel")}
                  className={`inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold ${
                    dark
                      ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-white/90"
                  }`}
                >
                  Back to Insights
                </button>
              </div>
            </div>
          </main>

          <BottomNav />
        </div>
      </AppChrome>
    );
  }

  const lane = getCareerLane(laneId);

  if (!lane) {
    // Should be rare since resolveLaneId only returns valid StepperLaneId,
    // but keep it safe.
    return (
      <AppChrome
        themeId={themeId}
        setThemeId={setThemeId}
        gradientLevel={gradientLevel}
        setGradientLevel={setGradientLevel}
        orbSource="career_orb"
        ambientCap={0.35}
      >
        <div className="relative flex min-h-[100svh] flex-col">
          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8">
            <div
              className={`rounded-[32px] border p-6 backdrop-blur-2xl ${
                dark
                  ? "border-white/10 bg-slate-950/35 text-slate-100"
                  : "border-slate-200 bg-white/80 text-slate-900"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                Career lane
              </div>
              <div className="mt-2 text-2xl font-semibold">Missing lane config</div>
              <div className="mt-2 text-sm opacity-80">
                The lane id exists but isn’t configured yet.
              </div>

              <div className="mt-5">
                <Link
                  href="/main/carousel"
                  className={`inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold ${
                    dark
                      ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-white/90"
                  }`}
                >
                  Back to Insights
                </Link>
              </div>
            </div>
          </main>

          <BottomNav />
        </div>
      </AppChrome>
    );
  }

  // IMPORTANT: per-lane key so one lane doesn’t “resume” another lane’s step
  const storageKey = `everleap.career.stepper.v1.${laneId}`;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="career_orb"
      ambientCap={0.35}
    >
<StepperShell
  laneId={lane.laneId}
  steps={lane.steps}
  onExit={() => router.push("/main/carousel")}
  renderStep={({ step, state, progress, setProgress }) =>
    lane.renderStep({
      step,
      state,
      progress,
      setProgress,
    })
  }
/>

      <BottomNav />
    </AppChrome>
  );
}
