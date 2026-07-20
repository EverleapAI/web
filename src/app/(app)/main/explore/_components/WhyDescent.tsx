// apps/web/src/app/(app)/main/explore/_components/WhyDescent.tsx
//
// "Why this path", as its own screen.
//
// Every other star in the constellation opened a full screen while this one and
// the honey mission rendered inline underneath the map — so tapping a star did
// one of two different things depending on which star, and the two that stayed
// put were the ones the page opened on. With all five taking you somewhere, the
// constellation becomes what it looks like: navigation.
//
// It also gets the room it needed. Inline, "what you'd actually do" was capped
// at four bullets and the skills were clipped to six chips because they were
// sharing a page with a star map; on their own screen they can simply be what
// they are.

"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

import { DescentShell } from "./DescentShell";

export function WhyDescent({
  specialtyTitle,
  whyYou,
  lead,
  whatYouActuallyDo,
  skillsThatGrowHere,
  accent,
  onClose,
}: {
  specialtyTitle: string;
  whyYou: string | null;
  lead: string;
  whatYouActuallyDo?: string[];
  skillsThatGrowHere?: string[];
  accent: string;
  onClose: () => void;
}) {
  const doList = whatYouActuallyDo ?? [];
  const skills = skillsThatGrowHere ?? [];
  // Never print what is already on screen. whyYou is a Work-match field, so on
  // most branches it is empty and falling back to the lead would repeat the
  // paragraph the reader just tapped away from.
  const body = whyYou && whyYou.trim() !== lead.trim() ? whyYou : doList.length || skills.length ? null : lead;

  return (
    <DescentShell accent={accent} step={0} total={1} onClose={onClose} backTo={specialtyTitle}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-control"
          style={{ background: `rgba(${accent},0.14)`, color: `rgb(${accent})` }}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="text-micro font-semibold uppercase tracking-eyebrow text-white/44">
          {specialtyTitle}
        </div>
      </div>
      <h1 className="text-title font-semibold leading-display tracking-title text-white">
        Why this rhymes with you
      </h1>

      {body ? <p className="mt-3 text-read leading-read text-white/85">{body}</p> : null}

      {doList.length ? (
        <div className="mt-6">
          <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${accent},0.85)` }}>
            What you&rsquo;d actually do
          </div>
          <ul className="mt-2.5 space-y-2">
            {doList.map((it, i) => (
              <li key={i} className="flex gap-2.5 text-label leading-read text-white/82">
                <span
                  className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: `rgba(${accent},0.85)` }}
                />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {skills.length ? (
        <div className="mt-6">
          <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${accent},0.85)` }}>
            Skills that grow here
          </div>
          {/* A chip is for a token, not a sentence. Work paths return short
              skills ("Blueprint reading") and chip beautifully; the non-work
              lanes return whole thoughts ("Hearing how music carries history and
              hybridity") which wrap to three lines inside a pill and read as
              broken. So the shape follows the content instead of assuming it. */}
          {skills.every((s) => s.length <= 28) ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full border px-3 py-1.5 text-meta text-white/85"
                  style={{ borderColor: `rgba(${accent},0.28)`, background: `rgba(${accent},0.07)` }}
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <ul className="mt-2.5 space-y-2">
              {skills.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-label leading-read text-white/82">
                  <span
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: `rgba(${accent},0.85)` }}
                  />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </DescentShell>
  );
}

export default WhyDescent;
