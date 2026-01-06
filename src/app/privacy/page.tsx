// src/app/privacy/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  Database,
  Sparkles,
  Lock,
  Hand,
  ChevronRight,
} from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import {
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

type TocItem = {
  id: string;
  label: string;
};

type Section = {
  id: string;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  body: React.ReactNode;
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function PrivacyPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const toc: TocItem[] = [
    { id: "overview", label: "Overview" },
    { id: "collect", label: "Data we collect" },
    { id: "use", label: "How we use it" },
    { id: "sharing", label: "Sharing" },
    { id: "security", label: "Security" },
    { id: "choices", label: "Your choices" },
  ];

  const sections: Section[] = [
    {
      id: "overview",
      title: "Plain-English Summary",
      Icon: Sparkles,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            This is the friendly version. The legal language comes next. We’ll
            keep it simple:
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "We don’t sell your personal information.",
              "You control what optional answers you share.",
              "You can request access, export, or deletion (subject to legal limits).",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/65" />
                <span className="text-[15px] leading-7 text-white/80">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Helpful note
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              If you’re under 13, a parent/guardian may need to help set up your
              account depending on your region. (We’ll finalize this policy as
              Everleap evolves.)
            </div>
          </div>
        </>
      ),
    },
    {
      id: "collect",
      title: "Information We Collect",
      Icon: Database,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            We collect only what we need to run Everleap and improve the product.
            Examples include:
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "Account details you provide (name, email)",
              "Usage data (pages visited, feature usage) to improve performance",
              "Optional responses you choose to answer (e.g., goals, preferences)",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                <span className="text-[15px] leading-7 text-white/80">{t}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "use",
      title: "How We Use Information",
      Icon: FileText,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            We use information to:
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "Provide and improve Everleap services",
              "Communicate updates and respond to support requests",
              "Maintain safety, security, and integrity",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                <span className="text-[15px] leading-7 text-white/80">{t}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Data Sharing",
      Icon: Hand,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            We don’t sell your personal information. We may share data with
            trusted service providers who help operate Everleap (hosting,
            analytics, customer support), bound by confidentiality and security
            obligations.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Examples
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              Hosting, error monitoring, and email delivery services.
            </div>
          </div>
        </>
      ),
    },
    {
      id: "security",
      title: "Security",
      Icon: Lock,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            We use industry-standard safeguards to protect information. No system
            is perfectly secure, so please use a strong password and keep it
            confidential.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Tip
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              If you think your account is compromised, contact us right away.
            </div>
          </div>
        </>
      ),
    },
    {
      id: "choices",
      title: "Your Choices",
      Icon: Shield,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            Depending on your region and legal requirements, you may be able to:
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "Access, update, export, or delete your data (subject to legal limits)",
              "Opt out of non-essential communications",
              "Control optional answers and personalization settings",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                <span className="text-[15px] leading-7 text-white/80">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
            >
              Contact us
              <ChevronRight className="h-4 w-4 text-white/60" />
            </Link>

            <Link
              href="/terms"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/8"
            >
              Terms of service
              <ChevronRight className="h-4 w-4 text-white/50" />
            </Link>
          </div>
        </>
      ),
    },
  ];

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="privacy_orb"
      ambientCap={0.35}
    >
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8">
        {/* Top header */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold tracking-wide text-white/75">
              Everleap · Privacy
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              Updated Oct 4, 2025
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Short, readable, and consistent with Everleap. This is a placeholder
            structure you can swap with finalized legal text anytime.
          </p>
        </div>

        {/* Reading card */}
        <section className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl">
          {/* One subtle corner glow only (keeps it “alive” without brightness drama) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-[220px] w-[220px] rounded-full bg-gradient-to-br from-sky-400/25 via-cyan-300/10 to-transparent blur-[70px]"
          />

          <div className="relative">
            {/* Mini TOC */}
            <div className="border-b border-white/10 px-5 py-4 md:px-7">
              <div className="flex flex-wrap gap-2">
                {toc.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => scrollToId(t.id)}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/8"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-6 md:px-7 md:py-7">
              <div className="mx-auto max-w-[72ch] space-y-10">
                {sections.map(({ id, title, Icon, body }) => (
                  <section key={id} id={id} className="scroll-mt-24">
                    <div className="flex items-start gap-4">
                      {/* Section icon chip */}
                      <div className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/6">
                        <Icon className="h-5 w-5 text-white/80" />
                      </div>

                      {/* Title + rail */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-[2px] rounded-full bg-gradient-to-b from-sky-300/70 via-white/10 to-transparent" />
                          <h2 className="text-xl font-semibold text-white">
                            {title}
                          </h2>
                        </div>
                        <div className="mt-3">{body}</div>
                      </div>
                    </div>
                  </section>
                ))}

                {/* Footer note */}
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Contact
                  </div>
                  <div className="mt-1 text-[14px] leading-6 text-white/75">
                    Questions about privacy? Reach us via{" "}
                    <Link href="/contact" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60">
                      Contact
                    </Link>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom nav includes Guide + + menu */}
      <BottomNav activeKey="home" themeId={themeId} gradientLevel={gradientLevel} />
    </AppChrome>
  );
}
