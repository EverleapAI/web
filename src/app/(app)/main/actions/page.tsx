// src/app/(app)/main/actions/page.tsx
//
// The Actions tab — the concrete next-steps a user has saved to actually try,
// read from the app-wide user_actions store (guidance/actions). Explore path
// opportunities are the first writer via "Save to Actions".

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Circle,
  CircleDot,
  Compass,
  ExternalLink,
  ListChecks,
  Sparkles,
  X,
} from "lucide-react";

import { SectionCard } from "../components/ui/SectionCard";

type ActionStatus = "saved" | "doing" | "done" | "dismissed";

type Action = {
  id: string;
  sourceType: string;
  sourceRef: string | null;
  lane: string | null;
  title: string;
  description: string | null;
  href: string | null;
  status: ActionStatus;
  createdAt: string;
  updatedAt: string;
};

const LANE_LABEL: Record<string, string> = {
  work: "Work",
  learning: "Learning",
  world: "World",
  impact: "Impact",
  play: "Play",
};

function sourceLabel(a: Action): string {
  if (a.lane && LANE_LABEL[a.lane]) return `Explore · ${LANE_LABEL[a.lane]}`;
  if (a.sourceType === "explore_path") return "Explore";
  if (a.sourceType === "insights") return "Insights";
  if (a.sourceType === "today") return "Today";
  return a.sourceType;
}

function ActionRow({
  action,
  onStatus,
  pending,
}: {
  action: Action;
  onStatus: (id: string, status: ActionStatus) => void;
  pending: boolean;
}) {
  const done = action.status === "done";
  const doing = action.status === "doing";

  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-3.5 py-3 transition hover:bg-white/[0.04]">
      <button
        type="button"
        aria-label={done ? "Mark not done" : "Mark done"}
        disabled={pending}
        onClick={() => onStatus(action.id, done ? "saved" : "done")}
        className="mt-0.5 shrink-0 text-white/40 transition hover:text-emerald-300 disabled:opacity-50"
      >
        {done ? (
          <Check className="h-[18px] w-[18px] text-emerald-300" />
        ) : (
          <Circle className="h-[18px] w-[18px]" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-[14.5px] font-semibold ${done ? "text-white/45 line-through" : "text-white"}`}
          >
            {action.title}
          </span>
        </div>
        {action.description ? (
          <p className={`mt-0.5 line-clamp-2 text-[12.5px] leading-[1.5] ${done ? "text-white/35" : "text-white/58"}`}>
            {action.description}
          </p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[11px] uppercase tracking-[0.13em] text-white/38">
            {sourceLabel(action)}
          </span>
          {action.href ? (
            <a
              href={action.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-white/60 transition hover:text-white/90"
            >
              Open <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!done ? (
          <button
            type="button"
            aria-label={doing ? "Working on it" : "Mark working on it"}
            disabled={pending}
            onClick={() => onStatus(action.id, doing ? "saved" : "doing")}
            title={doing ? "Working on it" : "Mark working on it"}
            className={`rounded-full p-1.5 transition disabled:opacity-50 ${doing ? "text-amber-300" : "text-white/35 hover:text-white/70"}`}
          >
            <CircleDot className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="button"
          aria-label="Dismiss"
          disabled={pending}
          onClick={() => onStatus(action.id, "dismissed")}
          title="Remove"
          className="rounded-full p-1.5 text-white/30 opacity-0 transition hover:text-white/70 group-hover:opacity-100 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ActionsPage() {
  const [actions, setActions] = React.useState<Action[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    let active = true;
    fetch("/api/guidance/actions", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (active && d?.ok && Array.isArray(d.actions)) setActions(d.actions);
        else if (active) setFailed(true);
      })
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  const setStatus = React.useCallback(
    async (id: string, status: ActionStatus) => {
      const prev = actions;
      // optimistic
      setActions((cur) =>
        cur ? cur.map((a) => (a.id === id ? { ...a, status } : a)) : cur
      );
      setPendingIds((s) => new Set(s).add(id));
      try {
        const res = await fetch("/api/guidance/actions", {
          method: "PATCH",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setActions(prev ?? null); // revert
      } finally {
        setPendingIds((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
      }
    },
    [actions]
  );

  const active = (actions ?? []).filter((a) => a.status === "saved" || a.status === "doing");
  const done = (actions ?? []).filter((a) => a.status === "done");

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-1 flex-col px-[4px] pb-24 pt-1">
      <div className="mb-4 px-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-cyan-300/12 text-cyan-200/75">
            <ListChecks className="h-3.5 w-3.5" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/44">Actions</span>
        </div>
        <h1 className="text-[26px] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[30px]">
          Things you saved to try
        </h1>
        <p className="mt-1.5 text-[14px] leading-[1.5] text-white/60">
          Real next-steps you bookmarked while exploring. Start them, finish them, or let them go.
        </p>
      </div>

      {actions === null && !failed ? (
        <SectionCard tone="neutral">
          <div className="animate-pulse space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-2xl bg-white/[0.04]" />
            ))}
          </div>
        </SectionCard>
      ) : active.length === 0 && done.length === 0 ? (
        <SectionCard tone="hero">
          <div className="flex flex-col items-start gap-3 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/60">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold text-white">Nothing saved yet</h2>
              <p className="mt-1 max-w-md text-[13.5px] leading-[1.6] text-white/62">
                {failed
                  ? "Couldn't load your actions right now. Try refreshing."
                  : "When you find a next-step worth trying in Explore, hit its bookmark to save it here."}
              </p>
            </div>
            <Link
              href="/main/explore"
              className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[13.5px] font-medium text-white/85 transition hover:bg-white/[0.1]"
            >
              <Compass className="h-4 w-4" />
              Explore paths
            </Link>
          </div>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {active.length > 0 ? (
            <SectionCard tone="neutral">
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
                To try ({active.length})
              </h2>
              <div className="space-y-2">
                {active.map((a) => (
                  <ActionRow key={a.id} action={a} onStatus={setStatus} pending={pendingIds.has(a.id)} />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {done.length > 0 ? (
            <SectionCard tone="neutral">
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Done ({done.length})
              </h2>
              <div className="space-y-2">
                {done.map((a) => (
                  <ActionRow key={a.id} action={a} onStatus={setStatus} pending={pendingIds.has(a.id)} />
                ))}
              </div>
            </SectionCard>
          ) : null}
        </div>
      )}
    </div>
  );
}
