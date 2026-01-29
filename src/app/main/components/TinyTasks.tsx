// src/components/TinyTasks.tsx
"use client";

import * as React from "react";

export type TinyTaskId = "weekly_focus" | "curiosity_sprint";

export type TinyTaskSummary = {
  id: TinyTaskId;
  title: string;
  subtitle?: string;
  count?: number; // optional: “1 saved”, etc.
  disabled?: boolean;
  status?: "start" | "set" | "done";
};

export function TinyTasks(props: {
  tasks: TinyTaskSummary[];
  onOpenTask: (id: TinyTaskId) => void;

  /** Optional styling hooks to match the hosting page theme */
  dark?: boolean;
  label?: string; // default: "Tiny tasks"
}) {
  const { tasks, onOpenTask, dark = true, label = "Tiny tasks" } = props;

  const labelClass = dark ? "text-white/70" : "text-slate-500";
  const titleClass = dark ? "text-white/90" : "text-slate-900";
  const subClass = dark ? "text-white/55" : "text-slate-600";
  const faintClass = dark ? "text-white/50" : "text-slate-500";
  const hover = dark ? "hover:bg-white/5" : "hover:bg-black/4";
  const divider = dark ? "bg-white/8" : "bg-black/8";
  const ring = dark ? "focus:ring-white/20" : "focus:ring-black/15";
  const pillBorder = dark ? "border-white/12" : "border-black/12";
  const pillText = dark ? "text-white/70" : "text-slate-700";

  const actionLabel = (t: TinyTaskSummary) => {
    if (t.status === "done") return "done";
    if (t.status === "set") return "set";
    // fall back to id-based
    return t.id === "weekly_focus" ? "set" : "start";
  };

  return (
    <div className="pt-2">
      <div className={`px-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em] ${labelClass}`}>
        {label}
      </div>

      <div className="mt-2 grid gap-1">
        {tasks.map((t, idx) => (
          <React.Fragment key={t.id}>
            <button
              type="button"
              onClick={() => onOpenTask(t.id)}
              disabled={!!t.disabled}
              className={[
                "w-full rounded-2xl px-2 py-3 text-left transition",
                t.disabled ? (dark ? "opacity-60" : "opacity-70") : hover,
                "focus:outline-none focus:ring-2",
                ring,
              ].join(" ")}
            >
              <div className="flex flex-col gap-1">
                {/* Title + action pill (next to title, not far right) */}
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-semibold ${titleClass}`}>{t.title}</div>

                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                      pillBorder,
                      pillText,
                    ].join(" ")}
                    aria-label={`${actionLabel(t)} ${t.title}`}
                  >
                    {actionLabel(t)}
                  </span>
                </div>

                {t.subtitle ? <div className={`text-xs ${subClass}`}>{t.subtitle}</div> : null}

                {typeof t.count === "number" && t.count > 0 ? (
                  <div className={`text-xs ${faintClass}`}>{t.count} saved</div>
                ) : null}
              </div>
            </button>

            {idx < tasks.length - 1 ? <div className={`mx-2 h-px ${divider}`} aria-hidden /> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}