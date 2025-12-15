// src/app/onboarding/page.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mic, MicOff } from "lucide-react";

import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

/**
 * DOM lib provides SpeechRecognition types in most TS configs.
 * We still need a constructor shape for vendor-prefixed access.
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
   Types & Constants
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

const STORAGE_KEY = "everleapOnboarding_v1";
const BADGES_KEY = "everleapBadges_v1";

/* ============================================================
   Theme / Gradient Toggles
   ============================================================ */

function ThemeToggle({
  activeId,
  onChange,
}: {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
      {INSIGHTS_THEMES.map((theme) => {
        const active = theme.id === activeId;
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`h-5 w-5 rounded-full transition ${
              active
                ? "bg-sky-300 shadow-sm shadow-sky-300/60"
                : "bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            aria-label={theme.label}
            type="button"
          />
        );
      })}
    </div>
  );
}

function GradientToggle({
  activeLevel,
  onChange,
}: {
  activeLevel: GradientLevel;
  onChange: (l: GradientLevel) => void;
}) {
  const levels: GradientLevel[] = [0, 1, 2, 3, 4, 5];
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/80 px-1 py-1 text-[0.65rem] shadow-sm">
      {levels.map((level) => {
        const isActive = level === activeLevel;
        const isZero = level === 0;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`flex items-center justify-center rounded-full transition ${
              isZero
                ? isActive
                  ? "h-4 w-4 border border-amber-300 bg-transparent"
                  : "h-4 w-4 border border-slate-600/80 bg-transparent hover:border-slate-400"
                : isActive
                ? "h-4 w-4 bg-amber-300 shadow-sm shadow-amber-300/60"
                : "h-4 w-4 bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            type="button"
            aria-label={isZero ? "No gradient" : `Gradient level ${level}`}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function isMeaningfulText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 10) return false;
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (!lettersOnly) return false;
  const uniqueChars = new Set(lettersOnly.toLowerCase()).size;
  if (uniqueChars <= 3) return false; // likely keyboard smash
  return true;
}

function buildInsight(options: {
  name: string;
  situation: Situation;
  certainty: Certainty;
  postPlans: PostPlanKey[];
  activities: ActivityKey[];
  activitiesOther: string;
  funChoice: FunChoice;
}) {
  const {
    name,
    situation,
    certainty,
    postPlans,
    activities,
    activitiesOther,
    funChoice,
  } = options;

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
      parts.push(
        `${you}you’re in high school and taking a moment to step back and look at your next steps.`
      );
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
      parts.push(
        `${you}you’re a young adult pausing long enough to reflect, which already puts you ahead of most people rushing on autopilot.`
      );
    }
  } else {
    parts.push(
      `${you}you’re taking a moment to step back and look at where you are and where you might go next.`
    );
  }

  if (postPlans.length > 0) {
    const mapped: string[] = [];
    if (postPlans.includes("job"))
      mapped.push("getting a job and building real-world experience");
    if (postPlans.includes("associates"))
      mapped.push("community or two-year college options");
    if (postPlans.includes("credential"))
      mapped.push("shorter training or credential programs");
    if (postPlans.includes("military")) mapped.push("a path through the military");
    if (postPlans.includes("four_year")) mapped.push("a four-year college path");
    if (postPlans.includes("no_idea"))
      mapped.push("different possibilities without one clear lane yet");

    if (mapped.length > 0) {
      const last = mapped.pop();
      const listText =
        mapped.length === 0
          ? last
          : mapped.join(", ") + (last ? `, and ${last}` : "");
      parts.push(
        `Right now you’re open to ${listText}, which gives you several directions you can test against your strengths and interests.`
      );
    }
  }

  if (activities.length > 0 || isMeaningfulText(activitiesOther)) {
    const act: string[] = [];
    if (activities.includes("sports")) act.push("sports and physical activity");
    if (activities.includes("visual_arts")) act.push("visual or creative arts");
    if (activities.includes("performing_arts"))
      act.push("performing arts and being in front of people");
    if (activities.includes("volunteer")) act.push("volunteering or helping others");
    if (activities.includes("job")) act.push("working a job outside of school");

    const last = act.pop();
    const listText =
      act.length === 0
        ? last
        : act.join(", ") + (last ? `, and ${last}` : "");

    if (listText) {
      parts.push(
        `Outside of school, you’re already investing your time in ${listText}, which says a lot about how you like to use your energy and where you show up for others.`
      );
    }

    if (isMeaningfulText(activitiesOther)) {
      parts.push(
        "Those extra details you shared also hint at experiences that are more unique to you—and Everleap will use them to shape more personalized ideas over time."
      );
    }
  }

  let closing =
    "This is just your starting point. As you keep answering questions and exploring, Everleap will get better at spotting patterns and suggesting paths that actually feel like you.";

  if (funChoice === "cat") {
    closing +=
      " Also, cat person noted—there’s a good chance that independent streak of yours can become a real strength.";
  } else if (funChoice === "dog") {
    closing +=
      " Also, dog person energy usually comes with a big heart and loyalty—great traits for any future path.";
  }

  parts.push(closing);
  return parts.join(" ");
}

/* ============================================================
   Badge tiles (same treatment, different icon + color)
   ============================================================ */

function BadgeTile({
  id,
  label,
  accent,
  dimmed,
}: {
  id: BadgeId;
  label: string;
  accent: string;
  dimmed?: boolean;
}) {
  const opacity = dimmed ? 0.35 : 1;

  return (
    <div className="flex flex-col items-center gap-2" style={{ opacity }}>
      <div
        className="h-20 w-20 rounded-2xl shadow-sm"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.16)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
        aria-label={`${label} badge`}
      >
        <svg viewBox="0 0 96 96" className="h-full w-full" role="img">
          <rect
            x="10"
            y="10"
            width="76"
            height="76"
            rx="18"
            fill="rgba(0,0,0,0.18)"
            stroke={accent}
            strokeWidth="3"
          />

          {id === "onboarding" && (
            <>
              <path
                d="M34 60 L62 32"
                stroke={accent}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M30 64 L38 56"
                stroke={accent}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M63 27 L67 23"
                stroke={accent}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M55 26 L55 18"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M70 41 L78 41"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}

          {id === "motivations" && (
            <>
              <path
                d="M48 68
                   C42 64, 28 55, 28 43
                   C28 36, 33 32, 39 32
                   C43 32, 46 34, 48 37
                   C50 34, 53 32, 57 32
                   C63 32, 68 36, 68 43
                   C68 55, 54 64, 48 68Z"
                fill="rgba(0,0,0,0.10)"
                stroke={accent}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M48 44 L60 40"
                stroke={accent}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="48" cy="44" r="3" fill={accent} opacity="0.95" />
            </>
          )}

          {id === "strengths" && (
            <>
              <path
                d="M34 56
                   C34 48, 40 44, 46 44
                   L50 44
                   C50 40, 53 36, 58 36
                   C62 36, 66 39, 66 44
                   L66 52
                   C66 61, 59 68, 50 68
                   L44 68
                   C38 68, 34 63, 34 56Z"
                fill="rgba(0,0,0,0.10)"
                stroke={accent}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M46 44 C44 50, 45 55, 50 58"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M60 52 C58 55, 56 56, 52 56"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}

          {id === "skills" && (
            <>
              <rect
                x="30"
                y="38"
                width="36"
                height="30"
                rx="8"
                fill="rgba(0,0,0,0.10)"
                stroke={accent}
                strokeWidth="3"
              />
              <path
                d="M40 38
                   C40 32, 44 28, 48 28
                   C52 28, 56 32, 56 38"
                fill="none"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M38 50 L58 50"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="44" cy="50" r="4" fill={accent} />
              <path
                d="M38 60 L58 60"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="54" cy="60" r="4" fill={accent} />
            </>
          )}
        </svg>
      </div>
      <div className="text-xs font-medium text-white/80">{label}</div>
    </div>
  );
}

/* ============================================================
   Main Component
   ============================================================ */

export default function OnboardingPage() {
  const router = useRouter();

  /* Theme + background state */
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];
  const dark = isDarkTheme(themeId);

  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";
  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  /* Conversation state */
  const [stepIndex, setStepIndex] = React.useState(0);
  const stepId = STEPS[stepIndex];

  const [name, setName] = React.useState("");
  const [situation, setSituation] = React.useState<Situation>(null);
  const [certainty, setCertainty] = React.useState<Certainty>(null);
  const [postPlans, setPostPlans] = React.useState<PostPlanKey[]>([]);
  const [activities, setActivities] = React.useState<ActivityKey[]>([]);
  const [activitiesOther, setActivitiesOther] = React.useState("");
  const [funChoice, setFunChoice] = React.useState<FunChoice>(null);

  /* Voice input (fixed) */
  type VoiceTarget = "name" | "activitiesOther";
  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);

  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const activeVoiceTargetRef = React.useRef<VoiceTarget | null>(null);

  const nameInputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const activitiesOtherRef = React.useRef<HTMLTextAreaElement | null>(null);

  /* Save state to localStorage */
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const payload = JSON.stringify({
      stepIndex,
      name,
      situation,
      certainty,
      postPlans,
      activities,
      activitiesOther,
      funChoice,
    });

    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [
    stepIndex,
    name,
    situation,
    certainty,
    postPlans,
    activities,
    activitiesOther,
    funChoice,
  ]);

  /* Speech support flag once */
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
        | SpeechRecognitionConstructor
        | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  /* Stop listening when step changes */
  React.useEffect(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    activeVoiceTargetRef.current = null;
  }, [stepId]);

  /* Cleanup on unmount */
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      recognitionRef.current = null;
      activeVoiceTargetRef.current = null;
    };
  }, []);

  function getOrCreateRecognition(): SpeechRecognition | null {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRec =
      (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
        | SpeechRecognitionConstructor
        | undefined;

    if (!SpeechRec) return null;

    const recognition = new SpeechRec();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0]?.transcript ?? "";
      }
      transcript = transcript.trim();
      if (!transcript) return;

      const target = activeVoiceTargetRef.current;

      if (target === "name") {
        setName((prev) => {
          if (!prev) return transcript;
          const needsSpace = !prev.endsWith(" ");
          return prev + (needsSpace ? " " : "") + transcript;
        });
      } else if (target === "activitiesOther") {
        setActivitiesOther((prev) => {
          if (!prev) return transcript;
          const needsSpace = !prev.endsWith(" ");
          return prev + (needsSpace ? " " : "") + transcript;
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      activeVoiceTargetRef.current = null;
    };

    recognition.onerror = () => {
      setIsListening(false);
      activeVoiceTargetRef.current = null;
    };

    recognitionRef.current = recognition;
    return recognition;
  }

  function stopListening() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
    activeVoiceTargetRef.current = null;
  }

  function toggleMic(target: VoiceTarget) {
    if (typeof window === "undefined") return;

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = getOrCreateRecognition();
    if (!recognition) {
      const ref =
        target === "name" ? nameInputRef.current : activitiesOtherRef.current;
      ref?.focus();
      return;
    }

    try {
      activeVoiceTargetRef.current = target;
      recognition.start();
      setIsListening(true);

      const ref =
        target === "name" ? nameInputRef.current : activitiesOtherRef.current;
      ref?.focus();
    } catch {
      setIsListening(false);
      activeVoiceTargetRef.current = null;
    }
  }

  function goToNextStep() {
    setStepIndex((idx) => (idx < STEPS.length - 1 ? idx + 1 : idx));
  }

  function markOnboardingBadge() {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(BADGES_KEY);
      const existing = raw
        ? (JSON.parse(raw) as Partial<Record<BadgeId, boolean>>)
        : {};
      const updated = { ...existing, onboarding: true };
      window.localStorage.setItem(BADGES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  // Mark badge exactly once when we ENTER summary.
  const didMarkSummaryRef = React.useRef(false);
  React.useEffect(() => {
    if (stepId !== "summary") return;
    if (didMarkSummaryRef.current) return;
    didMarkSummaryRef.current = true;
    markOnboardingBadge();
  }, [stepId]);

  /* ============================================================
     Step Renderers
     ============================================================ */

  function MicButton({ target }: { target: VoiceTarget }) {
    const supported = speechSupported;
    const active = isListening;

    return (
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => toggleMic(target)}
          className={`
            inline-flex h-12 w-12 items-center justify-center
            rounded-full border
            transition-transform transition-shadow
            active:scale-95
            ${
              active
                ? "border-rose-300/90 bg-rose-500/90 shadow-[0_0_50px_rgba(244,63,94,1)]"
                : "border-sky-300/70 bg-slate-900/80 shadow-[0_0_40px_rgba(56,189,248,0.8)] hover:shadow-[0_0_55px_rgba(56,189,248,1)]"
            }
          `}
          aria-label={active ? "Stop voice input" : "Start voice input"}
        >
          {active ? (
            <MicOff className="h-5 w-5 text-slate-50" />
          ) : (
            <Mic className="h-5 w-5 text-slate-50" />
          )}
        </button>

        {!supported && (
          <p className="text-[0.7rem] text-slate-400">
            Voice input not supported here.
          </p>
        )}
      </div>
    );
  }

  function renderWelcome() {
    return (
      <div className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300/90">
          Welcome to Everleap
        </p>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-900/80 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-base md:text-lg leading-relaxed text-slate-100">
            You are starting a journey to better understand yourself and your
            path in life. Think of me as a college &amp; career counselor and
            life coach all in one. I will ask you some questions, but this is
            not a test, rather a conversation. Answer as honestly as you can.
            The more you share, the more you will learn, and the more I can
            provide guidance and insights to you. No right or wrong answers
            here.
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={goToNextStep}
            className="
              inline-flex h-10 w-10 items-center justify-center rounded-full
              border border-sky-300/80 bg-sky-400/90 text-slate-950
              shadow-[0_0_32px_rgba(56,189,248,0.9)]
              hover:bg-sky-300 active:scale-95 transition
            "
            aria-label="Begin"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  function renderName() {
    return (
      <div className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300/90">
          Let&apos;s start simple
        </p>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-900/80 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-base md:text-lg leading-relaxed text-slate-100">
            What name do you go by?
          </p>
        </div>

        <div className="flex items-center justify-center pt-1">
          <MicButton target="name" />
        </div>

        <div className="relative rounded-2xl border border-slate-600/70 bg-slate-950/80 px-4 pb-4 pt-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.9)]">
          <textarea
            ref={nameInputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                goToNextStep();
              }
            }}
            rows={2}
            className="
              w-full bg-transparent
              text-base md:text-lg text-slate-50
              placeholder:text-slate-500
              resize-none outline-none border-none
            "
            placeholder="Say or type your name…"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={goToNextStep}
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                border border-sky-300/70 bg-sky-400/80 text-slate-950
                shadow-[0_0_30px_rgba(56,189,248,0.9)]
                hover:bg-sky-300
                transition active:scale-95
              "
              aria-label="Continue"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderSituation() {
    const greeting = name.trim()
      ? `Nice to meet you, ${name.trim()}. Let’s jump in.`
      : "Nice to meet you. Let’s jump in.";

    const options: { key: Situation; label: string }[] = [
      { key: "high_school", label: "I'm a high school student" },
      { key: "young_adult", label: "I'm a young adult (18–24 years old)" },
    ];

    return (
      <div className="space-y-6">
        <p className="text-xs text-slate-300/90">{greeting}</p>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-900/80 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-base md:text-lg leading-relaxed text-slate-100">
            Which of the following best describes your situation?
          </p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const active = situation === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setSituation(opt.key);
                  goToNextStep();
                }}
                className={`
                  flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left
                  transition shadow-sm
                  ${
                    active
                      ? "border-sky-300/80 bg-slate-900/90 shadow-[0_0_30px_rgba(56,189,248,0.9)]"
                      : "border-slate-600/70 bg-slate-950/70 hover:border-sky-300/70 hover:bg-slate-900/80"
                  }
                `}
              >
                <span className="text-sm md:text-base text-slate-100">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderCertainty() {
    const options: { key: Certainty; label: string }[] = [
      { key: "strong", label: "Strong idea" },
      { key: "kinda", label: "Kind of" },
      { key: "no_clue", label: "No clue" },
    ];

    return (
      <div className="space-y-6">
        <p className="text-xs text-slate-300/90">
          There’s no pressure to have it all figured out.
        </p>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-900/80 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-base md:text-lg leading-relaxed text-slate-100">
            Do you know what you are going to do after high school?
          </p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const active = certainty === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setCertainty(opt.key);
                  goToNextStep();
                }}
                className={`
                  flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left
                  transition shadow-sm
                  ${
                    active
                      ? "border-sky-300/80 bg-slate-900/90 shadow-[0_0_30px_rgba(56,189,248,0.9)]"
                      : "border-slate-600/70 bg-slate-950/70 hover:border-sky-300/70 hover:bg-slate-900/80"
                  }
                `}
              >
                <span className="text-sm md:text-base text-slate-100">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderPostPlans() {
    const options: { key: PostPlanKey; label: string }[] = [
      { key: "job", label: "Get a job" },
      { key: "associates", label: "Associate’s degree" },
      { key: "credential", label: "Credential program" },
      { key: "military", label: "Join military" },
      { key: "four_year", label: "Four-year college" },
      { key: "no_idea", label: "No idea" },
    ];

    const hasSelection = postPlans.length > 0;

    function handleToggle(key: PostPlanKey) {
      if (key === "no_idea") {
        if (postPlans.includes("no_idea")) setPostPlans([]);
        else setPostPlans(["no_idea"]);
        return;
      }

      setPostPlans((prev) => {
        const cleaned = prev.filter((k) => k !== "no_idea");
        return toggleInList(cleaned as PostPlanKey[], key);
      });
    }

    return (
      <div className="space-y-6">
        <p className="text-xs text-slate-300/90">You can pick more than one.</p>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-900/80 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-base md:text-lg leading-relaxed text-slate-100">
            What are you considering after high school?
          </p>
          <p className="mt-1 text-xs text-slate-400">Select all that apply.</p>
        </div>

        <div className="space-y-3">
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
                      : "border-slate-600/70 bg-slate-950/70 hover:border-sky-300/70 hover:bg-slate-900/80"
                  }
                `}
              >
                <span className="text-sm md:text-base text-slate-100">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={goToNextStep}
            disabled={!hasSelection}
            className={`
              inline-flex h-9 w-9 items-center justify-center rounded-full
              border transition active:scale-95
              ${
                hasSelection
                  ? "border-sky-300/70 bg-sky-400/80 text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.9)] hover:bg-sky-300"
                  : "border-slate-600/70 bg-slate-800/80 text-slate-500 opacity-60 cursor-default"
              }
            `}
            aria-label="Continue"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  function renderActivities() {
    const options: { key: ActivityKey; label: string }[] = [
      { key: "sports", label: "Sports" },
      { key: "visual_arts", label: "Visual arts" },
      { key: "performing_arts", label: "Performing arts" },
      { key: "volunteer", label: "Volunteer" },
      { key: "job", label: "Have a job" },
      { key: "other", label: "Other" },
    ];

    const hasSelection =
      activities.length > 0 || activitiesOther.trim().length > 0;
    const showOtherDetails = activities.includes("other");

    function handleToggle(key: ActivityKey) {
      setActivities((prev) => toggleInList(prev, key));
    }

    return (
      <div className="space-y-6">
        <p className="text-xs text-slate-300/90">
          This helps Everleap see more of your world.
        </p>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-900/80 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-base md:text-lg leading-relaxed text-slate-100">
            What kind of things do you do outside of school?
          </p>
          <p className="mt-1 text-xs text-slate-400">Select all that apply.</p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const active = activities.includes(opt.key);
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
                      : "border-slate-600/70 bg-slate-950/70 hover:border-sky-300/70 hover:bg-slate-900/80"
                  }
                `}
              >
                <span className="text-sm md:text-base text-slate-100">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {showOtherDetails && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Share more details (optional):</p>

            <div className="flex items-center justify-center pt-1">
              <MicButton target="activitiesOther" />
            </div>

            <div className="rounded-2xl border border-slate-600/70 bg-slate-950/80 px-4 pb-3 pt-3 shadow-[0_18px_60px_rgba(0,0,0,0.85)]">
              <textarea
                ref={activitiesOtherRef}
                value={activitiesOther}
                onChange={(e) => setActivitiesOther(e.target.value)}
                rows={3}
                className="
                  w-full bg-transparent
                  text-sm md:text-base text-slate-50
                  placeholder:text-slate-500
                  resize-none outline-none border-none
                "
                placeholder="Type here…"
              />
            </div>
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={goToNextStep}
            disabled={!hasSelection}
            className={`
              inline-flex h-9 w-9 items-center justify-center rounded-full
              border transition active:scale-95
              ${
                hasSelection
                  ? "border-sky-300/70 bg-sky-400/80 text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.9)] hover:bg-sky-300"
                  : "border-slate-600/70 bg-slate-800/80 text-slate-500 opacity-60 cursor-default"
              }
            `}
            aria-label="Continue"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  function renderFun() {
    function handleChoose(choice: FunChoice) {
      setFunChoice(choice);
      goToNextStep();
    }

    return (
      <div className="space-y-6">
        <p className="text-xs text-slate-300/90">Last one — just for fun.</p>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-900/80 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-base md:text-lg leading-relaxed text-slate-100">
            Which is best?
          </p>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleChoose("cat")}
            className="
              group flex flex-col items-center justify-center rounded-2xl border
              border-slate-600/70 bg-slate-950/80 p-2
              shadow-[0_18px_55px_rgba(0,0,0,0.85)]
              hover:border-sky-300/80 hover:shadow-[0_0_40px_rgba(56,189,248,0.9)]
              transition
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
            onClick={() => handleChoose("dog")}
            className="
              group flex flex-col items-center justify-center rounded-2xl border
              border-slate-600/70 bg-slate-950/80 p-2
              shadow-[0_18px_55px_rgba(0,0,0,0.85)]
              hover:border-sky-300/80 hover:shadow-[0_0_40px_rgba(56,189,248,0.9)]
              transition
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
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BadgeTile
              id="onboarding"
              label="Onboarding"
              accent="#fbbf24"
              dimmed={false}
            />
            <BadgeTile
              id="motivations"
              label="Motivations"
              accent="#60a5fa"
              dimmed
            />
            <BadgeTile
              id="strengths"
              label="Strengths"
              accent="#34d399"
              dimmed
            />
            <BadgeTile id="skills" label="Skills" accent="#f472b6" dimmed />
          </div>

          <p className="text-xs text-slate-300/80">
            1 of 4 areas unlocked — more will open up as you keep going.
          </p>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            {name.trim() ? `Nice work, ${name.trim()}!` : "Nice work!"}
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-200/90">
            You’ve already started building a clearer picture of where you are
            and where you might go. Here’s one quick insight from what you
            shared:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-600/70 bg-slate-950/80 px-5 py-5 shadow-[0_22px_70px_rgba(0,0,0,0.9)]">
          <p className="text-sm md:text-base leading-relaxed text-slate-100">
            {insight}
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="
              inline-flex items-center gap-2 rounded-full
              border border-sky-300/80 bg-sky-400/90 px-6 py-2.5
              text-sm font-semibold text-slate-950
              shadow-[0_0_35px_rgba(56,189,248,0.9)]
              hover:bg-sky-300 active:scale-95 transition
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
    <div
      className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`}
      style={bgStyle}
    >
      {gradientLevel > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: gradient.ambientOpacity }}
        >
          <div
            className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
          />
          <div
            className={`absolute top-40 -right-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
          />
        </div>
      )}

      <BrandBadge />

      <div className="fixed right-4 top-4 z-50 md:right-6 md:top-6">
        <AiGuideOrb minimal source="onboarding_orb" />
      </div>

      <div className="fixed right-4 top-20 z-40 flex flex-col gap-2 md:right-6 md:top-20 md:flex-row">
        <ThemeToggle activeId={themeId} onChange={setThemeId} />
        <GradientToggle activeLevel={gradientLevel} onChange={setGradientLevel} />
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 pt-10">
        <section className="w-full max-w-3xl">
          <div
            className={`w-full rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardSurface}`}
          >
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
      </main>

      <OnboardingFooterNav />
    </div>
  );
}
