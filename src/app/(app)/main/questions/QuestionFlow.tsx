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
   Typography system
   ============================================================ */

const TYPE = {
  navSecondary: "text-[11px] font-medium uppercase tracking-[0.16em]",
  navPrimary: "text-[14px] font-semibold tracking-[0.01em]",
  headline:
    "text-[1.42rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.68rem]",
  whisper: "text-[12px] leading-[1.2rem] text-white/54",
  input: "text-[14px] font-medium leading-6 text-white",
};

/* ============================================================
   Questions
   ============================================================ */

const MOTIVATIONS_5 = [
  "What usually gives you energy during the day?",
  "When do you feel most focused?",
  "What drains you faster than it should?",
  "What do you naturally get curious about?",
  "What does a “good day” look like for you?",
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
  "What kind of tasks do you avoid—even when you know they matter?",
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
   Completion copy
   ============================================================ */

function completionCopy(cat: Category) {
  if (cat === "motivations") {
    return [
      "This gives us a clearer read on what supports your energy, focus, and day-to-day rhythm.",
      "That helps Everleap avoid generic advice. We can look for paths that fit the way you actually move through life, not just what sounds impressive.",
      "Next, we’ll turn this into a few practical possibilities and small experiments worth trying.",
    ];
  }

  if (cat === "strengths") {
    return [
      "This gives us a better picture of how you tend to show up when you are at your best.",
      "From here, Everleap can look for roles, projects, and communities where those strengths are more likely to be used and noticed.",
      "Next, we’ll turn that into a few grounded directions you can test without pressure.",
    ];
  }

  return [
    "This gives us a more practical read on where you want to grow and what kind of growth might actually feel worth it.",
    "From here, Everleap can suggest skill paths and next steps that feel doable, not overwhelming.",
    "This is a starting point. We’ll keep refining it as we learn more about you.",
  ];
}

/* ============================================================
   Visual helpers
   ============================================================ */

function visualToneForCategory(category: Category) {
  if (category === "motivations") {
    return {
      orbA: "bg-amber-300/22",
      orbB: "bg-cyan-300/18",
      ring: "border-amber-200/16",
      dotDone: "bg-cyan-300/85",
      dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
    };
  }

  if (category === "strengths") {
    return {
      orbA: "bg-cyan-300/20",
      orbB: "bg-teal-300/16",
      ring: "border-cyan-200/16",
      dotDone: "bg-cyan-300/85",
      dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
    };
  }

  return {
    orbA: "bg-violet-400/20",
    orbB: "bg-fuchsia-400/16",
    ring: "border-violet-200/16",
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

function TopProgress({
  label,
  currentIndex,
  total,
  tone,
}: {
  label: string;
  currentIndex: number;
  total: number;
  tone: ReturnType<typeof visualToneForCategory>;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[12px] leading-none text-white/54">{label}</div>
      <ProgressDots currentIndex={currentIndex} total={total} tone={tone} />
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
  bottomLeft,
  bottomRight,
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

      <div
        className={[
          "relative rounded-[28px] border bg-[linear-gradient(180deg,rgba(15,19,33,0.78),rgba(8,11,21,0.84))] shadow-[0_26px_90px_rgba(0,0,0,0.40)] backdrop-blur-[18px]",
          tone.ring,
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/16" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-[62%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,191,130,0.14),transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full bg-white/4 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-violet-400/8 blur-3xl" />

        <div className="relative px-4 pt-2.5 sm:px-5 sm:pt-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {showExit && onExit ? <NavLink label="Exit" onClick={onExit} /> : null}
              {showBack && onBack ? <NavLink label="Back" onClick={onBack} /> : null}
            </div>

            <TopProgress
              label={categoryLabel}
              currentIndex={currentIndex}
              total={total}
              tone={tone}
            />
          </div>

          <div className="pt-3">
            <h1 className={TYPE.headline}>{title}</h1>

            <div className="mt-3">{children}</div>

            <div className="mt-3 flex items-center justify-between gap-3 pb-3.5">
              <div>{bottomLeft ?? <div />}</div>
              <div className="flex items-center gap-6">{bottomRight ?? <div />}</div>
            </div>
          </div>
        </div>
      </div>
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
      <div className="h-px w-44 rounded-full bg-gradient-to-r from-white/26 via-white/12 to-transparent" />
    </motion.div>
  );
}

/* ============================================================
   Component
   ============================================================ */

type ScreenMode = "question" | "final";

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
  const [screenMode, setScreenMode] = React.useState<ScreenMode>("question");

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

  const [showPauseLine, setShowPauseLine] = React.useState(false);
  const [ctaReady, setCtaReady] = React.useState(false);

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
    if (!qId || screenMode !== "question") return;
    stopListening();
    lastFinalRef.current = "";
    const s = loadSaved()[qId];
    setDraft((s?.answer ?? "").trim());
    window.setTimeout(() => focusAnswer(), 0);
  }, [qId, screenMode, stopListening, focusAnswer]);

  React.useEffect(() => {
    if (total === 0) router.push(returnTo);
  }, [total, router, returnTo]);

  React.useEffect(() => {
    if (screenMode !== "final") {
      setShowPauseLine(false);
      setCtaReady(false);
      return;
    }

    const t1 = window.setTimeout(() => setShowPauseLine(true), 450);
    const t2 = window.setTimeout(() => setCtaReady(true), 3000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [screenMode]);

  const completionParagraphs = React.useMemo(
    () => completionCopy(category),
    [category]
  );

  const tone = React.useMemo(() => visualToneForCategory(category), [category]);

  function exitNow() {
    stopListening();
    router.push(returnTo);
  }

  function goBackOne() {
    if (screenMode !== "question") return;
    if (index <= 0) return;
    stopListening();
    setIndex((i) => Math.max(0, i - 1));
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

    if (index + 1 >= total) {
      setScreenMode("final");
      return;
    }

    setIndex((i) => i + 1);
    window.setTimeout(() => focusAnswer(), 50);
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

  const screenKey = screenMode === "final" ? `final_${category}` : qId || "q";

  return (
    <div className="relative flex min-h-[calc(100svh-5.75rem)] flex-1 items-center justify-center px-4 py-4 supports-[height:100dvh]:min-h-[calc(100dvh-5.75rem)] sm:px-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={screenKey}
          initial={{ opacity: 0, y: 16, scale: 0.992, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, scale: 0.995, filter: "blur(8px)" }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="flex w-full items-center justify-center"
        >
          {screenMode === "final" ? (
            <div className="w-full max-w-[520px]">
              <QuestionShell
                title={`That gives us something real${firstName(name) ? `, ${firstName(name)}` : ""}.`}
                tone={tone}
                currentIndex={total - 1}
                total={total}
                categoryLabel={categoryLabel}
                showExit
                onExit={exitNow}
                bottomRight={
                  <ActionLink label="Continue" onClick={exitNow} disabled={!ctaReady} />
                }
              >
                <div className="space-y-4 pt-1">
                  {completionParagraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-[14px] leading-[1.65] text-white/78"
                    >
                      {p}
                    </p>
                  ))}
                  <PauseLine show={showPauseLine} />
                </div>
              </QuestionShell>
            </div>
          ) : (
            <div className="w-full max-w-[520px]">
              <QuestionShell
                title={q?.question ?? ""}
                tone={tone}
                currentIndex={index}
                total={total}
                categoryLabel={categoryLabel}
                showExit
                showBack
                onExit={exitNow}
                onBack={goBackOne}
                bottomLeft={
                  <TalkLink
                    isListening={isListening}
                    speechSupported={speechSupported}
                    onClick={toggleMic}
                  />
                }
                bottomRight={
                  <>
                    <NavLink
                      label="Skip"
                      onClick={() => completeAndAdvance({ skipped: true })}
                    />
                    <ActionLink
                      label="Continue"
                      onClick={() => completeAndAdvance({ skipped: false })}
                      disabled={!draft.trim()}
                    />
                  </>
                }
              >
                <QuestionTextEntry
                  value={draft}
                  onChange={setDraft}
                  onSubmit={() => completeAndAdvance({ skipped: false })}
                  placeholder="Start anywhere."
                  textareaRef={textareaRef}
                />
              </QuestionShell>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}