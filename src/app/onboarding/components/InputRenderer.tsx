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

function setAnswerLocal(answers: Answers, questionKey: string, value: string | string[]): Answers {
  return {
    ...answers,
    [questionKey]: value,
  };
}

function getMaxChoices(node: FlowNode | null) {
  const value = node?.metadata?.max_choices;
  return typeof value === "number" ? value : null;
}

function TalkControl({
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
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.988 }}
      onClick={onClick}
      className={[
        "group mt-4 inline-flex items-center gap-2 rounded-full px-1 py-1 transition",
        active
          ? "text-cyan-50 drop-shadow-[0_0_20px_rgba(103,232,249,0.34)]"
          : "text-white/56 hover:text-white/84",
      ].join(" ")}
    >
      <span
        className={[
          "relative flex h-[18px] w-[18px] items-center justify-center rounded-full transition",
          active ? "bg-cyan-300/18 shadow-[0_0_18px_rgba(103,232,249,0.24)]" : "",
        ].join(" ")}
      >
        <Mic
          className={[
            "transition",
            active ? "h-[15px] w-[15px] scale-[1.08]" : "h-[16px] w-[16px]",
          ].join(" ")}
        />
      </span>

      <span className="relative inline-flex items-center gap-2 text-[15px] font-semibold tracking-[0.02em]">
        {active ? (
          <motion.span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-200"
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.18, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
        {active ? "Listening" : "Talk"}
        <span
          aria-hidden="true"
          className={[
            "absolute -bottom-1 left-0 h-px w-full origin-left rounded-full bg-current transition-transform duration-200",
            active
              ? "scale-x-100 opacity-100"
              : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100",
          ].join(" ")}
        />
      </span>
    </motion.button>
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
      className="group relative block w-full overflow-hidden rounded-[22px] px-4 py-4 text-left"
    >
      <motion.div
        className={[
          "pointer-events-none absolute inset-0 rounded-[22px] border transition",
          selected
            ? "border-cyan-50/72 bg-[linear-gradient(180deg,rgba(18,150,166,0.98),rgba(4,104,118,0.99))] shadow-[0_22px_52px_rgba(4,76,89,0.42)]"
            : "border-cyan-200/18 bg-[linear-gradient(180deg,rgba(33,129,144,0.60),rgba(14,87,100,0.72))] group-hover:border-cyan-100/28 group-hover:bg-[linear-gradient(180deg,rgba(48,154,169,0.78),rgba(18,105,118,0.86))]",
        ].join(" ")}
        animate={{ scale: selected ? 1.004 : 1 }}
        transition={cardSpring}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/16 via-white/10 to-transparent" />
      <div
        className={[
          "relative text-[14px] leading-[1.35rem] transition",
          selected ? "font-semibold text-white" : "font-medium text-white/86 group-hover:text-white",
        ].join(" ")}
      >
        {label}
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
  }, [question?.key, answers, question]);

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
        const transcript = (res?.[0]?.transcript ?? "").trim();

        if (!transcript) continue;
        if (res.isFinal) finalChunk += (finalChunk ? " " : "") + transcript;
      }

      const cleaned = finalChunk.trim();

      if (!cleaned) return;
      if (cleaned === lastFinalRef.current) return;

      lastFinalRef.current = cleaned;

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
    return (
      <div className="mt-7 w-full max-w-[720px] px-5">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              const nextAnswers = setAnswerLocal(answers, question.key, draft);
              onAnswer(question.key, draft);
              onAutoAdvance(nextAnswers);
            }
          }}
          rows={question.key === "name" ? 1 : 3}
          placeholder={question.placeholder ?? ""}
          className="w-full resize-none rounded-[22px] border border-cyan-200/18 bg-[linear-gradient(180deg,rgba(41,126,142,0.58),rgba(20,77,93,0.72))] px-4 py-3 text-[15px] font-medium leading-6 text-white shadow-[0_18px_44px_rgba(8,42,56,0.26)] outline-none placeholder:text-cyan-50/38 focus:border-cyan-200/30"
        />

        {validationMessage ? (
          <div className="mt-3 rounded-2xl border border-cyan-200/18 bg-cyan-950/28 px-4 py-3 text-[13px] leading-5 text-cyan-50/78">
            {validationMessage}
          </div>
        ) : null}

        <TalkControl active={isListening} supported={speechSupported} onClick={toggleMic} />
      </div>
    );
  }

  if (question.inputType === "single_choice") {
    const selected = getTextAnswer(answers, question.key);

    return (
      <div className="mt-7 w-full max-w-[720px] space-y-3 px-5">
        {question.options.map((option) => (
          <ChoiceRowText
            key={option.key}
            label={option.label}
            selected={selected === option.key}
            dimmed={Boolean(selected && selected !== option.key)}
            onClick={() => {
              const nextAnswers = setAnswerLocal(answers, question.key, option.key);
              onAnswer(question.key, option.key);
              window.setTimeout(() => onAutoAdvance(nextAnswers), 220);
            }}
          />
        ))}

        {validationMessage ? (
          <div className="mt-3 rounded-2xl border border-cyan-200/18 bg-cyan-950/28 px-4 py-3 text-[13px] leading-5 text-cyan-50/78">
            {validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  if (question.inputType === "multi_choice") {
    const selected = getArrayAnswer(answers, question.key);
    const maxChoices = getMaxChoices(node);

    return (
      <div className="mt-7 w-full max-w-[720px] space-y-3 px-5">
        {question.options.map((option) => (
          <ChoiceRowText
            key={option.key}
            label={option.label}
            selected={selected.includes(option.key)}
            onClick={() => {
              const nextValue = toggleArrayAnswer(selected, option.key, maxChoices);
              onAnswer(question.key, nextValue);
            }}
          />
        ))}

        {typeof maxChoices === "number" ? (
          <div className="pt-1 text-[12px] leading-5 text-white/44">Pick up to {maxChoices}.</div>
        ) : null}

        {validationMessage ? (
          <div className="mt-3 rounded-2xl border border-cyan-200/18 bg-cyan-950/28 px-4 py-3 text-[13px] leading-5 text-cyan-50/78">
            {validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  if (question.inputType === "image_choice") {
    const selected = getTextAnswer(answers, question.key);

    return (
      <div className="mt-7 grid w-full max-w-[720px] grid-cols-2 gap-3 px-5">
        {question.options.map((option) => {
          const isSelected = selected === option.key;
          const imageUrl = option.image_url ?? option.imageUrl;

          return (
            <motion.button
              key={option.key}
              type="button"
              onClick={() => {
                const nextAnswers = setAnswerLocal(answers, question.key, option.key);
                onAnswer(question.key, option.key);
                window.setTimeout(() => onAutoAdvance(nextAnswers), 220);
              }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.975 }}
              animate={{
                scale: isSelected ? 1.01 : 1,
                y: isSelected ? -1 : 0,
              }}
              transition={cardSpring}
              className="group relative block w-full overflow-hidden rounded-[24px] text-left"
              aria-label={option.label}
            >
              <div
                className={[
                  "relative aspect-[1.38/1] overflow-hidden rounded-[24px] border transition-all duration-300",
                  isSelected
                    ? "border-cyan-50/80 shadow-[0_20px_48px_rgba(10,88,104,0.42)]"
                    : "border-cyan-200/18 group-hover:border-cyan-100/36 group-hover:shadow-[0_16px_38px_rgba(10,88,104,0.24)]",
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
          <div className="col-span-2 mt-3 rounded-2xl border border-cyan-200/18 bg-cyan-950/28 px-4 py-3 text-[13px] leading-5 text-cyan-50/78">
            {validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}