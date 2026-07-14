"use client";

// The agent's opening line on Today — not a masthead.
//
// It was a 26px centred semibold headline, which made the product announce itself
// rather than speak. These pages are a conversation, so the greeting is simply the
// first sentence of it: same rung as the prose it opens, one weight above. The
// shared rule lives in lib/ui/prose (HEADING_CLASS / HEADING_STYLE) and Today,
// Insights and Explore all wear it.

import { HEADING_CLASS, HEADING_STYLE } from "@/lib/ui/prose";

// A small rotation of warm returning greetings so the opening doesn't say the
// exact same thing every visit. The name lands in different places — leading,
// trailing, mid-sentence — the way a person actually varies it. Deterministic
// by day (stable across refreshes, changes across days). Separate clean list for
// the rare no-name case so we never leave a dangling comma.
// A pure warm hello — no "resume / pick up where you left off" language, so the
// masthead never overlaps with the action header ("A real step" etc.), which is
// the one place we frame the actual move.
const RETURNING_WITH_NAME = [
  "Welcome back, {name}.",
  "{name}, good to see you again.",
  "Hey {name} — you're back.",
  "Good to have you back, {name}.",
  "You made it back, {name}.",
  "{name}, glad you're here.",
];

const RETURNING_NO_NAME = [
  "Welcome back.",
  "Good to see you again.",
  "You're back.",
  "Glad you're here.",
];

function returningGreeting(name: string | undefined): string {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  if (name) {
    const t = RETURNING_WITH_NAME[dayIndex % RETURNING_WITH_NAME.length];
    return t.replace("{name}", name);
  }
  return RETURNING_NO_NAME[dayIndex % RETURNING_NO_NAME.length];
}

export function WelcomeName({
  firstName,
  isNewUser,
}: {
  firstName: string | null;
  isNewUser: boolean;
}) {
  const name = firstName?.trim();

  // The day/eyebrow now lives in TodayHeart's top row (saves a line); this is
  // just the greeting title.
  const title = isNewUser
    ? name
      ? `You're in, ${name}.`
      : "You're in."
    : returningGreeting(name);

  // Not a masthead any more — the agent's first sentence.
  //
  // This is a conversation, so the greeting sits on the SAME rung as the prose it
  // opens (21px), one weight above it, per the shared rule in lib/ui/prose. It was
  // a 26px centred semibold headline: centred display type over left-aligned prose
  // made the product announce itself instead of speak, and the size step made a
  // greeting outrank the thing it was greeting you into.
  return (
    <div className="flex flex-col items-start text-left">
      <h1 className={HEADING_CLASS} style={HEADING_STYLE}>
        {title}
      </h1>
    </div>
  );
}
