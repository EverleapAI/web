// src/components/main/AiGuideHost.tsx
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { Mic, X, Sparkles } from "lucide-react";

type GuideSourceDetail = {
  source?: string;
  suggestedGoals?: Array<{
    id: string;
    title: string;
    style?: string;
    description?: string;
  }>;
};

// ✅ removed unused userName constant (was causing lint warning)

type GuideState = {
  open: boolean;
  line: string;
  source?: string;
  suggestedGoals?: GuideSourceDetail["suggestedGoals"];
};

function greetingFromSource(source?: string): string {
  if (!source) {
    return "Hi — what’s on your mind right now?";
  }

  if (source.startsWith("actions_page")) {
    return "You’re on Actions. Want to turn something into one tiny, repeatable step?";
  }

  if (source.startsWith("goals_page")) {
    return "You’re on Goals. What would feel like a meaningful win this week?";
  }

  if (source.startsWith("notifications_page")) {
    return "You’re on Notifications. Want to sort what matters vs. what can wait?";
  }

  if (source.startsWith("spotlight_")) {
    return "What would actually help right now?";
  }

  if (source.includes("questions")) {
    return "Want to talk about something you just answered?";
  }

  if (source.includes("carousel") || source.includes("youmap")) {
    return "Anything here feel true… or totally off?";
  }

  return "What would actually help right now?";
}

function placeholderResponse(input: string, source?: string): string {
  const t = input.trim();

  if (source?.startsWith("goals_page")) {
    return "Got it. Want to make that smaller and more realistic—like a 10-minute version?";
  }

  if (source?.startsWith("actions_page")) {
    return "Okay. What’s the smallest action you could do once—just to start momentum?";
  }

  if (source?.startsWith("notifications_page")) {
    return "I hear you. Which one thing here would reduce stress the most if it were handled?";
  }

  if (source?.includes("questions")) {
    return "Thanks for sharing. What part of that feels most important to you right now?";
  }

  if (source?.includes("carousel") || source?.includes("youmap")) {
    return "That helps. What part feels most accurate—or most surprising?";
  }

  return t.length < 6
    ? "Want to say a bit more, or should I ask you a simpler question?"
    : "Got it. What’s the next tiny step that would make this feel lighter?";
}

export function AiGuideHost() {
  const [state, setState] = useState<GuideState>({
    open: false,
    line: greetingFromSource(undefined),
  });

  const [input, setInput] = useState("");
  const [isFading, setIsFading] = useState(false);
  const [listening, setListening] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTextareaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "80px";
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  };

  const runFadeToLine = (nextLine: string) => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    setIsFading(true);
    fadeTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, line: nextLine }));
      setIsFading(false);
    }, 180);
  };

  const submitMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const response = placeholderResponse(trimmed, state.source);
    setInput("");
    resetTextareaHeight();
    runFadeToLine(response);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleClose = useCallback(() => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    setState((prev) => ({ ...prev, open: false }));
    setInput("");
    resetTextareaHeight();
    setIsFading(false);
    setListening(false);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<GuideSourceDetail>;
      const detail = custom.detail || {};
      const line = greetingFromSource(detail.source);

      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

      setState({
        open: true,
        line,
        source: detail.source,
        suggestedGoals: detail.suggestedGoals,
      });

      setInput("");
      resetTextareaHeight();
      setIsFading(false);
      setListening(false);
    };

    window.addEventListener("everleap-open-ai-guide", handler as EventListener);
    return () => {
      window.removeEventListener(
        "everleap-open-ai-guide",
        handler as EventListener
      );
    };
  }, []);

  if (!state.open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      {/* Click-outside overlay */}
      <button
        type="button"
        aria-label="Close guide overlay"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
      />

      {/* Centered guide card */}
      <div
        className="
          relative z-10 w-full max-w-3xl mx-4
          rounded-card border border-slate-700/80
          bg-slate-950/95 shadow-[0_40px_120px_rgba(0,0,0,0.95)]
          px-6 py-6 sm:px-9 sm:py-7
        "
      >
        {/* Glow behind card */}
        <div className="pointer-events-none absolute inset-0 rounded-card bg-gradient-to-br from-sky-500/30 via-fuchsia-500/22 to-amber-400/24 blur-3xl opacity-80" />

        <div className="relative flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-sky-500/25 blur-md animate-pulse" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 shadow-[0_0_45px_rgba(56,189,248,0.95)]">
                  <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500" />
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-950">
                    <Sparkles className="h-4 w-4 text-sky-300" />
                  </div>
                </div>
              </div>

              <p className="text-[0.7rem] font-semibold uppercase tracking-eyebrow text-slate-300">
                Everleap guide
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-full bg-slate-900/80 text-slate-400
                hover:text-slate-100 hover:bg-slate-800
              "
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Conversation line */}
          <p
            className={`
              text-sm sm:text-base text-slate-100
              transition-opacity duration-200
              ${isFading ? "opacity-0" : "opacity-100"}
            `}
          >
            {state.line}
          </p>

          {/* Input bubble */}
          <form onSubmit={handleSubmit} className="mt-1 space-y-2">
            <div className="relative rounded-card bg-gradient-to-br from-sky-500/60 via-fuchsia-500/60 to-amber-400/60 p-[1px]">
              <div className="relative flex items-end gap-3 rounded-card bg-slate-950/85 px-4 py-3 sm:px-5 sm:py-4">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  rows={3}
                  className="
                    flex-1 bg-transparent text-sm sm:text-base text-slate-50
                    leading-snug resize-none border-none
                    focus:outline-none
                    min-h-[80px]
                  "
                />

                <button
                  type="button"
                  onClick={() => setListening((p) => !p)} // still mock; keep parity with UI
                  className={`
                    inline-flex h-11 w-11 items-center justify-center rounded-full border
                    transition active:scale-95
                    ${
                      listening
                        ? "border-rose-300/60 bg-rose-500/15 text-rose-100 shadow-[0_0_24px_rgba(244,63,94,0.35)]"
                        : "border-white/15 bg-slate-950/35 text-slate-100 hover:border-sky-300/60 hover:bg-slate-950/50"
                    }
                  `}
                  aria-label={listening ? "Stop listening" : "Start listening"}
                  title={listening ? "Listening…" : "Talk instead of typing"}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
