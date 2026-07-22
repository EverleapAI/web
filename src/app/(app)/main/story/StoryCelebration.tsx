// apps/web/src/app/(app)/main/story/StoryCelebration.tsx
//
// The two moments that break up fifty-one questions.
//
// THE BEAT — every five answers. Small, but it says something real: one or two
// sentences on what just came through in the last handful of answers. It shipped
// bare at first, on the reasoning that five answers can't support anything that
// isn't a horoscope — true of somebody's FIRST five, and wrong by answer
// twenty-five, where "4 more to go" is counting screens at a person rather than
// telling them anything.
//
// THE MILESTONE — a family finished. Wider: what recurred across the whole set.
//
// Both reads are written AHEAD by the queue and simply displayed here. If one
// isn't ready the authored line stands in, and nothing ever waits on the model —
// a spinner at the moment somebody finishes nineteen questions would undo the
// moment it exists to mark.
//
// Both offer the same two ways out. "I'll come back" is a real offer, not a
// trap — someone who stops after twenty questions has still given the product
// more than someone who bounced off a wall of fifty.

"use client";

import * as React from "react";
import { Constellation } from "./StorySky";
import { emitCelebrate } from "@/lib/actionsBus";

export type Celebration =
  | {
      kind: "beat";
      family: string;
      familyLabel: string;
      answered: number;
      total: number;
      left: number;
    }
  | {
      kind: "milestone";
      family: string;
      familyLabel: string;
      total: number;
      nextFamily: string | null;
      nextLabel: string | null;
      nextTotal: number | null;
    };

const ACCENT = "134, 214, 255";

/**
 * The authored floor for a milestone.
 *
 * Never says "well done" — it says what they just did, and what it's for. If the
 * generated read is missing this is what someone sees, so it has to be good
 * enough to ship on its own rather than read as a fallback.
 */
function authoredMilestone(label: string, total: number): string {
  return `That's all ${total} of ${label}. What you've said here is what I read when I'm working out what to show you — so this part of the app just got sharper.`;
}

export function StoryCelebration({
  celebration,
  onContinue,
  onBreak,
}: {
  celebration: Celebration;
  onContinue: () => void;
  onBreak: () => void;
}) {
  const isMilestone = celebration.kind === "milestone";
  const [read, setRead] = React.useState<string | null>(null);

  // CelebrationBurst has been mounted app-wide this whole time listening for
  // this event, and nothing in the app had ever emitted it. Fired from the
  // centre-top so the particles fall through the constellation.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(
      () => emitCelebrate(window.innerWidth / 2, window.innerHeight * 0.34),
      160
    );
    return () => window.clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    const kind = isMilestone ? "milestone" : "beat";
    fetch(
      `/api/guidance/story-milestone?family=${encodeURIComponent(celebration.family)}&kind=${kind}`,
      { credentials: "include", signal: controller.signal }
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && d.read?.body) setRead(d.read.body);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [isMilestone, celebration.family]);

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <div className="w-full max-w-[420px]">
        {isMilestone ? (
          <>
            <Constellation
              answered={celebration.total}
              total={celebration.total}
              accent={ACCENT}
              showNext={false}
              className="mx-auto h-20 w-full"
            />
            <div
              className="mt-4 text-micro font-semibold uppercase tracking-eyebrow"
              style={{ color: `rgba(${ACCENT},0.95)` }}
            >
              <span aria-hidden>✦</span> {celebration.familyLabel} — done
            </div>
            <p className="mt-3 text-read leading-read text-white/88">
              {read ?? authoredMilestone(celebration.familyLabel, celebration.total)}
            </p>
            {celebration.nextLabel ? (
              <p className="mt-4 text-label text-white/50">
                {celebration.nextLabel} is next — {celebration.nextTotal} questions.
              </p>
            ) : (
              <p className="mt-4 text-label text-white/50">
                That&rsquo;s your whole story answered.
              </p>
            )}
          </>
        ) : (
          <>
            <Constellation
              answered={celebration.answered}
              total={celebration.total}
              accent={ACCENT}
              className="mx-auto h-16 w-full"
            />
            <div
              className="mt-4 text-micro font-semibold uppercase tracking-eyebrow"
              style={{ color: `rgba(${ACCENT},0.95)` }}
            >
              <span aria-hidden>✦</span> Something I noticed
            </div>
            {/* The read leads. The count is furniture underneath it — a screen
                whose headline is "4 more to go" is counting at somebody rather
                than telling them anything. */}
            <p className="mt-2 text-read leading-read text-white/88">
              {read ?? "A few more of your answers are in, and the picture is filling out."}
            </p>
            <p className="mt-3 text-label text-white/45">
              {celebration.left > 0
                ? `${celebration.left} more in ${celebration.familyLabel}.`
                : `${celebration.familyLabel} is nearly done.`}
            </p>
          </>
        )}

        <div className="mt-7 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-control px-4 py-3 text-label font-semibold text-slate-950 transition hover:brightness-110"
            style={{ background: `rgba(${ACCENT},0.92)` }}
          >
            Keep going
          </button>
          <button
            type="button"
            onClick={onBreak}
            className="w-full rounded-control border border-white/12 px-4 py-3 text-label text-white/70 transition hover:border-white/25 hover:text-white"
          >
            I&rsquo;ll come back
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryCelebration;
