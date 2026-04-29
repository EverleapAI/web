// web/src/app/dev/auth-test/page.tsx

"use client";

import { useState } from "react";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);

  async function requestCode() {
    try {
      const res = await fetch(`${API}/auth/email/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const text = await res.text();

      setResult({
        step: "request-code",
        ok: res.ok,
        status: res.status,
        body: text,
      });
    } catch (e: any) {
      setResult({
        step: "request-code",
        error: e?.message || "unknown error",
      });
    }
  }

  async function verifyCode() {
    try {
      const res = await fetch(`${API}/auth/email/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      const text = await res.text();

      setResult({
        step: "verify-code",
        ok: res.ok,
        status: res.status,
        body: text,
      });
    } catch (e: any) {
      setResult({
        step: "verify-code",
        error: e?.message || "unknown error",
      });
    }
  }

  async function me() {
    try {
      const res = await fetch(`${API}/me`, {
        credentials: "include",
      });

      const text = await res.text();

      setResult({
        step: "me",
        ok: res.ok,
        status: res.status,
        body: text,
      });
    } catch (e: any) {
      setResult({
        step: "me",
        error: e?.message || "unknown error",
      });
    }
  }

  async function logout() {
    try {
      const res = await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const text = await res.text();

      setResult({
        step: "logout",
        ok: res.ok,
        status: res.status,
        body: text,
      });
    } catch (e: any) {
      setResult({
        step: "logout",
        error: e?.message || "unknown error",
      });
    }
  }

  async function registerPasskey() {
    try {
      const optsRes = await fetch(`${API}/auth/passkey/register/options`, {
        method: "POST",
        credentials: "include",
      });

      const data = await optsRes.json();

      const attestation = await startRegistration({
        optionsJSON: data.options,
      });

      const verifyRes = await fetch(`${API}/auth/passkey/register/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(attestation),
      });

      const text = await verifyRes.text();

      setResult({
        step: "passkey-register",
        ok: verifyRes.ok,
        status: verifyRes.status,
        body: text,
      });
    } catch (e: any) {
      setResult({
        step: "passkey-register",
        error: e?.message || "unknown error",
      });
    }
  }

  async function loginPasskey() {
    try {
      const optsRes = await fetch(`${API}/auth/passkey/login/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await optsRes.json();

      const assertion = await startAuthentication({
        optionsJSON: data.options,
      });

      const verifyRes = await fetch(`${API}/auth/passkey/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(assertion),
      });

      const text = await verifyRes.text();

      setResult({
        step: "passkey-login",
        ok: verifyRes.ok,
        status: verifyRes.status,
        body: text,
      });
    } catch (e: any) {
      setResult({
        step: "passkey-login",
        error: e?.message || "unknown error",
      });
    }
  }

  return (
    <div style={{ padding: 20, color: "white" }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>AUTH TEST LIVE</div>
      <div>API: {API}</div>

      <br />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        style={{ display: "block", marginBottom: 12, padding: 8, width: 320 }}
      />

      <button onClick={requestCode}>Request Code</button>

      <br /><br />

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
        style={{ display: "block", marginBottom: 12, padding: 8, width: 320 }}
      />

      <button onClick={verifyCode}>Verify Code</button>

      <br /><br />

      <button onClick={me}>Me</button>

      <br /><br />

      <button onClick={logout}>Logout</button>

      <br /><br />

      <button onClick={registerPasskey}>Register Passkey</button>

      <br /><br />

      <button onClick={loginPasskey}>Login with Passkey</button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}