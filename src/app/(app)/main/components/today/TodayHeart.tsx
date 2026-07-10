"use client";

// TodayHeart — the "beating heart" home card. One template that flexes by
// dispatch type. Deliberately sparse: an optional "we heard you" reinforcement
// line, ONE line of substance (the move), the living visuals (coverage +
// pulse), a luminous CTA, and — only when relevant — a quiet loose-thread nudge.
// Meaning stays in a few words; state/identity/rhythm are carried by the art.

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check } from "lucide-react";

import { emitActionAdded } from "@/lib/actionsBus";

import { StoryRail } from "./StoryRail";
import { DispatchGlyph } from "./DispatchGlyph";
import { WelcomeName } from "./WelcomeName";
import { ConstellationAnchor } from "../ui/ConstellationAnchor";
import PromptLabTrigger from "@/components/promptLab/PromptLabTrigger";
import type { PromptLabAppliedPreview } from "@/components/promptLab/PromptLabModal";
import {
  DISPATCH_ACCENT,
  type CoverageArea,
  type CoverageKey,
  type TodayHeartData,
} from "./todayHeart.types";

// Keep the read tight — the first couple of sentences carry the "I get you"
// weight; more than that turns an opening into an essay.
function firstSentences(text: string | null | undefined, n: number): string {
  if (!text) return "";
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (parts.length ? parts : [text.trim()]).slice(0, n).join(" ");
}

function ensureStop(s: string): string {
  const t = s.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

// Fallback only: trim a longer read down to roughly retort length when the
// backend pack hasn't supplied a dedicated retort yet.
function capWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ").replace(/[,;:—-]$/, "")}…`;
}

// Keep a read to roughly four lines: if it runs long, drop whole trailing
// sentences until it fits (never a mid-sentence chop).
function capRead(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) return t;
  const sentences = t.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > maxChars && out) break;
    out = next;
  }
  return out || t.slice(0, maxChars).replace(/\s+\S*$/, "").trim();
}

// The establishing read, rotated across visits so an early user doesn't see the
// exact same paragraph every day. Options: the synthesis body paragraph, plus
// grounded reinforcement lines paired into ~2-sentence reads (so the weight
// stays roughly even). Deterministic by day; falls back to the one-liner.
function establishingRead(input: {
  body: string | null | undefined;
  reads: string[] | null | undefined;
  fallback: string;
}): string {
  const options: string[] = [];

  const bodyPara = firstSentences(input.body, 2);
  if (bodyPara) options.push(bodyPara);

  const pool = (input.reads ?? [])
    .map((r) => (r ?? "").trim())
    .filter(Boolean)
    .map(ensureStop);

  if (pool.length === 1) {
    options.push(pool[0]);
  } else {
    for (let i = 0; i < pool.length; i++) {
      options.push(`${pool[i]} ${pool[(i + 1) % pool.length]}`);
    }
  }

  if (options.length === 0) return input.fallback;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return capRead(options[dayIndex % options.length], 220);
}

// Break the retort into 2-3 short paragraphs (by sentence) so the hero read
// breathes instead of landing as one dense block — far easier on the eyes on a
// phone. Caps at 3: extra sentences fold into the last paragraph.
function splitIntoParagraphs(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return [text.trim()];
  if (sentences.length <= 3) return sentences;
  return [sentences[0], sentences[1], sentences.slice(2).join(" ")];
}

// The calm reading treatment shared by the hero retort, the More/Why modals,
// and the "A Real Step" pitch: a light weight in a dimmed off-white. Only the
// size steps down by role — hero largest, everything else a notch under.
const PROSE_STYLE: React.CSSProperties = {
  color: "#BFC3CD",
  fontWeight: 500,
};
const PROSE_CLASS = "leading-[1.6] tracking-[0.4px]";

// The eyebrow header for the merged "next" block, by dispatch type.
const NEXT_HEADER: Record<string, string> = {
  learn: "Keep building",
  look: "Worth a look",
  do: "A real step",
  close: "Close the loop",
};

// The three story areas, in the order the strip shows them.
const STORY_ORDER: CoverageKey[] = ["motivations", "skills", "strengths"];

// "Motivations", "Motivations and Skills", "Motivations, Skills, and Strengths".
function joinLabels(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

// One shared link treatment so every tappable link on the card reads the same:
// underlined, its own semantic colour, with a trailing chevron.
const LINK_CLASS =
  "group inline-flex items-center gap-1.5 font-semibold tracking-[0.01em] transition duration-150 hover:brightness-125 active:opacity-70";

// An artistic divider — a hairline that fades in from both edges to a single
// glowing accent node at the centre, echoing the constellation. One consistent
// piece of separation between every section.
function SectionDivider({ rgb }: { rgb: string }) {
  return (
    <div aria-hidden="true" className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.10]" />
      <span
        className="h-[3px] w-[3px] rounded-full"
        style={{ background: `rgb(${rgb})`, boxShadow: `0 0 6px rgba(${rgb},0.8)` }}
      />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.10]" />
    </div>
  );
}

export function TodayHeart({
  data,
  onPrimary,
}: {
  data: TodayHeartData;
  onPrimary: () => void;
}) {
  const router = useRouter();
  const { dispatch, coverage, welcome } = data;
  const accent = DISPATCH_ACCENT[dispatch.type] ?? DISPATCH_ACCENT.learn;
  const rgb = accent.rgb;
  // Parse the accent string into the {r,g,b} the ConstellationAnchor wants.
  const [ar, ag, ab] = rgb.split(",").map((n) => Number(n.trim()));
  const accentObj = { r: ar || 182, g: ag || 160, b: ab || 255 };

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [howLoading, setHowLoading] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [whyOpen, setWhyOpen] = React.useState(false);
  // Prompt Lab (internal, passcode-gated) can preview a re-toned/re-sized retort
  // in place — live only, never saved.
  const [labPreview, setLabPreview] =
    React.useState<PromptLabAppliedPreview | null>(null);

  // Close either modal on Escape.
  React.useEffect(() => {
    if (!whyOpen && !moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setWhyOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [whyOpen, moreOpen]);

  // "How would I even do this?" — saves the action and opens its playbook,
  // auto-generating the how (who to ask, what to say, what to watch for). A move
  // a teen can't picture starting is just anxiety; this makes it walkable.
  async function handleHowTo() {
    if (!dispatch.save || howLoading) return;
    setHowLoading(true);
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "today",
          lane: "today",
          title: dispatch.save.actionTitle,
          description: dispatch.why,
        }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok && d?.action?.id) {
        emitActionAdded(dispatch.save.actionTitle);
        router.push(`/main/actions/${d.action.id}?start=1`);
        return;
      }
    } catch {
      // fall through — leave the button enabled to retry
    }
    setHowLoading(false);
  }

  // "Do" beats save the move into Actions (matching the app-wide pattern:
  // POST /api/guidance/actions then emit the toast), then step over to Actions.
  async function handleSaveAction() {
    if (!dispatch.save || saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "today",
          lane: "today",
          title: dispatch.save.actionTitle,
          description: dispatch.why,
        }),
      });
      if (res.ok) {
        emitActionAdded(dispatch.save.actionTitle);
        setSaved(true);
        window.setTimeout(() => router.push(dispatch.destination.route), 750);
      }
    } catch {
      // leave the button enabled to retry
    } finally {
      setSaving(false);
    }
  }

  const primaryLabel = saved
    ? "Added to your Actions"
    : saving
      ? "Adding…"
      : dispatch.destination.label;

  const hasCoverage = coverage.filledCount > 0;

  // Every Today opens with an agentic lead — a real "we know you" read, never a
  // bare move. Voice over chrome: no eyebrow label, the prose just speaks.
  // Prefer the woven briefing (who you are → what you've done here → what's
  // next); fall back to the rotating establishing read for older packs.
  const leadLine =
    data.lead?.trim() ||
    establishingRead({
      body: data.synthesis?.body,
      reads: data.reads,
      fallback: data.reinforcement?.line ?? "",
    });

  // Progressive-disclosure hero: a ≤50-word retort shown by default, an optional
  // "See more" panel (below, not a modal) with the fuller read, and a "Why"
  // modal with the reasoning. Prefer the generated fields; fall back so older
  // packs still render cleanly.
  const heroRetort = data.retort?.trim() || capWords(leadLine, 48);
  const heroBody =
    data.body?.trim() ||
    (leadLine && leadLine !== heroRetort ? leadLine : null);
  const heroWhy = data.why?.trim() || dispatch.why?.trim() || null;

  // The action zone prefers the purpose-written agentic paragraph; older packs
  // fall back to stitching orient + move + payoff.
  const actionPitch = dispatch.pitch?.trim() || null;

  // The hero read, broken into short paragraphs for calmer mobile reading. A
  // live Prompt Lab preview (if any) stands in for the saved retort.
  const previewRetort = labPreview?.targetText?.trim() || null;
  const displayRetort = previewRetort ?? heroRetort;
  const heroParagraphs = displayRetort ? splitIntoParagraphs(displayRetort) : [];

  // Empty progress art says nothing — the meter only earns its space once
  // there's real coverage to carry.
  const showMeter = hasCoverage;
  // The story lead is one line with an INLINE call to action — the tail of the
  // sentence is itself the link, so context and action share a line instead of
  // sandwiching the bars with a separate "Continue your story" row.
  const storyAreas = STORY_ORDER.map((k) =>
    coverage.areas.find((a) => a.key === k)
  ).filter((a): a is CoverageArea => Boolean(a));
  const filledStoryLabels = storyAreas
    .filter((a) => a.filled)
    .map((a) => a.label);
  const nextStoryArea = storyAreas.find((a) => !a.filled) ?? null;
  let storyPrefix: string;
  let storyLinkText: string | null;
  if (nextStoryArea) {
    if (filledStoryLabels.length === 0) {
      storyPrefix = "Let's ";
      storyLinkText = "start telling your story";
    } else {
      storyPrefix = `You've done your ${joinLabels(filledStoryLabels)} — now let's `;
      storyLinkText = "continue your story";
    }
  } else if (coverage.nextGapKey === "experience") {
    storyPrefix = "You've told me your whole story — now ";
    storyLinkText = "reflect on what you've tried";
  } else {
    storyPrefix = "You've told me your whole story — the picture's complete.";
    storyLinkText = null;
  }
  // The story flow can be deep-linked to one family via ?family=. These are the
  // gaps it can fill directly; others fall back to the generic entry.
  const STORY_FAMILIES: CoverageKey[] = ["motivations", "strengths", "skills"];
  // Point the nudge at whatever actually fills the NEXT gap. Most gaps
  // (motivations, strengths, skills, story, direction) are story-fed; the
  // "experience" gap is only filled by doing and reflecting on an action, so
  // sending someone to Story there would be a dead end.
  const gapNudge =
    coverage.nextGapKey === "experience"
      ? {
          lead: "You've tried a couple of things — telling me how they actually landed is what sharpens everything else.",
          label: "Reflect on what you've tried",
          route: "/main/actions",
        }
      : {
          lead: "The picture above is still forming. A few more pieces of your story and the guidance gets a lot sharper.",
          label: "Continue your story",
          // Land straight on the next gap's area (Skills / Motivations /
          // Strengths) rather than the generic story entry.
          route:
            coverage.nextGapKey && STORY_FAMILIES.includes(coverage.nextGapKey)
              ? `/main/story?family=${coverage.nextGapKey}`
              : "/main/story",
        };

  return (
    <div className="relative">
      {/* top row: just the dispatch mark + a live pulse. Voice over chrome —
          the type glyph is the only signal; no "Do · in the world", no "Today"
          (you're on the Today tab already). */}
      <div className="flex items-center justify-between">
        <DispatchGlyph type={dispatch.type} showLabel={false} />
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-50 motion-safe:animate-ping"
            style={{ background: "rgba(181,186,196,0.5)" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: "rgba(181,186,196,0.5)" }}
          />
        </span>
      </div>

      {/* The arrival masthead — the centered anchor in every state. */}
      <WelcomeName
        firstName={welcome.firstName}
        isNewUser={welcome.isNewUser}
        accentRgb={rgb}
      />

      {/* The agentic lead — the hero. A ≤50-word retort in every state (neutral
          prose so the accent stays a spot), with "See more" opening a panel
          below and "Why" opening the reasoning. */}
      {heroRetort ? (
        <div
          className={`relative mt-4 ${previewRetort ? "rounded-2xl p-3 ring-1 ring-amber-300/45" : ""}`}
        >
          {/* Hidden, passcode-gated internal tuning dot (top-right of the read it
              tunes). Previews are live-only and never saved. */}
          <PromptLabTrigger
            dark
            pageKey="today"
            targetField="main"
            currentText={heroRetort}
            onApplied={setLabPreview}
            hasActivePreview={!!labPreview}
            onReset={() => setLabPreview(null)}
          />
          {/* A soft accent glow warms the top-right at every size (diffuse, no
              points, safe behind text). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(70% 80% at 100% 4%, rgba(${rgb},0.05), transparent 60%)`,
            }}
          />
          {/* Corner-anchored constellation that grows with the canvas: on wider
              screens it fills the right gutter beyond the readable text column.
              Hidden on phones — there the retort fills the width and the hero
              read must stay pristine. Masked to the top-right so it fades toward
              the text, never sitting behind it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden opacity-[0.5] sm:block"
            style={{
              WebkitMaskImage:
                "radial-gradient(95% 95% at 100% 0%, #000 0%, rgba(0,0,0,0.8) 26%, rgba(0,0,0,0.3) 52%, transparent 72%)",
              maskImage:
                "radial-gradient(95% 95% at 100% 0%, #000 0%, rgba(0,0,0,0.8) 26%, rgba(0,0,0,0.3) 52%, transparent 72%)",
            }}
          >
            <ConstellationAnchor
              seed={`today-read:${dispatch.type}`}
              accent={accentObj}
            />
          </div>

          <div className="relative z-10 max-w-[560px]">
            <div className="space-y-3.5">
              {heroParagraphs.map((para, i) => (
                <p key={i} className={`text-[19px] ${PROSE_CLASS}`} style={PROSE_STYLE}>
                  {para}
                </p>
              ))}
            </div>

            {heroBody || heroWhy ? (
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {heroBody ? (
                  <button
                    type="button"
                    onClick={() => setMoreOpen(true)}
                    className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-semibold tracking-[0.01em] transition duration-150 hover:brightness-110 active:opacity-80"
                    style={{
                      color: `rgb(${rgb})`,
                      background: `rgba(${rgb},0.055)`,
                      border: `1px solid rgba(${rgb},0.16)`,
                    }}
                  >
                    See more
                    <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </button>
                ) : null}
                {heroWhy ? (
                  <button
                    type="button"
                    onClick={() => setWhyOpen(true)}
                    className={`${LINK_CLASS} text-[15px]`}
                    style={{ color: "#B5BAC4" }}
                  >
                    Why
                    <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <SectionDivider rgb={rgb} />

      {/* PROGRESS — the story cluster, first and on its own: a conversational
          lead ("You've done your Motivations — now let's continue your story"),
          the progress bars (a readout; only the small Awards control taps), then
          the "Continue your story" link deep-linked to the next area. */}
      {showMeter ? (
        <div className="space-y-2">
          {/* Lead + CTA on ONE line: the tail of the sentence is the link. */}
          <p
            className="max-w-[560px] text-[15px] leading-[1.55]"
            style={{ color: "#C9CDD6", WebkitFontSmoothing: "antialiased" }}
          >
            {storyPrefix}
            {storyLinkText ? (
              <button
                type="button"
                onClick={() => router.push(gapNudge.route)}
                className="font-semibold transition hover:brightness-110 active:opacity-70"
                style={{ color: `rgb(${rgb})` }}
              >
                {storyLinkText} →
              </button>
            ) : null}
          </p>

          {/* Bars, then the trophy meter as the closing footer. */}
          <StoryRail coverage={coverage} accentRgb={rgb} showHeadline={false} />
        </div>
      ) : null}

      <SectionDivider rgb={rgb} />

      {/* ACTION — the dispatched move on its own: a balanced accent header, the
          agentic sentence, the one bright button, and lighter links. A
          right-weighted constellation + accent bloom give it life on wider
          canvases; hidden on phones so the copy stays clean. */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="pointer-events-none absolute hidden inset-0 opacity-[0.55] sm:block">
          <ConstellationAnchor
            seed={`today-action:${dispatch.type}`}
            accent={accentObj}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 100% at 90% 4%, rgba(${rgb},0.10), transparent 60%)`,
          }}
        />

        <div className="relative z-10 px-1 py-2">
          {/* Balanced header — an accent glyph anchor + a real label (not a tiny
              eyebrow), sized to hold its own against the copy without shouting. */}
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[14px] leading-none"
              style={{
                color: `rgb(${rgb})`,
                background: `rgba(${rgb},0.08)`,
                border: `1px solid rgba(${rgb},0.18)`,
              }}
            >
              {accent.glyph}
            </span>
            <span
              className="text-[14px] font-semibold tracking-[0.005em]"
              style={{ color: "#D6D9DF" }}
            >
              {NEXT_HEADER[dispatch.type] ?? "Your next move"}
            </span>
          </div>

          {actionPitch ? (
            <p
              className={`mt-3 max-w-[560px] text-[16px] ${PROSE_CLASS}`}
              style={PROSE_STYLE}
            >
              {actionPitch}
            </p>
          ) : (
            <>
              <h1
                className="mt-3 text-[18px] font-semibold leading-[1.4] tracking-[-0.015em]"
                style={{ color: "#C9CDD6", WebkitFontSmoothing: "antialiased" }}
              >
                {dispatch.orient ? `${dispatch.orient} ` : ""}
                {dispatch.move}
              </h1>
              {dispatch.return ? (
                <p
                  className="mt-2 max-w-[560px] text-[15px] leading-[1.5]"
                  style={{ color: "#B5BAC4", WebkitFontSmoothing: "antialiased" }}
                >
                  {dispatch.return}
                </p>
              ) : null}
            </>
          )}

          {dispatch.meta ? (
            <div className="mt-3 text-[13px] tabular-nums text-white/45">
              {dispatch.meta.duration} · {dispatch.meta.when}
            </div>
          ) : null}

          {/* The one bright commit — a real button. */}
          <div className="mt-4">
            <button
              type="button"
              onClick={dispatch.save ? handleSaveAction : onPrimary}
              disabled={saving || saved}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition hover:brightness-110 active:opacity-80 disabled:opacity-70"
              style={{
                color: `rgb(${rgb})`,
                background: `rgba(${rgb},0.08)`,
                border: `1px solid rgba(${rgb},0.28)`,
                boxShadow: `0 2px 10px rgba(${rgb},0.08)`,
              }}
            >
              <span>{primaryLabel}</span>
              {saved ? (
                <Check className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Lighter links: the "how", plus a secondary path — a loose end to
              reflect on, or (off the learn beat) keep building your story. */}
          {dispatch.save ? (
            <button
              type="button"
              onClick={handleHowTo}
              disabled={howLoading}
              className={`${LINK_CLASS} mt-3.5 text-[14px] disabled:opacity-70`}
              style={{ color: "#B5BAC4" }}
            >
              {howLoading ? "Opening…" : "How would I even do this?"}
              <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>
          ) : null}

          {data.looseThread?.title ? (
            <div className="mt-3.5">
              <button
                type="button"
                onClick={() => router.push(data.looseThread!.route)}
                className={`${LINK_CLASS} max-w-[520px] text-left text-[14px]`}
                style={{ color: "rgb(55,211,160)" }}
              >
                {data.looseThread.kind === "due"
                  ? `You started “${data.looseThread.title}” — how's it going?`
                  : `Reflect on “${data.looseThread.title}”`}
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
            </div>
          ) : null}

        </div>
      </div>

      {/* "See more" — the fuller read, in a focused modal (not an inline
          expand), matching the Why overlay. */}
      {moreOpen && heroBody ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="The fuller read"
          onClick={() => setMoreOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:pt-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-[440px] overflow-y-auto rounded-3xl border border-white/[0.06] bg-[linear-gradient(180deg,#0c1428,#070d1c)] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
          >
            <div
              className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "#B5BAC4" }}
            >
              The whole picture
            </div>
            <p className={`text-[17px] ${PROSE_CLASS}`} style={PROSE_STYLE}>
              {heroBody}
            </p>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-[13px] font-semibold text-[#BFC3CD] transition hover:border-white/[0.16]"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {/* "Why" — the reasoning behind today's read, one tap away. */}
      {whyOpen && heroWhy ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Why you're seeing this"
          onClick={() => setWhyOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:pt-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-[420px] overflow-y-auto rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0c1428,#070d1c)] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
          >
            <div
              className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em]"
              style={{ color: `rgb(${rgb})` }}
            >
              Why this
            </div>
            <p className={`text-[17px] ${PROSE_CLASS}`} style={PROSE_STYLE}>{heroWhy}</p>
            <button
              type="button"
              onClick={() => setWhyOpen(false)}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition hover:brightness-110"
              style={{
                color: `rgb(${rgb})`,
                background: `rgba(${rgb},0.12)`,
                border: `1px solid rgba(${rgb},0.42)`,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
