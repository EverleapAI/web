"use client";

// The arrival masthead — the centered anchor at the top of Today in every
// state, so the card always opens with a calm, personal focal point rather than
// diving into content. First visit reads as a welcome; every visit after reads
// as being greeted by name (the weekday keeps it feeling like "today").

// A small rotation of warm returning greetings so the masthead doesn't say the
// exact same thing every visit. Deterministic by day (stable across refreshes,
// changes across days). `{name}` is dropped cleanly when we don't have one.
const RETURNING_GREETINGS = [
  "Welcome back, {name}.",
  "Good to see you, {name}.",
  "You're back, {name}.",
  "Right where you left off, {name}.",
  "Let's keep going, {name}.",
  "Glad you're here, {name}.",
];

function returningGreeting(name: string | undefined): string {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const template = RETURNING_GREETINGS[dayIndex % RETURNING_GREETINGS.length];
  return name
    ? template.replace("{name}", name)
    : template.replace(/,?\s*\{name\}/, "");
}

export function WelcomeName({
  firstName,
  accentRgb,
  isNewUser,
}: {
  firstName: string | null;
  accentRgb: string;
  isNewUser: boolean;
}) {
  const name = firstName?.trim();

  const eyebrow = isNewUser
    ? "Welcome to Everleap"
    : new Date().toLocaleDateString(undefined, { weekday: "long" });

  const title = isNewUser
    ? name
      ? `You're in, ${name}.`
      : "You're in."
    : returningGreeting(name);

  return (
    <div className="mt-3 flex flex-col items-center gap-1 py-2 text-center">
      <span
        className="text-[9.5px] font-bold uppercase tracking-[0.22em]"
        style={{ color: `rgb(${accentRgb})` }}
      >
        {eyebrow}
      </span>
      <span className="text-[20px] font-semibold tracking-[-0.02em] text-white">
        {title}
      </span>
    </div>
  );
}
