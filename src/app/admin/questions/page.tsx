// apps/web/src/app/admin/questions/page.tsx
//
// The question editor. Master list on the left, an editor on the right. Everything
// here writes to the DB live (through /api/admin/* → backend /console/*), audited.
// `key` is shown but read-only — it's the stable link flows and answers rely on.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type ListItem = {
  id: string;
  key: string;
  family: string;
  prompt: string;
  input_type: string;
  science: string | null;
  source_rank: number | null;
  served: boolean;
  option_count: number;
};

type Option = {
  id?: string;
  key: string;
  label: string;
  description: string | null;
};

type Question = {
  id: string;
  key: string;
  family: string;
  prompt: string;
  input_type: string;
  placeholder: string | null;
  min_length: number | null;
  max_length: number | null;
  science: string | null;
  source_rank: number | null;
};

const FAMILIES = ["motivations", "strengths", "skills", "misc"];
const INPUT_TYPES = ["text", "single_select", "multi_select"];

export default function QuestionsAdmin() {
  const [items, setItems] = React.useState<ListItem[] | null>(null);
  const [denied, setDenied] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const [q, setQ] = React.useState<Question | null>(null);
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loadingDetail, setLoadingDetail] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [familyFilter, setFamilyFilter] = React.useState<string>("all");
  const [servedOnly, setServedOnly] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const loadList = React.useCallback(async () => {
    const res = await fetch("/api/console/questions", { cache: "no-store" });
    if (res.status === 401 || res.status === 403) {
      setDenied(true);
      return;
    }
    const data = await res.json().catch(() => null);
    setItems(data?.questions ?? []);
  }, []);

  React.useEffect(() => {
    loadList();
  }, [loadList]);

  const openQuestion = React.useCallback(async (id: string) => {
    setSelectedId(id);
    setMsg(null);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/console/questions/${id}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (data?.ok) {
        setQ(data.question);
        setOptions(
          (data.options ?? []).map((o: Option) => ({
            id: o.id,
            key: o.key,
            label: o.label,
            description: o.description ?? null,
          }))
        );
      }
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const save = React.useCallback(async () => {
    if (!q) return;
    setSaving(true);
    setMsg(null);
    try {
      const isChoice = q.input_type !== "text";
      const body = {
        question: {
          prompt: q.prompt,
          family: q.family,
          input_type: q.input_type,
          placeholder: q.placeholder,
          min_length: q.min_length,
          max_length: q.max_length,
          science: q.science,
          source_rank: q.source_rank,
        },
        options: isChoice ? options : [],
      };
      const res = await fetch(`/api/console/questions/${q.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
  }, [q, options, loadList]);

  const moveOption = (i: number, dir: -1 | 1) => {
    setOptions((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

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

  const filtered = (items ?? []).filter((it) => {
    if (servedOnly && !it.served) return false;
    if (familyFilter !== "all" && it.family !== familyFilter) return false;
    if (search && !`${it.prompt} ${it.key}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <Shell>
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Master list */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select
              value={familyFilter}
              onChange={(e) => setFamilyFilter(e.target.value)}
              className="rounded-control border border-white/10 bg-white/[0.04] px-2 py-1 text-meta text-white/80"
            >
              <option value="all">All families</option>
              {FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-meta text-white/60">
              <input
                type="checkbox"
                checked={servedOnly}
                onChange={(e) => setServedOnly(e.target.checked)}
              />
              Served only
            </label>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="mb-3 w-full rounded-control border border-white/10 bg-white/[0.04] px-3 py-1.5 text-meta text-white/85 placeholder:text-white/30"
          />
          <div className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
            {items === null ? (
              <p className="text-meta text-white/40">Loading…</p>
            ) : (
              filtered.map((it) => (
                <button
                  key={it.id}
                  onClick={() => openQuestion(it.id)}
                  className={`block w-full rounded-control border px-3 py-2 text-left transition ${
                    selectedId === it.id
                      ? "border-cyan-300/30 bg-cyan-300/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-micro font-semibold uppercase tracking-eyebrow text-cyan-200/60">
                      {it.family}
                    </span>
                    {!it.served ? (
                      <span className="text-micro uppercase tracking-eyebrow text-white/30">
                        unserved
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-meta text-white/80">{it.prompt}</div>
                  <div className="mt-0.5 text-micro text-white/35">
                    {it.input_type}
                    {it.option_count ? ` · ${it.option_count} options` : ""}
                  </div>
                </button>
              ))
            )}
            {items && filtered.length === 0 ? (
              <p className="text-meta text-white/40">No questions match.</p>
            ) : null}
          </div>
        </div>

        {/* Editor */}
        <div className="min-w-0">
          {!q ? (
            <p className="pt-2 text-label text-white/40">
              {loadingDetail ? "Loading…" : "Select a question to edit."}
            </p>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="mb-1 flex items-center gap-2 text-micro uppercase tracking-eyebrow text-white/35">
                  <span>key</span>
                  <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-white/60">
                    {q.key}
                  </code>
                  <span className="text-white/25">(read-only)</span>
                </div>
                <Field label="Prompt">
                  <textarea
                    value={q.prompt}
                    onChange={(e) => setQ({ ...q, prompt: e.target.value })}
                    rows={3}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Family">
                  <select
                    value={q.family}
                    onChange={(e) => setQ({ ...q, family: e.target.value })}
                    className={inputCls}
                  >
                    {[...new Set([q.family, ...FAMILIES])].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Answer type">
                  <select
                    value={q.input_type}
                    onChange={(e) => setQ({ ...q, input_type: e.target.value })}
                    className={inputCls}
                  >
                    {[...new Set([q.input_type, ...INPUT_TYPES])].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Science tag">
                  <input
                    value={q.science ?? ""}
                    onChange={(e) => setQ({ ...q, science: e.target.value || null })}
                    className={inputCls}
                    placeholder="e.g. Ikigai"
                  />
                </Field>
                <Field label="Order (source_rank)">
                  <input
                    type="number"
                    value={q.source_rank ?? ""}
                    onChange={(e) =>
                      setQ({ ...q, source_rank: e.target.value === "" ? null : Number(e.target.value) })
                    }
                    className={inputCls}
                  />
                </Field>
              </div>

              {q.input_type !== "text" ? (
                <Field label="Options">
                  <div className="space-y-2">
                    {options.map((o, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-control border border-white/[0.07] bg-white/[0.02] p-2"
                      >
                        <GripVertical className="mt-2 h-4 w-4 shrink-0 text-white/20" />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <input
                            value={o.label}
                            onChange={(e) =>
                              setOptions(options.map((x, xi) => (xi === i ? { ...x, label: e.target.value } : x)))
                            }
                            placeholder="Label (what the user sees)"
                            className={inputCls}
                          />
                          <div className="flex gap-2">
                            <input
                              value={o.key}
                              onChange={(e) =>
                                setOptions(options.map((x, xi) => (xi === i ? { ...x, key: e.target.value } : x)))
                              }
                              placeholder="key"
                              className={`${inputCls} font-mono w-32`}
                            />
                            <input
                              value={o.description ?? ""}
                              onChange={(e) =>
                                setOptions(
                                  options.map((x, xi) =>
                                    xi === i ? { ...x, description: e.target.value || null } : x
                                  )
                                )
                              }
                              placeholder="description (optional)"
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col gap-0.5">
                          <button onClick={() => moveOption(i, -1)} className={iconBtn} aria-label="Up">
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => moveOption(i, 1)} className={iconBtn} aria-label="Down">
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setOptions(options.filter((_, xi) => xi !== i))}
                            className={`${iconBtn} text-rose-300/70`}
                            aria-label="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setOptions([...options, { key: `opt_${options.length + 1}`, label: "", description: null }])
                      }
                      className="inline-flex items-center gap-1.5 rounded-control border border-white/10 px-3 py-1.5 text-meta text-white/70 transition hover:bg-white/[0.04]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add option
                    </button>
                  </div>
                </Field>
              ) : null}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={save}
                  disabled={saving}
                  className="rounded-full bg-cyan-300/[0.12] px-5 py-2 text-label font-semibold text-cyan-100 ring-1 ring-cyan-300/25 transition hover:brightness-110 disabled:opacity-60"
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
  "w-full rounded-control border border-white/10 bg-white/[0.04] px-3 py-1.5 text-meta text-white/90 placeholder:text-white/30 focus:border-cyan-300/40 focus:outline-none";
const iconBtn =
  "flex h-6 w-6 items-center justify-center rounded-md text-white/50 transition hover:bg-white/[0.06] hover:text-white/80";

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
        <h1 className="mb-6 text-title font-semibold tracking-title">Questions &amp; answers</h1>
        {children}
      </div>
    </main>
  );
}
