// src/app/contact/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  Shield,
  FileText,
  Accessibility,
  ChevronRight,
} from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import { type SpotlightThemeId, type GradientLevel } from "@/theme/everleapVisuals";

type ContactMode = "support" | "feedback" | "privacy";

export default function ContactPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const [mode, setMode] = React.useState<ContactMode>("support");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const modeCopy: Record<
    ContactMode,
    { label: string; Icon: React.ComponentType<{ className?: string }>; hint: string }
  > = {
    support: {
      label: "Support",
      Icon: MessageSquare,
      hint: "Something not working? Tell us what happened.",
    },
    feedback: {
      label: "Feedback",
      Icon: Sparkles,
      hint: "Ideas to make Everleap better? We want them.",
    },
    privacy: {
      label: "Privacy",
      Icon: Shield,
      hint: "Questions about data, consent, or deletion requests.",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: not wired yet.
    // Keep state so it "feels" real for demos.
  };

  const inputBase =
    "w-full rounded-2xl border px-4 py-3 text-[14px] leading-6 outline-none transition";
  const inputTheme =
    "border-white/12 bg-white/5 text-white/85 placeholder:text-white/40 focus:border-white/22 focus:ring-2 focus:ring-white/10";

  const selected = modeCopy[mode];
  const SelectedIcon = selected.Icon;

  const canSubmit = (email.trim().length > 2 || name.trim().length > 0) && message.trim().length > 0;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="contact_orb"
      ambientCap={0.35}
    >
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8">
        {/* Top header */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold tracking-wide text-white/75">
              Everleap · Contact
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              Not wired yet (design placeholder)
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Contact us
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Support, feedback, and accessibility — all in one place. This page is
            designed to feel modern even before the backend is connected.
          </p>
        </div>

        {/* Main card */}
        <section className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl">
          {/* One subtle corner glow only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-[220px] w-[220px] rounded-full bg-gradient-to-br from-sky-400/18 via-cyan-300/10 to-transparent blur-[70px]"
          />

          <div className="relative">
            {/* Mode chips */}
            <div className="border-b border-white/10 px-5 py-4 md:px-7">
              <div className="flex flex-wrap items-center gap-2">
                {(["support", "feedback", "privacy"] as ContactMode[]).map((k) => {
                  const active = mode === k;
                  const Icon = modeCopy[k].Icon;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setMode(k)}
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        active
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-white/12 bg-white/5 text-white/70 hover:bg-white/8",
                      ].join(" ")}
                    >
                      <Icon className={active ? "h-4 w-4 text-white/90" : "h-4 w-4 text-white/60"} />
                      {modeCopy[k].label}
                    </button>
                  );
                })}

                <div className="ml-1 hidden text-xs text-white/50 md:block">
                  • Choose a topic to keep messages organized
                </div>
              </div>
            </div>

            <div className="px-5 py-6 md:px-7 md:py-7">
              <div className="mx-auto max-w-[72ch]">
                {/* Mini intro */}
                <div className="mb-6 flex items-start gap-4">
                  <div className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/6">
                    <SelectedIcon className="h-5 w-5 text-white/80" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-[2px] rounded-full bg-gradient-to-b from-sky-300/70 via-white/10 to-transparent" />
                      <h2 className="text-xl font-semibold text-white">
                        Send a message
                      </h2>
                    </div>
                    <p className="mt-2 text-[15px] leading-7 text-white/75">
                      {selected.hint}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs text-white/55">
                        Your name (optional)
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="e.g., Jordan"
                        aria-label="Your name"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-white/55">
                        Email (optional)
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="e.g., you@example.com"
                        aria-label="Email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-white/55">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputBase} ${inputTheme} min-h-[160px] resize-none`}
                      placeholder={
                        mode === "support"
                          ? "What happened? What page were you on? Any error text?"
                          : mode === "feedback"
                          ? "What should Everleap add or improve?"
                          : "What privacy request or question do you have?"
                      }
                      aria-label="Message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={[
                      "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition active:scale-[0.99]",
                      canSubmit
                        ? "border border-white/18 bg-white/12 text-white hover:bg-white/16 shadow-sm shadow-black/25"
                        : "cursor-not-allowed border border-white/10 bg-white/6 text-white/40",
                    ].join(" ")}
                  >
                    <Send className="h-4 w-4" />
                    Send message
                  </button>

                  <div className="text-xs text-white/45">
                    This form isn’t wired yet — it’s a design placeholder for now.
                  </div>
                </form>

                {/* Direct email + quick links */}
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/20">
                      <Mail className="h-5 w-5 text-white/75" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white/85">
                        Email
                      </div>
                      <div className="mt-1 text-[14px] leading-6 text-white/70">
                        <a
                          href="mailto:info@everleap.ai"
                          className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
                        >
                          info@everleap.ai
                        </a>
                      </div>
                      <div className="mt-1 text-xs text-white/45">
                        Best for longer notes or attachments (later).
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="text-sm font-semibold text-white/85">
                      Quick links
                    </div>

                    <div className="mt-2 space-y-1">
                      <Link
                        href="/privacy"
                        className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-white/75 hover:bg-white/6"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Shield className="h-4 w-4 text-white/55" />
                          Privacy
                        </span>
                        <ChevronRight className="h-4 w-4 text-white/35" />
                      </Link>

                      <Link
                        href="/terms"
                        className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-white/75 hover:bg-white/6"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FileText className="h-4 w-4 text-white/55" />
                          Terms of service
                        </span>
                        <ChevronRight className="h-4 w-4 text-white/35" />
                      </Link>

                      <Link
                        href="/accessibility"
                        className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-white/75 hover:bg-white/6"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Accessibility className="h-4 w-4 text-white/55" />
                          Accessibility
                        </span>
                        <ChevronRight className="h-4 w-4 text-white/35" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Tiny footer note */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    What we’ll add later
                  </div>
                  <div className="mt-1 text-[14px] leading-6 text-white/75">
                    When we wire this up, we’ll show “Sent ✅” feedback and route
                    messages by topic (Support / Feedback / Privacy).
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
