"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Briefcase,
  CalendarClock,
  Compass,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { requireWorkPath } from "../_data/workPaths";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "../_data/getWorkAgenticOpening";

/* =============================================================================
   Types + Storage
============================================================================= */

type WorkReaction = "liked" | "maybe" | "dismissed";

type WorkReactionFeedback = {
  reaction: WorkReaction;
  reasons: string[];
  note: string;
  savedAt: number;
};

type WorkReactionState = {
  dismissed: string[];
  maybe: string[];
  liked: string[];
  feedbackBySlug?: Record<string, WorkReactionFeedback>;
};

type LiveOpportunityPreview = {
  id: string;
  title: string;
  href: string;
  note: string;
  mode: "local" | "remote";
};

type LiveOpportunityPair = {
  local: LiveOpportunityPreview | null;
  remote: LiveOpportunityPreview | null;
};

const WORK_REACTIONS_STORAGE_KEY = "everleap.explore.work.reactions.v1";

/* =============================================================================
   Helpers
============================================================================= */

function rgb(value: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${value.r},${value.g},${value.b},${alpha})`;
}

function pageShell() {
  return "flex w-full flex-col gap-4 px-2 pb-24 pt-2 sm:gap-5 sm:px-4 sm:pt-3 md:px-6 lg:gap-6 lg:px-8 lg:pt-5 xl:px-10";
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
    return "This one is surfacing with unusual consistency.";
  }

  if (score >= 74) {
    return "There is a real pattern here, not just a random spark.";
  }

  if (score >= 64) {
    return "There is enough here to take seriously and test in real life.";
  }

  return "This may be less obvious at first, but it still has something worth checking.";
}

function emptyWorkReactionState(): WorkReactionState {
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
): Record<string, WorkReactionFeedback> {
  if (!input || typeof input !== "object") return {};

  const result: Record<string, WorkReactionFeedback> = {};

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

function readWorkReactionState(): WorkReactionState {
  if (typeof window === "undefined") return emptyWorkReactionState();

  try {
    const raw = window.localStorage.getItem(WORK_REACTIONS_STORAGE_KEY);
    if (!raw) return emptyWorkReactionState();

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      dismissed: normalizeSlugList(parsed.dismissed),
      maybe: normalizeSlugList(parsed.maybe),
      liked: normalizeSlugList(parsed.liked),
      feedbackBySlug: normalizeFeedbackBySlug(parsed.feedbackBySlug),
    };
  } catch {
    return emptyWorkReactionState();
  }
}

function writeWorkReactionState(state: WorkReactionState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    WORK_REACTIONS_STORAGE_KEY,
    JSON.stringify(state)
  );
}

function saveWorkReactionFeedback(args: {
  slug: string;
  reaction: WorkReaction;
  reasons: string[];
  note: string;
}) {
  const current = readWorkReactionState();

  const next: WorkReactionState = {
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

  writeWorkReactionState(next);
  return next;
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

function isUsableHref(href: string | null) {
  if (!href) return false;
  return href.trim() !== "#" && href.trim() !== "";
}

function extractOpportunityPair(path: unknown): LiveOpportunityPair {
  const nextStepsV2 = asRecord(
    asRecord(path as Record<string, unknown>)?.nextStepsV2
  );
  const rawSections = nextStepsV2?.sections;

  if (!Array.isArray(rawSections)) {
    return { local: null, remote: null };
  }

  const sections = rawSections
    .map((section) => asRecord(section))
    .filter((section): section is Record<string, unknown> => Boolean(section));

  function pickFromSection(
    mode: "local" | "remote"
  ): LiveOpportunityPreview | null {
    const section =
      sections.find((item) => asString(item.mode) === mode) ??
      sections.find((item) => asString(item.id) === mode);

    if (!section) return null;

    const rawItems = section.items;
    if (!Array.isArray(rawItems)) return null;

    for (const item of rawItems) {
      const record = asRecord(item);
      if (!record) continue;

      const title = asString(record.title);
      const href = asString(record.href);
      const note = asString(record.note);
      const itemMode = asString(record.mode);

      if (!title || !note || !isUsableHref(href)) continue;
      if (itemMode && itemMode !== mode) continue;

      return {
        id: asString(record.id) ?? `${mode}-${title}`,
        title,
        href: href!,
        note,
        mode,
      };
    }

    return null;
  }

  return {
    local: pickFromSection("local"),
    remote: pickFromSection("remote"),
  };
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
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-[#08111d]/88 backdrop-blur-2xl ${className}`}
      style={{
        boxShadow: `0 20px 56px rgba(0,0,0,0.28), 0 0 28px ${rgb(
          glow,
          0.08
        )}`,
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
  accent: { r: number; g: number; b: number };
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative mt-[2px] h-4 w-4 shrink-0">
        <div
          className="pointer-events-none absolute inset-[-7px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${rgb(
              accent,
              0.2
            )} 0%, transparent 72%)`,
            filter: "blur(7px)",
          }}
        />
        <Icon
          className="relative h-4 w-4"
          style={{ color: rgb(accent, 0.94) }}
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

function WorkPathHeroEmblem({
  accent,
  accentStrong,
  glow,
}: {
  accent: { r: number; g: number; b: number };
  accentStrong: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
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
        className="absolute left-[28%] top-[30%] h-[8px] w-[8px] rounded-full"
        style={{
          background: rgb(accent, 0.96),
          boxShadow: `0 0 12px ${rgb(accent, 0.45)}`,
        }}
      />

      <div
        className="absolute right-[22%] top-[34%] h-[7px] w-[7px] rounded-full"
        style={{
          background: "white",
          boxShadow: "0 0 8px rgba(255,255,255,0.55)",
        }}
      />

      <div
        className="absolute left-[36%] bottom-[24%] h-[8px] w-[8px] rounded-full"
        style={{
          background: rgb(accentStrong, 0.95),
          boxShadow: `0 0 12px ${rgb(accentStrong, 0.42)}`,
        }}
      />

      <div
        className="absolute left-[36%] top-[36%] h-px w-[18px] rotate-[22deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            accent,
            0.34
          )} 0%, transparent 100%)`,
        }}
      />

      <div
        className="absolute left-[40%] top-[56%] h-px w-[20px] -rotate-[18deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            accentStrong,
            0.28
          )} 0%, transparent 100%)`,
        }}
      />
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
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
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
  accent: { r: number; g: number; b: number };
  accentStrong: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
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
          open ? "mt-1.5 max-h-20 opacity-100" : "mt-0 max-h-0 opacity-0",
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
   Try This For Real
============================================================================= */

function OpportunityPreviewRow({
  item,
  accent,
  glow,
  isFirst,
}: {
  item: LiveOpportunityPreview;
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  isFirst: boolean;
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block py-4 transition first:pt-0 last:pb-0"
    >
      {!isFirst ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 92% 24%, ${rgb(
            glow,
            0.08
          )} 0%, transparent 26%)`,
        }}
      />

      <div className="relative">
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-semibold leading-5.5 text-white/93">
              {item.title}
            </div>

            <p className="mt-1.5 max-w-[42rem] text-[13px] leading-5.5 text-white/62">
              {item.note}
            </p>

            <div
              className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold transition group-hover:gap-2"
              style={{ color: rgb(accent, 0.92) }}
            >
              <span>
                {item.mode === "local"
                  ? "See this local opening"
                  : "See this online opening"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </div>
          </div>

          <ArrowRight className="mt-1 hidden h-4 w-4 shrink-0 text-white/22 transition group-hover:translate-x-0.5 group-hover:text-white/58 sm:block" />
        </div>
      </div>
    </a>
  );
}

function TryThisForRealCard({
  path,
}: {
  path: ReturnType<typeof requireWorkPath>;
}) {
  const opportunityPair = React.useMemo(
    () => extractOpportunityPair(path),
    [path]
  );
  const items = React.useMemo(
    () =>
      [opportunityPair.local, opportunityPair.remote].filter(
        (item): item is LiveOpportunityPreview => Boolean(item)
      ),
    [opportunityPair]
  );

  return (
    <SurfaceCard
      accent={path.theme.accent}
      glow={path.theme.accentStrong}
      className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 10% 0%, ${rgb(
              path.theme.accent,
              0.16
            )} 0%, transparent 24%),
            radial-gradient(circle at 92% 12%, ${rgb(
              path.theme.accentStrong,
              0.14
            )} 0%, transparent 22%),
            linear-gradient(90deg, rgba(18,54,64,0.18) 0%, rgba(10,18,28,0.04) 42%, rgba(36,28,58,0.18) 100%)
          `,
        }}
      />

      <SectionHeader
        icon={Compass}
        kicker="Try this for real"
        title="A first real-world way in"
        description="You do not have to guess your way into this. Here are a couple concrete ways to get closer and test the fit."
        accent={path.theme.accent}
      />

      <div className="mt-4">
        {items.length > 0 ? (
          <div>
            {items.map((item, index) => (
              <OpportunityPreviewRow
                key={item.id}
                item={item}
                accent={path.theme.accent}
                glow={path.theme.accentStrong}
                isFirst={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="py-2 text-[13px] leading-5.5 text-white/58">
            Real-world opportunities are still being mapped for this path.
          </div>
        )}
      </div>

      <div className="mt-4 pt-1">
        <Link
          href={`/main/explore/work/${path.slug}/next-steps`}
          className="group inline-flex items-center gap-2 text-[14px] font-semibold text-white/92 transition hover:gap-2.5 hover:text-white"
        >
          <span>See the full real-world starter map</span>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </SurfaceCard>
  );
}

/* =============================================================================
   Deeper Path Rows
============================================================================= */

function ExplorePathRow({
  href,
  title,
  preview,
  cta,
  icon: Icon,
  glow,
  isFirst,
}: {
  href: string;
  title: string;
  preview: string;
  cta: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  glow: { r: number; g: number; b: number };
  isFirst: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative block py-4 transition first:pt-0 last:pb-0"
    >
      {!isFirst ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 90% 18%, ${rgb(
            glow,
            0.08
          )} 0%, transparent 24%)`,
        }}
      />

      <div className="relative flex items-start gap-3">
        <div className="relative mt-[2px] h-4 w-4 shrink-0">
          <div
            className="pointer-events-none absolute inset-[-8px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${rgb(
                glow,
                0.14
              )} 0%, transparent 72%)`,
              filter: "blur(6px)",
            }}
          />
          <Icon className="relative h-4 w-4 text-white/74 transition group-hover:text-white/92" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-white/92">
                {title}
              </div>

              <p className="mt-1.5 max-w-[42rem] text-[13px] leading-5.5 text-white/62">
                {preview}
              </p>

              <div className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/78 transition group-hover:gap-2 group-hover:text-white">
                <span>{cta}</span>
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </div>

            <ArrowRight className="mt-1 hidden h-4 w-4 shrink-0 text-white/22 transition group-hover:translate-x-0.5 group-hover:text-white/58 sm:block" />
          </div>
        </div>
      </div>
    </Link>
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
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  selectedReaction: WorkReaction | null;
  initialReasons: string[];
  initialNote: string;
  isSaving: boolean;
  onSubmit: (payload: {
    reaction: WorkReaction;
    reasons: string[];
    note: string;
  }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draftReaction, setDraftReaction] = React.useState<WorkReaction | null>(
    selectedReaction
  );
  const [reasons, setReasons] = React.useState<string[]>(initialReasons);
  const [note, setNote] = React.useState(initialNote);

  React.useEffect(() => {
    setDraftReaction(selectedReaction);
    setReasons(initialReasons);
    setNote(initialNote);
  }, [selectedReaction, initialReasons, initialNote]);

  const reactionConfig = React.useMemo(() => {
    const map: Record<
      WorkReaction,
      {
        title: string;
        helper: string;
        submitLabel: string;
        reasonOptions: string[];
      }
    > = {
      liked: {
        title: "What part feels most true?",
        helper: "Pick a reason or add a quick note. One sentence is enough.",
        submitLabel: "Save",
        reasonOptions: [
          "The work itself",
          "The vibe fits",
          "The day-to-day sounds good",
          "I can see myself doing this",
          "The signal feels right",
        ],
      },
      maybe: {
        title: "What feels close, but not fully there yet?",
        helper: "This helps Everleap understand what still needs pressure-testing.",
        submitLabel: "Save",
        reasonOptions: [
          "Interesting but unsure",
          "I need more detail",
          "I like parts of it",
          "Not sure I fit the lifestyle",
          "Want to compare it to others",
        ],
      },
      dismissed: {
        title: "What feels off about this one?",
        helper: "Tell Everleap why this path misses, then it will step aside.",
        submitLabel: "Remove this path",
        reasonOptions: [
          "I do not relate to the work",
          "The vibe feels wrong",
          "I would not enjoy the day-to-day",
          "It is not how I want to work",
          "Another path fits better",
        ],
      },
    };

    return draftReaction ? map[draftReaction] : null;
  }, [draftReaction]);

  function pickReaction(reaction: WorkReaction) {
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
          Does this feel like it could fit you?
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

export default function WorkPathDetailPage() {
  const router = useRouter();
  const params = useParams<{ pathId: string }>();
  const pathId = typeof params?.pathId === "string" ? params.pathId : "";

  if (!pathId) notFound();

  const path = React.useMemo(() => {
    try {
      return requireWorkPath(pathId);
    } catch {
      notFound();
    }
  }, [pathId]);

  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] =
    React.useState<WorkReaction | null>(null);
  const [savedReasons, setSavedReasons] = React.useState<string[]>([]);
  const [savedNote, setSavedNote] = React.useState("");
  const [isSavingReaction, setIsSavingReaction] = React.useState(false);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());

    const reactions = readWorkReactionState();
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

  const agenticOpening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "overview",
        pathId: path.id,
        firstName,
      }),
    [path.id, firstName]
  );

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

  const fitSignalIntro = React.useMemo(() => {
    const topSignal = [...path.fitSignals].sort((a, b) => b.score - a.score)[0];
    if (!topSignal) {
      return "A few smaller signals are clustering around this path.";
    }
    return `${topSignal.label} is one of the clearest reasons this path is showing up right now.`;
  }, [path.fitSignals]);

  const exploreLinks = [
    {
      href: `/main/explore/work/${path.slug}/specialties`,
      title: "Roles within this world",
      preview:
        "This path is rarely just one role. See the versions of the work that branch off from the same core instinct, and which one feels most like you.",
      cta: "See the different versions of this work",
      icon: Briefcase,
      glow: path.theme.accent,
    },
    {
      href: `/main/explore/work/${path.slug}/day`,
      title: "A day in the life",
      preview:
        "Step into the rhythm of the job itself — what repeats, where the pressure shows up, and what kind of energy this work asks from you.",
      cta: "See how the day actually feels",
      icon: CalendarClock,
      glow: path.theme.glow,
    },
    {
      href: `/main/explore/work/${path.slug}/forecast`,
      title: "The future of this career",
      preview:
        "Look at where this field is heading: demand, tools, salary, pressure, and the changes that could make the path more stable or more competitive.",
      cta: "See where this field is heading",
      icon: TrendingUp,
      glow: path.theme.accentStrong,
    },
  ];

  function handleQuickCheckSubmit(payload: {
    reaction: WorkReaction;
    reasons: string[];
    note: string;
  }) {
    setIsSavingReaction(true);

    saveWorkReactionFeedback({
      slug: path.slug,
      reaction: payload.reaction,
      reasons: payload.reasons,
      note: payload.note,
    });

    setSelectedReaction(payload.reaction);
    setSavedReasons(payload.reasons);
    setSavedNote(payload.note);

    if (payload.reaction === "dismissed") {
      router.push("/main/explore/work");
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
      <div className={pageShell()}>
        <Link
          href="/main/explore/work"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work
        </Link>

        <SurfaceCard
          accent={path.theme.accent}
          glow={path.theme.glow}
          className="px-4 py-4 sm:px-5 sm:py-5"
        >
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-36 w-40 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.accent, 0.12) }}
          />
          <div
            className="pointer-events-none absolute right-[18%] top-[-24px] h-28 w-40 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.accentStrong, 0.08) }}
          />
          <div
            className="pointer-events-none absolute right-10 top-0 h-24 w-32 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.glow, 0.08) }}
          />

          <WorkPathHeroEmblem
            accent={path.theme.accent}
            accentStrong={path.theme.accentStrong}
            glow={path.theme.glow}
          />

          <div className="pr-14 sm:pr-20">
            <div className={sectionKicker()}>{path.hero.eyebrow}</div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="max-w-[11ch] text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white/97 sm:max-w-none sm:text-[2.35rem]">
                {path.hero.title}
              </h1>

              <HeroInlineSignal
                score={overallSignalScore}
                accent={path.theme.accent}
                glow={path.theme.glow}
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
                {heroStoryLead} {agenticOpening.intro} {agenticOpening.body}
              </p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={path.theme.accentStrong}
          glow={path.theme.glow}
          className="px-4 py-3 sm:px-5 sm:py-3.5"
        >
          <div
            className="pointer-events-none absolute -left-8 top-0 h-28 w-28 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.accentStrong, 0.11) }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-28 w-36 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.glow, 0.08) }}
          />

          <SectionHeader
            icon={AudioLines}
            kicker="Why this could fit"
            title="A quick read on the match"
            description={fitSignalIntro}
            accent={path.theme.accentStrong}
          />

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {path.traitChips.map((chip: { id: string; label: string }) => (
              <span
                key={chip.id}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/74"
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="mt-2.5 space-y-2.5">
            {path.fitSignals.map(
              (signal: {
                id: string;
                label: string;
                score: number;
                explanation: string;
              }) => (
                <SignalDetailRow
                  key={signal.id}
                  {...signal}
                  accent={path.theme.accent}
                  accentStrong={path.theme.accentStrong}
                  glow={path.theme.glow}
                />
              )
            )}
          </div>
        </SurfaceCard>

        <QuickCheckCard
          accent={path.theme.accent}
          glow={path.theme.glow}
          selectedReaction={selectedReaction}
          initialReasons={savedReasons}
          initialNote={savedNote}
          isSaving={isSavingReaction}
          onSubmit={handleQuickCheckSubmit}
        />

        <TryThisForRealCard path={path} />

        <SurfaceCard
          accent={path.theme.glow}
          glow={path.theme.accentStrong}
          className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 10% 0%, ${rgb(
                  path.theme.glow,
                  0.16
                )} 0%, transparent 24%),
                radial-gradient(circle at 92% 18%, ${rgb(
                  path.theme.accentStrong,
                  0.12
                )} 0%, transparent 22%),
                linear-gradient(90deg, rgba(22,64,56,0.22) 0%, rgba(10,18,28,0.04) 40%, rgba(18,32,66,0.18) 100%)
              `,
            }}
          />

          <SectionHeader
            icon={Sparkles}
            kicker="What you can explore next"
            title="The next layers of this path"
            description="Each one opens a different part of the story — the branches, the rhythm, and the future."
            accent={path.theme.glow}
          />

          <div className="mt-4">
            {exploreLinks.map((item, index) => (
              <ExplorePathRow
                key={item.href}
                {...item}
                isFirst={index === 0}
              />
            ))}
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}