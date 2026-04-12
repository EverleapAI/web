"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { ActionItem, ActionProof } from "@/app/(app)/main/domain/actions";
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
  return dark ? "text-white/50" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white/84" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/68" : "text-slate-700";
}

function noteText(dark: boolean) {
  return dark ? "text-white/90" : "text-slate-950";
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

function primaryActionLink(dark: boolean) {
  return [
    "group inline-flex items-center gap-1.5",
    "text-[15px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/86 hover:text-white focus-visible:ring-2 focus-visible:ring-white/12"
      : "text-slate-900 hover:text-black focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
}

function secondaryActionLink(dark: boolean) {
  return [
    "group inline-flex items-center gap-1.5",
    "text-[15px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/78 hover:text-white/92 focus-visible:ring-2 focus-visible:ring-white/12"
      : "text-slate-800 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
}

/* =============================================================================
   Component
   ============================================================================= */

export function ActionCard({ dark, useLocal, definition }: Props) {
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

  function onLogProof() {
    const persisted = ensurePersisted();
    const existingProof = persisted.proof;

    if (existingProof?.kind === "text") {
      setProofText(existingProof.text);
    } else {
      setProofText("");
    }

    setProofOpen(true);
  }

  function saveProof() {
    const persisted = ensurePersisted();
    const trimmed = proofText.trim();
    if (!trimmed) return;

    const proof: ActionProof = { kind: "text", text: trimmed };

    let next = attachActionProof(items, persisted.id, proof);
    next = setActionStatus(next, persisted.id, "done");

    persist(next);
    setProofOpen(false);
  }

  const persistedItem = items.find((x) => x.id === current.id);
  const resolvedItem = persistedItem ?? current;
  const proof = resolvedItem.proof;
  const hasTextProof = proof?.kind === "text" && proof.text.trim().length > 0;

  return (
    <>
      <div>
        {definition.steps?.length ? (
          <ul className="space-y-2">
            {definition.steps.map((s, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                <div className={`text-[15px] leading-7 ${softText(dark)}`}>
                  {s}
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {hasTextProof ? (
          <div className="mt-5">
            <div className={`text-[13px] ${muted(dark)}`}>Your note</div>

            <div
              className={`mt-1.5 max-w-[42rem] text-[18px] leading-7 ${noteText(
                dark
              )}`}
            >
              {proof.text}
            </div>

            <div className="mt-3">
              <motion.button
                type="button"
                onClick={onLogProof}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={secondaryActionLink(dark)}
              >
                <span>Edit note</span>
                <span className="transition-transform group-hover:translate-x-[2px]">
                  →
                </span>
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <div className={`text-[13px] ${muted(dark)}`}>Give this a try</div>

            <div className="mt-3">
              <motion.button
                type="button"
                onClick={onStart}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={primaryActionLink(dark)}
              >
                <span>Start</span>
                <span className="transition-transform group-hover:translate-x-[2px]">
                  →
                </span>
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {proofOpen ? (
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
                    {hasTextProof ? "Edit your note" : "What did you notice?"}
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
        ) : null}
      </AnimatePresence>
    </>
  );
}