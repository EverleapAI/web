// apps/web/src/app/admin/badges/page.tsx
//
// The badge editor. Copy and tier criteria are DB-backed, so editable live. The
// criteria METRICS, though, are a fixed vocabulary in the badge engine — so each
// criteria box is JSON checked here for parseability and re-checked server-side
// against the known metrics before it's written. A badge naming an unknown metric
// can never pay out, so we refuse to save one.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BadgeListItem = {
  slug: string;
  name: string;
  description: string;
  active: boolean;
  glyph: string;
  accent: string;
};

type Badge = {
  slug: string;
  name: string;
  description: string;
  hint: string | null;
  bronze_hint: string | null;
  silver_hint: string | null;
  gold_hint: string | null;
  criteria: unknown;
  bronze_criteria: unknown;
  silver_criteria: unknown;
  gold_criteria: unknown;
  active: boolean;
};

const CRITERIA_FIELDS: { key: keyof Badge; label: string; hintKey: keyof Badge }[] = [
  { key: "bronze_criteria", label: "Bronze", hintKey: "bronze_hint" },
  { key: "silver_criteria", label: "Silver", hintKey: "silver_hint" },
  { key: "gold_criteria", label: "Gold", hintKey: "gold_hint" },
  { key: "criteria", label: "Base (legacy)", hintKey: "hint" },
];

export default function BadgesAdmin() {
  const [items, setItems] = React.useState<BadgeListItem[] | null>(null);
  const [denied, setDenied] = React.useState(false);
  const [slug, setSlug] = React.useState<string | null>(null);
  const [badge, setBadge] = React.useState<Badge | null>(null);
  const [metrics, setMetrics] = React.useState<string[]>([]);
  const [text, setText] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const loadList = React.useCallback(async () => {
    const res = await fetch("/api/console/badges", { cache: "no-store" });
    if (res.status === 401 || res.status === 403) {
      setDenied(true);
      return;
    }
    const data = await res.json().catch(() => null);
    setItems(data?.badges ?? []);
  }, []);

  React.useEffect(() => {
    loadList();
  }, [loadList]);

  const openBadge = React.useCallback(async (s: string) => {
    setSlug(s);
    setMsg(null);
    const res = await fetch(`/api/console/badges/${s}`, { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (data?.ok) {
      setBadge(data.badge);
      setMetrics(data.metrics ?? []);
      const t: Record<string, string> = {};
      for (const f of CRITERIA_FIELDS) {
        const v = data.badge[f.key];
        t[f.key as string] = v == null ? "" : JSON.stringify(v, null, 2);
      }
      setText(t);
    }
  }, []);

  const save = React.useCallback(async () => {
    if (!badge) return;
    setSaving(true);
    setMsg(null);

    // Parse the criteria boxes first — a client-side check so a typo doesn't need a
    // round-trip. Empty box = null (that tier can't be earned, which is allowed).
    const payload: Record<string, unknown> = {
      name: badge.name,
      description: badge.description,
      hint: badge.hint,
      bronze_hint: badge.bronze_hint,
      silver_hint: badge.silver_hint,
      gold_hint: badge.gold_hint,
      active: badge.active,
    };
    for (const f of CRITERIA_FIELDS) {
      const raw = (text[f.key as string] ?? "").trim();
      if (raw === "") {
        payload[f.key as string] = null;
        continue;
      }
      try {
        payload[f.key as string] = JSON.parse(raw);
      } catch {
        setMsg({ kind: "err", text: `${f.label} criteria isn't valid JSON.` });
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/console/badges/${badge.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setMsg({ kind: "ok", text: "Saved." });
        await loadList();
      } else {
        setMsg({ kind: "err", text: data?.error ?? "Save failed." });
      }
    } finally {
      setSaving(false);
    }
  }, [badge, text, loadList]);

  if (denied) {
    return (
      <Shell>
        <p className="text-label text-white/60">Your account doesn&apos;t have access.</p>
        <Link href="/main" className="text-label text-cyan-200/90">
          Back to Everleap →
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* List */}
        <div className="max-h-[74vh] space-y-1 overflow-y-auto pr-1">
          {items === null ? (
            <p className="text-meta text-white/40">Loading…</p>
          ) : (
            items.map((b) => (
              <button
                key={b.slug}
                onClick={() => openBadge(b.slug)}
                className={`flex w-full items-center gap-2.5 rounded-control border px-3 py-2 text-left transition ${
                  slug === b.slug
                    ? "border-amber-300/30 bg-amber-300/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-body">{b.glyph}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-meta text-white/85">{b.name}</span>
                  <span className="block truncate text-micro text-white/35">{b.slug}</span>
                </span>
                {!b.active ? (
                  <span className="text-micro uppercase tracking-eyebrow text-white/30">off</span>
                ) : null}
              </button>
            ))
          )}
        </div>

        {/* Editor */}
        <div className="min-w-0">
          {!badge ? (
            <p className="pt-2 text-label text-white/40">Select a badge to edit.</p>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    value={badge.name}
                    onChange={(e) => setBadge({ ...badge, name: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <label className="flex items-center gap-2 self-end pb-1.5 text-meta text-white/70">
                  <input
                    type="checkbox"
                    checked={badge.active}
                    onChange={(e) => setBadge({ ...badge, active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <Field label="Description">
                <textarea
                  value={badge.description}
                  onChange={(e) => setBadge({ ...badge, description: e.target.value })}
                  rows={2}
                  className={inputCls}
                />
              </Field>

              {/* Metric reference */}
              <div className="rounded-control border border-white/[0.07] bg-white/[0.02] p-3">
                <p className="mb-2 text-micro font-semibold uppercase tracking-eyebrow text-white/40">
                  Metrics you can use in criteria
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {metrics.map((m) => (
                    <code
                      key={m}
                      className="rounded bg-white/[0.06] px-1.5 py-0.5 text-micro text-white/60"
                    >
                      {m}
                    </code>
                  ))}
                </div>
                <p className="mt-2 text-micro text-white/35">
                  Shape: {"{ \"all\": [ { \"metric\": \"story_families_filled\", \"gte\": 3 } ] }"} —
                  also supports <code className="text-white/50">any</code>, and{" "}
                  <code className="text-white/50">lte</code>/<code className="text-white/50">eq</code>.
                  Empty = that tier can&apos;t be earned.
                </p>
              </div>

              {CRITERIA_FIELDS.map((f) => (
                <div key={f.key as string} className="grid gap-2 sm:grid-cols-[1fr_1fr]">
                  <Field label={`${f.label} criteria`}>
                    <textarea
                      value={text[f.key as string] ?? ""}
                      onChange={(e) => setText({ ...text, [f.key as string]: e.target.value })}
                      rows={4}
                      spellCheck={false}
                      className={`${inputCls} font-mono text-[12px] leading-snug`}
                    />
                  </Field>
                  <Field label={`${f.label} hint`}>
                    <textarea
                      value={(badge[f.hintKey] as string) ?? ""}
                      onChange={(e) =>
                        setBadge({ ...badge, [f.hintKey]: e.target.value || null } as Badge)
                      }
                      rows={4}
                      className={inputCls}
                      placeholder="Shown when this tier is next up"
                    />
                  </Field>
                </div>
              ))}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={save}
                  disabled={saving}
                  className="rounded-full bg-amber-300/[0.12] px-5 py-2 text-label font-semibold text-amber-100 ring-1 ring-amber-300/25 transition hover:brightness-110 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                {msg ? (
                  <span
                    className={`text-meta ${msg.kind === "ok" ? "text-emerald-300/90" : "text-rose-300/90"}`}
                  >
                    {msg.text}
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

const inputCls =
  "w-full rounded-control border border-white/10 bg-white/[0.04] px-3 py-1.5 text-meta text-white/90 placeholder:text-white/30 focus:border-amber-300/40 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-micro font-semibold uppercase tracking-eyebrow text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[100svh] bg-[#020617] px-5 py-8 text-white">
      <div className="mx-auto w-full max-w-[1000px]">
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-1.5 text-meta text-white/50 transition hover:text-white/80"
        >
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
        <h1 className="mb-6 text-title font-semibold tracking-title">Badges</h1>
        {children}
      </div>
    </main>
  );
}
