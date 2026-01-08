// src/app/main/profile/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  GraduationCap,
  MapPin,
  Lock,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

type SpotlightThemeId = "nightDusk" | "berrySoft" | "forestSoft";
type GradientLevel = 1 | 2 | 3;

const THEME_LABELS: Record<SpotlightThemeId, string> = {
  nightDusk: "Night Dusk",
  berrySoft: "Berry Soft",
  forestSoft: "Forest Soft",
};

// Minimal, local theme palette (keeps this page self-contained + lint-safe)
function getThemeColors(themeId: SpotlightThemeId) {
  switch (themeId) {
    case "nightDusk":
      return {
        dark: true,
        bg0: "#070A12",
        bg1: "#0B1221",
        glowA: "#8B5CF6", // violet
        glowB: "#22C55E", // green
        glowC: "#38BDF8", // sky
        card: "rgba(255,255,255,0.08)",
        cardBorder: "rgba(255,255,255,0.12)",
        text: "rgba(255,255,255,0.92)",
        subtext: "rgba(255,255,255,0.70)",
        softText: "rgba(255,255,255,0.55)",
      };
    case "berrySoft":
      return {
        dark: false,
        bg0: "#FFF7FB",
        bg1: "#F7F0FF",
        glowA: "#EC4899", // pink
        glowB: "#8B5CF6", // violet
        glowC: "#FB7185", // rose
        card: "rgba(255,255,255,0.72)",
        cardBorder: "rgba(15,23,42,0.10)",
        text: "rgba(15,23,42,0.92)",
        subtext: "rgba(15,23,42,0.70)",
        softText: "rgba(15,23,42,0.55)",
      };
    case "forestSoft":
    default:
      return {
        dark: false,
        bg0: "#F5FFFB",
        bg1: "#F1F7FF",
        glowA: "#22C55E", // green
        glowB: "#06B6D4", // cyan
        glowC: "#60A5FA", // blue
        card: "rgba(255,255,255,0.72)",
        cardBorder: "rgba(15,23,42,0.10)",
        text: "rgba(15,23,42,0.92)",
        subtext: "rgba(15,23,42,0.70)",
        softText: "rgba(15,23,42,0.55)",
      };
  }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function alphaForLevel(level: GradientLevel) {
  // tuned to be “between 1 and 2” vibe without overwhelming content
  // 1 = subtle, 2 = medium, 3 = richer
  if (level === 1) return 0.18;
  if (level === 2) return 0.28;
  return 0.38;
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
  footer,
  dark,
  card,
  cardBorder,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dark: boolean;
  card: string;
  cardBorder: string;
}) {
  return (
    <section
      className="rounded-2xl p-4 md:p-5 shadow-sm"
      style={{
        background: card,
        border: `1px solid ${cardBorder}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: dark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.06)",
            border: dark
              ? "1px solid rgba(255,255,255,0.14)"
              : "1px solid rgba(15,23,42,0.08)",
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold leading-6">{title}</h2>
              {subtitle ? <p className="mt-0.5 text-sm opacity-75">{subtitle}</p> : null}
            </div>
          </div>

          <div className="mt-3">{children}</div>

          {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  disabled = true,
  dark,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  dark: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium opacity-75">{label}</div>
      <input
        value={value}
        disabled={disabled}
        readOnly
        className={[
          "w-full rounded-xl px-3 py-2 text-sm outline-none",
          "ring-1 transition",
          dark
            ? "bg-white/10 text-white/90 ring-white/15 placeholder:text-white/40"
            : "bg-white/70 text-slate-900 ring-slate-900/10 placeholder:text-slate-500",
        ].join(" ")}
      />
    </label>
  );
}

function ToggleRow({
  label,
  helper,
  disabled = true,
  dark,
}: {
  label: string;
  helper?: string;
  disabled?: boolean;
  dark: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 ring-1"
      style={{
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.60)",
        borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)",
      }}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {helper ? <div className="mt-0.5 text-xs opacity-70">{helper}</div> : null}
      </div>

      <button
        type="button"
        className={[
          "relative h-7 w-12 rounded-full ring-1 transition",
          dark ? "bg-white/10 ring-white/15" : "bg-slate-900/10 ring-slate-900/10",
        ].join(" ")}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={`${label} (coming soon)`}
        title="Coming soon"
      >
        <span
          className={[
            "absolute top-0.5 h-6 w-6 rounded-full",
            "transition",
            dark ? "bg-white/35" : "bg-white",
          ].join(" ")}
          style={{ left: 4 }}
        />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(2);

  const t = getThemeColors(themeId);
  const a = alphaForLevel(gradientLevel);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    color: t.text,
    background: [
      // base wash
      `linear-gradient(180deg, ${t.bg0} 0%, ${t.bg1} 65%, ${t.bg1} 100%)`,
      // soft glows
      `radial-gradient(900px 500px at 20% 10%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 100%)`,
      `radial-gradient(700px 420px at 18% 22%, rgba(255,255,255,${
        t.dark ? 0.03 : 0.20
      }) 0%, rgba(255,255,255,0) 60%)`,
      `radial-gradient(820px 520px at 82% 18%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 100%)`,
      `radial-gradient(900px 600px at 15% 30%, ${hexToRgba(t.glowA, a)} 0%, rgba(0,0,0,0) 60%)`,
      `radial-gradient(900px 600px at 85% 28%, ${hexToRgba(t.glowB, clamp01(a * 0.9))} 0%, rgba(0,0,0,0) 60%)`,
      `radial-gradient(1100px 700px at 50% 78%, ${hexToRgba(
        t.glowC,
        clamp01(a * 0.75),
      )} 0%, rgba(0,0,0,0) 62%)`,
    ].join(", "),
  };

  return (
    <div style={pageStyle}>
      <AppChrome>
        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 md:pt-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <div
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: t.dark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.06)",
                    border: t.dark
                      ? "1px solid rgba(255,255,255,0.14)"
                      : "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  <User className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-semibold leading-7">Profile</h1>
              </div>
              <p className="mt-2 text-sm" style={{ color: t.subtext }}>
                This page will manage your account + personal settings (not your Everleap content).
                For now, it’s a preview.
              </p>
            </div>

            <Link
              href="/main"
              className={[
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
                "ring-1 transition",
                t.dark
                  ? "bg-white/10 text-white/85 ring-white/15 hover:bg-white/15"
                  : "bg-white/60 text-slate-900 ring-slate-900/10 hover:bg-white/75",
              ].join(" ")}
            >
              Back
              <ChevronRight className="h-4 w-4 opacity-70" />
            </Link>
          </div>

          {/* Theme controls */}
          <div
            className="mt-5 rounded-2xl p-4"
            style={{
              background: t.dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)",
              border: t.dark
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(15,23,42,0.10)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 opacity-80" />
                <div className="text-sm font-semibold">Preview controls</div>
              </div>
              <div className="text-xs opacity-70">placeholder UI</div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Theme pills */}
              <button
                type="button"
                onClick={() => setThemeId("nightDusk")}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  themeId === "nightDusk"
                    ? t.dark
                      ? "bg-white/20 ring-white/30"
                      : "bg-slate-900/10 ring-slate-900/15"
                    : t.dark
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/50 ring-slate-900/10 hover:bg-white/70",
                ].join(" ")}
              >
                <Palette className="h-4 w-4 opacity-80" />
                {THEME_LABELS.nightDusk}
              </button>

              <button
                type="button"
                onClick={() => setThemeId("berrySoft")}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  themeId === "berrySoft"
                    ? t.dark
                      ? "bg-white/20 ring-white/30"
                      : "bg-slate-900/10 ring-slate-900/15"
                    : t.dark
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/50 ring-slate-900/10 hover:bg-white/70",
                ].join(" ")}
              >
                <Palette className="h-4 w-4 opacity-80" />
                {THEME_LABELS.berrySoft}
              </button>

              <button
                type="button"
                onClick={() => setThemeId("forestSoft")}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  themeId === "forestSoft"
                    ? t.dark
                      ? "bg-white/20 ring-white/30"
                      : "bg-slate-900/10 ring-slate-900/15"
                    : t.dark
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/50 ring-slate-900/10 hover:bg-white/70",
                ].join(" ")}
              >
                <Palette className="h-4 w-4 opacity-80" />
                {THEME_LABELS.forestSoft}
              </button>

              {/* Gradient pills */}
              <div
                className="mx-1 h-6 w-px opacity-30"
                style={{ background: t.dark ? "white" : "black" }}
              />
              <button
                type="button"
                onClick={() => setGradientLevel(1)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  gradientLevel === 1
                    ? t.dark
                      ? "bg-white/20 ring-white/30"
                      : "bg-slate-900/10 ring-slate-900/15"
                    : t.dark
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/50 ring-slate-900/10 hover:bg-white/70",
                ].join(" ")}
              >
                Subtle
              </button>
              <button
                type="button"
                onClick={() => setGradientLevel(2)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  gradientLevel === 2
                    ? t.dark
                      ? "bg-white/20 ring-white/30"
                      : "bg-slate-900/10 ring-slate-900/15"
                    : t.dark
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/50 ring-slate-900/10 hover:bg-white/70",
                ].join(" ")}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setGradientLevel(3)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  gradientLevel === 3
                    ? t.dark
                      ? "bg-white/20 ring-white/30"
                      : "bg-slate-900/10 ring-slate-900/15"
                    : t.dark
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/50 ring-slate-900/10 hover:bg-white/70",
                ].join(" ")}
              >
                Rich
              </button>
            </div>
          </div>

          {/* Content grid */}
          <div className="mt-5 grid grid-cols-1 gap-4">
            <SectionCard
              title="Basics"
              subtitle="Who you are on the account level (coming soon)."
              icon={<Mail className="h-5 w-5 opacity-90" />}
              dark={t.dark}
              card={t.card}
              cardBorder={t.cardBorder}
              footer={
                <button
                  type="button"
                  disabled
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                    "ring-1 transition opacity-70",
                    t.dark ? "bg-white/10 text-white ring-white/15" : "bg-white/60 text-slate-900 ring-slate-900/10",
                  ].join(" ")}
                  title="Coming soon"
                >
                  Edit basics (coming soon)
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </button>
              }
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field label="Display name" value="(placeholder)" dark={t.dark} />
                <Field label="Email" value="(placeholder)" dark={t.dark} />
              </div>
            </SectionCard>

            <SectionCard
              title="About you"
              subtitle="General info to personalize the experience (not Everleap content)."
              icon={<GraduationCap className="h-5 w-5 opacity-90" />}
              dark={t.dark}
              card={t.card}
              cardBorder={t.cardBorder}
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field label="School / organization" value="(placeholder)" dark={t.dark} />
                <Field label="Grade / level" value="(placeholder)" dark={t.dark} />
              </div>
              <div className="mt-3">
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2 ring-1"
                  style={{
                    background: t.dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.60)",
                    borderColor: t.dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)",
                  }}
                >
                  <MapPin className="h-4 w-4 opacity-80" />
                  <div className="text-sm">
                    City / timezone: <span className="opacity-70">(placeholder)</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Preferences"
              subtitle="Style + notifications. (Preview only.)"
              icon={<Bell className="h-5 w-5 opacity-90" />}
              dark={t.dark}
              card={t.card}
              cardBorder={t.cardBorder}
            >
              <div className="grid grid-cols-1 gap-2">
                <ToggleRow
                  label="Notifications"
                  helper="Reminders, nudges, and progress check-ins."
                  dark={t.dark}
                />
                <ToggleRow
                  label="Email updates"
                  helper="Occasional product updates. (Off by default later.)"
                  dark={t.dark}
                />
                <ToggleRow
                  label="Reduce motion"
                  helper="Less animation for calmer screens."
                  dark={t.dark}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Privacy & security"
              subtitle="Controls for your account and data rights (links for now)."
              icon={<Shield className="h-5 w-5 opacity-90" />}
              dark={t.dark}
              card={t.card}
              cardBorder={t.cardBorder}
            >
              <div className="grid grid-cols-1 gap-2">
                <LinkRow
                  href="/privacy"
                  label="Privacy policy"
                  icon={<Lock className="h-4 w-4 opacity-80" />}
                  dark={t.dark}
                />
                <LinkRow
                  href="/terms"
                  label="Terms of service"
                  icon={<Lock className="h-4 w-4 opacity-80" />}
                  dark={t.dark}
                />
                <div
                  className="rounded-xl px-3 py-2 ring-1"
                  style={{
                    background: t.dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.60)",
                    borderColor: t.dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)",
                  }}
                >
                  <div className="text-sm font-medium">Download / delete account data</div>
                  <div className="mt-0.5 text-xs opacity-70">
                    Coming soon — this will be handled through verified requests.
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Bottom hint */}
          <div className="mt-5 text-xs" style={{ color: t.softText }}>
            Note: This Profile page is intentionally <span className="font-medium">not</span>{" "}
            for Everleap “app content” (goals, insights, recommendations). That stays inside the
            main experience.
          </div>
        </main>

        <BottomNav />
      </AppChrome>
    </div>
  );
}

function LinkRow({
  href,
  label,
  icon,
  dark,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  dark: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-between gap-3 rounded-xl px-3 py-2 ring-1 transition",
        dark ? "hover:bg-white/10" : "hover:bg-white/75",
      ].join(" ")}
      style={{
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.60)",
        borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.05)",
            border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
          }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{label}</div>
          <div className="truncate text-xs opacity-70">Opens the policy page</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 opacity-60" />
    </Link>
  );
}

function hexToRgba(hex: string, alpha: number) {
  // supports #RRGGBB
  const h = hex.replace("#", "").trim();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${clamp01(alpha)})`;
}
