"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

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

  /**
   * Optional copy line shown between the two cards
   * (kept subtle to avoid adding more “words”)
   */
  bridgeLine?: string;
};

export type NextStepsStackVariant =
  | "framed" // legacy: renders its own small header + padding
  | "embedded"; // new: section framing controlled by page.tsx

type Props = {
  dark: boolean;
  useLocal: boolean;

  definition: NextStepsDefinition;

  /**
   * If provided, stack can be collapsed/expanded.
   * When embedded, page.tsx usually owns the big section header,
   * but this small toggle can still be useful.
   */
  collapsible?: boolean;

  /**
   * Default open state when collapsible is enabled.
   * Default: true
   */
  defaultOpen?: boolean;

  /**
   * Visual treatment:
   * - framed: small internal header + padding (legacy)
   * - embedded: no header box / no outer framing (NEW)
   */
  variant?: NextStepsStackVariant;

  /**
   * Optional heading for legacy framed mode only.
   * (Ignored in embedded mode to avoid duplicate titles.)
   */
  heading?: string;
  subheading?: string;
};

/* =============================================================================
   UI helpers
   ============================================================================= */

function textClass(dark: boolean) {
  return dark ? "text-white/90" : "text-slate-900/90";
}

function subTextClass(dark: boolean) {
  return dark ? "text-white/60" : "text-slate-700/70";
}

function hairlineClass(dark: boolean) {
  return dark ? "bg-white/10" : "bg-slate-900/10";
}

/* =============================================================================
   Component
   ============================================================================= */

export function NextStepsStack({
  dark,
  useLocal,
  definition,
  collapsible = true,
  defaultOpen = true,
  variant = "embedded",
  heading = "Next steps",
  subheading,
}: Props) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  const embedded = variant === "embedded";
  const showInternalHeader = variant === "framed";
  const showToggle = collapsible;

  return (
    <div className="w-full">
      {/* Internal header (legacy framed mode only) */}
      {showInternalHeader ? (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={`text-sm font-semibold ${textClass(dark)}`}>
              {heading}
            </div>
            {subheading ? (
              <div className={`mt-0.5 text-xs ${subTextClass(dark)}`}>
                {subheading}
              </div>
            ) : null}
          </div>

          {showToggle ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={[
                "shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1",
                "text-xs font-medium",
                dark
                  ? "bg-white/8 text-white/75 hover:bg-white/12"
                  : "bg-slate-900/5 text-slate-700 hover:bg-slate-900/8",
                "transition",
              ].join(" ")}
              aria-expanded={open}
              aria-label={open ? "Hide next steps" : "Show next steps"}
            >
              {open ? "Hide" : "Show"}
              {open ? (
                <ChevronUp className="h-3.5 w-3.5 opacity-80" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              )}
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Embedded mode: toggle row only (no extra subtitle — page owns that) */}
      {!showInternalHeader && showToggle ? (
        <div className="mb-2 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={[
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
              "text-xs font-medium",
              dark
                ? "bg-white/6 text-white/70 hover:bg-white/10"
                : "bg-slate-900/4 text-slate-700 hover:bg-slate-900/7",
              "transition",
            ].join(" ")}
            aria-expanded={open}
            aria-label={open ? "Hide next steps" : "Show next steps"}
          >
            {open ? "Hide" : "Show"}
            {open ? (
              <ChevronUp className="h-3.5 w-3.5 opacity-80" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            )}
          </button>
        </div>
      ) : null}

      {variant === "framed" ? (
        <div className={`${hairlineClass(dark)} mb-4 h-px w-full`} />
      ) : null}

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="nextsteps-open"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22 }}
            className="w-full"
          >
            <div className="grid gap-3">
              <TinyTaskCard
                dark={dark}
                useLocal={useLocal}
                definition={definition.tinyTask}
                embedded={embedded}
              />

              {definition.bridgeLine ? (
                <div className={`px-1 text-xs ${subTextClass(dark)}`}>
                  {definition.bridgeLine}
                </div>
              ) : null}

              <ActionCard
                dark={dark}
                useLocal={useLocal}
                definition={definition.action}
                embedded={embedded}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
