// src/components/main/AiGuideOrb.tsx
"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AiGuideOrbProps {
  label?: string;
  subline?: string;
  /** Where this orb was clicked from, e.g. "spotlight_page_orb" */
  source?: string;
  onClick?: () => void; // optional extra side-effect
  /** When true, render orb icon only (no text label/subline). */
  minimal?: boolean;
}

export function AiGuideOrb({
  label = "Your AI guide",
  subline,
  source,
  onClick,
  minimal = false,
}: AiGuideOrbProps) {
  const handleOpen = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("everleap-open-ai-guide", {
          detail: {
            source: source ?? "orb_click",
          },
        })
      );
    }

    if (onClick) onClick();
  };

  const orb = (
    <div className="relative h-11 w-11">
      {/* Soft pulsing halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(79,156,255,0.6), transparent 65%)",
        }}
        initial={{ opacity: 0.5, scale: 0.85 }}
        animate={{ opacity: [0.25, 0.7, 0.25], scale: [0.9, 1.05, 0.9] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core orb */}
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 shadow-[0_0_40px_rgba(79,156,255,0.75)] backdrop-blur-xl group-hover:shadow-[0_0_48px_rgba(79,156,255,0.95)]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500/40 via-indigo-500/25 to-fuchsia-500/25" />
        <Sparkles className="relative h-5 w-5 text-slate-50" />
      </div>
    </div>
  );

  // Minimal: orb only
  if (minimal) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="group inline-flex items-center justify-center text-left"
        aria-label="Open Everleap Guide"
      >
        {orb}
      </button>
    );
  }

  // Full orb + text
  return (
    <button
      type="button"
      onClick={handleOpen}
      className="group flex max-w-xs items-center gap-2 text-left text-xs text-slate-200"
    >
      {orb}

      <div className="flex flex-col gap-0.5">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-300">
          {label}
        </span>
        {subline && (
          <span className="line-clamp-2 text-[0.7rem] text-slate-300/85 group-hover:text-slate-100">
            {subline}
          </span>
        )}
        {!subline && (
          <span className="text-[0.7rem] text-slate-400">
            Tap to chat about this part of your life.
          </span>
        )}
      </div>
    </button>
  );
}
