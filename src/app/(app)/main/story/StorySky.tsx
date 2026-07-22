// apps/web/src/app/(app)/main/story/StorySky.tsx
//
// The Story as a sky you're filling in.
//
// Fifty-one questions with no visible edges is a dark hole: three percentages
// told someone how complete they were, in the register a machine uses, and never
// told them where they were or how much further to anything that mattered.
//
// So each family is a constellation and every answer lights a star. It says four
// things a bar can't — which shape you're inside, how many stars are lit, how
// many are still dark, and that two more shapes are waiting. And it says them in
// the language the rest of the app already speaks: stars you light up in Explore,
// the five-star journey map, the glyphs on every card. This is the one place the
// stars are genuinely the reader's own, because these are their answers.
//
// The question stays the hero. This is furniture — small, quiet, in the corner —
// per the one-anchor-per-screen rule. It must never compete with what's being
// asked.

"use client";

import * as React from "react";

export type SkyCategory = {
  key: string;
  label: string;
  answered: number;
  total: number;
  isCurrent: boolean;
};

/**
 * Star positions, as fractions of the box.
 *
 * Hand-placed rather than generated: a random scatter reads as noise, and a
 * regular grid reads as a checklist. These are loose arcs with the wander a real
 * constellation has. The list is longer than any family needs, so a family takes
 * the first N — which also means a star never moves as the sky fills, and
 * somebody answering their twelfth question sees the same shape they saw at
 * their second.
 */
const POINTS: [number, number][] = [
  [0.08, 0.62], [0.18, 0.41], [0.27, 0.68], [0.36, 0.3], [0.44, 0.55],
  [0.52, 0.22], [0.58, 0.48], [0.66, 0.72], [0.72, 0.35], [0.8, 0.58],
  [0.87, 0.28], [0.93, 0.5], [0.13, 0.24], [0.31, 0.85], [0.47, 0.78],
  [0.62, 0.13], [0.77, 0.82], [0.9, 0.72], [0.22, 0.55], [0.4, 0.44],
];

export function Constellation({
  answered,
  total,
  accent = "134, 214, 255",
  className = "",
  /** The next star pulses, so the shape points at what they're about to do. */
  showNext = true,
}: {
  answered: number;
  total: number;
  accent?: string;
  className?: string;
  showNext?: boolean;
}) {
  const stars = POINTS.slice(0, Math.max(1, Math.min(total, POINTS.length)));
  const lit = Math.max(0, Math.min(answered, stars.length));

  return (
    <svg
      viewBox="0 0 100 40"
      className={className}
      role="img"
      aria-label={`${answered} of ${total} answered`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Lines only between stars already lit — the shape emerges as they go
          rather than being drawn in advance and waiting to be coloured in. */}
      {stars.slice(1, lit).map(([x, y], i) => {
        const [px, py] = stars[i];
        return (
          <line
            key={`l${i}`}
            x1={px * 100}
            y1={py * 40}
            x2={x * 100}
            y2={y * 40}
            stroke={`rgba(${accent},0.32)`}
            strokeWidth={0.5}
          />
        );
      })}

      {stars.map(([x, y], i) => {
        const isLit = i < lit;
        const isNext = showNext && i === lit;
        return (
          <circle
            key={`s${i}`}
            cx={x * 100}
            cy={y * 40}
            r={isLit ? 1.5 : 1}
            fill={
              isLit
                ? `rgba(${accent},0.95)`
                : isNext
                  ? `rgba(${accent},0.5)`
                  : "rgba(255,255,255,0.16)"
            }
          >
            {isNext ? (
              <animate
                attributeName="opacity"
                values="0.45;1;0.45"
                dur="2.4s"
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        );
      })}
    </svg>
  );
}

/**
 * The header on the question screen: where you are, and how far to the thing
 * that actually means something.
 *
 * The remaining count is to the END OF THIS FAMILY, never to the end of the
 * story. "Thirty-five questions left" is true and deflating; "eleven left in
 * Motivations" is a horizon someone can picture. The near edge is what stops
 * this feeling bottomless.
 */
/**
 * The three families the story is actually made of.
 *
 * The API also returns `misc`, which holds a single question and is explicitly
 * NOT one of the families (`STORY_FAMILIES` on the server says so). Listing it
 * beside Motivations, Strengths and Skills made the story look like it had four
 * parts, one of which is one question long. It stays askable — it just isn't a
 * shape in the sky.
 */
const SHAPES = new Set(["motivations", "strengths", "skills"]);

export function StorySky({
  categories,
  accent = "134, 214, 255",
}: {
  categories: SkyCategory[];
  accent?: string;
}) {
  const shapes = categories.filter((c) => SHAPES.has(c.key));
  // If they're on the misc question, it still names itself in the header — it
  // just doesn't get a constellation.
  const current = categories.find((c) => c.isCurrent) ?? shapes[0];
  if (!current) return null;
  const left = Math.max(0, current.total - current.answered);

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${accent},0.9)` }}>
          <span aria-hidden>✦</span> {current.label}
        </span>
        <span className="text-micro text-white/45">
          {current.answered} of {current.total}
          {left > 0 ? ` · ${left} to go` : " · done"}
        </span>
      </div>

      <Constellation
        answered={current.answered}
        total={current.total}
        accent={accent}
        className="mt-1.5 h-12 w-full"
      />

      {/* The other families, as unlit shapes waiting. Two more things exist and
          they are finite — which is the whole point of showing them. */}
      <div className="mt-1 flex items-center justify-center gap-4">
        {shapes.map((c) => (
          <span
            key={c.key}
            className="flex items-center gap-1.5 text-micro"
            style={{ color: c.isCurrent ? `rgba(${accent},0.85)` : "rgba(255,255,255,0.3)" }}
          >
            <span aria-hidden>{c.answered >= c.total ? "✦" : "·"}</span>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default StorySky;
