// src/app/terms/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  UserCheck,
  Shield,
  Handshake,
  Globe,
  AlertTriangle,
  Scale,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import { type SpotlightThemeId, type GradientLevel } from "@/theme/everleapVisuals";

type TocItem = { id: string; label: string };

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

export default function TermsPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const toc: TocItem[] = [
    { id: "summary", label: "Summary" },
    { id: "acceptance", label: "Acceptance" },
    { id: "eligibility", label: "Eligibility" },
    { id: "use", label: "Use" },
    { id: "content", label: "Content" },
    { id: "privacy", label: "Privacy" },
    { id: "thirdparty", label: "Third-party" },
    { id: "disclaimers", label: "Disclaimers" },
    { id: "liability", label: "Liability" },
    { id: "changes", label: "Changes" },
  ];

  const sections: Section[] = [
    {
      id: "summary",
      title: "Plain-English Summary",
      Icon: FileText,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            This is the friendly version. The legal terms follow below. In
            short:
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "Use Everleap respectfully and legally.",
              "You’re responsible for your account and activity.",
              "We may update features and these Terms over time.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/65" />
                <span className="text-[15px] leading-7 text-white/80">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Heads up
            </div>
            <div className="mt-1 text-[14px] leading-6 text-white/75">
              This page is a structured placeholder. Replace with finalized
              legal language when ready.
            </div>
          </div>
        </>
      ),
    },
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      Icon: CheckCircle2,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          By accessing or using Everleap, you agree to these Terms. If you do
          not agree, do not use the service.
        </p>
      ),
    },
    {
      id: "eligibility",
      title: "2. Eligibility & Accounts",
      Icon: UserCheck,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          You are responsible for your account credentials and for all activity
          under your account. If you are under the age required by local laws,
          you must have consent from a parent or guardian.
        </p>
      ),
    },
    {
      id: "use",
      title: "3. Use of the Service",
      Icon: Shield,
      body: (
        <>
          <p className="text-[15px] leading-7 text-white/80">
            Please don’t misuse the service. Examples of prohibited behavior:
          </p>

          <ul className="mt-4 space-y-2">
            {[
              "Do not disrupt, overload, or interfere with the service.",
              "Do not attempt to access data you do not have permission to access.",
              "Follow applicable laws and regulations.",
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
      id: "content",
      title: "4. Content & Feedback",
      Icon: Handshake,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          You retain ownership of content you submit. By submitting content or
          feedback, you grant us a non-exclusive license to use it to operate
          and improve the service.
        </p>
      ),
    },
    {
      id: "privacy",
      title: "5. Privacy",
      Icon: Shield,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          Your use of the service is subject to our{" "}
          <Link
            href="/privacy"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
          >
            Privacy Policy
          </Link>
          .
        </p>
      ),
    },
    {
      id: "thirdparty",
      title: "6. Third-Party Services",
      Icon: Globe,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          We may integrate third-party services. We aren’t responsible for their
          content, availability, or practices.
        </p>
      ),
    },
    {
      id: "disclaimers",
      title: "7. Disclaimers",
      Icon: AlertTriangle,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          The service is provided “as is” without warranties of any kind, to the
          fullest extent permitted by law.
        </p>
      ),
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      Icon: Scale,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          To the fullest extent permitted by law, Everleap will not be liable
          for indirect, incidental, special, consequential, or punitive damages.
        </p>
      ),
    },
    {
      id: "changes",
      title: "9. Changes to the Service or Terms",
      Icon: RefreshCw,
      body: (
        <p className="text-[15px] leading-7 text-white/80">
          We may update the service or these Terms periodically. Updates will be
          posted here with a revised date.
        </p>
      ),
    },
  ];

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="terms_orb"
      ambientCap={0.35}
    >
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8">
        {/* Top header */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold tracking-wide text-white/75">
              Everleap · Terms
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              Updated Oct 4, 2025
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Clear structure, calm visuals, and easy navigation. Replace with
            your finalized legal terms anytime.
          </p>
        </div>

        {/* Reading card */}
        <section className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl">
          {/* One subtle corner glow only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-[220px] w-[220px] rounded-full bg-gradient-to-br from-violet-400/20 via-sky-300/10 to-transparent blur-[70px]"
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
                          <div className="h-9 w-[2px] rounded-full bg-gradient-to-b from-violet-300/70 via-white/10 to-transparent" />
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
                    Questions?
                  </div>
                  <div className="mt-1 text-[14px] leading-6 text-white/75">
                    Reach us via{" "}
                    <Link
                      href="/contact"
                      className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
                    >
                      Contact
                    </Link>
                    .
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/privacy"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/8"
                    >
                      Privacy Policy
                      <ChevronRight className="h-4 w-4 text-white/50" />
                    </Link>
                    <Link
                      href="/accessibility"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/8"
                    >
                      Accessibility
                      <ChevronRight className="h-4 w-4 text-white/50" />
                    </Link>
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
