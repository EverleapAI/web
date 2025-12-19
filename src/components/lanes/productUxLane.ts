// src/components/career/lanes/productUxLane.ts

import type { StepperLaneId, StepperStep } from "@/components/career/stepperTypes";

export type StepperLane = {
  id: StepperLaneId;
  title: string;
  subtitle: string;
  steps: StepperStep[];
};

export const PRODUCT_UX_LANE: StepperLane = {
  id: "productUx",
  title: "Product / UX",
  subtitle: "Build things people use. Learn by shipping small + testing fast.",
  steps: [
    {
      id: "overview",
      title: "Overview",
      subtitle: "What this lane is (and why it could fit you).",
      tag: "Start here",
    },
    {
      id: "specialties",
      title: "Specialties",
      subtitle: "Different flavors of Product/UX (so you can pick a vibe).",
      tag: "Choose a path",
    },
    {
      id: "forecast",
      title: "Future",
      subtitle: "Where the field is going (and what’s growing).",
      tag: "What’s next",
    },
    {
      id: "futureAiSalary",
      title: "AI + Salary",
      subtitle: "How AI changes the work + realistic ranges (placeholder for now).",
      tag: "Reality check",
    },
    {
      id: "localLinks",
      title: "Local + Online",
      subtitle: "Best next links + nearby places (if we have your zip code).",
      tag: "Resources",
    },
    {
      id: "plan7Day",
      title: "7-Day Plan",
      subtitle: "A tiny sprint that turns curiosity into an artifact.",
      tag: "Do it",
    },
    {
      id: "dayInLife",
      title: "Day in the life",
      subtitle: "A story version: what this life actually feels like.",
      tag: "Picture it",
    },
    {
      id: "finish",
      title: "Finish",
      subtitle: "Lock your next move + make it local.",
      tag: "Commit",
    },
  ],
};

export function getLaneById(id: StepperLaneId): StepperLane {
  if (id === "productUx") return PRODUCT_UX_LANE;

  // Other lanes will be added next — keep a safe fallback for now.
  return PRODUCT_UX_LANE;
}
