"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import {
  bodyText,
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
  sectionCard,
} from "./summaryShared";

type Props = {
  dark: boolean;
  headline?: string;
  paragraph?: string;
  hasStrongSignal: boolean;
  startHref?: string;
};

function cleanLine(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function splitIntoSentences(text: string) {
  return cleanLine(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function compressSummaryParagraph(paragraph?: string) {
  const raw = cleanLine(paragraph ?? "");
  if (!raw) return { lead: "", close: "" };

  const sentences = splitIntoSentences(raw);
  if (!sentences.length) return { lead: "", close: "" };

  const leadParts: string[] = [];
  const closeParts: string[] = [];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();

    const isMove =
      lower.startsWith("so here’s your move") ||
      lower.startsWith("so here's your move") ||
      lower.includes("start imperfect") ||
      lower.includes("finish real");

    const isProof =
      lower.startsWith("i’m not guessing") ||
      lower.startsWith("i'm not guessing");

    if (isMove || isProof) {
      continue;
    }

    if (leadParts.length < 2) {
      leadParts.push(sentence);
      continue;
    }

    if (closeParts.length < 2) {
      closeParts.push(sentence);
    }
  }

  if (!leadParts.length) {
    leadParts.push(sentences[0]);
  }

  let lead = cleanLine(leadParts.join(" "));
  let close = cleanLine(closeParts.slice(0, 2).join(" "));

  if (lead.length > 260) {
    lead = cleanLine(splitIntoSentences(lead).slice(0, 2).join(" "));
  }

  if (close.length > 220) {
    close = cleanLine(splitIntoSentences(close).slice(0, 2).join(" "));
  }

  return { lead, close };
}

export default function InsightsSummaryCard({
  dark,
  headline,
  paragraph,
  hasStrongSignal,
  startHref = "/main/questions?cat=motivations&returnTo=/main/insights?tab=summary",
}: Props) {
  const resolvedHeadline =
    headline?.trim() || "We’re still building your signal.";

  const noSignalTitle = "Your insights get sharper once we have more signal.";

  const compressed = React.useMemo(
    () => compressSummaryParagraph(paragraph),
    [paragraph]
  );

  return (
    <section
      className={[
        sectionCard(dark, "neutral"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(255,180,120,0.14) 0%, transparent 30%), radial-gradient(circle at 92% 14%, rgba(255,210,150,0.12) 0%, transparent 18%), radial-gradient(circle at 88% 100%, rgba(120,200,255,0.06) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "neutral")}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Insights</div>
            </div>
          </div>

          {constellationOrnament(dark, "neutral")}
        </div>

        <div className={cardBody()}>
          <h2
            className={[
              dark ? "text-white" : "text-slate-950",
              "mt-0.5 text-[1.5rem] font-semibold leading-[1.07] tracking-[-0.03em]",
              "sm:text-[1.68rem]",
            ].join(" ")}
          >
            {hasStrongSignal ? resolvedHeadline : noSignalTitle}
          </h2>

          {hasStrongSignal ? (
            <>
              {compressed.lead ? (
                <p
                  className={[
                    "mt-2.5",
                    bodyText(dark),
                    "text-[14px] leading-[1.65] sm:text-[14.5px]",
                  ].join(" ")}
                >
                  {compressed.lead}
                </p>
              ) : null}

              {compressed.close ? (
                <p
                  className={[
                    "mt-1.5",
                    bodyText(dark),
                    "text-[14px] leading-[1.65] sm:text-[14.5px]",
                  ].join(" ")}
                >
                  {compressed.close}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p
                className={[
                  "mt-2.5",
                  bodyText(dark),
                  "text-[14px] leading-[1.65] sm:text-[14.5px]",
                ].join(" ")}
              >
                This page gets much more useful once Everleap has a little more
                real signal from you.
              </p>

              <p
                className={[
                  "mt-1.5",
                  bodyText(dark),
                  "text-[14px] leading-[1.65] sm:text-[14.5px]",
                ].join(" ")}
              >
                A few Motivations questions is enough to start grounding this in
                what gives you energy, what drains it, and which patterns keep
                repeating.
              </p>

              <div className="mt-3">
                <Link
                  href={startHref}
                  className={[
                    "group inline-flex items-center gap-1.5 text-[14px] font-medium transition focus-visible:outline-none sm:text-[14.5px]",
                    dark
                      ? "text-white/82 hover:text-white/94"
                      : "text-slate-900 hover:text-black",
                  ].join(" ")}
                >
                  <span>Start with Motivations</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}