"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { countWords } from "@/lib/utils";

export type PromptLabPageKey =
  | "today"
  | "insights_summary"
  | "insights_motivations"
  | "insights_strengths"
  | "insights_skills"
  | "explore_summary";

export type PromptLabTargetField = "main" | "item_0" | "item_1" | "item_2";

export type PromptLabAppliedPreview = {
  targetWordCount: number;
  toneInstruction: string;
  miscNote: string;
  targetText: string;
  result: Record<string, unknown>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  dark: boolean;
  pageKey: PromptLabPageKey;
  targetField: PromptLabTargetField;
  currentText: string;
  onApplied?: (preview: PromptLabAppliedPreview) => void;
  hasActivePreview?: boolean;
  onReset?: () => void;
};

type PreviewResponse = {
  ok: boolean;
  error?: string;
  requested_word_count?: number;
  applied_word_count?: number;
  target_text?: string;
  result?: Record<string, unknown>;
};

export default function PromptLabModal({
  open,
  onClose,
  dark,
  pageKey,
  targetField,
  currentText,
  onApplied,
  hasActivePreview,
  onReset,
}: Props) {
  const [mounted, setMounted] = React.useState(false);
  const [targetWordCount, setTargetWordCount] = React.useState(
    () => countWords(currentText) || 80
  );
  const [toneInstruction, setToneInstruction] = React.useState("");
  const [miscNote, setMiscNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<PreviewResponse | null>(null);
  const [showFullCard, setShowFullCard] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      setPreview(null);
      setError(null);
      setCopied(false);
      setShowFullCard(false);
    }
  }, [open]);

  const currentWordCount = countWords(currentText);
  const isItemTarget = targetField !== "main";

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await fetch("/api/prompt-lab/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_key: pageKey,
          target_field: targetField,
          target_word_count: targetWordCount,
          tone_instruction: toneInstruction,
          misc_note: miscNote,
        }),
      });

      const data = (await res.json().catch(() => null)) as PreviewResponse | null;

      if (!res.ok || !data?.ok || !data.target_text || !data.result) {
        setError(data?.error ?? "Generation failed. Try again.");
        return;
      }

      setPreview(data);

      onApplied?.({
        targetWordCount,
        toneInstruction,
        miscNote,
        targetText: data.target_text,
        result: data.result,
      });
    } catch {
      setError("Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopySettings() {
    const summary = [
      `Word count: ${targetWordCount}`,
      `Tone: ${toneInstruction || "(none)"}`,
      `Note: ${miscNote || "(none)"}`,
      "",
      "--- Generated content ---",
      preview?.target_text ?? "",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access can fail silently (e.g. insecure context); no-op
    }
  }

  const overlay = dark ? "bg-black/55" : "bg-black/35";
  const surface = dark
    ? "border-white/14 bg-slate-950 text-white/86"
    : "border-slate-900/10 bg-white text-slate-950";
  const inputBase = dark
    ? "w-full rounded-control border border-white/14 bg-white/5 px-3 py-2 text-label text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
    : "w-full rounded-control border border-black/10 bg-white px-3 py-2 text-label text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30";
  const labelBase = dark ? "text-meta font-medium text-white/50" : "text-meta font-medium text-slate-500";

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center px-4 pb-4 pt-4 sm:items-center sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div className={`absolute inset-0 ${overlay}`} onClick={onClose} aria-hidden="true" />

          <motion.div
            initial={{ y: 22, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={[
              "relative w-full max-w-lg overflow-hidden rounded-card border",
              surface,
              "backdrop-blur-xl shadow-[0_18px_90px_rgba(0,0,0,0.4)]",
              "max-h-[85vh] flex flex-col",
            ].join(" ")}
          >
            <div className="relative flex items-center justify-between px-5 py-4">
              <div className={labelBase}>Prompt Lab — {pageKey} / {targetField}</div>

              <button
                type="button"
                onClick={onClose}
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
                  dark
                    ? "border-white/14 bg-white/10 text-white/78 hover:bg-white/14"
                    : "border-slate-900/10 bg-black/5 text-slate-700 hover:bg-black/10",
                ].join(" ")}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto px-5 pb-6 space-y-4">
              {hasActivePreview ? (
                <div
                  className={[
                    "flex items-center justify-between gap-3 rounded-control px-3 py-2.5",
                    dark ? "bg-amber-300/10 ring-1 ring-amber-300/25" : "bg-amber-500/10 ring-1 ring-amber-500/20",
                  ].join(" ")}
                >
                  <p className={[labelBase, "leading-5"].join(" ")}>
                    This card is showing a live preview, not the saved version.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onReset?.();
                      onClose();
                    }}
                    className={[
                      "shrink-0 rounded-full px-3 py-1.5 text-meta font-medium transition",
                      dark
                        ? "bg-white/10 text-white/82 hover:bg-white/16"
                        : "bg-black/5 text-slate-800 hover:bg-black/10",
                    ].join(" ")}
                  >
                    Reset to live version
                  </button>
                </div>
              ) : null}

              {isItemTarget ? (
                <p className={[labelBase, "leading-5"].join(" ")}>
                  This regenerates the whole card to keep the voice consistent across
                  items — may take a few seconds.
                </p>
              ) : null}

              <div>
                <div className={labelBase}>Current word count</div>
                <div className="mt-1 text-label font-medium">{currentWordCount} words</div>
              </div>

              <div>
                <label className={labelBase} htmlFor="prompt-lab-word-count">
                  New target word count
                </label>
                <input
                  id="prompt-lab-word-count"
                  type="number"
                  min={20}
                  max={400}
                  value={targetWordCount}
                  onChange={(e) => setTargetWordCount(Number(e.target.value) || 0)}
                  className={[inputBase, "mt-1"].join(" ")}
                />
              </div>

              <div>
                <label className={labelBase} htmlFor="prompt-lab-tone">
                  Tone instruction (one sentence)
                </label>
                <input
                  id="prompt-lab-tone"
                  type="text"
                  value={toneInstruction}
                  onChange={(e) => setToneInstruction(e.target.value)}
                  placeholder="e.g. warmer and more playful"
                  className={[inputBase, "mt-1"].join(" ")}
                />
              </div>

              <div>
                <label className={labelBase} htmlFor="prompt-lab-misc">
                  Misc note
                </label>
                <textarea
                  id="prompt-lab-misc"
                  value={miscNote}
                  onChange={(e) => setMiscNote(e.target.value)}
                  rows={2}
                  placeholder="Anything else to factor in"
                  className={[inputBase, "mt-1 resize-none"].join(" ")}
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className={[
                  "w-full rounded-full px-4 py-2.5 text-label font-semibold transition",
                  dark
                    ? "bg-sky-300/20 text-sky-100 ring-1 ring-sky-300/30 hover:bg-sky-300/28"
                    : "bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/25 hover:bg-sky-500/22",
                  loading ? "opacity-60" : "",
                ].join(" ")}
              >
                {loading ? "Generating…" : "Generate"}
              </button>

              {error ? (
                <div className="space-y-2">
                  <p className="text-meta text-rose-400">{error}</p>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className={labelBase}
                  >
                    Try again
                  </button>
                </div>
              ) : null}

              {preview ? (
                <div className="space-y-3 border-t border-current/10 pt-4">
                  <p className={labelBase}>Applied to the card behind this modal.</p>

                  <div>
                    <div className={labelBase}>
                      New word count: {countWords(preview.target_text)}
                      {preview.applied_word_count !== preview.requested_word_count ? (
                        <span> (clamped to {preview.applied_word_count})</span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-label leading-read">
                      {preview.target_text}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFullCard((v) => !v)}
                    className={labelBase}
                  >
                    {showFullCard ? "Hide" : "Show"} full regenerated card (for context)
                  </button>

                  {showFullCard ? (
                    <pre
                      className={[
                        "max-h-64 overflow-auto rounded-control p-3 text-meta leading-body",
                        dark ? "bg-white/5" : "bg-black/5",
                      ].join(" ")}
                    >
                      {JSON.stringify(preview.result, null, 2)}
                    </pre>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleCopySettings}
                    className={[
                      "w-full rounded-full px-4 py-2 text-meta font-medium transition",
                      dark
                        ? "bg-white/8 text-white/78 hover:bg-white/12"
                        : "bg-black/5 text-slate-700 hover:bg-black/10",
                    ].join(" ")}
                  >
                    {copied ? "Copied!" : "Copy settings + generated content"}
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
