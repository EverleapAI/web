"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import VoiceField from "@/components/site/VoiceField";
import RequireConsent from "@/components/site/RequireConsent";
import ConversationChrome from "@/components/conversation/ConversationChrome";

type AnswerRecord = {
  id: string;               // e.g. "q:first"
  type: "open";
  value: string;
  answeredAtUtc: string;    // ISO
};

const ANSWERS_KEY = "everleap.answers";
const QUESTION_ID = "q:first";

function saveAnswer(record: AnswerRecord | null) {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    const list: AnswerRecord[] = raw ? JSON.parse(raw) : [];
    const next = list.filter((r) => r.id !== QUESTION_ID);
    if (record) next.push(record);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

export default function FirstQuestionPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // conversational staging flags (for subtle local fades)
  const [showPrompt, setShowPrompt] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // load any prior answer + stage the UI
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ANSWERS_KEY);
      if (raw) {
        const list: AnswerRecord[] = JSON.parse(raw);
        const prior = list.find((r) => r.id === QUESTION_ID);
        if (prior?.value) setValue(prior.value);
      }
    } catch {
      // ignore
    }

    const t1 = window.setTimeout(() => setShowPrompt(true), 100);
    const t2 = window.setTimeout(() => setShowContent(true), 260);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  function submitIfValid() {
    if (submitting) return;
    const v = value.trim();
    if (!v) return;
    setSubmitting(true);
    saveAnswer({
      id: QUESTION_ID,
      type: "open",
      value: v,
      answeredAtUtc: new Date().toISOString(),
    });
    router.push("/dashboard");
  }

  function onSkip() {
    if (submitting) return;
    setSubmitting(true);
    saveAnswer(null);
    router.push("/dashboard");
  }

  // local fade helpers to keep your existing look
  const promptClass =
    "transition-all duration-300 " +
    (showPrompt ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1");

  const sectionClass =
    "mt-4 space-y-5 transition-all duration-300 " +
    (showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1");

  return (
    <RequireConsent>
      {/* Header and footer anchored; conversation area is centered */}
      <div className="min-h-dvh bg-app flex flex-col">
        <SiteHeader />
        <main className="flex-1 grid place-items-center px-4">
          <ConversationChrome
            progress={0.15}
            prompt={
              <span className={promptClass}>
                What motivates you most right now?
              </span>
            }
          >
            <section className={sectionClass}>
              <div className="rounded-2xl card-surface p-3">
                <label className="sr-only" htmlFor="q-first">
                  Your answer
                </label>
                <VoiceField
                  id="q-first"
                  placeholder="e.g. Learning new things and helping others"
                  value={value}
                  autoFocus
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                  onMicResult={(text: string) => setValue(text)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && value.trim()) submitIfValid();
                  }}
                  onBlur={() => value.trim() && submitIfValid()}
                />
                <p className="mt-2 text-micro opacity-70 pl-1">
                  Press Enter to continue, or tap the mic to speak.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={submitIfValid}
                  disabled={!value.trim() || submitting}
                  className="flex-1 rounded-xl bg-[rgb(var(--accent-rgb))] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm ring-1 ring-black/5 transition-transform hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  disabled={submitting}
                  className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-sm ring-1 ring-black/10 bg-white/80 transition-transform hover:bg-white active:scale-[0.99] disabled:opacity-60"
                >
                  Skip for now
                </button>
              </div>

              <p className="text-micro opacity-70">
                You can return and change your answer anytime.
              </p>
            </section>
          </ConversationChrome>
        </main>
        <SiteFooter />
      </div>
    </RequireConsent>
  );
}
