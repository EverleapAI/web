"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

export default function SecureDevicePage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const rawReturnTo = sanitizeReturnTo(searchParams?.get("returnTo"));
    const returnTo =
      rawReturnTo && !rawReturnTo.startsWith("/regauth")
        ? rawReturnTo
        : "/main";

    router.replace(returnTo);
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="text-sm text-white/60">Continuing…</div>
    </main>
  );
}