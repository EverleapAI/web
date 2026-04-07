"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, MicOff, Send } from "lucide-react";

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

type VoiceTarget = "name" | "zip" | "activitiesOther";

const STORAGE_KEY = "everleapOnboarding_v4_convo_min";

/* ============================================================
   Copy
   ============================================================ */

const STEP_META: Record<Exclude<StepId, "summary">, { kicker: string; title: string }> = {
  welcome: {
    kicker: "Everleap",
    title: "Let’s get a real sense of you.",
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
  },
  certainty: {
    kicker: "Everleap · What’s next",
    title: "Do you have a sense of what comes next?",
  },
  postPlans: {
    kicker: "Everleap · Possibilities",
    title: "What are you considering after high school?",
  },
  activities: {
    kicker: "Everleap · Outside school",
    title: "What do you do outside of school?",
  },
  fun: {
    kicker: "Everleap · One fun question",
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

/* ============================================================
   Visual helpers
   ============================================================ */

function visualToneForStep(stepId: StepId) {
  if (stepId === "welcome" || stepId === "summary") {
    return {
      orbA: "bg-cyan-300/10",
      orbB: "bg-violet-400/10",
      glow: "shadow-[0_0_80px_rgba(103,232,249,0.08)]",
    };
  }

  if (stepId === "fun") {
    return {
      orbA: "bg-fuchsia-300/10",
      orbB: "bg-amber-300/10",
      glow: "shadow-[0_0_80px_rgba(217,70,239,0.08)]",
    };
  }

  if (stepId === "zip" || stepId === "postPlans") {
    return {
      orbA: "bg-amber-300/10",
      orbB: "bg-orange-400/10",
      glow: "shadow-[0_0_80px_rgba(251,191,36,0.08)]",
    };
  }

  return {
    orbA: "bg-sky-300/10",
    orbB: "bg-violet-400/10",
    glow: "shadow-[0_0_80px_rgba(56,189,248,0.08)]",
  };
}

/* ============================================================
   UI atoms
   ============================================================ */

function BrandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 text-white/84 transition hover:text-white"
      aria-label="Go to landing page"
      title="Everleap"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-white/[0.06] text-xs font-semibold backdrop-blur-sm">
        EL
      </span>
      <span className="text-sm font-semibold uppercase tracking-[0.14em]">Everleap</span>
    </button>
  );
}

function HeaderAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-white/64 transition hover:text-white/90"
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">←</span>
      {label}
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
      className="group relative block w-full overflow-hidden rounded-[18px] px-4 py-2.5 text-left transition"
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 rounded-[18px] border transition",
          selected
            ? "border-white/18 bg-white/[0.08] shadow-[0_0_28px_rgba(255,255,255,0.045)]"
            : "border-white/0 bg-white/[0.02] group-hover:border-white/10 group-hover:bg-white/[0.045]",
        ].join(" ")}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/12 via-white/8 to-transparent" />
      <div
        className={[
          "relative text-[14px] leading-6 transition",
          selected
            ? "font-semibold text-white"
            : "font-normal text-white/74 group-hover:text-white/90",
        ].join(" ")}
      >
        {label}
      </div>
    </button>
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
      <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.045] p-3 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/14 via-white/8 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_48%)]" />

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
            className="min-h-[44px] w-full resize-none bg-transparent px-1 py-1 text-[14px] leading-6 text-white/92 outline-none placeholder:text-white/28"
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
                  ? "border-white/16 bg-white/[0.08] text-white/88 hover:border-white/24 hover:bg-white/[0.12] hover:text-white"
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
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={`inline-flex items-center gap-2 text-sm font-medium transition ${
        disabled ? "cursor-not-allowed text-white/32" : "text-white/84 hover:text-white"
      }`}
      aria-label={label ?? "Continue"}
      title={label ?? "Continue"}
    >
      <span>{label ?? "Continue"}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

function QuestionShell({
  kicker,
  title,
  children,
  actions,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
          {kicker}
        </div>
        <h1 className="mt-3 max-w-[18ch] text-[1.95rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2.2rem]">
          {title}
        </h1>

        <div className="mt-5">{children}</div>

        {actions ? <div className="mt-5">{actions}</div> : null}
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
      return "No problem. I can still tailor strong next steps.";
    }
    if (zipPlaceLabel) {
      return `Love it — ${zipPlaceLabel}. That’ll help with future recommendations.`;
    }
    return `Love it — ${zip5}. That’ll help with future recommendations.`;
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
    return "Got it.";
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
      return `Love it — ${listText}. The extra detail helps me keep recommendations realistic and matched to your life.`;
    }

    return `Nice — ${listText}. How you spend time is one of the strongest signals for what will fit.`;
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

    textareaRef.current?.focus();
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

  function goLanding() {
    router.push("/");
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

        if (resolved && retortTokenRef.current === token) {
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
    void showRetortThenAdvance("name", { name: text });
    unlockAdvance();
  }

  function chooseSituation(v: Situation) {
    if (!lockAdvance()) return;
    setSituation(v);
    void showRetortThenAdvance("situation", { situation: v });
    unlockAdvance();
  }

  function submitZip() {
    if (!lockAdvance()) return;

    const normalized = normalizeZip(draft);
    setZip(normalized);
    setDraft("");

    void showRetortThenAdvance("zip", { zip5: normalized });
    unlockAdvance();
  }

  function skipZip() {
    if (!lockAdvance()) return;
    setZip("");
    setDraft("");
    void showRetortThenAdvance("zip", { zip5: "" });
    unlockAdvance();
  }

  function chooseCertainty(v: Certainty) {
    if (!lockAdvance()) return;
    setCertainty(v);
    void showRetortThenAdvance("certainty", { certainty: v });
    unlockAdvance();
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
    unlockAdvance();
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

  const meta = stepId !== "summary" ? STEP_META[stepId] : null;
  const tone = visualToneForStep(stepId);

  function renderRetort() {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={skipRetort}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") skipRetort();
        }}
        className="flex h-full cursor-pointer items-center justify-center select-none"
        aria-label="Tap to continue"
        title="Tap to continue"
      >
        <div className="mx-auto w-full max-w-3xl">
          <div
            className={`rounded-[22px] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-sm ${tone.glow}`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
              Got it
            </div>
            <div className="mt-3 max-w-2xl text-[16px] leading-7 text-white/88">{retortText}</div>
            <div className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/34">
              Tap anywhere to continue
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderWelcome() {
    return (
      <div className="flex h-full items-center">
        <div className="relative mx-auto w-full max-w-3xl">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -left-8 top-[-1.75rem] h-24 w-24 rounded-full blur-3xl ${tone.orbA}`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute right-[8%] top-[4rem] h-24 w-24 rounded-full blur-3xl ${tone.orbB}`}
          />

          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
              {STEP_META.welcome.kicker}
            </div>

            <h1 className="mt-3 max-w-[13ch] text-[2.15rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.5rem]">
              {STEP_META.welcome.title}
            </h1>

            <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/68">
              A few quick questions now will sharpen what comes next.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={onWelcomeNext}
                className="group inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/[0.07] px-5 py-2.5 text-sm font-medium text-white/92 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-sm transition hover:border-white/24 hover:bg-white/[0.11] hover:text-white"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderName() {
    return (
      <QuestionShell kicker={STEP_META.name.kicker} title={STEP_META.name.title}>
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
    return (
      <QuestionShell kicker={STEP_META.situation.kicker} title={STEP_META.situation.title}>
        <div className="max-w-2xl space-y-2">
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
        </div>
      </QuestionShell>
    );
  }

  function renderZip() {
    return (
      <QuestionShell
        kicker={STEP_META.zip.kicker}
        title={STEP_META.zip.title}
        actions={
          <button
            type="button"
            onClick={skipZip}
            className="text-sm font-medium text-white/50 transition hover:text-white/78"
            aria-label="Skip for now"
            title="Skip for now"
          >
            Skip for now
          </button>
        }
      >
        <ThinkingSurface
          value={draft}
          onChange={setDraft}
          onSubmit={submitZip}
          canSubmit={true}
          placeholder="Zip code"
          textareaRef={textareaRef}
          showMic
          isListening={isListening}
          speechSupported={speechSupported}
          onToggleMic={() => toggleMic("zip")}
          inputMode="numeric"
        />
      </QuestionShell>
    );
  }

  function renderCertainty() {
    return (
      <QuestionShell kicker={STEP_META.certainty.kicker} title={STEP_META.certainty.title}>
        <div className="max-w-2xl space-y-2">
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
        </div>
      </QuestionShell>
    );
  }

  function renderPostPlans() {
    const hasSelection = postPlans.length > 0;

    return (
      <QuestionShell
        kicker={STEP_META.postPlans.kicker}
        title={STEP_META.postPlans.title}
        actions={<MinimalContinue onClick={continuePostPlans} disabled={!hasSelection} />}
      >
        <div className="max-w-3xl space-y-2">
          <ChoiceRowText
            label="Get a job"
            selected={postPlans.includes("job")}
            onClick={() => togglePostPlan("job")}
          />
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
        </div>
      </QuestionShell>
    );
  }

  function renderActivities() {
    const hasSelection = activities.length > 0;
    const wantsOther = activities.includes("other");

    return (
      <QuestionShell
        kicker={STEP_META.activities.kicker}
        title={STEP_META.activities.title}
        actions={<MinimalContinue onClick={() => continueActivities()} disabled={!hasSelection} />}
      >
        <div className="max-w-3xl space-y-2">
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
        </div>

        {wantsOther ? (
          <div className="mt-4 max-w-2xl">
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
      </QuestionShell>
    );
  }

  function renderFun() {
    return (
      <QuestionShell kicker={STEP_META.fun.kicker} title={STEP_META.fun.title}>
        <div className="grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {FUN_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => chooseFun(o.key)}
              className="group relative overflow-hidden rounded-[22px] border border-white/12 bg-white/[0.04] transition hover:border-white/24 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] active:scale-[0.99]"
              aria-label={o.alt}
              title={o.alt}
            >
              <div className="relative h-[132px] w-full sm:h-[190px]">
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
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3 text-left">
                  <div className="text-sm font-medium text-white/90">{o.alt}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </QuestionShell>
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
      <div className="flex h-full items-center">
        <div className="mx-auto w-full max-w-3xl">
          <div
            className={`rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-6 backdrop-blur-sm ${tone.glow}`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
              Everleap
            </div>

            <h1 className="mt-3 max-w-[16ch] text-[1.9rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2.1rem]">
              {n ? `Here’s your starting point, ${n}.` : "Here’s your starting point."}
            </h1>

            <p className="mt-4 max-w-2xl text-[14px] leading-6 text-white/76">{insight}</p>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/88 transition hover:text-white"
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

  const screenKey = screenMode === "retort" ? `retort_${retortFromStep ?? stepId}` : stepId;

  function renderScreen() {
    if (screenMode === "retort") return renderRetort();

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
            <div
              className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute top-72 right-[-220px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
              style={{ opacity: 0.32 }}
            />
            <div
              className={`absolute left-1/2 top-[-6rem] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full blur-3xl ${tone.orbA}`}
            />
            <div
              className={`absolute bottom-[-5rem] right-[10%] h-[15rem] w-[15rem] rounded-full blur-3xl ${tone.orbB}`}
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,35,84,0.18),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/18" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col px-5 pb-6 pt-4 sm:px-6">
          <header className="flex h-14 shrink-0 items-center justify-between">
            <BrandButton onClick={goLanding} />
            {stepId === "welcome" && screenMode === "question" ? (
              <HeaderAction label="Exit" onClick={exitOnboarding} />
            ) : canGoBack() || screenMode === "retort" ? (
              <HeaderAction label="Back" onClick={goBack} />
            ) : (
              <div />
            )}
          </header>

          <main className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0">
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-hidden py-2">
                  <div key={screenKey} className="h-full">
                    {renderScreen()}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppChrome>
  );
}