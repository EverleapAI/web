// src/app/login/page.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Mail,
  Phone,
} from "lucide-react";

import BrandBadge from "@/components/site/BrandBadge";
import { OnboardingFooterNav } from "@/components/site/OnboardingFooterNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

/* ========= Tiny icon marks (no extra deps) ========= */

function GoogleMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M21.6 12.27c0-.68-.06-1.18-.19-1.71H12v3.27h5.47c-.11.81-.7 2.04-2 2.86l-.02.1 2.97 2.26.2.02c1.82-1.64 2.98-4.06 2.98-6.8Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.97-.87 6.62-2.37l-3.15-2.38c-.84.57-1.97.97-3.47.97a6 6 0 0 1-5.66-4.03l-.1.01-3.08 2.33-.03.1A10 10 0 0 0 12 22Z"
      />
      <path
        fill="currentColor"
        d="M6.34 13.82A5.92 5.92 0 0 1 6 12c0-.63.12-1.24.32-1.82l-.01-.12-3.12-2.37-.1.05A10.02 10.02 0 0 0 2 12c0 1.61.4 3.13 1.09 4.46l3.25-2.64Z"
      />
      <path
        fill="currentColor"
        d="M12 6c1.83 0 3.06.77 3.76 1.42l2.75-2.6C16.96 3.4 14.7 2 12 2A10 10 0 0 0 3.09 7.55l3.22 2.45A6.02 6.02 0 0 1 12 6Z"
      />
    </svg>
  );
}

function AppleMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M16.86 13.36c.02 2.17 1.92 2.89 1.94 2.9-.01.05-.3 1.03-1 2.03-.6.88-1.23 1.75-2.2 1.77-.95.02-1.26-.55-2.35-.55s-1.44.53-2.34.57c-.94.03-1.65-.94-2.26-1.8-1.23-1.74-2.17-4.92-.9-7.07.63-1.07 1.75-1.75 2.97-1.77.92-.02 1.8.6 2.35.6.56 0 1.6-.74 2.7-.63.46.02 1.74.18 2.57 1.35-.07.04-1.54.88-1.52 2.6ZM14.97 4.68c.5-.6.84-1.44.75-2.28-.73.03-1.62.47-2.14 1.07-.48.55-.9 1.42-.79 2.26.82.06 1.66-.41 2.18-1.05Z"
      />
    </svg>
  );
}

function MicrosoftMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z" />
    </svg>
  );
}

function DiscordMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M16.7 5.23c-1.05-.49-2.17-.84-3.33-1.03-.16.3-.34.7-.46 1.02-1.23-.19-2.46-.19-3.67 0-.12-.32-.31-.72-.47-1.02-1.16.19-2.28.54-3.33 1.03C3.33 8 2.68 10.67 2.9 13.3c1.24.92 2.44 1.48 3.62 1.85.29-.4.55-.83.77-1.28-.42-.16-.83-.35-1.22-.58.1-.07.2-.15.3-.22 2.35 1.08 4.9 1.08 7.22 0 .1.07.2.15.3.22-.39.23-.8.42-1.22.58.22.45.48.88.77 1.28 1.18-.37 2.38-.93 3.62-1.85.26-2.93-.44-5.58-2.44-8.07ZM9.08 12.33c-.7 0-1.27-.64-1.27-1.43 0-.78.56-1.43 1.27-1.43.71 0 1.28.65 1.27 1.43 0 .79-.56 1.43-1.27 1.43Zm5.84 0c-.7 0-1.27-.64-1.27-1.43 0-.78.56-1.43 1.27-1.43.71 0 1.28.65 1.27 1.43 0 .79-.56 1.43-1.27 1.43Z"
      />
    </svg>
  );
}

/* ========= Main Page ========= */

type ProviderId = "google" | "apple" | "microsoft" | "discord";

/** Minimal shape of NavigatorUAData for platform detection (safe + no `any`). */
type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

function getDeviceLabel(): string {
  if (typeof navigator === "undefined") return "Use your device";
  const ua = navigator.userAgent || "";
  const nav = navigator as NavigatorWithUAData;

  const platform = nav.userAgentData?.platform ?? (navigator.platform ?? "");
  const isWindows = /Windows/i.test(ua) || /Win/i.test(platform);
  const isMac = /Mac/i.test(ua) || /Mac/i.test(platform);
  const isIPhone = /iPhone/i.test(ua);
  const isIPad = /iPad/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isWindows) return "Windows Hello";
  if (isIPhone) return "Face ID / Touch ID";
  if (isIPad) return "Touch ID / Face ID";
  if (isMac) return "Touch ID";
  if (isAndroid) return "Device biometrics";
  return "Use your device";
}

async function detectPasskeySupport(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;

    if (typeof PublicKeyCredential === "undefined") return false;

    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
      const ok = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return Boolean(ok);
    }

    return true;
  } catch {
    return false;
  }
}

/* ========= DEV AUTH STUB (client-only) =========
   Matches BottomNav gate keys + logout clearing keys. */

function writeDevAuthStub(opts?: { displayName?: string; provider?: ProviderId; identifier?: string }) {
  if (typeof window === "undefined") return;

  const displayName = (opts?.displayName ?? "Dev User").trim() || "Dev User";
  const session = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    window.localStorage.setItem("everleap.verified", "1");
    window.localStorage.setItem("everleap.userId", "dev_user");
    window.localStorage.setItem("everleap.session", session);
    window.localStorage.setItem("everleap.displayName", displayName);

    if (opts?.provider) window.localStorage.setItem("everleap.dev.provider", opts.provider);
    if (opts?.identifier) window.localStorage.setItem("everleap.dev.identifier", opts.identifier);
  } catch {
    // ignore
  }

  // Nudge other tabs/components relying on storage listeners.
  try {
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");

  // Visuals: align to the rest of the minimalist flow
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(1);

  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient = GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ?? GRADIENT_CONFIGS[1];

  const dark = isDarkTheme(themeId);

  const bgImage = gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const bgStyle: CSSProperties = bgImage ? { backgroundImage: bgImage } : {};

  const mutedText = dark ? "text-white/55" : "text-slate-700/65";
  const divider = dark ? "border-white/10" : "border-slate-200/70";

  const [passkeyReady, setPasskeyReady] = React.useState<boolean | null>(null);
  const [deviceLabel, setDeviceLabel] = React.useState<string>("Use your device");
  const [showFallback, setShowFallback] = React.useState(false);

  React.useEffect(() => {
    setDeviceLabel(getDeviceLabel());
    let alive = true;
    void detectPasskeySupport().then((ok) => {
      if (!alive) return;
      setPasskeyReady(ok);
      if (!ok) setShowFallback(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/onboarding");
  }

  function goMain() {
    router.push("/main");
  }

  function signInDevAndGo(meta?: { provider?: ProviderId; identifier?: string }) {
    writeDevAuthStub({
      displayName: "Dev User",
      provider: meta?.provider,
      identifier: meta?.identifier,
    });
    goMain();
  }

  function handleProvider(p: ProviderId) {
    signInDevAndGo({ provider: p });
  }

  function handleDeviceContinue() {
    // DEV STUB: clicking Continue signs you in locally and enters /main
    signInDevAndGo();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = identifier.trim();
    if (!id) return;
    signInDevAndGo({ identifier: id });
  }

  const providerBtnBase =
    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const providerBtnTheme = dark
    ? "border-white/12 bg-white/5 text-white/80 hover:bg-white/8 hover:border-white/20"
    : "border-slate-200/80 bg-white/70 text-slate-800 hover:bg-white";

  const primaryRowBase =
    "group w-full max-w-2xl rounded-2xl border px-5 py-4 text-left transition active:scale-[0.99]";
  const primaryRowTheme = dark
    ? "border-white/12 bg-white/5 hover:bg-white/7 hover:border-white/20"
    : "border-slate-200/70 bg-white/75 hover:bg-white";

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="login_orb"
      ambientCap={0.22}
    >
      <div className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`} style={bgStyle}>
        {/* Minimal ambient (consistent with onboarding/consent vibe) */}
        {gradientLevel > 0 && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: gradient.ambientOpacity * 0.42 }}>
            <div className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl ${theme.ambientTopLeftClass}`} />
            <div
              className={`absolute top-72 right-[-220px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
              style={{ opacity: 0.32 }}
            />
          </div>
        )}

        <BrandBadge />

        <main className="relative z-10 flex flex-1 flex-col px-6 pb-24 pt-10">
          {/* Top row */}
          <div className="mx-auto w-full max-w-[980px]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white/90 transition"
                aria-label="Back"
                title="Back"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="text-xs text-white/35">
                <Link href="/privacy" className="hover:text-white/55 transition">
                  Privacy
                </Link>
                <span className="mx-2">·</span>
                <Link href="/terms" className="hover:text-white/55 transition">
                  Terms
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto mt-12 w-full max-w-[980px]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-eyebrow text-white/45 uppercase">Everleap · Sign in</p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Continue into Everleap
              </h1>

              <p className={`mt-4 text-label leading-7 ${mutedText}`}>Use your device.</p>

              {/* Primary: device / passkey */}
              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleDeviceContinue}
                  className={`${primaryRowBase} ${primaryRowTheme}`}
                  aria-label="Continue with your device"
                  title="Continue"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/6">
                        <KeyRound className="h-4 w-4 text-white/80" />
                      </span>

                      <div className="min-w-0">
                        <div className="text-label font-semibold text-white/90">Continue</div>
                        <div className="mt-1 text-sm text-white/45">
                          {passkeyReady === null
                            ? "Checking secure sign-in…"
                            : passkeyReady
                            ? `${deviceLabel} · Quick sign-in`
                            : "Secure device sign-in not available here"}
                        </div>
                      </div>
                    </div>

                    <div className="text-white/35 group-hover:text-white/55 transition" aria-hidden="true">
                      →
                    </div>
                  </div>
                </button>

                {/* Providers (always visible, minimal icon buttons) */}
                <div className="mt-10">
                  <div className="text-micro tracking-eyebrow text-white/35 uppercase">Or</div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleProvider("google")}
                      className={`${providerBtnBase} ${providerBtnTheme}`}
                      aria-label="Continue with Google"
                      title="Google"
                    >
                      <GoogleMark className="h-4 w-4" />
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProvider("apple")}
                      className={`${providerBtnBase} ${providerBtnTheme}`}
                      aria-label="Continue with Apple"
                      title="Apple"
                    >
                      <AppleMark className="h-4 w-4" />
                      Apple
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProvider("microsoft")}
                      className={`${providerBtnBase} ${providerBtnTheme}`}
                      aria-label="Continue with Microsoft"
                      title="Microsoft"
                    >
                      <MicrosoftMark className="h-4 w-4" />
                      Microsoft
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProvider("discord")}
                      className={`${providerBtnBase} ${providerBtnTheme}`}
                      aria-label="Continue with Discord"
                      title="Discord"
                    >
                      <DiscordMark className="h-4 w-4" />
                      Discord
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className={`mt-10 border-t ${divider}`} />

                {/* Fallback: progressive disclosure when passkey is available */}
                <div className="mt-7">
                  {passkeyReady ? (
                    <button
                      type="button"
                      onClick={() => setShowFallback((v) => !v)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white/85 transition"
                      aria-label={showFallback ? "Hide other methods" : "Use another method"}
                      title={showFallback ? "Hide" : "Use another method"}
                    >
                      {showFallback ? "Hide" : "Use another method"}
                      {showFallback ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  ) : null}

                  {showFallback ? (
                    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
                      <label className="block">
                        <div className="text-micro font-semibold tracking-eyebrow text-white/35 uppercase">
                          Email or phone
                        </div>

                        <div className="mt-3 flex items-end gap-3">
                          <div className="flex-1 border-b border-white/18 focus-within:border-white/40 transition">
                            <input
                              type="text"
                              value={identifier}
                              onChange={(e) => setIdentifier(e.target.value)}
                              placeholder="you@example.com or (555) 555-1234"
                              inputMode="email"
                              autoComplete="email"
                              className="w-full bg-transparent py-3 text-body text-white/90 placeholder:text-white/30 outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!identifier.trim()}
                            className={`h-10 w-10 rounded-full transition active:scale-95 ${
                              identifier.trim()
                                ? "bg-white/80 text-black hover:bg-white"
                                : "bg-white/10 text-white/35 cursor-not-allowed"
                            }`}
                            aria-label="Continue"
                            title="Continue"
                          >
                            →
                          </button>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            email
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            phone
                          </span>
                        </div>
                      </label>

                      <p className="mt-6 text-micro text-white/35">Secure sign-in options will be wired up soon.</p>
                    </form>
                  ) : (
                    <p className="mt-6 text-micro text-white/35">Secure sign-in options will be wired up soon.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <OnboardingFooterNav />
      </div>
    </AppChrome>
  );
}
