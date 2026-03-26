"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send } from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

import { normalizeZip, stateFullName, lookupZipPlace } from "./zipLookup";

/**
 * Speech types
 */
type SpeechRecognitionConstructor = {
  new (): SpeechRecognition;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/* ============================================================
   Types
   ============================================================ */

type StepId =
  | "welcome"
  | "name"
  | "situation"
  | "zip"
  | "certainty"
  | "postPlans"
  | "activities"
  | "fun"
  | "summary";

const STEPS: StepId[] = [
  "welcome",
  "name",
  "situation",
  "zip",
  "certainty",
  "postPlans",
  "activities",
  "fun",
  "summary",
];

type ScreenMode = "question" | "retort" | "completion";

type Situation = "high_school" | "young_adult" | null;
type Certainty = "strong" | "kinda" | "no_clue" | null;

type PostPlanKey =
  | "job"
  | "associates"
  | "credential"
  | "military"
  | "four_year"
  | "no_idea";

type ActivityKey =
  | "sports"
  | "visual_arts"
  | "performing_arts"
  | "volunteer"
  | "job"
  | "other";

type FunChoice = "dog" | "cat" | "bearded_dragon" | "rock" | null;

type VoiceTarget = "name" | "zip" | "activitiesOther";

const STORAGE_KEY = "everleapOnboarding_v4_convo_min";

// Retort timing (3 seconds everywhere)
const RETORT_MS_DEFAULT = 3000;
const RETORT_MS_FUN = 3000;

/* ============================================================
   Copy
   ============================================================ */

const STEP_META: Record<
  Exclude<StepId, "summary">,
  { kicker: string; title: string; micro?: string; lead?: string }
> = {
  welcome: {
    kicker: "Everleap",
    title: "Welcome to Everleap!",
    micro:
      "I’ll ask a few questions to understand you and where you’re headed.\nThis isn’t a test — just a conversation to shape what comes next.",
    lead: "A few quick questions. Then we make this useful.",
  },
  name: {
    kicker: "Everleap · Getting to know you",
    title: "What name do you like to be called?",
    lead: "Let’s start simple.",
  },
  situation: {
    kicker: "Everleap · Your world",
    title: "Which best describes where you’re at right now?",
    lead: "This helps me get the pace right.",
  },
  zip: {
    kicker: "Everleap · Local",
    title: "What’s your zip code?",
    micro: "Optional — later I can match local opportunities near you.",
    lead: "Only if you want local ideas later.",
  },
  certainty: {
    kicker: "Everleap · What’s next",
    title: "Do you have a sense of what comes next?",
    micro: "All three are completely okay.",
    lead: "There’s no wrong starting point here.",
  },
  postPlans: {
    kicker: "Everleap · Possibilities",
    title: "What are you considering after high school?",
    micro: "Pick what feels true. You can choose more than one.",
    lead: "Choose what feels live right now.",
  },
  activities: {
    kicker: "Everleap · Outside school",
    title: "What do you do outside of school?",
    micro: "Pick anything that fits.",
    lead: "How you spend time tells me a lot.",
  },
  fun: {
    kicker: "Everleap · One fun question",
    title: "Pick one.",
    lead: "No strategy needed.",
  },
};

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function isMeaningfulText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 3) return false;

  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (!lettersOnly) return false;

  const unique = new Set(lettersOnly.toLowerCase()).size;
  if (unique <= 2) return false;

  const squashed = trimmed.replace(/\s+/g, "");
  if (/^(.)\1{6,}$/i.test(squashed)) return false;

  return true;
}

function firstName(raw: string) {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const first = cleaned.split(" ")[0] ?? "";
  return first.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

function joinNatural(list: string[]) {
  const clean = list.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0]!;
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

function getRetortMs(fromStep: StepId) {
  return fromStep === "fun" ? RETORT_MS_FUN : RETORT_MS_DEFAULT;
}

/* ============================================================
   Visual helpers
   ============================================================ */

function visualToneForStep(stepId: StepId) {
  if (stepId === "welcome" || stepId === "summary") {
    return {
      orbA: "bg-cyan-300/10",
      orbB: "bg-violet-400/10",
      ring: "from-cyan-200/14 via-white/8 to-transparent",
      glow: "shadow-[0_0_80px_rgba(103,232,249,0.08)]",
    };
  }

  if (stepId === "fun") {
    return {
      orbA: "bg-fuchsia-300/10",
      orbB: "bg-amber-300/10",
      ring: "from-fuchsia-200/14 via-white/8 to-transparent",
      glow: "shadow-[0_0_80px_rgba(217,70,239,0.08)]",
    };
  }

  if (stepId === "zip" || stepId === "postPlans") {
    return {
      orbA: "bg-amber-300/10",
      orbB: "bg-orange-400/10",
      ring: "from-amber-200/14 via-white/8 to-transparent",
      glow: "shadow-[0_0_80px_rgba(251,191,36,0.08)]",
    };
  }

  return {
    orbA: "bg-sky-300/10",
    orbB: "bg-violet-400/10",
    ring: "from-sky-200/14 via-white/8 to-transparent",
    glow: "shadow-[0_0_80px_rgba(56,189,248,0.08)]",
  };
}

/* ============================================================
   UI atoms
   ============================================================ */

function ProgressDashes({ current, total }: { current: number; total: number }) {
  const filled = clampInt(current + 1, 1, total);

  return (
    <div
      className="flex items-center justify-center gap-2"
      aria-label={`Step ${filled} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        const done = i < filled;

        return (
          <span
            key={i}
            className={[
              "rounded-full transition-all duration-300",
              active
                ? "h-[8px] w-9 bg-white/72 shadow-[0_0_22px_rgba(255,255,255,0.18)]"
                : "h-[6px] w-7",
              !active && done ? "bg-white/28" : "",
              !active && !done ? "bg-white/10" : "",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

function MinimalTopLeftBrand({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 text-white/82 transition hover:text-white"
      aria-label="Go to landing page"
      title="Everleap"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-white/[0.06] text-xs font-semibold backdrop-blur-sm">
        EL
      </span>
      <span className="text-sm font-semibold tracking-[0.12em] uppercase">Everleap</span>
    </button>
  );
}

function MinimalBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-white/64 transition hover:text-white/86"
      aria-label="Back"
      title="Back"
    >
      <span aria-hidden="true">←</span>
      Back
    </button>
  );
}

function ChoiceRowText({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-[22px] px-4 py-4 text-left transition sm:px-5"
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 rounded-[22px] border transition",
          selected
            ? "border-white/18 bg-white/[0.08] shadow-[0_0_36px_rgba(255,255,255,0.05)]"
            : "border-white/0 bg-white/[0.02] group-hover:border-white/10 group-hover:bg-white/[0.045]",
        ].join(" ")}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/12 via-white/8 to-transparent" />
      <div
        className={[
          "relative text-[16px] leading-7 transition",
          selected
            ? "font-semibold text-white"
            : "font-normal text-white/70 group-hover:text-white/88",
        ].join(" ")}
      >
        {label}
      </div>
    </button>
  );
}

function EndOfAnswersLine() {
  return <div className="mt-3 h-px w-full bg-white/10" aria-hidden="true" />;
}

function ThinkingSurface({
  value,
  onChange,
  onSubmit,
  canSubmit,
  placeholder,
  textareaRef,
  showMic,
  isListening,
  speechSupported,
  onToggleMic,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  placeholder?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  showMic?: boolean;
  isListening?: boolean;
  speechSupported?: boolean;
  onToggleMic?: () => void;
  inputMode?: React.HTMLAttributes<HTMLTextAreaElement>["inputMode"];
}) {
  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm sm:p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/14 via-white/8 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_48%)]" />

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            inputMode={inputMode}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            rows={4}
            placeholder={placeholder ?? ""}
            className="min-h-[128px] w-full resize-none bg-transparent px-1 py-1 text-[16px] leading-7 text-white/90 outline-none placeholder:text-white/26"
          />

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-3">
            {showMic ? (
              <button
                type="button"
                onClick={onToggleMic}
                disabled={!speechSupported}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm transition",
                  speechSupported
                    ? isListening
                      ? "bg-white/[0.06] text-white/90"
                      : "text-white/58 hover:bg-white/[0.04] hover:text-white/84"
                    : "cursor-not-allowed text-white/24",
                ].join(" ")}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                title={
                  !speechSupported
                    ? "Voice not supported"
                    : isListening
                    ? "Listening…"
                    : "Voice input"
                }
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? "Listening…" : "Speak"}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition",
                canSubmit
                  ? "border-white/16 bg-white/[0.08] text-white/86 hover:border-white/24 hover:bg-white/[0.12] hover:text-white"
                  : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/28",
              ].join(" ")}
              aria-label="Continue"
              title="Continue"
            >
              <span>Continue</span>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalContinue({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={onClick}
        disabled={Boolean(disabled)}
        className={`inline-flex items-center gap-2 text-sm font-medium transition ${
          disabled ? "cursor-not-allowed text-white/32" : "text-white/82 hover:text-white"
        }`}
        aria-label={label ?? "Continue"}
        title={label ?? "Continue"}
      >
        <span>{label ?? "Continue"}</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

function PauseLine({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.92 }}
      animate={{ opacity: show ? 1 : 0, scaleX: show ? 1 : 0.92 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-hidden="true"
      className="mt-8 origin-left"
    >
      <div className="h-px w-44 rounded-full bg-gradient-to-r from-white/24 via-white/12 to-transparent" />
    </motion.div>
  );
}

/* ============================================================
   Retorts
   ============================================================ */

function postPlanLabel(k: PostPlanKey): string {
  switch (k) {
    case "job":
      return "a job";
    case "four_year":
      return "four-year college";
    case "associates":
      return "community / two-year college";
    case "credential":
      return "a trade / credential program";
    case "military":
      return "the military";
    case "no_idea":
      return "not sure yet";
  }
}

function activityLabel(k: ActivityKey): string {
  switch (k) {
    case "sports":
      return "sports / training";
    case "visual_arts":
      return "art / design";
    case "performing_arts":
      return "music / dance / theater";
    case "volunteer":
      return "volunteering";
    case "job":
      return "working a job";
    case "other":
      return "other";
  }
}

function buildRetort(args: {
  fromStep: StepId;
  name: string;
  situation: Situation;
  certainty: Certainty;
  postPlans: PostPlanKey[];
  activities: ActivityKey[];
  activitiesOther: string;
  funChoice: FunChoice;
  zip5: string;
  zipPlaceLabel: string | null;
  funLatencyMs?: number | null;
}) {
  const {
    fromStep,
    name,
    situation,
    certainty,
    postPlans,
    activities,
    activitiesOther,
    funChoice,
    zip5,
    zipPlaceLabel,
    funLatencyMs,
  } = args;

  const n = firstName(name);

  if (fromStep === "name") {
    return n ? `Welcome, ${n}.` : "Welcome.";
  }

  if (fromStep === "situation") {
    if (situation === "high_school") {
      return "Got it — high school. That helps me keep options wide, practical, and low-pressure.";
    }
    if (situation === "young_adult") {
      return "Got it — young adult. That helps me focus on steps that turn ideas into real momentum.";
    }
    return "Got it. That helps me choose the right pace — explore broadly, then narrow fast.";
  }

  if (fromStep === "zip") {
    if (!zip5) {
      return "Totally optional — no problem. Even without it, I can still tailor good next steps.";
    }
    if (zipPlaceLabel) {
      return `Love it — ${zipPlaceLabel}. That’ll help a lot for future recommendations for you.`;
    }
    return `Love it — ${zip5}. That’ll help a lot for future recommendations for you.`;
  }

  if (fromStep === "certainty") {
    if (certainty === "strong") {
      return "Nice — feeling pretty sure means we can move faster, then sanity-check with a couple quick experiments.";
    }
    if (certainty === "kinda") {
      return "Perfect — having some ideas is enough. We’ll narrow by testing what gives you energy and what actually fits.";
    }
    if (certainty === "no_clue") {
      return "Completely normal. Not knowing yet is useful data — it means we should surface better options fast.";
    }
    return "Got it. We’ll match the pace to where you’re at — no pressure to be certain.";
  }

  if (fromStep === "postPlans") {
    if (postPlans.includes("no_idea")) {
      return "Noted — not sure yet. That’s a smart starting point: explore without committing, and learn fast.";
    }

    const labels = postPlans.map(postPlanLabel);
    const listText = joinNatural(labels);

    if (postPlans.length >= 3) {
      return `Nice — you’re considering ${listText}. Having a few real options helps us compare quickly and test what’s worth pursuing first.`;
    }

    return `Good — you’re considering ${listText}. That’s enough direction to build a tight first set of recommendations.`;
  }

  if (fromStep === "activities") {
    const labels = activities.map(activityLabel);
    const listText = joinNatural(labels);

    if (activities.includes("other") && isMeaningfulText(activitiesOther)) {
      return `Love it — ${listText}. The extra detail helps me keep recommendations realistic and actually matched to your life.`;
    }

    return `Nice — ${listText}. How you spend time is one of the strongest signals for what will (and won’t) fit.`;
  }

  if (fromStep === "fun") {
    const quick = typeof funLatencyMs === "number" && funLatencyMs >= 0 && funLatencyMs < 900;
    const slow = typeof funLatencyMs === "number" && funLatencyMs >= 1800;

    const tempoTag = quick ? "Fast pick." : slow ? "Considered pick." : "";

    if (funChoice === "dog") {
      return `${tempoTag ? `${tempoTag} ` : ""}Dog energy: warm-signal, loyal-core. You probably read people’s moods before they speak. It’s a vibe, not destiny.`;
    }
    if (funChoice === "cat") {
      return `${tempoTag ? `${tempoTag} ` : ""}Cat energy: independent mind, high standards. You spot patterns and nonsense pretty quickly. It’s a vibe, not destiny.`;
    }
    if (funChoice === "bearded_dragon") {
      return `${tempoTag ? `${tempoTag} ` : ""}Bearded dragon energy: calm confidence + original taste. You’re not here for generic options. It’s a vibe, not destiny.`;
    }
    if (funChoice === "rock") {
      return `${tempoTag ? `${tempoTag} ` : ""}Rock energy: minimalist focus, unshakeable calm. You’d rather be solid than loud. It’s a vibe, not destiny.`;
    }
    return "Nice pick. It’s a vibe, not destiny.";
  }

  return "Perfect. That gives me enough to keep going.";
}

/* ============================================================
   Completion transition
   ============================================================ */

function CompletionTransition({ onDone }: { onDone: () => void }) {
  const [showLine, setShowLine] = React.useState(false);

  React.useEffect(() => {
    const t1 = window.setTimeout(() => setShowLine(true), 250);
    const t2 = window.setTimeout(onDone, 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className="flex min-h-[62svh] w-full items-center">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm sm:px-8 sm:py-10"
        >
          <div className="text-sm font-medium tracking-[0.12em] uppercase text-white/44">
            Nice
          </div>

          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            That gives me enough to work with.
          </h2>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/68">
            Give me a second to turn that into a clearer starting point.
          </p>

          <div className="mt-8 flex items-center gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.45, scale: 0.9, x: 0 }}
                animate={{
                  opacity: i === 3 ? 0.9 : 0.22,
                  scale: i === 3 ? 1.08 : 0.92,
                  x: (3 - i) * 7,
                }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="h-[6px] w-[6px] rounded-full bg-white/70"
                aria-hidden="true"
              />
            ))}
          </div>

          <PauseLine show={showLine} />
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   Summary
   ============================================================ */

function buildInsight(options: {
  situation: Situation;
  certainty: Certainty;
  postPlans: PostPlanKey[];
  activities: ActivityKey[];
  activitiesOther: string;
  funChoice: FunChoice;
  zip5: string;
}) {
  const { situation, certainty, postPlans, activities, activitiesOther, funChoice, zip5 } = options;

  const parts: string[] = [];

  if (situation === "high_school") {
    if (certainty === "strong") parts.push("You’re in high school and you’ve got a pretty clear direction.");
    else if (certainty === "kinda") parts.push("You’re in high school with a few ideas — enough to start testing what fits.");
    else if (certainty === "no_clue") parts.push("You’re in high school and you’re not sure yet what’s next — which is completely normal.");
    else parts.push("You’re in high school and taking a moment to think about what comes next.");
  } else if (situation === "young_adult") {
    if (certainty === "strong") parts.push("You’re a young adult with clear direction — a great place to turn plans into moves.");
    else if (certainty === "kinda") parts.push("You’re a young adult with some ideas — enough to narrow things quickly.");
    else if (certainty === "no_clue") parts.push("You’re a young adult and you’re not sure yet what’s next — we can work with that.");
    else parts.push("You’re a young adult taking a pause to figure out what fits.");
  } else {
    parts.push("You’re taking a moment to step back and look at what comes next.");
  }

  if (postPlans.length > 0) {
    if (postPlans.includes("no_idea")) {
      parts.push("You’re keeping options open right now — so we’ll explore without forcing a single lane.");
    } else {
      const mapped: string[] = [];
      if (postPlans.includes("job")) mapped.push("building experience through work");
      if (postPlans.includes("four_year")) mapped.push("a four-year college path");
      if (postPlans.includes("associates")) mapped.push("community or two-year options");
      if (postPlans.includes("credential")) mapped.push("trade or credential programs");
      if (postPlans.includes("military")) mapped.push("a path through the military");

      if (mapped.length > 0) {
        const last = mapped.pop();
        const listText = mapped.length ? `${mapped.join(", ")}, and ${last}` : last!;
        parts.push(`You’re considering ${listText}. That’s enough to build a few solid options and test them fast.`);
      }
    }
  }

  if (activities.length > 0 || isMeaningfulText(activitiesOther)) {
    const act: string[] = [];
    if (activities.includes("sports")) act.push("sports or training");
    if (activities.includes("visual_arts")) act.push("art or design");
    if (activities.includes("performing_arts")) act.push("music, dance, or theater");
    if (activities.includes("volunteer")) act.push("volunteering");
    if (activities.includes("job")) act.push("working a job");

    if (act.length) {
      const last = act.pop();
      const listText = act.length ? `${act.join(", ")}, and ${last}` : last!;
      parts.push(`Outside of school, you’re spending time on ${listText}. That’s a strong signal about how you like to learn and work.`);
    }

    if (isMeaningfulText(activitiesOther)) {
      parts.push("The extra detail you shared helps tighten the fit even more.");
    }
  }

  if (zip5) {
    parts.push("I’ll keep local opportunities in mind when I suggest next steps.");
  }

  if (funChoice === "dog") parts.push("Also: dog energy. Noted.");
  if (funChoice === "cat") parts.push("Also: cat energy. Noted.");
  if (funChoice === "bearded_dragon") parts.push("Also: bearded dragon energy. Respect.");
  if (funChoice === "rock") parts.push("Also: rock. Iconic.");

  parts.push("This is just a starting point — enough to generate good first options, then improve with a few more questions later.");

  return parts.join(" ");
}

/* ============================================================
   Page
   ============================================================ */

type RetortOverrides = Partial<{
  name: string;
  situation: Situation;
  certainty: Certainty;
  postPlans: PostPlanKey[];
  activities: ActivityKey[];
  activitiesOther: string;
  funChoice: FunChoice;
  zip5: string;
  zipPlaceLabel: string | null;
  funLatencyMs: number | null;
}>;

const ZIP_OVERRIDES: Record<string, { city: string; state: string }> = {
  "94901": { city: "San Rafael", state: "CA" },
};

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const shouldReset = searchParams.get("reset") === "1";

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(1);

  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient = GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ?? GRADIENT_CONFIGS[1];

  const pageBgImage = gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const pageBgStyle: CSSProperties = pageBgImage ? { backgroundImage: pageBgImage } : {};

  const [stepIndex, setStepIndex] = React.useState(0);
  const stepId = STEPS[stepIndex];

  const [screenMode, setScreenMode] = React.useState<ScreenMode>("question");
  const [retortText, setRetortText] = React.useState<string | null>(null);
  const [retortFromStep, setRetortFromStep] = React.useState<StepId | null>(null);

  const retortTimerRef = React.useRef<number | null>(null);
  const advanceLockRef = React.useRef(false);
  const retortTokenRef = React.useRef<string | null>(null);

  const [name, setName] = React.useState("");
  const [situation, setSituation] = React.useState<Situation>(null);
  const [zip, setZip] = React.useState("");
  const [certainty, setCertainty] = React.useState<Certainty>(null);
  const [postPlans, setPostPlans] = React.useState<PostPlanKey[]>([]);
  const [activities, setActivities] = React.useState<ActivityKey[]>([]);
  const [activitiesOther, setActivitiesOther] = React.useState("");
  const [funChoice, setFunChoice] = React.useState<FunChoice>(null);

  const [draft, setDraft] = React.useState("");

  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastFinalRef = React.useRef<string>("");
  const activeTargetRef = React.useRef<VoiceTarget | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const funShownAtRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (shouldReset) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}

      setStepIndex(0);
      setScreenMode("question");
      setRetortText(null);
      setRetortFromStep(null);
      retortTokenRef.current = null;
      advanceLockRef.current = false;

      setName("");
      setSituation(null);
      setZip("");
      setCertainty(null);
      setPostPlans([]);
      setActivities([]);
      setActivitiesOther("");
      setFunChoice(null);
      setDraft("");

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      lastFinalRef.current = "";
      activeTargetRef.current = null;
      funShownAtRef.current = null;
    }

    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  }, [shouldReset]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRec = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  function clearRetortTimer() {
    if (retortTimerRef.current) {
      window.clearTimeout(retortTimerRef.current);
      retortTimerRef.current = null;
    }
  }

  React.useEffect(() => {
    return () => {
      clearRetortTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stepIndex,
          name,
          situation,
          zip,
          certainty,
          postPlans,
          activities,
          activitiesOther,
          funChoice,
        })
      );
    } catch {}
  }, [stepIndex, name, situation, zip, certainty, postPlans, activities, activitiesOther, funChoice]);

  React.useEffect(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    lastFinalRef.current = "";
    activeTargetRef.current = null;
    setDraft("");
    advanceLockRef.current = false;

    if (stepId === "fun" && screenMode === "question") {
      funShownAtRef.current = typeof performance !== "undefined" ? performance.now() : Date.now();
    } else {
      funShownAtRef.current = null;
    }
  }, [stepId, screenMode]);

  function lockAdvance(): boolean {
    if (advanceLockRef.current) return false;
    advanceLockRef.current = true;
    return true;
  }

  function unlockAdvanceSoon() {
    window.setTimeout(() => {
      advanceLockRef.current = false;
    }, 0);
  }

  function getOrCreateRecognition(): SpeechRecognition | null {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRec = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;
    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        const t = (res?.[0]?.transcript ?? "").trim();
        if (!t) continue;
        if (res.isFinal) finalChunk += (finalChunk ? " " : "") + t;
      }

      const cleaned = finalChunk.trim();
      if (!cleaned) return;
      if (cleaned === lastFinalRef.current) return;
      lastFinalRef.current = cleaned;

      const target = activeTargetRef.current;
      if (!target) return;

      setDraft((prev) => {
        const base = prev.trim();
        return base ? `${base} ${cleaned}` : cleaned;
      });
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    return rec;
  }

  function stopListening() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setIsListening(false);
  }

  function toggleMic(target: VoiceTarget) {
    textareaRef.current?.focus();
    lastFinalRef.current = "";
    activeTargetRef.current = target;

    if (isListening) {
      stopListening();
      return;
    }

    const rec = getOrCreateRecognition();
    if (!rec) return;

    try {
      setIsListening(true);
      rec.start();
    } catch {
      setIsListening(false);
    }
  }

  function goLanding() {
    clearRetortTimer();
    router.push("/");
  }

  function exitOnboarding() {
    clearRetortTimer();
    if (from === "consent") {
      router.push("/consent");
      return;
    }
    router.push("/");
  }

  function canGoBack() {
    return stepIndex > 0 && screenMode !== "completion";
  }

  function goBack() {
    if (screenMode === "retort") {
      clearRetortTimer();
      setRetortText(null);
      setRetortFromStep(null);
      setScreenMode("question");
      retortTokenRef.current = null;
      advanceLockRef.current = false;
      return;
    }

    clearRetortTimer();
    setScreenMode("question");
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNextStep() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function makeToken(fromStep: StepId) {
    return `${fromStep}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
  }

  async function showRetortThenAdvance(fromStep: StepId, overrides?: RetortOverrides) {
    if (fromStep === "welcome") {
      setScreenMode("question");
      goNextStep();
      return;
    }

    clearRetortTimer();

    const effectiveName = overrides?.name ?? name;
    const effectiveSituation = overrides?.situation ?? situation;
    const effectiveCertainty = overrides?.certainty ?? certainty;
    const effectivePostPlans = overrides?.postPlans ?? postPlans;
    const effectiveActivities = overrides?.activities ?? activities;
    const effectiveActivitiesOther = overrides?.activitiesOther ?? activitiesOther;
    const effectiveFunChoice = overrides?.funChoice ?? funChoice;
    const effectiveFunLatencyMs = overrides?.funLatencyMs ?? null;

    const zip5 = typeof overrides?.zip5 === "string" ? overrides.zip5 : normalizeZip(zip);

    let zipPlaceLabel: string | null =
      "zipPlaceLabel" in (overrides ?? {}) ? (overrides?.zipPlaceLabel ?? null) : null;

    if (fromStep === "zip" && zip5 && !zipPlaceLabel) {
      const o = ZIP_OVERRIDES[zip5];
      if (o) zipPlaceLabel = `${o.city}, ${stateFullName(o.state)}`;
    }

    const token = makeToken(fromStep);
    retortTokenRef.current = token;

    const t0 = buildRetort({
      fromStep,
      name: effectiveName,
      situation: effectiveSituation,
      certainty: effectiveCertainty,
      postPlans: effectivePostPlans,
      activities: effectiveActivities,
      activitiesOther: effectiveActivitiesOther,
      funChoice: effectiveFunChoice,
      zip5,
      zipPlaceLabel,
      funLatencyMs: effectiveFunLatencyMs,
    });

    setRetortFromStep(fromStep);
    setRetortText(t0);
    setScreenMode("retort");

    if (fromStep === "zip" && zip5 && !zipPlaceLabel && retortTokenRef.current === token) {
      try {
        const place = await lookupZipPlace(zip5);
        const resolved = place ? `${place.city}, ${stateFullName(place.state)}` : null;

        if (resolved && retortTokenRef.current === token && screenMode !== "completion") {
          const t1 = buildRetort({
            fromStep,
            name: effectiveName,
            situation: effectiveSituation,
            certainty: effectiveCertainty,
            postPlans: effectivePostPlans,
            activities: effectiveActivities,
            activitiesOther: effectiveActivitiesOther,
            funChoice: effectiveFunChoice,
            zip5,
            zipPlaceLabel: resolved,
            funLatencyMs: effectiveFunLatencyMs,
          });

          if (retortTokenRef.current === token && retortFromStep === "zip") {
            setRetortText(t1);
          }
        }
      } catch {}
    }

    const waitMs = getRetortMs(fromStep);

    retortTimerRef.current = window.setTimeout(() => {
      clearRetortTimer();
      setRetortText(null);
      setRetortFromStep(null);
      setScreenMode("question");
      retortTokenRef.current = null;
      goNextStep();
      advanceLockRef.current = false;
    }, waitMs);
  }

  function showFunRetortThenCompletion(choice: FunChoice) {
    clearRetortTimer();

    const start = funShownAtRef.current;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const latency = typeof start === "number" ? Math.max(0, Math.round(now - start)) : null;

    const t = buildRetort({
      fromStep: "fun",
      name,
      situation,
      certainty,
      postPlans,
      activities,
      activitiesOther,
      funChoice: choice,
      zip5: normalizeZip(zip),
      zipPlaceLabel: null,
      funLatencyMs: latency,
    });

    const token = makeToken("fun");
    retortTokenRef.current = token;

    setRetortFromStep("fun");
    setRetortText(t);
    setScreenMode("retort");

    retortTimerRef.current = window.setTimeout(() => {
      clearRetortTimer();
      setRetortText(null);
      setRetortFromStep(null);
      retortTokenRef.current = null;

      setScreenMode("completion");
      advanceLockRef.current = false;
    }, getRetortMs("fun"));
  }

  function skipRetort() {
    if (screenMode !== "retort") return;
    if (!lockAdvance()) return;

    if (retortFromStep === "fun") {
      clearRetortTimer();
      setRetortText(null);
      setRetortFromStep(null);
      retortTokenRef.current = null;
      setScreenMode("completion");
      unlockAdvanceSoon();
      return;
    }

    clearRetortTimer();
    setRetortText(null);
    setRetortFromStep(null);
    retortTokenRef.current = null;
    setScreenMode("question");
    goNextStep();

    unlockAdvanceSoon();
  }

  function onWelcomeNext() {
    if (!lockAdvance()) return;
    void showRetortThenAdvance("welcome");
    unlockAdvanceSoon();
  }

  function submitName() {
    if (!lockAdvance()) return;
    const text = draft.trim();
    if (!text) {
      advanceLockRef.current = false;
      return;
    }
    setName(text);
    setDraft("");
    void showRetortThenAdvance("name", { name: text });
    unlockAdvanceSoon();
  }

  function chooseSituation(v: Situation) {
    if (!lockAdvance()) return;
    setSituation(v);
    void showRetortThenAdvance("situation", { situation: v });
    unlockAdvanceSoon();
  }

  function submitZip() {
    if (!lockAdvance()) return;

    const normalized = normalizeZip(draft);
    setZip(normalized);
    setDraft("");

    void showRetortThenAdvance("zip", { zip5: normalized });
    unlockAdvanceSoon();
  }

  function skipZip() {
    if (!lockAdvance()) return;
    setZip("");
    setDraft("");
    void showRetortThenAdvance("zip", { zip5: "" });
    unlockAdvanceSoon();
  }

  function chooseCertainty(v: Certainty) {
    if (!lockAdvance()) return;
    setCertainty(v);
    void showRetortThenAdvance("certainty", { certainty: v });
    unlockAdvanceSoon();
  }

  function togglePostPlan(key: PostPlanKey) {
    setPostPlans((prev) => {
      if (key === "no_idea") return prev.includes("no_idea") ? [] : ["no_idea"];
      const cleaned = prev.filter((k) => k !== "no_idea");
      return toggleInList(cleaned as PostPlanKey[], key);
    });
  }

  function continuePostPlans() {
    if (!lockAdvance()) return;
    const snapshot = [...postPlans];
    if (snapshot.length <= 0) {
      advanceLockRef.current = false;
      return;
    }
    void showRetortThenAdvance("postPlans", { postPlans: snapshot });
    unlockAdvanceSoon();
  }

  function toggleActivity(key: ActivityKey) {
    setActivities((prev) => toggleInList(prev, key));
    if (key === "other" && activities.includes("other")) {
      setActivitiesOther("");
      setDraft("");
    }
  }

  function continueActivities(optionalOther?: string) {
    if (!lockAdvance()) return;

    const snapshot = [...activities];
    if (snapshot.length <= 0) {
      advanceLockRef.current = false;
      return;
    }

    if (snapshot.includes("other")) {
      const text = (typeof optionalOther === "string" ? optionalOther : draft).trim();
      setActivitiesOther(text);
      setDraft("");

      void showRetortThenAdvance("activities", {
        activities: snapshot,
        activitiesOther: text,
      });
      unlockAdvanceSoon();
      return;
    }

    void showRetortThenAdvance("activities", { activities: snapshot });
    unlockAdvanceSoon();
  }

  function chooseFun(choice: FunChoice) {
    if (!lockAdvance()) return;
    setFunChoice(choice);
    showFunRetortThenCompletion(choice);
    unlockAdvanceSoon();
  }

  function completionDone() {
    setScreenMode("question");
    setStepIndex(STEPS.indexOf("summary"));
  }

  const meta = stepId !== "summary" ? STEP_META[stepId] : null;
  const tone = visualToneForStep(stepId);

  function Kicker() {
    if (!meta?.kicker) return null;
    return (
      <div className="text-xs font-semibold tracking-[0.18em] text-white/42 uppercase">
        {meta.kicker}
      </div>
    );
  }

  function TitleBlock({ title, micro, lead }: { title: string; micro?: string; lead?: string }) {
    return (
      <div className="max-w-3xl">
        {lead ? (
          <p className="text-sm font-medium tracking-[0.08em] text-white/44">{lead}</p>
        ) : null}
        <h1 className="mt-4 text-[2rem] font-semibold leading-[1.14] tracking-tight text-white sm:text-[2.7rem]">
          {title}
        </h1>
        {micro ? (
          <p className="mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-7 text-white/60">
            {micro}
          </p>
        ) : null}
      </div>
    );
  }

  function renderRetort() {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={skipRetort}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") skipRetort();
        }}
        className="cursor-pointer select-none"
        aria-label="Tap to continue"
        title="Tap to continue"
      >
        <div className="flex min-h-[62svh] items-center">
          <div className="w-full max-w-3xl">
            <div className={`rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm sm:px-8 sm:py-10 ${tone.glow}`}>
              <div className="text-sm font-medium tracking-[0.12em] uppercase text-white/42">
                Got it
              </div>
              <div className="mt-4 max-w-2xl text-xl leading-9 text-white/88 sm:text-[1.7rem] sm:leading-[1.6]">
                {retortText}
              </div>
              <div className="mt-8 text-sm font-medium text-white/36">Tap anywhere to continue</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderWelcome() {
    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full max-w-3xl">
          <div className={`rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm sm:px-8 sm:py-10 ${tone.glow}`}>
            <Kicker />
            <TitleBlock
              title={STEP_META.welcome.title}
              micro={STEP_META.welcome.micro}
              lead={STEP_META.welcome.lead}
            />
            <div className="mt-9">
              <button
                type="button"
                onClick={onWelcomeNext}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/84 transition hover:text-white"
                aria-label="Start"
                title="Start"
              >
                <span>Start</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderName() {
    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.name.title} lead={STEP_META.name.lead} />
          <ThinkingSurface
            value={draft}
            onChange={setDraft}
            onSubmit={submitName}
            canSubmit={Boolean(draft.trim())}
            textareaRef={textareaRef}
            showMic
            isListening={isListening}
            speechSupported={speechSupported}
            onToggleMic={() => toggleMic("name")}
            placeholder="Write the name you want me to use."
          />
        </div>
      </div>
    );
  }

  function renderSituation() {
    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.situation.title} lead={STEP_META.situation.lead} />
          <div className="mt-8 max-w-2xl space-y-2">
            <ChoiceRowText
              label="I’m in high school"
              selected={situation === "high_school"}
              onClick={() => chooseSituation("high_school")}
            />
            <ChoiceRowText
              label="I’m a young adult (18–24)"
              selected={situation === "young_adult"}
              onClick={() => chooseSituation("young_adult")}
            />
            <EndOfAnswersLine />
          </div>
        </div>
      </div>
    );
  }

  function renderZip() {
    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock
            title={STEP_META.zip.title}
            micro={STEP_META.zip.micro}
            lead={STEP_META.zip.lead}
          />

          <ThinkingSurface
            value={draft}
            onChange={setDraft}
            onSubmit={submitZip}
            canSubmit={true}
            placeholder="Zip code (optional)"
            textareaRef={textareaRef}
            showMic
            isListening={isListening}
            speechSupported={speechSupported}
            onToggleMic={() => toggleMic("zip")}
            inputMode="numeric"
          />

          <div className="mt-5">
            <button
              type="button"
              onClick={skipZip}
              className="text-sm font-medium text-white/46 transition hover:text-white/74"
              aria-label="Skip zip"
              title="Skip"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderCertainty() {
    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock
            title={STEP_META.certainty.title}
            micro={STEP_META.certainty.micro}
            lead={STEP_META.certainty.lead}
          />
          <div className="mt-8 max-w-2xl space-y-2">
            <ChoiceRowText
              label="I feel pretty sure"
              selected={certainty === "strong"}
              onClick={() => chooseCertainty("strong")}
            />
            <ChoiceRowText
              label="I have some ideas"
              selected={certainty === "kinda"}
              onClick={() => chooseCertainty("kinda")}
            />
            <ChoiceRowText
              label="I honestly don’t know yet"
              selected={certainty === "no_clue"}
              onClick={() => chooseCertainty("no_clue")}
            />
            <EndOfAnswersLine />
          </div>
        </div>
      </div>
    );
  }

  function renderPostPlans() {
    const hasSelection = postPlans.length > 0;

    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock
            title={STEP_META.postPlans.title}
            micro={STEP_META.postPlans.micro}
            lead={STEP_META.postPlans.lead}
          />

          <div className="mt-8 max-w-3xl space-y-2">
            <ChoiceRowText label="Get a job" selected={postPlans.includes("job")} onClick={() => togglePostPlan("job")} />
            <ChoiceRowText
              label="Four-year college"
              selected={postPlans.includes("four_year")}
              onClick={() => togglePostPlan("four_year")}
            />
            <ChoiceRowText
              label="Community / two-year college"
              selected={postPlans.includes("associates")}
              onClick={() => togglePostPlan("associates")}
            />
            <ChoiceRowText
              label="Trade / credential program"
              selected={postPlans.includes("credential")}
              onClick={() => togglePostPlan("credential")}
            />
            <ChoiceRowText
              label="Military"
              selected={postPlans.includes("military")}
              onClick={() => togglePostPlan("military")}
            />
            <ChoiceRowText
              label="Not sure yet"
              selected={postPlans.includes("no_idea")}
              onClick={() => togglePostPlan("no_idea")}
            />

            <EndOfAnswersLine />
            <MinimalContinue onClick={continuePostPlans} disabled={!hasSelection} />
          </div>
        </div>
      </div>
    );
  }

  function renderActivities() {
    const hasSelection = activities.length > 0;
    const wantsOther = activities.includes("other");

    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock
            title={STEP_META.activities.title}
            micro={STEP_META.activities.micro}
            lead={STEP_META.activities.lead}
          />

          <div className="mt-8 max-w-3xl space-y-2">
            <ChoiceRowText
              label="Sports / training"
              selected={activities.includes("sports")}
              onClick={() => toggleActivity("sports")}
            />
            <ChoiceRowText
              label="Art / design"
              selected={activities.includes("visual_arts")}
              onClick={() => toggleActivity("visual_arts")}
            />
            <ChoiceRowText
              label="Music / dance / theater"
              selected={activities.includes("performing_arts")}
              onClick={() => toggleActivity("performing_arts")}
            />
            <ChoiceRowText
              label="Volunteering / helping out"
              selected={activities.includes("volunteer")}
              onClick={() => toggleActivity("volunteer")}
            />
            <ChoiceRowText
              label="Working a job"
              selected={activities.includes("job")}
              onClick={() => toggleActivity("job")}
            />
            <ChoiceRowText
              label="Other"
              selected={activities.includes("other")}
              onClick={() => toggleActivity("other")}
            />

            <EndOfAnswersLine />

            {wantsOther ? (
              <div className="mt-6">
                <div className="text-sm font-medium text-white/50">What’s “other”?</div>
                <ThinkingSurface
                  value={draft}
                  onChange={setDraft}
                  onSubmit={() => continueActivities(draft)}
                  canSubmit={true}
                  textareaRef={textareaRef}
                  showMic
                  isListening={isListening}
                  speechSupported={speechSupported}
                  onToggleMic={() => toggleMic("activitiesOther")}
                  placeholder="Add whatever fits here."
                />
              </div>
            ) : null}

            <MinimalContinue onClick={() => continueActivities()} disabled={!hasSelection} />
          </div>
        </div>
      </div>
    );
  }

  const FUN_OPTIONS: { key: Exclude<FunChoice, null>; src: string; alt: string }[] = [
    { key: "dog", src: "/onboarding/dog.jpg", alt: "Dog" },
    { key: "cat", src: "/onboarding/cat.jpg", alt: "Cat" },
    { key: "bearded_dragon", src: "/onboarding/bearded-dragon.jpg", alt: "Bearded dragon" },
    { key: "rock", src: "/onboarding/rock.jpg", alt: "Rock" },
  ];

  function renderFun() {
    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.fun.title} lead={STEP_META.fun.lead} />

          <div className="mt-8 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
            {FUN_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => chooseFun(o.key)}
                className="group relative overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.04] transition hover:border-white/24 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] active:scale-[0.99]"
                aria-label={o.alt}
                title={o.alt}
              >
                <div className="relative h-[210px] w-full sm:h-[280px]">
                  <Image
                    src={o.src}
                    alt={o.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 320px"
                    className="object-cover transition duration-300 group-hover:scale-[1.025]"
                    priority={o.key === "dog"}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/42 via-black/8 to-transparent"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/8 to-transparent" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-left">
                    <div className="text-sm font-medium text-white/88">{o.alt}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderSummary() {
    const zip5 = normalizeZip(zip);
    const insight = buildInsight({
      situation,
      certainty,
      postPlans,
      activities,
      activitiesOther,
      funChoice,
      zip5,
    });

    const n = firstName(name);

    return (
      <div className="flex min-h-[62svh] items-center">
        <div className="w-full max-w-3xl">
          <div className={`rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm sm:px-8 sm:py-10 ${tone.glow}`}>
            <div className="text-xs font-semibold tracking-[0.18em] text-white/42 uppercase">
              Everleap
            </div>

            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.14] tracking-tight text-white sm:text-[2.7rem]">
              {n ? `Here’s your starting point, ${n}.` : "Here’s a strong starting point."}
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-white/75">{insight}</p>

            <div className="mt-9">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/86 transition hover:text-white"
                aria-label="Join Everleap"
                title="Join Everleap"
              >
                <span>Join Everleap</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const screenKey =
    screenMode === "retort"
      ? `retort_${retortFromStep ?? stepId}`
      : screenMode === "completion"
      ? "completion"
      : stepId;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="onboarding_orb"
      ambientCap={0.22}
    >
      <div className={`relative min-h-[100svh] ${theme.pageBgBaseClass}`} style={pageBgStyle}>
        {gradientLevel > 0 && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: gradient.ambientOpacity * 0.4 }}>
            <div className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientTopLeftClass}`} />
            <div
              className={`absolute top-72 right-[-220px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
              style={{ opacity: 0.32 }}
            />
            <div className={`absolute left-1/2 top-[-6rem] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full blur-3xl ${tone.orbA}`} />
            <div className={`absolute bottom-[-5rem] right-[10%] h-[15rem] w-[15rem] rounded-full blur-3xl ${tone.orbB}`} />
            <div className="absolute inset-x-0 top-[22%] h-40 bg-gradient-to-b from-white/[0.02] via-white/[0.015] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        )}

        <main className="relative z-10">
          <div className="mx-auto w-full max-w-[980px] px-5 pb-24 pt-8 sm:px-6 sm:pt-10">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <MinimalTopLeftBrand onClick={goLanding} />
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-center gap-3 pt-1">
                <ProgressDashes current={stepIndex} total={STEPS.length} />
              </div>

              <div className="flex min-w-[84px] justify-end pt-1 sm:min-w-[120px]">
                {canGoBack() ? (
                  <MinimalBack onClick={goBack} />
                ) : (
                  <button
                    type="button"
                    onClick={exitOnboarding}
                    className="text-sm font-medium text-white/50 transition hover:text-white/80"
                    aria-label="Exit onboarding"
                    title="Exit"
                  >
                    Exit
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10 sm:mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={screenKey}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {screenMode === "retort" ? (
                    renderRetort()
                  ) : screenMode === "completion" ? (
                    <CompletionTransition onDone={completionDone} />
                  ) : stepId === "welcome" ? (
                    renderWelcome()
                  ) : stepId === "name" ? (
                    renderName()
                  ) : stepId === "situation" ? (
                    renderSituation()
                  ) : stepId === "zip" ? (
                    renderZip()
                  ) : stepId === "certainty" ? (
                    renderCertainty()
                  ) : stepId === "postPlans" ? (
                    renderPostPlans()
                  ) : stepId === "activities" ? (
                    renderActivities()
                  ) : stepId === "fun" ? (
                    renderFun()
                  ) : (
                    renderSummary()
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <OnboardingFooterNav />
      </div>
    </AppChrome>
  );
}