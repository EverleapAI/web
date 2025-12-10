// src/components/main/AiGuideModal.tsx
"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

type AiGuideModalProps = {
  onClose: () => void;
  title: string;          // currently unused visually
  subtitle: string;       // friendly one-line message, e.g. “Hi Tom…”
  suggestions?: string[]; // reserved for future use
};

export function AiGuideModal({
  onClose,
  subtitle,
}: AiGuideModalProps) {
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);

  const handleSubmit = (e: FormEvent | KeyboardEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    // Later: send draft / voice transcript to backend.
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    // Visual-only for now; later this can start/stop recording.
    setListening((prev) => !prev);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >
      {/* Outer gradient frame for glass panel */}
      <div
        className="relative w-full max-w-xl rounded-[2rem] bg-gradient-to-br from-sky-500/60 via-indigo-500/40 to-pink-500/60 p-[1px] shadow-[0_30px_120px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tiny floating glow orbs around the border */}
        <div className="pointer-events-none absolute -top-2 left-10 h-3 w-3 rounded-full bg-sky-400/80 blur-[2px] animate-pulse" />
        <div className="pointer-events-none absolute bottom-0 right-14 h-3 w-3 rounded-full bg-pink-400/80 blur-[2px] animate-ping" />

        {/* Inner glass panel */}
        <div className="relative rounded-[1.95rem] border border-slate-700/70 bg-slate-950/80 px-6 py-7 backdrop-blur-2xl md:px-8 md:py-8">
          {/* Close “X” */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 hover:bg-slate-800/80 hover:text-slate-100"
            aria-label="Close"
          >
            ×
          </button>

          {/* Tiny label */}
          <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Your AI guide
          </p>

          {/* Orb + mic */}
          <div className="mt-2 flex flex-col items-center">
            {/* Main glowing orb */}
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500 to-pink-500 shadow-[0_0_50px_rgba(56,189,248,0.9)]" />
              <div className="absolute inset-3 rounded-full bg-slate-950/40 shadow-[0_0_26px_rgba(15,23,42,1)]" />
            </div>

            {/* Mic button (no text) */}
            <button
              type="button"
              onClick={toggleListening}
              className={`mt-5 flex h-10 w-10 items-center justify-center rounded-full border text-lg transition-all ${
                listening
                  ? "border-rose-400 bg-rose-500/20 text-rose-100 shadow-[0_0_18px_rgba(248,113,113,0.7)] scale-105"
                  : "border-slate-600 bg-slate-900/90 text-slate-100 hover:border-sky-400 hover:text-sky-100"
              }`}
              title="(Coming soon) Talk instead of typing"
            >
              🎤
            </button>
          </div>

          {/* Friendly one-line intro */}
          <p className="mt-7 text-center text-base leading-relaxed text-slate-100 md:text-lg">
            {subtitle}
          </p>

          {/* Single input – type + Enter to “speak” */}
          <form onSubmit={handleSubmit} className="mt-8 flex justify-center">
            <input
              autoFocus
              className="w-full max-w-md border-b border-slate-600 bg-transparent pb-2 text-sm text-slate-100 outline-none placeholder-slate-500 focus:border-sky-400"
              placeholder="Say one thing that’s on your mind…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
