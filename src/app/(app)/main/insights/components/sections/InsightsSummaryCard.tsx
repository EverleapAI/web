"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

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

type Props = {
  dark: boolean;
  headline?: string;
  paragraph?: string;
  detail?: string;
  hasStrongSignal: boolean;
  startHref?: string;
};

function splitParagraphs(text?: string): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function InsightsSummaryCard({
  dark,
  headline,
  paragraph,
  detail,
  hasStrongSignal,
  startHref = "/main/questions?cat=motivations&returnTo=/main/insights?tab=summary",
}: Props) {
  const [detailOpen, setDetailOpen] = React.useState(false);

  const resolvedHeadline =
    headline?.trim() || "We’re still building your signal.";

  const noSignalTitle = "Your insights get sharper once we have more signal.";

  const paragraphs = React.useMemo(() => splitParagraphs(paragraph), [paragraph]);
  const hasDetail = !!detail?.trim();

  return (
    <section
      className={[
        sectionCard(dark, "neutral"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(255,180,120,0.14) 0%, transparent 30%), radial-gradient(circle at 92% 14%, rgba(255,210,150,0.12) 0%, transparent 18%), radial-gradient(circle at 88% 100%, rgba(120,200,255,0.06) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "neutral")}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Insights</div>
            </div>
          </div>

          {constellationOrnament(dark, "neutral")}
        </div>

        <div className={cardBody()}>
          <h2
            className={[
              dark ? "text-white" : "text-slate-950",
              "mt-0.5 text-[1.5rem] font-semibold leading-[1.07] tracking-[-0.03em]",
              "sm:text-[1.68rem]",
            ].join(" ")}
          >
            {hasStrongSignal ? resolvedHeadline : noSignalTitle}
          </h2>

          {hasStrongSignal ? (
            <>
              {paragraphs.map((p, index) => (
                <p
                  key={index}
                  className={[
                    index === 0 ? "mt-2.5" : "mt-1.5",
                    bodyText(dark),
                    "text-[14px] leading-[1.65] sm:text-[14.5px]",
                  ].join(" ")}
                >
                  {p}
                </p>
              ))}

              {hasDetail ? (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setDetailOpen(true)}
                    className={[
                      "group inline-flex items-center gap-1.5 text-[14px] font-medium transition focus-visible:outline-none sm:text-[14.5px]",
                      dark
                        ? "text-white/82 hover:text-white/94"
                        : "text-slate-900 hover:text-black",
                    ].join(" ")}
                  >
                    <span>See how I got here</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              ) : null}

              <InsightsSummaryDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                dark={dark}
                headline={resolvedHeadline}
                detail={detail}
              />
            </>
          ) : (
            <>
              <p
                className={[
                  "mt-2.5",
                  bodyText(dark),
                  "text-[14px] leading-[1.65] sm:text-[14.5px]",
                ].join(" ")}
              >
                This page gets much more useful once Everleap has a little more
                real signal from you.
              </p>

              <p
                className={[
                  "mt-1.5",
                  bodyText(dark),
                  "text-[14px] leading-[1.65] sm:text-[14.5px]",
                ].join(" ")}
              >
                A few Motivations questions is enough to start grounding this in
                what gives you energy, what drains it, and which patterns keep
                repeating.
              </p>

              <div className="mt-3">
                <Link
                  href={startHref}
                  className={[
                    "group inline-flex items-center gap-1.5 text-[14px] font-medium transition focus-visible:outline-none sm:text-[14.5px]",
                    dark
                      ? "text-white/82 hover:text-white/94"
                      : "text-slate-900 hover:text-black",
                  ].join(" ")}
                >
                  <span>Start with Motivations</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
