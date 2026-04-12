// src/app/main/career/[laneId]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import StepperShell from "@/components/career/StepperShell";
import { getCareerLane } from "@/components/career/lanes";
import type { StepperLaneId } from "@/components/career/stepperTypes";

import { type GradientLevel } from "@/theme/everleapVisuals";

/**
 * Back vs Exit behavior:
 * - Back: returns to the prior page in history (true back). If there is no
 *   meaningful history (deep link), we fall back to Exit.
 * - Exit: always returns to Explore when mode=explore, otherwise Insights.
 *
 * NOTE: We no longer render Back/Exit at the top.
 * Navigation is owned by the sticky bar inside StepperShell.
 */

function canGoBack(): boolean {
  if (typeof window === "undefined") return false;
  return window.history.length > 1;
}

export default function CareerLanePage() {
  const params = useParams<{ laneId?: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const laneId = (params?.laneId ?? "") as StepperLaneId;
  const lane = React.useMemo(() => getCareerLane(laneId), [laneId]);

  const [gradientLevel] = React.useState<GradientLevel>(3);
  const dark = true;

  const mode = searchParams?.get("mode") ?? "";
  const exitHref = mode === "explore" ? "/main/explore" : "/main/insights";

  const onExit = React.useCallback(() => {
    router.push(exitHref);
  }, [router, exitHref]);

  const onBack = React.useCallback(() => {
    if (canGoBack()) router.back();
    else router.push(exitHref);
  }, [router, exitHref]);

  if (!lane) {
    return (
      <AppChrome gradientLevel={gradientLevel}>
        <div className="relative flex min-h-[100svh] flex-col">
          <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8">
            <div
              className={`rounded-[32px] border p-6 backdrop-blur-xl ${
                dark ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
                Career
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
                Lane not found
              </h1>
              <p className="mt-2 text-sm text-slate-200/80">
                That lane ID doesn’t exist (or isn’t wired yet).
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                    dark
                      ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={onExit}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                    dark
                      ? "border-white/10 bg-slate-950/35 text-slate-100 hover:bg-slate-950/55"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <X className="h-4 w-4" />
                  Exit
                </button>
              </div>
            </div>
          </main>

          <BottomNav />
        </div>
      </AppChrome>
    );
  }

  return (
    <AppChrome gradientLevel={gradientLevel}>
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8">
          <StepperShell
            laneId={lane.laneId}
            steps={lane.steps}
            renderStep={lane.renderStep}
            onExit={onExit}
            laneTitle={lane.title}
            laneSubtitle={lane.subtitle}
          />
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}