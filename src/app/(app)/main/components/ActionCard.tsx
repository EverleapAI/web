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
};

/* =============================================================================
   Type system
   ============================================================================= */

function muted(dark: boolean) {
  return dark ? "text-white/40" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white/82" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/60" : "text-slate-700";
}

function actionLink(dark: boolean) {
  return [
    "text-sm font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/66 hover:text-white/78 focus-visible:ring-2 focus-visible:ring-white/12"
      : "text-slate-700 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
}

function drawerButton(dark: boolean, emph = false) {
  return [
    "inline-flex items-center justify-center rounded-full px-3.5 py-2 text-xs font-medium transition",
    "focus-visible:outline-none",
    dark
      ? emph
        ? "bg-white/[0.10] text-white/82 hover:bg-white/[0.14] focus-visible:ring-2 focus-visible:ring-white/12"
        : "bg-white/[0.05] text-white/66 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white/10"
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
    setItems(loadActions({ useLocal }));
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

  const isPersisted = items.some((x) => x.id === current.id);

  function persist(next: ActionItem[]) {
    setItems(next);
    saveActions(next, { useLocal });
  }

  function ensurePersisted(): ActionItem {
    if (isPersisted) return current;
    const next = upsertAction(items, current, { touchUpdatedAt: true });
    persist(next);
    return next.find((x) => x.id === current.id) ?? current;
  }

  function onStart() {
    const persisted = ensurePersisted();
    persist(setActionStatus(items, persisted.id, "started"));
  }

  function onDone() {
    const persisted = ensurePersisted();
    persist(setActionStatus(items, persisted.id, "done"));
  }

  function onLogProof() {
    ensurePersisted();
    setProofText("");
    setProofOpen(true);
  }

  function saveProof() {
    const persisted = ensurePersisted();
    const trimmed = proofText.trim();
    if (!trimmed) return;

    const proof: ActionProof = { kind: "text", text: trimmed };
    persist(attachActionProof(items, persisted.id, proof));
    setProofOpen(false);
  }

  const persistedItem = items.find((x) => x.id === current.id);
  const status = (persistedItem?.status ?? current.status) as ActionStatus;

  return (
    <>
      <div className="mt-4">
        {definition.steps?.length && (
          <ul className="space-y-2">
            {definition.steps.map((s, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                <div className={`text-sm leading-relaxed ${softText(dark)}`}>
                  {s}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className={`mt-4 text-xs ${muted(dark)}`}>
          {statusLabel(status)}
        </div>

        <div className="mt-4 flex flex-wrap gap-5">
          <button type="button" onClick={onStart} className={actionLink(dark)}>
            Start
          </button>
          <button type="button" onClick={onDone} className={actionLink(dark)}>
            Mark done
          </button>
          <button
            type="button"
            onClick={onLogProof}
            className={actionLink(dark)}
          >
            Log result
          </button>
        </div>
      </div>

      <AnimatePresence>
        {proofOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/42"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProofOpen(false)}
            />

            <motion.div
              className="fixed inset-x-0 top-6 bottom-[92px] z-50 flex items-end px-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="mx-auto flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/98 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <div className="flex-1 overflow-y-auto p-5 pb-4">
                  <div className={`text-lg font-semibold ${text(dark)}`}>
                    What happened?
                  </div>

                  <textarea
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    rows={5}
                    className="mt-3 min-h-[140px] w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
                  />
                </div>

                <div className="flex shrink-0 items-center justify-between border-t border-white/10 bg-[#0b1020]/98 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setProofOpen(false)}
                    className={drawerButton(dark, false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveProof}
                    className={drawerButton(dark, true)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}