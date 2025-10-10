// apps/web/app/profile/layout.tsx
"use client";

import type { ReactNode } from "react";
import RequireVerified from "@/components/auth/RequireVerified";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  // Guard everything under /profile/**
  return <RequireVerified redirectTo="/welcome">{children}</RequireVerified>;
}
