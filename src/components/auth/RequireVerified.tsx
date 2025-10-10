// apps/web/src/components/auth/RequireVerified.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  redirectTo?: string; // default: /welcome
};

/**
 * Client-side gate for pages that require a verified session.
 * Checks localStorage ("everleap.verified" === "1"); otherwise redirects.
 */
export default function RequireVerified({ children, redirectTo = "/welcome" }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const ok = localStorage.getItem("everleap.verified") === "1";
      if (!ok) {
        router.replace(redirectTo);
        return;
      }
      setAllowed(true);
    } catch {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  if (!allowed) return null; // optional: show a skeleton/spinner here
  return <>{children}</>;
}
