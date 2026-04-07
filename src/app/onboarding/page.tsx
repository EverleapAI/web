"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, MicOff, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { AppChrome } from "@/components/site/AppChrome";

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
  | "certaintyIdea"
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
  "certaintyIdea",
  "postPlans",
  "activities",
  "fun",
  "summary",
];

type ScreenMode = "question" | "retort";

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

type VoiceTarget = "name" | "zip" | "activitiesOther" | "certaintyIdea";

const STORAGE_KEY = "everleapOnboarding_v4_convo_min";

/* ============================================================
   Copy
   ============================================================ */

const STEP_META: Record<
  Exclude<StepId, "summary" | "certaintyIdea">,
  { kicker: string; title: string }
> = {
  welcome: {
    kicker: "Everleap",
    title: "Let’s get to know you.",
  },
  name: {
    kicker: "Everleap · Getting to know you",
    title: "What should I call you?",
  },
  situation: {
    kicker: "Everleap · Your world",
    title: "Where are you right now — really?",
  },
  zip: {
    kicker: "Everleap · Local",
    title: "Want to add your zip code?",
  },
  certainty: {
    kicker: "Everleap · Future mode",
    title: "How clear does next feel right now?",
  },
  postPlans: {
    kicker: "Everleap · On your radar",
    title: "What’s actually on your radar after high school?",
  },
  activities: {
    kicker: "Everleap · Off the clock",
    title: "What do you naturally spend time on?",
  },
  fun: {
    kicker: "Everleap · One weirdly useful question",
    title: "Pick one.",
  },
};

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

function shortenIdea(raw: string) {
  return raw.trim().replace(/\s+/g, " ").replace(/[.?!]+$/g, "");
}

function certaintyIdeaPrompt(certainty: Certainty) {
  if (certainty === "strong") {
    return {
      kicker: "Everleap · Future mode",
      title: "Nice. What do you think comes next?",
      placeholder: "Say the path you already have in mind.",
    };
  }

  return {
    kicker: "Everleap · Future mode",
    title: "What’s one idea you already have?",
    placeholder: "Just one. We’ll build from there.",
  };
}

/* ============================================================
   Visual helpers
   ============================================================ */

function visualToneForStep(stepId: StepId) {
  if (stepId === "welcome") {
    return {
      orbA: "bg-fuchsia-400/30",
      orbB: "bg-cyan-300/22",
      glow: "shadow-[0_0_90px_rgba(217,70,239,0.12)]",
      meshA: "from-fuchsia-500/24 via-violet-500/10 to-transparent",
      meshB: "from-cyan-400/22 via-sky-400/8 to-transparent",
      ring: "border-fuchsia-200/16",
      stageA: "from-fuchsia-500/20 via-violet-500/10 to-transparent",
      stageB: "from-cyan-400/18 via-sky-500/8 to-transparent",
    };
  }

  if (stepId === "summary") {
    return {
      orbA: "bg-cyan-300/18",
      orbB: "bg-violet-400/18",
      glow: "shadow-[0_0_90px_rgba(103,232,249,0.12)]",
      meshA: "from-cyan-400/16 via-sky-400/8 to-transparent",
      meshB: "from-violet-400/16 via-fuchsia-400/8 to-transparent",
      ring: "border-cyan-200/16",
      stageA: "from-cyan-400/16 via-sky-500/8 to-transparent",
      stageB: "from-violet-400/16 via-fuchsia-400/8 to-transparent",
    };
  }

  if (stepId === "fun") {
    return {
      orbA: "bg-fuchsia-400/28",
      orbB: "bg-amber-300/24",
      glow: "shadow-[0_0_90px_rgba(236,72,153,0.14)]",
      meshA: "from-fuchsia-500/22 via-pink-400/10 to-transparent",
      meshB: "from-amber-300/24 via-orange-400/10 to-transparent",
      ring: "border-fuchsia-200/18",
      stageA: "from-fuchsia-500/22 via-pink-400/10 to-transparent",
      stageB: "from-amber-300/22 via-orange-400/10 to-transparent",
    };
  }

  if (stepId === "zip" || stepId === "postPlans" || stepId === "certaintyIdea") {
    return {
      orbA: "bg-amber-300/18",
      orbB: "bg-orange-400/16",
      glow: "shadow-[0_0_90px_rgba(251,191,36,0.12)]",
      meshA: "from-amber-300/16 via-orange-400/8 to-transparent",
      meshB: "from-orange-500/14 via-rose-500/8 to-transparent",
      ring: "border-amber-200/16",
      stageA: "from-amber-300/18 via-orange-400/8 to-transparent",
      stageB: "from-orange-500/14 via-rose-400/8 to-transparent",
    };
  }

  if (stepId === "certainty") {
    return {
      orbA: "bg-violet-400/24",
      orbB: "bg-cyan-300/20",
      glow: "shadow-[0_0_90px_rgba(139,92,246,0.14)]",
      meshA: "from-violet-400/22 via-indigo-500/10 to-transparent",
      meshB: "from-cyan-300/18 via-sky-500/10 to-transparent",
      ring: "border-violet-200/18",
      stageA: "from-violet-400/22 via-indigo-500/10 to-transparent",
      stageB: "from-cyan-300/18 via-sky-500/10 to-transparent",
    };
  }

  return {
    orbA: "bg-cyan-300/18",
    orbB: "bg-violet-400/16",
    glow: "shadow-[0_0_90px_rgba(56,189,248,0.12)]",
    meshA: "from-sky-400/18 via-cyan-400/8 to-transparent",
    meshB: "from-violet-400/16 via-indigo-500/8 to-transparent",
    ring: "border-cyan-200/14",
    stageA: "from-sky-400/18 via-cyan-400/8 to-transparent",
    stageB: "from-violet-400/14 via-indigo-500/8 to-transparent",
  };
}

const screenVariants = {
  questionEnter: { opacity: 0, y: 28, scale: 0.985, filter: "blur(10px)" },
  questionCenter: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  questionExit: { opacity: 0, y: -18, scale: 0.992, filter: "blur(8px)" },
  retortEnter: { opacity: 0, scale: 0.94, y: 30, filter: "blur(14px)" },
  retortCenter: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  retortExit: { opacity: 0, scale: 0.985, y: -20, filter: "blur(10px)" },
};

const spring = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.9,
} as const;

const cardSpring = {
  type: "spring",
  stiffness: 360,
  damping: 28,
} as const;

/* ============================================================
   UI atoms
   ============================================================ */

function InlineMetaAction({
  label,
  onClick,
  tone = "default",
  disabled,
}: {
  label: string;
  onClick: () => void;
  tone?: "default" | "cool";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] transition",
        disabled
          ? "cursor-not-allowed text-white/24"
          : tone === "cool"
            ? "text-cyan-200/72 hover:text-cyan-100"
            : "text-white/34 hover:text-white/56",
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      <span>{label}</span>
    </button>
  );
}

function ChoiceRowText({
  label,
  selected,
  dimmed,
  onClick,
}: {
  label: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      transition={cardSpring}
      whileTap={{ scale: 0.986 }}
      onClick={onClick}
      animate={{
        x: selected ? 10 : 0,
        scale: selected ? 1.02 : 1,
        opacity: dimmed ? 0.42 : 1,
        y: selected ? -1 : 0,
      }}
      className="group relative block w-full overflow-hidden rounded-[20px] px-4 py-3.5 text-left"
    >
      <motion.div
        className={[
          "pointer-events-none absolute inset-0 rounded-[20px] border transition",
          selected
            ? "border-white/24 bg-white/[0.13] shadow-[0_0_36px_rgba(255,255,255,0.08)]"
            : "border-white/8 bg-white/[0.035] group-hover:border-white/14 group-hover:bg-white/[0.06]",
        ].join(" ")}
        animate={{
          scale: selected ? 1.015 : 1,
        }}
        transition={cardSpring}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[5px] rounded-l-[20px] bg-gradient-to-b from-fuchsia-300/0 via-fuchsia-300/0 to-fuchsia-300/0 group-hover:from-fuchsia-300/40 group-hover:via-cyan-300/30 group-hover:to-violet-300/20" />
      {selected ? (
        <div className="pointer-events-none absolute inset-y-2 left-2 w-1 rounded-full bg-gradient-to-b from-fuchsia-300 via-cyan-300 to-violet-300" />
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/10 to-transparent" />
      <div
        className={[
          "relative pr-8 text-[14px] leading-6 transition",
          selected ? "font-semibold text-white" : "font-medium text-white/78 group-hover:text-white/92",
        ].join(" ")}
      >
        {label}
      </div>
      <motion.div
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
        animate={{ x: selected ? 2 : 0, opacity: selected ? 1 : 0.35 }}
        transition={cardSpring}
      >
        →
      </motion.div>
    </motion.button>
  );
}

function BigMoodCard({
  title,
  sub,
  selected,
  dimmed,
  accent,
  onClick,
}: {
  title: string;
  sub: string;
  selected?: boolean;
  dimmed?: boolean;
  accent: "violet" | "sky" | "soft";
  onClick: () => void;
}) {
  const accentClass =
    accent === "violet"
      ? "from-fuchsia-400/26 via-violet-400/14 to-transparent"
      : accent === "sky"
        ? "from-cyan-300/24 via-sky-400/14 to-transparent"
        : "from-white/16 via-white/8 to-transparent";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      transition={cardSpring}
      whileTap={{ scale: 0.99 }}
      animate={{
        scale: selected ? 1.03 : 1,
        y: selected ? -6 : 0,
        opacity: dimmed ? 0.4 : 1,
      }}
      className={[
        "group relative block w-full overflow-hidden rounded-[24px] border px-5 py-4 text-left",
        selected
          ? "border-white/24 bg-white/[0.11] shadow-[0_0_60px_rgba(255,255,255,0.07)]"
          : "border-white/10 bg-white/[0.045] hover:border-white/16 hover:bg-white/[0.07]",
      ].join(" ")}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClass}`} />
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/8 blur-2xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/18 via-white/12 to-transparent" />
      <motion.div
        className="relative"
        animate={{ x: selected ? 2 : 0 }}
        transition={cardSpring}
      >
        <div className="text-[1.03rem] font-semibold leading-6 text-white">{title}</div>
        <div className="mt-1.5 text-[13px] leading-5 text-white/66">{sub}</div>
      </motion.div>
    </motion.button>
  );
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
    <div className="w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-[22px] border border-white/12 bg-white/[0.055] p-3.5 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_48%)]" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-fuchsia-400/10 blur-2xl" />

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
            rows={1}
            placeholder={placeholder ?? ""}
            className="min-h-[46px] w-full resize-none bg-transparent px-1 py-1 text-[14px] leading-6 text-white/92 outline-none placeholder:text-white/30"
          />

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/8 pt-2.5">
            {showMic ? (
              <button
                type="button"
                onClick={onToggleMic}
                disabled={!speechSupported}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[13px] transition",
                  speechSupported
                    ? isListening
                      ? "bg-white/[0.08] text-white"
                      : "text-white/62 hover:bg-white/[0.05] hover:text-white/88"
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
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
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
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition",
                canSubmit
                  ? "border-white/18 bg-white/[0.1] text-white/90 hover:border-white/28 hover:bg-white/[0.14] hover:text-white"
                  : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/28",
              ].join(" ")}
              aria-label="Continue"
              title="Continue"
            >
              <span>Continue</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionShell({
  title,
  whisper,
  children,
  topAction,
  bottomAction,
  compact,
  tone,
}: {
  title: string;
  whisper?: string | null;
  children: React.ReactNode;
  topAction?: React.ReactNode;
  bottomAction?: React.ReactNode;
  compact?: boolean;
  tone: ReturnType<typeof visualToneForStep>;
}) {
  return (
    <div className="flex h-full items-start">
      <div className="relative mx-auto mt-1 w-full max-w-3xl sm:mt-2">
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`pointer-events-none absolute -left-8 top-[-1.25rem] h-24 w-24 rounded-full blur-3xl ${tone.orbA}`}
        />
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, -12, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={`pointer-events-none absolute right-[7%] top-[3rem] h-24 w-24 rounded-full blur-3xl ${tone.orbB}`}
        />

        <div className={`relative overflow-hidden rounded-[30px] border ${tone.ring} bg-white/[0.055] px-5 py-5 backdrop-blur-md sm:px-6 sm:py-5`}>
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.stageA}`} />
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${tone.stageB}`} />
          <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_54%)]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/8 blur-2xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/10 to-transparent" />

          <div className="relative">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div />
              {topAction ? <div>{topAction}</div> : null}
            </div>

            <h1
              className={[
                "font-semibold leading-[1.02] tracking-tight text-white",
compact
  ? "text-[1.9rem] sm:text-[2.08rem]"
  : "text-[1.95rem] sm:text-[2.2rem]"
              ].join(" ")}
            >
              {title}
            </h1>

            <div className="mt-2 min-h-[20px]">
              <div
                className={[
                  "text-[13px] leading-5 text-white/58 transition-all duration-300",
                  whisper ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                ].join(" ")}
              >
                {whisper ?? " "}
              </div>
            </div>

            <div className="mt-3">{children}</div>

            {bottomAction ? <div className="mt-4">{bottomAction}</div> : null}
          </div>
        </div>
      </div>
    </div>
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
  certaintyIdea: string;
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
    certaintyIdea,
    postPlans,
    activities,
    activitiesOther,
    funChoice,
    zip5,
    zipPlaceLabel,
    funLatencyMs,
  } = args;

  const n = firstName(name);
  const idea = shortenIdea(certaintyIdea);

  if (fromStep === "name") {
    return n ? `Okay, ${n}.` : "Okay.";
  }

  if (fromStep === "situation") {
    if (situation === "high_school") {
      return "Good. That gives us room to explore without drifting.";
    }
    if (situation === "young_adult") {
      return "Nice. We can move with a little more speed now.";
    }
    return "Good. That helps me set the right pace.";
  }

  if (fromStep === "zip") {
    if (!zip5) {
      return "Totally fine. We can still build a strong starting point.";
    }
    if (zipPlaceLabel) {
      return `${zipPlaceLabel}. Nice. Local recommendations just got smarter.`;
    }
    return `${zip5}. Nice. Local recommendations just got smarter.`;
  }

  if (fromStep === "certainty") {
    if (certainty === "strong") {
      return "Good. Start with the thing you already see.";
    }
    if (certainty === "kinda") {
      return "Perfect. One idea is enough to get traction.";
    }
    if (certainty === "no_clue") {
      return "Honestly? That’s cleaner than fake certainty.";
    }
    return "Got it.";
  }

  if (fromStep === "certaintyIdea") {
    if (!idea) return "Good. That gives me something real to work with.";

    if (certainty === "strong") {
      return `Okay. ${idea}. Now we’re getting somewhere.`;
    }

    return `${idea}. Nice. That’s a real clue, not random noise.`;
  }

  if (fromStep === "postPlans") {
    if (postPlans.includes("no_idea")) {
      return "Open field. That’s still a real starting point.";
    }

    const labels = postPlans.map(postPlanLabel);
    const listText = joinNatural(labels);

    if (postPlans.length >= 3) {
      return `${listText}. Good. Enough range to compare without getting lost.`;
    }

    return `${listText}. Good. That’s enough direction to build from.`;
  }

  if (fromStep === "activities") {
    const labels = activities.map(activityLabel);
    const listText = joinNatural(labels);

    if (activities.includes("other") && isMeaningfulText(activitiesOther)) {
      return `${listText}. Good. That extra detail helps a lot.`;
    }

    return `${listText}. Noted. That tells me more than people think.`;
  }

  if (fromStep === "fun") {
    const quick = typeof funLatencyMs === "number" && funLatencyMs >= 0 && funLatencyMs < 900;
    const slow = typeof funLatencyMs === "number" && funLatencyMs >= 1800;
    const tempoTag = quick ? "Fast pick. " : slow ? "Considered pick. " : "";

    if (funChoice === "dog") {
      return `${tempoTag}Dog energy. Warm, loyal, easy to read — until you’re not.`;
    }
    if (funChoice === "cat") {
      return `${tempoTag}Cat energy. Independent, selective, and not here for nonsense.`;
    }
    if (funChoice === "bearded_dragon") {
      return `${tempoTag}Bearded dragon. Calm confidence. Weirdly excellent taste.`;
    }
    if (funChoice === "rock") {
      return `${tempoTag}Rock. Unbothered. Respect.`;
    }
    return "Interesting pick.";
  }

  return "Perfect. That gives me enough to keep going.";
}

/* ============================================================
   Summary
   ============================================================ */

function buildInsight(options: {
  situation: Situation;
  certainty: Certainty;
  certaintyIdea: string;
  postPlans: PostPlanKey[];
  activities: ActivityKey[];
  activitiesOther: string;
  funChoice: FunChoice;
  zip5: string;
}) {
  const {
    situation,
    certainty,
    certaintyIdea,
    postPlans,
    activities,
    activitiesOther,
    funChoice,
    zip5,
  } = options;

  const parts: string[] = [];
  const idea = shortenIdea(certaintyIdea);

  if (situation === "high_school") {
    if (certainty === "strong") {
      parts.push("You’re in high school and already have real direction.");
    } else if (certainty === "kinda") {
      parts.push("You’re in high school with early ideas — enough to start shaping something real.");
    } else if (certainty === "no_clue") {
      parts.push("You’re in high school and still figuring it out, which is more normal than people admit.");
    } else {
      parts.push("You’re in high school and taking a real look at what comes next.");
    }
  } else if (situation === "young_adult") {
    if (certainty === "strong") {
      parts.push("You’re a young adult with clear direction, so we can move faster.");
    } else if (certainty === "kinda") {
      parts.push("You’re a young adult with some real ideas already in motion.");
    } else if (certainty === "no_clue") {
      parts.push("You’re a young adult and not fully sure yet, which still gives us something honest to work with.");
    } else {
      parts.push("You’re a young adult taking a real look at what fits.");
    }
  } else {
    parts.push("You’re taking a real look at what comes next.");
  }

  if (idea) {
    if (certainty === "strong") {
      parts.push(`One path already stands out: ${idea}. That gives us something to sharpen.`);
    } else if (certainty === "kinda") {
      parts.push(`One early idea already stands out: ${idea}. That’s enough to build around.`);
    }
  }

  if (postPlans.length > 0) {
    if (postPlans.includes("no_idea")) {
      parts.push("You’re keeping the field open, so the job is to surface strong options fast.");
    } else {
      const mapped: string[] = [];
      if (postPlans.includes("job")) mapped.push("work");
      if (postPlans.includes("four_year")) mapped.push("a four-year college path");
      if (postPlans.includes("associates")) mapped.push("community or two-year options");
      if (postPlans.includes("credential")) mapped.push("trade or credential programs");
      if (postPlans.includes("military")) mapped.push("the military");

      if (mapped.length > 0) {
        const last = mapped.pop();
        const listText = mapped.length ? `${mapped.join(", ")}, and ${last}` : last!;
        parts.push(`You’re weighing ${listText}. That’s a strong range without getting scattered.`);
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
      parts.push(`Outside of school, you naturally spend time on ${listText}. Those are strong signals for what may actually fit.`);
    }

    if (isMeaningfulText(activitiesOther)) {
      parts.push("That extra detail helps too.");
    }
  }

  if (zip5) {
    parts.push("I’ll keep local opportunities in play too.");
  }

  if (funChoice === "dog") parts.push("Also: dog energy.");
  if (funChoice === "cat") parts.push("Also: cat energy.");
  if (funChoice === "bearded_dragon") parts.push("Also: bearded dragon energy.");
  if (funChoice === "rock") parts.push("Also: rock energy.");

  parts.push("This is a starting point, not a box — enough to generate strong first options, then sharpen fast.");

  return parts.join(" ");
}

/* ============================================================
   Page
   ============================================================ */

type RetortOverrides = Partial<{
  name: string;
  situation: Situation;
  certainty: Certainty;
  certaintyIdea: string;
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

const FUN_OPTIONS: { key: Exclude<FunChoice, null>; src: string; alt: string }[] = [
  { key: "dog", src: "/onboarding/dog.jpg", alt: "Dog" },
  { key: "cat", src: "/onboarding/cat.jpg", alt: "Cat" },
  { key: "bearded_dragon", src: "/onboarding/bearded-dragon.jpg", alt: "Bearded dragon" },
  { key: "rock", src: "/onboarding/rock.jpg", alt: "Rock" },
];

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

  const advanceLockRef = React.useRef(false);
  const retortTokenRef = React.useRef<string | null>(null);

  const [name, setName] = React.useState("");
  const [situation, setSituation] = React.useState<Situation>(null);
  const [zip, setZip] = React.useState("");
  const [certainty, setCertainty] = React.useState<Certainty>(null);
  const [certaintyIdea, setCertaintyIdea] = React.useState("");
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
  const [whisper, setWhisper] = React.useState<string | null>(null);

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
      setCertaintyIdea("");
      setPostPlans([]);
      setActivities([]);
      setActivitiesOther("");
      setFunChoice(null);
      setDraft("");
      setWhisper(null);

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

    textareaRef.current?.focus();
  }, [shouldReset]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<{
        stepIndex: number;
        name: string;
        situation: Situation;
        zip: string;
        certainty: Certainty;
        certaintyIdea: string;
        postPlans: PostPlanKey[];
        activities: ActivityKey[];
        activitiesOther: string;
        funChoice: FunChoice;
      }>;

      if (!shouldReset) {
        if (typeof saved.stepIndex === "number") setStepIndex(saved.stepIndex);
        if (typeof saved.name === "string") setName(saved.name);
        if (saved.situation === "high_school" || saved.situation === "young_adult" || saved.situation === null) {
          setSituation(saved.situation);
        }
        if (typeof saved.zip === "string") setZip(saved.zip);
        if (saved.certainty === "strong" || saved.certainty === "kinda" || saved.certainty === "no_clue" || saved.certainty === null) {
          setCertainty(saved.certainty);
        }
        if (typeof saved.certaintyIdea === "string") setCertaintyIdea(saved.certaintyIdea);
        if (Array.isArray(saved.postPlans)) setPostPlans(saved.postPlans);
        if (Array.isArray(saved.activities)) setActivities(saved.activities);
        if (typeof saved.activitiesOther === "string") setActivitiesOther(saved.activitiesOther);
        if (
          saved.funChoice === "dog" ||
          saved.funChoice === "cat" ||
          saved.funChoice === "bearded_dragon" ||
          saved.funChoice === "rock" ||
          saved.funChoice === null
        ) {
          setFunChoice(saved.funChoice);
        }
      }
    } catch {}
  }, [shouldReset]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRec = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  React.useEffect(() => {
    return () => {
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
          certaintyIdea,
          postPlans,
          activities,
          activitiesOther,
          funChoice,
        })
      );
    } catch {}
  }, [
    stepIndex,
    name,
    situation,
    zip,
    certainty,
    certaintyIdea,
    postPlans,
    activities,
    activitiesOther,
    funChoice,
  ]);

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
    setWhisper(null);

    if (stepId === "fun" && screenMode === "question") {
      funShownAtRef.current = typeof performance !== "undefined" ? performance.now() : Date.now();
    } else {
      funShownAtRef.current = null;
    }
  }, [stepId, screenMode]);

  function showWhisper(message: string) {
    setWhisper(message);
    window.clearTimeout((showWhisper as unknown as { _t?: number })._t);
    (showWhisper as unknown as { _t?: number })._t = window.setTimeout(() => {
      setWhisper(null);
    }, 1000);
  }

  function lockAdvance(): boolean {
    if (advanceLockRef.current) return false;
    advanceLockRef.current = true;
    return true;
  }

  function unlockAdvance() {
    advanceLockRef.current = false;
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

  function exitOnboarding() {
    if (from === "consent") {
      router.push("/consent");
      return;
    }
    router.push("/");
  }

  function canGoBack() {
    return stepIndex > 0;
  }

  function goBack() {
    if (screenMode === "retort") {
      setRetortText(null);
      setRetortFromStep(null);
      setScreenMode("question");
      retortTokenRef.current = null;
      advanceLockRef.current = false;
      return;
    }

    setScreenMode("question");
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNextStep() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function jumpToStep(target: StepId) {
    setStepIndex(STEPS.indexOf(target));
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

    const effectiveName = overrides?.name ?? name;
    const effectiveSituation = overrides?.situation ?? situation;
    const effectiveCertainty = overrides?.certainty ?? certainty;
    const effectiveCertaintyIdea = overrides?.certaintyIdea ?? certaintyIdea;
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
      certaintyIdea: effectiveCertaintyIdea,
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

        if (resolved && retortTokenRef.current === token) {
          const t1 = buildRetort({
            fromStep,
            name: effectiveName,
            situation: effectiveSituation,
            certainty: effectiveCertainty,
            certaintyIdea: effectiveCertaintyIdea,
            postPlans: effectivePostPlans,
            activities: effectiveActivities,
            activitiesOther: effectiveActivitiesOther,
            funChoice: effectiveFunChoice,
            zip5,
            zipPlaceLabel: resolved,
            funLatencyMs: effectiveFunLatencyMs,
          });

          if (retortTokenRef.current === token) {
            setRetortText(t1);
          }
        }
      } catch {}
    }
  }

  function showFunRetort(choice: FunChoice) {
    const start = funShownAtRef.current;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const latency = typeof start === "number" ? Math.max(0, Math.round(now - start)) : null;

    const t = buildRetort({
      fromStep: "fun",
      name,
      situation,
      certainty,
      certaintyIdea,
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
  }

  function skipRetort() {
    if (screenMode !== "retort") return;
    if (!lockAdvance()) return;

    const fromStep = retortFromStep;

    setRetortText(null);
    setRetortFromStep(null);
    retortTokenRef.current = null;
    setScreenMode("question");

    if (fromStep === "certainty") {
      if (certainty === "strong" || certainty === "kinda") {
        jumpToStep("certaintyIdea");
        unlockAdvance();
        return;
      }

      jumpToStep("postPlans");
      unlockAdvance();
      return;
    }

    if (fromStep === "fun") {
      setStepIndex(STEPS.indexOf("summary"));
      unlockAdvance();
      return;
    }

    goNextStep();
    unlockAdvance();
  }

  function onWelcomeNext() {
    if (!lockAdvance()) return;
    void showRetortThenAdvance("welcome");
    unlockAdvance();
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
    showWhisper("Good. Start simple.");
    void showRetortThenAdvance("name", { name: text });
    unlockAdvance();
  }

  function chooseSituation(v: Situation) {
    if (!lockAdvance()) return;
    setSituation(v);
    showWhisper(v === "high_school" ? "Good. We’ll keep it wide at first." : "Nice. We can move faster.");
    void showRetortThenAdvance("situation", { situation: v });
    unlockAdvance();
  }

  function submitZip() {
    if (!lockAdvance()) return;

    const normalized = normalizeZip(draft);
    setZip(normalized);
    setDraft("");
    showWhisper("Nice. Local gets smarter.");
    void showRetortThenAdvance("zip", { zip5: normalized });
    unlockAdvance();
  }

  function skipZip() {
    if (!lockAdvance()) return;
    setZip("");
    setDraft("");
    showWhisper("No problem. Still enough to work with.");
    void showRetortThenAdvance("zip", { zip5: "" });
    unlockAdvance();
  }

  function chooseCertainty(v: Certainty) {
    if (!lockAdvance()) return;
    setCertainty(v);
    if (v === "no_clue") {
      setCertaintyIdea("");
    }

    if (v === "strong") {
      showWhisper("Good. Let’s use that.");
    } else if (v === "kinda") {
      showWhisper("That’s enough to build from.");
    } else {
      showWhisper("Honestly? Valid.");
    }

    void showRetortThenAdvance("certainty", {
      certainty: v,
      certaintyIdea: v === "no_clue" ? "" : certaintyIdea,
    });
    unlockAdvance();
  }

  function submitCertaintyIdea() {
    if (!lockAdvance()) return;
    const text = draft.trim();
    if (!text) {
      advanceLockRef.current = false;
      return;
    }

    setCertaintyIdea(text);
    setDraft("");
    showWhisper(certainty === "strong" ? "Okay. Now we’re getting somewhere." : "Nice. That’s real.");
    void showRetortThenAdvance("certaintyIdea", { certaintyIdea: text });
    unlockAdvance();
  }

  function togglePostPlan(key: PostPlanKey) {
    setPostPlans((prev) => {
      if (key === "no_idea") return prev.includes("no_idea") ? [] : ["no_idea"];
      const cleaned = prev.filter((k) => k !== "no_idea");
      return toggleInList(cleaned as PostPlanKey[], key);
    });

    if (key === "job") showWhisper("Direct. Useful.");
    if (key === "four_year") showWhisper("Classic path. Still flexible.");
    if (key === "associates") showWhisper("Practical and underrated.");
    if (key === "credential") showWhisper("Hands-on counts.");
    if (key === "military") showWhisper("Strong signal.");
    if (key === "no_idea") showWhisper("Open field. Still real.");
  }

  function continuePostPlans() {
    if (!lockAdvance()) return;
    const snapshot = [...postPlans];
    if (snapshot.length <= 0) {
      advanceLockRef.current = false;
      return;
    }
    void showRetortThenAdvance("postPlans", { postPlans: snapshot });
    unlockAdvance();
  }

  function toggleActivity(key: ActivityKey) {
    setActivities((prev) => toggleInList(prev, key));

    if (key === "sports") showWhisper("Noted. You probably hate wasted motion.");
    if (key === "visual_arts") showWhisper("Taste is a signal.");
    if (key === "performing_arts") showWhisper("Performance says a lot.");
    if (key === "volunteer") showWhisper("That matters.");
    if (key === "job") showWhisper("Responsibility counts.");
    if (key === "other") showWhisper("Good. Add the part that doesn’t fit the menu.");

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
      unlockAdvance();
      return;
    }

    void showRetortThenAdvance("activities", { activities: snapshot });
    unlockAdvance();
  }

  function chooseFun(choice: FunChoice) {
    if (!lockAdvance()) return;
    setFunChoice(choice);
    showFunRetort(choice);
    unlockAdvance();
  }

  const tone = visualToneForStep(stepId);
  const screenKey = screenMode === "retort" ? `retort_${retortFromStep ?? stepId}` : stepId;

  const questionTopAction =
    stepId !== "welcome" && screenMode === "question" && canGoBack() ? (
      <InlineMetaAction label="← Back" onClick={goBack} tone="cool" />
    ) : null;

  function renderRetort() {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={skipRetort}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") skipRetort();
        }}
        className="flex h-full cursor-pointer items-start pt-8 select-none sm:pt-10"
        aria-label="Tap to continue"
        title="Tap to continue"
      >
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.05] px-5 py-8 backdrop-blur-md">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.meshA}`} />
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${tone.meshB}`} />
            <div className={`pointer-events-none absolute inset-0 ${tone.glow}`} />
            <motion.div
              aria-hidden="true"
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className={`pointer-events-none absolute -left-8 top-[-1rem] h-24 w-24 rounded-full blur-3xl ${tone.orbA}`}
            />
            <motion.div
              aria-hidden="true"
              animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className={`pointer-events-none absolute right-[8%] top-[4rem] h-24 w-24 rounded-full blur-3xl ${tone.orbB}`}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.11),transparent_56%)]" />
            <div className="relative">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/44">
                Everleap
              </div>
              <div className="mt-4 max-w-[34ch] text-[1.55rem] font-semibold leading-[1.08] tracking-tight text-white sm:max-w-[36ch] sm:text-[1.95rem]">
                {retortText}
              </div>
              <div className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/34">
                Tap anywhere to continue
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderWelcome() {
    return (
      <div className="flex h-full items-start">
        <div className="relative mx-auto mt-1 w-full max-w-3xl sm:mt-2">
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`pointer-events-none absolute -left-8 top-[-1.25rem] h-28 w-28 rounded-full blur-3xl ${tone.orbA}`}
          />
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, -12, 0], y: [0, 12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className={`pointer-events-none absolute right-[8%] top-[3.25rem] h-24 w-24 rounded-full blur-3xl ${tone.orbB}`}
          />

          <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.05] px-5 py-6 backdrop-blur-md sm:px-6 sm:py-6">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.meshA}`} />
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${tone.meshB}`} />
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.11),transparent_55%)]" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <div className="mb-3 flex items-center justify-end">
                <InlineMetaAction label="Exit" onClick={exitOnboarding} tone="cool" />
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/44">
                {STEP_META.welcome.kicker}
              </div>

              <h1 className="mt-3 max-w-[18ch] text-[2.18rem] font-semibold leading-[0.98] tracking-tight text-white sm:max-w-[20ch] sm:text-[2.55rem]">
                {STEP_META.welcome.title}
              </h1>

              <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/72">
                A few quick questions. Then the app stops guessing and starts actually seeing you.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ scale: 1.012 }}
                  onClick={onWelcomeNext}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/[0.09] px-5 py-2.5 text-sm font-medium text-white/94 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-sm transition hover:border-white/24 hover:bg-white/[0.13] hover:text-white"
                  aria-label="Let’s begin"
                  title="Let’s begin"
                >
                  <span>Let’s begin</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderName() {
    return (
      <QuestionShell
        title={STEP_META.name.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
      >
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
      </QuestionShell>
    );
  }

  function renderSituation() {
    const hasSelection = Boolean(situation);

    return (
      <QuestionShell
        title={STEP_META.situation.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
      >
        <div className="max-w-2xl space-y-2.5">
          <ChoiceRowText
            label="I’m in high school"
            selected={situation === "high_school"}
            dimmed={hasSelection && situation !== "high_school"}
            onClick={() => chooseSituation("high_school")}
          />
          <ChoiceRowText
            label="I’m a young adult figuring out what fits"
            selected={situation === "young_adult"}
            dimmed={hasSelection && situation !== "young_adult"}
            onClick={() => chooseSituation("young_adult")}
          />
        </div>
      </QuestionShell>
    );
  }

  function renderZip() {
    const normalized = normalizeZip(draft);
    const canSubmit = normalized.length === 5;

    return (
      <QuestionShell
        title={STEP_META.zip.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
        bottomAction={<InlineMetaAction label="Skip for now" onClick={skipZip} />}
      >
        <ThinkingSurface
          value={draft}
          onChange={(v) => setDraft(v.replace(/[^\d]/g, "").slice(0, 5))}
          onSubmit={submitZip}
          canSubmit={canSubmit}
          textareaRef={textareaRef}
          showMic
          isListening={isListening}
          speechSupported={speechSupported}
          onToggleMic={() => toggleMic("zip")}
          placeholder="5-digit zip code"
          inputMode="numeric"
        />
      </QuestionShell>
    );
  }

  function renderCertainty() {
    const hasSelection = Boolean(certainty);

    return (
      <QuestionShell
        title={STEP_META.certainty.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
      >
        <div className="grid max-w-2xl gap-3">
          <BigMoodCard
            title="I feel pretty sure"
            sub="There’s already something I can see."
            selected={certainty === "strong"}
            dimmed={hasSelection && certainty !== "strong"}
            accent="violet"
            onClick={() => chooseCertainty("strong")}
          />
          <BigMoodCard
            title="I have some ideas"
            sub="Not locked in. Not blank either."
            selected={certainty === "kinda"}
            dimmed={hasSelection && certainty !== "kinda"}
            accent="sky"
            onClick={() => chooseCertainty("kinda")}
          />
          <BigMoodCard
            title="I honestly don’t know yet"
            sub="No fake certainty. Just the truth."
            selected={certainty === "no_clue"}
            dimmed={hasSelection && certainty !== "no_clue"}
            accent="soft"
            onClick={() => chooseCertainty("no_clue")}
          />
        </div>
      </QuestionShell>
    );
  }

  function renderCertaintyIdea() {
    const meta = certaintyIdeaPrompt(certainty);

    return (
      <QuestionShell
        title={meta.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
      >
        <ThinkingSurface
          value={draft}
          onChange={setDraft}
          onSubmit={submitCertaintyIdea}
          canSubmit={Boolean(draft.trim())}
          textareaRef={textareaRef}
          showMic
          isListening={isListening}
          speechSupported={speechSupported}
          onToggleMic={() => toggleMic("certaintyIdea")}
          placeholder={meta.placeholder}
        />
      </QuestionShell>
    );
  }

  function renderPostPlans() {
    const hasSelection = postPlans.length > 0;

    return (
      <QuestionShell
        title={STEP_META.postPlans.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
        bottomAction={
          <InlineMetaAction
            label="Continue"
            onClick={continuePostPlans}
            disabled={postPlans.length === 0}
          />
        }
      >
        <div className="max-w-2xl space-y-2">
          <ChoiceRowText
            label="A job"
            selected={postPlans.includes("job")}
            dimmed={hasSelection && !postPlans.includes("job")}
            onClick={() => togglePostPlan("job")}
          />
          <ChoiceRowText
            label="Community / two-year college"
            selected={postPlans.includes("associates")}
            dimmed={hasSelection && !postPlans.includes("associates")}
            onClick={() => togglePostPlan("associates")}
          />
          <ChoiceRowText
            label="Trade / credential program"
            selected={postPlans.includes("credential")}
            dimmed={hasSelection && !postPlans.includes("credential")}
            onClick={() => togglePostPlan("credential")}
          />
          <ChoiceRowText
            label="Military"
            selected={postPlans.includes("military")}
            dimmed={hasSelection && !postPlans.includes("military")}
            onClick={() => togglePostPlan("military")}
          />
          <ChoiceRowText
            label="Four-year college"
            selected={postPlans.includes("four_year")}
            dimmed={hasSelection && !postPlans.includes("four_year")}
            onClick={() => togglePostPlan("four_year")}
          />
          <ChoiceRowText
            label="I’m not sure yet"
            selected={postPlans.includes("no_idea")}
            dimmed={hasSelection && !postPlans.includes("no_idea")}
            onClick={() => togglePostPlan("no_idea")}
          />
        </div>
      </QuestionShell>
    );
  }

  function renderActivities() {
    const hasSelection = activities.length > 0;
    const showOtherInput = activities.includes("other");
    const canContinue = hasSelection && (!showOtherInput || draft.trim().length > 0);

    return (
      <QuestionShell
        title={STEP_META.activities.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
        bottomAction={
          <InlineMetaAction
            label="Continue"
            onClick={() => continueActivities()}
            disabled={!canContinue}
          />
        }
      >
        <div className="max-w-2xl space-y-2">
          <ChoiceRowText
            label="Sports / training"
            selected={activities.includes("sports")}
            dimmed={hasSelection && !activities.includes("sports")}
            onClick={() => toggleActivity("sports")}
          />
          <ChoiceRowText
            label="Art / design"
            selected={activities.includes("visual_arts")}
            dimmed={hasSelection && !activities.includes("visual_arts")}
            onClick={() => toggleActivity("visual_arts")}
          />
          <ChoiceRowText
            label="Music / dance / theater"
            selected={activities.includes("performing_arts")}
            dimmed={hasSelection && !activities.includes("performing_arts")}
            onClick={() => toggleActivity("performing_arts")}
          />
          <ChoiceRowText
            label="Volunteering"
            selected={activities.includes("volunteer")}
            dimmed={hasSelection && !activities.includes("volunteer")}
            onClick={() => toggleActivity("volunteer")}
          />
          <ChoiceRowText
            label="Working a job"
            selected={activities.includes("job")}
            dimmed={hasSelection && !activities.includes("job")}
            onClick={() => toggleActivity("job")}
          />
          <ChoiceRowText
            label="Other"
            selected={activities.includes("other")}
            dimmed={hasSelection && !activities.includes("other")}
            onClick={() => toggleActivity("other")}
          />
        </div>

        <AnimatePresence initial={false}>
          {showOtherInput ? (
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={spring}
              className="mt-3"
            >
              <ThinkingSurface
                value={draft}
                onChange={setDraft}
                onSubmit={() => continueActivities()}
                canSubmit={Boolean(draft.trim())}
                textareaRef={textareaRef}
                showMic
                isListening={isListening}
                speechSupported={speechSupported}
                onToggleMic={() => toggleMic("activitiesOther")}
                placeholder="Add the thing that matters here."
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </QuestionShell>
    );
  }

  function renderFun() {
    return (
      <QuestionShell
        title={STEP_META.fun.title}
        whisper={whisper}
        compact
        tone={tone}
        topAction={questionTopAction}
      >
        <div className="grid max-w-[540px] grid-cols-2 gap-3">
          {FUN_OPTIONS.map((option) => {
            const selected = funChoice === option.key;
            const dimmed = Boolean(funChoice) && !selected;

            return (
              <motion.button
                key={option.key}
                type="button"
                onClick={() => chooseFun(option.key)}
                layout
                transition={cardSpring}
                whileTap={{ scale: 0.985 }}
                animate={{
                  scale: selected ? 1.03 : 1,
                  y: selected ? -5 : 0,
                  opacity: dimmed ? 0.44 : 1,
                }}
                className={[
                  "group relative overflow-hidden rounded-[22px] border bg-white/[0.05] text-left",
                  selected ? "border-white/24 shadow-[0_0_40px_rgba(255,255,255,0.08)]" : "border-white/10 hover:border-white/16",
                ].join(" ")}
              >
                <div className="relative aspect-[0.94] sm:aspect-[0.9]">
                  <Image
                    src={option.src}
                    alt={option.alt}
                    fill
                    className={[
                      "object-cover transition duration-300",
                      selected ? "scale-[1.04]" : "scale-100 group-hover:scale-[1.02]",
                    ].join(" ")}
                    sizes="(max-width: 768px) 42vw, 220px"
                    priority={stepId === "fun"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/12 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="text-[0.98rem] font-semibold text-white">{option.alt}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </QuestionShell>
    );
  }

  function renderSummary() {
    const zip5 = normalizeZip(zip);
    const insight = buildInsight({
      situation,
      certainty,
      certaintyIdea,
      postPlans,
      activities,
      activitiesOther,
      funChoice,
      zip5,
    });

    const n = firstName(name);
    const label = n ? `${n},` : "You,";

    return (
      <div className="flex h-full items-center">
        <div className="relative mx-auto w-full max-w-3xl">
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`pointer-events-none absolute -left-6 top-0 h-24 w-24 rounded-full blur-3xl ${tone.orbA}`}
          />
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, -12, 0], y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className={`pointer-events-none absolute right-[8%] top-[5rem] h-24 w-24 rounded-full blur-3xl ${tone.orbB}`}
          />

          <div className={`relative overflow-hidden rounded-[30px] border ${tone.ring} bg-white/[0.05] px-5 py-7 backdrop-blur-md sm:px-6 sm:py-8`}>
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.meshA}`} />
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${tone.meshB}`} />
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%)]" />

            <div className="relative">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                Everleap · First read
              </div>

              <h1 className="mt-3 text-[2rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.35rem]">
  {label} this gives us a real start.
</h1>

              <p className="mt-4 max-w-2xl text-[14px] leading-6 text-white/76">
                {insight}
              </p>

              <div className="mt-6">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => router.push("/main")}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/[0.09] px-5 py-2.5 text-sm font-medium text-white/92 transition hover:border-white/24 hover:bg-white/[0.13] hover:text-white"
                >
                  <span>Enter Everleap</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderScreen() {
    if (screenMode === "retort") {
      return renderRetort();
    }

    switch (stepId) {
      case "welcome":
        return renderWelcome();
      case "name":
        return renderName();
      case "situation":
        return renderSituation();
      case "zip":
        return renderZip();
      case "certainty":
        return renderCertainty();
      case "certaintyIdea":
        return renderCertaintyIdea();
      case "postPlans":
        return renderPostPlans();
      case "activities":
        return renderActivities();
      case "fun":
        return renderFun();
      case "summary":
        return renderSummary();
      default:
        return null;
    }
  }

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="onboarding_orb"
      ambientCap={0.22}
    >
      <div
        className={`relative h-[100svh] overflow-hidden ${theme.pageBgBaseClass}`}
        style={pageBgStyle}
      >
        {gradientLevel > 0 && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ opacity: gradient.ambientOpacity * 0.42 }}
          >
            <motion.div
              animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <motion.div
              animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-72 right-[-220px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
              style={{ opacity: 0.32 }}
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/22" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_42%)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col px-4 pb-4 pt-2 sm:px-6">
          <header className="flex h-4 shrink-0 items-center justify-end" />

          <main className="relative flex-1 overflow-hidden pt-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screenKey}
                initial={screenMode === "retort" ? screenVariants.retortEnter : screenVariants.questionEnter}
                animate={screenMode === "retort" ? screenVariants.retortCenter : screenVariants.questionCenter}
                exit={screenMode === "retort" ? screenVariants.retortExit : screenVariants.questionExit}
                transition={spring}
                className="h-full"
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AppChrome>
  );
}