// apps/web/src/app/(app)/main/explore/_components/DescentShell.tsx
//
// The one template every descent uses.
//
// The three descents were built one at a time and ended up three different
// screens: different max widths, different header spacing, and different scroll
// models — DayDescent nested a scrolling text area inside the page, so the
// content had its own scrollbar and the whole thing jumped between steps.
// Moving between stars felt like moving between apps.
//
// So the frame lives here and the descents only supply what's inside it:
//   - the same way out, in the same place, always ("Step back up")
//   - the same progress rail, so you can see where you are and how much is left
//   - ONE scroll container, so a long step scrolls the page like anything else
//   - the same measure, so the text doesn't change width between steps

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";

/**
 * The measure for everything in a descent — header and content both.
 *
 * The rest of Explore runs in a 720px column (see explore/layout.tsx); the
 * descent is the only screen that escapes it, because it portals to the body to
 * cover the app nav. Escaping the stacking context shouldn't have meant escaping
 * the layout too, so it takes a column of its own at close to the same width —
 * wide enough to sit in the same family as every other Explore screen, narrow
 * enough to keep the prose at a readable measure.
 *
 * One constant, used twice, because the whole point is that the two agree.
 */
const COLUMN = "max-w-2xl";

export function DescentShell({
  accent,
  step,
  total,
  onClose,
  children,
  media = null,
  railTints,
  rail,
  backTo,
}: {
  /** "r, g, b" */
  accent: string;
  /** Zero-based index of the current step; -1 for a step outside the sequence. */
  step: number;
  total: number;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional visual above the content — sized here, not by the caller. */
  media?: React.ReactNode;
  /**
   * One colour per step, dawn to dusk. When given, the progress rail becomes the
   * day itself rather than a row of identical grey bars.
   *
   * The design brief's own test for an object is that it carries a fact — remove
   * it and you lose information, not decoration. Equal bars told you "4 of 5",
   * which the header already says. A rail tinted by each moment's hour tells you
   * the SHAPE of the day at a glance, from the timeLabels we already have.
   */
  railTints?: string[];
  /**
   * Replaces the default segments entirely — for a descent whose progress IS the
   * content, like the day, where the rail becomes a dawn-to-dusk band you can
   * navigate rather than a read-out of how far you've got.
   */
  rail?: React.ReactNode;
  /**
   * Where "back" goes — the specialty or path this descent hangs off.
   *
   * "Step back up" named the gesture and not the destination, so from four
   * levels down it answered "how do I leave" without answering "leave to
   * where". Naming the place is also what lets the control carry the lane's
   * colour instead of being one more grey pill: it reads as the way out because
   * it looks like where you came from.
   */
  backTo?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Back should close the descent, not leave the page.
  //
  // A descent is React state rather than a route, so the phone's back gesture
  // used to sail straight past the overlay and exit the constellation — from
  // five levels deep, with no app nav on screen to land on, since this thing
  // deliberately covers it. Back is the gesture people trust most on a phone and
  // it was the one that punished them hardest.
  //
  // One history entry on open fixes that: back pops the entry, we hear it, we
  // close. The URL never changes, so the router has nothing to navigate.
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  React.useEffect(() => {
    // Only if we haven't already. React double-invokes this effect in dev, which
    // pushed two entries for one descent and left a spare behind after closing —
    // a back press that appeared to do nothing. Checking for our own marker
    // makes one open mean one entry however many times the effect runs.
    if (!window.history.state?.everleapDescent) {
      window.history.pushState({ everleapDescent: true }, "", window.location.href);
    }
    const onPop = () => onCloseRef.current();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // The pill and Escape leave through the same door as the back gesture, rather
  // than closing directly and then tidying up the entry they left behind.
  //
  // Tidying up in effect cleanup was the obvious version and it was wrong: the
  // history.back() it fired raced React's double-invoked mount, and the pending
  // pop landed in the SECOND mount's listener — so the descent opened and shut
  // itself in the same breath. One exit, taken the same way every time, has no
  // race to lose.
  const close = React.useCallback(() => {
    if (window.history.state?.everleapDescent) {
      window.history.back();
      // If that pop never arrives — an entry something else replaced, a browser
      // that swallows it — close anyway rather than leave a dead button. Closing
      // twice costs nothing; a descent with no way out costs everything.
      window.setTimeout(() => onCloseRef.current(), 220);
      return;
    }
    onCloseRef.current();
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!mounted) return null;

  return createPortal(
    // Portalled to the body so it escapes MAIN's stacking context and covers the
    // app nav — a plain fixed overlay inside the page cannot.
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#05070f] text-white">
      {/* The way out is always the first thing, in the same place on every step
          of every descent — and, critically, in the same COLUMN as the words.

          This bar used to span the viewport while the text sat in a narrow
          centred column, so on a desktop window "Step back up" ended up hundreds
          of pixels from anything you were reading: the one control that leaves a
          screen with no app nav, parked where your eye never goes. The rail had
          the same problem — stretched across the whole window, the gaps between
          its markers stopped meaning time and started meaning empty browser. */}
      <div className="relative z-10 shrink-0">
        {/* Same box as the content below — same max width, same padding — so the
            exit sits on the text's left edge rather than merely near it. */}
        <div className={`mx-auto w-full px-6 pt-4 ${COLUMN}`}>
          <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={close}
          title={backTo ? `Back to ${backTo}` : "Step back up"}
          className="inline-flex min-w-0 shrink items-center gap-1.5 rounded-full border px-3 py-1.5 text-meta font-semibold transition hover:brightness-125"
          style={{
            borderColor: `rgba(${accent}, 0.45)`,
            background: `rgba(${accent}, 0.14)`,
            color: `rgb(${accent})`,
          }}
        >
          <ArrowUp className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{backTo ? `Back to ${backTo}` : "Step back up"}</span>
        </button>
        {rail ? null : total > 1 ? (
          <div className="flex flex-1 items-center gap-1.5" aria-hidden>
            {Array.from({ length: total }).map((_, k) => {
              const tint = railTints?.[k];
              const reached = k <= step;
              return (
                <span
                  key={k}
                  className="relative h-1.5 flex-1 rounded-full transition-all"
                  style={{
                    // Steps you've reached show their own hour; ahead of you the
                    // day is still dim, so the rail fills with daylight as you go.
                    background: reached
                      ? tint ?? `rgb(${accent})`
                      : tint
                        ? `color-mix(in srgb, ${tint} 30%, rgba(255,255,255,0.10))`
                        : "rgba(255,255,255,0.14)",
                    boxShadow: k === step && tint ? `0 0 10px 1px ${tint}` : undefined,
                  }}
                />
              );
            })}
            </div>
          ) : null}
          </div>
          {/* A rail that IS the content — the day — gets its own row, spanning
              the full measure of the read it describes. Sharing the row with the
              exit pill left it about 190px on a phone, which squeezed its markers
              back into each other: the collision the layout works to avoid,
              reintroduced by the container rather than the maths. */}
          {rail ? <div className="mt-2.5">{rail}</div> : null}
        </div>
      </div>

      {/* One scroll container for the whole descent. Media and text scroll
          together, so there's never a scrollbar inside a scrollbar — and both sit
          in the same column, so a step reads as one object rather than a
          full-bleed image with a narrow page underneath it. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className={`mx-auto w-full px-6 pb-10 pt-4 ${COLUMN}`}>
          {media}
          <div className={media ? "pt-5" : "pt-1"}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * The image or atmosphere above a step.
 *
 * Sized by aspect ratio with a hard ceiling rather than a share of the viewport.
 * It was 44vh, which on a tall window meant a gradient with a sun in it taking
 * most of the screen while the words it belonged to were pushed into a cramped
 * box below.
 */
export function DescentMedia({
  children,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative aspect-[16/10] max-h-[34vh] w-full shrink-0 overflow-hidden rounded-card ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
