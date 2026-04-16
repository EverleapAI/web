"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

import {
  bodyText,
  bulletText,
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
  mutedText,
  sectionCard,
  sectionTitle,
  subDivider,
} from "./summaryShared";

type Props = {
  dark: boolean;
  useLocal: boolean;
  eyebrow?: string;
  title?: string;
  body?: string;
  bullets?: string[];
  hasStrongSignal: boolean;
  pageId?: string;
};

function primaryActionLink(dark: boolean) {
  return [
    "group inline-flex items-center gap-1.5",
    "text-[14.5px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/80 hover:text-white/92"
      : "text-slate-900 hover:text-black",
  ].join(" ");
}

function secondaryActionLink(dark: boolean) {
  return [
    "group inline-flex items-center gap-1.5",
    "text-[14px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-white/62 hover:text-white/76"
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

function textAreaClass(dark: boolean) {
  return [
    "mt-3 w-full rounded-2xl border px-3.5 py-3 text-[14px] leading-6 transition",
    "focus:outline-none focus-visible:ring-2",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/82 placeholder:text-white/28 focus-visible:ring-violet-300/20"
      : "border-black/10 bg-black/[0.02] text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-500/20",
  ].join(" ");
}

function actionButton(dark: boolean, emph = false) {
  return [
    "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition",
    "focus-visible:outline-none",
    dark
      ? emph
        ? "bg-white/[0.08] text-white/80 hover:bg-white/[0.12]"
        : "bg-white/[0.04] text-white/60 hover:bg-white/[0.07]"
      : emph
        ? "bg-slate-950 text-white hover:bg-slate-800"
        : "bg-black/5 text-slate-700 hover:bg-black/10",
  ].join(" ");
}

function bulletDotClass(dark: boolean) {
  return dark
    ? "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-200/55 ring-1 ring-violet-100/12"
    : "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500/70 ring-1 ring-violet-600/12";
}

function logRow(dark: boolean) {
  return [
    "py-3",
    dark
      ? "border-t border-white/8 first:border-t-0"
      : "border-t border-black/8 first:border-t-0",
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

export default function InsightsActionCard({
  dark,
  useLocal,
  eyebrow = "Actions",
  title,
  body,
  bullets = [],
  hasStrongSignal,
  pageId = "insights.summary",
}: Props) {
  const safeBullets = React.useMemo(
    () => bullets.map((b) => (b ?? "").trim()).filter(Boolean).slice(0, 3),
    [bullets]
  );

  const actionTitle = title?.trim() || "Run one small test this week.";
  const actionGoal =
    body?.trim() ||
    "Take one small step that turns the pattern you’re seeing into something real.";

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
    const latest = findLatestActionForPage(items, pageId);
    if (latest) return latest;

    return createAction({
      id: "insights_action",
      title: actionTitle,
      goal: actionGoal,
      steps: safeBullets,
      sourcePageId: pageId,
    });
  }, [items, pageId, actionTitle, actionGoal, safeBullets]);

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
    <section
      className={[
        sectionCard(dark, "action"),
        "overflow-hidden px-4 py-4 sm:px-5 sm:py-5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(190,140,255,0.10) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(255,180,120,0.05) 0%, transparent 22%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "violet")}>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>{eyebrow}</div>
            </div>
          </div>

          {constellationOrnament(dark, "action")}
        </div>

        <div className={cardBody()}>
          <div className={sectionTitle(dark)}>{actionTitle}</div>

          {hasStrongSignal ? (
            <>
              {body ? (
                <p
                  className={[
                    "mt-3",
                    bodyText(dark),
                    "text-[14.5px] leading-6 sm:text-[15px]",
                  ].join(" ")}
                >
                  {body}
                </p>
              ) : null}

              {safeBullets.length ? (
                <ul
                  className={[
                    "mt-4 space-y-2.5 border-t pt-4",
                    subDivider(dark),
                  ].join(" ")}
                >
                  {safeBullets.map((bullet, index) => (
                    <li key={`${bullet}_${index}`} className="flex gap-3">
                      <span aria-hidden className={bulletDotClass(dark)} />
                      <span className={bulletText(dark)}>{bullet}</span>
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
                            <div
                              className={[
                                "mt-1.5 text-[14px] leading-6",
                                dark ? "text-white/78" : "text-slate-900",
                              ].join(" ")}
                            >
                              {log.text}
                            </div>
                          ) : null}
                        </div>

                        <div
                          className={[
                            "shrink-0 pt-0.5 text-[11px]",
                            mutedText(dark),
                          ].join(" ")}
                        >
                          {formatTimestamp(log.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-4">
                {status === "planned" && (
                  <motion.button
                    type="button"
                    onClick={onStart}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={primaryActionLink(dark)}
                  >
                    Start
                  </motion.button>
                )}

                {status === "started" && (
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
                )}

                {status === "done" && (
                  <motion.button
                    type="button"
                    onClick={onReopen}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={primaryActionLink(dark)}
                  >
                    Reopen
                  </motion.button>
                )}
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
                    <div
                      className={
                        dark
                          ? "text-[14px] font-medium text-white/82"
                          : "text-[14px] font-medium text-slate-900"
                      }
                    >
                      What did you notice?
                    </div>

                    <textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      rows={5}
                      placeholder="Write a quick note about what you tried, what happened, or what stood out."
                      className={textAreaClass(dark)}
                    />

                    <div className="mt-3 flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditorOpen(false);
                          setTextValue("");
                        }}
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
            </>
          ) : (
            <>
              <p
                className={[
                  "mt-3",
                  bodyText(dark),
                  "text-[14.5px] leading-6 sm:text-[15px]",
                ].join(" ")}
              >
                Actions are the next moves that turn insight into something real.
              </p>

              <p
                className={[
                  "mt-2",
                  mutedText(dark),
                  "text-[13.5px] leading-5 sm:text-[14px]",
                ].join(" ")}
              >
                Once Everleap has more signal, this sharpens into one clearer move
                you can actually test.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}