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

  /**
   * Optional: show a subtle divider after the stack.
   * Default: true when a heading/subheading is shown, otherwise false.
   */
  showDivider?: boolean;
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

function connectorLine(dark: boolean) {
  return dark
    ? "bg-gradient-to-r from-white/0 via-white/18 to-white/0"
    : "bg-gradient-to-r from-black/0 via-black/14 to-black/0";
}

function connectorDot(dark: boolean) {
  return dark ? "bg-white/18 ring-1 ring-white/15" : "bg-black/10 ring-1 ring-black/10";
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
  showDivider,
}: Props) {
  const showHeader = Boolean((heading ?? "").trim()) || Boolean((subheading ?? "").trim());
  const effectiveShowDivider = showDivider ?? showHeader;

  return (
    <div className={showHeader ? "mt-8" : ""}>
      {showHeader ? (
        <div className="mb-3">
          {heading ? (
            <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${muted(dark)}`}>
              {heading}
            </div>
          ) : null}

          {subheading ? <div className={`mt-1 text-sm ${headingText(dark)}`}>{subheading}</div> : null}
        </div>
      ) : null}

      <div className="space-y-4">
        <TinyTaskCard dark={dark} useLocal={useLocal} definition={definition.tinyTask} />

        {definition.bridgeLine ? (
          <div className="px-1">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <span
                  aria-hidden
                  className={[
                    "absolute h-8 w-8 rounded-full blur-xl",
                    dark ? "bg-emerald-400/10" : "bg-emerald-400/8",
                  ].join(" ")}
                />
                <span aria-hidden className={["relative h-2.5 w-2.5 rounded-full", connectorDot(dark)].join(" ")} />
              </div>

              <div className="flex-1">
                <div className={`h-px w-full ${connectorLine(dark)}`} />
                <div className={`mt-2 text-xs ${muted(dark)}`}>{definition.bridgeLine}</div>
              </div>

              <div className="relative flex h-8 w-8 items-center justify-center">
                <span
                  aria-hidden
                  className={[
                    "absolute h-8 w-8 rounded-full blur-xl",
                    dark ? "bg-violet-400/10" : "bg-violet-400/8",
                  ].join(" ")}
                />
                <span aria-hidden className={["relative h-2.5 w-2.5 rounded-full", connectorDot(dark)].join(" ")} />
              </div>
            </div>
          </div>
        ) : null}

        <ActionCard dark={dark} useLocal={useLocal} definition={definition.action} />
      </div>

      {effectiveShowDivider ? <div className={`mt-6 h-px w-full ${divider(dark)}`} /> : null}
    </div>
  );
}
