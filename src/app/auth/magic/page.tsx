"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ConversationChrome from "@/components/conversation/ConversationChrome";

export default function MagicCatcherPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const token = sp.get("token") || "";
  const nextParam = sp.get("next") || ""; // preserve desired post-login destination
  const [error, setError] = useState<string | null>(null);

  // Normalize API base (frontend always calls BFF under /api/session/magic)
  // NOTE: No longer needed here; keeping comment for context.
  // const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
  // const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;

  const consumeUrl = useMemo(() => {
    if (!token) return null;

    // ✅ Call our BFF proxy (not the Functions endpoint directly)
    const url = new URL(`/api/session/magic/consume`, window.location.origin);
    url.searchParams.set("token", token);
    if (nextParam && nextParam.startsWith("/")) {
      url.searchParams.set("next", nextParam);
    }
    return url.toString();
  }, [token, nextParam]);

  useEffect(() => {
    if (!token) {
      setError(
        "This link is missing its token. Try sending yourself a new link."
      );
      return;
    }
    if (!consumeUrl) {
      setError(
        "We’re missing our sign-in endpoint. Please try again in a moment."
      );
      return;
    }

    // Use a direct redirect so the backend can set cookies securely
    try {
      window.location.replace(consumeUrl);

      // Fallback retry after a moment in case the browser blocks the first redirect
      const t = setTimeout(() => {
        if (document.visibilityState === "visible") {
          try {
            window.location.href = consumeUrl;
          } catch {
            // ignore
          }
        }
      }, 1200);

      return () => clearTimeout(t);
    } catch {
      setError("We couldn’t open your sign-in link. You can try again.");
    }
  }, [token, consumeUrl]);

  const headline = error
    ? "We couldn’t complete your sign-in"
    : "Validating your link…";

  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-4">
        <ConversationChrome
          progress={error ? 0 : 0.9}
          prompt={
            <span className="opacity-100 translate-y-0">{headline}</span>
          }
        >
          <section className="mt-4 space-y-5 opacity-100 translate-y-0">
            {!error ? (
              <div className="rounded-2xl card-surface p-4 text-sm">
                <p>Hang tight — we’re finishing your sign-in.</p>
                {consumeUrl ? (
                  <p className="text-meta opacity-70 mt-2">
                    If nothing happens,&nbsp;
                    <a className="link" href={consumeUrl}>
                      tap here to continue
                    </a>
                    .
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl card-surface p-4 text-sm">
                  <p className="text-red-700">{error}</p>
                </div>
                <div className="flex gap-2">
                  {consumeUrl && (
                    <a
                      className="btn-primary flex-1 text-center"
                      href={consumeUrl}
                    >
                      Try again
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={() => router.replace("/login")}
                  >
                    Back to login
                  </button>
                </div>
              </div>
            )}
            {process.env.NODE_ENV !== "production" && token ? (
              <p className="text-micro opacity-60 text-center">
                token…{token.slice(-8)}
              </p>
            ) : null}
          </section>
        </ConversationChrome>
      </main>
      <SiteFooter />
    </div>
  );
}
