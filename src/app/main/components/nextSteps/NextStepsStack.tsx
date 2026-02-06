// src/app/main/components/nextSteps/NextStepsStack.tsx
"use client";

import * as React from "react";

import type { TinyTaskDefinition } from "@/app/main/domain/tinyTasks";
import type { ActionDefinition } from "./ActionCard";

import { TinyTaskCard } from "./TinyTaskCard";
import { ActionCard } from "./ActionCard";

/* =============================================================================
   Types
   ============================================================================= */

export type NextStepsDefinition = {
  pageId: string;

  tinyTask: TinyTaskDefinition;
  action: ActionDefinition;

  /**
   * Optional copy line shown between the two cards
   * (kept subtle to avoid adding more “words”)
   */
  bridgeLine?: string;
};

type Props = {
  dark: boolean;
  useLocal: boolean;

  definition: NextStepsDefinition;

  /**
   * Optional heading for the section. Keep minimalist.
   * Default: "Next steps"
   */
  heading?: string;
  subheading?: string;
};

/* =============================================================================
   UI helpers
   ============================================================================= */

function headingText(dark: boolean) {
  return dark ? "text-white/85" : "text-slate-900";
}

function muted(dark: boolean) {
  return dark ? "text-white/55" : "text-slate-600";
}

function divider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

/* =============================================================================
   Component
   ============================================================================= */

export function NextStepsStack({
  dark,
  useLocal,
  definition,
  heading = "Next steps",
  subheading = "Small reflection → real-world action.",
}: Props) {
  return (
    <div className="mt-8">
      <div className="mb-3">
        <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${muted(dark)}`}>
          {heading}
        </div>
        {subheading ? (
          <div className={`mt-1 text-sm ${headingText(dark)}`}>{subheading}</div>
        ) : null}
      </div>

      <div className="space-y-5">
        <TinyTaskCard dark={dark} useLocal={useLocal} definition={definition.tinyTask} />

        {definition.bridgeLine ? (
          <div className={`px-1 text-xs ${muted(dark)}`}>{definition.bridgeLine}</div>
        ) : null}

        <ActionCard dark={dark} useLocal={useLocal} definition={definition.action} />
      </div>

      <div className={`mt-6 h-px w-full ${divider(dark)}`} />
    </div>
  );
}
