"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import ExploreLaneRail from "../components/ExploreLaneRail";
import ExplorePathPanel from "../components/ExplorePathPanel";
import type { ExplorePathPanelData } from "../components/ExplorePathPanel";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "./_data/getWorkAgenticOpening";

const PATHS: ExplorePathPanelData[] = [
  {
    id: "game-designer",
    title: "Game Designer",
    hook: "You shape rules, rewards, and tension so curiosity becomes play.",
    description:
      "Game designers create systems people can feel from the inside. It blends imagination, psychology, pacing, and logic to shape experiences that pull people forward and make them want one more try.",
  },
  {
    id: "product-builder",
    title: "Product / UX Builder",
    hook: "You make tools, apps, and systems feel clearer, calmer, and more human.",
    description:
      "Product and UX builders notice friction fast. They simplify complexity, improve flow, and design experiences that help real people do real things without confusion getting in the way.",
  },
  {
    id: "health-support",
    title: "Health + Human Support",
    hook: "You help people recover, adapt, steady themselves, or feel less alone.",
    description:
      "This direction is about care, trust, guidance, and presence. It fits people who can stay grounded around discomfort and who want their work to genuinely matter in someone else’s life.",
  },
  {
    id: "teaching",
    title: "Teaching / Mentorship",
    hook: "You help someone understand, grow, or see further than they could alone.",
    description:
      "Teaching and mentorship are not just about explaining. They are about noticing how people learn, building confidence, and creating moments where something suddenly becomes possible for someone else.",
  },
];

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[30px] border",
    "px-5 py-5 md:px-7 md:py-7",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/20" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function sectionKicker(dark: boolean) {
  return [
    "text-[12px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-white/50" : "text-slate-600",
  ].join(" ");
}

function counselorHeadline(dark: boolean) {
  return dark
    ? [
        "text-[24px] md:text-[30px] font-semibold tracking-tight leading-[1.16]",
        "text-transparent bg-clip-text",
        "bg-gradient-to-b from-white/95 via-white/86 to-white/70",
        "drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]",
        "pb-1",
      ].join(" ")
    : [
        "text-[24px] md:text-[30px] font-semibold tracking-tight leading-[1.16]",
        "text-slate-900",
        "pb-1",
      ].join(" ");
}

function counselorPara(dark: boolean) {
  return dark
    ? [
        "text-[15px] md:text-[15.5px] leading-relaxed",
        "text-white/80",
        "drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]",
      ].join(" ")
    : "text-[15px] md:text-[15.5px] leading-relaxed text-slate-700";
}

function WorkLaneMotif() {
  return (
    <>
      <div className="pointer-events-none absolute right-3 top-3 h-20 w-20 opacity-[0.82] sm:right-5 sm:top-5 sm:h-24 sm:w-24 md:h-28 md:w-28">
        <div className="absolute inset-0 rounded-full border border-cyan-300/12 bg-cyan-300/[0.03] blur-[1px]" />
        <div className="absolute inset-[12%] rounded-full border border-white/8" />

        <motion.div
          className="absolute left-[18%] top-[22%] h-[9px] w-[9px] rounded-full bg-cyan-200/80 shadow-[0_0_14px_rgba(120,220,255,0.45)]"
          animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[20%] top-[28%] h-[8px] w-[8px] rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.28)]"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[30%] bottom-[20%] h-[8px] w-[8px] rounded-full bg-cyan-100/70 shadow-[0_0_12px_rgba(120,220,255,0.3)]"
          animate={{ opacity: [0.3, 0.85, 0.3], scale: [1, 1.06, 1] }}
          transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut" }}
        />

        <svg
          className="absolute inset-0 h-full w-full opacity-45"
          viewBox="0 0 128 128"
          fill="none"
        >
          <path
            d="M31 38C44 33 57 34 69 40C81 45 89 54 95 68"
            stroke="rgba(140,220,255,0.24)"
            strokeWidth="1.5"
          />
          <path
            d="M38 90C53 78 69 72 92 73"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.5"
          />
          <path
            d="M42 43L82 47L71 86L35 82L42 43Z"
            stroke="rgba(120,210,255,0.14)"
            strokeWidth="1"
          />
        </svg>

        <div className="absolute bottom-[2%] right-[0%] rounded-full border border-cyan-300/16 bg-cyan-300/10 p-2 text-cyan-100/80 shadow-[0_0_20px_rgba(120,220,255,0.14)]">
          <Compass className="h-4 w-4" />
        </div>
      </div>
    </>
  );
}

export default function ExploreWorkPage() {
  const themeId: SpotlightThemeId = "nightDusk";
  const dark = isDarkTheme(themeId);
  const [firstName, setFirstName] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const opening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "lane",
        pathId: "work",
        firstName,
      }),
    [firstName]
  );

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(1280px 560px at 6% -8%, rgba(110,170,255,0.22), transparent 60%),
            radial-gradient(1080px 500px at 100% 0%, rgba(255,170,120,0.18), transparent 58%),
            radial-gradient(920px 440px at 50% 100%, rgba(120,255,210,0.10), transparent 62%),
            radial-gradient(680px 300px at 38% 24%, rgba(170,140,255,0.08), transparent 55%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-28 pt-0 sm:px-6 lg:px-8">
        <div className="mb-3 pt-0">
          <h1
            className={[
              "text-[36px] md:text-[46px] font-semibold tracking-tight",
              "text-white/92",
              "leading-[1.05] pb-1",
            ].join(" ")}
            style={{ overflow: "visible" }}
          >
            Explore
          </h1>

          <div className="mt-0.5 text-[14px] md:text-[15px] text-white/60">
            What I can do
          </div>
        </div>

        <div className="relative mb-5">
          <ExploreLaneRail />
          <div
            aria-hidden
            className={[
              "pointer-events-none absolute right-0 top-0 h-full w-10",
              dark
                ? "bg-gradient-to-l from-[#0b1220] to-transparent"
                : "bg-gradient-to-l from-white to-transparent",
            ].join(" ")}
          />
        </div>

        <section className="mb-6">
          <div className={readingSurface(dark)}>
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -top-24 left-1/2 h-[300px] w-[860px] -translate-x-1/2 rounded-full bg-orange-300/10 blur-3xl" />
              <div className="absolute top-12 -left-24 h-[260px] w-[460px] rounded-full bg-sky-300/10 blur-3xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
            </div>

            <WorkLaneMotif />

            <div className="relative max-w-5xl pr-20 sm:pr-28 md:pr-32">
              <div className={sectionKicker(dark)}>Work</div>

              <div className={["mt-2", counselorHeadline(dark)].join(" ")}>
                This is not about picking a forever answer.
                <br className="hidden md:block" /> It is about noticing signal.
              </div>

              <p className={["mt-4 max-w-[76ch]", counselorPara(dark)].join(" ")}>
                {opening.body}
              </p>

              <p className="mt-4 max-w-[72ch] text-[15px] md:text-[15.5px] leading-relaxed text-white/90">
                Notice where your mind already leans — then give that instinct
                something real to move toward.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          {PATHS.map((path) => (
            <ExplorePathPanel
              key={path.id}
              path={path}
              open={false}
              onToggle={() => {}}
            />
          ))}
        </section>
      </div>
    </div>
  );
}