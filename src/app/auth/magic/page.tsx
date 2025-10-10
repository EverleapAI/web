// apps/web/src/app/auth/magic/page.tsx
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
  const [error, setError] = useState<string | null>(null);

  // Compose API consume URL
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
  const consumeUrl = useMemo(() => {
    if (!token || !apiBase) return null;
    return `${apiBase}/auth/magic/consume?token=${encodeURIComponent(token)}`;
  }, [apiBase, token]);

  useEffect(() => {
    if (!token) {
      setError("This link is missing its token. Try sending yourself a new link.");
      return;
    }
    if (!apiBase || !consumeUrl) {
      setError("We’re missing our API base URL. Please try again in a moment.");
      return;
    }
    // Hard redirect so the API can set the cookie & 302 to /dashboard
    try {
      window.location.replace(consumeUrl);
    } catch {
      setError("We couldn’t open your sign-in link. You can try again.");
    }
  }, [apiBase, token, consumeUrl]);

  const headline = error ? "We couldn’t complete your sign-in" : "Validating your link…";

  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-4">
        <ConversationChrome
          progress={error ? 0 : 0.9}
          prompt={<span className="opacity-100 translate-y-0">{headline}</span>}
        >
          <section className="mt-4 space-y-5 opacity-100 translate-y-0">
            {!error ? (
              <div className="rounded-2xl card-surface p-4 text-sm">
                <p>Hang tight — we’re finishing your sign-in.</p>
                {consumeUrl ? (
                  <p className="text-[12px] opacity-70 mt-2">
                    If nothing happens,{" "}
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
                <div>
                  <button
                    type="button"
                    className="btn-primary w-full"
                    onClick={() => router.replace("/login")}
                  >
                    Back to login
                  </button>
                </div>
              </div>
            )}
            {process.env.NODE_ENV !== "production" && token ? (
              <p className="text-[11px] opacity-60 text-center">token…{token.slice(-8)}</p>
            ) : null}
          </section>
        </ConversationChrome>
      </main>
      <SiteFooter />
    </div>
  );
}
