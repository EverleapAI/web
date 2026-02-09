// src/app/main/components/nextSteps/ActionCard.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";

import type { ActionItem, ActionProof, ActionStatus } from "@/app/main/domain/actions";
import {
  loadActions,
  saveActions,
  upsertAction,
  createAction,
  setActionStatus,
  attachActionProof,
  findLatestActionForPage,
} from "@/app/main/domain/actions";

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

  /**
   * Embedded mode:
   * - reduces internal chrome
   * - removes nested sub-cards in expanded content
   */
  embedded?: boolean;
};

/* =============================================================================
   UI helpers
   ============================================================================= */

function ring(dark: boolean) {
  return dark ? "ring-1 ring-white/10" : "ring-1 ring-black/8";
}

function calmSurface(dark: boolean) {
  // Weather-like: calm, predictable contrast
  return dark ? "bg-slate-950/22" : "bg-white/85";
}

function muted(dark: boolean) {
  return dark ? "text-white/60" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/78" : "text-slate-700";
}

function pill(dark: boolean, selected = false) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    "text-xs font-semibold transition active:scale-95",
    "backdrop-blur-md",
    dark
      ? "border-white/12 bg-white/8 text-white/85 hover:bg-white/12"
      : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    selected
      ? dark
        ? "ring-1 ring-emerald-300/24"
        : "ring-1 ring-emerald-500/18"
      : "",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function headerChip(dark: boolean) {
  // Compact chip: "Action"
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    "text-xs font-semibold",
    "backdrop-blur-md",
    dark
      ? "border-violet-300/16 bg-violet-300/10 text-violet-100/90"
      : "border-violet-500/18 bg-violet-500/10 text-violet-900",
  ].join(" ");
}

function statusBadge(dark: boolean, status: ActionStatus) {
  // Subtle status badge (secondary)
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold";

  if (dark) {
    if (status === "done") return `${base} border-white/12 bg-white/6 text-white/72`;
    if (status === "started") return `${base} border-white/12 bg-white/6 text-white/72`;
    return `${base} border-white/12 bg-white/6 text-white/72`;
  }

  return `${base} border-black/10 bg-black/3 text-slate-700`;
}

function statusLabel(status: ActionStatus) {
  if (status === "done") return "Done";
  if (status === "started") return "In progress";
  return "Planned";
}

function headerToggle(dark: boolean) {
  // Small, unobtrusive control (left-aligned with chips, like TinyTask)
  return [
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5",
    "text-xs font-semibold",
    "transition active:scale-[0.99]",
    dark
      ? "border-white/12 bg-white/6 text-white/75 hover:bg-white/10"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
    "focus-visible:outline-none",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-white/16"
      : "focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
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
  label = "Action",
  subtitle = "Bigger than a Tiny Task — something real you can do and log.",
  embedded = false,
}: Props) {
  const [items, setItems] = React.useState<ActionItem[]>([]);
  const [open, setOpen] = React.useState(false);

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

    const persisted = next.find((x) => x.id === current.id) ?? current;
    return persisted;
  }

  function onStart() {
    const persisted = ensurePersisted();
    const next = setActionStatus(
      items.some((x) => x.id === persisted.id) ? items : loadActions({ useLocal }),
      persisted.id,
      "started",
    );
    persist(next);
  }

  function onDone() {
    const persisted = ensurePersisted();
    const next = setActionStatus(
      items.some((x) => x.id === persisted.id) ? items : loadActions({ useLocal }),
      persisted.id,
      "done",
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
    if (!trimmed) {
      setProofOpen(false);
      return;
    }

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

  const titleId = React.useId();

  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl px-5 py-4",
        ring(dark),
        calmSurface(dark),
        "backdrop-blur-2xl",
        embedded
          ? dark
            ? "shadow-[0_18px_60px_rgba(0,0,0,0.16)]"
            : "shadow-[0_12px_34px_rgba(0,0,0,0.10)]"
          : dark
            ? "shadow-[0_22px_80px_rgba(0,0,0,0.20)]"
            : "shadow-[0_14px_40px_rgba(0,0,0,0.10)]",
      ].join(" ")}
      aria-labelledby={titleId}
    >
      {/* Accent rail + subtle glow + watermark */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={[
            "absolute left-0 top-0 h-full w-1",
            dark ? "bg-violet-300/55" : "bg-violet-500/45",
          ].join(" ")}
        />

        <div
          className={[
            "absolute -top-20 -left-24 h-[260px] w-[260px] rounded-full blur-3xl",
            dark ? "bg-violet-300/10" : "bg-violet-400/8",
          ].join(" ")}
        />
        <div
          className={[
            "absolute -bottom-24 -right-24 h-[320px] w-[320px] rounded-full blur-3xl",
            dark ? "bg-amber-300/8" : "bg-amber-400/6",
          ].join(" ")}
        />

        <div
          className={[
            "absolute right-5 top-5 opacity-[0.07]",
            dark ? "text-white" : "text-slate-900",
          ].join(" ")}
          aria-hidden
        >
          <Rocket className="h-14 w-14" />
        </div>

        <div
          className={[
            "absolute inset-x-0 top-0 h-px",
            dark ? "bg-white/10" : "bg-black/8",
          ].join(" ")}
        />
      </div>

      <div className="relative">
        {/* Header row: left-aligned controls (match TinyTask) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={headerChip(dark)}>
            <span aria-hidden className="opacity-90">
              ⚡
            </span>
            <span>{label}</span>
          </span>

          <span className={statusBadge(dark, status)}>
            <span
              aria-hidden
              className={[
                "h-1.5 w-1.5 rounded-full",
                status === "done"
                  ? "bg-emerald-300/75"
                  : status === "started"
                    ? "bg-sky-300/75"
                    : dark
                      ? "bg-white/22"
                      : "bg-black/18",
              ].join(" ")}
            />
            {statusLabel(status)}
          </span>

          <button
            type="button"
            className={headerToggle(dark)}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`${titleId}-panel`}
          >
            <span aria-hidden className="opacity-80">
              {open ? "▾" : "▸"}
            </span>
            {open ? "Hide" : "Details"}
          </button>
        </div>

        <div className="mt-3 min-w-0">
          <div id={titleId} className={`text-[16px] font-semibold leading-snug ${text(dark)}`}>
            {definition.title}
          </div>

          <div className={`mt-1 text-sm leading-relaxed ${softText(dark)}`}>
            <span className={`font-semibold ${text(dark)}`}>Goal:</span> {definition.goal}
          </div>

          {/* Keep the collapsed card calm; only show subtitle when open */}
          {open && subtitle ? (
            <div className={`mt-2 text-xs ${muted(dark)}`}>{subtitle}</div>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={`${titleId}-panel`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="mt-4"
            >
              {/* Steps (inline, no nested "card") */}
              {definition.steps?.length ? (
                <div className="mt-1">
                  <div
                    className={[
                      "text-xs font-semibold uppercase tracking-[0.18em]",
                      dark ? "text-white/50" : "text-slate-500",
                    ].join(" ")}
                  >
                    Steps
                  </div>

                  <ul className="mt-3 space-y-2">
                    {definition.steps.map((s, idx) => (
                      <li key={`${definition.id}_step_${idx}`} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className={[
                            "mt-2 inline-block h-1.5 w-1.5 rounded-full",
                            dark ? "bg-white/30" : "bg-black/20",
                          ].join(" ")}
                        />
                        <div className={`text-sm leading-relaxed ${softText(dark)}`}>{s}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Logs */}
              {proofEntries.length ? (
                <div className="mt-5">
                  <div
                    className={[
                      "flex items-center justify-between gap-3",
                      "text-xs font-semibold uppercase tracking-[0.18em]",
                      dark ? "text-white/50" : "text-slate-500",
                    ].join(" ")}
                  >
                    <span>Your logs</span>
                    <span className="normal-case tracking-normal font-semibold">
                      {proofEntries.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {proofEntries.slice(0, 3).map((e, idx) => {
                      const tsOk = Number.isFinite(e.ts);
                      return (
                        <div
                          key={`${tsOk ? e.ts : "legacy"}_${idx}`}
                          className={[
                            "rounded-2xl border px-3.5 py-3",
                            "backdrop-blur-xl",
                            dark ? "border-white/10 bg-white/6" : "border-black/10 bg-white/90",
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
                  {typeof updatedAt === "number" ? (
                    <div className={`mt-2 text-xs ${muted(dark)}`}>
                      Updated {relativeTime(updatedAt)}.
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {status !== "started" ? (
                  <button type="button" className={pill(dark)} onClick={onStart}>
                    <span aria-hidden className="opacity-80">
                      ▶
                    </span>
                    Start
                  </button>
                ) : null}

                {status !== "done" ? (
                  <button type="button" className={pill(dark)} onClick={onDone}>
                    <span aria-hidden className="opacity-80">
                      ✓
                    </span>
                    Mark done
                  </button>
                ) : null}

                <button type="button" className={pill(dark)} onClick={onLogProof}>
                  <span aria-hidden className="opacity-80">
                    ✎
                  </span>
                  Log result
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Proof modal (kept as-is, just calm surface + consistent rings) */}
        {proofOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
              onClick={() => setProofOpen(false)}
              aria-hidden
            />

            <div
              role="dialog"
              aria-modal="true"
              className={[
                "relative w-full max-w-xl overflow-hidden rounded-[28px] border backdrop-blur-2xl",
                dark
                  ? "border-white/15 bg-white/9 shadow-[0_28px_95px_rgba(0,0,0,0.45)]"
                  : "border-black/10 bg-white/90 shadow-[0_28px_95px_rgba(0,0,0,0.22)]",
              ].join(" ")}
            >
              <div className="relative px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className={`text-lg font-semibold ${text(dark)}`}>How did that go?</div>

                    <div className={`mt-1 text-sm ${muted(dark)}`}>
                      You just tried:{" "}
                      <span
                        className={
                          dark ? "text-white/85 font-semibold" : "text-slate-900 font-semibold"
                        }
                      >
                        {definition.title}
                      </span>
                    </div>

                    <div className={`mt-2 text-sm ${muted(dark)}`}>
                      One or two sentences is enough — we’ll keep a running log (newest first).
                    </div>
                  </div>

                  <button type="button" className={pill(dark)} onClick={() => setProofOpen(false)}>
                    Close
                  </button>
                </div>

                <div className="mt-4">
                  <textarea
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="What did you do, and what happened?"
                    rows={4}
                    className={[
                      "w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition",
                      dark
                        ? "border-white/12 bg-white/7 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-emerald-300/26 focus-visible:border-white/18"
                        : "border-black/10 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/18 focus-visible:border-black/15",
                    ].join(" ")}
                  />

                  <div className={`mt-2 text-xs ${muted(dark)}`}>
                    Tip: one concrete detail helps (a link, who you asked, what feedback you got).
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className={`text-xs ${muted(dark)}`}>Stored locally for now.</div>

                  <button
                    type="button"
                    className={[
                      pill(dark, true),
                      !(proofText ?? "").trim() ? "opacity-50" : "",
                    ].join(" ")}
                    onClick={saveProof}
                    disabled={!(proofText ?? "").trim()}
                  >
                    Save →
                  </button>
                </div>

                {proofEntries.length ? (
                  <div className={`mt-4 text-xs ${muted(dark)}`}>
                    Latest log:{" "}
                    <span className={dark ? "text-white/80" : "text-slate-800"}>
                      {proofEntries[0]?.text?.slice(0, 64) ?? ""}
                      {proofEntries[0]?.text && proofEntries[0].text.length > 64 ? "…" : ""}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
