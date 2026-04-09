"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, MicOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { AppChrome } from "@/components/site/AppChrome";

import {
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
   Typography system
   ============================================================ */

const TYPE = {
  kicker:
    "text-[10px] font-medium uppercase tracking-[0.18em] text-white/40",
  navSecondary:
    "text-[11px] font-medium uppercase tracking-[0.16em]",
  navPrimary:
    "text-[14px] font-semibold tracking-[0.01em]",
  headline:
    "text-[1.42rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.68rem]",
  welcomeHeadline:
    "text-[1.78rem] font-semibold leading-[1.03] tracking-tight text-white sm:text-[2.02rem]",
  retortHeadline:
    "text-[1.44rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.72rem]",
  body:
    "text-[14px] leading-[1.6] text-white/82",
  choice:
    "text-[13px] leading-[1.35rem]",
  whisper:
    "text-[12px] leading-[1.2rem] text-white/54",
  input:
    "text-[14px] font-medium leading-6 text-white",
};

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
  questionEnter: { opacity: 0, y: 20, scale: 0.992, filter: "blur(8px)" },
  questionCenter: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  questionExit: { opacity: 0, y: -14, scale: 0.994, filter: "blur(8px)" },
  retortEnter: { opacity: 0, scale: 0.97, y: 20, filter: "blur(10px)" },
  retortCenter: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  retortExit: { opacity: 0, scale: 0.992, y: -14, filter: "blur(8px)" },
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

function NavLink({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        TYPE.navSecondary,
        disabled
          ? "cursor-not-allowed text-white/20"
          : "text-white/48 hover:text-white/72",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ActionLink({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        TYPE.navPrimary,
        "inline-flex items-center gap-2 transition",
        disabled
          ? "cursor-not-allowed text-white/26"
          : "text-white/86 hover:text-white active:translate-x-[1px]",
      ].join(" ")}
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-[16px]">
        →
      </span>
    </button>
  );
}

function TalkLink({
  isListening,
  speechSupported,
  onClick,
}: {
  isListening: boolean;
  speechSupported: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!speechSupported}
      className={[
        "inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.01em] transition",
        speechSupported
          ? "text-white/62 hover:text-white/86"
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
      <span>Talk</span>
    </button>
  );
}

function ProgressDots({
  currentStep,
  certainty,
}: {
  currentStep: StepId;
  certainty: Certainty;
}) {
  const steps: StepId[] = [
    "name",
    "situation",
    "zip",
    "certainty",
    ...(certainty === "no_clue" ? [] : ["certaintyIdea" as StepId]),
    "postPlans",
    "activities",
    "fun",
  ];

  const activeIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isDone = activeIndex > -1 && index < activeIndex;

        return (
          <span
            key={step}
            className={[
              "block rounded-full transition-all duration-300",
              isActive
                ? "h-2.5 w-2.5 bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]"
                : isDone
                  ? "h-2 w-2 bg-cyan-300/85"
                  : "h-2 w-2 bg-white/20",
            ].join(" ")}
          />
        );
      })}
    </div>
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
      whileTap={{ scale: 0.988 }}
      onClick={onClick}
      animate={{
        x: selected ? 6 : 0,
        scale: selected ? 1.012 : 1,
        opacity: dimmed ? 0.42 : 1,
        y: selected ? -1 : 0,
      }}
      className="group relative block w-full overflow-hidden rounded-[18px] px-4 py-2.5 text-left"
    >
      <motion.div
        className={[
          "pointer-events-none absolute inset-0 rounded-[18px] border transition",
          selected
            ? "border-white/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.08))] shadow-[0_14px_36px_rgba(6,9,20,0.28)]"
            : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] group-hover:border-white/16 group-hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))]",
        ].join(" ")}
        animate={{ scale: selected ? 1.008 : 1 }}
        transition={cardSpring}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/10 to-transparent" />
      <div
        className={[
          TYPE.choice,
          "relative pr-8 transition",
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
        scale: selected ? 1.018 : 1,
        y: selected ? -4 : 0,
        opacity: dimmed ? 0.4 : 1,
      }}
      className={[
        "group relative block w-full overflow-hidden rounded-[22px] border px-4 py-3 text-left",
        selected
          ? "border-white/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.07))] shadow-[0_18px_44px_rgba(9,12,24,0.30)]"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] hover:border-white/16 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))]",
      ].join(" ")}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClass}`} />
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/8 blur-2xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/18 via-white/12 to-transparent" />
      <motion.div className="relative" animate={{ x: selected ? 2 : 0 }} transition={cardSpring}>
        <div className="text-[0.98rem] font-semibold leading-5 text-white">{title}</div>
        <div className="mt-1.5 text-[12.75px] leading-5 text-white/66">{sub}</div>
      </motion.div>
    </motion.button>
  );
}

function QuestionTextEntry({
  value,
  onChange,
  onSubmit,
  canSubmit,
  placeholder,
  textareaRef,
  inputMode,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  placeholder?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  inputMode?: React.HTMLAttributes<HTMLTextAreaElement>["inputMode"];
  rows?: number;
}) {
  return (
    <div className="w-full">
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
        rows={rows}
        placeholder={placeholder ?? ""}
        className={[
          TYPE.input,
          "w-full resize-none rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))] px-4 py-2.5 outline-none placeholder:text-white/34 shadow-[0_10px_30px_rgba(4,8,18,0.22)]",
        ].join(" ")}
      />
      {!canSubmit && inputMode === "numeric" ? (
        <div className="mt-2 text-[12px] text-white/34">Enter a 5-digit zip code.</div>
      ) : null}
    </div>
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
    <div className="w-full">
      <QuestionTextEntry
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        canSubmit={canSubmit}
        placeholder={placeholder}
        textareaRef={textareaRef}
        inputMode={inputMode}
        rows={inputMode === "numeric" ? 1 : 3}
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        {showMic && onToggleMic ? (
          <TalkLink
            isListening={Boolean(isListening)}
            speechSupported={Boolean(speechSupported)}
            onClick={onToggleMic}
          />
        ) : (
          <div />
        )}

        <ActionLink label="Continue" onClick={onSubmit} disabled={!canSubmit} />
      </div>
    </div>
  );
}

function QuestionShell({
  title,
  whisper,
  children,
  tone,
  currentStep,
  certainty,
  showExit,
  showBack,
  onExit,
  onBack,
  bottomLeft,
  bottomRight,
}: {
  title: string;
  whisper?: string | null;
  children: React.ReactNode;
  tone: ReturnType<typeof visualToneForStep>;
  currentStep: StepId;
  certainty: Certainty;
  showExit?: boolean;
  showBack?: boolean;
  onExit?: () => void;
  onBack?: () => void;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
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

      <div className="relative rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(15,19,33,0.78),rgba(8,11,21,0.84))] shadow-[0_26px_90px_rgba(0,0,0,0.40)] backdrop-blur-[18px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/16" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-[62%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,191,130,0.14),transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full bg-white/4 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-violet-400/8 blur-3xl" />

        <div className="relative px-4 pt-2.5 sm:px-5 sm:pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showExit && onExit ? <NavLink label="Exit" onClick={onExit} /> : null}
              {showBack && onBack ? <NavLink label="Back" onClick={onBack} /> : null}
            </div>

            <ProgressDots currentStep={currentStep} certainty={certainty} />
          </div>

          <div className="pt-2.5">
            <h1 className={TYPE.headline}>{title}</h1>

            <div className="mt-1 min-h-[14px]">
              <div
                className={[
                  TYPE.whisper,
                  "transition-all duration-300",
                  whisper ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                ].join(" ")}
              >
                {whisper ?? " "}
              </div>
            </div>

            <div className="mt-2">{children}</div>

            {(bottomLeft || bottomRight) ? (
              <div className="mt-3 flex items-center justify-between gap-4 pb-3.5">
                <div>{bottomLeft ?? null}</div>
                <div className="flex items-center gap-4">{bottomRight ?? null}</div>
              </div>
            ) : (
              <div className="pb-3.5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Retorts
   ============================================================ */

function activityLabel(k: ActivityKey): string {
  switch (k) {
    case "sports":
      return "sports";
    case "visual_arts":
      return "art or design";
    case "performing_arts":
      return "music, dance, or theater";
    case "volunteer":
      return "volunteering";
    case "job":
      return "working";
    case "other":
      return "something else";
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
  const hasIdea = Boolean(idea);
  const hasActivities = activities.length > 0 || isMeaningfulText(activitiesOther);
  const hasOtherDetail = activities.includes("other") && isMeaningfulText(activitiesOther);

  if (fromStep === "name") {
    return n ? `${n}. Nice to meet you — let’s see what fits.` : "Nice to meet you — let’s see what fits.";
  }

  if (fromStep === "situation") {
    if (situation === "high_school") {
      return "Got it. We can keep this open and still make it useful.";
    }
    if (situation === "young_adult") {
      return "Got it. We can be a little more direct from here.";
    }
    return "Got it. That helps.";
  }

  if (fromStep === "zip") {
    if (!zip5) {
      return hasIdea ? "That’s okay. We’ve already got enough to start." : "That’s okay. We can still keep going.";
    }
    if (zipPlaceLabel) {
      return `${zipPlaceLabel}. Nice — I’ll keep nearby options in the mix.`;
    }
    return `${zip5}. Nice — I’ll keep nearby options in the mix.`;
  }

  if (fromStep === "certainty") {
    if (certainty === "strong") {
      return hasIdea ? "Good. That gives us something real to work with." : "Good. That gives us a place to start.";
    }
    if (certainty === "kinda") {
      return "That’s enough. We can work with that.";
    }
    if (certainty === "no_clue") {
      return "Honestly, that’s fine too.";
    }
    return "Got it.";
  }

  if (fromStep === "certaintyIdea") {
    if (!idea) {
      return hasActivities ? "That still helps. I’ve got a better feel for you now." : "That still helps. One real clue is enough.";
    }

    if (certainty === "strong") {
      return `${idea}. Nice — that feels like a real starting point.`;
    }

    return `${idea}. Good — that gives us something to build on.`;
  }

  if (fromStep === "postPlans") {
    if (postPlans.includes("no_idea")) {
      return hasActivities ? "That’s okay. You’ve already given me enough to start narrowing this down." : "That’s okay. We can narrow it down from here.";
    }

    if (postPlans.length >= 3) {
      return "Good. You’re keeping a few real paths open.";
    }

    if (postPlans.length === 2) {
      return "Good. That already gives us a couple of real directions.";
    }

    return "Good. That’s a real option.";
  }

  if (fromStep === "activities") {
    const labels = activities.filter((key) => key !== "other").map(activityLabel);
    const listText = joinNatural(labels);

    if (hasOtherDetail) {
      return listText
        ? `${listText}. Nice — that helps me get a better feel for you.`
        : "Nice — that helps me get a better feel for you.";
    }

    if (listText) {
      if (hasIdea) {
        return `${listText}. Nice — that gives me more context.`;
      }
      return `${listText}. Nice — that tells me something real.`;
    }

    return "Nice — that tells me something real.";
  }

  if (fromStep === "fun") {
    const quick = typeof funLatencyMs === "number" && funLatencyMs >= 0 && funLatencyMs < 900;
    const slow = typeof funLatencyMs === "number" && funLatencyMs >= 1800;
    const tempoTag = quick ? "Fast answer. " : slow ? "You thought about that. " : "";

    if (funChoice === "dog") {
      return `${tempoTag}Dog. Solid choice.`;
    }
    if (funChoice === "cat") {
      return `${tempoTag}Cat. Fair.`;
    }
    if (funChoice === "bearded_dragon") {
      return `${tempoTag}Bearded dragon. Strong choice, honestly.`;
    }
    if (funChoice === "rock") {
      return `${tempoTag}Rock. Respect.`;
    }
    return "Interesting choice.";
  }

  return "Good. We’ve got enough to keep going.";
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
      parts.push("You’re in high school and you already have a real sense of direction.");
    } else if (certainty === "kinda") {
      parts.push("You’re in high school with early ideas — enough to start shaping something real.");
    } else if (certainty === "no_clue") {
      parts.push("You’re in high school and still figuring it out, which is more normal than people admit.");
    } else {
      parts.push("You’re in high school and thinking seriously about what comes next.");
    }
  } else if (situation === "young_adult") {
    if (certainty === "strong") {
      parts.push("You’re a young adult with clear direction, which means we can move faster.");
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
      parts.push(`You already have a concrete path in mind: ${idea}. That gives us something to sharpen instead of inventing from scratch.`);
    } else if (certainty === "kinda") {
      parts.push(`One early idea already stands out: ${idea}. That’s enough to start building around.`);
    }
  }

  if (postPlans.length > 0) {
    if (postPlans.includes("no_idea")) {
      parts.push("You’re keeping the field open for now, which means the job is to surface strong options fast.");
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
        parts.push(`You’re considering ${listText}. That gives us enough range to compare paths without getting scattered.`);
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
      parts.push(`Outside of school, you naturally spend time on ${listText}. That’s one of the strongest signals for what will actually feel right.`);
    }

    if (isMeaningfulText(activitiesOther)) {
      parts.push("The extra detail you added makes the fit even clearer.");
    }
  }

  if (zip5) {
    parts.push("I’ll keep local opportunities in play too.");
  }

  if (funChoice === "dog") parts.push("Also: dog energy.");
  if (funChoice === "cat") parts.push("Also: cat energy.");
  if (funChoice === "bearded_dragon") parts.push("Also: bearded dragon energy.");
  if (funChoice === "rock") parts.push("Also: rock. Iconic.");

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

  function onSummaryNext() {
    router.push("/main");
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

  function renderRetort() {
    return (
      <div className="relative mx-auto w-full max-w-[520px]">
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

        <motion.button
          type="button"
          onClick={skipRetort}
          whileTap={{ scale: 0.992 }}
          className="relative block w-full cursor-pointer rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(15,19,33,0.80),rgba(8,11,21,0.88))] px-5 py-5 text-left shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-[18px]"
          aria-label="Tap or click anywhere to continue"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/16" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-[60%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,191,130,0.16),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute -left-10 top-8 h-24 w-24 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="relative">
            <div className={TYPE.retortHeadline}>{retortText}</div>
            <div className="mt-5 flex justify-end">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/48">
                Tap or click anywhere to continue
              </div>
            </div>
          </div>
        </motion.button>
      </div>
    );
  }

  function renderWelcome() {
    return (
      <div className="relative mx-auto w-full max-w-[520px]">
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

        <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(26,30,48,0.84),rgba(10,14,26,0.92))] px-5 py-5 shadow-[0_26px_90px_rgba(0,0,0,0.44)] backdrop-blur-xl">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.stageA}`} />
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${tone.stageB}`} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/18 via-white/12 to-transparent" />

          <div className="relative flex items-center justify-between">
            <NavLink label="Exit" onClick={exitOnboarding} />
          </div>

          <div className="relative pt-5">
            <div className={TYPE.kicker}>{STEP_META.welcome.kicker}</div>
            <h1 className={`mt-4 ${TYPE.welcomeHeadline}`}>{STEP_META.welcome.title}</h1>
            <p className={`mt-3.5 max-w-[27rem] ${TYPE.body}`}>
              A few quick questions. Enough to get a real feel for you and start showing paths that actually fit.
            </p>

            <div className="mt-6 flex justify-end">
              <ActionLink label="Let’s go" onClick={onWelcomeNext} />
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
        tone={tone}
        currentStep="name"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
        bottomLeft={
          <TalkLink
            isListening={isListening}
            speechSupported={speechSupported}
            onClick={() => toggleMic("name")}
          />
        }
        bottomRight={<ActionLink label="Continue" onClick={submitName} disabled={!draft.trim()} />}
      >
        <QuestionTextEntry
          value={draft}
          onChange={setDraft}
          onSubmit={submitName}
          canSubmit={Boolean(draft.trim())}
          textareaRef={textareaRef}
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
        tone={tone}
        currentStep="situation"
        certainty={certainty}
        showExit
        showBack
        onExit={exitOnboarding}
        onBack={goBack}
      >
        <div className="w-full space-y-2">
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
        tone={tone}
        currentStep="zip"
        certainty={certainty}
        showExit
        showBack
        onExit={exitOnboarding}
        onBack={goBack}
        bottomLeft={
          <TalkLink
            isListening={isListening}
            speechSupported={speechSupported}
            onClick={() => toggleMic("zip")}
          />
        }
        bottomRight={
          <>
            <NavLink label="Skip" onClick={skipZip} />
            <ActionLink label="Continue" onClick={submitZip} disabled={!canSubmit} />
          </>
        }
      >
        <QuestionTextEntry
          value={draft}
          onChange={(v) => setDraft(v.replace(/[^\d]/g, "").slice(0, 5))}
          onSubmit={submitZip}
          canSubmit={canSubmit}
          textareaRef={textareaRef}
          placeholder="5-digit zip code"
          inputMode="numeric"
          rows={1}
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
        tone={tone}
        currentStep="certainty"
        certainty={certainty}
        showExit
        showBack
        onExit={exitOnboarding}
        onBack={goBack}
      >
        <div className="grid w-full gap-2">
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
        tone={tone}
        currentStep="certaintyIdea"
        certainty={certainty}
        showExit
        showBack
        onExit={exitOnboarding}
        onBack={goBack}
        bottomLeft={
          <TalkLink
            isListening={isListening}
            speechSupported={speechSupported}
            onClick={() => toggleMic("certaintyIdea")}
          />
        }
        bottomRight={<ActionLink label="Continue" onClick={submitCertaintyIdea} disabled={!draft.trim()} />}
      >
        <QuestionTextEntry
          value={draft}
          onChange={setDraft}
          onSubmit={submitCertaintyIdea}
          canSubmit={Boolean(draft.trim())}
          textareaRef={textareaRef}
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
        tone={tone}
        currentStep="postPlans"
        certainty={certainty}
        showExit
        showBack
        onExit={exitOnboarding}
        onBack={goBack}
        bottomRight={<ActionLink label="Continue" onClick={continuePostPlans} disabled={postPlans.length === 0} />}
      >
        <div className="grid w-full gap-2">
          <ChoiceRowText
            label="Get a job"
            selected={postPlans.includes("job")}
            dimmed={hasSelection && !postPlans.includes("job")}
            onClick={() => togglePostPlan("job")}
          />
          <ChoiceRowText
            label="Community college"
            selected={postPlans.includes("associates")}
            dimmed={hasSelection && !postPlans.includes("associates")}
            onClick={() => togglePostPlan("associates")}
          />
          <ChoiceRowText
            label="Trade or credential program"
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
            label="I have no idea yet"
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

    return (
      <QuestionShell
        title={STEP_META.activities.title}
        whisper={whisper}
        tone={tone}
        currentStep="activities"
        certainty={certainty}
        showExit
        showBack
        onExit={exitOnboarding}
        onBack={goBack}
        bottomLeft={
          showOtherInput ? (
            <TalkLink
              isListening={isListening}
              speechSupported={speechSupported}
              onClick={() => toggleMic("activitiesOther")}
            />
          ) : null
        }
        bottomRight={
          <ActionLink
            label="Continue"
            onClick={() => continueActivities()}
            disabled={activities.length === 0 || (showOtherInput && !draft.trim())}
          />
        }
      >
        <div className="grid w-full gap-2">
          <ChoiceRowText
            label="Sports"
            selected={activities.includes("sports")}
            dimmed={hasSelection && !activities.includes("sports")}
            onClick={() => toggleActivity("sports")}
          />
          <ChoiceRowText
            label="Visual art or design"
            selected={activities.includes("visual_arts")}
            dimmed={hasSelection && !activities.includes("visual_arts")}
            onClick={() => toggleActivity("visual_arts")}
          />
          <ChoiceRowText
            label="Music, dance, or theater"
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
              <QuestionTextEntry
                value={draft}
                onChange={setDraft}
                onSubmit={() => continueActivities()}
                canSubmit={Boolean(draft.trim())}
                textareaRef={textareaRef}
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
        tone={tone}
        currentStep="fun"
        certainty={certainty}
        showExit
        showBack
        onExit={exitOnboarding}
        onBack={goBack}
      >
        <div className="grid max-w-[520px] grid-cols-2 gap-1 sm:gap-1.5">
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
                  "group relative overflow-hidden rounded-[22px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.05))] text-left",
                  selected ? "border-white/24 shadow-[0_0_40px_rgba(255,255,255,0.08)]" : "border-white/10 hover:border-white/16",
                ].join(" ")}
              >
                <div className="relative h-[132px] sm:h-[150px]">
                  <Image
                    src={option.src}
                    alt={option.alt}
                    fill
                    className={[
                      "object-cover transition duration-300",
                      selected ? "scale-[1.04]" : "scale-100 group-hover:scale-[1.02]",
                    ].join(" ")}
                    sizes="(max-width: 768px) 32vw, 150px"
                    priority={stepId === "fun"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/12 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-2">
                  <div className="text-[0.82rem] font-semibold text-white">{option.alt}</div>
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
      <div className="relative mx-auto w-full max-w-[520px]">
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

        <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(26,30,48,0.84),rgba(10,14,26,0.92))] px-5 py-5 shadow-[0_26px_90px_rgba(0,0,0,0.44)] backdrop-blur-xl">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.stageA}`} />
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${tone.stageB}`} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/18 via-white/12 to-transparent" />

          <div className="relative">
            <div className={TYPE.kicker}>Everleap</div>
            <div className={`mt-3 ${TYPE.retortHeadline}`}>{label}</div>
            <div className={`mt-4 ${TYPE.body}`}>{insight}</div>
            <div className="mt-6 flex justify-end">
              <ActionLink label="Let’s go" onClick={onSummaryNext} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderCurrentQuestion() {
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
        return renderWelcome();
    }
  }

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="questions_orb"
      ambientCap={0.22}
      flushContent
      hideHeader
    >
      <div className="relative h-full overflow-y-auto overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={pageBgStyle}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,166,92,0.16),transparent_30%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(217,70,239,0.16),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_68%,rgba(34,211,238,0.12),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,20,0.14)_0%,rgba(8,10,18,0.70)_56%,rgba(6,8,15,0.94)_100%)]" />
          <div className="absolute -left-12 top-[10%] h-40 w-40 rounded-full bg-amber-300/12 blur-3xl" />
          <div className="absolute right-[-2.5rem] top-[24%] h-44 w-44 rounded-full bg-fuchsia-400/10 blur-3xl" />
          <div className="absolute bottom-[-3rem] left-[18%] h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
        </div>

        <div className="relative z-10 px-2 sm:px-3">
          <div className="box-border flex min-h-[calc(100svh-5.75rem)] items-center justify-center supports-[height:100dvh]:min-h-[calc(100dvh-5.75rem)]">
            <div className="w-full max-w-[560px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={screenKey}
                  initial={
                    screenMode === "retort"
                      ? screenVariants.retortEnter
                      : screenVariants.questionEnter
                  }
                  animate={
                    screenMode === "retort"
                      ? screenVariants.retortCenter
                      : screenVariants.questionCenter
                  }
                  exit={
                    screenMode === "retort"
                      ? screenVariants.retortExit
                      : screenVariants.questionExit
                  }
                  transition={spring}
                  className="w-full"
                >
                  {screenMode === "retort"
                    ? renderRetort()
                    : renderCurrentQuestion()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}