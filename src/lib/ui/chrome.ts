"use client";

// Chrome mode — a local-only A/B switch for the decorative layers around the read.
//
// CNN's mobile design is the absence of design: text sits directly on near-black,
// with no container, border, glow or shadow. Everleap's read sits inside a
// SectionCard with six decorative layers between the reader and the words — a
// 28px rounded edge, a hairline border, a backdrop blur, three stacked gradients,
// a drop shadow, and a constellation starfield rendered behind the prose. You can
// match CNN's type exactly (we now do) and it will still read as "an app showing
// you a card", because the container speaks first.
//
// "bare" removes all six and lets the prose sit on the page. It keeps the page
// background — this is not a black-out, it's a chrome-ectomy.
//
// Deliberately NOT persisted to the server or shipped as a feature flag: it's a
// judgement call to be made with eyes, so it lives in the URL and localStorage
// and defaults to the current design. Delete this file when the call is made.

import * as React from "react";

export type ChromeMode = "card" | "bare";

const KEY = "el:chrome";

function isMode(v: string | null): v is ChromeMode {
  return v === "card" || v === "bare";
}

/**
 * Reads `?chrome=bare|card` (wins, and is sticky) else localStorage else "card".
 * Always returns "card" on the server so SSR matches the current design.
 */
export function useChromeMode(): [ChromeMode, (m: ChromeMode) => void] {
  const [mode, setMode] = React.useState<ChromeMode>("card");

  React.useEffect(() => {
    let next: ChromeMode = "card";
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("chrome");
      const fromStore = window.localStorage.getItem(KEY);
      if (isMode(fromUrl)) {
        next = fromUrl;
        window.localStorage.setItem(KEY, fromUrl);
      } else if (isMode(fromStore)) {
        next = fromStore;
      }
    } catch {
      // private mode / no storage — stay on the default
    }
    setMode(next);
  }, []);

  const set = React.useCallback((m: ChromeMode) => {
    setMode(m);
    try {
      window.localStorage.setItem(KEY, m);
    } catch {
      /* ignore */
    }
  }, []);

  return [mode, set];
}
