"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  LifeBuoy,
  Accessibility,
  ChevronRight,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import {
  DEFAULT_THEME_ID,
  DEFAULT_GRADIENT_LEVEL,
  getThemeById,
  getGradientConfig,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

/* =============================================================================
   UI helpers
   ============================================================================= */

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function pagePadding() {
  return "pb-24 pt-2 sm:pt-3 lg:pt-5";
}

function pageShell() {
  return "mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10";
}

function ring(dark: boolean) {
  return dark ? "ring-1 ring-white/10" : "ring-1 ring-black/8";
}

function surface(dark: boolean) {
  return dark ? "bg-white/5" : "bg-white/80";
}

function muted(dark: boolean) {
  return dark ? "text-white/60" : "text-slate-600";
}

function text(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function softText(dark: boolean) {
  return dark ? "text-white/78" : "text-slate-700";
}

function divider(dark: boolean) {
  return dark ? "border-white/10" : "border-black/10";
}

function rowHover(dark: boolean) {
  return dark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.03]";
}

function iconChip(dark: boolean) {
  return dark
    ? "border-white/12 bg-white/8 text-white/85"
    : "border-black/10 bg-white/85 text-slate-900";
}

function primaryButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-5 py-2.5",
    "text-sm font-semibold transition active:scale-[0.98]",
    "backdrop-blur-xl",
    dark
      ? "border-emerald-300/18 bg-emerald-300/12 text-emerald-50 hover:bg-emerald-300/16 shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
      : "border-emerald-500/18 bg-emerald-500/10 text-emerald-900 hover:bg-emerald-500/14 shadow-[0_14px_40px_rgba(0,0,0,0.10)]",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/28"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/18",
  ].join(" ");
}

function quietButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-4 py-2",
    "text-sm font-semibold transition active:scale-[0.99]",
    dark
      ? "border-white/12 bg-white/6 text-white/80 hover:bg-white/10"
      : "border-black/10 bg-white/75 text-slate-900 hover:bg-white",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/16"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/12",
  ].join(" ");
}

function pill(dark: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    "text-[11px] font-semibold uppercase tracking-[0.18em]",
    dark
      ? "border-amber-300/16 bg-amber-300/10 text-amber-100"
      : "border-amber-500/18 bg-amber-500/10 text-amber-900",
  ].join(" ");
}

function SectionHeader({
  title,
  hint,
  dark,
}: {
  title: string;
  hint?: string;
  dark: boolean;
}) {
  return (
    <div className="mt-4 flex items-end justify-between gap-3 px-1 sm:mt-5 lg:mt-6">
      <div className="text-sm font-semibold">{title}</div>
      {hint ? <div className={`text-[11px] ${muted(dark)}`}>{hint}</div> : null}
    </div>
  );
}

function Row({
  href,
  onClick,
  icon,
  label,
  detail,
  right,
  dark,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  detail?: string;
  right?: React.ReactNode;
  dark: boolean;
}) {
  const content = (
    <div
      className={[
        "flex items-center justify-between gap-3 px-4 py-3.5",
        "transition",
        rowHover(dark),
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
            iconChip(dark),
          ].join(" ")}
        >
          {icon}
        </span>

        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold">{label}</div>
          {detail ? (
            <div className={`mt-0.5 truncate text-[12px] ${muted(dark)}`}>
              {detail}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {right ?? null}
        <ChevronRight
          className={dark ? "h-4 w-4 text-white/40" : "h-4 w-4 text-slate-400"}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="block w-full text-left" onClick={onClick}>
      {content}
    </button>
  );
}

/* =============================================================================
   Auth
   ============================================================================= */

type AuthState = {
  isAuthed: boolean;
  displayName?: string;
  isDev?: boolean;
};

function readAuthState(): AuthState {
  try {
    const verified = localStorage.getItem("everleap.verified");
    const userId = localStorage.getItem("everleap.userId");
    const session = localStorage.getItem("everleap.session");

    const isAuthed = Boolean(verified || userId || session);

    const displayName =
      localStorage.getItem("everleap.displayName") ??
      localStorage.getItem("everleap.name") ??
      undefined;

    const isDev =
      (userId ?? "") === "dev_user" ||
      (session ?? "").startsWith("dev_") ||
      (displayName ?? "") === "Dev User";

    return { isAuthed, displayName: displayName?.trim() || undefined, isDev };
  } catch {
    return { isAuthed: false };
  }
}

function writeDevAuthStub(opts?: { displayName?: string }) {
  if (typeof window === "undefined") return;

  const displayName = (opts?.displayName ?? "Dev User").trim() || "Dev User";
  const session = `dev_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  try {
    window.localStorage.setItem("everleap.verified", "1");
    window.localStorage.setItem("everleap.userId", "dev_user");
    window.localStorage.setItem("everleap.session", session);
    window.localStorage.setItem("everleap.displayName", displayName);
  } catch {
    // ignore
  }

  try {
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }
}

/* =============================================================================
   Page
   ============================================================================= */

export default function ProfilePage() {
  const router = useRouter();

  const themeId = DEFAULT_THEME_ID as SpotlightThemeId;
  const gradientLevel = DEFAULT_GRADIENT_LEVEL as GradientLevel;

  const theme = getThemeById(themeId);
  const grad = getGradientConfig(gradientLevel);
  const dark = isDarkTheme(themeId);

  const bgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: React.CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  const [auth, setAuth] = React.useState<AuthState>({ isAuthed: false });

  React.useEffect(() => {
    setAuth(readAuthState());

    const refresh = () => setAuth(readAuthState());
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  function signInDevAndGo() {
    writeDevAuthStub({ displayName: auth.displayName ?? "Dev User" });
    setAuth(readAuthState());
    router.push("/main");
  }

  function goLogout() {
    router.push("/logout");
  }

  const ambient = Math.min(clamp01(grad.ambientOpacity), 0.22);

  return (
    <AppChrome
      themeId={themeId}
      gradientLevel={gradientLevel}
      orbSource="profile_me"
      ambientCap={0.22}
    >
      <div
        className={`relative min-h-[100svh] ${theme.pageBgBaseClass}`}
        style={bgStyle}
      >
        {gradientLevel > 0 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: ambient * 0.42 }}
            aria-hidden
          >
            <div
              className={`absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute right-[-220px] top-72 h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
              style={{ opacity: 0.32 }}
            />
          </div>
        )}

        <main className={`relative z-10 ${pagePadding()}`}>
          <div className={pageShell()}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
                      iconChip(dark),
                    ].join(" ")}
                  >
                    <User className="h-5 w-5 opacity-90" />
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="truncate text-xl font-semibold">Me</h1>
                      {auth.isDev ? (
                        <span className={pill(dark)} title="Development-only login">
                          DEV MODE
                        </span>
                      ) : null}
                    </div>

                    <div className={`mt-0.5 text-[12px] ${muted(dark)}`}>
                      Account + support (not your Insights content).
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/main"
                className={quietButton(dark)}
                aria-label="Back to main"
                title="Back"
              >
                Back
                <ChevronRight className="h-4 w-4 opacity-70" />
              </Link>
            </div>

            <div
              className={[
                "relative mt-4 overflow-hidden rounded-3xl px-4 py-4 sm:mt-5 sm:px-5 sm:py-5 lg:mt-6 lg:px-6 lg:py-5",
                ring(dark),
                surface(dark),
                "backdrop-blur-2xl",
                dark
                  ? "shadow-[0_22px_80px_rgba(0,0,0,0.22)]"
                  : "shadow-[0_14px_40px_rgba(0,0,0,0.10)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-sky-400/70" />

                <div
                  className={[
                    "absolute -left-20 -top-16 h-[280px] w-[280px] rounded-full blur-3xl",
                    dark ? "bg-sky-400/12" : "bg-sky-400/8",
                  ].join(" ")}
                />
                <div
                  className={[
                    "absolute -bottom-20 -right-20 h-[320px] w-[320px] rounded-full blur-3xl",
                    dark ? "bg-emerald-400/10" : "bg-emerald-400/7",
                  ].join(" ")}
                />

                <div
                  className={[
                    "absolute right-5 top-5 opacity-[0.10] blur-[0.6px]",
                    dark ? "text-sky-200" : "text-sky-700",
                  ].join(" ")}
                  aria-hidden
                >
                  <Sparkles className="h-14 w-14" />
                </div>

                <div
                  className={[
                    "absolute inset-x-0 top-0 h-px",
                    dark ? "bg-white/10" : "bg-black/8",
                  ].join(" ")}
                />
              </div>

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className={`text-[16px] font-semibold ${text(dark)}`}>
                    {auth.displayName ? auth.displayName : "You"}
                  </div>

                  {auth.isDev ? (
                    <div
                      className={pill(dark)}
                      title="This is a temporary dev-only auth stub"
                    >
                      DEV AUTH STUB
                    </div>
                  ) : null}
                </div>

                <div className={`mt-1 text-sm ${softText(dark)}`}>
                  {auth.isAuthed
                    ? auth.isDev
                      ? "Signed in using a temporary dev stub."
                      : "Signed in on this device."
                    : "Not signed in yet — sign in to unlock Today, Insights, Explore, and Actions."}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {auth.isAuthed ? (
                    <button
                      type="button"
                      className={primaryButton(dark)}
                      onClick={goLogout}
                    >
                      <LogOut className="h-4 w-4 opacity-90" />
                      Log out
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={primaryButton(dark)}
                      onClick={signInDevAndGo}
                    >
                      <LogIn className="h-4 w-4 opacity-90" />
                      Sign in
                    </button>
                  )}

                  <button
                    type="button"
                    className={[quietButton(dark), "cursor-not-allowed opacity-70"].join(
                      " "
                    )}
                    disabled
                    aria-disabled
                    title="Coming soon"
                  >
                    Edit profile (soon)
                  </button>
                </div>

                <div className={`mt-3 text-[12px] ${muted(dark)}`}>
                  Everleap content (insights, logs, goals) lives inside the main
                  experience — this is just account + support.
                </div>
              </div>
            </div>

            <SectionHeader title="Account" hint="Basics" dark={dark} />
            <div
              className={[
                "overflow-hidden rounded-3xl border backdrop-blur-2xl",
                ring(dark),
                surface(dark),
              ].join(" ")}
            >
              <div className={`border-b ${divider(dark)}`}>
                <Row
                  href="/login"
                  icon={<Mail className="h-5 w-5 opacity-90" />}
                  label="Sign-in methods"
                  detail="Passkeys + providers (coming soon)"
                  dark={dark}
                />
              </div>

              <div className={auth.isAuthed ? "" : `border-t ${divider(dark)}`}>
                <Row
                  onClick={auth.isAuthed ? goLogout : signInDevAndGo}
                  icon={
                    auth.isAuthed ? (
                      <LogOut className="h-5 w-5 opacity-90" />
                    ) : (
                      <LogIn className="h-5 w-5 opacity-90" />
                    )
                  }
                  label={auth.isAuthed ? "Log out" : "Sign in"}
                  detail={
                    auth.isAuthed
                      ? "Ends your session on this device"
                      : "Dev stub: unlock the main app"
                  }
                  dark={dark}
                />
              </div>
            </div>

            <SectionHeader title="Help & legal" hint="Trust + support" dark={dark} />
            <div
              className={[
                "overflow-hidden rounded-3xl border backdrop-blur-2xl",
                ring(dark),
                surface(dark),
              ].join(" ")}
            >
              <div className={`border-b ${divider(dark)}`}>
                <Row
                  href="/contact"
                  icon={<LifeBuoy className="h-5 w-5 opacity-90" />}
                  label="Contact Everleap"
                  detail="Questions, feedback, support"
                  dark={dark}
                />
              </div>

              <div className={`border-b ${divider(dark)}`}>
                <Row
                  href="/privacy"
                  icon={<Shield className="h-5 w-5 opacity-90" />}
                  label="Privacy policy"
                  detail="How data is handled"
                  dark={dark}
                />
              </div>

              <div className={`border-b ${divider(dark)}`}>
                <Row
                  href="/terms"
                  icon={<Shield className="h-5 w-5 opacity-90" />}
                  label="Terms of service"
                  detail="The rules of the road"
                  dark={dark}
                />
              </div>

              <div>
                <Row
                  href="/accessibility"
                  icon={<Accessibility className="h-5 w-5 opacity-90" />}
                  label="Accessibility"
                  detail="How we support different needs"
                  dark={dark}
                />
              </div>
            </div>

            <div className={`mt-4 px-1 text-[12px] sm:mt-5 lg:mt-6 ${muted(dark)}`}>
              Tip: If the app ever feels “off,” use{" "}
              <span
                className={
                  dark ? "font-semibold text-white/75" : "font-semibold text-slate-800"
                }
              >
                Contact Everleap
              </span>{" "}
              and tell us what screen you were on — we’ll fix it.
            </div>
          </div>
        </main>

        <BottomNav
          activeKey="profile"
          themeId={themeId}
          gradientLevel={gradientLevel}
        />
      </div>
    </AppChrome>
  );
}