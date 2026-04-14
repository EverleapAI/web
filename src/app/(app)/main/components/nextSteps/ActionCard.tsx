"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { ActionItem, ActionLog } from "@/app/(app)/main/domain/actions";
import {
  loadActions,
  saveActions,
  upsertAction,
  createAction,
  findLatestActionForPage,
  startAction,
  markDone,
  reopenAction,
  addNote,
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
   Header helpers
   ============================================================================= */

function ActionLead({ dark }: { dark: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      <span
        className={[
          "flex h-4 w-4 items-center justify-center rounded-[5px] border",
          dark
            ? "border-sky-200/20 bg-sky-300/10"
            : "border-sky-600/18 bg-sky-500/8",
        ].join(" ")}
      >
        <span
          className={[
            "h-[7px] w-[2px] rounded-full",
            dark ? "bg-sky-200/70" : "bg-sky-600/68",
          ].join(" ")}
        />
      </span>

      <span
        className={[
          "h-[1px] w-4 rounded-full",
          dark ? "bg-white/16" : "bg-slate-900/14",
        ].join(" ")}
      />
    </span>
  );
}

/* =============================================================================
   Style helpers
   ============================================================================= */

function muted(dark: boolean) {
  return dark ? "text-white/38" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white/76" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/54" : "text-slate-700";
}

function primaryActionLink(dark: boolean) {
  return [
    "group inline-flex items-center gap-1.5",
    "text-[14.5px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/78 hover:text-white/88"
      : "text-slate-900 hover:text-black",
  ].join(" ");
}

function secondaryActionLink(dark: boolean) {
  return [
    "group inline-flex items-center gap-1.5",
    "text-[14px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/60 hover:text-white/74"
      : "text-slate-800 hover:text-slate-950",
  ].join(" ");
}

function editorShell(dark: boolean) {
  return [
    "mt-4 rounded-[18px] border p-4",
    dark
      ? "border-white/10 bg-white/[0.03]"
      : "border-black/10 bg-black/[0.03]",
  ].join(" ");
}

function textareaClass(dark: boolean) {
  return [
    "mt-3 w-full rounded-xl border p-3 text-sm focus-visible:outline-none",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/72"
      : "border-black/10 bg-white text-slate-900",
  ].join(" ");
}

function actionButton(dark: boolean, emph = false) {
  return [
    "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition",
    "focus-visible:outline-none",
    dark
      ? emph
        ? "bg-white/[0.08] text-white/78 hover:bg-white/[0.12]"
        : "bg-white/[0.04] text-white/58 hover:bg-white/[0.07]"
      : emph
        ? "bg-slate-950 text-white hover:bg-slate-800"
        : "bg-black/5 text-slate-700 hover:bg-black/10",
  ].join(" ");
}

function logRow(dark: boolean) {
  return [
    "py-3",
    dark ? "border-t border-white/8 first:border-t-0" : "border-t border-black/8 first:border-t-0",
  ].join(" ");
}

function logBadge(dark: boolean, log: ActionLog) {
  if (log.type === "note") {
    return dark
      ? "bg-white/[0.06] text-white/52 ring-1 ring-white/8"
      : "bg-black/[0.05] text-slate-600 ring-1 ring-black/8";
  }

  const text = log.text.toLowerCase();

  if (text.includes("started")) {
    return dark
      ? "bg-sky-300/12 text-sky-100/70 ring-1 ring-sky-300/14"
      : "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/14";
  }

  if (text.includes("done")) {
    return dark
      ? "bg-emerald-300/12 text-emerald-100/70 ring-1 ring-emerald-300/14"
      : "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/14";
  }

  return dark
    ? "bg-violet-300/12 text-violet-100/70 ring-1 ring-violet-300/14"
    : "bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/14";
}

function formatTimestamp(ts: number) {
  try {
    return new Date(ts).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/* =============================================================================
   Component
   ============================================================================= */

export function ActionCard({ dark, useLocal, definition }: Props) {
  const [items, setItems] = React.useState<ActionItem[]>([]);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [textValue, setTextValue] = React.useState("");

  React.useEffect(() => {
    setItems(loadActions({ useLocal }));
  }, [useLocal]);

  function persist(next: ActionItem[]) {
    setItems(next);
    saveActions(next, { useLocal });
  }

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

  function ensurePersisted(): { action: ActionItem; nextItems: ActionItem[] } {
    if (isPersisted) {
      return { action: current, nextItems: items };
    }

    const nextItems = upsertAction(items, current);
    const action = nextItems.find((x) => x.id === current.id) ?? current;
    persist(nextItems);
    return { action, nextItems };
  }

  function onStart() {
    const { action, nextItems } = ensurePersisted();
    persist(startAction(nextItems, action.id));
  }

  function onDone() {
    const { action, nextItems } = ensurePersisted();
    persist(markDone(nextItems, action.id));
  }

  function onReopen() {
    const { action, nextItems } = ensurePersisted();
    persist(reopenAction(nextItems, action.id));
  }

  function onLog() {
    ensurePersisted();
    setTextValue("");
    setEditorOpen(true);
  }

  function saveNoteEntry() {
    const trimmed = textValue.trim();
    if (!trimmed) return;

    const { action, nextItems } = ensurePersisted();
    persist(addNote(nextItems, action.id, trimmed));
    setEditorOpen(false);
    setTextValue("");
  }

  const resolved = items.find((x) => x.id === current.id) ?? current;
  const status = resolved.status;
  const logs = resolved.logs ?? [];

  return (
    <div>
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <ActionLead dark={dark} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
            Actions
          </span>
        </div>

        <div className="text-[17px] font-semibold tracking-[-0.01em] text-white/76 sm:text-[18px]">
          {definition.title}
        </div>

        {definition.goal ? (
          <div className={`mt-1 text-[13px] leading-6 ${softText(dark)}`}>
            {definition.goal}
          </div>
        ) : null}
      </div>

      {definition.steps?.length ? (
        <ul className="space-y-1.5">
          {definition.steps.map((s, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/16" />
              <div className={`text-[14px] leading-6 ${softText(dark)}`}>
                {s}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {logs.length > 0 ? (
        <div className="mt-4">
          {logs.map((log) => (
            <div key={log.id} className={logRow(dark)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
                        logBadge(dark, log),
                      ].join(" ")}
                    >
                      {log.type === "note" ? "Log" : log.text}
                    </span>
                  </div>

                  {log.type === "note" ? (
                    <div className={`mt-1.5 text-[14px] leading-6 ${text(dark)}`}>
                      {log.text}
                    </div>
                  ) : null}
                </div>

                <div className={`shrink-0 pt-0.5 text-[11px] ${muted(dark)}`}>
                  {formatTimestamp(log.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-4">
        {status === "planned" ? (
          <motion.button
            type="button"
            onClick={onStart}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={primaryActionLink(dark)}
          >
            Start
          </motion.button>
        ) : null}

        {status === "started" ? (
          <>
            <motion.button
              type="button"
              onClick={onDone}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={primaryActionLink(dark)}
            >
              Mark done
            </motion.button>

            <motion.button
              type="button"
              onClick={onLog}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={secondaryActionLink(dark)}
            >
              Log result
            </motion.button>
          </>
        ) : null}

        {status === "done" ? (
          <motion.button
            type="button"
            onClick={onReopen}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={primaryActionLink(dark)}
          >
            Reopen
          </motion.button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {editorOpen ? (
          <motion.div
            className={editorShell(dark)}
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className={`text-base font-semibold ${text(dark)}`}>
              What did you notice?
            </div>

            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              rows={5}
              className={textareaClass(dark)}
            />

            <div className="mt-3 flex justify-between">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className={actionButton(dark)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveNoteEntry}
                className={actionButton(dark, true)}
              >
                Save
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}