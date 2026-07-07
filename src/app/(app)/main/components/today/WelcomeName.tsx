"use client";

// Arrival moment — shown through the establishing phase (before any coverage
// exists), alongside the agentic read. Welcome + their name, so it reads like
// being greeted, not booted up.

export function WelcomeName({
  firstName,
  accentRgb,
}: {
  firstName: string | null;
  accentRgb: string;
}) {
  const name = firstName?.trim();

  return (
    <div className="mt-3 flex flex-col items-center gap-1 py-2 text-center">
      <span
        className="text-[9.5px] font-bold uppercase tracking-[0.22em]"
        style={{ color: `rgb(${accentRgb})` }}
      >
        Welcome to Everleap
      </span>
      <span className="text-[20px] font-semibold tracking-[-0.02em] text-white">
        {name ? `You're in, ${name}.` : "You're in."}
      </span>
    </div>
  );
}
