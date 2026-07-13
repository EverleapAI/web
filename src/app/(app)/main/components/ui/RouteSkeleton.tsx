// The screen you get the instant you tap a nav item.
//
// Without a loading boundary, the App Router holds you on the OLD page until the
// next route's JS has landed — on a phone that's every chunk over cellular, and
// the tap reads as a dead nav. A boundary lets the navigation commit immediately:
// you're on the new page, and this stands in until it's ready.
//
// Deliberately dumb: no data, no client hooks, nothing to download.

export function RouteSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div
      className="mx-auto w-full max-w-[680px] animate-pulse px-[6px] pb-28 pt-2"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading…</span>

      {/* the hero card */}
      <div className="rounded-[28px] border border-white/[0.04] bg-white/[0.02] px-5 py-6">
        <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded-full bg-white/[0.05]"
              style={{ width: `${[92, 78, 60][i % 3]}%` }}
            />
          ))}
        </div>
        <div className="mt-7 h-9 w-40 rounded-full bg-white/[0.05]" />
      </div>

      {/* a second block, so the page has weight rather than a lonely card */}
      <div className="mt-3 rounded-2xl border border-white/[0.03] bg-white/[0.015] px-4 py-4">
        <div className="h-3 w-2/3 rounded-full bg-white/[0.05]" />
        <div className="mt-3 h-3 w-1/3 rounded-full bg-white/[0.04]" />
      </div>
    </div>
  );
}

export default RouteSkeleton;
