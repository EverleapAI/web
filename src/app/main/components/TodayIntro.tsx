// src/app/main/components/TodayIntro.tsx
"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

function SectionDivider({ dark }: { dark: boolean }) {
  const line = dark ? "bg-white/10" : "bg-black/10";
  const dot = dark ? "bg-white/25" : "bg-black/20";
  return (
    <div className="py-2" aria-hidden>
      <div className="flex items-center gap-3">
        <div className={`h-px flex-1 ${line}`} />
        <div className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <div className={`h-px flex-1 ${line}`} />
      </div>
    </div>
  );
}

export function TodayIntro(props: {
  dark: boolean;
  mounted: boolean;
  textFaintClass: string;
  textMutedClass: string;

  quote: { text: string; author: string };
  fallbackQuote?: { text: string; author: string };

  name: string; // already “nice”
  retortKey: string;
  retortParagraphs: string[];

  /** Optional stable fallback paragraphs shown before mount to avoid hydration mismatch */
  fallbackRetortParagraphs?: string[];
}) {
  const {
    dark,
    mounted,
    textFaintClass,
    textMutedClass,
    quote,
    fallbackQuote = {
      text: "Start where you are. Use what you have. Do what you can.",
      author: "Arthur Ashe",
    },
    name,
    retortKey,
    retortParagraphs,
    fallbackRetortParagraphs = [
      "Welcome to Everleap.",
      "Give me a second — I’m pulling together your next best step.",
    ],
  } = props;

  const shownQuote = mounted ? quote : fallbackQuote;
  const shownGreeting = mounted ? (name ? `Hey ${name}.` : "Hey.") : "Hey.";
  const shownParagraphs = mounted ? retortParagraphs : fallbackRetortParagraphs;

  return (
    <div>
      {/* TODAY marker */}
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] opacity-85">
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] ${
            dark ? "bg-amber-200/90 text-slate-950" : "bg-amber-400 text-slate-900"
          }`}
        >
          <Sparkles className="h-3 w-3" />
        </span>
        <span>Today</span>
      </div>

      <div className="space-y-5">
        {/* Quote */}
        <div className={`text-sm ${textFaintClass}`}>
          <span className="opacity-80">“</span>
          <span className="italic">{shownQuote.text}</span>
          <span className="opacity-80">”</span>
          <span className="ml-2 opacity-70">— {shownQuote.author}</span>
        </div>

        {/* Greeting + retort */}
        <div>
          <div className="text-xl font-semibold sm:text-2xl">{shownGreeting}</div>

          <div className={`mt-3 space-y-3 text-sm leading-relaxed ${textMutedClass}`}>
            {shownParagraphs.map((p, idx) => (
              <p key={`${mounted ? retortKey : "pre_mount"}_${idx}`}>{p}</p>
            ))}
          </div>

          <SectionDivider dark={dark} />
        </div>
      </div>
    </div>
  );
}