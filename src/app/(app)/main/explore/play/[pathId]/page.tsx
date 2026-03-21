// apps/web/src/app/(app)/main/explore/play/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Radar,
  Sparkles,
} from "lucide-react";

/* =============================================================================
   Types + Storage
============================================================================= */

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type PlayReaction = "liked" | "maybe" | "dismissed";

type PlayReactionFeedback = {
  reaction: PlayReaction;
  reasons: string[];
  note: string;
  savedAt: number;
};

type PlayReactionState = {
  dismissed: string[];
  maybe: string[];
  liked: string[];
  feedbackBySlug?: Record<string, PlayReactionFeedback>;
};

const PLAY_REACTIONS_STORAGE_KEY = "everleap.explore.play.reactions.v1";

/* =============================================================================
   Helpers
============================================================================= */

function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function scoreWidth(score: number) {
  return `${clampScore(score)}%`;
}

function sectionKicker() {
  return "text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40";
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : trimmed;
}

function startCaseFromSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readStoredFirstName(): string {
  if (typeof window === "undefined") return "";

  const candidateKeys = [
    "everleapOnboarding_v4_convo_min",
    "everleap.story.answers.v3",
    "everleap.story.answers.v2",
    "everleap.onboarding.answers",
    "everleap.user.profile",
  ];

  for (const key of candidateKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as Record<string, unknown>;

      const candidates = [
        parsed.firstName,
        parsed.firstname,
        parsed.first_name,
        parsed.name,
        asRecord(parsed.profile)?.firstName,
        asRecord(parsed.profile)?.name,
        asRecord(parsed.answers)?.firstName,
        asRecord(parsed.answers)?.name,
      ];

      for (const value of candidates) {
        const found = asString(value);
        if (found) return found.split(" ")[0];
      }
    } catch {
      // ignore parse issues
    }
  }

  return "";
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickPlayTheme(slug: string) {
  const themes: Array<{
    accent: Rgb;
    accentStrong: Rgb;
    glow: Rgb;
  }> = [
    {
      accent: { r: 121, g: 214, b: 255 },
      accentStrong: { r: 86, g: 174, b: 255 },
      glow: { r: 116, g: 255, b: 220 },
    },
    {
      accent: { r: 255, g: 172, b: 122 },
      accentStrong: { r: 255, g: 128, b: 106 },
      glow: { r: 255, g: 214, b: 120 },
    },
    {
      accent: { r: 178, g: 145, b: 255 },
      accentStrong: { r: 127, g: 108, b: 255 },
      glow: { r: 255, g: 140, b: 216 },
    },
    {
      accent: { r: 108, g: 242, b: 181 },
      accentStrong: { r: 77, g: 208, b: 160 },
      glow: { r: 154, g: 235, b: 255 },
    },
  ];

  return themes[hashString(slug) % themes.length];
}

function buildPlayPath(slug: string) {
  const title = startCaseFromSlug(slug);
  const theme = pickPlayTheme(slug);

  return {
    slug,
    hero: {
      eyebrow: "Play path",
      title,
      hook: `${title} is not just something to pass time. It can become a source of energy, skill, rhythm, and identity.`,
      summary:
        "Play matters because it creates motion without turning everything into pressure. It is one of the clearest places to discover what you naturally return to when nobody is forcing you.",
    },
    theme,
    traitChips: [
      { id: "joy", label: "Joy signal" },
      { id: "energy", label: "Energy builder" },
      { id: "practice", label: "Skill growth" },
      { id: "community", label: "Community potential" },
    ],
    fitSignals: [
      {
        id: "energy",
        label: "It gives energy instead of just taking effort",
        score: 84,
        explanation:
          "Some activities leave you more awake after doing them. That usually matters. It is one of the strongest signs this path could fit your real life, not just your ideal self.",
      },
      {
        id: "repeat",
        label: "You can imagine coming back to it again",
        score: 76,
        explanation:
          "The point is not instant mastery. It is whether this feels repeatable. A good play path keeps creating reasons to return, even when you are still early or awkward at it.",
      },
      {
        id: "identity",
        label: "It could become part of how you see yourself",
        score: 71,
        explanation:
          "Play gets deeper when it starts shaping identity. Not in a heavy way — more like you begin to think, this is something I do, this is one of my places.",
      },
    ],
  };
}

function getOverallSignalScore(
  fitSignals: Array<{ score: number }> | undefined
): number {
  if (!fitSignals?.length) return 72;

  const total = fitSignals.reduce(
    (sum, signal) => sum + clampScore(signal.score),
    0
  );

  return Math.round(total / fitSignals.length);
}

function getSignalLabel(score: number) {
  if (score >= 84) return "Very strong";
  if (score >= 74) return "Strong";
  if (score >= 64) return "Worth exploring";
  return "Possible fit";
}

function getSignalStoryLead(score: number) {
  if (score >= 84) {
    return "This play path is showing up with unusual consistency.";
  }

  if (score >= 74) {
    return "There is a real pattern here, not just a random interest spike.";
  }

  if (score >= 64) {
    return "There is enough here to test in real life, not just admire from a distance.";
  }

  return "This may start quietly, but there is still something here worth checking.";
}

function getPlayAgenticOpening(firstName: string, title: string) {
  const lowerTitle = title.toLowerCase();

  if (firstName) {
    return `${firstName}, this path is not about forcing yourself to be productive all the time. It is about noticing whether ${lowerTitle} makes you feel more alive, more engaged, and more like yourself.`;
  }

  return `This path is not about forcing yourself to be productive all the time. It is about noticing whether ${lowerTitle} makes you feel more alive, more engaged, and more like yourself.`;
}

function emptyPlayReactionState(): PlayReactionState {
  return {
    dismissed: [],
    maybe: [],
    liked: [],
    feedbackBySlug: {},
  };
}

function normalizeSlugList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return Array.from(
    new Set(
      input
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function normalizeFeedbackBySlug(
  input: unknown
): Record<string, PlayReactionFeedback> {
  if (!input || typeof input !== "object") return {};

  const result: Record<string, PlayReactionFeedback> = {};

  for (const [slug, value] of Object.entries(
    input as Record<string, unknown>
  )) {
    if (!slug.trim() || !value || typeof value !== "object") continue;

    const raw = value as Record<string, unknown>;
    const reaction =
      raw.reaction === "liked" ||
      raw.reaction === "maybe" ||
      raw.reaction === "dismissed"
        ? raw.reaction
        : null;

    if (!reaction) continue;

    const reasons = Array.isArray(raw.reasons)
      ? raw.reasons
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const note = typeof raw.note === "string" ? raw.note : "";
    const savedAt =
      typeof raw.savedAt === "number" && Number.isFinite(raw.savedAt)
        ? raw.savedAt
        : Date.now();

    result[slug] = {
      reaction,
      reasons,
      note,
      savedAt,
    };
  }

  return result;
}

function readPlayReactionState(): PlayReactionState {
  if (typeof window === "undefined") return emptyPlayReactionState();

  try {
    const raw = window.localStorage.getItem(PLAY_REACTIONS_STORAGE_KEY);
    if (!raw) return emptyPlayReactionState();

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      dismissed: normalizeSlugList(parsed.dismissed),
      maybe: normalizeSlugList(parsed.maybe),
      liked: normalizeSlugList(parsed.liked),
      feedbackBySlug: normalizeFeedbackBySlug(parsed.feedbackBySlug),
    };
  } catch {
    return emptyPlayReactionState();
  }
}

function writePlayReactionState(state: PlayReactionState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    PLAY_REACTIONS_STORAGE_KEY,
    JSON.stringify(state)
  );
}

function savePlayReactionFeedback(args: {
  slug: string;
  reaction: PlayReaction;
  reasons: string[];
  note: string;
}) {
  const current = readPlayReactionState();

  const next: PlayReactionState = {
    dismissed: current.dismissed.filter((item) => item !== args.slug),
    maybe: current.maybe.filter((item) => item !== args.slug),
    liked: current.liked.filter((item) => item !== args.slug),
    feedbackBySlug: {
      ...(current.feedbackBySlug ?? {}),
    },
  };

  next[args.reaction] = Array.from(new Set([...next[args.reaction], args.slug]));
  next.feedbackBySlug![args.slug] = {
    reaction: args.reaction,
    reasons: Array.from(
      new Set(args.reasons.map((item) => item.trim()).filter(Boolean))
    ),
    note: args.note.trim(),
    savedAt: Date.now(),
  };

  writePlayReactionState(next);
  return next;
}

/* =============================================================================
   Surface Card
============================================================================= */

function SurfaceCard({
  children,
  accent,
  glow,
  className = "",
}: {
  children: React.ReactNode;
  accent: Rgb;
  glow: Rgb;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-[26px] border border-white/10 bg-[#08111d]/88 backdrop-blur-2xl",
        className
      )}
      style={{
        boxShadow: `0 20px 56px rgba(0,0,0,0.28), 0 0 28px ${rgb(glow, 0.08)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            accent,
            0.42
          )} 18%, ${rgb(glow, 0.16)} 75%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-[-28px] top-[-26px] h-28 w-28 rounded-full blur-3xl"
        style={{ background: rgb(glow, 0.08) }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}

/* =============================================================================
   Section Header
============================================================================= */

function SectionHeader({
  icon: Icon,
  kicker,
  title,
  accent,
  description,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  kicker: string;
  title?: string;
  accent: Rgb;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10"
        style={{
          borderColor: rgb(accent, 0.24),
          background: `linear-gradient(180deg, ${rgb(
            accent,
            0.16
          )} 0%, ${rgb(accent, 0.05)} 100%)`,
          boxShadow: `0 0 20px ${rgb(accent, 0.14)}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${rgb(
              accent,
              0.2
            )} 0%, transparent 68%)`,
          }}
        />
        <Icon
          className="relative h-4 w-4 sm:h-[17px] sm:w-[17px]"
          style={{ color: rgb(accent, 0.96) }}
        />
      </div>

      <div className="min-w-0">
        <div className={sectionKicker()}>{kicker}</div>
        {title ? (
          <h2 className="mt-0.5 text-[1.04rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.14rem]">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-0.5 text-[12px] leading-4.5 text-white/56 sm:text-[13px] sm:leading-5">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* =============================================================================
   Hero Emblem
============================================================================= */

function PlayPathHeroEmblem({
  accent,
  accentStrong,
  glow,
}: {
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
}) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 sm:h-24 sm:w-24">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgb(
            glow,
            0.22
          )} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute inset-[18%] rounded-full border"
        style={{ borderColor: rgb(accent, 0.22) }}
      />

      <div
        className="absolute inset-[36%] rounded-full border"
        style={{ borderColor: rgb(accentStrong, 0.16) }}
      />

      <div
        className="absolute left-[24%] top-[28%] h-[8px] w-[8px] rounded-full"
        style={{
          background: rgb(accent, 0.96),
          boxShadow: `0 0 12px ${rgb(accent, 0.45)}`,
        }}
      />

      <div
        className="absolute right-[22%] top-[32%] h-[7px] w-[7px] rounded-full"
        style={{
          background: "white",
          boxShadow: "0 0 8px rgba(255,255,255,0.55)",
        }}
      />

      <div
        className="absolute left-[38%] bottom-[22%] h-[8px] w-[8px] rounded-full"
        style={{
          background: rgb(accentStrong, 0.95),
          boxShadow: `0 0 12px ${rgb(accentStrong, 0.42)}`,
        }}
      />

      <div
        className="absolute left-[28%] top-[40%] h-px w-[24px] rotate-[12deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            accent,
            0.34
          )} 0%, transparent 100%)`,
        }}
      />

      <div
        className="absolute left-[42%] top-[58%] h-px w-[18px] -rotate-[14deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            accentStrong,
            0.28
          )} 0%, transparent 100%)`,
        }}
      />

      <div
        className="absolute bottom-[8%] right-[8%] flex h-7 w-7 items-center justify-center rounded-full border"
        style={{
          borderColor: rgb(accent, 0.18),
          background: rgb(accent, 0.08),
        }}
      >
        <Gamepad2
          className="h-3.5 w-3.5"
          style={{ color: rgb(accent, 0.92) }}
        />
      </div>
    </div>
  );
}

/* =============================================================================
   Hero Inline Signal
============================================================================= */

function HeroInlineSignal({
  score,
  accent,
  glow,
}: {
  score: number;
  accent: Rgb;
  glow: Rgb;
}) {
  const activeBars = Math.max(1, Math.min(5, Math.round(score / 20)));

  return (
    <div
      className="relative inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full border px-3 py-1"
      style={{
        borderColor: rgb(accent, 0.18),
        background:
          "linear-gradient(180deg, rgba(6,16,28,0.88) 0%, rgba(7,14,24,0.68) 100%)",
        boxShadow: `0 8px 20px rgba(0,0,0,0.18), 0 0 18px ${rgb(glow, 0.1)}`,
      }}
    >
      <div className="flex items-end gap-[4px]">
        {[0, 1, 2, 3, 4].map((i) => {
          const isActive = i < activeBars;
          return (
            <span
              key={i}
              className="block w-[5px] rounded-full"
              style={{
                height: `${9 + i * 3}px`,
                background: isActive
                  ? `linear-gradient(180deg, ${rgb(accent, 1)} 0%, ${rgb(
                      glow,
                      0.82
                    )} 100%)`
                  : "rgba(255,255,255,0.12)",
                boxShadow: isActive ? `0 0 10px ${rgb(glow, 0.18)}` : "none",
              }}
            />
          );
        })}
      </div>

      <div className="text-[13px] font-semibold text-white/96">{score}</div>

      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">
        Signal
      </div>
    </div>
  );
}

/* =============================================================================
   Signal Detail Row
============================================================================= */

function SignalDetailRow({
  id,
  label,
  score,
  explanation,
  accent,
  accentStrong,
  glow,
}: {
  id: string;
  label: string;
  score: number;
  explanation: string;
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-t border-white/8 pt-2 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate text-[13px] font-semibold text-white/92">
              {label}
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls={`signal-detail-${id}`}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold text-white/76 transition hover:text-white"
              style={{
                borderColor: open
                  ? rgb(accent, 0.22)
                  : "rgba(255,255,255,0.12)",
                background: open ? rgb(accent, 0.1) : "rgba(255,255,255,0.03)",
                boxShadow: open ? `0 0 12px ${rgb(glow, 0.12)}` : "none",
              }}
            >
              ?
            </button>
          </div>
        </div>

        <div
          className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-white/86"
          style={{
            borderColor: rgb(accentStrong, 0.16),
            background: rgb(accentStrong, 0.07),
          }}
        >
          {score}
        </div>
      </div>

      <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/7">
        <div
          className="h-full rounded-full"
          style={{
            width: scoreWidth(score),
            background: `linear-gradient(90deg, ${rgb(
              accent,
              0.92
            )}, ${rgb(accentStrong, 1)})`,
            boxShadow: `0 0 10px ${rgb(glow, 0.18)}`,
          }}
        />
      </div>

      <div
        id={`signal-detail-${id}`}
        className={[
          "overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out",
          open ? "mt-1.5 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0",
        ].join(" ")}
      >
        <p className="text-[12px] leading-4.5 text-white/58">
          {firstSentence(explanation)}
        </p>
      </div>
    </div>
  );
}

/* =============================================================================
   Quick Check
============================================================================= */

function quickChipClass(isActive: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition active:scale-95",
    isActive
      ? "text-white"
      : "text-white/78 hover:text-white hover:bg-white/[0.06]",
  ].join(" ");
}

function QuickCheckCard({
  accent,
  glow,
  selectedReaction,
  initialReasons,
  initialNote,
  isSaving,
  onSubmit,
}: {
  accent: Rgb;
  glow: Rgb;
  selectedReaction: PlayReaction | null;
  initialReasons: string[];
  initialNote: string;
  isSaving: boolean;
  onSubmit: (payload: {
    reaction: PlayReaction;
    reasons: string[];
    note: string;
  }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draftReaction, setDraftReaction] =
    React.useState<PlayReaction | null>(selectedReaction);
  const [reasons, setReasons] = React.useState<string[]>(initialReasons);
  const [note, setNote] = React.useState(initialNote);

  React.useEffect(() => {
    setDraftReaction(selectedReaction);
    setReasons(initialReasons);
    setNote(initialNote);
  }, [selectedReaction, initialReasons, initialNote]);

  const reactionConfig = React.useMemo(() => {
    const map: Record<
      PlayReaction,
      {
        title: string;
        helper: string;
        submitLabel: string;
        reasonOptions: string[];
      }
    > = {
      liked: {
        title: "What part feels most alive?",
        helper: "Pick a reason or add a quick note. One sentence is enough.",
        submitLabel: "Save",
        reasonOptions: [
          "This looks genuinely fun",
          "The vibe fits me",
          "I could keep coming back to this",
          "It feels energizing",
          "I want to try it for real",
        ],
      },
      maybe: {
        title: "What feels close, but not fully there yet?",
        helper: "This helps Everleap understand what still needs real-world testing.",
        submitLabel: "Save",
        reasonOptions: [
          "Interesting but unsure",
          "I need more real examples",
          "I like parts of it",
          "Not sure it fits my style",
          "Want to compare it to others",
        ],
      },
      dismissed: {
        title: "What feels off about this one?",
        helper: "Tell Everleap why this path misses, then it will step aside.",
        submitLabel: "Remove this path",
        reasonOptions: [
          "I do not relate to this path",
          "The vibe feels wrong",
          "I would not stick with it",
          "Another path fits better",
          "It does not feel energizing",
        ],
      },
    };

    return draftReaction ? map[draftReaction] : null;
  }, [draftReaction]);

  function pickReaction(reaction: PlayReaction) {
    setDraftReaction(reaction);
    setOpen(true);

    if (reaction !== selectedReaction) {
      setReasons([]);
      setNote("");
    }
  }

  function toggleReason(reason: string) {
    setReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason]
    );
  }

  function handleSubmit() {
    if (!draftReaction) return;
    onSubmit({
      reaction: draftReaction,
      reasons,
      note,
    });
    setOpen(false);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <section
      className="relative overflow-hidden rounded-[24px] border border-emerald-300/12 bg-[#08130f]/90 px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5"
      style={{
        boxShadow: `0 18px 48px rgba(0,0,0,0.22), 0 0 24px ${rgb(glow, 0.08)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            accent,
            0.36
          )} 24%, ${rgb(glow, 0.14)} 78%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 12% 0%, ${rgb(accent, 0.14)} 0%, transparent 28%),
            radial-gradient(circle at 88% 8%, ${rgb(glow, 0.14)} 0%, transparent 26%),
            linear-gradient(90deg, rgba(16,52,41,0.16) 0%, rgba(6,18,18,0) 36%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute right-[-28px] top-[-14px] h-28 w-28 rounded-full blur-3xl"
        style={{ background: rgb(glow, 0.12) }}
      />

      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Quick check
        </div>

        <div className="mt-2 text-[15px] font-semibold tracking-[-0.02em] text-white/94 sm:text-[16px]">
          Does this feel like the kind of play you would actually come back to?
        </div>

        <p className="mt-1 text-[12px] leading-5.5 text-white/56 sm:text-[13px]">
          This is not a test. It just helps Everleap sharpen what it shows next.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => pickReaction("liked")}
            className={quickChipClass(draftReaction === "liked")}
            style={{
              borderColor:
                draftReaction === "liked"
                  ? rgb(accent, 0.3)
                  : "rgba(255,255,255,0.10)",
              background:
                draftReaction === "liked"
                  ? `linear-gradient(180deg, ${rgb(
                      accent,
                      0.16
                    )} 0%, rgba(255,255,255,0.03) 100%)`
                  : "rgba(255,255,255,0.02)",
              boxShadow:
                draftReaction === "liked"
                  ? `0 0 22px ${rgb(glow, 0.14)}`
                  : "none",
            }}
          >
            <span aria-hidden>👍</span>
            <span>Yes, this feels right</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => pickReaction("maybe")}
            className={quickChipClass(draftReaction === "maybe")}
            style={{
              borderColor:
                draftReaction === "maybe"
                  ? rgb(accent, 0.26)
                  : "rgba(255,255,255,0.10)",
              background:
                draftReaction === "maybe"
                  ? `linear-gradient(180deg, ${rgb(
                      accent,
                      0.12
                    )} 0%, rgba(255,255,255,0.03) 100%)`
                  : "rgba(255,255,255,0.02)",
            }}
          >
            <span aria-hidden>🙂</span>
            <span>Maybe</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => pickReaction("dismissed")}
            className={quickChipClass(draftReaction === "dismissed")}
            style={{
              borderColor:
                draftReaction === "dismissed"
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.10)",
              background:
                draftReaction === "dismissed"
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.02)",
            }}
          >
            <span aria-hidden>👎</span>
            <span>No, not for me</span>
          </button>
        </div>

        <div
          className={[
            "overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out",
            open && reactionConfig
              ? "mt-4 max-h-[420px] opacity-100"
              : "mt-0 max-h-0 opacity-0",
          ].join(" ")}
          aria-hidden={!open}
        >
          {reactionConfig ? (
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 12% 0%, ${rgb(
                      accent,
                      0.1
                    )} 0%, transparent 34%),
                    radial-gradient(circle at 88% 0%, ${rgb(
                      glow,
                      0.08
                    )} 0%, transparent 30%)
                  `,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-white/92">
                      {reactionConfig.title}
                    </div>
                    <p className="mt-1 text-[12px] leading-5 text-white/56">
                      {reactionConfig.helper}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="h-9 shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[12px] font-semibold text-white/76 transition hover:bg-white/[0.07]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {reactionConfig.reasonOptions.map((reason) => {
                    const active = reasons.includes(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => toggleReason(reason)}
                        className="rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
                        style={{
                          borderColor: active
                            ? rgb(accent, 0.24)
                            : "rgba(255,255,255,0.10)",
                          background: active
                            ? rgb(accent, 0.12)
                            : "rgba(255,255,255,0.03)",
                          color: active
                            ? "rgba(255,255,255,0.96)"
                            : "rgba(255,255,255,0.74)",
                        }}
                      >
                        {reason}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    placeholder="Anything else that feels important?"
                    className="w-full resize-none rounded-[18px] border border-white/10 bg-black/12 px-4 py-3 text-[13px] leading-5.5 text-white outline-none placeholder:text-white/28 focus:border-white/16"
                  />
                  <div className="mt-2 text-[11px] text-white/38">
                    One sentence is enough.
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="h-10 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[13px] font-semibold text-white/72 transition hover:bg-white/[0.06]"
                  >
                    Skip note
                  </button>

                  <button
                    type="button"
                    disabled={isSaving || !draftReaction}
                    onClick={handleSubmit}
                    className="h-10 rounded-2xl px-4 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-45"
                    style={{
                      background: `linear-gradient(180deg, ${rgb(
                        accent,
                        0.24
                      )} 0%, ${rgb(accent, 0.12)} 100%)`,
                      border: `1px solid ${rgb(accent, 0.18)}`,
                      boxShadow: `0 12px 28px ${rgb(glow, 0.14)}`,
                    }}
                  >
                    {reactionConfig.submitLabel}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function PlayPathPage() {
  const router = useRouter();
  const params = useParams<{ pathId: string }>();
  const pathId = typeof params?.pathId === "string" ? params.pathId : "";

  if (!pathId) notFound();

  const path = React.useMemo(() => buildPlayPath(pathId), [pathId]);

  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] =
    React.useState<PlayReaction | null>(null);
  const [savedReasons, setSavedReasons] = React.useState<string[]>([]);
  const [savedNote, setSavedNote] = React.useState("");
  const [isSavingReaction, setIsSavingReaction] = React.useState(false);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());

    const reactions = readPlayReactionState();
    const savedFeedback = reactions.feedbackBySlug?.[path.slug];

    if (reactions.dismissed.includes(path.slug)) {
      setSelectedReaction("dismissed");
    } else if (reactions.liked.includes(path.slug)) {
      setSelectedReaction("liked");
    } else if (reactions.maybe.includes(path.slug)) {
      setSelectedReaction("maybe");
    } else {
      setSelectedReaction(null);
    }

    setSavedReasons(savedFeedback?.reasons ?? []);
    setSavedNote(savedFeedback?.note ?? "");
  }, [path.slug]);

  const accent = path.theme.accent;
  const accentStrong = path.theme.accentStrong;
  const glow = path.theme.glow;

  const overallSignalScore = React.useMemo(
    () => getOverallSignalScore(path.fitSignals),
    [path.fitSignals]
  );

  const signalLabel = React.useMemo(
    () => getSignalLabel(overallSignalScore),
    [overallSignalScore]
  );

  const heroStoryLead = React.useMemo(
    () => getSignalStoryLead(overallSignalScore),
    [overallSignalScore]
  );

  const agenticOpening = React.useMemo(
    () => getPlayAgenticOpening(firstName ?? "", path.hero.title),
    [firstName, path.hero.title]
  );

  const fitSignalIntro = React.useMemo(() => {
    const topSignal = [...path.fitSignals].sort((a, b) => b.score - a.score)[0];
    if (!topSignal) {
      return "A few smaller signals are clustering around this path.";
    }
    return `${topSignal.label} is one of the clearest reasons this play path is surfacing right now.`;
  }, [path.fitSignals]);

  function handleQuickCheckSubmit(payload: {
    reaction: PlayReaction;
    reasons: string[];
    note: string;
  }) {
    setIsSavingReaction(true);

    savePlayReactionFeedback({
      slug: path.slug,
      reaction: payload.reaction,
      reasons: payload.reasons,
      note: payload.note,
    });

    setSelectedReaction(payload.reaction);
    setSavedReasons(payload.reasons);
    setSavedNote(payload.note);

    if (payload.reaction === "dismissed") {
      router.push("/main/explore/play");
      return;
    }

    setIsSavingReaction(false);
  }

  React.useEffect(() => {
    if (selectedReaction !== "dismissed") {
      setIsSavingReaction(false);
    }
  }, [selectedReaction]);

  return (
    <main className="relative text-white">
      <div className="flex w-full flex-col gap-5 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/main/explore/play"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Play
        </Link>

        <SurfaceCard
          accent={accent}
          glow={glow}
          className="px-4 py-4 sm:px-5 sm:py-5"
        >
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-36 w-40 rounded-full blur-3xl"
            style={{ background: rgb(accent, 0.12) }}
          />
          <div
            className="pointer-events-none absolute right-[18%] top-[-24px] h-28 w-40 rounded-full blur-3xl"
            style={{ background: rgb(accentStrong, 0.08) }}
          />
          <div
            className="pointer-events-none absolute right-10 top-0 h-24 w-32 rounded-full blur-3xl"
            style={{ background: rgb(glow, 0.08) }}
          />

          <PlayPathHeroEmblem
            accent={accent}
            accentStrong={accentStrong}
            glow={glow}
          />

          <div className="pr-14 sm:pr-20">
            <div className={sectionKicker()}>{path.hero.eyebrow}</div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="max-w-[11ch] text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white/97 sm:max-w-none sm:text-[2.35rem]">
                {path.hero.title}
              </h1>

              <HeroInlineSignal
                score={overallSignalScore}
                accent={accent}
                glow={glow}
              />
            </div>

            <div className="mt-1.5 text-[12px] uppercase tracking-[0.16em] text-white/42">
              {signalLabel}
            </div>

            <p className="mt-3 text-[1rem] leading-6.5 text-white/80 sm:text-[1.06rem]">
              {path.hero.hook}
            </p>

            <div className="mt-3 space-y-3 text-[14px] leading-6 text-white/62 sm:text-[15px]">
              <p>{path.hero.summary}</p>
              <p>
                {heroStoryLead} {agenticOpening}
              </p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={accentStrong}
          glow={glow}
          className="px-4 py-3 sm:px-5 sm:py-3.5"
        >
          <div
            className="pointer-events-none absolute -left-8 top-0 h-28 w-28 rounded-full blur-3xl"
            style={{ background: rgb(accentStrong, 0.11) }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-28 w-36 rounded-full blur-3xl"
            style={{ background: rgb(glow, 0.08) }}
          />

          <SectionHeader
            icon={Radar}
            kicker="Why this could fit"
            title="A quick read on the match"
            description={fitSignalIntro}
            accent={accentStrong}
          />

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {path.traitChips.map((chip) => (
              <span
                key={chip.id}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/74"
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="mt-2.5 space-y-2.5">
            {path.fitSignals.map((signal) => (
              <SignalDetailRow
                key={signal.id}
                id={signal.id}
                label={signal.label}
                score={signal.score}
                explanation={signal.explanation}
                accent={accent}
                accentStrong={accentStrong}
                glow={glow}
              />
            ))}
          </div>
        </SurfaceCard>

        <QuickCheckCard
          accent={accent}
          glow={glow}
          selectedReaction={selectedReaction}
          initialReasons={savedReasons}
          initialNote={savedNote}
          isSaving={isSavingReaction}
          onSubmit={handleQuickCheckSubmit}
        />

        <SurfaceCard
          accent={glow}
          glow={accentStrong}
          className="px-5 py-5 sm:px-6 sm:py-6"
        >
          <div
            className="pointer-events-none absolute -left-8 top-[-10px] h-28 w-32 rounded-full blur-3xl"
            style={{ background: rgb(accent, 0.12) }}
          />
          <div
            className="pointer-events-none absolute right-[-18px] top-[-18px] h-32 w-36 rounded-full blur-3xl"
            style={{ background: rgb(accentStrong, 0.12) }}
          />
          <div
            className="pointer-events-none absolute right-[14%] bottom-[-22px] h-24 w-40 rounded-full blur-3xl"
            style={{ background: rgb(glow, 0.08) }}
          />

          <div className={sectionKicker()}>Play payoff</div>

          <h2 className="mt-1.5 text-[1.12rem] font-semibold tracking-[-0.03em] text-white/96 sm:text-[1.24rem]">
            This is where play turns into a real path
          </h2>

          <p className="mt-2 max-w-[58ch] text-[13px] leading-5.5 text-white/62 sm:text-[14px] sm:leading-6">
            Soon this lane will open the real version of this path — how people
            begin, what early progress feels like, where community shows up, and
            how fun grows into skill over time.
          </p>

          <div className="group mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-white/46">
            <span>Play opportunities coming soon</span>
            <ArrowRight className="h-4 w-4" />
          </div>

          <p className="mt-3 text-[12px] leading-5 text-white/42 sm:text-[13px]">
            For now, this page is aligned to the new detail-page system so the
            lane is ready for real content next.
          </p>
        </SurfaceCard>
      </div>
    </main>
  );
}