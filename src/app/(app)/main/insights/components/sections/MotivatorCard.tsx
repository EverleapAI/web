"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Search,
  Users,
  Target,
  Palette,
  Shield,
  ChevronDown,
} from "lucide-react";

import {
  bodyText,
  cardBody,
  confidenceToConstellationDensity,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
  sectionCard,
} from "./summaryShared";

export type MotivatorIconKey =
  | "growth"
  | "curiosity"
  | "connection"
  | "focus"
  | "creativity"
  | "responsibility";

const ICON_CONFIG: Record<
  MotivatorIconKey,
  {
    Icon: typeof TrendingUp;
    cardTone: "strengths" | "task" | "action" | "watchouts" | "themes" | "neutral";
    headerTone: "teal" | "sky" | "violet" | "amber" | "neutral";
    rgb: string;
  }
> = {
  growth: { Icon: TrendingUp, cardTone: "strengths", headerTone: "teal", rgb: "45,212,191" },
  curiosity: { Icon: Search, cardTone: "task", headerTone: "sky", rgb: "56,189,248" },
  connection: { Icon: Users, cardTone: "action", headerTone: "violet", rgb: "167,139,250" },
  focus: { Icon: Target, cardTone: "watchouts", headerTone: "amber", rgb: "251,146,60" },
  creativity: { Icon: Palette, cardTone: "themes", headerTone: "amber", rgb: "251,191,36" },
  responsibility: { Icon: Shield, cardTone: "neutral", headerTone: "neutral", rgb: "251,113,133" },
};

type Props = {
  dark: boolean;
  name: string;
  shortLine: string;
  detail: string;
  iconKey: MotivatorIconKey;
  emphasis?: "primary" | "secondary";
  confidenceLevel?: string | null;
  eyebrow?: string;
};

export default function MotivatorCard({
  dark,
  name,
  shortLine,
  detail,
  iconKey,
  emphasis = "secondary",
  confidenceLevel,
  eyebrow = "Motivator",
}: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const config = ICON_CONFIG[iconKey] ?? ICON_CONFIG.growth;
  const { Icon, cardTone, headerTone, rgb } = config;
  const isPrimary = emphasis === "primary";
  const density = confidenceToConstellationDensity(confidenceLevel);

  return (
    <section
      className={[
        sectionCard(dark, cardTone),
        "relative overflow-hidden",
        isPrimary ? "px-3.5 py-4 sm:px-4 sm:py-4.5" : "px-3 py-3 sm:px-3.5 sm:py-3.5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `radial-gradient(circle at 15% 0%, rgba(${rgb}, ${
            dark ? (isPrimary ? 0.26 : 0.18) : isPrimary ? 0.18 : 0.12
          }) 0%, transparent 55%)`,
        }}
      />

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="relative w-full text-left"
      >
        <div className={headerRow()}>
          <div
            className={[
              headerIconWrap(dark, headerTone),
              isPrimary ? "h-5 w-5" : "",
            ].join(" ")}
          >
            <Icon className={isPrimary ? "h-4 w-4" : "h-3.5 w-3.5"} />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>{eyebrow}</div>
            </div>
          </div>

          {constellationOrnament(dark, cardTone, density)}
        </div>

        <div className={cardBody()}>
          <h3
            className={[
              dark ? "text-white" : "text-slate-950",
              isPrimary
                ? "text-[1.2rem] font-semibold leading-[1.15] tracking-[-0.02em]"
                : "text-[1.05rem] font-semibold leading-[1.15] tracking-[-0.02em]",
            ].join(" ")}
          >
            {name}
          </h3>

          <p
            className={[
              "mt-1.5",
              bodyText(dark),
              isPrimary ? "text-[14.5px] leading-[1.6]" : "text-[13.5px] leading-[1.55]",
            ].join(" ")}
          >
            {shortLine}
          </p>

          <div
            className={[
              "mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium",
              dark ? "text-white/56" : "text-slate-600",
            ].join(" ")}
          >
            <span>{expanded ? "Show less" : "See why"}</span>
            <ChevronDown
              className={[
                "h-3.5 w-3.5 transition-transform",
                expanded ? "rotate-180" : "",
              ].join(" ")}
            />
          </div>
        </div>
      </motion.button>

      <div
        className={[
          "relative overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
          expanded ? "mt-3 max-h-[600px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div
          className={[
            "border-t pt-3",
            dark ? "border-white/10" : "border-black/10",
          ].join(" ")}
        >
          <p className={[bodyText(dark), "text-[13.5px] leading-[1.6]"].join(" ")}>
            {detail}
          </p>
        </div>
      </div>
    </section>
  );
}
