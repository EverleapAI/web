"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

import {
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
  sectionCard,
} from "./summaryShared";
import { CardBody } from "@/lib/ui/card";

type QuickRating = "mostly" | "somewhat" | "not_really";

type Props = {
  dark: boolean;
  contextTag: string;
  pageKey?: "insights_summary" | "insights_motivations" | "insights_strengths" | "insights_skills";
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
    "inline-flex items-center gap-1.5",
    "rounded-full border px-3 py-1.5",
    "text-meta font-semibold",
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
    "relative overflow-hidden rounded-panel border",
    "backdrop-blur-2xl",
    dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white/80",
    "shadow-[0_10px_28px_rgba(0,0,0,0.14)]",
  ].join(" ");
}

function saveButton(dark: boolean, disabled: boolean) {
  return [
    "h-9 rounded-xl px-3 text-meta font-semibold",
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
  pageKey = "insights_summary",
}: Props): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<QuickRating | null>(null);
  const [note, setNote] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  function onPick(next: QuickRating) {
    setRating(next);
    setSaved(false);
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  async function onSave() {
    if (!rating) return;

    setSaving(true);

    try {
      const res = await fetch("/api/guidance/insights-summary/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, note, contextTag, page_key: pageKey }),
      });

      if (!res.ok) {
        console.error("Failed to save quick check feedback", {
          status: res.status,
          body: await res.text(),
        });
        return;
      }

      setSaved(true);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save quick check feedback", error);
    } finally {
      setSaving(false);
    }
  }

  const canSave = !!rating && !saving;

  return (
    <section
      className={[
        sectionCard(dark, "neutral"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
      ].join(" ")}
    >
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

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Quick Check</div>
            </div>
          </div>

          {constellationOrnament(dark, "neutral")}
        </div>

        <div className={cardBody()}>
          <div className="flex flex-wrap gap-1.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className={quickChip(dark, rating === "mostly", "good")}
              onClick={() => onPick("mostly")}
            >
              👍 Mostly right
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className={quickChip(dark, rating === "somewhat", "mid")}
              onClick={() => onPick("somewhat")}
            >
              🙂 Somewhat
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className={quickChip(dark, rating === "not_really", "bad")}
              onClick={() => onPick("not_really")}
            >
              👎 Not really
            </motion.button>

            {saved ? (
              <div
                className={[
                  "ml-1 flex items-center text-micro",
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
              open ? "mt-2.5 max-h-[320px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className={softInputShell(dark)}>
              <div className="relative p-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div>
                    <div className={headerLabel(dark)}>Add a note</div>
                    <CardBody className="mt-0.5">One sentence is enough.</CardBody>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className={[
                      "h-8 rounded-full px-2.5 text-micro font-semibold border",
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
                    "mt-2.5 w-full resize-none rounded-panel px-3 py-2.5 text-label",
                    "bg-transparent outline-none ring-1 ring-inset",
                    dark
                      ? "text-white/66 placeholder:text-white/28 ring-white/12"
                      : "text-slate-900 placeholder:text-slate-500 ring-black/10",
                  ].join(" ")}
                />

                <div className="mt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-meta opacity-70"
                  >
                    Skip
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}