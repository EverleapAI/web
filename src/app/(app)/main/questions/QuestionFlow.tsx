"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   Types
   ============================================================ */

type Category = "motivations" | "strengths" | "skills";
type CategoryLabel = "Motivations" | "Strengths" | "Skills";

type QA = {
  id: string;
  category: Category;
  question: string;
};

type Saved = { answer?: string; skipped?: boolean };

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
   Constants
   ============================================================ */

const STORAGE_KEY_V3 = "everleap.story.answers.v3";
const ONBOARDING_KEY_PRIMARY = "everleapOnboarding_v4_convo_min";
const ONBOARDING_KEY_FALLBACK = "everleapOnboarding_v1";

/* ============================================================
   Typography
   ============================================================ */

const TYPE = {
  navSecondary: "text-[11px] font-medium uppercase tracking-[0.16em]",
  headline:
    "text-[1.42rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.68rem]",
  input: "text-[14px] font-medium leading-6 text-white",
  whisper: "text-[12px] leading-[1.2rem] text-white/54",
};

/* ============================================================
   Questions
   ============================================================ */

const MOTIVATIONS_5 = [
  "What usually gives you energy during the day?",
  "When do you feel most focused?",
  "What drains you faster than it should?",
  "What do you naturally get curious about?",
  "What does a good day look like for you?",
];

const STRENGTHS_5 = [
  "What kind of people bring out your best?",
  "What’s something you’re proud of that most people don’t see?",
  "When do friends come to you for help?",
  "What do you learn faster than most people?",
  "What’s a challenge you’ve handled better than you expected?",
];

const SKILLS_5 = [
  "What’s a skill you’d like to level up this year?",
  "What do you like doing so much you lose track of time?",
  "What kind of tasks do you avoid even when you know they matter?",
  "What’s one habit that would make your life easier if you improved it?",
  "If you could get really good at one thing, what would you pick?",
];

const QUESTIONS_ALL: QA[] = [
  ...MOTIVATIONS_5.map((q, i) => ({
    id: `motivations_${i + 1}`,
    category: "motivations" as const,
    question: q,
  })),
  ...STRENGTHS_5.map((q, i) => ({
    id: `strengths_${i + 1}`,
    category: "strengths" as const,
    question: q,
  })),
  ...SKILLS_5.map((q, i) => ({
    id: `skills_${i + 1}`,
    category: "skills" as const,
    question: q,
  })),
];

/* ============================================================
   Storage helpers
   ============================================================ */

function loadSaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_V3);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, Saved>;
  } catch {
    return {};
  }
}

function saveOne(id: string, payload: Saved) {
  if (typeof window === "undefined") return;
  const current = loadSaved();
  current[id] = payload;
  try {
    window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(current));
  } catch {}
}

function readNameFromOnboarding(): string {
  if (typeof window === "undefined") return "";

  const tryRead = (key: string): string => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return "";
      const parsed = JSON.parse(raw) as { name?: string } | null;
      return (parsed?.name ?? "").trim();
    } catch {
      return "";
    }
  };

  const primary = tryRead(ONBOARDING_KEY_PRIMARY);
  if (primary) return primary;

  return tryRead(ONBOARDING_KEY_FALLBACK);
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

/* ============================================================
   Category helpers
   ============================================================ */

function normalizeCategory(raw: string | null): Category {
  const v = (raw ?? "").toLowerCase().trim();
  if (v === "motivations") return "motivations";
  if (v === "strengths") return "strengths";
  if (v === "skills") return "skills";
  return "motivations";
}

function labelForCategory(cat: Category): CategoryLabel {
  if (cat === "motivations") return "Motivations";
  if (cat === "strengths") return "Strengths";
  return "Skills";
}

function safeReturnTo(raw: string | null): string {
  const v = (raw ?? "").trim();
  if (!v) return "/main";
  if (!v.startsWith("/")) return "/main";
  if (v.startsWith("//")) return "/main";
  return v;
}

/* ============================================================
   Visual helpers
   ============================================================ */

function visualToneForCategory(category: Category) {
  if (category === "motivations") {
    return {
      orbA: "bg-amber-300/18",
      orbB: "bg-cyan-300/14",
      dotDone: "bg-cyan-300/85",
      dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
    };
  }

  if (category === "strengths") {
    return {
      orbA: "bg-cyan-300/16",
      orbB: "bg-teal-300/14",
      dotDone: "bg-cyan-300/85",
      dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
    };
  }

  return {
    orbA: "bg-violet-400/16",
    orbB: "bg-fuchsia-400/14",
    dotDone: "bg-cyan-300/85",
    dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
  };
}

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
  currentIndex,
  total,
  tone,
}: {
  currentIndex: number;
  total: number;
  tone: ReturnType<typeof visualToneForCategory>;
}) {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <span
            key={index}
            className={[
              "block rounded-full transition-all duration-300",
              isActive ? "h-2.5 w-2.5" : "h-2 w-2",
              isActive
                ? tone.dotActive
                : isDone
                  ? tone.dotDone
                  : "bg-white/20",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

function QuestionTextEntry({
  value,
  onChange,
  onSubmit,
  placeholder,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={3}
        placeholder={placeholder ?? ""}
        className={[
          TYPE.input,
          "w-full resize-none rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))] px-4 py-2.5 outline-none placeholder:text-white/34 shadow-[0_10px_30px_rgba(4,8,18,0.22)]",
        ].join(" ")}
      />
    </div>
  );
}

function QuestionShell({
  title,
  children,
  tone,
  currentIndex,
  total,
  categoryLabel,
  showExit,
  showBack,
  onExit,
  onBack,
}: {
  title: string;
  children: React.ReactNode;
  tone: ReturnType<typeof visualToneForCategory>;
  currentIndex: number;
  total: number;
  categoryLabel: string;
  showExit?: boolean;
  showBack?: boolean;
  onExit?: () => void;
  onBack?: () => void;
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {showExit && onExit ? <NavLink label="Exit" onClick={onExit} /> : null}
              {showBack && onBack ? <NavLink label="Back" onClick={onBack} /> : null}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[12px] leading-none text-white/54">{categoryLabel}</div>
              <ProgressDots currentIndex={currentIndex} total={total} tone={tone} />
            </div>
          </div>

          <div className="pt-3">
            <h1 className={TYPE.headline}>{title}</h1>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Component
   ============================================================ */

export default function QuestionFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const category = normalizeCategory(params?.get("cat"));
  const categoryLabel = labelForCategory(category);
  const returnTo = safeReturnTo(params?.get("returnTo"));

  const questions = React.useMemo(
    () => QUESTIONS_ALL.filter((q) => q.category === category),
    [category]
  );

  const total = questions.length;

  const [name, setName] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [draft, setDraft] = React.useState("");

  const q = questions[index] ?? questions[0];
  const qId = q?.id ?? "";

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const focusAnswer = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    try {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    } catch {}
  }, []);

  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastFinalRef = React.useRef<string>("");

  const stopListening = React.useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setIsListening(false);
  }, []);

  React.useEffect(() => {
    setName(readNameFromOnboarding());
  }, []);

  React.useEffect(() => {
    const SpeechRec = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  React.useEffect(() => {
    if (!qId) return;
    stopListening();
    lastFinalRef.current = "";
    const s = loadSaved()[qId];
    setDraft((s?.answer ?? "").trim());
    window.setTimeout(() => focusAnswer(), 0);
  }, [qId, stopListening, focusAnswer]);

  React.useEffect(() => {
    if (total === 0) router.push(returnTo);
  }, [total, router, returnTo]);

  function exitNow() {
    stopListening();
    router.push(returnTo);
  }

  function goBackOne() {
    if (index <= 0) return;
    stopListening();
    setIndex((i) => Math.max(0, i - 1));
  }

  function advanceToNext() {
    if (index + 1 >= total) {
      stopListening();
      router.push(returnTo);
      return;
    }

    setIndex((i) => i + 1);
    window.setTimeout(() => focusAnswer(), 50);
  }

  function completeAndAdvance(opts: { skipped: boolean }) {
    if (!q) return;

    const text = draft.trim();

    if (!opts.skipped) {
      if (!text) return;
      if (!isMeaningfulText(text)) {
        setDraft("");
        focusAnswer();
        return;
      }
    }

    saveOne(q.id, opts.skipped ? { skipped: true } : { answer: text, skipped: false });
    stopListening();
    setDraft("");
    advanceToNext();
  }

  function toggleMic() {
    focusAnswer();
    lastFinalRef.current = "";

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRec = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0]?.transcript ?? "";
      }

      const cleaned = finalChunk.trim();
      if (!cleaned || cleaned === lastFinalRef.current) return;

      lastFinalRef.current = cleaned;
      setDraft((prev) => (prev ? `${prev} ${cleaned}` : cleaned));
    };

    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    recognitionRef.current = rec;
    setIsListening(true);

    try {
      rec.start();
    } catch {
      setIsListening(false);
    }
  }

  const screenKey = qId || "q";
  const tone = visualToneForCategory(category);
  const greetingName = firstName(name);

  return (
    <div className="relative flex min-h-[calc(100svh-5.75rem)] flex-1 flex-col supports-[height:100dvh]:min-h-[calc(100dvh-5.75rem)]">
      <div className="flex flex-1 items-start justify-center px-[20px] pt-[30px] pb-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, y: 20, scale: 0.992, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, scale: 0.994, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.9 }}
            className="flex w-full items-center justify-center"
          >
            <QuestionShell
              title={q?.question ?? ""}
              tone={tone}
              currentIndex={index}
              total={total}
              categoryLabel={categoryLabel}
              showExit

              onExit={exitNow}
              onBack={goBackOne}
            >
              <QuestionTextEntry
                value={draft}
                onChange={setDraft}
                onSubmit={() => completeAndAdvance({ skipped: false })}
                placeholder={
                  greetingName && index === 0
                    ? `Start anywhere, ${greetingName}.`
                    : "Start anywhere."
                }
                textareaRef={textareaRef}
              />
            </QuestionShell>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {index > 0 ? (
            <BottomAction label="Back" onClick={goBackOne} muted />
          ) : null}

          <BottomAction
            label="Talk"
            onClick={toggleMic}
            disabled={!speechSupported}
            priority="primary"
            icon={
              isListening ? (
                <MicOff className="h-[18px] w-[18px]" />
              ) : (
                <Mic className="h-[18px] w-[18px]" />
              )
            }
          />

          <BottomAction
            label="Skip"
            onClick={() => completeAndAdvance({ skipped: true })}
            muted
          />

          <BottomAction
            label="Continue"
            onClick={() => completeAndAdvance({ skipped: false })}
            disabled={!draft.trim()}
            priority="primary"
          />
        </div>
      </div>
    </div>
  );
}