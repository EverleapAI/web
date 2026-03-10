"use client";

import * as React from "react";
import { X, Send, ThumbsUp, Minus, ThumbsDown } from "lucide-react";

import type { FeedbackResponse, RecommendationItem } from "../content/contracts";

/* ============================================================================
   Everleap Explore — FeedbackModal (mobile-first)
   - Bottom-sheet style on mobile
   - Captures response + optional comment
   - (Reasons are placeholder only; not wired into store yet)
   - Adds: scroll-lock, safe-area padding, focus, and "unsaved" guard

   Step 1 upgrades (locked spec):
   - More "pop" (stronger dim/blur + subtle lift)
   - Personalized, conversational copy with first name
   - Copy reflects which pill they clicked AND names the recommendation
============================================================================ */

type Props = {
  open: boolean;
  onClose: () => void;

  rec: RecommendationItem | null;
  response: FeedbackResponse | null;

  /** Optional personalization (pass from Explore page/profile) */
  firstName?: string | null;

  onSubmit: (payload: {
    response: FeedbackResponse;
    comment: string | null;
    reasons?: string[];
  }) => void;

  /** Phase 2+: show reason chips (kept off for now) */
  showReasons?: boolean;
};

const REASONS: Array<{ id: string; label: string }> = [
  { id: "too_expensive", label: "Too expensive" },
  { id: "too_time_intensive", label: "Too time-intensive" },
  { id: "too_risky", label: "Too risky" },
  { id: "not_me", label: "Not me" },
  { id: "already_doing_this", label: "Already doing this" },
  { id: "not_now", label: "Not now" },
  { id: "too_vague", label: "Too vague" },
  { id: "too_corporate", label: "Too corporate" },
  { id: "too_social", label: "Too social" },
  { id: "too_solo", label: "Too solo" },
  { id: "other", label: "Other" },
];

function titleFor(response: FeedbackResponse | null) {
  if (response === "agree") return "This fits";
  if (response === "mixed") return "Kinda";
  if (response === "disagree") return "Nope";
  return "Feedback";
}

function iconFor(response: FeedbackResponse | null) {
  if (response === "agree") return <ThumbsUp className="h-4 w-4" />;
  if (response === "mixed") return <Minus className="h-4 w-4" />;
  if (response === "disagree") return <ThumbsDown className="h-4 w-4" />;
  return null;
}

function introFor(
  response: FeedbackResponse | null,
  firstName: string,
  recTitle: string | null
) {
  const name = firstName.trim().length ? firstName.trim() : "there";
  const title = recTitle ?? "this suggestion";

  if (response === "agree") {
    return {
      headline: `Nice, ${name} — this one resonated.`,
      body: `Tell us what we got right about “${title}”. A quick detail helps Everleap double down on the right direction.`,
      promptLabel: "What felt especially right? (optional)",
      placeholder:
        "Example: It matches how I like to work, the pace feels doable, and I can see real progress quickly.",
    };
  }

  if (response === "mixed") {
    return {
      headline: `Got it, ${name} — close, but not quite.`,
      body: `Help us tune “${title}”. What part fits, and what part doesn’t? One sentence is plenty.`,
      promptLabel: "What’s the “almost” part? (optional)",
      placeholder:
        "Example: I like the creative side, but the day-to-day sounds too screen-heavy / not people-facing enough.",
    };
  }

  if (response === "disagree") {
    return {
      headline: `Thanks, ${name} — we missed the mark.`,
      body: `Tell us what we got wrong about “${title}”. Was it the fit, the assumptions, the tone, or something else?`,
      promptLabel: "What did we get wrong? (optional)",
      placeholder:
        "Example: This assumes I want a corporate path — I don’t. I want something more hands-on and local/community-based.",
    };
  }

  return {
    headline: `Quick check, ${name}.`,
    body: recTitle ? `About “${recTitle}”.` : "Share a quick reaction.",
    promptLabel: "Add a comment (optional)",
    placeholder: "What should Everleap know?",
  };
}

function useScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;

    const el = document.documentElement;
    const prevOverflow = el.style.overflow;
    const prevOverscroll = el.style.overscrollBehavior;
    el.style.overflow = "hidden";
    el.style.overscrollBehavior = "none";

    return () => {
      el.style.overflow = prevOverflow;
      el.style.overscrollBehavior = prevOverscroll;
    };
  }, [locked]);
}

export default function FeedbackModal({
  open,
  onClose,
  rec,
  response,
  firstName,
  onSubmit,
  showReasons = false,
}: Props) {
  const [comment, setComment] = React.useState("");
  const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
  const [dirty, setDirty] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  useScrollLock(open);

  React.useEffect(() => {
    if (!open) return;
    setComment("");
    setSelectedReasons([]);
    setDirty(false);

    // focus after paint so mobile keyboard comes up reliably
    const t = window.setTimeout(() => textareaRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      // if they typed something, don't nuke it silently
      if (dirty && comment.trim().length) return;
      onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, dirty, comment]);

  if (!open) return null;

  const safeFirstName = (firstName ?? "").trim();
  const copy = introFor(response, safeFirstName || "there", rec?.title ?? null);

  const rTitle = titleFor(response);
  const canSubmit = Boolean(response) && Boolean(rec);

  function toggleReason(id: string) {
    setSelectedReasons((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      return next;
    });
    setDirty(true);
  }

  function submit() {
    if (!response || !rec) return;
    const trimmed = comment.trim();

    onSubmit({
      response,
      comment: trimmed.length ? trimmed : null,
      reasons: showReasons ? selectedReasons : undefined,
    });
  }

  function requestClose() {
    // Don’t silently discard typed comments.
    if (dirty && comment.trim().length) {
      const ok = window.confirm("Discard your comment?");
      if (!ok) return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop (stronger dim + blur for more "pop") */}
      <button
        type="button"
        aria-label="Close feedback"
        onClick={requestClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
      />

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl">
        <div
          className={[
            // subtle lift/settle animation without extra libs
            "translate-y-0 animate-[everleapSheetIn_160ms_ease-out]",
            "rounded-t-[30px] border border-white/12 bg-slate-950/88 shadow-[0_-24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl",
          ].join(" ")}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3">
            <div className="h-1.5 w-12 rounded-full bg-white/25" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4 sm:px-7">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                  {iconFor(response)}
                </span>
                <div className="text-base font-semibold text-white">{rTitle}</div>
              </div>

              {/* Conversational block */}
              <div className="mt-3">
                <div className="text-[0.95rem] font-semibold leading-snug text-white">
                  {copy.headline}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-white/75">
                  {copy.body}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={requestClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-95"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+22px)] sm:px-7">
            {showReasons ? (
              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  Why this reaction?
                </div>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((r) => {
                    const active = selectedReasons.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleReason(r.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                          active
                            ? "border-white/20 bg-white/15 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              {copy.promptLabel}
            </div>

            <textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setDirty(true);
              }}
              placeholder={copy.placeholder}
              rows={4}
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/15"
            />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-white/45">
                Your feedback helps Everleap recalibrate.
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition active:scale-95 ${
                  canSubmit
                    ? "bg-white text-slate-950 hover:bg-white/90"
                    : "cursor-not-allowed bg-white/15 text-white/55"
                }`}
              >
                Send <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* Local keyframes (scoped) */}
      <style jsx>{`
        @keyframes everleapSheetIn {
          from {
            transform: translateY(10px);
            opacity: 0.96;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
