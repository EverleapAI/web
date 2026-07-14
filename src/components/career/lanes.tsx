// src/components/career/lanes.tsx
"use client";

import * as React from "react";

import type { StepperLaneId, StepperStep } from "@/components/career/stepperTypes";

import { OverviewStep } from "@/components/career/steps/productUx/OverviewStep";
import { SpecialtiesStep } from "@/components/career/steps/productUx/SpecialtiesStep";
import { ForecastStep } from "@/components/career/steps/productUx/ForecastStep";
import { FutureAiSalaryStep } from "@/components/career/steps/productUx/FutureAiSalaryStep";
import { LocalLinksStep } from "@/components/career/steps/productUx/LocalLinksStep";
import { Plan7DayStep } from "@/components/career/steps/productUx/Plan7DayStep";
import { DayInLifeStep } from "@/components/career/steps/productUx/DayInLifeStep";
import { FinishStep } from "@/components/career/steps/productUx/FinishStep";

export type RenderArgs = {
  step: StepperStep;
  // StepperShell passes a richer state; keep this loose so we don’t fight types
  state: unknown;
  progress: Record<string, unknown>;
  setProgress: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
};

export type CareerLane = {
  laneId: StepperLaneId;
  title: string;
  subtitle: string;
  steps: StepperStep[];
  renderStep: (args: RenderArgs) => React.ReactNode;
};

const PRODUCT_UX_STEPS: StepperStep[] = [
  {
    id: "overview",
    title: "What this lane is",
    subtitle: "The vibe + what you’ll actually do",
    tag: "overview",
  },
  {
    id: "specialties",
    title: "Specialties",
    subtitle: "Pick a flavor of Product / UX",
    tag: "specialties",
  },
  {
    id: "forecast",
    title: "Future outlook",
    subtitle: "Demand, trends, and where it’s headed",
    tag: "forecast",
  },
  {
    id: "futureAiSalary",
    title: "AI + this work",
    subtitle: "How AI changes the work, and what stays human",
    tag: "ai_salary",
  },
  {
    id: "localLinks",
    title: "Start near you",
    subtitle: "Links + local options (when zip is known)",
    tag: "local_links",
  },
  {
    id: "plan7Day",
    title: "7-day test plan",
    subtitle: "Try it without committing your life",
    tag: "plan_7",
  },
  {
    id: "dayInLife",
    title: "Day in the life",
    subtitle: "Picture a real day (not a brochure)",
    tag: "day_in_life",
  },
  {
    id: "finish",
    title: "Lock in your next move",
    subtitle: "One tiny action — momentum starts here",
    tag: "finish",
  },
];

function productUxLane(): CareerLane {
  return {
    laneId: "productUx",
    title: "Product / UX",
    subtitle: "Building things people actually use",
    steps: PRODUCT_UX_STEPS,
    renderStep: ({ step, state, progress, setProgress }) => {
      switch (step.id) {
        case "overview":
          return <OverviewStep step={step} progress={progress} state={state} />;

        case "specialties":
          return (
            <SpecialtiesStep step={step} progress={progress} setProgress={setProgress} />
          );

        case "forecast":
          return <ForecastStep step={step} progress={progress} />;

        case "futureAiSalary":
          return <FutureAiSalaryStep step={step} progress={progress} />;

        case "localLinks":
          return <LocalLinksStep step={step} progress={progress} />;

        case "plan7Day":
          return (
            <Plan7DayStep step={step} progress={progress} setProgress={setProgress} />
          );

        case "dayInLife":
          return (
            <DayInLifeStep
              step={step}
              progress={
                // DayInLifeStep expects StepperPersistedState, but we store a map.
                // It only reads/writes through the map keys it sets.
                (progress as unknown) as import("@/components/career/stepperTypes").StepperPersistedState
              }
              setProgress={
                (setProgress as unknown) as React.Dispatch<
                  React.SetStateAction<
                    import("@/components/career/stepperTypes").StepperPersistedState
                  >
                >
              }
            />
          );

        case "finish":
          return <FinishStep step={step} progress={progress} setProgress={setProgress} />;

        default:
          return null;
      }
    },
  };
}

function placeholderLane(laneId: StepperLaneId, title: string, subtitle: string): CareerLane {
  const steps: StepperStep[] = [
    { id: "overview", title: "Overview", subtitle: "Coming soon", tag: "soon" },
  ];

  return {
    laneId,
    title,
    subtitle,
    steps,
    renderStep: () => (
      <section className="space-y-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
            {title}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-slate-50">Coming soon</h2>
          <p className="mt-2 text-sm text-slate-200/85">{subtitle}</p>
        </div>
      </section>
    ),
  };
}

export function getCareerLane(id: StepperLaneId): CareerLane | null {
  switch (id) {
    case "productUx":
      return productUxLane();

    case "gameDesigner":
      return placeholderLane(
        "gameDesigner",
        "Game Designer",
        "Design rules, challenges, and rewards that make play feel amazing"
      );

    case "healthHumanSupport":
      return placeholderLane(
        "healthHumanSupport",
        "Health + Human Support",
        "Coaching, wellness, patient support"
      );

    case "educationCommunityPrograms":
      return placeholderLane(
        "educationCommunityPrograms",
        "Education / Community / Programs",
        "Impact work with real outcomes"
      );

    case "independentBuilder":
      return placeholderLane(
        "independentBuilder",
        "Independent Builder",
        "Creator / startup / entrepreneurship"
      );

    default:
      return null;
  }
}
