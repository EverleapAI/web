"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { startRegistration } from "@simplewebauthn/browser";

type Phase = "boy" | "girl";

export default function HomePage() {
  const boyRef = React.useRef<HTMLVideoElement>(null);
  const girlRef = React.useRef<HTMLVideoElement>(null);

  const [videoError, setVideoError] = React.useState(false);

  const [boyReady, setBoyReady] = React.useState(false);
  const [girlReady, setGirlReady] = React.useState(false);

  const [phase, setPhase] = React.useState<Phase>("boy");

  const [passkeyBusy, setPasskeyBusy] = React.useState(false);
  const [passkeyMessage, setPasskeyMessage] = React.useState<string | null>(null);

  // Guard so we don’t retrigger fade repeatedly during timeupdate
  const fadingRef = React.useRef(false);

  const FADE_S = 1.4;

  // Breakpoint detector (md = 768px)
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Auth gate
  const [authed, setAuthed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let alive = true;

    fetch("/api/auth-check", { cache: "no-store" })
      .then((r) => {
        if (!alive) return;
        setAuthed(r.ok);
      })
      .catch(() => {
        if (!alive) return;
        setAuthed(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const registerPasskey = React.useCallback(async () => {
    try {
      setPasskeyBusy(true);
      setPasskeyMessage(null);

      const optionsRes = await fetch("/api/auth/passkey/register/options", {
        method: "POST",
        credentials: "include",
      });

      const optionsData = await optionsRes.json();

      if (!optionsRes.ok || !optionsData?.ok) {
        throw new Error(optionsData?.error || "Failed to get passkey options.");
      }

      const attResp = await startRegistration({ optionsJSON: optionsData.options });

      const verifyRes = await fetch("/api/auth/passkey/register/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response: attResp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData?.ok) {
        throw new Error(verifyData?.error || "Failed to verify passkey.");
      }

      setPasskeyMessage("Passkey registered.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Passkey registration failed.";
      setPasskeyMessage(message);
    } finally {
      setPasskeyBusy(false);
    }
  }, []);

  // Mobile crop (approved)
  const mobileObjectPosition = "18% 52%";
  const effectiveObjectPosition = isDesktop ? "50% 50%" : mobileObjectPosition;

  const safePlay = React.useCallback((v: HTMLVideoElement | null) => {
    if (!v) return;
    try {
      v.muted = true;
      const p = v.play();
      if (p && typeof (p as Promise<void>).catch === "function") {
        (p as Promise<void>).catch(() => {});
      }
    } catch {
      // no-op
    }
  }, []);

  const safePause = React.useCallback((v: HTMLVideoElement | null) => {
    if (!v) return;
    try {
      v.pause();
    } catch {
      // no-op
    }
  }, []);

  const safeReset = React.useCallback((v: HTMLVideoElement | null) => {
    if (!v) return;
    try {
      v.currentTime = 0;
    } catch {
      // no-op
    }
  }, []);

  const startFadeTo = React.useCallback(
    (next: Phase) => {
      if (videoError) return;
      if (fadingRef.current) return;

      const boy = boyRef.current;
      const girl = girlRef.current;
      if (!boy || !girl) return;

      const fromV = phase === "boy" ? boy : girl;
      const toV = next === "boy" ? boy : girl;

      fadingRef.current = true;

      // Ensure target is ready to play from start
      safeReset(toV);
      safePlay(toV);

      // Trigger CSS crossfade
      setPhase(next);

      // After fade duration, pause/reset the previous and clear fading flag
      window.setTimeout(() => {
        safePause(fromV);
        safeReset(fromV);
        fadingRef.current = false;
      }, Math.round(FADE_S * 1000));
    },
    [FADE_S, phase, safePause, safePlay, safeReset, videoError]
  );

  // Initial kickoff once we have at least the boy element mounted
  React.useEffect(() => {
    if (videoError) return;
    const boy = boyRef.current;
    const girl = girlRef.current;
    if (!boy || !girl) return;

    // Prime both for autoplay behavior
    boy.muted = true;
    girl.muted = true;

    // Start on boy
    setPhase("boy");
    safeReset(girl);
    safePause(girl);
    safePlay(boy);
  }, [safePause, safePlay, safeReset, videoError]);

  // Shared handler: if a clip is close to its end, fade to the other
  const handleTimeUpdate = React.useCallback(
    (who: Phase) => {
      if (videoError) return;
      if (fadingRef.current) return;
      if (phase !== who) return; // only drive transitions off the currently visible clip

      const v = who === "boy" ? boyRef.current : girlRef.current;
      if (!v) return;

      const d = v.duration;
      const t = v.currentTime;

      // duration can be NaN/Infinity early; ignore until valid
      if (!Number.isFinite(d) || d <= 0) return;

      // Trigger when we’re within FADE_S of the end
      if (t >= d - FADE_S) {
        startFadeTo(who === "boy" ? "girl" : "boy");
      }
    },
    [FADE_S, phase, startFadeTo, videoError]
  );

  // Hard fallback if a clip ends before timeupdate triggers (Safari quirks)
  const handleEnded = React.useCallback(
    (who: Phase) => {
      if (videoError) return;

      // If we somehow reached ended without fading, switch immediately
      if (phase === who) {
        startFadeTo(who === "boy" ? "girl" : "boy");
      }
    },
    [phase, startFadeTo, videoError]
  );

  const shouldRenderVideo = !videoError;
  const anyReady = boyReady || girlReady;

  const boyOpacity = anyReady ? (phase === "boy" ? "opacity-100" : "opacity-0") : "opacity-0";
  const girlOpacity = anyReady ? (phase === "girl" ? "opacity-100" : "opacity-0") : "opacity-0";

  return (
    <div className="relative flex min-h-[100svh] flex-col bg-app">
      {/* ===== BACKGROUND LAYER ===== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Poster (always present as base layer) */}
        <Image
          src="/video/home.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: effectiveObjectPosition }}
        />

        {/* Videos — crossfaded in code */}
        {shouldRenderVideo && (
          <>
            {/* BOY */}
            <video
              ref={boyRef}
              poster="/video/home.jpg"
              className={[
                "absolute inset-0 h-full w-full object-cover transition-opacity",
                "duration-[1400ms]",
                boyOpacity,
                "motion-reduce:hidden",
              ].join(" ")}
              style={{ objectPosition: effectiveObjectPosition }}
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={() => setBoyReady(true)}
              onLoadedData={() => setBoyReady(true)}
              onCanPlay={() => setBoyReady(true)}
              onTimeUpdate={() => handleTimeUpdate("boy")}
              onEnded={() => handleEnded("boy")}
              onError={() => setVideoError(true)}
              aria-hidden
            >
              <source src="/video/homeBoy.mp4" type="video/mp4" />
            </video>

            {/* GIRL */}
            <video
              ref={girlRef}
              poster="/video/home.jpg"
              className={[
                "absolute inset-0 h-full w-full object-cover transition-opacity",
                "duration-[1400ms]",
                girlOpacity,
                "motion-reduce:hidden",
              ].join(" ")}
              style={{ objectPosition: effectiveObjectPosition }}
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={() => setGirlReady(true)}
              onLoadedData={() => setGirlReady(true)}
              onCanPlay={() => setGirlReady(true)}
              onTimeUpdate={() => handleTimeUpdate("girl")}
              onEnded={() => handleEnded("girl")}
              onError={() => setVideoError(true)}
              aria-hidden
            >
              <source src="/video/homeGirl.mp4" type="video/mp4" />
            </video>
          </>
        )}

        {/* Reduced-motion overlay */}
        <div className="absolute inset-0 hidden motion-reduce:block">
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/65" />
        </div>

        {/* Scrims */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 top-scrim" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/80 via-black/45 to-transparent md:h-64" />
        <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
      </div>

      {/* Top-left Everleap brand */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <Link
          href="/"
          aria-label="Everleap home"
          className="inline-flex items-center rounded-full px-1 py-1 text-white/90 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25"
        >
          <span className="text-base font-semibold uppercase tracking-[0.22em]">
            Everleap AI
          </span>
        </Link>
      </div>

      {/* ===== CONTENT ===== */}
      <main className="relative z-10 flex flex-1 flex-col">
        {/* Desktop/tablet centered card */}
        <div className="hidden flex-1 items-center justify-center px-4 md:flex">
          <section className="w-full max-w-3xl">
            {authed === false ? (
              <AuthOverlay />
            ) : (
              <DesktopHeroCard
                authed={authed}
                onRegisterPasskey={registerPasskey}
                passkeyBusy={passkeyBusy}
                passkeyMessage={passkeyMessage}
              />
            )}
          </section>
        </div>

        {/* Mobile bottom sheet */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 md:hidden">
          <section className="pointer-events-auto px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
            {authed === false ? (
              <AuthOverlay />
            ) : (
              <MobileBottomSheet
                authed={authed}
                onRegisterPasskey={registerPasskey}
                passkeyBusy={passkeyBusy}
                passkeyMessage={passkeyMessage}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---- cards ---- */

function DesktopHeroCard({
  authed,
  onRegisterPasskey,
  passkeyBusy,
  passkeyMessage,
}: {
  authed: boolean | null;
  onRegisterPasskey: () => void;
  passkeyBusy: boolean;
  passkeyMessage: string | null;
}) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-slate-950/58 px-6 py-7 text-center shadow-[0_18px_70px_rgba(0,0,0,0.72)] backdrop-blur-lg md:px-8 md:py-10">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
        Everleap · figure stuff out
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[2.15rem]">
        Understand yourself. Explore what fits.
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 md:text-base">
        Big dreams start with small conversations.
      </p>

      <div className="mt-7 flex justify-center md:mt-8">
        <Link
          href="/consent"
          className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-white/15 backdrop-blur-sm transition hover:-translate-y-[1px] hover:bg-white/14 active:scale-[0.99]"
        >
          Start talking
        </Link>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onRegisterPasskey}
          disabled={passkeyBusy}
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {passkeyBusy ? "Registering…" : "Register Passkey (test)"}
        </button>
      </div>

      {passkeyMessage && <p className="mt-3 text-xs text-white/65">{passkeyMessage}</p>}

      <p className="mt-4 text-xs text-white/55">
        Already have an account?{" "}
        <Link href="/regauth" className="font-semibold text-white/70 transition hover:text-white">
          Sign in
        </Link>
      </p>

      {authed === null && <p className="mt-5 text-xs text-white/55">Checking access…</p>}
    </div>
  );
}

function MobileBottomSheet({
  authed,
  onRegisterPasskey,
  passkeyBusy,
  passkeyMessage,
}: {
  authed: boolean | null;
  onRegisterPasskey: () => void;
  passkeyBusy: boolean;
  passkeyMessage: string | null;
}) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-5 text-center shadow-[0_16px_60px_rgba(0,0,0,0.7)] backdrop-blur-lg">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sky-200/80">
        Everleap · figure stuff out
      </p>

      <h1 className="mt-2.5 text-2xl font-semibold tracking-tight text-white">
        Understand yourself. Explore what fits.
      </h1>

      <p className="mx-auto mt-3 max-w-[26rem] text-sm text-white/85">
        Big dreams start with small conversations.
      </p>

      <div className="mt-5 flex justify-center">
        <Link
          href="/consent"
          className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-white/15 backdrop-blur-sm active:scale-[0.99]"
        >
          Start talking
        </Link>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onRegisterPasskey}
          disabled={passkeyBusy}
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {passkeyBusy ? "Registering…" : "Register Passkey (test)"}
        </button>
      </div>

      {passkeyMessage && <p className="mt-3 text-xs text-white/65">{passkeyMessage}</p>}

      <p className="mt-3 text-xs text-white/55">
        Already have an account?{" "}
        <Link href="/regauth" className="font-semibold text-white/70 transition hover:text-white">
          Sign in
        </Link>
      </p>

      {authed === null && <p className="mt-4 text-xs text-white/55">Checking access…</p>}
    </div>
  );
}

function AuthOverlay() {
  return (
    <div className="w-full rounded-3xl border border-white/14 bg-slate-950/75 px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-md md:px-8 md:py-10">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
        Everleap · Private beta
      </p>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Authorized access only
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 md:text-base">
        This preview is currently locked. Please sign in to continue.
      </p>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 md:mt-8">
        <Link
          href="/regauth"
          className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm hover:bg-white/10 active:scale-[0.99]"
        >
          Sign in
        </Link>

        <p className="text-xs text-white/55">
          If you don’t see a login prompt, your browser may have cached credentials. Try a hard refresh
          or open a private window.
        </p>
      </div>
    </div>
  );
}