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

const userName = "Tom";

type GuideState = {
  open: boolean;
  line: string;
  source?: string;
  suggestedGoals?: GuideSourceDetail["suggestedGoals"];
};

function greetingFromSource(source?: string): string {
  if (!source) {
    return `Hi ${userName}, let’s pick one thing to focus on that would actually help.`;
  }

  if (source.startsWith("actions_page")) {
    return `Hi ${userName}, you’re on the Actions & habits page. Let’s turn a goal or insight into a repeatable action.`;
  }

  if (source.startsWith("goals_page")) {
    return `Hi ${userName}, you’re on the Goals page. Let’s find one small goal that fits your energy today.`;
  }

  if (source.startsWith("notifications_page")) {
    return `Hi ${userName}, you’re on the Notifications page. Let’s sort through what actually matters.`;
  }

  if (source.startsWith("spotlight_")) {
    return `Hi ${userName}, you’re on the Spotlight page. Let’s choose one next step together.`;
  }

  if (source.includes("questions")) {
    return `Hi ${userName}, you’re in your Story flow. Want to talk about something you shared?`;
  }

  if (source.includes("carousel") || source.includes("youmap")) {
    return `Hi ${userName}, you’re exploring your profile. Let’s unpack what feels true or interesting.`;
  }

  return `Hi ${userName}, let’s pick one thing to focus on that would actually help.`;
}

function placeholderResponse(input: string, source?: string): string {
  const trimmed = input.trim();

  if (source?.startsWith("goals_page")) {
    return `Got it, ${userName}. We can shape that into a small, realistic goal instead of a huge project.`;
  }

  if (source?.startsWith("actions_page")) {
    return `Thanks, ${userName}. Let’s turn that into one tiny action you could actually try this week, not a full system.`;
  }

  if (source?.startsWith("notifications_page")) {
    return `I hear you, ${userName}. Let’s focus on the one update here that would reduce stress the most.`;
  }

  if (source?.includes("questions")) {
    return `Thanks for sharing that, ${userName}. There’s a lot in what you just said—we can slow down and unpack it one piece at a time.`;
  }

  if (source?.includes("carousel") || source?.includes("youmap")) {
    return `That helps, ${userName}. Let’s connect what you just said to how your profile is reading you so far.`;
  }

  return `Got it, ${userName}. Let’s stay with this for a moment and see what would actually help you next.`;
}

export function AiGuideHost() {
  const [state, setState] = useState<GuideState>({
    open: false,
    line: greetingFromSource(undefined),
  });

  const [input, setInput] = useState("");
  const [isFading, setIsFading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px";
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  };

  const runFadeToLine = (nextLine: string) => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

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
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    setState((prev) => ({ ...prev, open: false }));
    setInput("");
    resetTextareaHeight();
    setIsFading(false);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<GuideSourceDetail>;
      const detail = custom.detail || {};
      const line = greetingFromSource(detail.source);

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }

      setState({
        open: true,
        line,
        source: detail.source,
        suggestedGoals: detail.suggestedGoals,
      });

      setInput("");
      resetTextareaHeight();
      setIsFading(false);
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
    <div
      className="
        fixed inset-0 z-[9999] flex items-center justify-center
        bg-slate-950/70 backdrop-blur-sm
      "
    >
      {/* Click-outside overlay */}
      <button
        type="button"
        aria-label="Close guide overlay"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
      />

      {/* Centered guide card, sized & styled like Story panel */}
      <div
        className="
          relative z-10 w-full max-w-3xl mx-4
          rounded-[36px] border border-slate-700/80
          bg-slate-950/95 shadow-[0_40px_120px_rgba(0,0,0,0.95)]
          px-6 py-6 sm:px-9 sm:py-7
        "
      >
        {/* Glow behind card */}
        <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-br from-sky-500/30 via-fuchsia-500/22 to-amber-400/24 blur-3xl opacity-80" />

        <div className="relative flex flex-col gap-4">
          {/* Header: orb + label + close */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* HAL orb */}
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-sky-500/25 blur-md animate-pulse" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 shadow-[0_0_45px_rgba(56,189,248,0.95)]">
                  <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500" />
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-950">
                    <Sparkles className="h-4 w-4 text-sky-300" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300">
                  Everleap guide
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-full bg-slate-900/80 text-slate-400
                hover:text-slate-100 hover:bg-slate-800
              "
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Conversation line with fade */}
          <p
            className={`
              text-sm sm:text-base text-slate-100
              transition-opacity duration-200
              ${isFading ? "opacity-0" : "opacity-100"}
            `}
          >
            {state.line}
          </p>

          {/* Big gradient-framed text area, mirroring Story page */}
          <form onSubmit={handleSubmit} className="mt-1 space-y-2">
            <div className="relative rounded-[32px] bg-gradient-to-br from-sky-500/60 via-fuchsia-500/60 to-amber-400/60 p-[1px]">
              <div className="relative flex items-end gap-3 rounded-[32px] bg-slate-950/85 px-4 py-3 sm:px-5 sm:py-4">
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

                <div className="flex flex-col items-center gap-2 pb-1">
                  <button
                    type="button"
                    className="
                      inline-flex h-9 w-9 items-center justify-center
                      rounded-full bg-slate-900/90 border border-slate-600
                      text-slate-100 shadow-lg shadow-slate-950/70
                      hover:bg-slate-800 active:scale-95 transition
                    "
                    aria-label="Speak instead"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
