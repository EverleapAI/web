// src/components/career/stepperTypes.ts

export type StepperLaneId =
  | "productUx"
  | "healthHumanSupport"
  | "educationCommunityPrograms"
  | "independentBuilder";

export type StepperStepId =
  | "overview"
  | "specialties"
  | "forecast"
  | "futureAiSalary"
  | "localLinks"
  | "plan7Day"
  | "dayInLife"
  | "finish";

export type StepperStep = {
  id: StepperStepId;
  title: string;
  subtitle?: string;

  /**
   * Optional: used for tiny label chips, analytics, etc.
   * Keep it lightweight; the content lives in the step component.
   */
  tag?: string;
};

export type StepperShellState = {
  laneId: StepperLaneId;
  activeStepIndex: number;
};

export type StepperShellCta = {
  id: "back" | "primary" | string;
  kind: "primary" | "secondary" | "ghost";
  label: string;
  intent: "back" | "next" | "done" | "exit" | "custom";
  disabled?: boolean;
};

export type StepperPersistedState = {
  laneId: StepperLaneId;
  activeStepIndex: number;

  /** Lane-specific answers & flags */
  progress: Record<string, unknown>;

  /** Optional location signal (from onboarding or later prompt) */
  zipCode?: string;

  updatedAt: string;
};
