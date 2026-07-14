"use client";

import * as React from "react";
import Image from "next/image";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";

import { OptionLabel, StepEyebrow } from "@/lib/ui/coach";

import {
  type Answers,
  type FlowNode,
  type FlowQuestion,
  getArrayAnswer,
  getTextAnswer,
  toggleArrayAnswer,
} from "../engine/useOnboardingFlow";

type SpeechRecognitionConstructor = {
  new (): SpeechRecognition;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type Props = {
  node: FlowNode | null;
  question: FlowQuestion | null;
  answers: Answers;
  validationMessage?: string | null;
  onAnswer: (questionKey: string, value: string | string[]) => void;
  onAutoAdvance: (nextAnswers?: Answers) => void;
};

const cardSpring = {
  type: "spring",
  stiffness: 360,
  damping: 28,
} as const;

function setAnswerLocal(
  answers: Answers,
  questionKey: string,
  value: string | string[]
): Answers {
  return {
    ...answers,
    [questionKey]: value,
  };
}

function getMaxChoices(node: FlowNode | null) {
  const value = node?.metadata?.max_choices;
  return typeof value === "number" ? value : null;
}

function ValidationNote({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mt-3 text-meta leading-5 text-cyan-100/62"
    >
      {message}
    </motion.div>
  );
}

function InlineMicButton({
  active,
  supported,
  onClick,
}: {
  active: boolean;
  supported: boolean;
  onClick: () => void;
}) {
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Stop listening" : "Use voice input"}
      className={[
        "absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full transition",
        active
          ? "bg-cyan-200/14 text-cyan-50"
          : "bg-white/[0.045] text-white/46 hover:text-white/76",
      ].join(" ")}
    >
      {active ? (
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-100/24"
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.35, 0.08, 0.35],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
        />
      ) : null}

      <Mic className="relative h-[16px] w-[16px]" />
    </button>
  );
}

function ChoiceRowText({
  label,
  selected,
  dimmed,
  compact,
  multi,
  onClick,
}: {
  label: string;
  selected?: boolean;
  dimmed?: boolean;
  compact?: boolean;
  multi?: boolean;
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
        opacity: dimmed ? 0.46 : 1,
      }}
      className={[
        "group relative block w-full overflow-hidden rounded-panel border text-left transition",
        selected
          ? "border-cyan-100/36 bg-cyan-300/[0.105] shadow-[0_0_24px_rgba(103,232,249,0.055)]"
          : "border-white/8 bg-white/[0.026] hover:border-white/15 hover:bg-white/[0.045]",
        compact ? "px-4 py-2.5" : "px-4 py-3",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {multi ? (
          <div
            className={[
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
              selected
                ? "border-cyan-50/70 bg-cyan-50/12"
                : "border-white/18 bg-white/[0.02]",
            ].join(" ")}
          >
            {selected ? (
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-50" />
            ) : null}
          </div>
        ) : null}

        <OptionLabel selected={selected} className="min-w-0 flex-1">
          {label}
        </OptionLabel>
      </div>
    </motion.button>
  );
}

export default function InputRenderer({
  node,
  question,
  answers,
  validationMessage,
  onAnswer,
  onAutoAdvance,
}: Props) {
  const [draft, setDraft] = React.useState("");
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);

  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const lastFinalRef = React.useRef("");

  React.useEffect(() => {
    if (!question) {
      setDraft("");
      return;
    }

    const existing = getTextAnswer(answers, question.key);
    setDraft(existing);

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, [question?.key]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRec = (window.SpeechRecognition ??
      window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;

    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  function getOrCreateRecognition(): SpeechRecognition | null {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRec = (window.SpeechRecognition ??
      window.webkitSpeechRecognition) as
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
        const transcript = (res?.[0]?.transcript ?? "").trim();

        if (!transcript) continue;

        if (res.isFinal) {
          finalChunk += (finalChunk ? " " : "") + transcript;
        }
      }

      const cleaned = finalChunk.trim();

      if (!cleaned) return;
      if (cleaned === lastFinalRef.current) return;

      lastFinalRef.current = cleaned;

      const base = draft.trim();
      const next = base ? `${base} ${cleaned}` : cleaned;

      setDraft(next);

      if (question) {
        onAnswer(question.key, next);
      }
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;

    return rec;
  }

  function toggleMic() {
    textareaRef.current?.focus();
    lastFinalRef.current = "";

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}

      setIsListening(false);
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

  if (!node || !question) return null;

  if (question.inputType === "text") {
    const isName = question.key === "name";

    return (
      <div className="mt-4 w-full max-w-[400px]">
        <div className="mb-2 text-micro leading-4 tracking-title text-white/32">
          Press Enter to continue or use the microphone to speak.
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => {
              const value = event.target.value;

              setDraft(value);
              onAnswer(question.key, value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                const trimmed = draft.trim();

                if (!trimmed) return;

                const nextAnswers = setAnswerLocal(
                  answers,
                  question.key,
                  trimmed
                );

                onAnswer(question.key, trimmed);
                onAutoAdvance(nextAnswers);
              }
            }}
            rows={isName ? 1 : 4}
            placeholder={question.placeholder ?? ""}
            style={{ fontWeight: "var(--read-weight, 400)" }}
            className={[
              "w-full resize-none rounded-panel border border-white/9 bg-white/[0.032]",
              "px-5 py-3.5 pr-16 outline-none transition",
              "text-body leading-6 text-white",
              "placeholder:text-white/25",
              "focus:border-cyan-100/22 focus:bg-white/[0.05]",
              isName ? "min-h-[52px]" : "min-h-[108px]",
            ].join(" ")}
          />

          <InlineMicButton
            active={isListening}
            supported={speechSupported}
            onClick={toggleMic}
          />
        </div>

        {isListening ? (
          <div className="mt-2 text-meta text-cyan-100/56">
            Listening…
          </div>
        ) : null}

        <ValidationNote message={validationMessage} />
      </div>
    );
  }

  if (question.inputType === "single_choice") {
    const selected = getTextAnswer(answers, question.key);

    return (
      <div className="mt-4 w-full max-w-[400px] space-y-2">
        {question.options.map((option) => (
          <ChoiceRowText
            key={option.key}
            label={option.label}
            selected={selected === option.key}
            dimmed={Boolean(selected && selected !== option.key)}
            onClick={() => {
              const nextAnswers = setAnswerLocal(
                answers,
                question.key,
                option.key
              );

              onAnswer(question.key, option.key);

              window.setTimeout(() => {
                onAutoAdvance(nextAnswers);
              }, 180);
            }}
          />
        ))}

        <ValidationNote message={validationMessage} />
      </div>
    );
  }

  if (question.inputType === "multi_choice") {
    const selected = getArrayAnswer(answers, question.key);
    const maxChoices = getMaxChoices(node);

    return (
      <div className="mt-4 w-full max-w-[400px]">
        <div className="mb-3 flex items-center justify-between">
          <StepEyebrow>Select all that apply</StepEyebrow>

          {typeof maxChoices === "number" ? (
            <div className="text-micro text-white/32">
              Up to {maxChoices}
            </div>
          ) : null}
        </div>

        <div className="space-y-1.5">
          {question.options.map((option) => (
            <ChoiceRowText
              key={option.key}
              label={option.label}
              selected={selected.includes(option.key)}
              compact
              multi
              onClick={() => {
                const nextValue = toggleArrayAnswer(
                  selected,
                  option.key,
                  maxChoices
                );

                onAnswer(question.key, nextValue);
              }}
            />
          ))}
        </div>

        <ValidationNote message={validationMessage} />
      </div>
    );
  }

  if (question.inputType === "image_choice") {
    const selected = getTextAnswer(answers, question.key);

    return (
      <div className="mt-4 grid w-full max-w-[400px] grid-cols-2 gap-2.5">
        {question.options.map((option) => {
          const isSelected = selected === option.key;
          const imageUrl = option.image_url ?? option.imageUrl;

          return (
            <motion.button
              key={option.key}
              type="button"
              onClick={() => {
                const nextAnswers = setAnswerLocal(
                  answers,
                  question.key,
                  option.key
                );

                onAnswer(question.key, option.key);

                window.setTimeout(() => {
                  onAutoAdvance(nextAnswers);
                }, 180);
              }}
              whileTap={{ scale: 0.98 }}
              className={[
                "group relative overflow-hidden rounded-panel border transition",
                isSelected
                  ? "border-cyan-100/48"
                  : "border-white/10 hover:border-white/18",
              ].join(" ")}
            >
              <div
                className={[
                  "relative aspect-[1.38/1] overflow-hidden",
                  isSelected ? "ring-2 ring-cyan-100/52" : "",
                ].join(" ")}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={option.label}
                    fill
                    sizes="(max-width: 640px) 44vw, 220px"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute bottom-3 left-3 rounded-full bg-black/32 px-3 py-1 text-meta text-white backdrop-blur-md">
                  {option.label}
                </div>
              </div>
            </motion.button>
          );
        })}

        {validationMessage ? (
          <div className="col-span-2">
            <ValidationNote message={validationMessage} />
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}