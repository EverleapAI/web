import * as React from "react";

const HIGHLIGHTS = [
  "starting point",
  "next steps",
  "naturally operate",
  "what fits",
  "who you are",
  "where to begin",
  "your map",
  "save your map",
  "patterns",
  "signals",
  "momentum",
  "direction",
  "possibility",
  "possibilities",
  "opportunities",
  "opportunity",
  "map",
  "paths",
  "path",
  "curiosity",
  "strengths",
  "instincts",
  "future",
  "ready",
];

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitBodyLines(body: string) {
  return body
    .replace(/\\n/g, "\n")
    .split(/\n{1,2}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function firstName(value: string) {
  if (!value) return "";

  return value.trim().split(/\s+/)[0] ?? "";
}

export function renderHighlightedText(text: string) {
  const matches = HIGHLIGHTS
    .map((word) => escapeRegex(word))
    .sort((a, b) => b.length - a.length);

  if (matches.length === 0) return text;

  const regex = new RegExp(`(${matches.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isHighlighted = HIGHLIGHTS.some(
      (word) => word.toLowerCase() === part.toLowerCase()
    );

    if (!isHighlighted) {
      return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
    }

    return (
      <span
        key={`${part}-${index}`}
        className="font-semibold tracking-tight text-cyan-100 drop-shadow-[0_0_14px_rgba(103,232,249,0.22)]"
      >
        {part}
      </span>
    );
  });
}