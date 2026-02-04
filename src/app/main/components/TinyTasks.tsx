// src/app/main/components/TinyTasks.tsx
"use client";

import * as React from "react";

export type TinyTaskId = "weekly_focus" | "curiosity_sprint";

export type TinyTaskStatus = "start" | "set" | "done";

export type TinyTaskSummary = {
  id: TinyTaskId;
  title: string;
  subtitle: string;

  /** Optional badge count (e.g., number of sprints completed) */
  count?: number;

  /** Disable interaction (e.g., sprint done this session) */
  disabled?: boolean;

  /** Status label */
  status: TinyTaskStatus;
};

export type TinyTasksProps = {
  dark: boolean;
  tasks: TinyTaskSummary[];
  onOpenTask: (id: TinyTaskId) => void;
};

function accentDot(taskId: TinyTaskId, dark: boolean) {
  // Subtle, adult accents — just enough “pop” without turning into boxes.
  if (taskId === "weekly_focus") return dark ? "bg-amber-200/80" : "bg-amber-500";
  return dark ? "bg-violet-200/80" : "bg-violet-600";
}

function statusLabel(status: TinyTaskStatus) {
  if (status === "done") return "Done";
  if (status === "set") return "Set";
  return "Start";
}

function statusTone(status: TinyTaskStatus, dark: boolean) {
  if (status === "done") return dark ? "text-emerald-200" : "text-emerald-700";
  if (status === "set") return dark ? "text-sky-200" : "text-sky-700";
  return dark ? "text-white/60" : "text-slate-600";
}

export function TinyTasks({ dark, tasks, onOpenTask }: TinyTasksProps) {
  const border = dark ? "border-white/10" : "border-black/10";
  const panelBg = dark ? "bg-white/3" : "bg-black/3";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-white/70" : "text-slate-600";
  const faint = dark ? "text-white/55" : "text-slate-500";

  const divider = dark ? "divide-white/10" : "divide-black/10";

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div className={`text-sm font-semibold ${text}`}>Tiny tasks</div>
        <div className={`text-xs ${faint}`}>Small wins that keep momentum real.</div>
      </div>

      <div className={`rounded-2xl border ${border} ${panelBg}`}>
        <div className={`divide-y ${divider}`}>
          {tasks.map((t) => {
            const isDisabled = !!t.disabled;
            const tone = statusTone(t.status, dark);

            return (
              <div key={t.id} className="px-4 py-3 md:py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className={`mt-[0.35rem] h-2 w-2 shrink-0 rounded-full ${accentDot(
                          t.id,
                          dark
                        )}`}
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <div className={`text-sm font-semibold ${text}`}>{t.title}</div>

                          {typeof t.count === "number" ? (
                            <div
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                dark ? "bg-white/8 text-white/70" : "bg-black/5 text-slate-700"
                              }`}
                              aria-label={`${t.count} completed`}
                            >
                              {t.count}
                            </div>
                          ) : null}

                          <div className={`text-xs font-semibold ${tone}`}>{statusLabel(t.status)}</div>
                        </div>

                        <div className={`mt-1 text-sm leading-relaxed ${muted}`}>{t.subtitle}</div>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => onOpenTask(t.id)}
                      className={[
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        isDisabled ? "cursor-not-allowed opacity-50" : "",
                        dark
                          ? "bg-white/10 text-white hover:bg-white/14"
                          : "bg-slate-900 text-white hover:bg-slate-950",
                      ].join(" ")}
                      aria-label={`${statusLabel(t.status)} ${t.title}`}
                    >
                      {t.status === "done" ? "View" : "Open"}
                    </button>
                  </div>
                </div>

                {/* Quiet helper line (keeps it conversational, not boxy) */}
                {t.id === "curiosity_sprint" && t.status !== "done" ? (
                  <div className={`mt-2 text-xs ${faint}`}>
                    Ten minutes counts. You’re building signal and confidence at the same time.
                  </div>
                ) : null}

                {t.id === "weekly_focus" && t.status === "start" ? (
                  <div className={`mt-2 text-xs ${faint}`}>
                    Pick a vibe + one target. I’ll use it to keep your next steps grounded.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
