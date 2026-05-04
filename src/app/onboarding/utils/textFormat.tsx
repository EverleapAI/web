import * as React from "react";

const HIGHLIGHTS = [
  "patterns",
  "naturally operate",
  "paths",
  "ideas",
  "opportunities",
  "next steps",
  "signals",
  "starting point",
  "map",
  "explore",
  "fit",
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
  return value.trim().split(" ")[0] ?? "";
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
        className="font-semibold tracking-tight text-cyan-200 drop-shadow-[0_0_16px_rgba(103,232,249,0.34)]"
      >
        {part}
      </span>
    );
  });
}