"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import { cardBody } from "./summaryShared";
import AgenticDetailModal from "@/components/ui/AgenticDetailModal";
import { CardBody } from "@/lib/ui/card";
import {
  HEADING_CLASS,
  HEADING_STYLE,
  LINK_CLASS,
  LINK_SIZE,
  PROSE_CLASS,
  PROSE_SIZE,
  PROSE_STYLE,
  TEXT_SECONDARY,
} from "@/lib/ui/prose";
import { ReadAtmosphere } from "../../../components/ui/ReadAtmosphere";
import { SectionCard } from "../../../components/ui/SectionCard";
import { AgenticHeader } from "../../../components/ui/AgenticHeader";
import PromptLabTrigger from "@/components/promptLab/PromptLabTrigger";
import type {
  PromptLabAppliedPreview,
  PromptLabPageKey,
} from "@/components/promptLab/PromptLabModal";

// One voice, ONE paragraph — the shape (headline) and the read (body) are
// stitched into a single flowing paragraph so the agent speaks in one breath,
// never a header line over a body line. Same helper Explore's summary card uses.
function joinRead(headline?: string | null, lead?: string | null): string {
  const h = (headline ?? "").trim();
  const l = (lead ?? "").trim();
  if (!h) return l;
  if (!l) return h;
  const sep = /[.!?…]$/.test(h) ? " " : ". ";
  return `${h}${sep}${l}`;
}

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
  /** The masthead label. "Insights" on the summary; a breadcrumb ("Insights ·
   *  Motivations") when this card heads a deep area, so the deep page names where
   *  you are the way Explore's "Explore · Careers" does — not a bare "Insights". */
  eyebrow?: string;
};

export default function InsightsSummaryCard({
  dark,
  headline,
  paragraph,
  why,
  more,
  detail,
  hasStrongSignal,
  startHref = "/main/story?family=motivations&returnTo=/main/insights?tab=summary",
  confidenceLevel,
  pageKey,
  eyebrow = "Insights",
}: Props) {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<PromptLabAppliedPreview | null>(null);
  // NOTE — a small feature was dropped by unifying the shell: Insights' old
  // bespoke ornament varied its star density with `confidenceLevel`, and the
  // shared ConstellationAnchor (what Today and Explore use) has no density prop.
  // `confidenceLevel` is still accepted and still passed by the page, so nothing
  // breaks and it can be re-wired if we want it — but right now it is decorative
  // signal that no longer renders. Flagged rather than deleted.

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

  // Insights now wears the same shell as Today and Explore: SectionCard tone="hero"
  // with the constellation backdrop. It used to be the odd one out — a bespoke
  // <section> with its own gradient wash and ornament — so the three agentic
  // surfaces looked like three products. Ironically it was the ONLY one setting the
  // agent's opening line correctly (same rung as the prose, one weight above), so
  // this merge takes Insights' typography and Today's card, and every surface gets
  // both.
  //
  // `dark` is hardcoded true on this page (themeId = "nightDusk"), so the light
  // branches of sectionCard()/headerIconWrap() were unreachable anyway.
  return (
    <SectionCard
      tone="hero"
      voice
      className={["!px-5 !py-4", preview ? "ring-1 ring-amber-300/45" : ""].join(" ")}
      backdrop={
        <ReadAtmosphere seed="insights-summary" accent={{ r: 120, g: 200, b: 255 }} />
      }
    >
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

        <AgenticHeader
          glyph={
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-sky-300/[0.08] text-sky-200/75 ring-1 ring-sky-300/[0.18]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          }
          eyebrow={eyebrow}
          accentRgb="120, 200, 255"
        />

        <div className={cardBody()}>
          {/* The rule, now shared by all three surfaces via lib/ui/prose: hierarchy
              comes from weight + spacing, never a bigger size. The agent's opening
              line sits on the same 21px rung as the prose it opens, one weight
              above it. Insights was the only surface already doing this. */}
          {hasStrongSignal ? (
            <>
              {/* One voice, one paragraph — headline and read spoken as a single
                  flowing line; the whole picture is one tap away in "See more". */}
              <p
                className={[PROSE_SIZE, PROSE_CLASS].join(" ")}
                style={PROSE_STYLE}
              >
                {joinRead(resolvedHeadline, readText)}
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
                      See more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : null}
                  {displayWhy ? (
                    <button
                      type="button"
                      onClick={() => setWhyOpen(true)}
                      className={[LINK_CLASS, LINK_SIZE].join(" ")}
                      style={{ color: dark ? TEXT_SECONDARY : "#475569" }}
                    >
                      Why
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
              <h2 className={HEADING_CLASS} style={HEADING_STYLE}>
                {noSignalTitle}
              </h2>

              <CardBody className="mt-2.5">
                This page gets much more useful once Everleap has a little more
                real signal from you.
              </CardBody>

              <CardBody className="mt-1.5">
                A few questions is enough to start grounding this in what actually
                gives you energy, what drains it, and which patterns keep
                repeating.
              </CardBody>

              <div className="mt-3">
                <Link
                  href={startHref}
                  className={[
                    "group inline-flex items-center gap-1.5 text-label font-medium transition focus-visible:outline-none sm:text-label",
                    dark
                      ? "text-white/82 hover:text-white/94"
                      : "text-slate-900 hover:text-black",
                  ].join(" ")}
                >
                  <span>Answer a few questions</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
