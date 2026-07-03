"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import PromptLabModal, {
  type PromptLabPageKey,
  type PromptLabTargetField,
} from "./PromptLabModal";

type Props = {
  dark: boolean;
  pageKey: PromptLabPageKey;
  targetField: PromptLabTargetField;
  currentText: string;
};

export function PasscodeStep({
  open,
  onClose,
  onUnlocked,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
  dark: boolean;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [passcode, setPasscode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    setPasscode("");
    setError(null);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/prompt-lab/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Incorrect passcode.");
        return;
      }

      onUnlocked();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const overlay = dark ? "bg-black/55" : "bg-black/35";
  const surface = dark
    ? "border-white/14 bg-slate-950 text-white/86"
    : "border-slate-900/10 bg-white text-slate-950";

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div className={`absolute inset-0 ${overlay}`} onClick={onClose} aria-hidden="true" />

          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={[
              "relative w-full max-w-xs rounded-[18px] border p-4",
              surface,
              "shadow-[0_18px_90px_rgba(0,0,0,0.4)]",
            ].join(" ")}
          >
            <label
              htmlFor="prompt-lab-passcode"
              className={dark ? "text-[12px] font-medium text-white/50" : "text-[12px] font-medium text-slate-500"}
            >
              Passcode
            </label>
            <input
              id="prompt-lab-passcode"
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={[
                "mt-1 w-full rounded-[10px] border px-3 py-2 text-[14px] focus:outline-none focus:ring-2",
                dark
                  ? "border-white/14 bg-white/5 text-white/90 focus:ring-sky-300/40"
                  : "border-black/10 bg-white text-slate-950 focus:ring-sky-500/30",
              ].join(" ")}
            />

            {error ? <p className="mt-2 text-[12.5px] text-rose-400">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting || !passcode}
              className={[
                "mt-3 w-full rounded-full px-4 py-2 text-[13px] font-semibold transition",
                dark
                  ? "bg-sky-300/20 text-sky-100 ring-1 ring-sky-300/30 hover:bg-sky-300/28"
                  : "bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/25 hover:bg-sky-500/22",
                submitting || !passcode ? "opacity-60" : "",
              ].join(" ")}
            >
              {submitting ? "Checking…" : "Unlock"}
            </button>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export default function PromptLabTrigger({ dark, pageKey, targetField, currentText }: Props) {
  const [passcodeOpen, setPasscodeOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  async function handleTriggerClick() {
    try {
      const res = await fetch("/api/prompt-lab/status", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (data?.unlocked) {
        setModalOpen(true);
        return;
      }
    } catch {
      // fall through to passcode step
    }

    setPasscodeOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-label="Prompt Lab"
        className={[
          "absolute right-2 top-2 z-10 h-2.5 w-2.5 rounded-full transition-opacity",
          dark ? "bg-white/20 hover:bg-white/40" : "bg-black/15 hover:bg-black/30",
          "opacity-40 hover:opacity-100",
        ].join(" ")}
      />

      <PasscodeStep
        open={passcodeOpen}
        dark={dark}
        onClose={() => setPasscodeOpen(false)}
        onUnlocked={() => {
          setPasscodeOpen(false);
          setModalOpen(true);
        }}
      />

      <PromptLabModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dark={dark}
        pageKey={pageKey}
        targetField={targetField}
        currentText={currentText}
      />
    </>
  );
}
