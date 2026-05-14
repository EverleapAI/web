"use client";

import * as React from "react";
import Image from "next/image";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";

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

function getSection(node: FlowNode | null) {
  if (!node) return "discovery";

  if (
    node.type === "summary" ||
    node.key === "summary_transition" ||
    node.key === "summary" ||
    node.key === "regauth_transition"
  ) {
    return "transition";
  }

  if (
    node.key === "welcome" ||
    node.key === "how_it_works" ||
    node.key === "what_you_get" ||
    node.key === "progress" ||
    node.key === "lets_get_started"
  ) {
    return "what-is-everleap";
  }

  return "discovery";
}

function ValidationNote({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="mt-3 rounded-2xl border border-cyan-200/12 bg-cyan-950/18 px-4 py-3 text-[13px] leading-5 text-cyan-50/70"
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
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-label={active ? "Stop listening" : "Use voice input"}
      className={[
        "absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border transition",
        active
          ? "border-cyan-100/44 bg-cyan-200/14 text-cyan-50 shadow-[0_0_22px_rgba(103,232,249,0.22)]"
          : "border-white/10 bg-black/14 text-white/48 hover:border-cyan-100/22 hover:text-white/72",
      ].join(" ")}
    >
      {active ? (
        <motion.span
          aria-hidden="true"
          className="absolute h-9 w-9 rounded-full border border-cyan-100/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.32, 0.06, 0.32] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <Mic
        className={[
          "relative transition",
          active ? "h-[17px] w-[17px]" : "h-[15px] w-[15px]",
        ].join(" ")}
      />
    </motion.button>
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
        scale: selected ? 1.005 : 1,
        opacity: dimmed ? 0.42 : 1,
        y: selected ? -1 : 0,
      }}
      className={[
        "group relative block w-full overflow-hidden text-left transition",
        compact
          ? "rounded-[18px] px-3.5 py-3"
          : "rounded-[22px] px-4 py-4",
      ].join(" ")}
    >
      <motion.div
        className={[
          "pointer-events-none absolute inset-0 border transition",
          compact ? "rounded-[18px]" : "rounded-[22px]",
          selected
            ? "border-cyan-50/58 bg-[linear-gradient(180deg,rgba(18,150,166,0.86),rgba(4,104,118,0.92))] shadow-[0_16px_36px_rgba(4,76,89,0.28)]"
            : "border-cyan-200/10 bg-[linear-gradient(180deg,rgba(33,129,144,0.32),rgba(14,87,100,0.42))] group-hover:border-cyan-100/18 group-hover:bg-[linear-gradient(180deg,rgba(48,154,169,0.46),rgba(18,105,118,0.56))]",
        ].join(" ")}
        animate={{ scale: selected ? 1.002 : 1 }}
        transition={cardSpring}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/12 via-white/6 to-transparent" />

      <div className="relative flex items-center gap-3">
        {multi ? (
          <span
            aria-hidden="true"
            className={[
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
              selected
                ? "border-cyan-50/70 bg-cyan-50/14 text-cyan-50"
                : "border-cyan-100/16 bg-black/6 text-transparent",
            ].join(" ")}
          >
            <span className="text-[10px] leading-none">✓</span>
          </span>
        ) : null}

        <div
          className={[
            "min-w-0 flex-1 transition",
            compact
              ? "text-[13.5px] leading-[1.22rem]"
              : "text-[14px] leading-[1.35rem]",
            selected
              ? "font-semibold text-white"
              : "font-medium text-white/82 group-hover:text-white",
          ].join(" ")}
        >
          {label}
        </div>
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

  const section = getSection(node);
  const isWelcome = section === "what-is-everleap";

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

  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
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
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

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
      <div
        className={[
          "w-full transition-all duration-700",
          isWelcome ? "mt-6 sm:mt-8" : "mt-4 sm:mt-5",
        ].join(" ")}
      >
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

                const nextAnswers = setAnswerLocal(
                  answers,
                  question.key,
                  draft
                );

                onAnswer(question.key, draft);
                onAutoAdvance(nextAnswers);
              }
            }}
            rows={isName ? 1 : 3}
            placeholder={question.placeholder ?? ""}
            className={[
              "w-full resize-none rounded-[24px] border outline-none transition",
              "bg-[linear-gradient(180deg,rgba(41,126,142,0.38),rgba(20,77,93,0.56))]",
              "border-cyan-200/12",
              "text-[15px] font-medium leading-6 text-white",
              "placeholder:text-cyan-50/30",
              "shadow-[0_18px_44px_rgba(8,42,56,0.18)]",
              "focus:border-cyan-200/24",
              "focus:bg-[linear-gradient(180deg,rgba(48,139,154,0.46),rgba(23,88,104,0.64))]",
              speechSupported ? "pr-14" : "pr-4",
              isName
                ? "min-h-[54px] px-4 py-3"
                : "min-h-[118px] px-4 py-3.5",
            ].join(" ")}
          />

          <InlineMicButton
            active={isListening}
            supported={speechSupported}
            onClick={toggleMic}
          />
        </div>

        {isListening ? (
          <div className="mt-2 text-[12px] font-medium tracking-[0.04em] text-cyan-100/54">
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
      <div className="mt-4 sm:mt-5 w-full space-y-2.5">
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
              }, 220);
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
      <div className="mt-3.5 sm:mt-4 w-full">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100/46">
            Pick as many as fit.
          </div>

          {typeof maxChoices === "number" ? (
            <div className="shrink-0 text-[11px] font-medium text-white/34">
              Up to {maxChoices}
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
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
      <div className="mt-5 grid w-full grid-cols-2 gap-3">
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
                }, 220);
              }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.975 }}
              animate={{
                scale: isSelected ? 1.01 : 1,
                y: isSelected ? -1 : 0,
                opacity: selected && !isSelected ? 0.58 : 1,
              }}
              transition={cardSpring}
              className="group relative block w-full overflow-hidden rounded-[24px] text-left"
              aria-label={option.label}
            >
              <div
                className={[
                  "relative aspect-[1.38/1] overflow-hidden rounded-[24px] border transition-all duration-300",
                  isSelected
                    ? "border-cyan-50/70 shadow-[0_20px_48px_rgba(10,88,104,0.36)]"
                    : "border-cyan-200/14 group-hover:border-cyan-100/28 group-hover:shadow-[0_16px_38px_rgba(10,88,104,0.22)]",
                ].join(" ")}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={option.label}
                    fill
                    sizes="(max-width: 640px) 44vw, 220px"
                    className={[
                      "object-cover transition duration-300",
                      isSelected
                        ? "scale-[1.03] brightness-[1.08] contrast-[1.04]"
                        : "brightness-[0.92] contrast-[1.02] group-hover:scale-[1.05] group-hover:brightness-[1.04]",
                    ].join(" ")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-cyan-950/40 text-[13px] text-white/70">
                    {option.label}
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.20))]" />

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="inline-flex rounded-full bg-black/28 px-3 py-1 text-[12px] font-semibold text-white/88 backdrop-blur-md">
                    {option.label}
                  </div>
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