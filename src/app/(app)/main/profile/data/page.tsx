// src/app/(app)/main/profile/data/page.tsx
//
// "Your data, your control" — see what Everleap keeps, download all of it, or
// permanently delete your account. The delete is irreversible and gated behind
// a typed confirmation.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, ShieldCheck, Trash2 } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";

const KEEPS = [
  "Your account basics — email, name, and where you are",
  "Your story — everything you’ve told Everleap about yourself",
  "The things you’ve tried, and what you noticed afterward",
  "Everleap’s working notes and the picture it’s formed of you",
  "Your answers to Tiny Tasks and feedback you’ve given",
];

export default function DataControlPage() {
  const [downloading, setDownloading] = React.useState(false);
  const [dlError, setDlError] = React.useState<string | null>(null);

  const [showDelete, setShowDelete] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [delError, setDelError] = React.useState<string | null>(null);

  const download = async () => {
    if (downloading) return;
    setDlError(null);
    setDownloading(true);
    try {
      const res = await fetch("/api/data/export", { credentials: "include", cache: "no-store" });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.ok) {
        setDlError("Couldn’t prepare your download. Try again.");
        return;
      }
      const blob = new Blob([JSON.stringify(d.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `everleap-my-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDlError("Couldn’t reach the server. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  const doDelete = async () => {
    if (deleting || confirmText !== "DELETE") return;
    setDelError(null);
    setDeleting(true);
    try {
      const res = await fetch("/api/data/delete", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok && d?.ok) {
        try {
          localStorage.clear();
        } catch {
          /* ignore */
        }
        window.location.replace("/");
        return;
      }
      setDelError(d?.error ?? "Couldn’t delete your account. Try again.");
      setDeleting(false);
    } catch {
      setDelError("Couldn’t reach the server. Try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[680px] px-[6px] pb-28 pt-2">
      <Link
        href="/main/profile"
        className="mb-3 inline-flex items-center gap-1.5 text-meta font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Me
      </Link>

      <SectionCard tone="neutral">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-white/70" />
          <h1 className="text-lede font-semibold tracking-title text-white">Your data, your control</h1>
        </div>
        <p className="mt-1.5 text-meta leading-read text-white/60">
          It’s yours. Take a copy any time, or remove it all — no questions asked.
        </p>
      </SectionCard>

      {/* What we keep */}
      <div className="mt-3">
        <SectionCard tone="neutral">
          <h2 className="mb-2.5 text-micro font-semibold uppercase tracking-eyebrow text-white/45">What Everleap keeps</h2>
          <ul className="space-y-2">
            {KEEPS.map((k) => (
              <li key={k} className="flex gap-2.5 text-meta leading-body text-white/74">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Export */}
      <div className="mt-3">
        <SectionCard tone="neutral">
          <h2 className="text-label font-semibold text-white">Download your data</h2>
          <p className="mt-1 text-meta leading-body text-white/60">
            A single file with everything above, in a readable format.
          </p>
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2.5 text-label font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-60"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading ? "Preparing…" : "Download my data"}
          </button>
          {dlError ? <p className="mt-2 text-meta text-rose-300">{dlError}</p> : null}
        </SectionCard>
      </div>

      {/* Danger zone */}
      <div className="mt-3">
        <SectionCard tone="neutral">
          <h2 className="text-label font-semibold text-rose-200/90">Delete your account</h2>
          <p className="mt-1 text-meta leading-body text-white/60">
            This permanently removes your account and everything Everleap holds about you. It can’t be undone.
          </p>

          {!showDelete ? (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-label font-semibold text-rose-200 transition hover:bg-rose-500/16"
            >
              <Trash2 className="h-4 w-4" /> Delete my account
            </button>
          ) : (
            <div className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-500/[0.06] p-4">
              <label className="block text-meta text-white/75">
                Type <span className="font-semibold text-white">DELETE</span> to confirm.
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  autoFocus
                  className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2.5 text-label tracking-eyebrow text-white outline-none focus:border-rose-400/40"
                />
              </label>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={doDelete}
                  disabled={deleting || confirmText !== "DELETE"}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2.5 text-label font-semibold text-white transition hover:bg-rose-500/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  {deleting ? "Deleting…" : "Permanently delete"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDelete(false);
                    setConfirmText("");
                    setDelError(null);
                  }}
                  disabled={deleting}
                  className="rounded-full border border-white/12 px-4 py-2.5 text-label font-semibold text-white/75 transition hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
              </div>
              {delError ? <p className="mt-2 text-meta text-rose-300">{delError}</p> : null}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
