// src/app/onboarding/page.tsx
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
   Copy (minimal)
   ============================================================ */

const STEP_META: Record<
  Exclude<StepId, "summary">,
  { kicker: string; title: string; micro?: string }
> = {
  welcome: {
    kicker: "Everleap",
    title: "Welcome to Everleap!",
    micro:
      "I’ll ask a few questions to understand you and where you’re headed.\nThis isn’t a test — just a conversation to shape what comes next.",
  },
  name: {
    kicker: "Everleap · Getting to know you",
    title: "What name do you like to be called?",
  },
  situation: {
    kicker: "Everleap · Your world",
    title: "Which best describes where you’re at right now?",
  },
  zip: {
    kicker: "Everleap · Local",
    title: "What’s your zip code?",
    micro: "Optional — later I can match local opportunities near you.",
  },
  certainty: {
    kicker: "Everleap · What’s next",
    title: "Do you have a sense of what comes next?",
    micro: "All three are completely okay.",
  },
  postPlans: {
    kicker: "Everleap · Possibilities",
    title: "What are you considering after high school?",
    micro: "Pick what feels true. You can choose more than one.",
  },
  activities: {
    kicker: "Everleap · Outside school",
    title: "What do you do outside of school?",
    micro: "Pick anything that fits.",
  },
  fun: {
    kicker: "Everleap · One fun question",
    title: "Pick one.",
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
   Minimal UI atoms
   ============================================================ */

function ProgressDots({ current, total }: { current: number; total: number }) {
  const filled = clampInt(current + 1, 1, total);
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Step ${filled} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const on = i < filled;
        return (
          <span
            key={i}
            className={`h-[6px] w-[14px] rounded-full transition ${on ? "bg-white/70" : "bg-white/18"}`}
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
      className="inline-flex items-center gap-3 text-white/85 hover:text-white transition"
      aria-label="Go to landing page"
      title="Everleap"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-white/6 text-xs font-semibold">
        EL
      </span>
      <span className="text-sm font-semibold tracking-wide">Everleap</span>
    </button>
  );
}

function MinimalBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white/90 transition"
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
    <button type="button" onClick={onClick} className="group block w-full py-3 text-left">
      <div
        className={`text-[16px] leading-7 transition ${
          selected ? "text-white font-semibold" : "text-white/70 group-hover:text-white/85 font-normal"
        }`}
      >
        {label}
      </div>
    </button>
  );
}

function EndOfAnswersLine() {
  return <div className="mt-2 h-px w-full bg-white/12" aria-hidden="true" />;
}

function MinimalTextarea({
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
    <div className="mt-7 w-full max-w-2xl">
      <div className="flex items-end gap-3">
        <div className="flex-1 border-b border-white/18 focus-within:border-white/40 transition">
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
            rows={2}
            placeholder={placeholder ?? ""}
            className="w-full resize-none bg-transparent py-3 text-[16px] leading-7 text-white/90 placeholder:text-white/30 outline-none"
          />
        </div>

        {showMic ? (
          <button
            type="button"
            onClick={onToggleMic}
            disabled={!speechSupported}
            className={`h-10 w-10 rounded-full border transition active:scale-95 ${
              !speechSupported
                ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                : isListening
                ? "border-white/35 bg-white/10 text-white"
                : "border-white/18 bg-white/6 text-white/80 hover:bg-white/10"
            }`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            title={!speechSupported ? "Voice not supported" : isListening ? "Listening…" : "Voice input"}
          >
            {isListening ? <MicOff className="mx-auto h-4 w-4" /> : <Mic className="mx-auto h-4 w-4" />}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`h-10 w-10 rounded-full transition active:scale-95 ${
            canSubmit ? "bg-white/80 text-black hover:bg-white" : "bg-white/10 text-white/35 cursor-not-allowed"
          }`}
          aria-label="Send"
          title="Send"
        >
          <Send className="mx-auto h-4 w-4" />
        </button>
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
    <div className="mt-10">
      <button
        type="button"
        onClick={onClick}
        disabled={Boolean(disabled)}
        className={`text-sm font-semibold transition ${
          disabled ? "text-white/35 cursor-not-allowed" : "text-white/80 hover:text-white"
        }`}
        aria-label={label ?? "Continue"}
        title={label ?? "Continue"}
      >
        → {label ?? "Continue"}
      </button>
    </div>
  );
}

/* ============================================================
   Retorts (meaningful, tied to last answer; no visible "Continue")
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
  React.useEffect(() => {
    const t = window.setTimeout(onDone, 1200);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex w-full flex-col items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <motion.div className="flex items-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.55, scale: 1, x: 0 }}
              animate={{
                opacity: i === 3 ? 0.9 : 0.25,
                scale: i === 3 ? 1.1 : 0.9,
                x: (3 - i) * 8,
              }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="h-[6px] w-[6px] rounded-full bg-white/70"
              aria-hidden="true"
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "48%", opacity: 0.75 }}
        transition={{ duration: 0.75, ease: "easeInOut", delay: 0.35 }}
        className="mt-6 h-px rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.25)]"
        aria-hidden="true"
      />
    </div>
  );
}

/* ============================================================
   Summary (always “you”, references all answers)
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

// Tiny deterministic overrides for known zips (keeps demos feeling “smart”)
const ZIP_OVERRIDES: Record<string, { city: string; state: string }> = {
  "94901": { city: "San Rafael", state: "CA" },
};

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  // AppChrome visuals (keep minimal)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(1);

  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient = GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ?? GRADIENT_CONFIGS[1];

  const pageBgImage = gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const pageBgStyle: CSSProperties = pageBgImage ? { backgroundImage: pageBgImage } : {};

  // Step state
  const [stepIndex, setStepIndex] = React.useState(0);
  const stepId = STEPS[stepIndex];

  // Screen mode state machine
  const [screenMode, setScreenMode] = React.useState<ScreenMode>("question");
  const [retortText, setRetortText] = React.useState<string | null>(null);
  const [retortFromStep, setRetortFromStep] = React.useState<StepId | null>(null);

  const retortTimerRef = React.useRef<number | null>(null);
  const advanceLockRef = React.useRef(false);

  // Retort token so async ZIP lookup can safely update the same retort screen only if still relevant
  const retortTokenRef = React.useRef<string | null>(null);

  // Answers
  const [name, setName] = React.useState("");
  const [situation, setSituation] = React.useState<Situation>(null);
  const [zip, setZip] = React.useState(""); // stored normalized 5 digits or ""
  const [certainty, setCertainty] = React.useState<Certainty>(null);
  const [postPlans, setPostPlans] = React.useState<PostPlanKey[]>([]);
  const [activities, setActivities] = React.useState<ActivityKey[]>([]);
  const [activitiesOther, setActivitiesOther] = React.useState("");
  const [funChoice, setFunChoice] = React.useState<FunChoice>(null);

  // Input draft (reused for text steps)
  const [draft, setDraft] = React.useState("");

  // Speech
  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastFinalRef = React.useRef<string>("");
  const activeTargetRef = React.useRef<VoiceTarget | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Fun "how did you pick" (speed hint)
  const funShownAtRef = React.useRef<number | null>(null);

  // Reset EVERYTHING when onboarding mounts (fresh conversation every time)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }

    // Hard reset local state
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

    // stop any mic in progress
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    lastFinalRef.current = "";
    activeTargetRef.current = null;
    funShownAtRef.current = null;

    // focus after first paint
    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speech supported
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

  // Cleanup
  React.useEffect(() => {
    return () => {
      clearRetortTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Persist (optional)
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
    } catch {
      // ignore
    }
  }, [stepIndex, name, situation, zip, certainty, postPlans, activities, activitiesOther, funChoice]);

  // On step change: stop listening, reset draft, unlock
  React.useEffect(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
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
    } catch {
      // ignore
    }
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

    // Build a first retort immediately (fast), then refine in-place if ZIP lookup returns
    let zipPlaceLabel: string | null =
      "zipPlaceLabel" in (overrides ?? {}) ? (overrides?.zipPlaceLabel ?? null) : null;

    // Known deterministic overrides first
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

    // Async refine only for zip retort (same screen), if we don't already have a place label
    if (fromStep === "zip" && zip5 && !zipPlaceLabel && retortTokenRef.current === token) {
      try {
        const place = await lookupZipPlace(zip5);
        const resolved = place ? `${place.city}, ${stateFullName(place.state)}` : null;

        // If lookup missed but override exists, still use override (handled above); otherwise resolved may be null.
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

          // Only update if we're still on the same retort
          if (retortTokenRef.current === token && retortFromStep === "zip") {
            setRetortText(t1);
          }
        }
      } catch {
        // ignore
      }
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

  /* ============================================================
     Handlers
     ============================================================ */

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

  /* ============================================================
     Render helpers
     ============================================================ */

  const meta = stepId !== "summary" ? STEP_META[stepId] : null;

  function Kicker() {
    if (!meta?.kicker) return null;
    return (
      <div className="text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">
        {meta.kicker}
      </div>
    );
  }

  function TitleBlock({ title, micro }: { title: string; micro?: string }) {
    return (
      <div className="max-w-3xl">
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        {micro ? (
          <p className="mt-4 text-[15px] leading-7 text-white/60 max-w-2xl whitespace-pre-line">{micro}</p>
        ) : null}
      </div>
    );
  }

  /* ============================================================
     Screens
     ============================================================ */

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
        <div className="max-w-3xl pt-6">
          <div className="text-xl sm:text-2xl leading-9 text-white/88">{retortText}</div>
        </div>
      </div>
    );
  }

  function renderWelcome() {
    return (
      <div className="flex min-h-[60svh] items-center">
        <div>
          <Kicker />
          <TitleBlock title={STEP_META.welcome.title} micro={STEP_META.welcome.micro} />
          <div className="mt-10">
            <button
              type="button"
              onClick={onWelcomeNext}
              className="text-sm font-semibold text-white/80 hover:text-white transition"
              aria-label="Start"
              title="Start"
            >
              → Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderName() {
    return (
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.name.title} />
          <MinimalTextarea
            value={draft}
            onChange={setDraft}
            onSubmit={submitName}
            canSubmit={Boolean(draft.trim())}
            textareaRef={textareaRef}
            showMic
            isListening={isListening}
            speechSupported={speechSupported}
            onToggleMic={() => toggleMic("name")}
          />
        </div>
      </div>
    );
  }

  function renderSituation() {
    return (
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.situation.title} />
          <div className="mt-10 max-w-2xl">
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
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.zip.title} micro={STEP_META.zip.micro} />

          <MinimalTextarea
            value={draft}
            onChange={setDraft}
            onSubmit={submitZip}
            canSubmit={true}
            placeholder="Zip (optional)"
            textareaRef={textareaRef}
            showMic
            isListening={isListening}
            speechSupported={speechSupported}
            onToggleMic={() => toggleMic("zip")}
            inputMode="numeric"
          />

          <div className="mt-6">
            <button
              type="button"
              onClick={skipZip}
              className="text-sm font-semibold text-white/55 hover:text-white/75 transition"
              aria-label="Skip zip"
              title="Skip"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderCertainty() {
    return (
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.certainty.title} micro={STEP_META.certainty.micro} />
          <div className="mt-10 max-w-2xl">
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
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.postPlans.title} micro={STEP_META.postPlans.micro} />

          <div className="mt-10 max-w-3xl">
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
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.activities.title} micro={STEP_META.activities.micro} />

          <div className="mt-10 max-w-3xl">
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
            <ChoiceRowText label="Working a job" selected={activities.includes("job")} onClick={() => toggleActivity("job")} />
            <ChoiceRowText label="Other" selected={activities.includes("other")} onClick={() => toggleActivity("other")} />

            <EndOfAnswersLine />

            {wantsOther ? (
              <div className="mt-6">
                <div className="text-sm text-white/60">What’s “other”?</div>
                <MinimalTextarea
                  value={draft}
                  onChange={setDraft}
                  onSubmit={() => continueActivities(draft)}
                  canSubmit={true}
                  textareaRef={textareaRef}
                  showMic
                  isListening={isListening}
                  speechSupported={speechSupported}
                  onToggleMic={() => toggleMic("activitiesOther")}
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
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <Kicker />
          <TitleBlock title={STEP_META.fun.title} />

          <div className="mt-10 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4">
            {FUN_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => chooseFun(o.key)}
                className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/5 transition hover:border-white/25 hover:bg-white/8 active:scale-[0.99]"
                aria-label={o.alt}
                title={o.alt}
              >
                <div className="relative h-[200px] w-full sm:h-[260px]">
                  <Image
                    src={o.src}
                    alt={o.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 320px"
                    className="object-cover transition group-hover:scale-[1.02]"
                    priority={o.key === "dog"}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                  />
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
      <div className="flex min-h-[60svh] items-center">
        <div className="w-full">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">Everleap</div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {n ? `Here’s your starting point, ${n}.` : "Here’s a strong starting point."}
            </h1>

            <p className="mt-6 text-[15px] leading-7 text-white/75">{insight}</p>

            <div className="mt-10">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm font-semibold text-white/85 hover:text-white transition"
                aria-label="Join Everleap"
                title="Join Everleap"
              >
                → Join Everleap
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
          <div className="pointer-events-none absolute inset-0" style={{ opacity: gradient.ambientOpacity * 0.4 }}>
            <div className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientTopLeftClass}`} />
            <div
              className={`absolute top-72 right-[-220px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
              style={{ opacity: 0.32 }}
            />
          </div>
        )}

        <main className="relative z-10">
          <div className="mx-auto w-full max-w-[980px] px-6 pb-24 pt-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <MinimalTopLeftBrand onClick={goLanding} />
              </div>

              <div className="flex flex-col items-center gap-2">
                <ProgressDots current={stepIndex} total={STEPS.length} />
              </div>

              <div className="min-w-[120px] flex justify-end">
                {canGoBack() ? (
                  <MinimalBack onClick={goBack} />
                ) : (
                  <button
                    type="button"
                    onClick={exitOnboarding}
                    className="text-sm font-semibold text-white/55 hover:text-white/80 transition"
                    aria-label="Exit onboarding"
                    title="Exit"
                  >
                    Exit
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10">
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
