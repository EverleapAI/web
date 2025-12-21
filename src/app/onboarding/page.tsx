// src/app/onboarding/page.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, ArrowRight } from "lucide-react";

import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

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
   Types & constants
   ============================================================ */

type StepId =
  | "welcome"
  | "name"
  | "situation"
  | "certainty"
  | "postPlans"
  | "activities"
  | "fun"
  | "summary";

const STEPS: StepId[] = [
  "welcome",
  "name",
  "situation",
  "certainty",
  "postPlans",
  "activities",
  "fun",
  "summary",
];

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

type FunChoice = "cat" | "dog" | null;

type BadgeId = "onboarding" | "motivations" | "strengths" | "skills";

type VoiceTarget = "name" | "activitiesOther";

const STORAGE_KEY = "everleapOnboarding_v1";
const BADGES_KEY = "everleapBadges_v1";

const TYPE_SPEED_MS = 28;

const pillClass =
  "mx-auto mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60";

/* ============================================================
   Small helpers
   ============================================================ */

function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** same heuristic you used elsewhere */
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

/* ============================================================
   Typing hook (same pattern as questions)
   ============================================================ */

function useTypewriter(text: string, speedMs: number, enabled: boolean) {
  const [out, setOut] = React.useState("");
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!enabled) {
      setOut(text);
      return;
    }

    let cancelled = false;
    let i = 0;
    setOut("");

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setOut(text.slice(0, i));
      if (i < text.length) {
        timerRef.current = window.setTimeout(tick, speedMs);
      }
    };

    timerRef.current = window.setTimeout(tick, 120);

    return () => {
      cancelled = true;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, speedMs, enabled]);

  const done = out.length >= text.length;
  return { typed: out, done };
}

/* ============================================================
   Stable QuestionShell component (MUST be outside page component)
   ============================================================ */

type QuestionShellProps = {
  pill: string;
  prompt: string;

  micTarget?: VoiceTarget;
  isListening: boolean;
  speechSupported: boolean;
  onToggleMic?: (target: VoiceTarget) => void;

  draft?: string;
  setDraft?: (v: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;

  onSubmit?: () => void;
  canSubmit?: boolean;

  typingEnabled?: boolean;
  children?: React.ReactNode;
};

function QuestionShell(props: QuestionShellProps) {
  const typingEnabled = props.typingEnabled ?? true;
  const { typed, done } = useTypewriter(props.prompt, TYPE_SPEED_MS, typingEnabled);

  const showInput = typeof props.onSubmit === "function";
  const draft = props.draft ?? "";
  const canSubmit = props.canSubmit ?? false;

  return (
    <div className="flex flex-col items-center">
      <div className={pillClass}>{props.pill}</div>

      <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
        {typed}
        {!done && (
          <span className="ml-1 inline-block h-[1em] w-[0.55ch] translate-y-[0.08em] animate-pulse rounded-sm bg-white/40" />
        )}
      </h1>

      {props.micTarget ? (
        <div className="mt-7 flex items-center justify-center">
          <button
            type="button"
            onClick={() => props.onToggleMic?.(props.micTarget!)}
            disabled={!props.speechSupported}
            className={`
              inline-flex h-12 w-12 items-center justify-center rounded-full border
              transition active:scale-95
              ${
                props.isListening
                  ? "border-rose-300/80 bg-rose-500/20 text-rose-100 shadow-[0_0_38px_rgba(244,63,94,0.35)]"
                  : "border-sky-300/70 bg-slate-900/40 text-slate-100 shadow-[0_0_34px_rgba(56,189,248,0.22)] hover:bg-slate-900/55"
              }
              ${!props.speechSupported ? "opacity-40 cursor-not-allowed" : ""}
            `}
            aria-label={props.isListening ? "Stop voice input" : "Start voice input"}
            title={
              !props.speechSupported
                ? "Voice not supported"
                : props.isListening
                  ? "Listening…"
                  : "Talk instead of typing"
            }
          >
            {props.isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>
      ) : null}

      {props.children}

      {showInput ? (
        <div className="mt-8 w-full max-w-3xl">
          <div className="relative rounded-[34px] bg-gradient-to-r from-sky-400/70 via-fuchsia-500/65 to-amber-300/65 p-[1px]">
            <div className="relative flex items-end gap-3 rounded-[34px] bg-slate-950/65 px-4 py-4 sm:px-6 sm:py-5">
              <textarea
                ref={props.textareaRef}
                value={draft}
                onChange={(e) => props.setDraft?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    props.onSubmit?.();
                  }
                }}
                rows={3}
                placeholder=""
                className="
                  min-h-[84px] flex-1 resize-none bg-transparent
                  text-base text-slate-50 placeholder:text-slate-400/70
                  outline-none
                "
              />

              <div className="flex items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={props.onSubmit}
                  disabled={!canSubmit}
                  className={`
                    inline-flex h-11 w-11 items-center justify-center rounded-full
                    transition active:scale-95
                    ${
                      canSubmit
                        ? "bg-sky-300 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:bg-sky-200"
                        : "bg-white/10 text-slate-200/50 cursor-not-allowed"
                    }
                  `}
                  aria-label="Submit"
                  title="Submit"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================
   Insight summary helper
   ============================================================ */

function buildInsight(options: {
  name: string;
  situation: Situation;
  certainty: Certainty;
  postPlans: PostPlanKey[];
  activities: ActivityKey[];
  activitiesOther: string;
  funChoice: FunChoice;
}) {
  const { name, situation, certainty, postPlans, activities, activitiesOther, funChoice } = options;

  const parts: string[] = [];
  const cleanedName = name.trim();
  const you = cleanedName ? `${cleanedName}, ` : "";

  if (situation === "high_school") {
    if (certainty === "strong") {
      parts.push(
        `${you}you’re in high school and already have a strong idea of where you want to go next. That focus gives you a real head start.`
      );
    } else if (certainty === "kinda") {
      parts.push(
        `${you}you’re in high school with some ideas about your future, but you’re still exploring—which is exactly where most people are at this stage.`
      );
    } else if (certainty === "no_clue") {
      parts.push(
        `${you}you’re in high school and honest about not knowing what comes next. That honesty is actually one of the best places to begin.`
      );
    } else {
      parts.push(`${you}you’re in high school and taking a moment to think about what’s next.`);
    }
  } else if (situation === "young_adult") {
    if (certainty === "strong") {
      parts.push(
        `${you}you’re a young adult with a clear sense of direction, which puts you in a great spot to start turning plans into real moves.`
      );
    } else if (certainty === "kinda") {
      parts.push(
        `${you}you’re a young adult with a few ideas, still sorting out which path fits best—and that kind of exploration is completely normal.`
      );
    } else if (certainty === "no_clue") {
      parts.push(
        `${you}you’re a young adult who isn’t sure yet what comes next, and that’s more common than people admit. Everleap is built for exactly this moment.`
      );
    } else {
      parts.push(`${you}you’re a young adult pausing long enough to reflect, which already helps.`);
    }
  } else {
    parts.push(`${you}you’re taking a moment to step back and look at where you are and where you might go next.`);
  }

  if (postPlans.length > 0) {
    const mapped: string[] = [];
    if (postPlans.includes("job")) mapped.push("getting a job and building real-world experience");
    if (postPlans.includes("associates")) mapped.push("community or two-year college options");
    if (postPlans.includes("credential")) mapped.push("shorter training or credential programs");
    if (postPlans.includes("military")) mapped.push("a path through the military");
    if (postPlans.includes("four_year")) mapped.push("a four-year college path");
    if (postPlans.includes("no_idea")) mapped.push("different possibilities without one clear lane yet");

    if (mapped.length > 0) {
      const last = mapped.pop();
      const listText = mapped.length === 0 ? last : mapped.join(", ") + (last ? `, and ${last}` : "");
      parts.push(`Right now you’re open to ${listText}, which gives you several directions you can test.`);
    }
  }

  if (activities.length > 0 || isMeaningfulText(activitiesOther)) {
    const act: string[] = [];
    if (activities.includes("sports")) act.push("sports and physical activity");
    if (activities.includes("visual_arts")) act.push("visual or creative arts");
    if (activities.includes("performing_arts")) act.push("performing arts");
    if (activities.includes("volunteer")) act.push("volunteering or helping others");
    if (activities.includes("job")) act.push("working a job outside of school");

    const last = act.pop();
    const listText = act.length === 0 ? last : act.join(", ") + (last ? `, and ${last}` : "");
    if (listText) parts.push(`Outside of school, you’re investing time in ${listText}.`);

    if (isMeaningfulText(activitiesOther)) {
      parts.push("Those extra details you shared will help Everleap shape more personalized ideas over time.");
    }
  }

  let closing =
    "This is just your starting point. As you keep answering questions, Everleap will get better at spotting patterns and suggesting paths that actually fit you.";

  if (funChoice === "cat") closing += " Also, cat person noted.";
  if (funChoice === "dog") closing += " Also, dog person energy noted.";

  parts.push(closing);
  return parts.join(" ");
}

/* ============================================================
   Badges
   ============================================================ */

function BadgeTile({
  label,
  imgSrc,
  dimmed,
}: {
  label: string;
  imgSrc: string;
  dimmed?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2" style={{ opacity: dimmed ? 0.35 : 1 }}>
      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/35 shadow-sm backdrop-blur-xl">
        <Image src={imgSrc} alt={label} fill sizes="80px" className="object-contain p-3" />
      </div>
      <div className="text-xs font-medium text-white/70">{label}</div>
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function OnboardingPage() {
  const router = useRouter();

  // Shared AppChrome visual state
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient = GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ?? GRADIENT_CONFIGS[3];

  const pageBgImage = gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const pageBgStyle: CSSProperties = pageBgImage ? { backgroundImage: pageBgImage } : {};
  const dark = isDarkTheme(themeId);

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";
  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  // State
  const [stepIndex, setStepIndex] = React.useState(0);
  const stepId = STEPS[stepIndex];

  const [name, setName] = React.useState("");
  const [situation, setSituation] = React.useState<Situation>(null);
  const [certainty, setCertainty] = React.useState<Certainty>(null);
  const [postPlans, setPostPlans] = React.useState<PostPlanKey[]>([]);
  const [activities, setActivities] = React.useState<ActivityKey[]>([]);
  const [activitiesOther, setActivitiesOther] = React.useState("");
  const [funChoice, setFunChoice] = React.useState<FunChoice>(null);

  // "Questions" style input state
  const [draft, setDraft] = React.useState("");

  // Speech
  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastFinalRef = React.useRef<string>(""); // dedupe final chunks
  const activeTargetRef = React.useRef<VoiceTarget | null>(null);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Persist onboarding state
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stepIndex,
          name,
          situation,
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
  }, [stepIndex, name, situation, certainty, postPlans, activities, activitiesOther, funChoice]);

  // Speech supported
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window.SpeechRecognition ?? window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Stop listening when step changes
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
  }, [stepId]);

  function getOrCreateRecognition(): SpeechRecognition | null {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRec =
      (window.SpeechRecognition ?? window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
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

      if (target === "name" || target === "activitiesOther") {
        setDraft((prev) => {
          const base = prev.trim();
          return base ? `${base} ${cleaned}` : cleaned;
        });
      }
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
    setDraft("");
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

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function markOnboardingBadge() {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(BADGES_KEY);
      const existing = raw ? (JSON.parse(raw) as Partial<Record<BadgeId, boolean>>) : {};
      window.localStorage.setItem(BADGES_KEY, JSON.stringify({ ...existing, onboarding: true }));
    } catch {
      // ignore
    }
  }

  const didMarkSummaryRef = React.useRef(false);
  React.useEffect(() => {
    if (stepId !== "summary") return;
    if (didMarkSummaryRef.current) return;
    didMarkSummaryRef.current = true;
    markOnboardingBadge();
  }, [stepId]);

  /* ============================================================
     Steps
     ============================================================ */

  function renderWelcome() {
    const prompt =
      "You are starting a journey to better understand yourself and your path in life. Think of me as a college & career counselor and life coach all in one. This is a conversation — not a test. Answer as honestly as you can.";

    return (
      <div className="space-y-8">
        <QuestionShell pill="Everleap" prompt={prompt} isListening={isListening} speechSupported={speechSupported}>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={goNext}
              className="
                inline-flex items-center gap-2 rounded-full
                border border-sky-300/80 bg-sky-400/90 px-6 py-2.5
                text-sm font-semibold text-slate-950
                shadow-[0_0_35px_rgba(56,189,248,0.9)]
                transition hover:bg-sky-300 active:scale-95
              "
            >
              Let’s go <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </QuestionShell>
      </div>
    );
  }

  function submitName() {
    const text = draft.trim();
    if (!text) return;
    setName(text);
    setDraft("");
    goNext();
  }

  function renderName() {
    return (
      <QuestionShell
        pill="Onboarding"
        prompt="What name do you go by?"
        micTarget="name"
        isListening={isListening}
        speechSupported={speechSupported}
        onToggleMic={toggleMic}
        draft={draft}
        setDraft={setDraft}
        textareaRef={textareaRef}
        onSubmit={submitName}
        canSubmit={Boolean(draft.trim())}
      />
    );
  }

  function renderSituation() {
    const prompt = name.trim()
      ? `Ok cool, ${name.trim()}. Which of these best describes your situation?`
      : "Ok cool. Which of these best describes your situation?";

    return (
      <div className="space-y-8">
        <QuestionShell pill="Onboarding" prompt={prompt} isListening={isListening} speechSupported={speechSupported}>
          <div className="mt-8 w-full max-w-3xl space-y-3">
            {[
              { key: "high_school" as const, label: "I'm a high school student" },
              { key: "young_adult" as const, label: "I'm a young adult (18–24 years old)" },
            ].map((opt) => {
              const active = situation === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSituation(opt.key);
                    goNext();
                  }}
                  className={`
                    flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left
                    transition shadow-sm
                    ${
                      active
                        ? "border-sky-300/80 bg-slate-900/90 shadow-[0_0_30px_rgba(56,189,248,0.9)]"
                        : "border-white/10 bg-slate-950/35 hover:border-sky-300/70 hover:bg-slate-900/55"
                    }
                  `}
                >
                  <span className="text-sm text-slate-100 md:text-base">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </QuestionShell>
      </div>
    );
  }

  function renderCertainty() {
    const prompt = "Do you know what you are going to do after high school?";

    return (
      <div className="space-y-8">
        <QuestionShell pill="Onboarding" prompt={prompt} isListening={isListening} speechSupported={speechSupported}>
          <div className="mt-8 w-full max-w-3xl space-y-3">
            {[
              { key: "strong" as const, label: "Strong idea" },
              { key: "kinda" as const, label: "Kind of" },
              { key: "no_clue" as const, label: "No clue" },
            ].map((opt) => {
              const active = certainty === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setCertainty(opt.key);
                    goNext();
                  }}
                  className={`
                    flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left
                    transition shadow-sm
                    ${
                      active
                        ? "border-sky-300/80 bg-slate-900/90 shadow-[0_0_30px_rgba(56,189,248,0.9)]"
                        : "border-white/10 bg-slate-950/35 hover:border-sky-300/70 hover:bg-slate-900/55"
                    }
                  `}
                >
                  <span className="text-sm text-slate-100 md:text-base">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </QuestionShell>
      </div>
    );
  }

  function renderPostPlans() {
    const prompt = "What are you considering after high school? (Pick more than one.)";

    const options: { key: PostPlanKey; label: string }[] = [
      { key: "job", label: "Get a job" },
      { key: "associates", label: "Associate’s degree" },
      { key: "credential", label: "Credential program" },
      { key: "military", label: "Join military" },
      { key: "four_year", label: "Four-year college" },
      { key: "no_idea", label: "No idea" },
    ];

    const canContinue = postPlans.length > 0;

    const handleToggle = (key: PostPlanKey) => {
      if (key === "no_idea") {
        setPostPlans((prev) => (prev.includes("no_idea") ? [] : ["no_idea"]));
        return;
      }
      setPostPlans((prev) => {
        const cleaned = prev.filter((k) => k !== "no_idea");
        return toggleInList(cleaned as PostPlanKey[], key);
      });
    };

    return (
      <div className="space-y-8">
        <QuestionShell pill="Onboarding" prompt={prompt} isListening={isListening} speechSupported={speechSupported}>
          <div className="mt-8 w-full max-w-3xl space-y-3">
            {options.map((opt) => {
              const active = postPlans.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleToggle(opt.key)}
                  className={`
                    flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left
                    transition shadow-sm
                    ${
                      active
                        ? "border-sky-300/80 bg-slate-900/90 shadow-[0_0_30px_rgba(56,189,248,0.9)]"
                        : "border-white/10 bg-slate-950/35 hover:border-sky-300/70 hover:bg-slate-900/55"
                    }
                  `}
                >
                  <span className="text-sm text-slate-100 md:text-base">{opt.label}</span>
                </button>
              );
            })}

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className={`
                  inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold
                  transition active:scale-95
                  ${
                    canContinue
                      ? "border border-sky-300/80 bg-sky-400/90 text-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.9)] hover:bg-sky-300"
                      : "border border-white/10 bg-white/5 text-slate-200/40 cursor-not-allowed"
                  }
                `}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </QuestionShell>
      </div>
    );
  }

  function submitActivitiesOther() {
    const text = draft.trim();
    if (activities.includes("other")) setActivitiesOther(text);
    setDraft("");
    goNext();
  }

  function renderActivities() {
    const prompt = "What kind of things do you do outside of school?";

    const options: { key: ActivityKey; label: string }[] = [
      { key: "sports", label: "Sports" },
      { key: "visual_arts", label: "Visual arts" },
      { key: "performing_arts", label: "Performing arts" },
      { key: "volunteer", label: "Volunteer" },
      { key: "job", label: "Have a job" },
      { key: "other", label: "Other" },
    ];

    const hasSelection = activities.length > 0;

    return (
      <div className="space-y-8">
        <QuestionShell pill="Onboarding" prompt={prompt} isListening={isListening} speechSupported={speechSupported}>
          <div className="mt-8 w-full max-w-3xl space-y-3">
            {options.map((opt) => {
              const active = activities.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setActivities((prev) => toggleInList(prev, opt.key))}
                  className={`
                    flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left
                    transition shadow-sm
                    ${
                      active
                        ? "border-sky-300/80 bg-slate-900/90 shadow-[0_0_30px_rgba(56,189,248,0.9)]"
                        : "border-white/10 bg-slate-950/35 hover:border-sky-300/70 hover:bg-slate-900/55"
                    }
                  `}
                >
                  <span className="text-sm text-slate-100 md:text-base">{opt.label}</span>
                </button>
              );
            })}

            {activities.includes("other") ? (
              <div className="pt-6">
                <QuestionShell
                  pill="Onboarding"
                  prompt="Want to share a quick detail?"
                  micTarget="activitiesOther"
                  isListening={isListening}
                  speechSupported={speechSupported}
                  onToggleMic={toggleMic}
                  draft={draft}
                  setDraft={setDraft}
                  textareaRef={textareaRef}
                  onSubmit={submitActivitiesOther}
                  canSubmit={true}
                />
              </div>
            ) : (
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!hasSelection}
                  className={`
                    inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold
                    transition active:scale-95
                    ${
                      hasSelection
                        ? "border border-sky-300/80 bg-sky-400/90 text-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.9)] hover:bg-sky-300"
                        : "border border-white/10 bg-white/5 text-slate-200/40 cursor-not-allowed"
                    }
                  `}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </QuestionShell>
      </div>
    );
  }

  function renderFun() {
    const prompt = "Last one — just for fun. Which is best?";

    return (
      <div className="space-y-8">
        <QuestionShell pill="Onboarding" prompt={prompt} isListening={isListening} speechSupported={speechSupported}>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 w-full max-w-3xl">
            <button
              type="button"
              onClick={() => {
                setFunChoice("cat");
                goNext();
              }}
              className="
                group flex flex-col items-center justify-center rounded-2xl border
                border-white/10 bg-slate-950/35 p-2
                shadow-[0_18px_55px_rgba(0,0,0,0.85)]
                transition hover:border-sky-300/80 hover:shadow-[0_0_40px_rgba(56,189,248,0.9)]
              "
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image
                  src="/onboarding-fun-cat.jpg"
                  alt="Cat selfie"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setFunChoice("dog");
                goNext();
              }}
              className="
                group flex flex-col items-center justify-center rounded-2xl border
                border-white/10 bg-slate-950/35 p-2
                shadow-[0_18px_55px_rgba(0,0,0,0.85)]
                transition hover:border-sky-300/80 hover:shadow-[0_0_40px_rgba(56,189,248,0.9)]
              "
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image
                  src="/onboarding-fun-dog.jpg"
                  alt="Dog selfie"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </QuestionShell>
      </div>
    );
  }

  function renderSummary() {
    const insight = buildInsight({
      name,
      situation,
      certainty,
      postPlans,
      activities,
      activitiesOther,
      funChoice,
    });

    return (
      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <BadgeTile label="Onboarding" imgSrc="/onboarding.png" dimmed={false} />
          <BadgeTile label="Motivations" imgSrc="/motivations.png" dimmed />
          <BadgeTile label="Strengths" imgSrc="/strengths.png" dimmed />
          <BadgeTile label="Skills" imgSrc="/skills.png" dimmed />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            {name.trim() ? `Nice work, ${name.trim()}!` : "Nice work!"}
          </h1>
          <p className="mt-2 text-sm text-slate-200/90 md:text-base">
            Here’s one quick insight from what you shared:
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-6 py-6 shadow-[0_22px_70px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <p className="text-sm leading-relaxed text-slate-100 md:text-base">{insight}</p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="
              inline-flex items-center gap-2 rounded-full
              border border-sky-300/80 bg-sky-400/90 px-6 py-2.5
              text-sm font-semibold text-slate-950
              shadow-[0_0_35px_rgba(56,189,248,0.9)]
              transition hover:bg-sky-300 active:scale-95
            "
          >
            Join Everleap!
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ============================================================
     Render
     ============================================================ */

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="onboarding_orb"
      ambientCap={0.35}
    >
      <div className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`} style={pageBgStyle}>
        {gradientLevel > 0 && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: gradient.ambientOpacity }}>
            <div className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`} />
            <div className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`} />
          </div>
        )}

        <BrandBadge />

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
          <div className="w-full max-w-5xl -translate-y-6">
            <section className="w-full">
              <div className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepId}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    {stepId === "welcome" && renderWelcome()}
                    {stepId === "name" && renderName()}
                    {stepId === "situation" && renderSituation()}
                    {stepId === "certainty" && renderCertainty()}
                    {stepId === "postPlans" && renderPostPlans()}
                    {stepId === "activities" && renderActivities()}
                    {stepId === "fun" && renderFun()}
                    {stepId === "summary" && renderSummary()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </div>
        </main>

        <OnboardingFooterNav />
      </div>
    </AppChrome>
  );
}
