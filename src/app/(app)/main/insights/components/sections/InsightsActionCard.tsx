"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, PencilLine } from "lucide-react";

import type {
  ActionItem,
  ActionStatus,
} from "@/app/(app)/main/domain/actions";

import {
  loadActions,
  saveActions,
  upsertAction,
  createAction,
  findLatestActionForPage,
} from "@/app/(app)/main/domain/actions";

import {
  bodyText,
  bulletText,
  headerIconWrap,
  headerLabel,
  headerRow,
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

function statusLabel(status: ActionStatus) {
  if (status === "done") return "Done";
  if (status === "started") return "In progress";
  return "Planned";
}

function statusPillClass(dark: boolean, status: ActionStatus) {
  if (status === "done") {
    return dark
      ? "border border-emerald-300/18 bg-emerald-300/10 text-emerald-100/82"
      : "border border-emerald-500/18 bg-emerald-500/10 text-emerald-700";
  }

  if (status === "started") {
    return dark
      ? "border border-violet-300/18 bg-violet-300/10 text-violet-100/82"
      : "border border-violet-500/18 bg-violet-500/10 text-violet-700";
  }

  return dark
    ? "border border-white/10 bg-white/[0.04] text-white/60"
    : "border border-black/10 bg-black/[0.03] text-slate-600";
}

function primaryActionLink(dark: boolean) {
  return [
    "inline-flex items-center justify-center rounded-full px-3.5 py-2 text-[13px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "bg-white/[0.08] text-white/82 hover:bg-white/[0.12]"
      : "bg-slate-950 text-white hover:bg-slate-800",
  ].join(" ");
}

function secondaryActionLink(dark: boolean) {
  return [
    "inline-flex items-center justify-center rounded-full px-3.5 py-2 text-[13px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "bg-white/[0.04] text-white/68 hover:bg-white/[0.07]"
      : "bg-black/5 text-slate-700 hover:bg-black/10",
  ].join(" ");
}

function textAreaClass(dark: boolean) {
  return [
    "w-full rounded-2xl border px-3.5 py-3 text-[14px] leading-6 transition",
    "focus:outline-none focus-visible:ring-2",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/82 placeholder:text-white/28 focus-visible:ring-violet-300/20"
      : "border-black/10 bg-black/[0.02] text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-500/20",
  ].join(" ");
}

function bulletDotClass(dark: boolean) {
  return dark
    ? "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-200/55 ring-1 ring-violet-100/12"
    : "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500/70 ring-1 ring-violet-600/12";
}

function updateStatus(
  items: ActionItem[],
  actionId: string,
  status: ActionStatus
): ActionItem[] {
  return items.map((item) => {
    if (item.id !== actionId) return item;
    return {
      ...item,
      status,
    };
  });
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
  const [proofOpen, setProofOpen] = React.useState(false);
  const [proofText, setProofText] = React.useState("");
  const [lastSavedNote, setLastSavedNote] = React.useState("");

  React.useEffect(() => {
    setItems(loadActions({ useLocal }));
  }, [useLocal]);

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

  function persist(next: ActionItem[]) {
    setItems(next);
    saveActions(next, { useLocal });
  }

  function ensurePersisted(): ActionItem {
    if (isPersisted) return current;

    const next = upsertAction(items, current);
    persist(next);
    return next.find((x) => x.id === current.id) ?? current;
  }

  function onStart() {
    const persisted = ensurePersisted();
    const next = updateStatus(items, persisted.id, "started");
    persist(next);
  }

  function onDone() {
    const persisted = ensurePersisted();
    const next = updateStatus(items, persisted.id, "done");
    persist(next);
  }

  function onLogResult() {
    ensurePersisted();
    setProofOpen(true);
  }

  function onSaveProof() {
    const trimmed = proofText.trim();
    if (!trimmed) return;

    setLastSavedNote(trimmed);
    setProofText("");
    setProofOpen(false);
  }

  const status = (current.status ?? "planned") as ActionStatus;

  return (
    <section className={sectionCard(dark, "action")}>
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
          <div className={headerLabel(dark)}>{eyebrow}</div>
        </div>

        <div className={sectionTitle(dark)}>{actionTitle}</div>

        {hasStrongSignal ? (
          <>
            {body ? (
              <p className={["mt-3", bodyText(dark)].join(" ")}>{body}</p>
            ) : null}

            {safeBullets.length ? (
              <ul
                className={[
                  "mt-4 space-y-3 border-t pt-4",
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
            ) : (
              <p className={["mt-3", bodyText(dark)].join(" ")}>
                Once we have a stronger signal, this section will suggest one
                concrete move you can test right away.
              </p>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div
                className={[
                  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                  statusPillClass(dark, status),
                ].join(" ")}
              >
                {statusLabel(status)}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {status !== "started" ? (
                  <button
                    type="button"
                    onClick={onStart}
                    className={secondaryActionLink(dark)}
                  >
                    Start
                  </button>
                ) : null}

                {status !== "done" ? (
                  <button
                    type="button"
                    onClick={onDone}
                    className={primaryActionLink(dark)}
                  >
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Mark done
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={onLogResult}
                  className={secondaryActionLink(dark)}
                >
                  <PencilLine className="mr-1.5 h-3.5 w-3.5" />
                  Log result
                </button>
              </div>
            </div>

            {lastSavedNote ? (
              <div
                className={[
                  "mt-4 rounded-[18px] border px-4 py-3",
                  dark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-black/10 bg-black/[0.02]",
                ].join(" ")}
              >
                <div
                  className={
                    dark
                      ? "text-[12px] font-semibold uppercase tracking-[0.16em] text-white/46"
                      : "text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  }
                >
                  Latest note
                </div>
                <p className={["mt-2", bodyText(dark)].join(" ")}>
                  {lastSavedNote}
                </p>
              </div>
            ) : null}

            <AnimatePresence initial={false}>
              {proofOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className={[
                    "mt-4 rounded-[20px] border p-4",
                    dark
                      ? "border-white/10 bg-white/[0.035]"
                      : "border-black/10 bg-black/[0.02]",
                  ].join(" ")}
                >
                  <div
                    className={
                      dark
                        ? "text-[14px] font-medium text-white/82"
                        : "text-[14px] font-medium text-slate-900"
                    }
                  >
                    What happened?
                  </div>

                  <textarea
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    rows={4}
                    placeholder="Write a quick note about what you tried, what happened, or what stood out."
                    className={["mt-3", textAreaClass(dark)].join(" ")}
                  />

                  <div className="mt-4 flex flex-wrap justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProofText("");
                        setProofOpen(false);
                      }}
                      className={secondaryActionLink(dark)}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={onSaveProof}
                      className={primaryActionLink(dark)}
                    >
                      Save note
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : (
          <p className={["mt-3", bodyText(dark)].join(" ")}>
            Actions are the concrete next moves that turn insight into traction.
            They help you test something real instead of just thinking about it.
            As we gather more signal, this will sharpen into one clear next step.
          </p>
        )}
      </div>
    </section>
  );
}