"use client";

import { PROSE_CLASS, LINK_SIZE, TEXT_SECONDARY } from "@/lib/ui/prose";
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
  // Shell tone is "action" (violet) rather than "task" (sky): the border has to
  // agree with Today's accent, which is what now lives inside it.
  return (
    <section
      className={[sectionCard(dark, "action"), "overflow-hidden px-5 py-4"].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(182,160,255,0.12) 0%, transparent 30%), radial-gradient(circle at 88% 100%, rgba(182,160,255,0.06) 0%, transparent 24%)",
          maskImage:
            "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
        }}
      />

      <div className="relative">
        <div className={cardBody()}>
          {hasStrongSignal ? (
            <TodayTinyTaskCard dark={dark} tasks={tasks} eyebrow={eyebrow} />
          ) : (
            <p
              className={[PROSE_CLASS, LINK_SIZE].join(" ")}
              style={{ color: dark ? TEXT_SECONDARY : "#475569" }}
            >
              A Tiny Task is one small experiment. Once we have more signal, this
              turns into something simple you can actually try this week.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
