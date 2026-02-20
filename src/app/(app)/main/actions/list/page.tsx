// src/app/main/actions/list/page.tsx
"use client";

import * as React from "react";
import { CheckCircle2, Circle, Plus, Target } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";

type Goal = { id: string; title: string };
type ActionItem = {
  id: string;
  title: string;
  goalId?: string;
  done: boolean;
};

const DEMO_GOALS: Goal[] = [
  { id: "g1", title: "Explore product design" },
  { id: "g2", title: "Feel better physically" },
];

const DEMO_ACTIONS: ActionItem[] = [
  { id: "a1", title: "Watch 1 intro UX video (15 min)", goalId: "g1", done: false },
  { id: "a2", title: "Message one PM on LinkedIn", goalId: "g1", done: false },
  { id: "a3", title: "20-minute walk after school", goalId: "g2", done: true },
  { id: "a4", title: "Pick 1 simple healthy snack", goalId: "g2", done: false },
];

export default function ActionsListPage() {
  const [actions, setActions] = React.useState<ActionItem[]>(DEMO_ACTIONS);

  const goalsById = React.useMemo(() => {
    const map = new Map<string, Goal>();
    for (const g of DEMO_GOALS) map.set(g.id, g);
    return map;
  }, []);

  function toggleDone(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-white">Your next steps</h1>
            <p className="mt-1 text-sm text-white/70">
              Keep these tiny. Finishing is the win.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            onClick={() => {
              setActions((prev) => [
                { id: `a${prev.length + 1}`, title: "New action (edit me)", done: false },
                ...prev,
              ]);
            }}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {actions.map((a) => {
            const goal = a.goalId ? goalsById.get(a.goalId) : undefined;

            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleDone(a.id)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {a.done ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Circle className="h-5 w-5 text-white/70" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">
                      {a.title}
                    </div>

                    {goal ? (
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                        <Target className="h-3.5 w-3.5" />
                        <span className="truncate">{goal.title}</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-white/50">
                        No goal attached (yet)
                      </div>
                    )}
                  </div>

                  <div
                    className={[
                      "ml-2 rounded-full px-2 py-1 text-[11px] font-semibold",
                      a.done ? "bg-white/15 text-white/80" : "bg-white/10 text-white/70",
                    ].join(" ")}
                  >
                    {a.done ? "Done" : "To do"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav activeKey="actions" />
    </div>
  );
}
