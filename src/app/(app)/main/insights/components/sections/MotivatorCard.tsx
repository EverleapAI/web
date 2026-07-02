"use client";

import * as React from "react";
import { Flame, ArrowRight } from "lucide-react";

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

type Tone = "strengths" | "task" | "action";

type Props = {
  dark: boolean;
  name: string;
  shortLine: string;
  detail: string;
  tone: Tone;
};

export default function MotivatorCard({
  dark,
  name,
  shortLine,
  detail,
  tone,
}: Props) {
  const [detailOpen, setDetailOpen] = React.useState(false);

  return (
    <section
      className={[
        sectionCard(dark, tone),
        "overflow-hidden px-3 py-3 sm:px-3.5 sm:py-3.5",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setDetailOpen(true)}
        className="relative w-full text-left"
      >
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, tone === "strengths" ? "teal" : tone === "task" ? "sky" : "violet")}>
            <Flame className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Motivator</div>
            </div>
          </div>

          {constellationOrnament(dark, tone)}
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
