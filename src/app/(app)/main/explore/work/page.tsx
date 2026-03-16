// apps/web/src/app/(app)/main/explore/work/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight } from "lucide-react";

import { WORK_PATHS } from "./_data/workPaths";
import type { WorkPathContent } from "./_data/workPathSchema";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type SignalNode = {
  x: number;
  y: number;
  size: number;
  alpha: number;
};

type QuickCheckChoice = "mostly-right" | "somewhat" | "not-really";

const LOCAL_PLACE_LABEL = "San Rafael";
const MAX_VISIBLE_WORK_PATHS = 4;

const CONSTELLATION_NODES: SignalNode[] = [
  { x: 18, y: 28, size: 8, alpha: 0.95 },
  { x: 68, y: 18, size: 6, alpha: 0.72 },
  { x: 108, y: 50, size: 7, alpha: 0.82 },
  { x: 54, y: 66, size: 5, alpha: 0.66 },
  { x: 26, y: 98, size: 7, alpha: 0.8 },
  { x: 94, y: 96, size: 6, alpha: 0.7 },
];

const CONSTELLATION_LINES = [
  { x1: 18, y1: 28, x2: 68, y2: 18, alpha: 0.34 },
  { x1: 68, y1: 18, x2: 108, y2: 50, alpha: 0.24 },
  { x1: 18, y1: 28, x2: 54, y2: 66, alpha: 0.28 },
  { x1: 54, y1: 66, x2: 108, y2: 50, alpha: 0.22 },
  { x1: 54, y1: 66, x2: 26, y2: 98, alpha: 0.24 },
  { x1: 54, y1: 66, x2: 94, y2: 96, alpha: 0.2 },
];

const EXPLORE_LANES = [
  {
    id: "work",
    label: "Work",
    href: "/main/explore/work",
    active: true,
    available: true,
    dotClass: "bg-cyan-300",
  },
  {
    id: "learning",
    label: "Learning",
    href: "/main/explore/learning",
    active: false,
    available: true,
    dotClass: "bg-violet-300",
  },
  {
    id: "world",
    label: "World",
    href: "/main/explore/world",
    active: false,
    available: true,
    dotClass: "bg-amber-300",
  },
  {
    id: "impact",
    label: "Impact",
    href: "/main/explore/impact",
    active: false,
    available: true,
    dotClass: "bg-emerald-300",
  },
  {
    id: "play",
    label: "Play",
    href: "/main/explore/play",
    active: false,
    available: true,
    dotClass: "bg-pink-300",
  },
] as const;

const QUICK_CHECK_OPTIONS: Array<{
  id: QuickCheckChoice;
  label: string;
  emoji: string;
}> = [
  { id: "mostly-right", label: "Mostly right", emoji: "👍" },
  { id: "somewhat", label: "Somewhat", emoji: "🙂" },
  { id: "not-really", label: "Not really", emoji: "👎" },
];

function pagePadding() {
  return "pb-24 pt-3";
}

function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
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

function readStoredFirstName(): string | null {
  if (typeof window === "undefined") return null;

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
    } catch {}
  }

  return null;
}

function getAgenticOpening(firstName: string | null) {
  if (firstName) {
    return {
      title: `${firstName}, this is not about picking a forever answer.`,
      bodyA:
        "Work becomes easier to explore when you stop asking which title sounds impressive and start asking which kinds of problems, people, systems, or worlds keep catching your attention in a real way.",
      bodyB:
        "The goal here is to notice where your mind already leans — then give that instinct something more concrete to move toward.",
    };
  }

  return {
    title: "This is not about picking a forever answer.",
    bodyA:
      "Work becomes easier to explore when you stop asking which title sounds impressive and start asking which kinds of problems, people, systems, or worlds keep catching your attention in a real way.",
    bodyB:
      "The goal here is to notice where your mind already leans — then give that instinct something more concrete to move toward.",
  };
}

function normalizePaths(input: unknown): WorkPathContent[] {
  if (Array.isArray(input)) return input as WorkPathContent[];

  const record = asRecord(input);
  if (!record) return [];

  return Object.values(record).filter(Boolean) as WorkPathContent[];
}

function extractCardField(
  path: WorkPathContent,
  field: "title" | "hook" | "description"
): string {
  const card = asRecord((path as unknown as Record<string, unknown>).card);
  return asString(card?.[field]) ?? "";
}

function extractTextItems(input: unknown, limit: number): string[] {
  if (!Array.isArray(input)) return [];

  const results: string[] = [];

  for (const item of input) {
    if (typeof item === "string") {
      const text = item.trim();
      if (text) {
        results.push(text);
        if (results.length >= limit) break;
      }
      continue;
    }

    const record = asRecord(item);
    if (!record) continue;

    const candidate =
      asString(record.label) ??
      asString(record.title) ??
      asString(record.name) ??
      asString(record.text) ??
      asString(record.body) ??
      asString(record.description) ??
      asString(record.detail);

    if (candidate) {
      results.push(candidate);
      if (results.length >= limit) break;
    }
  }

  return results;
}

function pathAccent(path: WorkPathContent): Rgb {
  const theme = asRecord((path as unknown as Record<string, unknown>).theme);
  const accent = asRecord(theme?.accent);

  if (
    typeof accent?.r === "number" &&
    typeof accent?.g === "number" &&
    typeof accent?.b === "number"
  ) {
    return { r: accent.r, g: accent.g, b: accent.b };
  }

  return { r: 99, g: 102, b: 241 };
}

function humanizeSignal(signal: string): string {
  const normalized = signal.trim().toLowerCase();

  switch (normalized) {
    case "systems + imagination":
      return "You seem drawn to both creativity and how things actually work.";
    case "experience judgment":
      return "You notice when an experience feels smooth, fun, or slightly off.";
    case "iteration tolerance":
      return "You can keep refining something until it finally clicks.";
    case "systems thinking":
      return "You naturally look for how the moving pieces connect.";
    case "player empathy":
      return "You seem good at thinking about what someone else would feel or need.";
    case "creative logic":
      return "You like ideas, but you also want them to make sense.";
    default:
      return signal;
  }
}

function deriveFitSignals(path: WorkPathContent): string[] {
  const fitSignals = extractTextItems(
    (path as unknown as Record<string, unknown>).fitSignals,
    3
  ).map(humanizeSignal);

  if (fitSignals.length > 0) return fitSignals;

  const traitChips = extractTextItems(
    (path as unknown as Record<string, unknown>).traitChips,
    3
  ).map(humanizeSignal);

  return traitChips;
}

function deriveInsidePathPreviews(_path: WorkPathContent): string[] {
  return [
    "What the work feels like",
    "Roles inside the field",
    `Ways to start online or near ${LOCAL_PLACE_LABEL}`,
    "Where this field is going",
  ];
}

function getQuickCheckPrompt(choice: QuickCheckChoice) {
  switch (choice) {
    case "mostly-right":
      return "What part feels right?";
    case "somewhat":
      return "What part fits, and what part doesn't?";
    case "not-really":
      return "Give us reasons why — we’ll use that to bring in another suggestion.";
  }
}

function getQuickCheckSubmitLabel(choice: QuickCheckChoice) {
  switch (choice) {
    case "mostly-right":
      return "Submit";
    case "somewhat":
      return "Submit";
    case "not-really":
      return "Submit and show another";
  }
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-white/42 sm:text-[12px]">
      {children}
    </p>
  );
}

function ExploreLaneTabs() {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {EXPLORE_LANES.map((lane) => {
        const content = (
          <>
            <span className={`h-2.5 w-2.5 rounded-full ${lane.dotClass}`} />
            <span>{lane.label}</span>
          </>
        );

        return (
          <Link
            key={lane.id}
            href={lane.href}
            aria-current={lane.active ? "page" : undefined}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-medium tracking-[-0.01em] transition",
              lane.active
                ? "border-cyan-300/30 bg-cyan-300/[0.11] text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.05)]"
                : "border-white/12 bg-white/[0.04] text-white/72 hover:bg-white/[0.07]",
            ].join(" ")}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-cyan-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-cyan-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-cyan-200/55 shadow-[0_0_16px_rgba(103,232,249,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-cyan-100/68 shadow-[0_0_14px_rgba(186,230,253,0.42)]" />
      <div className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r from-cyan-300/26 to-transparent" />
      <div className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r from-cyan-300/20 to-transparent" />
      <div className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r from-cyan-300/16 to-transparent" />
      <div className="absolute bottom-[10px] right-[2px] flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/14 bg-cyan-300/[0.05] text-[11px] font-semibold text-cyan-100/68">
        ◎
      </div>
    </div>
  );
}

function WorkIntroPanel({ firstName }: { firstName: string | null }) {
  const opening = getAgenticOpening(firstName);

  return (
    <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(129,93,255,0.12),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative max-w-4xl pr-0 sm:pr-24">
        <SectionKicker>Work</SectionKicker>

        <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[36px]">
          {opening.title}
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.75] text-white/74 sm:text-[16px]">
          {opening.bodyA}
        </p>

        <p className="mt-4 max-w-3xl text-[15px] leading-[1.75] text-white/78 sm:text-[16px]">
          {opening.bodyB}
        </p>
      </div>
    </section>
  );
}

function SignalConstellation({
  accent,
  mobile = false,
}: {
  accent: Rgb;
  mobile?: boolean;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute opacity-95",
        mobile
          ? "right-2 top-10 h-[88px] w-[92px] sm:hidden"
          : "right-3 top-8 hidden h-[110px] w-[116px] sm:block",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rgb(
            accent,
            0.17
          )} 0%, ${rgb(accent, 0.055)} 42%, transparent 74%)`,
        }}
      />

      <svg
        viewBox="0 0 128 120"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {CONSTELLATION_LINES.map((line, index) => (
          <line
            key={`line-${mobile ? "m" : "d"}-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={rgb(accent, mobile ? line.alpha * 0.92 : line.alpha)}
            strokeWidth={mobile ? "1.25" : "1.15"}
            strokeLinecap="round"
          />
        ))}

        {CONSTELLATION_NODES.map((node, index) => (
          <g key={`node-${mobile ? "m" : "d"}-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size + 4 : node.size + 4.5}
              fill={rgb(accent, node.alpha * 0.1)}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size * 0.9 : node.size * 0.94}
              fill={rgb(accent, mobile ? node.alpha * 0.95 : node.alpha)}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size * 0.26 : node.size * 0.3}
              fill="white"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function QuickCheckPill({
  choice,
  active,
  accent,
  onClick,
}: {
  choice: { id: QuickCheckChoice; label: string; emoji: string };
  active: boolean;
  accent: Rgb;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[14px] font-medium tracking-[-0.01em] text-white/84 transition hover:bg-white/[0.07]"
      style={{
        borderColor: active ? rgb(accent, 0.3) : "rgba(255,255,255,0.10)",
        backgroundColor: active ? rgb(accent, 0.11) : "rgba(255,255,255,0.035)",
        boxShadow: active ? `0 0 0 1px ${rgb(accent, 0.07)}` : "none",
      }}
    >
      <span className="text-[15px]" aria-hidden="true">
        {choice.emoji}
      </span>
      <span>{choice.label}</span>
    </button>
  );
}

function WorkPathCard({
  path,
  onDismiss,
}: {
  path: WorkPathContent;
  onDismiss: (pathId: string) => void;
}) {
  const accent = pathAccent(path);

  const title = extractCardField(path, "title");
  const hook = extractCardField(path, "hook");
  const description = extractCardField(path, "description");

  const fitSignals = deriveFitSignals(path);
  const insidePathPreviews = deriveInsidePathPreviews(path);

  const [quickCheck, setQuickCheck] = React.useState<QuickCheckChoice | null>(
    null
  );
  const [comment, setComment] = React.useState("");

  function handleQuickCheck(choice: QuickCheckChoice) {
    setQuickCheck(choice);
  }

  function handleSubmitQuickCheck() {
    if (!quickCheck) return;

    if (quickCheck === "not-really") {
      setComment("");
      setQuickCheck(null);
      onDismiss(path.id);
      return;
    }

    setComment("");
    setQuickCheck(null);
  }

  return (
    <article
      className="group relative overflow-hidden rounded-[30px] border border-cyan-300/16 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5"
      style={{
        boxShadow: `0 24px 80px rgba(0,0,0,0.32), 0 0 0 1px ${rgb(accent, 0.06)}`,
      }}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accent, 0.16) }}
      />
      <div
        className="pointer-events-none absolute right-[-32px] top-[-18px] h-28 w-28 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accent, 0.12) }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background: `linear-gradient(180deg, ${rgb(
            accent,
            0.18
          )} 0%, ${rgb(accent, 0.07)} 44%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            accent,
            0.42
          )} 24%, ${rgb(accent, 0.18)} 72%, transparent 100%)`,
        }}
      />

      <SignalConstellation accent={accent} mobile />
      <SignalConstellation accent={accent} />

      <div className="relative">
        <div className="min-w-0 pr-14 sm:pr-28">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div
                className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  borderColor: rgb(accent, 0.22),
                  backgroundColor: rgb(accent, 0.1),
                  color: rgb(accent, 0.92),
                }}
              >
                Work path
              </div>

              <h2 className="mt-3 text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[25px]">
                {title}
              </h2>
            </div>

            <Link
              href={`/main/explore/work/${path.slug}`}
              className="hidden shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.085] px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/[0.12] sm:inline-flex"
            >
              Explore this path
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {hook ? (
            <p className="mt-4 text-[15px] font-medium leading-[1.65] text-white/86 sm:text-[16px]">
              {hook}
            </p>
          ) : null}

          {description ? (
            <p className="mt-3 max-w-[44rem] text-[14px] leading-[1.7] text-white/68 sm:text-[14px]">
              {description}
            </p>
          ) : null}
        </div>

        {fitSignals.length > 0 ? (
          <section className="mt-5 rounded-[22px] border border-white/10 bg-black/18 px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{
                    borderColor: rgb(accent, 0.18),
                    background: `linear-gradient(180deg, ${rgb(
                      accent,
                      0.11
                    )} 0%, ${rgb(accent, 0.04)} 100%)`,
                    color: rgb(accent, 0.9),
                    boxShadow: `inset 0 1px 0 ${rgb(accent, 0.08)}`,
                  }}
                >
                  Signals I&apos;m hearing
                </p>
              </div>
            </div>

            <ul className="mt-3 space-y-2.5">
              {fitSignals.map((signal, index) => (
                <li
                  key={`${signal}-${index}`}
                  className="flex gap-3 text-[14px] leading-[1.65] text-white/80"
                >
                  <span
                    className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: rgb(accent, 0.88) }}
                  />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {insidePathPreviews.length > 0 ? (
          <section className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/44">
              Inside this path
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {insidePathPreviews.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border px-3 py-1.5 text-[12px] font-medium text-white/74"
                  style={{
                    borderColor: rgb(accent, 0.15),
                    backgroundColor: rgb(accent, 0.08),
                    boxShadow: `inset 0 1px 0 ${rgb(accent, 0.06)}`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/44">
            Quick check
          </p>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {QUICK_CHECK_OPTIONS.map((choice) => (
              <QuickCheckPill
                key={choice.id}
                choice={choice}
                active={quickCheck === choice.id}
                accent={accent}
                onClick={() => handleQuickCheck(choice.id)}
              />
            ))}
          </div>

          {quickCheck ? (
            <div className="mt-3 rounded-[20px] border border-white/10 bg-black/16 px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-medium leading-relaxed text-white/72">
                  {getQuickCheckPrompt(quickCheck)}
                </p>
                <span className="shrink-0 text-[12px] text-white/38">
                  Optional
                </span>
              </div>

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                placeholder={
                  quickCheck === "not-really"
                    ? "Tell us what feels off so we can bring in a better suggestion..."
                    : "Add a quick note..."
                }
                className="mt-3 w-full resize-none rounded-[16px] border border-white/10 bg-white/[0.035] px-3.5 py-3 text-[14px] leading-relaxed text-white outline-none placeholder:text-white/28"
                style={{
                  boxShadow: `inset 0 1px 0 ${rgb(accent, 0.05)}`,
                }}
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitQuickCheck}
                  className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-[13px] font-medium text-white transition hover:translate-y-[-1px]"
                  style={{
                    borderColor: rgb(accent, 0.24),
                    background: `linear-gradient(180deg, ${rgb(
                      accent,
                      0.2
                    )} 0%, ${rgb(accent, 0.11)} 100%)`,
                    boxShadow: `0 10px 24px ${rgb(accent, 0.14)}`,
                  }}
                >
                  {getQuickCheckSubmitLabel(quickCheck)}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <div className="mt-5">
          <Link
            href={`/main/explore/work/${path.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border px-4 py-3 text-[14px] font-medium text-white transition hover:translate-y-[-1px]"
            style={{
              borderColor: rgb(accent, 0.24),
              background: `linear-gradient(180deg, ${rgb(
                accent,
                0.2
              )} 0%, ${rgb(accent, 0.11)} 100%)`,
              boxShadow: `0 10px 28px ${rgb(accent, 0.16)}`,
            }}
          >
            Explore this path
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function WorkExplorePage() {
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [dismissedPathIds, setDismissedPathIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const allPaths = React.useMemo(() => normalizePaths(WORK_PATHS), []);

  const visiblePaths = React.useMemo(() => {
    return allPaths
      .filter((path) => !dismissedPathIds.includes(path.id))
      .slice(0, MAX_VISIBLE_WORK_PATHS);
  }, [allPaths, dismissedPathIds]);

  function handleDismissPath(pathId: string) {
    setDismissedPathIds((current) =>
      current.includes(pathId) ? current : [...current, pathId]
    );
  }

  return (
    <div className={pagePadding()}>
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(129,93,255,0.10),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

        <div className="relative">
          <h1 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[50px]">
            Explore
          </h1>
          <p className="mt-1 text-[15px] leading-[1.5] text-white/62 sm:text-[16px]">
            Where I can go
          </p>

          <ExploreLaneTabs />
        </div>
      </section>

      <WorkIntroPanel firstName={firstName} />

      <section className="mt-6 grid grid-cols-1 gap-4 sm:gap-5">
        {visiblePaths.map((path) => (
          <WorkPathCard
            key={path.id}
            path={path}
            onDismiss={handleDismissPath}
          />
        ))}

        {allPaths.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
            No work paths are registered yet.
          </div>
        ) : null}

        {allPaths.length > 0 && visiblePaths.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
            You&apos;ve cleared the current set of work paths.
          </div>
        ) : null}
      </section>
    </div>
  );
}