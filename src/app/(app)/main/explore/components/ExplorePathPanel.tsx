"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export type ExplorePathPanelData = {
  id: string;
  title: string;
  hook: string;
  description: string;
  testLabel: string;
  testMinutes: string;
  testSteps: string[];
};

type Props = {
  path: ExplorePathPanelData;
  open: boolean;
  onToggle: () => void;
};

export default function ExplorePathPanel({ path, open, onToggle }: Props) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <button
        type="button"
        onClick={onToggle}
        className="relative block w-full px-5 py-5 text-left transition hover:bg-white/[0.02]"
        aria-expanded={open}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(460px 180px at 0% 0%, rgba(120,180,255,0.12), transparent 60%), radial-gradient(420px 180px at 100% 100%, rgba(255,180,110,0.10), transparent 60%)",
          }}
        />

        <div className="relative">
          <div className="text-[20px] font-semibold tracking-tight text-white">
            {path.title}
          </div>

          <div className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-white/72">
            {path.hook}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/82">
            <span>{open ? "Hide" : "Try this"}</span>
            <ChevronRight
              className={[
                "h-4 w-4 transition",
                open ? "rotate-90" : "rotate-0",
              ].join(" ")}
            />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 py-5">
              <div className="max-w-[56ch] text-[15px] leading-relaxed text-white/78">
                {path.description}
              </div>

              <div className="mt-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  {path.testLabel}
                </div>
                <div className="mt-1 text-sm text-white/55">
                  {path.testMinutes}
                </div>

                <ul className="mt-3 space-y-2">
                  {path.testSteps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[15px] leading-relaxed text-white/78"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/28" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/12"
                >
                  Start
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/12"
                >
                  Add to Actions
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/62 transition hover:bg-white/[0.08] hover:text-white/78"
                >
                  Not for me
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}