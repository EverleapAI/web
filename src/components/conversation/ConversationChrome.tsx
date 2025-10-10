"use client";

import * as React from "react";
import ProgressBar from "@/components/site/ProgressBar";
import TypingDots from "./TypingDots";

type Props = {
  /** The conversational prompt/question shown first */
  prompt: React.ReactNode;
  /** Optional supporting line under the prompt */
  subtitle?: React.ReactNode;
  /** The input UI to reveal (text field, choices, etc.) */
  children: React.ReactNode;

  /** Show the input after this many ms (use 0 to show immediately) */
  revealInputAfterMs?: number;
  /** Simulate a short “typing” moment before revealing input */
  withTyping?: boolean;

  /** Fired when the input becomes visible (good place to focus a field) */
  onReady?: () => void;

  /** Optional progress for multi-step flows (0 → 1) */
  progress?: number;
  /** Additional class names for the outer wrapper */
  className?: string;
};

/**
 * ConversationChrome
 * - Mobile-first, centers the prompt and input
 * - Fades/slides the prompt in, then (optionally) shows TypingDots,
 *   then reveals the input area.
 * - If `progress` is provided, shows a ProgressBar above the prompt.
 */
export default function ConversationChrome({
  prompt,
  subtitle,
  children,
  revealInputAfterMs = 450,
  withTyping = true,
  onReady,
  progress,
  className,
}: Props) {
  const [promptIn, setPromptIn] = React.useState(false);
  const [showTyping, setShowTyping] = React.useState(withTyping);
  const [showInput, setShowInput] = React.useState(revealInputAfterMs <= 0);

  // Mount animations
  React.useEffect(() => {
    // prompt enters immediately on mount
    const t1 = requestAnimationFrame(() => setPromptIn(true));

    // typing indicator lives for half the delay (feels snappy)
    let tTyping: number | undefined;
    if (withTyping && revealInputAfterMs > 0) {
      tTyping = window.setTimeout(
        () => setShowTyping(false),
        Math.max(200, revealInputAfterMs * 0.55)
      );
    } else {
      setShowTyping(false);
    }

    // reveal input
    let t2: number | undefined;
    if (revealInputAfterMs > 0) {
      t2 = window.setTimeout(() => {
        setShowInput(true);
        onReady?.();
      }, revealInputAfterMs);
    } else {
      onReady?.();
    }

    return () => {
      cancelAnimationFrame(t1);
      if (tTyping) clearTimeout(tTyping);
      if (t2) clearTimeout(t2);
    };
  }, [withTyping, revealInputAfterMs, onReady]);

  return (
    <section
      className={[
        "mx-auto w-full max-w-md px-4",
        // vertically centered on mobile-first screens
        "min-h-[60svh] grid content-center gap-4",
        className ?? "",
      ].join(" ")}
    >
      {/* ProgressBar (optional, local to the conversation column) */}
      {typeof progress === "number" && (
        <div className="mb-1">
          <ProgressBar value={progress} />
        </div>
      )}

      {/* Prompt */}
      <div
        className={[
          "transition-all duration-300",
          promptIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        ].join(" ")}
      >
        <h1 className="text-2xl font-semibold tracking-tight">{prompt}</h1>
        {subtitle && <p className="mt-2 text-sm opacity-80">{subtitle}</p>}
      </div>

      {/* Typing dots (brief, optional) */}
      {showTyping && (
        <div className="mt-1">
          <TypingDots ariaLabel="Thinking…" />
        </div>
      )}

      {/* Input region */}
      <div
        className={[
          "transition-all duration-300",
          showInput
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
}
