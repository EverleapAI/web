"use client";

// The nudge back to Story — its own card, and a loud one.
//
// It used to be a sentence inside Today's "Where you are" card, with the link
// riding on the tail of it: "You've done your Motivations — now let's continue
// your story →". That card also held the awards meter, so the one prompt in the
// app to keep answering questions was sharing a box with a progress readout and
// losing to it.
//
// Tom's rule: never lose the nudge to Story on any page, and where there is one,
// give it its own card at high colour prominence — the treatment a brand new
// user gets. It can afford to be the loudest thing on the screen precisely
// BECAUSE almost nobody sees it for long: it goes away for good once the story
// is answered, so it can never become part of the furniture.
//
// Story is the source. Everything else in the app is built out of it, which is
// why this is worth interrupting for and a progress bar isn't.

import * as React from "react";
import { Sparkles } from "lucide-react";

import { UnlockCard } from "../ui/UnlockCard";

// Amber — the same "there's more to unlock" colour as the low-signal state on
// the Insights tabs, so the two read as the same kind of offer.
const ACCENT = "251, 191, 36";

export function StoryNudge({
  /** The family they'd land in, e.g. "Strengths". Null before they've started. */
  nextLabel,
  href,
  /** False for someone who has answered nothing at all. */
  started,
  className,
}: {
  nextLabel?: string | null;
  href: string;
  started: boolean;
  className?: string;
}) {
  return (
    <UnlockCard
      accent={ACCENT}
      Icon={Sparkles}
      eyebrow={started ? "There's more to unlock" : "Start with your story"}
      href={href}
      cta={started ? "Continue your story" : "Start your story"}
      className={className}
    >
      {started ? (
        <p>
          {nextLabel ? `${nextLabel} is next. ` : ""}Everything I can tell you
          comes out of your answers, so the more of them there are, the less I
          have to speak in generalities.
        </p>
      ) : (
        <p>
          Everything here is built out of what you tell me — what moves you, what
          you&rsquo;re good at, what you can already do. A few questions is enough
          for this to stop being generic.
        </p>
      )}
    </UnlockCard>
  );
}

export default StoryNudge;
