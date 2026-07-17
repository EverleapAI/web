"use client";

import * as React from "react";
import InsightsSummaryCard from "./sections/InsightsSummaryCard";
import InsightsBackLink from "./sections/InsightsBackLink";
import InsightsUnlockCTA from "./sections/InsightsUnlockCTA";
import MotivatorCard, { type MotivatorIconKey } from "./sections/MotivatorCard";
import InsightsTinyTaskCard from "./sections/InsightsTinyTaskCard";

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
  // Percent of THIS category's Story questions answered (from story/next's
  // per-category breakdown) — drives the low-signal gate below.
  const [categoryPercent, setCategoryPercent] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    fetch("/api/story/next?family=motivations")
      .then((res) => res.json())
      .then(
        (data: {
          ok?: boolean;
          done?: boolean;
          categories?: { key?: string; percent?: number }[];
        }) => {
          if (cancelled) return;
          setQuestionsRemain(data?.ok ? !data.done : null);
          const cat = Array.isArray(data?.categories)
            ? data.categories.find((c) => c.key === "motivations")
            : null;
          setCategoryPercent(typeof cat?.percent === "number" ? cat.percent : null);
        }
      )
      .catch(() => {
        if (!cancelled) {
          setQuestionsRemain(null);
          setCategoryPercent(null);
        }
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
  // Low signal = under 20% of this category's questions answered. In that state
  // we show almost nothing beyond the agentic intro (which acknowledges the thin
  // signal), the trophies, and the "answer more" CTA — no thin item cards.
  const lowSignal = categoryPercent != null && categoryPercent < 20;
  const showAssist =
    (lowSignal ||
      (hasGeneratedPayload &&
        (confidenceLevel === "very_early" || confidenceLevel === "emerging"))) &&
    questionsRemain !== false;

  return (
    <section className="mb-6 space-y-3">
      <InsightsBackLink />

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
        <InsightsUnlockCTA dark={dark} category="Motivations" href={STORY_HREF} />
      ) : null}

      {!lowSignal ? (
        <>
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
        </>
      ) : null}
    </section>
  );
}

export default MotivationsTab;
