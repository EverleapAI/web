"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import { SignalWord } from "../../../components/SignalWord";
import {
  bodyText,
  headerIconWrap,
  headerLabel,
  headerRow,
  mutedText,
  sectionCard,
  titleText,
} from "./summaryShared";

type Props = {
  dark: boolean;
  headline?: string;
  paragraph?: string;
  hasStrongSignal: boolean;
  startHref?: string;
};

export default function InsightsSummaryCard({
  dark,
  headline,
  paragraph,
  hasStrongSignal,
  startHref = "/main/questions?cat=motivations&returnTo=/main/insights?tab=summary",
}: Props) {
  const resolvedHeadline =
    headline?.trim() || "We’re still building your signal.";

  return (
    <section className={sectionCard(dark, "neutral")}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(255,180,120,0.08) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(120,200,255,0.05) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "neutral")}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className={headerLabel(dark)}>Insights</div>
        </div>

        <div className={titleText(dark)}>
          {hasStrongSignal
            ? resolvedHeadline
            : "Your insights will get sharper once we have more signal."}
        </div>

        {hasStrongSignal ? (
          <>
            {paragraph ? (
              <p className={["mt-3", bodyText(dark)].join(" ")}>{paragraph}</p>
            ) : null}

            
          </>
        ) : (
          <>
            <p className={["mt-3", bodyText(dark)].join(" ")}>
              We do not have a strong enough signal yet to give you meaningful
              insights. Once you answer a few questions, this becomes your first
              grounded read on what seems to drive you, where your energy shows
              up, and what patterns are starting to repeat.
            </p>

            <div className="mt-4">
              <Link
                href={startHref}
                className={[
                  "group inline-flex items-center gap-1.5 text-[14.5px] font-medium transition focus-visible:outline-none",
                  dark
                    ? "text-white/78 hover:text-white/88"
                    : "text-slate-900 hover:text-black",
                ].join(" ")}
              >
                <span>Start with Motivations Questions</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}