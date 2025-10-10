// apps/web/app/questions/layout.tsx
"use client";

import type { ReactNode } from "react";
import RequireVerified from "@/components/auth/RequireVerified";
import RequireConsent from "@/components/site/RequireConsent";

export default function QuestionsLayout({ children }: { children: ReactNode }) {
  // Client-side UX guard + consent for everything under /questions/**
  return (
    <RequireVerified redirectTo="/welcome">
      <RequireConsent>{children}</RequireConsent>
    </RequireVerified>
  );
}
