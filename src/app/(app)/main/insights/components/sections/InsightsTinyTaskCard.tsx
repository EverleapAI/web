"use client";

import { CardBody } from "@/lib/ui/card";
import { TEXT_SECONDARY } from "@/lib/ui/prose";
import { TodayTinyTaskCard } from "../../../components/nextSteps/TodayTinyTaskCard";
import type { MicroTaskBatchItem } from "@/lib/microTasks/useMicroTaskBatch";

import { cardBody, sectionCard } from "./summaryShared";

type Props = {
  dark: boolean;
  eyebrow?: string;
  tasks: MicroTaskBatchItem[];
  hasStrongSignal: boolean;
};

// This is the Today "Something I'm wondering" card, verbatim — same anchor,
// eyebrow, question ramp and option pills. All Insights adds is the section
// shell the tab stack needs, plus the no-signal teaser Today never shows.
export default function InsightsTinyTaskCard({
  dark,
  eyebrow,
  tasks,
  hasStrongSignal,
}: Props) {
  // Today's card chrome now, no colored wash: the accent lives inside the card
  // (the Tiny Task's own glyph + eyebrow), never on the shell.
  return (
    <section
      className={[sectionCard(dark, "action"), "overflow-hidden px-5 py-4"].join(" ")}
    >
      <div className="relative">
        <div className={cardBody()}>
          {hasStrongSignal ? (
            <TodayTinyTaskCard dark={dark} tasks={tasks} eyebrow={eyebrow} />
          ) : (
            <CardBody style={{ color: TEXT_SECONDARY }}>
              A Tiny Task is one small experiment. Once we have more signal, this
              turns into something simple you can actually try this week.
            </CardBody>
          )}
        </div>
      </div>
    </section>
  );
}
