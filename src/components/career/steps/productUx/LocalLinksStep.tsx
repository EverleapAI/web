// src/components/career/steps/productUx/LocalLinksStep.tsx
"use client";

import * as React from "react";
import type {
  StepperStep,
  StepperPersistedState,
} from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
};

type LinkItem = {
  id: string;
  title: string;
  blurb: string;
  href?: string;
  kind: "learn" | "build" | "community" | "local";
  tag?: string;
};

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "sky" | "emerald" | "amber";
}) {
  const cls =
    tone === "sky"
      ? "border-sky-200/20 bg-sky-300/12 text-sky-50"
      : tone === "emerald"
        ? "border-emerald-200/20 bg-emerald-300/12 text-emerald-50"
        : tone === "amber"
          ? "border-amber-200/20 bg-amber-300/12 text-amber-50"
          : "border-white/10 bg-white/5 text-slate-100/90";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

function Tiny({ children }: { children: React.ReactNode }) {
  return <div className="text-xs leading-relaxed text-slate-300/70">{children}</div>;
}

function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-card border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-14 -left-12 h-56 w-56 rounded-full bg-gradient-to-br from-sky-500/16 via-cyan-400/9 to-indigo-500/10 blur-3xl opacity-70" />
        <div className="absolute -bottom-16 -right-12 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-500/12 via-teal-400/7 to-sky-500/9 blur-3xl opacity-60" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {icon ? (
                <span className="text-base" aria-hidden>
                  {icon}
                </span>
              ) : null}
              <div className="text-sm font-semibold text-slate-50">{title}</div>
            </div>
            {subtitle ? (
              <div className="mt-1 text-xs text-slate-300/70">{subtitle}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 space-y-2">{children}</div>
      </div>
    </section>
  );
}

function LinkCard({ item }: { item: LinkItem }) {
  const icon =
    item.kind === "learn"
      ? "📚"
      : item.kind === "build"
        ? "🧪"
        : item.kind === "community"
          ? "🧑‍🤝‍👩"
          : "📍";

  return (
    <a
      href={item.href ?? "#"}
      target={item.href ? "_blank" : undefined}
      rel={item.href ? "noreferrer" : undefined}
      className="
        group block rounded-2xl border border-white/10 bg-white/5 px-4 py-3
        transition hover:bg-white/10 active:scale-[0.99]
      "
      aria-disabled={!item.href}
      onClick={(e) => {
        if (!item.href) e.preventDefault();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base" aria-hidden>
              {icon}
            </span>
            <div className="truncate text-sm font-semibold text-slate-50">
              {item.title}
            </div>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate-200/80">
            {item.blurb}
          </div>
        </div>

        {item.tag ? (
          <span className="shrink-0 rounded-full border border-white/10 bg-slate-950/35 px-2 py-1 text-[0.7rem] font-semibold text-slate-100/85">
            {item.tag}
          </span>
        ) : null}
      </div>

      {!item.href ? (
        <div className="mt-2 text-[0.7rem] text-slate-300/60">
          (Placeholder — we’ll attach the best links here.)
        </div>
      ) : null}
    </a>
  );
}

function normalizeZip(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (/^\d{5}(-\d{4})?$/.test(s)) return s;
  return "";
}

function hasRealZip(v: unknown): boolean {
  return Boolean(normalizeZip(v));
}

export function LocalLinksStep({ step, progress }: Props) {
  // Keep your existing behavior:
  // - read progress["zip"]
  // - default to 94901 if missing
  const rawZip = (progress as unknown as Record<string, unknown>)["zip"];
  const zip = normalizeZip(rawZip) || "94901";
  const zipIsReal = hasRealZip(rawZip);

  const quick = [
    { label: "ZIP", value: zip, tone: zipIsReal ? ("emerald" as const) : ("amber" as const) },
    { label: "Goal", value: "Start small", tone: "sky" as const },
    { label: "Mode", value: "Mobile-friendly", tone: "neutral" as const },
  ];

  // Keep your placeholder data, but present as “3 nearby moves”.
  const learn: LinkItem[] = [
    {
      id: "learn-1",
      kind: "learn",
      title: "UX basics (start here)",
      blurb: "A short intro to user-centered design: problems, flows, prototypes, tests.",
      href: undefined,
      tag: "10–30 min",
    },
    {
      id: "learn-2",
      kind: "learn",
      title: "Figma fundamentals",
      blurb: "Learn just enough to build screens + prototypes quickly.",
      href: undefined,
      tag: "hands-on",
    },
  ];

  const build: LinkItem[] = [
    {
      id: "build-1",
      kind: "build",
      title: "Redo one screen you use daily",
      blurb: "Pick 1 screen → make a cleaner version → test it with 1 person.",
      href: undefined,
      tag: "45 min",
    },
    {
      id: "build-2",
      kind: "build",
      title: "Case study checklist",
      blurb: "How to show your thinking without writing a novel.",
      href: undefined,
      tag: "clean",
    },
  ];

  const community: LinkItem[] = [
    {
      id: "comm-1",
      kind: "community",
      title: "Find a student UX community",
      blurb: "A friendly place to share work and get feedback (no gatekeeping).",
      href: undefined,
      tag: "feedback",
    },
    {
      id: "comm-2",
      kind: "community",
      title: "Design critique prompts",
      blurb: "Ask for feedback in a way that gets useful answers.",
      href: undefined,
      tag: "upgrade",
    },
  ];

  const local: LinkItem[] = [
    {
      id: "local-1",
      kind: "local",
      title: "Workshops near you",
      blurb: zipIsReal
        ? `We’ll show classes, meetups, and workshops near ${zip}.`
        : `We’ll show classes, meetups, and workshops once we have your ZIP.`,
      href: undefined,
      tag: zipIsReal ? "next" : "needs ZIP",
    },
    {
      id: "local-2",
      kind: "local",
      title: "Volunteer UX opportunities",
      blurb: "Small nonprofits often need simple UX help — great for portfolios.",
      href: undefined,
      tag: "real work",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-white/70">
        Dive deeper · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Make this real (3 nearby moves)
        </h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          This is the “go do something” step. Don’t try to do all of it — pick one
          move that feels doable this week.
        </p>

        <div className="flex flex-wrap gap-2">
          {quick.map((q) => (
            <Chip key={q.label} tone={q.tone}>
              <span className="text-slate-200/70">{q.label}:</span>&nbsp;{q.value}
            </Chip>
          ))}
        </div>

        <Tiny>
          These are placeholders right now. Next we’ll wire real links and real local results
          (and personalize based on your specialty picks).
        </Tiny>
      </div>

      <Panel
        icon="✅"
        title="Pick 1 learning bite"
        subtitle="One short thing. Finish it. Momentum beats motivation."
      >
        {learn.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}
      </Panel>

      <Panel
        icon="🧩"
        title="Build 1 tiny artifact"
        subtitle="This is how you become “real” in the lane — proof over talk."
      >
        {build.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}

        <div className="mt-2 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <div className="text-xs font-semibold uppercase tracking-eyebrow text-slate-300/70">
            Coach note
          </div>
          <div className="mt-2 text-sm text-slate-200/85">
            If you only do one thing: redo one screen and show it to one person.
            That’s already a real UX loop.
          </div>
        </div>
      </Panel>

      <Panel
        icon="🧑‍🤝‍👩"
        title="Get 1 piece of feedback"
        subtitle="Your growth accelerates the moment someone reacts to your work."
      >
        {community.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}
      </Panel>

      <Panel
        icon="📍"
        title="Local (based on your ZIP)"
        subtitle="When we wire data, this becomes a real “go do it” map."
      >
        {local.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}

        {!zipIsReal ? (
          <div className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4">
            <div className="text-xs font-semibold uppercase tracking-eyebrow text-amber-50/80">
              Quick fix later
            </div>
            <div className="mt-2 text-sm text-amber-50/90">
              We don’t have your ZIP yet, so we’re defaulting to{" "}
              <span className="font-semibold text-amber-50">94901</span>. Once you add it,
              we’ll pull nearby meetups, classes, internships, and volunteer projects.
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
            <div className="text-xs font-semibold uppercase tracking-eyebrow text-slate-300/70">
              Next improvement
            </div>
            <div className="mt-2 text-sm text-slate-200/85">
              We’ll use <span className="font-semibold text-slate-50">{zip}</span> to rank:
              closest options first, then “highest signal for beginners.”
            </div>
          </div>
        )}
      </Panel>
    </section>
  );
}
