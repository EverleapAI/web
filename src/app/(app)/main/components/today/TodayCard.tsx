"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import PromptLabTrigger from "@/components/promptLab/PromptLabTrigger";

type TodayCardProps = {
  headline?: string | null;
  guidanceText?: string | null;
  reflection?: string | null;
  observation?: string | null;
  nextStep?: string | null;
  ctaLabel: string;
  onPrimary: () => void;
};

function splitGuidanceText(text: string): string[] {
  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function TodayCard({
  headline,
  guidanceText,
  reflection,
  observation,
  nextStep,
  ctaLabel,
  onPrimary,
}: TodayCardProps) {
  const displayHeadline = headline ?? "One question is emerging.";

  const fallbackParagraphs = guidanceText
    ? splitGuidanceText(guidanceText)
    : splitGuidanceText(
        "You’ve shared enough for Everleap to notice a few early clues, but not enough to draw conclusions yet.\n\nOne thing I’m noticing is that your answers are starting to point toward a few possible directions.\n\nYour Story is where we begin testing whether those patterns keep showing up."
      );

  const displayReflection = reflection ?? fallbackParagraphs[0];
  const displayObservation = observation ?? fallbackParagraphs[1] ?? null;
  const displayDirection = nextStep ?? fallbackParagraphs[2] ?? null;

  const displayCta =
    ctaLabel === "Start My Story" ||
    ctaLabel === "Start Your Story" ||
    ctaLabel === "Begin Story"
      ? "Begin Your Story"
      : ctaLabel;

  return (
    <div className="relative">
      <PromptLabTrigger
        dark
        pageKey="today"
        targetField="main"
        currentText={guidanceText ?? ""}
      />

      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
          <Sparkles className="h-3 w-3" />
        </span>

        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/60">
          Today
        </div>
      </div>

      <h1 className="max-w-[580px] text-[24px] font-semibold leading-[1.14] tracking-[-0.035em] text-white">
        {displayHeadline}
      </h1>

      <div className="mt-5 max-w-[640px] space-y-5">
        <p className="text-[15px] leading-7 tracking-[-0.015em] text-white/82">
          {displayReflection}
        </p>

        {displayObservation ? (
          <div className="border-l-2 border-cyan-300/45 pl-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/58">
              Here's what caught my attention
            </div>

            <p className="mt-2 text-[17px] leading-8 tracking-[-0.02em] text-white/86">
              {displayObservation}
            </p>
          </div>
        ) : null}

        {displayDirection ? (
          <p className="text-[15px] leading-7 tracking-[-0.015em] text-white/70">
            {displayDirection}
          </p>
        ) : null}
      </div>

      <div className="mt-7 flex justify-end">
        <button
          type="button"
          onClick={onPrimary}
          className="group inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[15px] font-semibold tracking-[-0.02em] text-cyan-200 transition hover:bg-cyan-300/15 hover:text-cyan-50"
        >
          <span>{displayCta}</span>

          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}