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

function quickChip(dark: boolean, active: boolean, tone: "good" | "mid" | "bad") {
  const toneMap = {
    good: dark
      ? "bg-emerald-300/16 text-emerald-100/80 ring-1 ring-emerald-300/20"
      : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300",
    mid: dark
      ? "bg-amber-300/16 text-amber-100/80 ring-1 ring-amber-300/20"
      : "bg-amber-100 text-amber-700 ring-1 ring-amber-300",
    bad: dark
      ? "bg-rose-300/16 text-rose-100/80 ring-1 ring-rose-300/20"
      : "bg-rose-100 text-rose-700 ring-1 ring-rose-300",
  };

  return [
    "inline-flex items-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark ? "border-white/10" : "border-black/10",
    active
      ? toneMap[tone]
      : dark
        ? "bg-white/[0.04] text-white/60 hover:bg-white/[0.07]"
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
        ? "bg-violet-300 text-slate-950 hover:bg-violet-200"
        : "bg-slate-900 text-white hover:bg-slate-900/90",
  ].join(" ");
}

export default function InsightsQuickCheckCard({
  dark,
  contextTag,
}: Props): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<QuickRating | null>(null);
  const [note, setNote] = React.useState("");
  const [saved, setSaved] = React.useState(false);

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

    localStorage.setItem(
      QUICK_FEEDBACK_STORAGE_KEY,
      JSON.stringify({ rating, note, savedAt: Date.now() })
    );

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
            "radial-gradient(circle at 12% 0%, rgba(255,180,120,0.10) 0%, transparent 30%), radial-gradient(circle at 88% 100%, rgba(120,200,255,0.06) 0%, transparent 24%)",
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
            className={quickChip(dark, rating === "mostly", "good")}
            onClick={() => onPick("mostly")}
          >
            👍 Mostly right
          </button>

          <button
            type="button"
            className={quickChip(dark, rating === "somewhat", "mid")}
            onClick={() => onPick("somewhat")}
          >
            🙂 Somewhat
          </button>

          <button
            type="button"
            className={quickChip(dark, rating === "not_really", "bad")}
            onClick={() => onPick("not_really")}
          >
            👎 Not really
          </button>

          {saved ? (
            <div
              className={[
                "ml-1 flex items-center text-[12px]",
                dark ? "text-white/36" : "text-slate-600",
              ].join(" ")}
            >
              (Saved)
            </div>
          ) : null}
        </div>

        <div
          className={[
            "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
            open ? "mt-3 max-h-[340px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className={softInputShell(dark)}>
            <div className="relative p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={headerLabel(dark)}>Add a note</div>
                  <div className={["mt-1", mutedText(dark)].join(" ")}>
                    One sentence is enough.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className={[
                    "h-9 rounded-full px-3 text-[12px] font-semibold border",
                    dark
                      ? "border-white/10 bg-white/[0.04] text-white/56"
                      : "border-black/10 bg-white/80 text-slate-800",
                  ].join(" ")}
                >
                  Close
                </button>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="What felt off or surprisingly accurate?"
                className={[
                  "mt-3 w-full resize-none rounded-[18px] px-4 py-3 text-[14px]",
                  "bg-transparent outline-none ring-1 ring-inset",
                  dark
                    ? "text-white/66 placeholder:text-white/28 ring-white/12"
                    : "text-slate-900 placeholder:text-slate-500 ring-black/10",
                ].join(" ")}
              />

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm opacity-70"
                >
                  Skip
                </button>

                <button
                  onClick={onSave}
                  disabled={!canSave}
                  className={saveButton(dark, !canSave)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}