// src/components/career/stepperTypes.ts

export type StepperLaneId =
  | "productUx"
  | "healthHumanSupport"
  | "educationCommunityPrograms"
  | "independentBuilder"
  | "gameDesigner";

export type StepperStepId =
  | "overview"
  | "specialties"
  | "forecast"
  | "futureAiSalary"
  | "localLinks"
  | "plan7Day"
  | "dayInLife"
  | "finish";

export type StepperShellCta = {
  id: string;
  label: string;
  tone?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
};

export type StepperStep = {
  id: StepperStepId;
  title: string;
  subtitle?: string;

  /** Optional: used for tiny label chips, analytics, etc. */
  tag?: string;

  /** Optional: if provided, StepperShell will render these CTAs instead of defaults */
  ctas?: StepperShellCta[];
};

export type StepperShellState = {
  laneId: StepperLaneId;
  steps: StepperStep[];
  stepIndex: number;
  step: StepperStep;
  isFirst: boolean;
  isLast: boolean;
  totalSteps: number;
};

export type StepperPersistedState = {
  // Per-step / per-lane scratchpad.
  // Examples: picks[], intensity, zip, plan7Day_tasks, productUx_dayMode, etc.
  [key: string]: unknown;
};
