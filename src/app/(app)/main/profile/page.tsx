"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  LogIn,
  LogOut,
  User,
} from "lucide-react";

import {
  DEFAULT_THEME_ID,
  isDarkTheme,
  type SpotlightThemeId,
} from "@/theme/everleapVisuals";

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
      ? "border-emerald-300/18 bg-emerald-300/12 text-emerald-50 hover:bg-emerald-300/16"
      : "border-emerald-500/18 bg-emerald-500/10 text-emerald-900 hover:bg-emerald-500/14",
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
  ].join(" ");
}

type AuthState = {
  isAuthed: boolean;
  email?: string;
  displayName?: string;
};

async function readAuthState(): Promise<AuthState> {
  try {
    const res = await fetch("/api/regauth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!data?.ok || !data?.user) {
      return { isAuthed: false };
    }

    const email =
      typeof data.user.email === "string" ? data.user.email : undefined;

    return {
      isAuthed: true,
      email,
      displayName: email ?? "You",
    };
  } catch {
    return { isAuthed: false };
  }
}

function clearLocalAuthState() {
  try {
    localStorage.removeItem("everleap.user.profile");
    localStorage.removeItem("everleapOnboarding_v4_convo_min");
    localStorage.removeItem("everleap.explore.work.reactions.v1");
    localStorage.removeItem("everleap.explore.learning.reactions.v1");
  } catch {}
}

export default function ProfilePage() {
  const router = useRouter();

  const themeId = DEFAULT_THEME_ID as SpotlightThemeId;
  const dark = isDarkTheme(themeId);

  const [auth, setAuth] = React.useState<AuthState>({
    isAuthed: false,
  });

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      const next = await readAuthState();
      if (!cancelled) setAuth(next);
    }

    void load();

    const refresh = () => void load();

    window.addEventListener("focus", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
    };
  }, []);

  async function goLogout() {
    try {
      await fetch("/api/regauth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch {}

    clearLocalAuthState();

    window.location.replace("/");
  }

  function goSignIn() {
    router.push("/regauth");
  }

  return (
    <main className={`relative z-10 ${pagePadding()}`}>
      <div className={pageShell()}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${iconChip(
                dark
              )}`}
            >
              <User className="h-5 w-5" />
            </span>

            <div>
              <h1 className="text-xl font-semibold">Me</h1>
              <div className={`text-xs ${muted(dark)}`}>
                Account + support.
              </div>
            </div>
          </div>

          <Link href="/main" className={quietButton(dark)}>
            Back <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className={`mt-4 rounded-3xl p-5 ${surface(dark)} ${ring(dark)}`}>
          <div className="flex items-center justify-between">
            <div className={`text-lg font-semibold ${text(dark)}`}>
              {auth.displayName ?? "You"}
            </div>
          </div>

          <div className={`mt-1 text-sm ${softText(dark)}`}>
            {auth.isAuthed ? "Signed in on this device." : "Not signed in yet."}
          </div>

          {auth.email ? (
            <div className={`mt-1 text-xs ${muted(dark)}`}>
              {auth.email}
            </div>
          ) : null}

          <div className="mt-4">
            {auth.isAuthed ? (
              <button onClick={goLogout} className={primaryButton(dark)}>
                <LogOut className="h-4 w-4" /> Log out
              </button>
            ) : (
              <button onClick={goSignIn} className={primaryButton(dark)}>
                <LogIn className="h-4 w-4" /> Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}