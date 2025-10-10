"use client";

import { useEffect, useState, FormEvent } from "react";

// hard-coded dev credentials
const USERNAME = "everleap";
// SHA-256("Evertango!") = 3f8ed3ac95968400b3a8982522903209121fe992c483cfd984c4afcabba53ade
const PASS_HASH_HEX = "3f8ed3ac95968400b3a8982522903209121fe992c483cfd984c4afcabba53ade";

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax; Secure`;
}

export default function Gate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (getCookie("everleap_lock") === "ok") setUnlocked(true);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const passHash = await sha256Hex(pass);
    if (user === USERNAME && passHash === PASS_HASH_HEX) {
      setCookie("everleap_lock", "ok", 30);
      setUnlocked(true);
      return;
    }
    setErr("Invalid username or password.");
  }

  if (unlocked) return <>{children}</>;

  // Lock screen with background video
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/background.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 grid min-h-[100svh] place-items-center p-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-2xl bg-white/85 backdrop-blur-md border border-white/40 shadow-2xl p-8"
        >
          <h1 className="text-2xl font-semibold text-gray-900 text-center">Restricted</h1>
          <p className="mt-1 text-center text-gray-600">Enter site password to continue.</p>

          <label className="sr-only" htmlFor="el-user">Username</label>
          <input
            id="el-user"
            className="mt-6 w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
          />

          <label className="sr-only" htmlFor="el-pass">Password</label>
          <input
            id="el-pass"
            type="password"
            className="mt-3 w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />

          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 active:scale-[0.99] transition"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
