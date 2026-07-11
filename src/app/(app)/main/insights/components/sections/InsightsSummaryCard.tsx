"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

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
import AgenticDetailModal from "@/components/ui/AgenticDetailModal";
import {
  LINK_CLASS,
  LINK_SIZE,
  PROSE_CLASS,
  PROSE_SIZE,
  PROSE_STYLE,
  TEXT_HEADING,
  TEXT_SECONDARY,
} from "@/lib/ui/prose";
import { ConstellationAnchor } from "../../../components/ui/ConstellationAnchor";
import PromptLabTrigger from "@/components/promptLab/PromptLabTrigger";
import type {
  PromptLabAppliedPreview,
  PromptLabPageKey,
} from "@/components/promptLab/PromptLabModal";

type Props = {
  dark: boolean;
  headline?: string;
  paragraph?: string;
  /** Reasoning behind this read — the "Why" modal. Falls back to legacy `detail`. */
  why?: string;
  /** The whole picture — the "More" modal. Falls back to the full body. */
  more?: string;
  /** Legacy pre-regen reasoning field; used as a `why` fallback. */
  detail?: string;
  hasStrongSignal: boolean;
  startHref?: string;
  confidenceLevel?: string | null;
  pageKey?: PromptLabPageKey;
};

export default function InsightsSummaryCard({
  dark,
  headline,
  paragraph,
  why,
  more,
  detail,
  hasStrongSignal,
  startHref = "/main/questions?cat=motivations&returnTo=/main/insights?tab=summary",
  confidenceLevel,
  pageKey,
}: Props) {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<PromptLabAppliedPreview | null>(null);
  const density = confidenceToConstellationDensity(confidenceLevel);

  const previewHeadline = preview?.result.headline as string | undefined;
  const previewBody = preview?.result.body as string | undefined;
  const previewWhy = preview?.result.why as string | undefined;
  const previewMore = preview?.result.more as string | undefined;
  const previewDetail = preview?.result.detail as string | undefined;

  const resolvedHeadline =
    (previewHeadline ?? headline)?.trim() || "We’re still building your signal.";

  const noSignalTitle = "Your insights get sharper once we have more signal.";

  // The body is generated at Today's length already (35-50 words) and its LAST
  // sentence is the nudge toward a tab + an unearned badge — so it is shown
  // whole. Trimming to the first two sentences would drop exactly that nudge.
  // The verbose version lives behind "The whole picture".
  const fullBody = (previewBody ?? paragraph ?? "").trim();
  const readText = fullBody;
  const displayWhy = (previewWhy ?? why ?? previewDetail ?? detail ?? "").trim();
  const displayMore = ((previewMore ?? more ?? "").trim() || fullBody).trim();

  return (
    <section
      className={[
        sectionCard(dark, "neutral"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
        preview ? "ring-1 ring-amber-300/45" : "",
      ].join(" ")}
    >
      {dark ? <ConstellationAnchor seed="insights-summary" accent={{ r: 120, g: 200, b: 255 }} /> : null}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(255,180,120,0.14) 0%, transparent 30%), radial-gradient(circle at 92% 14%, rgba(255,210,150,0.12) 0%, transparent 18%), radial-gradient(circle at 88% 100%, rgba(120,200,255,0.06) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        {pageKey ? (
          <PromptLabTrigger
            dark={dark}
            pageKey={pageKey}
            targetField="main"
            currentText={previewBody ?? paragraph ?? ""}
            onApplied={setPreview}
            hasActivePreview={!!preview}
            onReset={() => setPreview(null)}
          />
        ) : null}

        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "neutral")}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Insights</div>
            </div>
          </div>

          {constellationOrnament(dark, "neutral", density)}
        </div>

        <div className={cardBody()}>
          {/* Today's rule: hierarchy comes from weight + spacing, not from a
              bigger size or a brighter colour. Heading sits on the same 21px
              rung as the prose it heads, one weight above it. */}
          <h2
            className={["mt-0.5", PROSE_SIZE, PROSE_CLASS].join(" ")}
            style={{ color: TEXT_HEADING, fontWeight: 600 }}
          >
            {hasStrongSignal ? resolvedHeadline : noSignalTitle}
          </h2>

          {hasStrongSignal ? (
            <>
              <p
                className={["mt-3", PROSE_SIZE, PROSE_CLASS].join(" ")}
                style={PROSE_STYLE}
              >
                {readText}
              </p>

              {displayMore || displayWhy ? (
                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  {displayMore ? (
                    <button
                      type="button"
                      onClick={() => setMoreOpen(true)}
                      className={[LINK_CLASS, LINK_SIZE].join(" ")}
                      style={{ color: dark ? TEXT_SECONDARY : "#475569" }}
                    >
                      The whole picture
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : null}
                  {displayWhy ? (
                    <button
                      type="button"
                      onClick={() => setWhyOpen(true)}
                      className={[LINK_CLASS, LINK_SIZE].join(" ")}
                      style={{ color: dark ? "rgb(120,200,255)" : "#2563eb" }}
                    >
                      Why this
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : null}
                </div>
              ) : null}

              <AgenticDetailModal
                open={moreOpen}
                onClose={() => setMoreOpen(false)}
                eyebrow="The whole picture"
                body={displayMore}
              />
              <AgenticDetailModal
                open={whyOpen}
                onClose={() => setWhyOpen(false)}
                eyebrow="Why this"
                body={displayWhy}
                accentRgb="120,200,255"
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
