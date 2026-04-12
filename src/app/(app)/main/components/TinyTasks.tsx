"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

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

export function TinyTasks(props: TinyTasksProps) {
  const { dark, tasks, onOpenTask } = props;

  const text = dark ? "text-white/88" : "text-slate-900";
  const sub = dark ? "text-white/50" : "text-slate-600";
  const divider = dark ? "border-white/8" : "border-black/10";
  const arrow = dark ? "text-white/22" : "text-slate-400";

  const statusText = (status: TinyTaskSummary["status"]) => {
    if (status === "done") return "Done";
    if (status === "set") return "Set";
    return "Start";
  };

  return (
    <div className="mt-4">
      <div className="space-y-1">
        {tasks.map((t, idx) => {
          const disabled = !!t.disabled;

          return (
            <div
              key={t.id}
              className={[
                "py-3",
                idx !== 0 ? `border-t ${divider}` : "",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => {
                  if (!disabled) onOpenTask(t.id);
                }}
                disabled={disabled}
                className={[
                  "w-full text-left transition",
                  disabled
                    ? "cursor-not-allowed opacity-45"
                    : "hover:opacity-85",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className={`text-[15px] font-semibold ${text}`}>
                      {t.title}
                    </div>

                    <div className={`mt-1 text-[13px] leading-relaxed ${sub}`}>
                      {t.subtitle}
                    </div>

                    {typeof t.count === "number" ? (
                      <div className={`mt-1 text-[12px] ${sub}`}>
                        {t.count} entries
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className={`text-[12px] ${sub}`}>
                      {statusText(t.status)}
                    </div>

                    <ChevronRight className={`h-4 w-4 ${arrow}`} />
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}