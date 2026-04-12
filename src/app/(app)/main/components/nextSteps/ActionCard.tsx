"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import type {
  ActionItem,
  ActionProof,
  ActionStatus,
} from "@/app/(app)/main/domain/actions";
import {
  loadActions,
  saveActions,
  upsertAction,
  createAction,
  setActionStatus,
  attachActionProof,
  findLatestActionForPage,
} from "@/app/(app)/main/domain/actions";

/* =============================================================================
   Types
   ============================================================================= */

export type ActionDefinition = {
  id: string;
  pageId: string;
  title: string;
  goal: string;
  steps?: string[];
  instanceStrategy?: "reuse_latest" | "new_each_time";
};

type Props = {
  dark: boolean;
  useLocal: boolean;
  definition: ActionDefinition;
  label?: string;
  subtitle?: string;
  embedded?: boolean;
  alwaysExpanded?: boolean;
};

/* =============================================================================
   UI helpers
   ============================================================================= */

function muted(dark: boolean) {
  return dark ? "text-white/44" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white/88" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/60" : "text-slate-700";
}

function actionLink(dark: boolean) {
  return [
    "text-sm font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/62 hover:text-white/82 focus-visible:ring-2 focus-visible:ring-white/14"
      : "text-slate-700 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
}

function drawerButton(dark: boolean, emph = false) {
  return [
    "inline-flex items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold transition",
    "focus-visible:outline-none",
    dark
      ? emph
        ? "bg-white/90 text-slate-950 hover:bg-white/84 focus-visible:ring-2 focus-visible:ring-white/16"
        : "bg-white/[0.06] text-white/72 hover:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-white/12"
      : emph
        ? "bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900/12"
        : "bg-black/5 text-slate-700 hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-slate-900/10",
  ].join(" ");
}

function statusLabel(status: ActionStatus) {
  if (status === "done") return "Done";
  if (status === "started") return "In progress";
  return "Planned";
}

function relativeTime(ts: number) {
  const d = Date.now() - ts;
  const min = Math.floor(d / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

/* =============================================================================
   Proof log encoding
   ============================================================================= */

type ProofEntry = { ts: number; text: string };

function encodeEntry(ts: number, t: string) {
  return `[[ts:${ts}]] ${t}`;
}

function parseEntries(raw: string | null | undefined): ProofEntry[] {
  const s = (raw ?? "").trim();
  if (!s) return [];

  const parts = s
    .split(/\n{2,}/g)
    .map((x) => x.trim())
    .filter(Boolean);

  const entries: ProofEntry[] = [];
  for (const p of parts) {
    const m = p.match(/^\[\[ts:(\d+)\]\]\s*/);
    if (m) {
      const ts = Number(m[1]);
      const body = p.replace(/^\[\[ts:\d+\]\]\s*/, "").trim();
      if (Number.isFinite(ts) && body) entries.push({ ts, text: body });
      continue;
    }
    entries.push({ ts: NaN, text: p });
  }

  const hasTs = entries.some((e) => Number.isFinite(e.ts));
  if (hasTs) {
    const sorted = entries
      .map((e, i) => ({ ...e, __order: i }))
      .sort((a, b) => {
        const at = Number.isFinite(a.ts) ? a.ts : -Infinity;
        const bt = Number.isFinite(b.ts) ? b.ts : -Infinity;
        if (bt !== at) return bt - at;
        return b.__order - a.__order;
      });

    return sorted.map((e) => ({ ts: e.ts, text: e.text }));
  }

  return entries;
}

function appendEntry(existingRaw: string | null | undefined, nextText: string) {
  const base = (existingRaw ?? "").trim();
  const entry = encodeEntry(Date.now(), nextText.trim());
  if (!base) return entry;
  return `${base}\n\n${entry}`;
}

/* =============================================================================
   Component
   ============================================================================= */

export function ActionCard({
  dark,
  useLocal,
  definition,
}: Props) {
  const [items, setItems] = React.useState<ActionItem[]>([]);
  const [proofOpen, setProofOpen] = React.useState(false);
  const [proofText, setProofText] = React.useState("");

  React.useEffect(() => {
    const loaded = loadActions({ useLocal });
    setItems(loaded);
  }, [useLocal]);

  const current = React.useMemo(() => {
    const latest = findLatestActionForPage(items, definition.pageId);
    if (definition.instanceStrategy !== "new_each_time" && latest) return latest;

    return createAction({
      id: definition.id,
      title: definition.title,
      goal: definition.goal,
      steps: definition.steps,
      sourcePageId: definition.pageId,
    });
  }, [items, definition]);

  const isPersisted = React.useMemo(() => {
    return items.some((x) => x.id === current.id);
  }, [items, current.id]);

  function persist(nextItems: ActionItem[]) {
    setItems(nextItems);
    saveActions(nextItems, { useLocal });
  }

  function ensurePersisted(): ActionItem {
    if (isPersisted) return current;

    const next = upsertAction(items, current, { touchUpdatedAt: true });
    persist(next);
    return next.find((x) => x.id === current.id) ?? current;
  }

  function onStart() {
    const persisted = ensurePersisted();
    const next = setActionStatus(
      items.some((x) => x.id === persisted.id) ? items : loadActions({ useLocal }),
      persisted.id,
      "started"
    );
    persist(next);
  }

  function onDone() {
    const persisted = ensurePersisted();
    const next = setActionStatus(
      items.some((x) => x.id === persisted.id) ? items : loadActions({ useLocal }),
      persisted.id,
      "done"
    );
    persist(next);
  }

  function onLogProof() {
    ensurePersisted();
    setProofText("");
    setProofOpen(true);
  }

  function saveProof() {
    const persisted = ensurePersisted();
    const trimmed = (proofText ?? "").trim();
    if (!trimmed) return;

    const live = items.find((x) => x.id === persisted.id) ?? persisted;
    const existingText = live.proof?.kind === "text" ? live.proof.text ?? "" : "";
    const combined = appendEntry(existingText, trimmed);

    const proof: ActionProof = { kind: "text", text: combined };
    const next = attachActionProof(items, persisted.id, proof);
    persist(next);
    setProofOpen(false);
  }

  const persistedItem = isPersisted ? items.find((x) => x.id === current.id) : null;

  const status = (persistedItem?.status ?? current.status) as ActionStatus;
  const proof = persistedItem?.proof ?? current.proof;
  const updatedAt = persistedItem?.updatedAt ?? current.updatedAt;

  const proofEntries = React.useMemo(() => {
    if (proof?.kind !== "text") return [];
    return parseEntries(proof.text);
  }, [proof]);

  return (
    <>
      <div className="mt-4">
        {definition.steps?.length ? (
          <ul className="space-y-2">
            {definition.steps.map((s, idx) => (
              <li key={`${definition.id}_step_${idx}`} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={[
                    "mt-2 inline-block h-1.5 w-1.5 rounded-full",
                    dark ? "bg-white/22" : "bg-black/20",
                  ].join(" ")}
                />
                <div className={`text-sm leading-relaxed ${softText(dark)}`}>{s}</div>
              </li>
            ))}
          </ul>
        ) : null}

        <div className={`mt-4 text-xs ${muted(dark)}`}>
          {statusLabel(status)}
          {typeof updatedAt === "number" ? ` · Updated ${relativeTime(updatedAt)}` : ""}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {status !== "started" ? (
            <button type="button" className={actionLink(dark)} onClick={onStart}>
              Start
            </button>
          ) : null}

          {status !== "done" ? (
            <button type="button" className={actionLink(dark)} onClick={onDone}>
              Mark done
            </button>
          ) : null}

          <button type="button" className={actionLink(dark)} onClick={onLogProof}>
            Log result
          </button>
        </div>

        {proofEntries.length ? (
          <div className="mt-6">
            <div
              className={[
                "text-[11px] font-semibold uppercase tracking-[0.18em]",
                dark ? "text-white/38" : "text-slate-500",
              ].join(" ")}
            >
              Your logs
            </div>

            <div className="mt-3 space-y-3">
              {proofEntries.slice(0, 3).map((e, idx) => {
                const tsOk = Number.isFinite(e.ts);
                return (
                  <div
                    key={`${tsOk ? e.ts : "legacy"}_${idx}`}
                    className={[
                      "rounded-2xl border px-3.5 py-3",
                      dark ? "border-white/8 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]",
                    ].join(" ")}
                  >
                    <div className={`text-sm leading-relaxed ${softText(dark)}`}>{e.text}</div>
                    <div className={`mt-1 text-xs ${muted(dark)}`}>
                      {tsOk ? relativeTime(e.ts) : "Earlier"}
                    </div>
                  </div>
                );
              })}
            </div>

            {proofEntries.length > 3 ? (
              <div className={`mt-3 text-xs ${muted(dark)}`}>Showing the latest 3.</div>
            ) : null}
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {proofOpen ? (
          <>
            <motion.div
              aria-hidden
              className="fixed inset-0 z-40 bg-black/42"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProofOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl"
              initial={{ y: "100%", opacity: 0.96 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.96 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <div
                className={[
                  "mx-3 mb-3 overflow-hidden rounded-[28px] border shadow-[0_-18px_60px_rgba(0,0,0,0.28)]",
                  dark
                    ? "border-white/10 bg-[#0b1020]/98"
                    : "border-black/10 bg-white/98",
                ].join(" ")}
              >
                <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
                  <div className="flex justify-center">
                    <div
                      className={[
                        "h-1.5 w-12 rounded-full",
                        dark ? "bg-white/10" : "bg-black/10",
                      ].join(" ")}
                    />
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className={`text-lg font-semibold ${text(dark)}`}>
                        What happened?
                      </div>

                      <div className={`mt-1 text-sm ${muted(dark)}`}>
                        You tried:{" "}
                        <span
                          className={
                            dark
                              ? "font-semibold text-white/82"
                              : "font-semibold text-slate-900"
                          }
                        >
                          {definition.title}
                        </span>
                      </div>

                      <div className={`mt-2 text-sm ${muted(dark)}`}>
                        One or two sentences is enough.
                      </div>
                    </div>

                    <button
                      type="button"
                      className={drawerButton(dark)}
                      onClick={() => setProofOpen(false)}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={proofText}
                      onChange={(e) => setProofText(e.target.value)}
                      placeholder="What did you notice?"
                      rows={5}
                      className={[
                        "w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition",
                        dark
                          ? "border-white/10 bg-white/[0.04] text-white/84 placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-white/12 focus-visible:border-white/14"
                          : "border-black/10 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-900/12 focus-visible:border-black/15",
                      ].join(" ")}
                    />

                    <div className={`mt-2 text-xs ${muted(dark)}`}>
                      Tip: one concrete detail helps.
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      className={drawerButton(dark)}
                      onClick={() => setProofOpen(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className={[
                        drawerButton(dark, true),
                        !(proofText ?? "").trim() ? "opacity-50" : "",
                      ].join(" ")}
                      onClick={saveProof}
                      disabled={!(proofText ?? "").trim()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}