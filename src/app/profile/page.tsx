// apps/web/app/profile/page.tsx
"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

/* ---------- Types ---------- */
type Role = "student" | "supporter";
type WelcomeState = {
  role?: Role;
  firstName?: string;
  lastName?: string;
};
type ContactData = {
  method: "phone" | "email";
  value: string;      // E.164 for phone or lowercased email
  display?: string;   // Original user-entered
};
type AnswerRecord = {
  id: string;
  type: "open";
  value: string;
  answeredAtUtc: string;
};

/* ---------- Helpers ---------- */
function maskEmail(email: string) {
  const v = String(email || "").trim().toLowerCase();
  const parts = v.split("@");
  if (parts.length !== 2) return v;
  const [user, domain] = parts;
  const head = user.slice(0, 2);
  const tail = user.length > 4 ? user.slice(-1) : "";
  const middleLen = Math.max(2, user.length - head.length - tail.length);
  return `${head}${"•".repeat(middleLen)}${tail}@${domain}`;
}

function prettyNanp(input: string) {
  const n = input.replace(/\D+/g, "");
  const ten = n.length === 11 && n.startsWith("1") ? n.slice(1) : n;
  if (ten.length !== 10) return input;
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

/* ---------- Component ---------- */
export default function ProfilePage() {
  const router = useRouter();

  // Basics
  const [role, setRole] = useState<Role | undefined>(undefined);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // Optional “About me”
  const [about, setAbout] = useState<string>("");

  // Contact
  const [contact, setContact] = useState<ContactData | null>(null);

  // Answers
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedWelcome = JSON.parse(localStorage.getItem("everleap.welcome") || "{}") as WelcomeState;
      if (savedWelcome.role) setRole(savedWelcome.role);
      if (savedWelcome.firstName) setFirstName(savedWelcome.firstName);
      if (savedWelcome.lastName) setLastName(savedWelcome.lastName);
    } catch {}

    try {
      const savedContact = localStorage.getItem("everleap.contact");
      if (savedContact) setContact(JSON.parse(savedContact) as ContactData);
    } catch {}

    try {
      const rawAnswers = localStorage.getItem("everleap.answers");
      if (rawAnswers) setAnswers(JSON.parse(rawAnswers) as AnswerRecord[]);
    } catch {}

    try {
      const rawAbout = localStorage.getItem("everleap.profile.about");
      if (rawAbout) setAbout(String(rawAbout));
    } catch {}
  }, []);

  // Save basics (first/last/role)
  function saveBasics() {
    try {
      const next: WelcomeState = { role, firstName, lastName };
      localStorage.setItem("everleap.welcome", JSON.stringify(next));
    } catch {}
  }

  // Save about
  function saveAbout() {
    try {
      localStorage.setItem("everleap.profile.about", about);
    } catch {}
  }

  const fullName = useMemo(
    () => [firstName, lastName].filter(Boolean).join(" ").trim() || "there",
    [firstName, lastName]
  );

  const motivation = useMemo(
    () => answers.find((r) => r.id === "q:first")?.value || "",
    [answers]
  );

  const contactDisplay = useMemo(() => {
    if (!contact) return "Not set";
    return contact.method === "email"
      ? maskEmail(contact.value)
      : prettyNanp(contact.value);
  }, [contact]);

  function editContact() {
    // Return user to welcome step: contact entry
    try {
      const state = JSON.parse(localStorage.getItem("everleap.welcome") || "{}");
      localStorage.setItem("everleap.welcome", JSON.stringify({ ...state, step: 4 }));
    } catch {}
    router.push("/welcome");
  }

  function editMotivation() {
    router.push("/questions/first");
  }

  return (
    <div className="min-h-dvh bg-app relative">
      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader />

        {/* Centered content */}
        <main className="flex-1 px-4">
          <div className="mx-auto w-full max-w-lg flex items-center justify-center py-10">
            <section className="w-full space-y-5">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome, {fullName}.</h1>
              <p className="text-sm opacity-80">
                {role === "supporter"
                  ? "Thanks for supporting a student’s journey."
                  : "Let’s make your profile yours."}
              </p>

              {/* Basics Card */}
              <div className="rounded-2xl card-surface p-5 space-y-4">
                <h2 className="text-base font-semibold">Your info</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="firstName">First name</label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                      onBlur={saveBasics}
                      className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-3 outline-none placeholder:opacity-60 focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="lastName">Last name</label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                      onBlur={saveBasics}
                      className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-3 outline-none placeholder:opacity-60 focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm opacity-80">Role:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setRole("student"); saveBasics(); }}
                      className={`rounded-lg px-3 py-1 text-sm border ${role === "student" ? "bg-tint-soft border-[color:var(--hairline)]" : "bg-white/90 border-black/10"}`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRole("supporter"); saveBasics(); }}
                      className={`rounded-lg px-3 py-1 text-sm border ${role === "supporter" ? "bg-tint-soft border-[color:var(--hairline)]" : "bg-white/90 border-black/10"}`}
                    >
                      Supporter
                    </button>
                  </div>
                </div>

                <div>
                  <label className="sr-only" htmlFor="about">About me</label>
                  <textarea
                    id="about"
                    rows={4}
                    placeholder="About me (optional)"
                    value={about}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAbout(e.target.value)}
                    onBlur={saveAbout}
                    className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-3 outline-none placeholder:opacity-60 focus:ring-2 focus:ring-black/10"
                  />
                  <p className="mt-1 text-[11px] opacity-70">Autosaves on blur.</p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="rounded-2xl card-surface p-5 space-y-3">
                <h2 className="text-base font-semibold">Contact</h2>
                <div className="text-sm opacity-80">
                  {contact ? (
                    <>
                      We’ll reach you at <span className="font-medium">{contactDisplay}</span>.
                    </>
                  ) : (
                    <>No contact set yet.</>
                  )}
                </div>
                <div>
                  <button type="button" className="btn-muted" onClick={editContact}>
                    Update phone or email
                  </button>
                </div>
              </div>

              {/* Motivation Card */}
              <div className="rounded-2xl card-surface p-5 space-y-3">
                <h2 className="text-base font-semibold">What motivates you</h2>
                {motivation ? (
                  <p className="text-sm opacity-80">{motivation}</p>
                ) : (
                  <p className="text-sm opacity-60">You haven’t answered this yet.</p>
                )}
                <div>
                  <button type="button" className="btn-muted" onClick={editMotivation}>
                    {motivation ? "Edit answer" : "Answer now"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
