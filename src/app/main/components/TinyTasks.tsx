// src/app/main/components/TinyTasks.tsx
"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

/* =============================================================================
   Types
   ============================================================================= */

export type TinyTaskId = "weekly_focus" | "curiosity_sprint";

export type TinyTaskSummary = {
  id: TinyTaskId;
  title: string;
  subtitle: string;
  status: "start" | "set" | "done";
  count?: number;
  disabled?: boolean;
};

export type TinyTasksProps = {
  dark: boolean;
  tasks: TinyTaskSummary[];
  onOpenTask: (id: TinyTaskId) => void;
};

/* =============================================================================
   Component
   ============================================================================= */

export function TinyTasks(props: TinyTasksProps) {
  const { dark, tasks, onOpenTask } = props;

  const headerMuted = dark ? "text-white/60" : "text-slate-600";
  const fineMuted = dark ? "text-white/55" : "text-slate-600";

  const rowHover = dark ? "hover:bg-white/5" : "hover:bg-black/[0.025]";
  const focusRing = dark
    ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/22"
    : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/18";

  // Slightly less boxed / more cinematic (match Signals softening)
  const shellClass = dark
    ? "border-white/8 bg-white/4 text-white"
    : "border-black/8 bg-white/60 text-slate-900";

  const divider = dark ? "border-white/8" : "border-black/8";

  const statusPill = (status: TinyTaskSummary["status"]) => {
    // Quieter, less “enterprise chip”
    if (dark) {
      if (status === "done") return "bg-emerald-400/10 text-emerald-100";
      if (status === "set") return "bg-sky-300/10 text-sky-100";
      return "bg-white/7 text-white/70";
    }
    if (status === "done") return "bg-emerald-600/10 text-emerald-800";
    if (status === "set") return "bg-sky-600/10 text-sky-800";
    return "bg-slate-900/5 text-slate-700";
  };

  const statusLabel = (t: TinyTaskSummary) => {
    if (t.status === "done") return "Done";
    if (t.status === "set") return "Set";
    return "Start";
  };

  return (
    <div className="mt-2">
      <div className="mb-2">
        <div className="flex items-end justify-between">
          <div className="text-sm font-semibold">Tiny tasks</div>
          <div className={`text-[11px] ${headerMuted}`}>Two quick levers</div>
        </div>

        {/* Option 1 */}
        <div className={`mt-1 text-[11px] ${fineMuted}`}>Small moves. Real momentum.</div>
      </div>

      <div className={`rounded-2xl border ${shellClass}`}>
        {tasks.map((t, idx) => {
          const disabled = !!t.disabled;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => (disabled ? undefined : onOpenTask(t.id))}
              className={[
                "w-full text-left",
                "px-4 py-3",
                "transition",
                rowHover,
                focusRing,
                idx === 0 ? "" : `border-t ${divider}`,
                disabled ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
              aria-label={`Open ${t.title}`}
              disabled={disabled}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold">{t.title}</div>
                    {typeof t.count === "number" ? (
                      <div className={`text-[11px] ${headerMuted}`}>{t.count}</div>
                    ) : null}
                  </div>
                  <div className={`mt-1 text-xs leading-snug ${fineMuted}`}>{t.subtitle}</div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div
                    className={[
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                      statusPill(t.status),
                    ].join(" ")}
                  >
                    {statusLabel(t)}
                  </div>

                  <ChevronRight
                    className={[
                      "h-4 w-4 transition",
                      dark ? "text-white/45 group-hover:text-white/75" : "text-slate-700/55 group-hover:text-slate-900",
                      disabled ? "opacity-35" : "opacity-70",
                    ].join(" ")}
                    aria-hidden
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
