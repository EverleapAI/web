"use client";

import * as React from "react";
import { Sparkles, Rocket } from "lucide-react";

import type { TinyTaskDefinition } from "@/app/(app)/main/domain/tinyTasks";
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
  bridgeLine?: string;
};

export type NextStepsStackVariant = "framed" | "embedded";

type Props = {
  dark: boolean;
  useLocal: boolean;
  definition: NextStepsDefinition;
  collapsible?: boolean;
  defaultOpen?: boolean;
  variant?: NextStepsStackVariant;
  heading?: string;
  subheading?: string;
};

/* =============================================================================
   Unified type system
   ============================================================================= */

function eyebrowRowClass() {
  return "inline-flex items-center gap-2";
}

function eyebrowClass(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.22em]",
    dark ? "text-white/34" : "text-slate-500",
  ].join(" ");
}

function sectionTitleClass(dark: boolean) {
  return [
    "mt-2 text-[1.02rem] font-semibold tracking-tight sm:text-[1.08rem]",
    dark ? "text-white/74" : "text-slate-950",
  ].join(" ");
}

function sectionBodyClass(dark: boolean) {
  return [
    "mt-1.5 max-w-[44rem] text-[14px] leading-6 sm:text-[15px] sm:leading-7",
    dark ? "text-white/52" : "text-slate-700",
  ].join(" ");
}

function tinyTaskIconClass(dark: boolean) {
  return dark ? "text-emerald-200/48" : "text-emerald-700";
}

function actionIconClass(dark: boolean) {
  return dark ? "text-amber-200/48" : "text-amber-700";
}

/* =============================================================================
   Component
   ============================================================================= */

export function NextStepsStack({
  dark,
  useLocal,
  definition,
}: Props) {
  return (
    <div className="w-full">
      <div className="grid gap-9 sm:gap-10">
        <section>
          <div className={eyebrowRowClass()}>
            <Sparkles
              className={`h-3.5 w-3.5 ${tinyTaskIconClass(dark)}`}
              aria-hidden
            />
            <div className={eyebrowClass(dark)}>Tiny Task</div>
          </div>

          <h3 className={sectionTitleClass(dark)}>
            {definition.tinyTask.title}
          </h3>

          <div className="mt-3.5 sm:mt-4">
            <TinyTaskCard
              dark={dark}
              useLocal={useLocal}
              definition={definition.tinyTask}
            />
          </div>
        </section>

        <section>
          <div className={eyebrowRowClass()}>
            <Rocket
              className={`h-3.5 w-3.5 ${actionIconClass(dark)}`}
              aria-hidden
            />
            <div className={eyebrowClass(dark)}>Actions</div>
          </div>

          <h3 className={sectionTitleClass(dark)}>
            {definition.action.title}
          </h3>

          {definition.action.goal ? (
            <p className={sectionBodyClass(dark)}>
              {definition.action.goal}
            </p>
          ) : null}

          <div className="mt-3.5 sm:mt-4">
            <ActionCard
              dark={dark}
              useLocal={useLocal}
              definition={definition.action}
            />
          </div>
        </section>
      </div>
    </div>
  );
}