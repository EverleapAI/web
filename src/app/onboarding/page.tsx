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

type SpeechRecognitionConstructor = {
  new (): SpeechRecognition;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

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

const TYPE = {
  navSecondary: "text-[11px] font-medium uppercase tracking-[0.16em]",
  headline:
    "text-[1.42rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.68rem]",
  welcomeHeadline:
    "text-[1.78rem] font-semibold leading-[1.03] tracking-tight text-white sm:text-[2.02rem]",
  retort: "text-[15px] leading-[1.6] text-white/94",
  summaryLead:
    "text-[1.02rem] font-semibold leading-[1.22] text-white sm:text-[1.12rem]",
  body: "text-[14px] leading-[1.6] text-white/82",
  choice: "text-[14px] leading-[1.35rem]",
  whisper: "text-[12px] leading-[1.2rem] text-white/54",
  input: "text-[14px] font-medium leading-6 text-white",
};

const STEP_META: Record<
  Exclude<StepId, "summary" | "certaintyIdea">,
  { title: string }
> = {
  welcome: { title: "Let’s get to know you." },
  name: { title: "What should I call you?" },
  situation: { title: "Where are you right now?" },
  zip: { title: "Want to add your zip code?" },
  certainty: { title: "How clear does next feel right now?" },
  postPlans: { title: "What’s actually on your radar after high school?" },
  activities: { title: "What do you naturally spend time on?" },
  fun: { title: "Pick one." },
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
      title: "Nice. What do you think comes next?",
      placeholder: "Say the path you already have in mind.",
    };
  }

  return {
    title: "What’s one idea you already have?",
    placeholder: "Just one. We’ll build from there.",
  };
}

function visualToneForStep(stepId: StepId) {
  if (stepId === "welcome") {
    return { orbA: "bg-fuchsia-400/18", orbB: "bg-cyan-300/14" };
  }
  if (stepId === "summary") {
    return { orbA: "bg-cyan-300/16", orbB: "bg-violet-400/16" };
  }
  if (stepId === "fun") {
    return { orbA: "bg-fuchsia-400/18", orbB: "bg-cyan-300/14" };
  }
  return { orbA: "bg-cyan-300/16", orbB: "bg-violet-400/14" };
}

const screenVariants = {
  questionEnter: { opacity: 0, y: 20, scale: 0.992, filter: "blur(8px)" },
  questionCenter: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  questionExit: { opacity: 0, y: -14, scale: 0.994, filter: "blur(8px)" },
  retortEnter: { opacity: 0, scale: 0.985, y: 16, filter: "blur(8px)" },
  retortCenter: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  retortExit: { opacity: 0, scale: 0.994, y: -12, filter: "blur(8px)" },
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
        "transition",
        disabled
          ? "cursor-not-allowed text-white/20"
          : "text-white/48 hover:text-white/72",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function BottomAction({
  label,
  onClick,
  disabled,
  muted = false,
  icon,
  priority = "secondary",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  muted?: boolean;
  icon?: React.ReactNode;
  priority?: "primary" | "secondary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "inline-flex items-center gap-2 transition",
        priority === "primary"
          ? "text-[15px] font-semibold text-white"
          : "text-[14px] font-semibold tracking-[0.01em]",
        disabled
          ? "cursor-not-allowed text-white/24"
          : muted
            ? "text-white/50 hover:text-white/74"
            : priority === "primary"
              ? "hover:text-white active:translate-x-[1px]"
              : "text-white/90 hover:text-white active:translate-x-[1px]",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
      {label === "Continue" ? (
        <span
          aria-hidden="true"
          className={priority === "primary" ? "text-[17px]" : "text-[16px]"}
        >
          →
        </span>
      ) : null}
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
        scale: selected ? 1.01 : 1,
        opacity: dimmed ? 0.42 : 1,
        y: selected ? -1 : 0,
      }}
      className="group relative block w-full overflow-hidden rounded-[20px] px-4 py-4 text-left"
    >
      <motion.div
        className={[
          "pointer-events-none absolute inset-0 rounded-[20px] border transition",
          selected
            ? "border-cyan-200/36 bg-[linear-gradient(180deg,rgba(42,145,170,0.92),rgba(17,99,126,0.92))] shadow-[0_18px_44px_rgba(8,42,56,0.34)]"
            : "border-cyan-200/14 bg-[linear-gradient(180deg,rgba(29,87,111,0.46),rgba(14,46,62,0.64))] group-hover:border-cyan-200/22 group-hover:bg-[linear-gradient(180deg,rgba(34,99,125,0.52),rgba(16,54,72,0.68))]",
        ].join(" ")}
        animate={{ scale: selected ? 1.004 : 1 }}
        transition={cardSpring}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/10 to-transparent" />
      <div
        className={[
          TYPE.choice,
          "relative transition",
          selected
            ? "font-semibold text-white"
            : "font-medium text-white/86 group-hover:text-white",
        ].join(" ")}
      >
        {label}
      </div>
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

function QuestionShell({
  title,
  whisper,
  children,
  tone,
  currentStep,
  certainty,
  showExit,
  onExit,
}: {
  title: string;
  whisper?: string | null;
  children: React.ReactNode;
  tone: ReturnType<typeof visualToneForStep>;
  currentStep: StepId;
  certainty: Certainty;
  showExit?: boolean;
  onExit?: () => void;
}) {
  return (
    <div className="relative w-full max-w-[720px]">
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
        <div className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full bg-white/4 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-violet-400/8 blur-3xl" />

        <div className="relative px-4 pt-3 pb-4 sm:px-5 sm:pt-3.5 sm:pb-5">
          <div className="flex items-center justify-between">
            <div>{showExit && onExit ? <NavLink label="Exit" onClick={onExit} /> : null}</div>
            {currentStep === "welcome" ? null : (
              <ProgressDots currentStep={currentStep} certainty={certainty} />
            )}
          </div>

          <div className="pt-3">
            <h1 className={currentStep === "welcome" ? TYPE.welcomeHeadline : TYPE.headline}>
              {title}
            </h1>

            {whisper ? (
              <div className="mt-1">
                <div className={TYPE.whisper}>{whisper}</div>
              </div>
            ) : null}

            <div className={whisper ? "mt-3" : "mt-4"}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RetortBand({
  text,
  tone,
}: {
  text: string | null;
  tone: ReturnType<typeof visualToneForStep>;
}) {
  return (
    <div className="relative w-full max-w-[520px]">
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`pointer-events-none absolute -left-6 top-0 h-20 w-20 rounded-full blur-3xl ${tone.orbA}`}
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={`pointer-events-none absolute right-[10%] top-[2rem] h-20 w-20 rounded-full blur-3xl ${tone.orbB}`}
      />

      <div className="relative overflow-hidden rounded-[24px] border border-cyan-200/18 bg-[linear-gradient(180deg,rgba(31,97,121,0.54),rgba(16,55,72,0.66))] px-4 py-4 shadow-[0_18px_44px_rgba(8,42,56,0.26)] backdrop-blur-[18px] sm:px-5 sm:py-4.5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/12 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="relative">
          <div className={TYPE.retort}>{text}</div>
        </div>
      </div>
    </div>
  );
}

function StatementCard({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: ReturnType<typeof visualToneForStep>;
}) {
  return (
    <div className="relative w-full max-w-[720px]">
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

      <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(15,19,33,0.78),rgba(8,11,21,0.84))] px-4 py-4 shadow-[0_26px_90px_rgba(0,0,0,0.40)] backdrop-blur-[18px] sm:px-5 sm:py-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/18 via-white/12 to-transparent" />
        <div className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full bg-white/4 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-violet-400/8 blur-3xl" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

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
    return n
      ? `${n}. Nice to meet you. That already gives this a more human starting point, and now we can start narrowing toward what actually fits.`
      : "Nice to meet you. That already gives this a more human starting point, and now we can start narrowing toward what actually fits.";
  }

  if (fromStep === "situation") {
    if (situation === "high_school") {
      return "Got it. That means we can stay open and exploratory for now, without pretending you need everything figured out yet.";
    }
    if (situation === "young_adult") {
      return "Got it. That gives us permission to be a little more direct and focus on paths that feel real right now.";
    }
    return "Got it. That helps.";
  }

  if (fromStep === "zip") {
    if (!zip5) {
      return hasIdea
        ? "That’s okay. We already have enough to start, and we can still bring in local options later if they matter."
        : "That’s okay. We can still keep going and build something useful without location yet.";
    }
    if (zipPlaceLabel) {
      return `${zipPlaceLabel}. Nice. I’ll keep nearby options in the mix so this feels more grounded in the real world.`;
    }
    return `${zip5}. Nice. I’ll keep nearby options in the mix so this feels more grounded in the real world.`;
  }

  if (fromStep === "certainty") {
    if (certainty === "strong") {
      return hasIdea
        ? "Good. That gives us something real to work with instead of starting from scratch."
        : "Good. That gives us a direction, even if we still need to sharpen it.";
    }
    if (certainty === "kinda") {
      return "That’s enough. You do not need perfect clarity yet — just something honest enough to build from.";
    }
    if (certainty === "no_clue") {
      return "Honestly, that’s fine too. Not knowing clearly is still useful, because it tells us to explore instead of forcing a fake answer.";
    }
    return "Got it.";
  }

  if (fromStep === "certaintyIdea") {
    if (!idea) {
      return hasActivities
        ? "That still helps. Even one small clue starts to make the picture sharper."
        : "That still helps. One real clue is enough to move forward.";
    }

    if (certainty === "strong") {
      return `${idea}. Nice. That feels like a real starting point, and now the goal is to see whether it keeps getting stronger as we go.`;
    }

    return `${idea}. Good. That gives us something concrete to build on without locking you into it too early.`;
  }

  if (fromStep === "postPlans") {
    if (postPlans.includes("no_idea")) {
      return hasActivities
        ? "That’s okay. You’ve already given me enough elsewhere to start narrowing things down without forcing a decision too soon."
        : "That’s okay. We can still narrow things down from here and find a few directions worth testing.";
    }

    if (postPlans.length >= 3) {
      return "Good. You’re keeping a few real paths open, which gives us room to compare what sounds good with what actually fits.";
    }

    if (postPlans.length === 2) {
      return "Good. That already gives us a couple of real directions, which is enough to start making useful comparisons.";
    }

    return "Good. That’s a real option, and now we can see whether it holds up once we layer in the rest of you.";
  }

  if (fromStep === "activities") {
    const labels = activities.filter((key) => key !== "other").map(activityLabel);
    const listText = joinNatural(labels);

    if (hasOtherDetail) {
      return listText
        ? `${listText}. Nice. That helps me get a better feel for the kind of energy you naturally move toward.`
        : "Nice. That helps me get a better feel for the kind of energy you naturally move toward.";
    }

    if (listText) {
      if (hasIdea) {
        return `${listText}. Nice. That gives me more context around the path you already mentioned.`;
      }
      return `${listText}. Nice. That tells me something real about what might actually feel good for you.`;
    }

    return "Nice. That tells me something real.";
  }

  if (fromStep === "fun") {
    const quick =
      typeof funLatencyMs === "number" && funLatencyMs >= 0 && funLatencyMs < 900;
    const slow =
      typeof funLatencyMs === "number" && funLatencyMs >= 1800;
    const tempoTag = quick ? "Fast answer. " : slow ? "You thought about that. " : "";

    if (funChoice === "dog") {
      return `${tempoTag}Dog. Solid choice. That kind of instinct usually says something useful too.`;
    }
    if (funChoice === "cat") {
      return `${tempoTag}Cat. Fair. There is a very specific kind of confidence in that answer.`;
    }
    if (funChoice === "bearded_dragon") {
      return `${tempoTag}Bearded dragon. Strong choice, honestly. That definitely tells me something interesting.`;
    }
    if (funChoice === "rock") {
      return `${tempoTag}Rock. Respect. That is either chaos or clarity, and both are useful.`;
    }
    return "Interesting choice.";
  }

  return "Good. We’ve got enough to keep going.";
}

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

  const pageBgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
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
        if (
          saved.situation === "high_school" ||
          saved.situation === "young_adult" ||
          saved.situation === null
        ) {
          setSituation(saved.situation);
        }
        if (typeof saved.zip === "string") setZip(saved.zip);
        if (
          saved.certainty === "strong" ||
          saved.certainty === "kinda" ||
          saved.certainty === "no_clue" ||
          saved.certainty === null
        ) {
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
      funShownAtRef.current =
        typeof performance !== "undefined" ? performance.now() : Date.now();
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
    if (screenMode === "retort") return true;
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

  async function showRetortThenAdvance(
    fromStep: StepId,
    overrides?: RetortOverrides
  ) {
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

    const zip5 =
      typeof overrides?.zip5 === "string" ? overrides.zip5 : normalizeZip(zip);

    let zipPlaceLabel: string | null =
      "zipPlaceLabel" in (overrides ?? {})
        ? overrides?.zipPlaceLabel ?? null
        : null;

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
      jumpToStep("summary");
      unlockAdvance();
      return;
    }

    goNextStep();
    unlockAdvance();
  }

  function currentZipValue() {
    return normalizeZip(zip);
  }

  function continueFromCurrentStep() {
    if (!lockAdvance()) return;

    if (stepId === "welcome") {
      setScreenMode("question");
      goNextStep();
      unlockAdvance();
      return;
    }

    if (stepId === "name") {
      const trimmed = draft.trim();
      if (!trimmed) {
        unlockAdvance();
        return;
      }
      setName(trimmed);
      setDraft("");
      void showRetortThenAdvance("name", { name: trimmed }).finally(unlockAdvance);
      return;
    }

    if (stepId === "situation") {
      if (!situation) {
        unlockAdvance();
        return;
      }
      void showRetortThenAdvance("situation").finally(unlockAdvance);
      return;
    }

    if (stepId === "zip") {
      const zip5 = normalizeZip(draft || zip);
      setZip(zip5);
      setDraft("");
      void showRetortThenAdvance("zip", { zip5 }).finally(unlockAdvance);
      return;
    }

    if (stepId === "certainty") {
      if (!certainty) {
        unlockAdvance();
        return;
      }
      void showRetortThenAdvance("certainty").finally(unlockAdvance);
      return;
    }

    if (stepId === "certaintyIdea") {
      const trimmed = draft.trim();
      setCertaintyIdea(trimmed);
      setDraft("");
      void showRetortThenAdvance("certaintyIdea", { certaintyIdea: trimmed }).finally(
        unlockAdvance
      );
      return;
    }

    if (stepId === "postPlans") {
      if (postPlans.length === 0) {
        unlockAdvance();
        return;
      }
      void showRetortThenAdvance("postPlans").finally(unlockAdvance);
      return;
    }

    if (stepId === "activities") {
      const other = draft.trim();
      if (activities.length === 0 && !other) {
        unlockAdvance();
        return;
      }
      setActivitiesOther(other);
      setDraft("");
      void showRetortThenAdvance("activities", { activitiesOther: other }).finally(
        unlockAdvance
      );
      return;
    }

    if (stepId === "fun") {
      if (!funChoice) {
        unlockAdvance();
        return;
      }
      showFunRetort(funChoice);
      unlockAdvance();
      return;
    }

    if (stepId === "summary") {
      router.push("/main");
      unlockAdvance();
      return;
    }

    unlockAdvance();
  }

  function continueDisabled() {
    if (screenMode === "retort") return false;

    if (stepId === "welcome") return false;
    if (stepId === "name") return draft.trim().length === 0;
    if (stepId === "situation") return !situation;
    if (stepId === "zip") return false;
    if (stepId === "certainty") return !certainty;
    if (stepId === "certaintyIdea") {
      return certainty !== "strong" && certainty !== "kinda" ? false : draft.trim().length === 0;
    }
    if (stepId === "postPlans") return postPlans.length === 0;
    if (stepId === "activities") return activities.length === 0 && draft.trim().length === 0;
    if (stepId === "fun") return !funChoice;
    if (stepId === "summary") return false;

    return false;
  }

  function renderWelcome() {
    return (
      <StatementCard tone={visualToneForStep("welcome")}>
        <div className="space-y-3">
          <div className={TYPE.summaryLead}>Let’s get to know you.</div>
          <p className={TYPE.body}>
            A few quick questions, then I’ll start shaping directions that feel like you.
          </p>
        </div>
      </StatementCard>
    );
  }

  function renderNameQuestion() {
    return (
      <QuestionShell
        title={STEP_META.name.title}
        tone={visualToneForStep("name")}
        currentStep="name"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <QuestionTextEntry
          value={draft}
          onChange={setDraft}
          onSubmit={continueFromCurrentStep}
          canSubmit={draft.trim().length > 0}
          placeholder="Your name"
          textareaRef={textareaRef}
          rows={1}
        />
      </QuestionShell>
    );
  }

  function renderSituationQuestion() {
    return (
      <QuestionShell
        title={STEP_META.situation.title}
        tone={visualToneForStep("situation")}
        currentStep="situation"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <div className="space-y-3">
          <ChoiceRowText
            label="I’m in high school"
            selected={situation === "high_school"}
            dimmed={Boolean(situation && situation !== "high_school")}
            onClick={() => setSituation("high_school")}
          />
          <ChoiceRowText
            label="I’m a young adult"
            selected={situation === "young_adult"}
            dimmed={Boolean(situation && situation !== "young_adult")}
            onClick={() => setSituation("young_adult")}
          />
        </div>
      </QuestionShell>
    );
  }

  function renderZipQuestion() {
    const zipValue = draft || zip;

    return (
      <QuestionShell
        title={STEP_META.zip.title}
        whisper={whisper}
        tone={visualToneForStep("zip")}
        currentStep="zip"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <QuestionTextEntry
          value={zipValue}
          onChange={(v) => {
            const next = normalizeZip(v);
            setDraft(next);
            setZip(next);
          }}
          onSubmit={continueFromCurrentStep}
          canSubmit={normalizeZip(zipValue).length === 5}
          placeholder="5-digit zip code"
          textareaRef={textareaRef}
          inputMode="numeric"
          rows={1}
        />
      </QuestionShell>
    );
  }

  function renderCertaintyQuestion() {
    return (
      <QuestionShell
        title={STEP_META.certainty.title}
        tone={visualToneForStep("certainty")}
        currentStep="certainty"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <div className="space-y-3">
          <ChoiceRowText
            label="Pretty clear"
            selected={certainty === "strong"}
            dimmed={Boolean(certainty && certainty !== "strong")}
            onClick={() => setCertainty("strong")}
          />
          <ChoiceRowText
            label="Kind of"
            selected={certainty === "kinda"}
            dimmed={Boolean(certainty && certainty !== "kinda")}
            onClick={() => setCertainty("kinda")}
          />
          <ChoiceRowText
            label="No clue"
            selected={certainty === "no_clue"}
            dimmed={Boolean(certainty && certainty !== "no_clue")}
            onClick={() => setCertainty("no_clue")}
          />
        </div>
      </QuestionShell>
    );
  }

  function renderCertaintyIdeaQuestion() {
    const prompt = certaintyIdeaPrompt(certainty);

    return (
      <QuestionShell
        title={prompt.title}
        tone={visualToneForStep("certaintyIdea")}
        currentStep="certaintyIdea"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <QuestionTextEntry
          value={draft}
          onChange={setDraft}
          onSubmit={continueFromCurrentStep}
          canSubmit={draft.trim().length > 0}
          placeholder={prompt.placeholder}
          textareaRef={textareaRef}
        />
      </QuestionShell>
    );
  }

  function renderPostPlansQuestion() {
    return (
      <QuestionShell
        title={STEP_META.postPlans.title}
        tone={visualToneForStep("postPlans")}
        currentStep="postPlans"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <div className="space-y-3">
          <ChoiceRowText
            label="Get a job"
            selected={postPlans.includes("job")}
            onClick={() => setPostPlans((prev) => toggleInList(prev, "job"))}
          />
          <ChoiceRowText
            label="Community college / associate path"
            selected={postPlans.includes("associates")}
            onClick={() => setPostPlans((prev) => toggleInList(prev, "associates"))}
          />
          <ChoiceRowText
            label="Trade / certificate / credential"
            selected={postPlans.includes("credential")}
            onClick={() => setPostPlans((prev) => toggleInList(prev, "credential"))}
          />
          <ChoiceRowText
            label="Military"
            selected={postPlans.includes("military")}
            onClick={() => setPostPlans((prev) => toggleInList(prev, "military"))}
          />
          <ChoiceRowText
            label="Four-year college"
            selected={postPlans.includes("four_year")}
            onClick={() => setPostPlans((prev) => toggleInList(prev, "four_year"))}
          />
          <ChoiceRowText
            label="Honestly, no idea yet"
            selected={postPlans.includes("no_idea")}
            onClick={() => setPostPlans((prev) => toggleInList(prev, "no_idea"))}
          />
        </div>
      </QuestionShell>
    );
  }

  function renderActivitiesQuestion() {
    return (
      <QuestionShell
        title={STEP_META.activities.title}
        tone={visualToneForStep("activities")}
        currentStep="activities"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <div className="space-y-3">
          <ChoiceRowText
            label="Sports"
            selected={activities.includes("sports")}
            onClick={() => setActivities((prev) => toggleInList(prev, "sports"))}
          />
          <ChoiceRowText
            label="Visual arts / design"
            selected={activities.includes("visual_arts")}
            onClick={() => setActivities((prev) => toggleInList(prev, "visual_arts"))}
          />
          <ChoiceRowText
            label="Music / dance / theater"
            selected={activities.includes("performing_arts")}
            onClick={() => setActivities((prev) => toggleInList(prev, "performing_arts"))}
          />
          <ChoiceRowText
            label="Volunteering"
            selected={activities.includes("volunteer")}
            onClick={() => setActivities((prev) => toggleInList(prev, "volunteer"))}
          />
          <ChoiceRowText
            label="Working a job"
            selected={activities.includes("job")}
            onClick={() => setActivities((prev) => toggleInList(prev, "job"))}
          />
          <ChoiceRowText
            label="Something else"
            selected={activities.includes("other")}
            onClick={() => setActivities((prev) => toggleInList(prev, "other"))}
          />

          {activities.includes("other") ? (
            <QuestionTextEntry
              value={draft}
              onChange={setDraft}
              onSubmit={continueFromCurrentStep}
              canSubmit={activities.length > 0 || draft.trim().length > 0}
              placeholder="Tell me the other thing"
              textareaRef={textareaRef}
              rows={2}
            />
          ) : null}
        </div>
      </QuestionShell>
    );
  }

  function renderFunQuestion() {
    return (
      <QuestionShell
        title={STEP_META.fun.title}
        tone={visualToneForStep("fun")}
        currentStep="fun"
        certainty={certainty}
        showExit
        onExit={exitOnboarding}
      >
        <div className="grid grid-cols-2 gap-3">
          {FUN_OPTIONS.map((item) => {
            const selected = funChoice === item.key;

            return (
              <motion.button
                key={item.key}
                type="button"
                whileTap={{ scale: 0.985 }}
                onClick={() => setFunChoice(item.key)}
                className="group relative overflow-hidden rounded-[22px] border border-white/12 bg-white/5 text-left"
              >
                <div className="relative aspect-[1/1] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                </div>
                <div
                  className={[
                    "absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2.5",
                    selected ? "text-white" : "text-white/88",
                  ].join(" ")}
                >
                  <span className="text-[14px] font-medium">{item.alt}</span>
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full transition",
                      selected ? "bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.55)]" : "bg-white/30",
                    ].join(" ")}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </QuestionShell>
    );
  }

  function renderSummary() {
    const insight = buildInsight({
      situation,
      certainty,
      certaintyIdea,
      postPlans,
      activities,
      activitiesOther,
      funChoice,
      zip5: currentZipValue(),
    });

    return (
      <StatementCard tone={visualToneForStep("summary")}>
        <div className="space-y-3">
          <div className={TYPE.summaryLead}>Here’s the shape I’m getting.</div>
          <p className={TYPE.body}>{insight}</p>
        </div>
      </StatementCard>
    );
  }

  function renderRetort() {
    return (
      <div className="flex min-h-[52svh] w-full items-center justify-center px-2 sm:min-h-[56svh]">
        <RetortBand text={retortText} tone={visualToneForStep(retortFromStep ?? "name")} />
      </div>
    );
  }

  function renderCurrentQuestion() {
    if (stepId === "welcome") return renderWelcome();
    if (stepId === "name") return renderNameQuestion();
    if (stepId === "situation") return renderSituationQuestion();
    if (stepId === "zip") return renderZipQuestion();
    if (stepId === "certainty") return renderCertaintyQuestion();
    if (stepId === "certaintyIdea") return renderCertaintyIdeaQuestion();
    if (stepId === "postPlans") return renderPostPlansQuestion();
    if (stepId === "activities") return renderActivitiesQuestion();
    if (stepId === "fun") return renderFunQuestion();
    return renderSummary();
  }

  function renderBottomNav() {
    const items: React.ReactNode[] = [];

    if (canGoBack()) {
      items.push(
        <BottomAction
          key="back"
          label="Back"
          onClick={goBack}
          muted
        />
      );
    }

    const micTarget: VoiceTarget | null =
      stepId === "name"
        ? "name"
        : stepId === "zip"
          ? "zip"
          : stepId === "activities" && activities.includes("other")
            ? "activitiesOther"
            : stepId === "certaintyIdea"
              ? "certaintyIdea"
              : null;

    if (micTarget && speechSupported && screenMode === "question") {
      items.push(
        <BottomAction
          key="talk"
          label="Talk"
          onClick={() => toggleMic(micTarget)}
          priority="primary"
          icon={
            isListening ? (
              <MicOff className="h-[18px] w-[18px]" />
            ) : (
              <Mic className="h-[18px] w-[18px]" />
            )
          }
        />
      );
    }

    if (screenMode === "retort") {
      items.push(
        <BottomAction
          key="continue"
          label="Continue"
          onClick={skipRetort}
          priority="primary"
        />
      );

      return (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {items}
        </div>
      );
    }

    if (stepId === "zip") {
      items.push(
        <BottomAction
          key="skip"
          label="Skip"
          onClick={() => {
            setZip("");
            setDraft("");
            if (!lockAdvance()) return;
            void showRetortThenAdvance("zip", { zip5: "" }).finally(unlockAdvance);
          }}
          muted
        />
      );
    }

    items.push(
      <BottomAction
        key="continue"
        label="Continue"
        onClick={continueFromCurrentStep}
        disabled={continueDisabled()}
        priority="primary"
      />
    );

    if (items.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {items}
      </div>
    );
  }

  const activeNode =
    screenMode === "retort" ? renderRetort() : renderCurrentQuestion();
  const bottomNav = renderBottomNav();

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="questions_orb"
      ambientCap={0.22}
      hideHeader
      flushContent
    >
      <div
        className="relative min-h-full overflow-y-auto overflow-x-hidden"
        style={pageBgStyle}
      >
        <div className="px-4 pt-5 pb-28 sm:px-5 sm:pt-6 sm:pb-32">
          <div className="flex w-full flex-col items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${screenMode}-${stepId}-${retortFromStep ?? "none"}`}
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
                {activeNode}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {bottomNav ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center">
            <div className="pointer-events-auto">
              {bottomNav}
            </div>
          </div>
        ) : null}
      </div>
    </AppChrome>
  );
}