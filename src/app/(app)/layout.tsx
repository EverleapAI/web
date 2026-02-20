// src/app/(app)/layout.tsx

import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-neutral-950 text-neutral-100">
      {children}
    </div>
  );
}
