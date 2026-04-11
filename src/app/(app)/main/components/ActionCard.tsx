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
  embedded?: boolean;
  alwaysExpanded?: boolean;
};

/* =============================================================================
   UI helpers
   ============================================================================= */

function muted(dark: boolean) {
  return dark ? "text-white/60" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/75" : "text-slate-700";
}

function actionLink(dark: boolean) {
  return [
    "text-sm font-medium transition",
    dark ? "text-white/80 hover:text-white" : "text-slate-700 hover:text-black",
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
  alwaysExpanded = false,
}: Props) {
  const [items, setItems] = React.useState<ActionItem[]>([]);
  const [open, setOpen] = React.useState(alwaysExpanded);
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
    const next = setActionStatus(items, persisted.id, "started");
    persist(next);
  }

  function onDone() {
    const persisted = ensurePersisted();
    const next = setActionStatus(items, persisted.id, "done");
    persist(next);
  }

  function onLogProof() {
    ensurePersisted();
    setProofOpen(true);
  }

  function saveProof() {
    const persisted = ensurePersisted();
    const trimmed = proofText.trim();
    if (!trimmed) return;

    const proof: ActionProof = { kind: "text", text: trimmed };
    const next = attachActionProof(items, persisted.id, proof);
    persist(next);
    setProofOpen(false);
  }

  const persistedItem = items.find((x) => x.id === current.id);
  const status = (persistedItem?.status ?? current.status) as ActionStatus;

  return (
    <div className="mt-4">

      {/* Title + Goal */}
      <div className={`text-[16px] font-semibold ${text(dark)}`}>
        {definition.title}
      </div>

      <div className={`mt-1 text-sm ${softText(dark)}`}>
        {definition.goal}
      </div>

      {/* Steps */}
      {definition.steps?.length ? (
        <ul className="mt-4 space-y-2">
          {definition.steps.map((s, i) => (
            <li key={i} className={`text-sm ${softText(dark)}`}>
              • {s}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Status */}
      <div className={`mt-3 text-xs ${muted(dark)}`}>
        {statusLabel(status)}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-5">
        {status !== "started" && (
          <button onClick={onStart} className={actionLink(dark)}>
            Start
          </button>
        )}

        {status !== "done" && (
          <button onClick={onDone} className={actionLink(dark)}>
            Mark done
          </button>
        )}

        <button onClick={onLogProof} className={actionLink(dark)}>
          Log result
        </button>
      </div>

      {/* Modal */}
      {proofOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setProofOpen(false)}
          />

          <div
            className={`relative w-full max-w-md rounded-2xl p-5 ${
              dark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
            }`}
          >
            <div className="text-lg font-semibold">What happened?</div>

            <textarea
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              className="mt-3 w-full rounded-lg border p-2 text-sm"
              rows={4}
            />

            <div className="mt-4 flex justify-between">
              <button onClick={() => setProofOpen(false)}>Cancel</button>
              <button onClick={saveProof}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}