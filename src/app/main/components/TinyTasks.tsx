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

  const focusRing = dark
    ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/22"
    : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/18";

  // Weather-like: calm surface, predictable contrast
  const shellClass = dark
    ? "border-white/10 bg-slate-950/22 text-white"
    : "border-black/10 bg-white/80 text-slate-900";

  const divider = dark ? "border-white/10" : "border-black/10";

  const rowHover = dark ? "hover:bg-white/[0.035]" : "hover:bg-black/[0.02]";
  const rowActive = dark ? "active:bg-white/[0.05]" : "active:bg-black/[0.03]";

  const statusPill = (status: TinyTaskSummary["status"]) => {
    // Keep it secondary (title/subtitle should lead)
    if (dark) {
      if (status === "done") return "bg-emerald-400/9 text-emerald-100/85 ring-1 ring-emerald-300/18";
      if (status === "set") return "bg-sky-300/9 text-sky-100/85 ring-1 ring-sky-300/16";
      return "bg-white/6 text-white/70 ring-1 ring-white/10";
    }
    if (status === "done") return "bg-emerald-600/10 text-emerald-800 ring-1 ring-emerald-700/15";
    if (status === "set") return "bg-sky-600/10 text-sky-800 ring-1 ring-sky-700/12";
    return "bg-slate-900/5 text-slate-700 ring-1 ring-black/6";
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

        <div className={`mt-1 text-[12px] leading-snug ${fineMuted}`}>Small moves. Real momentum.</div>
      </div>

      <div className={["rounded-2xl border", "overflow-hidden", shellClass].join(" ")}>
        {tasks.map((t, idx) => {
          const disabled = !!t.disabled;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => (disabled ? undefined : onOpenTask(t.id))}
              className={[
                "group w-full text-left",
                "px-4 py-3.5",
                "transition",
                rowHover,
                rowActive,
                focusRing,
                idx === 0 ? "" : `border-t ${divider}`,
                disabled ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
              aria-label={`Open ${t.title}${disabled ? " (disabled)" : ""}`}
              disabled={disabled}
              aria-disabled={disabled}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <div className="truncate text-[15px] font-semibold leading-snug">{t.title}</div>

                    {typeof t.count === "number" ? (
                      <div
                        className={[
                          "shrink-0 rounded-full border px-2 py-0.5",
                          "text-[11px] font-semibold tabular-nums",
                          dark ? "border-white/10 text-white/55" : "border-black/10 text-slate-600",
                        ].join(" ")}
                        aria-label={`${t.count}`}
                      >
                        {t.count}
                      </div>
                    ) : null}
                  </div>

                  <div className={`mt-1 text-[13px] leading-snug ${fineMuted}`}>{t.subtitle}</div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className={["rounded-full px-2.5 py-1", "text-[11px] font-semibold tabular-nums", statusPill(t.status)].join(" ")}>
                    {statusLabel(t)}
                  </div>

                  <ChevronRight
                    className={[
                      "h-4 w-4 transition",
                      dark ? "text-white/30 group-hover:text-white/60" : "text-slate-700/40 group-hover:text-slate-900/75",
                      disabled ? "opacity-35" : "opacity-80",
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
