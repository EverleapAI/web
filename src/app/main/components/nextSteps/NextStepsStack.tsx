// src/app/main/components/nextSteps/NextStepsStack.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

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

  /**
   * Optional: default expanded state (default false).
   * If you ever want desktop expanded while mobile collapsed, you can pass this.
   */
  defaultExpanded?: boolean;
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
  return dark
    ? "bg-white/18 ring-1 ring-white/15"
    : "bg-black/10 ring-1 ring-black/10";
}

function sectionHeaderButton(dark: boolean, expanded: boolean) {
  return [
    "group w-full",
    "flex items-center justify-between gap-3",
    "rounded-2xl border px-4 py-3",
    "backdrop-blur-xl",
    "transition active:scale-[0.99]",
    dark
      ? "border-white/12 bg-white/6 hover:bg-white/8"
      : "border-black/10 bg-white/85 hover:bg-white",
    expanded
      ? dark
        ? "ring-1 ring-white/12"
        : "ring-1 ring-black/6"
      : "",
    "focus-visible:outline-none",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-white/18"
      : "focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
}

/* =============================================================================
   Component
   ============================================================================= */

export function NextStepsStack({
  dark,
  useLocal,
  definition,
  heading = "Next steps",
  subheading = "Tiny tasks + actions you can take when ready.",
  showDivider,
  defaultExpanded = false,
}: Props) {
  const showHeader = Boolean((heading ?? "").trim()) || Boolean((subheading ?? "").trim());
  const effectiveShowDivider = showDivider ?? showHeader;

  const [expanded, setExpanded] = React.useState<boolean>(defaultExpanded);

  const contentId = React.useMemo(
    () => `el-nextsteps-${(definition.pageId || "page").replace(/[^a-z0-9_-]/gi, "_")}`,
    [definition.pageId]
  );

  return (
    <div className={showHeader ? "mt-8" : ""}>
      {/* Optional section label (kept very light) */}
      {showHeader ? (
        <div className="mb-3">
          {heading ? (
            <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${muted(dark)}`}>
              {heading}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Collapsible header row (this is the key affordance) */}
      <button
        type="button"
        className={sectionHeaderButton(dark, expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="min-w-0">
          <div className={`text-sm font-semibold ${headingText(dark)}`}>
            Next steps <span className={muted(dark)}>(optional)</span>
          </div>
          {subheading ? (
            <div className={`mt-0.5 text-xs ${muted(dark)}`}>{subheading}</div>
          ) : null}
        </div>

        <div className="shrink-0 inline-flex items-center gap-2">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
              "text-[11px] font-semibold",
              dark
                ? "border-white/12 bg-white/6 text-white/70"
                : "border-black/10 bg-black/3 text-slate-700",
            ].join(" ")}
            aria-hidden
          >
            {expanded ? "Hide" : "Show"}
          </span>

          {expanded ? (
            <ChevronDown className={dark ? "h-4 w-4 text-white/70" : "h-4 w-4 text-slate-700"} />
          ) : (
            <ChevronRight className={dark ? "h-4 w-4 text-white/70" : "h-4 w-4 text-slate-700"} />
          )}
        </div>
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={contentId}
            key="nextsteps-open"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="mt-4"
          >
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
                      <span
                        aria-hidden
                        className={["relative h-2.5 w-2.5 rounded-full", connectorDot(dark)].join(" ")}
                      />
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
                      <span
                        aria-hidden
                        className={["relative h-2.5 w-2.5 rounded-full", connectorDot(dark)].join(" ")}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <ActionCard dark={dark} useLocal={useLocal} definition={definition.action} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {effectiveShowDivider ? <div className={`mt-6 h-px w-full ${divider(dark)}`} /> : null}
    </div>
  );
}
