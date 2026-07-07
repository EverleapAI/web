"use client";

// The arrival masthead — the centered anchor at the top of Today in every
// state, so the card always opens with a calm, personal focal point rather than
// diving into content. First visit reads as a welcome; every visit after reads
// as being greeted by name (the weekday keeps it feeling like "today").

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
    : name
      ? `Welcome back, ${name}.`
      : "Welcome back.";

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
