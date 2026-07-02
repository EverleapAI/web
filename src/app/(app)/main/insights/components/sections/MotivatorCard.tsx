"use client";

import * as React from "react";
import {
  TrendingUp,
  Search,
  Users,
  Target,
  Palette,
  Shield,
  ArrowRight,
} from "lucide-react";

import {
  bodyText,
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
  sectionCard,
} from "./summaryShared";
import InsightsSummaryDetailModal from "./InsightsSummaryDetailModal";

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
};

export default function MotivatorCard({
  dark,
  name,
  shortLine,
  detail,
  iconKey,
}: Props) {
  const [detailOpen, setDetailOpen] = React.useState(false);

  const config = ICON_CONFIG[iconKey] ?? ICON_CONFIG.growth;
  const { Icon, cardTone, headerTone, rgb } = config;

  return (
    <section
      className={[
        sectionCard(dark, cardTone),
        "relative overflow-hidden px-3 py-3 sm:px-3.5 sm:py-3.5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `radial-gradient(circle at 15% 0%, rgba(${rgb}, ${dark ? 0.18 : 0.12}) 0%, transparent 55%)`,
        }}
      />

      <button
        type="button"
        onClick={() => setDetailOpen(true)}
        className="relative w-full text-left"
      >
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, headerTone)}>
            <Icon className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Motivator</div>
            </div>
          </div>

          {constellationOrnament(dark, cardTone)}
        </div>

        <div className={cardBody()}>
          <h3
            className={[
              dark ? "text-white" : "text-slate-950",
              "text-[1.05rem] font-semibold leading-[1.15] tracking-[-0.02em]",
            ].join(" ")}
          >
            {name}
          </h3>

          <p
            className={[
              "mt-1.5",
              bodyText(dark),
              "text-[13.5px] leading-[1.55]",
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
            <span>See why</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </button>

      <InsightsSummaryDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        dark={dark}
        headline={name}
        detail={detail}
      />
    </section>
  );
}
