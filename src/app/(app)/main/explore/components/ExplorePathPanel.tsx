"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Sparkles, ArrowUpRight } from "lucide-react";

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

function sectionKicker() {
  return "text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50";
}

function getPathHref(pathId: string) {
  switch (pathId) {
    case "game-designer":
      return "/main/explore/work/game-designer";
    case "product-builder":
      return "/main/explore/work/product-ux-builder";
    case "health-support":
      return "/main/explore/work/health-human-support";
    case "teaching":
      return "/main/explore/work/teaching-mentorship";
    default:
      return `/main/explore/work/${pathId}`;
  }
}

function pathTheme(id: string) {
  switch (id) {
    case "game-designer":
      return {
        chip: "border-cyan-300/18 bg-cyan-300/10 text-cyan-100/90",
        border: "border-cyan-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(80,180,255,0.18)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(90,180,255,0.26), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(255,180,120,0.16), transparent 58%),
          linear-gradient(135deg, rgba(20,32,60,0.88), rgba(10,16,34,0.82))
        `,
        inner:
          "bg-[linear-gradient(180deg,rgba(12,22,44,0.84),rgba(8,14,28,0.84))]",
        enter:
          "border-cyan-300/22 bg-cyan-300/10 text-cyan-100/95 hover:border-cyan-300/30 hover:bg-cyan-300/16 hover:shadow-[0_0_24px_rgba(120,200,255,0.18)]",
      };

    case "product-builder":
      return {
        chip: "border-emerald-300/18 bg-emerald-300/10 text-emerald-100/90",
        border: "border-emerald-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(90,255,190,0.16)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(70,255,200,0.20), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(120,180,255,0.14), transparent 58%),
          linear-gradient(135deg, rgba(12,36,40,0.84), rgba(9,16,30,0.84))
        `,
        inner:
          "bg-[linear-gradient(180deg,rgba(10,28,30,0.82),rgba(8,14,24,0.84))]",
        enter:
          "border-emerald-300/22 bg-emerald-300/10 text-emerald-100/95 hover:border-emerald-300/30 hover:bg-emerald-300/16 hover:shadow-[0_0_24px_rgba(120,255,210,0.18)]",
      };

    case "health-support":
      return {
        chip: "border-amber-300/18 bg-amber-300/10 text-amber-100/90",
        border: "border-amber-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(255,170,120,0.16)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(255,165,120,0.22), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(255,220,120,0.12), transparent 58%),
          linear-gradient(135deg, rgba(44,22,20,0.84), rgba(14,14,28,0.84))
        `,
        inner:
          "bg-[linear-gradient(180deg,rgba(34,20,18,0.82),rgba(12,12,24,0.84))]",
        enter:
          "border-amber-300/22 bg-amber-300/10 text-amber-100/95 hover:border-amber-300/30 hover:bg-amber-300/16 hover:shadow-[0_0_24px_rgba(255,200,120,0.18)]",
      };

    case "teaching":
      return {
        chip: "border-violet-300/18 bg-violet-300/10 text-violet-100/90",
        border: "border-violet-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(180,140,255,0.16)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(180,140,255,0.24), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(120,180,255,0.12), transparent 58%),
          linear-gradient(135deg, rgba(34,18,48,0.82), rgba(10,14,30,0.84))
        `,
        inner:
          "bg-[linear-gradient(180deg,rgba(28,18,40,0.82),rgba(10,14,28,0.84))]",
        enter:
          "border-violet-300/22 bg-violet-300/10 text-violet-100/95 hover:border-violet-300/30 hover:bg-violet-300/16 hover:shadow-[0_0_24px_rgba(190,150,255,0.18)]",
      };

    default:
      return {
        chip: "border-white/12 bg-white/[0.06] text-white/86",
        border: "border-white/12",
        titleGlow: "",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(110,170,255,0.18), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(255,190,120,0.10), transparent 58%),
          linear-gradient(135deg, rgba(16,22,40,0.84), rgba(10,14,28,0.84))
        `,
        inner:
          "bg-[linear-gradient(180deg,rgba(14,18,34,0.82),rgba(8,12,24,0.84))]",
        enter:
          "border-white/12 bg-white/[0.08] text-white/92 hover:bg-white/[0.12]",
      };
  }
}

export default function ExplorePathPanel({ path, open, onToggle }: Props) {
  const theme = pathTheme(path.id);
  const href = getPathHref(path.id);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[30px] border shadow-[0_26px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl",
        theme.border,
        theme.shell,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        className="relative block w-full text-left transition hover:brightness-[1.04]"
        aria-expanded={open}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: theme.wash }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            className="absolute inset-y-0 w-[32%]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.00) 12%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.00) 88%, transparent 100%)",
              filter: "blur(14px)",
            }}
            animate={{ x: ["-140%", "340%"] }}
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-1/2 hidden h-28 w-28 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl sm:block"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-white/[0.04] blur-3xl sm:block"
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.08, 1] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative px-5 py-5 sm:px-6 sm:py-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] shadow-[0_8px_22px_rgba(0,0,0,0.16)]",
                theme.chip,
              ].join(" ")}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Explore Path
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/84">
              <span>{open ? "Hide" : "Try this"}</span>
              <ChevronRight
                className={[
                  "h-4 w-4 transition duration-200",
                  open ? "rotate-90" : "rotate-0",
                ].join(" ")}
              />
            </div>
          </div>

          <div className="max-w-[60ch]">
            <h2
              className={[
                "text-[1.95rem] font-semibold tracking-tight text-white sm:text-[2.15rem]",
                theme.titleGlow,
              ].join(" ")}
            >
              {path.title}
            </h2>

            <p className="mt-3 text-[17px] leading-8 text-white/78 sm:text-[18px]">
              {path.hook}
            </p>
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
            <div className="border-t border-white/10 px-5 py-5 sm:px-6 sm:py-6">
              <div className="max-w-[62ch] text-[15.5px] leading-8 text-white/82 sm:text-[16px]">
                {path.description}
              </div>

              <div
                className={[
                  "relative mt-6 overflow-hidden rounded-[24px] border border-white/10 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-5 sm:py-5",
                  theme.inner,
                ].join(" ")}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]"
                >
                  <motion.div
                    className="absolute inset-y-0 w-[34%]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.00) 10%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.00) 90%, transparent 100%)",
                      filter: "blur(12px)",
                    }}
                    animate={{ x: ["-150%", "350%"] }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>

                <div className="relative">
                  <div className={sectionKicker()}>{path.testLabel}</div>
                  <div className="mt-1 text-sm font-medium text-white/60">
                    {path.testMinutes}
                  </div>

                  <ul className="mt-4 space-y-3">
                    {path.testSteps.map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[15px] leading-relaxed text-white/82 sm:text-[15.5px]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/38" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  className="rounded-full border border-white/12 bg-white/[0.10] px-4 py-2.5 text-sm font-semibold text-white/92 transition hover:bg-white/[0.14]"
                >
                  Start
                </button>

                <button
                  type="button"
                  className="rounded-full border border-white/12 bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white/88 transition hover:bg-white/[0.12]"
                >
                  Add to Actions
                </button>

                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/66 transition hover:bg-white/[0.07] hover:text-white/80"
                >
                  Not for me
                </button>

                <div className="ml-auto">
                  <Link
                    href={href}
                    className={[
                      "group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold backdrop-blur-xl transition",
                      theme.enter,
                    ].join(" ")}
                  >
                    <span>Enter {path.title} path</span>
                    <ArrowUpRight className="h-4 w-4 opacity-85 transition group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}