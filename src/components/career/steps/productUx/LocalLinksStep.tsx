"use client";

import * as React from "react";
import type { StepperStep, StepperPersistedState } from "@/components/career/stepperTypes";

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

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100/90">
      {children}
    </span>
  );
}

function Tiny({ children }: { children: React.ReactNode }) {
  return <div className="text-xs leading-relaxed text-slate-300/70">{children}</div>;
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-slate-50">{title}</div>
      {subtitle ? <div className="mt-1 text-xs text-slate-300/70">{subtitle}</div> : null}
      <div className="mt-4 space-y-2">{children}</div>
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
        transition hover:bg-white/8 active:scale-[0.99]
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
            <div className="truncate text-sm font-semibold text-slate-50">{item.title}</div>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate-200/80">{item.blurb}</div>
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
  // allow 5-digit or 5+4; keep it simple for now
  if (/^\d{5}(-\d{4})?$/.test(s)) return s;
  return "";
}

export function LocalLinksStep({ step, progress }: Props) {
  // ✅ no `any` — StepperPersistedState already has `zipCode?: string`
  const zip = normalizeZip(progress.zipCode) || "94901";

  const quick = [
    { label: "ZIP", value: zip },
    { label: "Mode", value: "Mobile-friendly" },
    { label: "Goal", value: "Start small" },
  ];

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
    {
      id: "learn-3",
      kind: "learn",
      title: "Usability testing mini-guide",
      blurb: "How to run a simple test with 1 person and learn a lot.",
      href: undefined,
      tag: "fast",
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
      title: "Portfolio starter template",
      blurb: "A simple structure: problem → your design → why → what you learned.",
      href: undefined,
      tag: "simple",
    },
    {
      id: "build-3",
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
      title: "Local workshops near you",
      blurb: `We’ll show nearby classes, meetups, and camps based on ${zip}.`,
      href: undefined,
      tag: "coming",
    },
    {
      id: "local-2",
      kind: "local",
      title: "Volunteer design opportunities",
      blurb: "Small nonprofits often need simple UX help — great for portfolios.",
      href: undefined,
      tag: "real work",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Recommendation · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Links + places to explore</h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          This is where Everleap becomes *actionable*: learn something, build something, and find real-world places to
          practice.
        </p>

        <div className="flex flex-wrap gap-2">
          {quick.map((q) => (
            <Chip key={q.label}>
              <span className="text-slate-300/70">{q.label}:</span>&nbsp;{q.value}
            </Chip>
          ))}
        </div>

        <Tiny>
          For now these are placeholders. Next we can connect real links and local results (and tune them based on your
          interests and ZIP).
        </Tiny>
      </div>

      <SectionCard title="Start learning (keep it short)" subtitle="Pick ONE. Finish it. Then build a tiny artifact.">
        {learn.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}
      </SectionCard>

      <SectionCard title="Build something (this makes you real)" subtitle="Portfolios are proof — tiny proof still counts.">
        {build.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}
      </SectionCard>

      <SectionCard title="Community + feedback" subtitle="Your growth accelerates when someone reacts to your work.">
        {community.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}
      </SectionCard>

      <SectionCard title="Local (based on your ZIP)" subtitle="When we wire the data, this becomes a real “go do it” map.">
        {local.map((i) => (
          <LinkCard key={i.id} item={i} />
        ))}

        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/70">Next improvement</div>
          <div className="mt-2 text-sm text-slate-200/85">
            If we don’t have a ZIP yet, we’ll ask during onboarding. Until then, we default to{" "}
            <span className="text-slate-50 font-semibold">94901</span>.
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
