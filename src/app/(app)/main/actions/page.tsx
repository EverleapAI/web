// src/app/(app)/main/actions/page.tsx
//
// The Actions tab. Two layers:
//   - "Suggested for you" — the agent proposing next-steps from the user's
//     profile (guidance/action-suggestions), accept -> commits to user_actions.
//   - The committed actions themselves (user_actions via guidance/actions):
//     "To try" (saved/doing) + "Done", with live status controls.

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Circle,
  Compass,
  ExternalLink,
  ListChecks,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { SectionCard } from "../components/ui/SectionCard";
import { ConstellationAnchor } from "../components/ui/ConstellationAnchor";
import { emitActionAdded, emitActionsChanged } from "@/lib/actionsBus";

type ActionStatus = "saved" | "doing" | "done" | "dismissed";

type MissionStep = { text: string; done: boolean };
type Mission = { why: string; steps: MissionStep[]; generatedAt: string };

type Action = {
  id: string;
  sourceType: string;
  sourceRef: string | null;
  lane: string | null;
  title: string;
  description: string | null;
  href: string | null;
  status: ActionStatus;
  mission?: Mission | null;
  createdAt: string;
  updatedAt: string;
};

type Suggestion = {
  id: string;
  title: string;
  why: string;
  lane: string | null;
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
  if (a.sourceType === "agent") return "Suggested";
  if (a.sourceType === "insights") return "Insights";
  if (a.sourceType === "today") return "Today";
  return a.sourceType;
}

/* ---------------- committed action row ---------------- */

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
  const [menuOpen, setMenuOpen] = React.useState(false);
  const missionSteps = action.mission?.steps ?? [];
  const missionDone = missionSteps.filter((s) => s.done).length;

  const menuItem =
    "flex w-full items-center rounded-lg px-3 py-2 text-left text-[13px] transition hover:bg-white/[0.06]";
  const circleClass = `mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition disabled:opacity-50 ${
    done
      ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300"
      : "border-white/25 text-transparent hover:border-emerald-300/70 hover:text-emerald-300/50"
  }`;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-3.5 py-3 transition hover:bg-white/[0.04]">
      {/* Completion control. Finishing routes through the mission's Finish flow so
          a feeling is always captured; only un-completing is a one-tap toggle. */}
      {done ? (
        <button
          type="button"
          aria-label="Mark not done"
          disabled={pending}
          onClick={() => onStatus(action.id, "saved")}
          className={circleClass}
        >
          <Check className="h-[13px] w-[13px]" strokeWidth={3} />
        </button>
      ) : (
        <Link href={`/main/actions/${action.id}`} aria-label="Finish this mission" className={circleClass}>
          <Check className="h-[13px] w-[13px]" strokeWidth={3} />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <Link
          href={`/main/actions/${action.id}`}
          className={`text-[14.5px] font-semibold transition hover:underline ${done ? "text-white/45 line-through" : "text-white"}`}
        >
          {action.title}
        </Link>
        {action.description ? (
          <p className={`mt-0.5 line-clamp-2 text-[12.5px] leading-[1.5] ${done ? "text-white/35" : "text-white/58"}`}>
            {action.description}
          </p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {missionSteps.length > 0 ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/50">
              {missionDone}/{missionSteps.length} steps
            </span>
          ) : !done ? (
            <Link
              href={`/main/actions/${action.id}`}
              className="inline-flex items-center gap-0.5 text-[12px] font-medium text-white/55 transition hover:text-white/90"
            >
              Open mission <ChevronRight className="h-3 w-3" />
            </Link>
          ) : null}
          <span className="text-[11px] uppercase tracking-[0.13em] text-white/38">{sourceLabel(action)}</span>
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
        {missionSteps.length > 0 && !done ? (
          <div className="mt-2 h-1 w-full max-w-[240px] overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-emerald-400/70 transition-all"
              style={{ width: `${Math.round((missionDone / missionSteps.length) * 100)}%` }}
            />
          </div>
        ) : null}
      </div>

      {/* Overflow menu — always visible (works on touch, unlike a hover-only X) */}
      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="More options"
          disabled={pending}
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-full p-1.5 text-white/40 transition hover:bg-white/[0.06] hover:text-white/80 disabled:opacity-50"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen ? (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-white/10 bg-[#0c1226] p-1 text-white/85 shadow-[0_16px_44px_rgba(3,7,20,0.6)]">
              {done ? (
                <button
                  type="button"
                  className={menuItem}
                  onClick={() => {
                    onStatus(action.id, "saved");
                    setMenuOpen(false);
                  }}
                >
                  Move back to try
                </button>
              ) : (
                <Link
                  href={`/main/actions/${action.id}`}
                  className={menuItem}
                  onClick={() => setMenuOpen(false)}
                >
                  Finish this mission…
                </Link>
              )}
              <button
                type="button"
                className={`${menuItem} text-rose-300/85`}
                onClick={() => {
                  onStatus(action.id, "dismissed");
                  setMenuOpen(false);
                }}
              >
                Remove from list
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- agent suggestion card ---------------- */

function SuggestionCardRow({
  s,
  onSave,
  onDismiss,
  pending,
}: {
  s: Suggestion;
  onSave: (s: Suggestion) => void;
  onDismiss: (s: Suggestion) => void;
  pending: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-3.5 py-3">
      <div className="flex items-center gap-2">
        <span className="text-[14.5px] font-semibold text-white">{s.title}</span>
        {s.lane && LANE_LABEL[s.lane] ? (
          <span className="text-[11px] uppercase tracking-[0.13em] text-white/40">{LANE_LABEL[s.lane]}</span>
        ) : null}
      </div>
      <p className="mt-1 text-[13px] leading-[1.55] text-white/62">{s.why}</p>
      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => onSave(s)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[12.5px] font-medium text-white/88 transition hover:bg-white/[0.1] disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add to my list
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => onDismiss(s)}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12.5px] text-white/45 transition hover:text-white/75 disabled:opacity-50"
        >
          Not for me
        </button>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function ActionsPage() {
  const [actions, setActions] = React.useState<Action[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());

  const [suggestions, setSuggestions] = React.useState<Suggestion[] | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pendingSug, setPendingSug] = React.useState<Set<string>>(new Set());

  const loadActions = React.useCallback(async () => {
    try {
      const r = await fetch("/api/guidance/actions", { credentials: "include" });
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (d?.ok && Array.isArray(d.actions)) setActions(d.actions);
      else setFailed(true);
    } catch {
      setFailed(true);
    }
  }, []);

  React.useEffect(() => {
    loadActions();
  }, [loadActions]);

  // Tracks background-warm polling so a cold cache shows the skeleton and fills
  // in when ready, instead of the page blocking on a live generation.
  const pollRef = React.useRef<{ attempts: number; timer: ReturnType<typeof setTimeout> | null }>({
    attempts: 0,
    timer: null,
  });

  const fetchSuggestions = React.useCallback(async (force: boolean) => {
    try {
      const r = await fetch("/api/guidance/action-suggestions", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ force }),
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      const list = d?.ok && d.payload && Array.isArray(d.payload.suggestions) ? d.payload.suggestions : [];

      // Cold cache: the backend is warming suggestions in the background and has
      // nothing yet. Keep the skeleton and poll (~90s max) rather than flashing
      // an empty state or waiting on a synchronous AI call.
      if (d?.generating && list.length === 0 && pollRef.current.attempts < 18) {
        pollRef.current.attempts += 1;
        setSuggestions(null);
        pollRef.current.timer = setTimeout(() => fetchSuggestions(false), 5000);
        return;
      }
      pollRef.current.attempts = 0;
      setSuggestions(list);
    } catch {
      setSuggestions([]);
    }
  }, []);

  React.useEffect(() => {
    fetchSuggestions(false);
    return () => {
      if (pollRef.current.timer) clearTimeout(pollRef.current.timer);
    };
  }, [fetchSuggestions]);

  const setStatus = React.useCallback(
    async (id: string, status: ActionStatus) => {
      const prev = actions;
      setActions((cur) => (cur ? cur.map((a) => (a.id === id ? { ...a, status } : a)) : cur));
      setPendingIds((s) => new Set(s).add(id));
      try {
        const res = await fetch("/api/guidance/actions", {
          method: "PATCH",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        if (!res.ok) throw new Error();
        emitActionsChanged();
      } catch {
        setActions(prev ?? null);
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

  const commitSuggestion = React.useCallback(
    async (s: Suggestion, status: "saved" | "dismissed") => {
      setPendingSug((p) => new Set(p).add(s.id));
      try {
        const res = await fetch("/api/guidance/actions", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sourceType: "agent",
            sourceRef: `agent:${s.id}`,
            lane: s.lane,
            title: s.title,
            description: s.why,
            status,
          }),
        });
        if (!res.ok) throw new Error();
        setSuggestions((cur) => (cur ? cur.filter((x) => x.id !== s.id) : cur));
        if (status === "saved") {
          emitActionAdded(s.title);
          await loadActions();
        }
      } catch {
        // leave the suggestion in place so the user can retry
      } finally {
        setPendingSug((p) => {
          const n = new Set(p);
          n.delete(s.id);
          return n;
        });
      }
    },
    [loadActions]
  );

  const refreshSuggestions = React.useCallback(async () => {
    setRefreshing(true);
    setSuggestions(null);
    await fetchSuggestions(true);
    setRefreshing(false);
  }, [fetchSuggestions]);

  const inProgress = (actions ?? []).filter((a) => a.status === "doing");
  const toTry = (actions ?? []).filter((a) => a.status === "saved");
  const active = [...inProgress, ...toTry];
  const done = (actions ?? []).filter((a) => a.status === "done");
  const hasSuggestions = (suggestions?.length ?? 0) > 0;
  const pageEmpty =
    actions !== null && active.length === 0 && done.length === 0 && suggestions !== null && !hasSuggestions;

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
          Real next-steps you bookmarked while exploring — plus a few ideas from your guide.
        </p>
      </div>

      <div className="space-y-4">
        {/* Suggested for you (agent) */}
        {suggestions === null || hasSuggestions ? (
          <SectionCard tone="hero">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/62">
                <Sparkles className="h-3.5 w-3.5 text-cyan-200/80" />
                Suggested for you
              </h2>
              <button
                type="button"
                onClick={refreshSuggestions}
                disabled={refreshing || suggestions === null}
                aria-label="Refresh suggestions"
                title="Fresh ideas"
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] text-white/50 transition hover:text-white/85 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
            {suggestions === null ? (
              <div className="animate-pulse space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-[86px] rounded-2xl bg-white/[0.04]" />
                ))}
                <p className="pt-1 text-[12.5px] text-white/45">Reading what you've shared…</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {suggestions!.map((s) => (
                  <SuggestionCardRow
                    key={s.id}
                    s={s}
                    onSave={(x) => commitSuggestion(x, "saved")}
                    onDismiss={(x) => commitSuggestion(x, "dismissed")}
                    pending={pendingSug.has(s.id)}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        ) : null}

        {/* Committed actions */}
        {pageEmpty ? (
          <SectionCard
            tone="hero"
            backdrop={<ConstellationAnchor seed="actions-empty" accent={{ r: 92, g: 180, b: 255 }} />}
          >
            <div className="flex flex-col items-start gap-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-cyan-200/85">
                <Compass className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-white">
                  {failed ? "Couldn't load your actions" : "Your next moves live here"}
                </h2>
                <p className="mt-1.5 max-w-md text-[14px] leading-[1.6] text-white/70">
                  {failed
                    ? "Something went wrong loading your list — try refreshing."
                    : "As you explore, tap “Add to my Actions” on anything worth trying and it lands here. Then check it off and watch it light up."}
                </p>
              </div>
              <Link
                href="/main/explore"
                className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-[13.5px] font-semibold text-white transition hover:bg-white/[0.12]"
              >
                <Compass className="h-4 w-4" />
                Find something to try
              </Link>
            </div>
          </SectionCard>
        ) : (
          <>
            {inProgress.length > 0 ? (
              <SectionCard tone="neutral">
                <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  In progress ({inProgress.length})
                </h2>
                <div className="space-y-2">
                  {inProgress.map((a) => (
                    <ActionRow key={a.id} action={a} onStatus={setStatus} pending={pendingIds.has(a.id)} />
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {toTry.length > 0 ? (
              <SectionCard tone="neutral">
                <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  To try ({toTry.length})
                </h2>
                <div className="space-y-2">
                  {toTry.map((a) => (
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
          </>
        )}
      </div>
    </div>
  );
}
