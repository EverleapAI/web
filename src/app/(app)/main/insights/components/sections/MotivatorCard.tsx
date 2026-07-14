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
import { LINK_CLASS, TEXT_SECONDARY } from "@/lib/ui/prose";
import PromptLabTrigger from "@/components/promptLab/PromptLabTrigger";
import type {
  PromptLabAppliedPreview,
  PromptLabPageKey,
} from "@/components/promptLab/PromptLabModal";

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
  /** Reasoning behind this item — the "Why" modal. Falls back to legacy `detail`. */
  why?: string;
  /** The whole picture — the "More" modal. */
  more?: string;
  /** Legacy pre-regen reasoning field; used as a `why` fallback. */
  detail?: string;
  iconKey: MotivatorIconKey;
  emphasis?: "primary" | "secondary";
  confidenceLevel?: string | null;
  eyebrow?: string;
  pageKey?: PromptLabPageKey;
  itemIndex?: 0 | 1 | 2;
};

export default function MotivatorCard({
  dark,
  name,
  shortLine,
  why,
  more,
  detail,
  iconKey,
  emphasis = "secondary",
  confidenceLevel,
  eyebrow = "Motivator",
  pageKey,
  itemIndex,
}: Props) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<PromptLabAppliedPreview | null>(null);

  const itemsKey =
    pageKey === "insights_motivations"
      ? "motivators"
      : pageKey === "insights_strengths"
        ? "strengths"
        : pageKey === "insights_skills"
          ? "skills"
          : null;

  const previewItem = React.useMemo(() => {
    if (!preview || !itemsKey || itemIndex == null) return null;
    const items = preview.result[itemsKey];
    if (!Array.isArray(items)) return null;
    return (
      (items[itemIndex] as {
        name?: string;
        shortLine?: string;
        why?: string;
        more?: string;
        detail?: string;
      }) ?? null
    );
  }, [preview, itemsKey, itemIndex]);

  const displayName = previewItem?.name ?? name;
  const displayShortLine = previewItem?.shortLine ?? shortLine;
  const displayWhy = (previewItem?.why ?? why ?? previewItem?.detail ?? detail ?? "").trim();
  const displayMore = (previewItem?.more ?? more ?? "").trim();

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
        preview ? "ring-1 ring-amber-300/45" : "",
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

      <div className="relative w-full text-left">
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
              dark ? "text-ink-strong" : "text-slate-950",
              isPrimary
                ? "text-[1.2rem] font-semibold leading-display tracking-title"
                : "text-[1.05rem] font-semibold leading-display tracking-title",
            ].join(" ")}
          >
            {displayName}
          </h3>

          <p
            className={[
              "mt-1.5",
              bodyText(dark),
              isPrimary ? "text-label leading-read" : "text-meta leading-body",
            ].join(" ")}
          >
            {displayShortLine}
          </p>

          {displayMore || displayWhy ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {displayMore ? (
                <button
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className={`${LINK_CLASS} text-meta`}
                  style={{ color: TEXT_SECONDARY }}
                >
                  The whole picture
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : null}
              {displayWhy ? (
                <button
                  type="button"
                  onClick={() => setWhyOpen(true)}
                  className={`${LINK_CLASS} text-meta`}
                  style={{ color: `rgb(${rgb})` }}
                >
                  Why this
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

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
        accentRgb={rgb}
      />

      {pageKey && itemIndex != null ? (
        <PromptLabTrigger
          dark={dark}
          pageKey={pageKey}
          targetField={`item_${itemIndex}` as `item_${0 | 1 | 2}`}
          currentText={displayShortLine}
          onApplied={setPreview}
          hasActivePreview={!!preview}
          onReset={() => setPreview(null)}
        />
      ) : null}
    </section>
  );
}
