"use client";

// The arrival masthead — the centered anchor at the top of Today in every
// state, so the card always opens with a calm, personal focal point rather than
// diving into content. First visit reads as a welcome; every visit after reads
// as being greeted by name (the weekday keeps it feeling like "today").

// A small rotation of warm returning greetings so the masthead doesn't say the
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
  accentRgb = "182,160,255",
}: {
  firstName: string | null;
  isNewUser: boolean;
  accentRgb?: string;
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
    <div className="-mt-1 flex flex-col items-center gap-0.5 text-center">
      <span
        className="text-[9.5px] font-bold uppercase tracking-[0.24em]"
        style={{ color: `rgb(${accentRgb})`, opacity: 0.55 }}
      >
        {eyebrow}
      </span>
      <span
        className="text-[26px] font-semibold tracking-[-0.02em]"
        style={{ color: "#E3E6EC", WebkitFontSmoothing: "antialiased" }}
      >
        {title}
      </span>
    </div>
  );
}
