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
    "text-[10px] font-semibold uppercase tracking-[0.18em]",
    dark ? "text-white/36" : "text-slate-500",
  ].join(" ");
}

function sectionTitleClass(dark: boolean) {
  return [
    "mt-1.5 text-[1rem] font-semibold leading-[1.2] tracking-tight sm:text-[1.04rem]",
    dark ? "text-white/84" : "text-slate-950",
  ].join(" ");
}

function sectionBodyClass(dark: boolean) {
  return [
    "mt-1.5 text-[13px] leading-5 sm:text-[14px] sm:leading-6",
    dark ? "text-white/58" : "text-slate-700",
  ].join(" ");
}

function tinyTaskIconClass(dark: boolean) {
  return dark ? "text-teal-300/72" : "text-emerald-700";
}

function actionIconClass(dark: boolean) {
  return dark ? "text-amber-300/72" : "text-amber-700";
}

function dividerClass(dark: boolean) {
  return dark ? "border-white/8" : "border-black/8";
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
      <div className="grid gap-5 sm:gap-6">
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

          <div className="mt-3">
            <TinyTaskCard
              dark={dark}
              useLocal={useLocal}
              definition={definition.tinyTask}
            />
          </div>
        </section>

        <section className={`border-t pt-5 sm:pt-6 ${dividerClass(dark)}`}>
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

          <div className="mt-3">
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