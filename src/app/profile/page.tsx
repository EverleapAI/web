// src/app/main/profile/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function ProfilePlaceholderPage() {
  return (
    <AppChrome title="Your profile">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/main/you"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/20">
            <User className="h-5 w-5 text-white/80" />
          </div>
          <div>
            <div className="text-base font-semibold text-white">Profile (Placeholder)</div>
            <div className="text-sm text-white/60">
              This is where we’ll edit avatar, name, grade/school, and account basics.
            </div>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-white/70">
          <li>• Avatar + display name</li>
          <li>• Email / sign-in status</li>
          <li>• Notification preferences</li>
          <li>• Data export / delete (later)</li>
        </ul>

        <div className="mt-5 text-xs text-white/45">
          Next: we can connect this to the “You” section once we finalize how profiles are stored.
        </div>
      </div>

      <BottomNav activeKey="you" />
    </AppChrome>
  );
}
