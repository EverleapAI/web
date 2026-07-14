// src/app/(app)/main/profile/edit/page.tsx
//
// Edit your basics — the small, editable slice of your profile (name + ZIP).
// Loads current values from /api/regauth/me, saves via POST /api/profile.

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder-white/35 outline-none transition focus:border-white/25 focus:bg-white/[0.06]";

export default function EditProfilePage() {
  const router = useRouter();
  const [loaded, setLoaded] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/regauth/me", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.authed && d.user) {
          setFirstName(typeof d.user.first_name === "string" ? d.user.first_name : "");
          setZip(typeof d.user.zip_code === "string" ? d.user.zip_code : "");
        }
        setLoaded(true);
      })
      .catch(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setError(null);

    const z = zip.trim();
    if (z && !/^\d{5}$/.test(z)) {
      setError("Enter a 5-digit ZIP code, or leave it blank.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), zipCode: z }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok && d?.ok) {
        router.push("/main/profile");
        return;
      }
      setError(d?.error ?? "Couldn’t save your changes. Try again.");
      setSaving(false);
    } catch {
      setError("Couldn’t reach the server. Try again.");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[640px] px-[6px] pb-28 pt-2">
      <Link
        href="/main/profile"
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Me
      </Link>

      <SectionCard tone="neutral">
        <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-white">Edit your basics</h1>
        <p className="mt-1 text-[13.5px] leading-[1.55] text-white/60">
          How Everleap greets you, and where you are. Both are optional.
        </p>

        <form onSubmit={save} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-white/45">
              First name
            </span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="What should we call you?"
              autoComplete="given-name"
              maxLength={80}
              disabled={!loaded}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-white/45">
              ZIP code
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
              placeholder="e.g. 94901"
              autoComplete="postal-code"
              disabled={!loaded}
              className={inputClass}
            />
            <span className="mt-1.5 block text-[12px] text-white/45">
              Helps Everleap ground suggestions near you. Leave blank to skip.
            </span>
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-2.5 text-[13px] text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving || !loaded}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-900 transition hover:bg-white/90 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "Saving…" : "Save changes"}
            </button>
            <Link
              href="/main/profile"
              className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-2.5 text-[14px] font-semibold text-white/75 transition hover:bg-white/[0.06]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
