// src/app/(app)/main/profile/page.tsx
//
// The "Me" section — the user's home for seeing themselves. Starts with the
// basics (who you are + account) on the app's cosmic surface, and a clean log
// out. Built to expand (see the account hub + room for richer "you" sections).

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  NotebookPen,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SectionCard } from "../components/ui/SectionCard";
import { ConstellationAnchor } from "../components/ui/ConstellationAnchor";

type MeUser = {
  id: string;
  email?: string;
  email_verified?: boolean;
  first_name?: string | null;
  zip_code?: string | null;
  created_at?: string;
};

const ACCENT = { r: 182, g: 160, b: 255 };
const rgba = (a: number) => `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${a})`;

function memberSince(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function InfoRow({
  Icon,
  label,
  value,
  badge,
  badgeGood,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  badge?: string;
  badgeGood?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/60">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-[0.1em] text-white/40">{label}</div>
        <div className="truncate text-[14px] text-white/85">{value}</div>
      </div>
      {badge ? (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
            badgeGood ? "bg-emerald-400/15 text-emerald-300/90" : "bg-white/[0.06] text-white/55"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

const ACCOUNT_LINKS = [
  { href: "/main/notifications", label: "Notifications", desc: "How and when Everleap reaches you", Icon: Bell },
  { href: "/main/secure-device", label: "Secure this device", desc: "Add a lock to keep this private", Icon: ShieldCheck },
  { href: "/main/reset-answers", label: "Reset my answers", desc: "Clear your story and start fresh", Icon: RotateCcw },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<MeUser | null>(null);
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/regauth/me", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.authed && d.user) {
          setUser(d.user as MeUser);
          setAuthed(true);
        } else {
          setAuthed(false);
        }
      })
      .catch(() => {
        if (alive) setAuthed(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const goLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/regauth/logout", { method: "POST", credentials: "include", cache: "no-store" });
    } catch {
      /* proceed to clear locally anyway */
    }
    try {
      localStorage.removeItem("everleap.user.profile");
      localStorage.removeItem("everleapOnboarding_v4_convo_min");
    } catch {
      /* ignore */
    }
    window.location.replace("/");
  };

  const name = user?.first_name?.trim() || "You";
  const initial = (user?.first_name?.trim()?.[0] || user?.email?.[0] || "Y").toUpperCase();
  const since = memberSince(user?.created_at);

  return (
    <div className="mx-auto w-full max-w-[680px] px-[6px] pb-28 pt-2">
      {/* Hero — who you are */}
      <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={user?.id ?? "me"} accent={ACCENT} />}>
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[26px] font-semibold text-white"
            style={{
              background: `linear-gradient(140deg, ${rgba(0.5)}, ${rgba(0.16)})`,
              border: `1px solid ${rgba(0.4)}`,
            }}
          >
            {initial}
          </span>
          <div className="min-w-0">
            <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
              <Sparkles className="h-3 w-3" /> Me
            </div>
            <h1 className="truncate text-[24px] font-semibold tracking-[-0.02em] text-white">{name}</h1>
            {user?.email ? (
              <div className="mt-1 flex items-center gap-1.5 text-[13px] text-white/62">
                <span className="truncate">{user.email}</span>
                {user.email_verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-300/90" /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </SectionCard>

      {authed === false ? (
        <div className="mt-3">
          <SectionCard tone="neutral">
            <p className="text-[14px] text-white/64">You’re not signed in.</p>
            <button
              type="button"
              onClick={() => router.push("/regauth")}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-white/[0.12]"
            >
              Sign in
            </button>
          </SectionCard>
        </div>
      ) : authed ? (
        <div className="mt-3 space-y-3">
          {/* Basics */}
          <SectionCard tone="neutral">
            <div className="space-y-3.5">
              <InfoRow
                Icon={Mail}
                label="Email"
                value={user?.email ?? "—"}
                badge={user?.email_verified ? "Verified" : "Unverified"}
                badgeGood={user?.email_verified}
              />
              {since ? <InfoRow Icon={Sparkles} label="Member since" value={since} /> : null}
              {user?.zip_code ? <InfoRow Icon={MapPin} label="Location" value={user.zip_code} /> : null}
            </div>
          </SectionCard>

          {/* Reflections journal — a place you want to visit, not just settings */}
          <Link href="/main/profile/reflections" className="block">
            <SectionCard tone="neutral">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `linear-gradient(140deg, ${rgba(0.28)}, ${rgba(0.1)})`, color: "#fff" }}
                >
                  <NotebookPen className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-white">Your reflections</div>
                  <div className="truncate text-[12.5px] text-white/55">
                    A diary of what you’ve tried, and what you noticed
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-white/35" />
              </div>
            </SectionCard>
          </Link>

          {/* Account hub */}
          <SectionCard tone="neutral">
            <h2 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Account</h2>
            <div className="space-y-1">
              {ACCOUNT_LINKS.map(({ href, label, desc, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-white/[0.04]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/70">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-medium text-white">{label}</span>
                    <span className="block truncate text-[12.5px] text-white/50">{desc}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Log out */}
          <button
            type="button"
            onClick={goLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] font-semibold text-white/80 transition hover:bg-white/[0.06] disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" /> {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      ) : (
        // loading
        <div className="mt-3">
          <SectionCard tone="neutral">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-1/2 rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
