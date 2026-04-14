"use client";

import * as React from "react";
import { Shield } from "lucide-react";

import {
  headerIconWrap,
  headerLabel,
  headerRow,
  mutedText,
  sectionCard,
} from "./summaryShared";

type QuickRating = "mostly" | "somewhat" | "not_really";

const QUICK_FEEDBACK_STORAGE_KEY = "everleap.insights.quickFeedback.v1";

type Props = {
  dark: boolean;
  contextTag: string;
};

function quickChip(dark: boolean, active: boolean) {
  return [
    "inline-flex items-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark ? "border-white/10" : "border-black/10",
    active
      ? dark
        ? "bg-white/[0.10] text-white/76 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_36px_rgba(0,0,0,0.28)]"
        : "bg-white text-slate-900 shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
      : dark
        ? "bg-white/[0.04] text-white/56 hover:bg-white/[0.06]"
        : "bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

function softInputShell(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[20px] border",
    "backdrop-blur-2xl",
    dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white/80",
    "shadow-[0_14px_36px_rgba(0,0,0,0.16)]",
  ].join(" ");
}

function saveButton(dark: boolean, disabled: boolean) {
  return [
    "h-10 rounded-2xl px-4 text-[13px] font-semibold",
    "transition active:scale-[0.99]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    disabled
      ? dark
        ? "cursor-not-allowed bg-white/[0.07] text-white/32 border border-white/10"
        : "cursor-not-allowed bg-black/5 text-black/40 border border-black/10"
      : dark
        ? "bg-white/90 text-slate-950 hover:bg-white"
        : "bg-slate-900 text-white hover:bg-slate-900/90",
  ].join(" ");
}

function readLocalQuickFeedback(): {
  rating: QuickRating;
  note: string;
  savedAt: number;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUICK_FEEDBACK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const rec = parsed as {
      rating?: unknown;
      note?: unknown;
      savedAt?: unknown;
    };

    const rating =
      rec.rating === "mostly" ||
      rec.rating === "somewhat" ||
      rec.rating === "not_really"
        ? rec.rating
        : null;

    const note = typeof rec.note === "string" ? rec.note : "";
    const savedAt =
      typeof rec.savedAt === "number" && Number.isFinite(rec.savedAt)
        ? rec.savedAt
        : 0;

    if (!rating) return null;
    return { rating, note, savedAt };
  } catch {
    return null;
  }
}

function writeLocalQuickFeedback(v: { rating: QuickRating; note: string }) {
  if (typeof window === "undefined") return;
  const payload = { ...v, savedAt: Date.now() };
  window.localStorage.setItem(
    QUICK_FEEDBACK_STORAGE_KEY,
    JSON.stringify(payload)
  );
}

export default function InsightsQuickCheckCard({
  dark,
  contextTag,
}: Props): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<QuickRating | null>(null);
  const [note, setNote] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const existing = readLocalQuickFeedback();
    if (!existing) return;
    setRating(existing.rating);
    setNote(existing.note ?? "");
    setSaved(true);
  }, []);

  function onPick(next: QuickRating) {
    setRating(next);
    setSaved(false);
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  function onSave() {
    if (!rating) return;

    writeLocalQuickFeedback({
      rating,
      note: (note ?? "").trim(),
    });

    setSaved(true);
    setOpen(false);
  }

  const canSave = !!rating;

  return (
    <section className={sectionCard(dark, "neutral")}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(255,180,120,0.08) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(120,200,255,0.05) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "neutral")}>
            <Shield className="h-3.5 w-3.5" />
          </div>
          <div className={headerLabel(dark)}>Quick Check</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={quickChip(dark, rating === "mostly")}
            onClick={() => onPick("mostly")}
          >
            <span aria-hidden>👍</span>
            <span>Mostly right</span>
          </button>

          <button
            type="button"
            className={quickChip(dark, rating === "somewhat")}
            onClick={() => onPick("somewhat")}
          >
            <span aria-hidden>🙂</span>
            <span>Somewhat</span>
          </button>

          <button
            type="button"
            className={quickChip(dark, rating === "not_really")}
            onClick={() => onPick("not_really")}
          >
            <span aria-hidden>👎</span>
            <span>Not really</span>
          </button>

          {saved ? (
            <div
              className={[
                "ml-1 flex items-center text-[12px]",
                dark ? "text-white/36" : "text-slate-600",
              ].join(" ")}
            >
              (Saved locally)
            </div>
          ) : null}
        </div>

        <div
          className={[
            "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
            open ? "mt-3 max-h-[340px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
          aria-hidden={!open}
        >
          <div className={softInputShell(dark)}>
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(520px 220px at 12% 0%, rgba(255,170,110,0.12), transparent 62%)," +
                    "radial-gradient(520px 220px at 88% 0%, rgba(120,160,255,0.08), transparent 62%)," +
                    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  opacity: dark ? 1 : 0.7,
                }}
              />
            </div>

            <div className="relative p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className={headerLabel(dark)}>Quick feedback</div>
                  <div className={["mt-1", mutedText(dark)].join(" ")}>
                    Add a note if something felt off or especially accurate.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className={[
                    "shrink-0 h-9 rounded-full px-3 text-[12px] font-semibold border backdrop-blur-xl transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
                    dark
                      ? "border-white/10 bg-white/[0.04] text-white/56 hover:bg-white/[0.07]"
                      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                  ].join(" ")}
                >
                  Close
                </button>
              </div>

              <div className="mt-3">
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    if (saved) setSaved(false);
                  }}
                  rows={3}
                  placeholder="Tell us what felt off / missing / dead-on…"
                  className={[
                    "w-full resize-none rounded-[18px] px-4 py-3 text-[14px] leading-relaxed",
                    "bg-transparent outline-none ring-1 ring-inset",
                    dark
                      ? "text-white/66 placeholder:text-white/28 ring-white/12 focus:ring-white/18"
                      : "text-slate-900 placeholder:text-slate-500 ring-black/10 focus:ring-black/15",
                    "focus-visible:ring-2 focus-visible:ring-orange-200/20",
                  ].join(" ")}
                  style={{
                    boxShadow:
                      "inset 0 0 0 1px rgba(0,0,0,0.08), " +
                      "inset 0 14px 26px rgba(0,0,0,0.14), " +
                      "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                  aria-label={`Quick feedback note (${contextTag})`}
                />
                <div className={["mt-2 text-[12px]", mutedText(dark)].join(" ")}>
                  Tip: one sentence is enough.
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNote("");
                    setSaved(false);
                    setOpen(false);
                  }}
                  className={[
                    "h-10 rounded-2xl px-4 text-[13px] font-semibold border backdrop-blur-xl transition active:scale-[0.99]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
                    dark
                      ? "border-white/10 bg-white/[0.03] text-white/54 hover:bg-white/[0.06]"
                      : "border-black/10 bg-white/70 text-slate-800 hover:bg-white",
                  ].join(" ")}
                >
                  Skip note
                </button>

                <button
                  type="button"
                  onClick={onSave}
                  disabled={!canSave}
                  className={saveButton(dark, !canSave)}
                >
                  Save
                </button>
              </div>

              <div
                className={[
                  "mt-3 text-[11px] leading-relaxed",
                  dark ? "text-white/24" : "text-slate-500",
                ].join(" ")}
              >
                Saved to localStorage:{" "}
                <span className={dark ? "text-white/32" : "text-slate-600"}>
                  {QUICK_FEEDBACK_STORAGE_KEY}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}