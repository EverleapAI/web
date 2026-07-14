"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import InsightsSummaryCard from "./sections/InsightsSummaryCard";
import MotivatorCard, { type MotivatorIconKey } from "./sections/MotivatorCard";
import InsightsTinyTaskCard from "./sections/InsightsTinyTaskCard";
import InsightsQuickCheckCard from "./sections/InsightsQuickCheckCard";
import { sectionCard, bodyText, headerLabel } from "./sections/summaryShared";

import { useGeneratedInsights } from "../hooks/useGeneratedInsights";

type MotivatorPayload = {
  name?: string;
  shortLine?: string;
  why?: string;
  more?: string;
  detail?: string; // legacy pre-regen reasoning; used as a `why` fallback
  iconKey?: MotivatorIconKey;
};

type GeneratedMotivationsPayload = {
  confidence?: {
    level?: string;
  };
  insight?: {
    headline?: string;
    body?: string;
    why?: string;
    more?: string;
    detail?: string;
  };
  motivators?: MotivatorPayload[];
};

const STORY_HREF =
  "/main/story?family=motivations&returnTo=" +
  encodeURIComponent("/main/insights?tab=motivations");

export function MotivationsTab({
  dark,
  afterAgentic,
}: {
  dark: boolean;
  /** "Where you are" — slotted BELOW the agent's read, never above it. */
  afterAgentic?: React.ReactNode;
}): React.JSX.Element {
  const { payload, tinyTasks } = useGeneratedInsights<GeneratedMotivationsPayload>(
    "/api/guidance/insights-motivations"
  );

  const [questionsRemain, setQuestionsRemain] = React.useState<boolean | null>(
    null
  );

  React.useEffect(() => {
    let cancelled = false;

    fetch("/api/story/next?family=motivations")
      .then((res) => res.json())
      .then((data: { ok?: boolean; done?: boolean }) => {
        if (!cancelled) setQuestionsRemain(data?.ok ? !data.done : null);
      })
      .catch(() => {
        if (!cancelled) setQuestionsRemain(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Matches how the Summary tab gates its own card: "do we have a
  // generated payload at all yet" — not a confidence threshold. The
  // generator's own prompt already writes appropriately hedged content
  // for every confidence tier, so re-gating on the tier here would hide
  // genuinely good content once Claude has something to say.
  const hasGeneratedPayload = !!payload;

  const motivators = (payload?.motivators ?? [])
    .filter(
      (m): m is MotivatorPayload & { name: string; shortLine: string } =>
        !!(m?.name && m?.shortLine && (m?.why || m?.detail))
    )
    .slice(0, 3);

  const confidenceLevel = payload?.confidence?.level;
  const showAssist =
    hasGeneratedPayload &&
    (confidenceLevel === "very_early" || confidenceLevel === "emerging") &&
    questionsRemain !== false;

  return (
    <section className="mb-6 space-y-3">
      <InsightsSummaryCard
        dark={dark}
        headline={payload?.insight?.headline}
        paragraph={payload?.insight?.body}
        why={payload?.insight?.why}
        more={payload?.insight?.more}
        detail={payload?.insight?.detail}
        hasStrongSignal={hasGeneratedPayload}
        startHref={STORY_HREF}
        confidenceLevel={confidenceLevel}
        pageKey="insights_motivations"
      />

      {afterAgentic}

      {showAssist ? (
        <div
          className={[
            sectionCard(dark, "neutral"),
            "overflow-hidden px-3 py-3 sm:px-3.5 sm:py-3.5",
          ].join(" ")}
        >
          <div className={headerLabel(dark)}>Answer a few more</div>
          <p className={["mt-1.5", bodyText(dark), "text-[13.5px] leading-[1.55]"].join(" ")}>
            A few more Motivations questions would help sharpen this.
          </p>
          <div className="mt-2">
            <Link
              href={STORY_HREF}
              className={[
                "group inline-flex items-center gap-1.5 text-[13.5px] font-medium transition focus-visible:outline-none",
                dark ? "text-white/82 hover:text-white/94" : "text-slate-900 hover:text-black",
              ].join(" ")}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Answer more questions</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      ) : null}

      {motivators.length === 3 ? (
        <div className="space-y-3">
          {motivators.map((motivator, index) => (
            <MotivatorCard
              key={motivator.name}
              dark={dark}
              name={motivator.name}
              shortLine={motivator.shortLine}
              why={motivator.why}
              more={motivator.more}
              detail={motivator.detail}
              iconKey={motivator.iconKey ?? "growth"}
              emphasis={index === 0 ? "primary" : "secondary"}
              confidenceLevel={confidenceLevel}
              pageKey="insights_motivations"
              itemIndex={index as 0 | 1 | 2}
            />
          ))}
        </div>
      ) : null}

      <InsightsTinyTaskCard
        dark={dark}
        tasks={tinyTasks}
        hasStrongSignal={tinyTasks.length > 0}
      />

      <InsightsQuickCheckCard
        dark={dark}
        contextTag="insights:motivations"
        pageKey="insights_motivations"
      />
    </section>
  );
}

export default MotivationsTab;
