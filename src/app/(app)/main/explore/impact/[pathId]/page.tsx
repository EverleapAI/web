// apps/web/src/app/(app)/main/explore/impact/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Compass,
  ExternalLink,
  HeartHandshake,
  Laptop,
} from "lucide-react";

import { requireImpactPath } from "../_data/impactPaths";
import type {
  ImpactOpportunity,
  ImpactOpportunityGroup as ImpactOpportunityGroupType,
  Rgb as SchemaRgb,
} from "../_data/impactPathSchema";

type Rgb = SchemaRgb;

type ImpactReaction = "liked" | "maybe" | "dismissed";

type ImpactReactionFeedback = {
  reaction: ImpactReaction;
  reasons: string[];
  note: string;
  savedAt: number;
};

type ImpactReactionState = {
  dismissed: string[];
  maybe: string[];
  liked: string[];
  feedbackBySlug?: Record<string, ImpactReactionFeedback>;
};

const IMPACT_REACTIONS_STORAGE_KEY = "everleap.explore.impact.reactions.v1";

function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampScore(score: number) {
  const normalized = score <= 5 ? score * 20 : score;
  return Math.max(0, Math.min(100, normalized));
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

function emptyImpactReactionState(): ImpactReactionState {
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
): Record<string, ImpactReactionFeedback> {
  if (!input || typeof input !== "object") return {};

  const result: Record<string, ImpactReactionFeedback> = {};

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

function readImpactReactionState(): ImpactReactionState {
  if (typeof window === "undefined") return emptyImpactReactionState();

  try {
    const raw = window.localStorage.getItem(IMPACT_REACTIONS_STORAGE_KEY);
    if (!raw) return emptyImpactReactionState();

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      dismissed: normalizeSlugList(parsed.dismissed),
      maybe: normalizeSlugList(parsed.maybe),
      liked: normalizeSlugList(parsed.liked),
      feedbackBySlug: normalizeFeedbackBySlug(parsed.feedbackBySlug),
    };
  } catch {
    return emptyImpactReactionState();
  }
}

function writeImpactReactionState(state: ImpactReactionState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    IMPACT_REACTIONS_STORAGE_KEY,
    JSON.stringify(state)
  );
}

function saveImpactReactionFeedback(args: {
  slug: string;
  reaction: ImpactReaction;
  reasons: string[];
  note: string;
}) {
  const current = readImpactReactionState();

  const next: ImpactReactionState = {
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

  writeImpactReactionState(next);
  return next;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function makeRingPoints(
  total: number,
  cx: number,
  cy: number,
  radius: number
): string {
  return Array.from({ length: total }, (_, index) => {
    const angle = (360 / total) * index;
    const point = polarToCartesian(cx, cy, radius, angle);
    return `${point.x},${point.y}`;
  }).join(" ");
}

function makePolygonPoints(
  values: number[],
  cx: number,
  cy: number,
  maxRadius: number
): string {
  return values
    .map((value, index) => {
      const angle = (360 / values.length) * index;
      const point = polarToCartesian(cx, cy, (value / 100) * maxRadius, angle);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function HeroRadar({
  labels,
  values,
  accent,
  accentStrong,
  glow,
}: {
  labels: string[];
  values: number[];
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
}) {
  const cx = 120;
  const cy = 120;
  const rings = [28, 52, 76, 100];
  const polygonPoints = makePolygonPoints(values, cx, cy, 88);

  return (
    <div className="relative mx-auto w-full max-w-[250px]">
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${rgb(
            glow,
            0.22
          )} 0%, transparent 68%)`,
        }}
      />

      <svg viewBox="0 0 240 240" className="relative z-10 h-auto w-full">
        <defs>
          <linearGradient id="impactRadarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rgb(accent, 1)} />
            <stop offset="100%" stopColor={rgb(accentStrong, 1)} />
          </linearGradient>

          <linearGradient id="impactRadarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rgb(accent, 0.28)} />
            <stop offset="100%" stopColor={rgb(accentStrong, 0.12)} />
          </linearGradient>
        </defs>

        {rings.map((radius) => (
          <polygon
            key={radius}
            points={makeRingPoints(labels.length, cx, cy, radius)}
            fill="none"
            stroke={rgb(accent, radius === 100 ? 0.16 : 0.1)}
            strokeWidth="1"
          />
        ))}

        {labels.map((_, index) => {
          const angle = (360 / labels.length) * index;
          const end = polarToCartesian(cx, cy, 100, angle);
          return (
            <line
              key={index}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke={rgb(accentStrong, 0.1)}
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill="url(#impactRadarFill)"
          stroke="url(#impactRadarStroke)"
          strokeWidth="2.5"
        />

        {values.map((value, index) => {
          const angle = (360 / values.length) * index;
          const point = polarToCartesian(cx, cy, (value / 100) * 88, angle);
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill={rgb(accentStrong, 1)}
              stroke={rgb(glow, 0.95)}
              strokeWidth="2"
            />
          );
        })}

        {labels.map((label, index) => {
          const angle = (360 / labels.length) * index;
          const point = polarToCartesian(cx, cy, 118, angle);

          let textAnchor: "middle" | "start" | "end" = "middle";
          if (point.x < cx - 10) textAnchor = "end";
          if (point.x > cx + 10) textAnchor = "start";

          return (
            <text
              key={`${label}-${index}`}
              x={point.x}
              y={point.y}
              fill="rgba(255,255,255,0.72)"
              fontSize="10"
              textAnchor={textAnchor}
              dominantBaseline="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

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
  accentStrong,
  glow,
  selectedReaction,
  initialReasons,
  initialNote,
  isSaving,
  onSubmit,
}: {
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
  selectedReaction: ImpactReaction | null;
  initialReasons: string[];
  initialNote: string;
  isSaving: boolean;
  onSubmit: (payload: {
    reaction: ImpactReaction;
    reasons: string[];
    note: string;
  }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draftReaction, setDraftReaction] =
    React.useState<ImpactReaction | null>(selectedReaction);
  const [reasons, setReasons] = React.useState<string[]>(initialReasons);
  const [note, setNote] = React.useState(initialNote);

  React.useEffect(() => {
    setDraftReaction(selectedReaction);
    setReasons(initialReasons);
    setNote(initialNote);
  }, [selectedReaction, initialReasons, initialNote]);

  const reactionConfig = React.useMemo(() => {
    const map: Record<
      ImpactReaction,
      {
        title: string;
        helper: string;
        submitLabel: string;
        reasonOptions: string[];
      }
    > = {
      liked: {
        title: "What part feels most true?",
        helper: "Pick a reason or add one quick note. One sentence is enough.",
        submitLabel: "Save",
        reasonOptions: [
          "I like helping this way",
          "This kind of contribution fits me",
          "The vibe feels right",
          "I could see myself doing this",
          "The signal feels real",
        ],
      },
      maybe: {
        title: "What feels close, but not fully there yet?",
        helper:
          "This helps Everleap understand what still needs pressure-testing.",
        submitLabel: "Save",
        reasonOptions: [
          "Interesting but unsure",
          "I need more real examples",
          "I like parts of it",
          "I want to compare it to others",
          "I am not sure it fits my energy",
        ],
      },
      dismissed: {
        title: "What feels off about this one?",
        helper: "Tell Everleap why this path misses, then it will step aside.",
        submitLabel: "Remove this path",
        reasonOptions: [
          "I do not relate to this path",
          "The vibe feels wrong",
          "It feels too draining",
          "Another path fits better",
          "I would not want to keep exploring this",
        ],
      },
    };

    return draftReaction ? map[draftReaction] : null;
  }, [draftReaction]);

  function pickReaction(reaction: ImpactReaction) {
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

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-5 sm:py-5">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 12% 0%, ${rgb(accent, 0.12)} 0%, transparent 28%),
            radial-gradient(circle at 82% 20%, ${rgb(accentStrong, 0.1)} 0%, transparent 24%),
            radial-gradient(circle at 18% 100%, ${rgb(glow, 0.08)} 0%, transparent 30%)
          `,
        }}
      />

      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Quick check
        </div>

        <div className="mt-2 text-[15px] font-semibold tracking-[-0.02em] text-white/94 sm:text-[16px]">
          Does this feel like a kind of impact you could actually enjoy making?
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
                      0.14
                    )} 0%, rgba(255,255,255,0.03) 100%)`
                  : "rgba(255,255,255,0.02)",
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
                  ? rgb(accentStrong, 0.24)
                  : "rgba(255,255,255,0.10)",
              background:
                draftReaction === "maybe"
                  ? `linear-gradient(180deg, ${rgb(
                      accentStrong,
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
          className={cx(
            "overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out",
            open && reactionConfig
              ? "mt-4 max-h-[420px] opacity-100"
              : "mt-0 max-h-0 opacity-0"
          )}
          aria-hidden={!open}
        >
          {reactionConfig ? (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
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
                  onClick={() => setOpen(false)}
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
                          ? rgb(accent, 0.1)
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
                  onClick={() => setOpen(false)}
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
                      0.2
                    )} 0%, ${rgb(accentStrong, 0.1)} 100%)`,
                    border: `1px solid ${rgb(accent, 0.16)}`,
                  }}
                >
                  {reactionConfig.submitLabel}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function OpportunityRow({
  item,
  accent,
  accentStrong,
  isFirst,
}: {
  item: ImpactOpportunity;
  accent: Rgb;
  accentStrong: Rgb;
  isFirst: boolean;
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block py-4 sm:py-4.5"
    >
      {!isFirst ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${rgb(
              accent,
              0.18
            )} 14%, ${rgb(accentStrong, 0.08)} 84%, transparent 100%)`,
          }}
        />
      ) : null}

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="max-w-[40rem] text-[16px] font-semibold leading-[1.14] tracking-[-0.025em] text-white transition group-hover:text-white/96 sm:text-[17px]">
            {item.title}
          </h4>

          <div className="mt-1 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-white/36">
            <span>{item.provider}</span>
            <span>{item.formatLabel}</span>
          </div>

          <p className="mt-2 max-w-[42rem] text-[13px] leading-[1.62] text-white/66 transition group-hover:text-white/74 sm:text-[14px]">
            {item.summary}
          </p>

          <p
            className="mt-2 max-w-[42rem] text-[12px] leading-[1.58]"
            style={{ color: rgb(accentStrong, 0.84) }}
          >
            {item.whyItHelps}
          </p>
        </div>

        <div className="relative mt-1 hidden h-9 w-9 shrink-0 sm:block">
          <div
            className="pointer-events-none absolute inset-0 rounded-full blur-xl"
            style={{
              backgroundColor: rgb(accent, 0.14),
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border text-white/86 transition-transform duration-200 group-hover:translate-x-[1px]"
            style={{
              borderColor: rgb(accent, 0.22),
              backgroundColor: rgb(accentStrong, 0.08),
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </a>
  );
}

function OpportunityGroup({
  title,
  description,
  items,
  accent,
  accentStrong,
  tone,
}: {
  title: string;
  description: string;
  items: ImpactOpportunity[];
  accent: Rgb;
  accentStrong: Rgb;
  tone: "local" | "online";
}) {
  const Icon = tone === "local" ? Compass : Laptop;
  const border = tone === "local" ? accent : accentStrong;

  const background =
    tone === "local"
      ? `
        radial-gradient(circle at 12% 0%, ${rgb(accent, 0.1)} 0%, transparent 32%),
        radial-gradient(circle at 88% 100%, ${rgb(accentStrong, 0.05)} 0%, transparent 26%),
        linear-gradient(180deg, rgba(8,20,18,0.92) 0%, rgba(8,18,18,0.88) 100%)
      `
      : `
        radial-gradient(circle at 88% 0%, ${rgb(accentStrong, 0.1)} 0%, transparent 30%),
        radial-gradient(circle at 10% 100%, ${rgb(accent, 0.05)} 0%, transparent 24%),
        linear-gradient(180deg, rgba(8,16,24,0.92) 0%, rgba(8,14,22,0.88) 100%)
      `;

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border px-5 py-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)] sm:px-6 sm:py-6"
      style={{
        borderColor: rgb(border, 0.18),
        background,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${rgb(
            border,
            0.28
          )} 18%, ${rgb(border, 0.08)} 82%, transparent 100%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-white/92">
          <Icon className="h-4 w-4 text-white/60" />
          <div className="text-[1rem] font-semibold">{title}</div>
        </div>

        {description ? (
          <p className="mt-2 max-w-[44rem] text-[13px] leading-6 text-white/58 sm:text-[14px]">
            {description}
          </p>
        ) : null}

        <div className="mt-4">
          {items.map((item, index) => (
            <OpportunityRow
              key={item.id}
              item={item}
              accent={border}
              accentStrong={accentStrong}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ImpactPathDetailPage() {
  const router = useRouter();
  const params = useParams<{ pathId: string }>();
  const rawPathId = params?.pathId;
  const pathId = Array.isArray(rawPathId) ? rawPathId[0] : rawPathId;

  if (!pathId) notFound();

  const path = React.useMemo(() => {
    try {
      return requireImpactPath(pathId);
    } catch {
      notFound();
    }
  }, [pathId]);

  const [firstName, setFirstName] = React.useState("");
  const [selectedReaction, setSelectedReaction] =
    React.useState<ImpactReaction | null>(null);
  const [savedReasons, setSavedReasons] = React.useState<string[]>([]);
  const [savedNote, setSavedNote] = React.useState("");
  const [isSavingReaction, setIsSavingReaction] = React.useState(false);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());

    const reactions = readImpactReactionState();
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
  const accentStrong = path.theme.accentStrong ?? path.theme.accent;
  const glow = path.theme.glow ?? path.theme.accent;

  const radarLabels = React.useMemo(() => {
    const labels = path.fitSignals
      .slice(0, 5)
      .map((signal) => signal.label)
      .filter(Boolean);

    while (labels.length < 5) {
      labels.push(["people", "care", "energy", "purpose", "momentum"][labels.length]);
    }

    return labels;
  }, [path.fitSignals]);

  const radarValues = React.useMemo(() => {
    const values = path.fitSignals
      .slice(0, 5)
      .map((signal) => clampScore(signal.score));
    while (values.length < 5) values.push(68);
    return values;
  }, [path.fitSignals]);

  const heroPills = React.useMemo(() => {
    const fromPull = path.hero.whyItPullsYouIn.slice(0, 3);
    const fromTraits = path.traitChips
      .slice(0, 3)
      .map((chip) => chip.label)
      .filter(Boolean);

    return Array.from(new Set([...fromPull, ...fromTraits])).slice(0, 4);
  }, [path.hero.whyItPullsYouIn, path.traitChips]);

  const authoredOpportunityGroups = React.useMemo(
    () =>
      path.nextSteps.opportunityGroups.filter(
        (group) => group.items && group.items.length > 0
      ),
    [path.nextSteps.opportunityGroups]
  );

  function inferTone(group: ImpactOpportunityGroupType): "local" | "online" {
    if (group.items.every((item) => item.mode === "virtual")) return "online";
    return "local";
  }

  function handleQuickCheckSubmit(payload: {
    reaction: ImpactReaction;
    reasons: string[];
    note: string;
  }) {
    setIsSavingReaction(true);

    saveImpactReactionFeedback({
      slug: path.slug,
      reaction: payload.reaction,
      reasons: payload.reasons,
      note: payload.note,
    });

    setSelectedReaction(payload.reaction);
    setSavedReasons(payload.reasons);
    setSavedNote(payload.note);

    if (payload.reaction === "dismissed") {
      router.push("/main/explore/impact");
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6">
        <Link
          href="/main/explore/impact"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Impact
        </Link>

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 80% 18%, ${rgb(glow, 0.16)} 0%, transparent 18%),
                radial-gradient(circle at 18% 14%, ${rgb(
                  accentStrong,
                  0.12
                )} 0%, transparent 22%),
                linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 48%)
              `,
            }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-end">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/58">
                <HeartHandshake className="h-3.5 w-3.5 text-white/60" />
                {path.hero.eyebrow}
              </div>

              <h1 className="mt-4 text-[32px] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[40px]">
                {path.hero.title}
              </h1>

              <p
                className="mt-4 max-w-3xl text-[16px] leading-[1.7] sm:text-[17px]"
                style={{ color: rgb(accent, 0.96) }}
              >
                {path.hero.hook}
              </p>

              <p className="mt-4 max-w-3xl text-[14px] leading-[1.75] text-white/74 sm:text-[15px]">
                {firstName
                  ? `${firstName}, this path is not about becoming some perfect helper overnight. It is about noticing whether this kind of contribution gives you energy instead of draining it.`
                  : "This path is not about becoming some perfect helper overnight. It is about noticing whether this kind of contribution gives you energy instead of draining it."}
              </p>

              <p className="mt-4 max-w-3xl text-[14px] leading-[1.75] text-white/66 sm:text-[15px]">
                {path.hero.summary}
              </p>

              {heroPills.length ? (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {heroPills.map((item, index) => (
                    <span
                      key={`${path.id}-hero-pill-${index}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative hidden lg:flex lg:justify-end lg:self-end lg:pb-1">
              <HeroRadar
                labels={radarLabels}
                values={radarValues}
                accent={accent}
                accentStrong={accentStrong}
                glow={glow}
              />
            </div>
          </div>
        </section>

        <QuickCheckCard
          accent={accent}
          accentStrong={accentStrong}
          glow={glow}
          selectedReaction={selectedReaction}
          initialReasons={savedReasons}
          initialNote={savedNote}
          isSaving={isSavingReaction}
          onSubmit={handleQuickCheckSubmit}
        />

        <section className="relative">
          <div className="flex items-center gap-2 text-white/92">
            <ExternalLink className="h-4 w-4 text-white/60" />
            <div className="text-[1rem] font-semibold">Try this for real</div>
          </div>

          <p className="mt-2 max-w-3xl text-[13px] leading-6 text-white/60 sm:text-[14px]">
            {path.nextSteps.summary}
          </p>

          <div className="mt-6 space-y-5">
            {authoredOpportunityGroups.map((group) => (
              <OpportunityGroup
                key={group.id}
                title={group.title}
                description={group.description}
                items={group.items}
                accent={accent}
                accentStrong={accentStrong}
                tone={inferTone(group)}
              />
            ))}

            {authoredOpportunityGroups.length === 0 ? (
              <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[14px] leading-6 text-white/60">
                  No live opportunities are wired into this path yet.
                </p>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}