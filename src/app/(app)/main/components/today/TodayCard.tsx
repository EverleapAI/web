"use client";

import { ChevronRight, Sparkles } from "lucide-react";

type TodayCardProps = {
  headline?: string | null;
  guidanceText?: string | null;
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
  ctaLabel,
  onPrimary,
}: TodayCardProps) {
  const displayHeadline = headline ?? "One question is emerging.";

  const displayParagraphs = guidanceText
    ? splitGuidanceText(guidanceText)
    : splitGuidanceText(
        "You’ve shared enough for Everleap to notice a few early clues, but not enough to draw conclusions yet.\n\nThe useful next step is not choosing a path. It is understanding what your answers are starting to point toward. Your Story is where we begin doing that."
      );

  const displayCta =
    ctaLabel === "Start My Story" ||
    ctaLabel === "Start Your Story" ||
    ctaLabel === "Begin Story"
      ? "Begin Your Story"
      : ctaLabel;

  return (
    <div className="relative">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-4 w-4 items-center justify-center text-white/42">
          <Sparkles className="h-3.5 w-3.5" />
        </span>

        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/54">
          Today
        </div>
      </div>

      <h1 className="max-w-[560px] text-[22px] font-semibold leading-[1.18] tracking-[-0.03em] text-white">
        {displayHeadline}
      </h1>

      <div className="mt-6 border-l border-cyan-300/35 pl-4">
        <div className="space-y-5 text-[15px] leading-7 tracking-[-0.015em] text-white/82">
          {displayParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <button
          type="button"
          onClick={onPrimary}
          className="group inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-cyan-300 transition hover:text-cyan-100"
        >
          <span>{displayCta}</span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}