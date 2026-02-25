// src/regauth/lib/postAuthRedirect.ts
"use client";

type Category = "motivations" | "strengths" | "skills";
type Saved = { answer?: string; skipped?: boolean };

const STORAGE_KEY_V3 = "everleap.story.answers.v3";

const REQUIRED_IDS: Record<Category, string[]> = {
  motivations: ["motivations_1", "motivations_2", "motivations_3", "motivations_4", "motivations_5"],
  strengths: ["strengths_1", "strengths_2", "strengths_3", "strengths_4", "strengths_5"],
  skills: ["skills_1", "skills_2", "skills_3", "skills_4", "skills_5"],
};

function loadSaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_V3);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, Saved>;
  } catch {
    return {};
  }
}

function isMeaningfulText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 3) return false;
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (!lettersOnly) return false;
  const unique = new Set(lettersOnly.toLowerCase()).size;
  if (unique <= 2) return false;
  const squashed = trimmed.replace(/\s+/g, "");
  if (/^(.)\1{6,}$/i.test(squashed)) return false;
  return true;
}

function catComplete(saved: Record<string, Saved>, cat: Category): boolean {
  const ids = REQUIRED_IDS[cat];
  return ids.every((id) => {
    const s = saved[id];
    const ans = (s?.answer ?? "").trim();
    // IMPORTANT: "answered all questions" => skipped does NOT count.
    if (s?.skipped) return false;
    if (!ans) return false;
    return isMeaningfulText(ans);
  });
}

export function getPostAuthRedirectPath(): string {
  const saved = loadSaved();

  const motivationsDone = catComplete(saved, "motivations");
  if (!motivationsDone) return "/main/questions?cat=motivations&returnTo=%2Fmain";

  const strengthsDone = catComplete(saved, "strengths");
  if (!strengthsDone) return "/main/questions?cat=strengths&returnTo=%2Fmain";

  const skillsDone = catComplete(saved, "skills");
  if (!skillsDone) return "/main/questions?cat=skills&returnTo=%2Fmain";

  return "/main";
}