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

/**
 * The reading face for prose (NOT for UI — buttons and labels stay sans).
 *
 * A serif was shipped and reverted on sight yesterday ("revert it looks
 * terrible"), but that test was invalid: it was rendered in the old recipe —
 * dim #A2A6B0, weight 500, +0.4px tracking. That is how you set a UI label, and
 * a serif set that way looks awful. The thickened strokes clog the counters, the
 * letter-spacing breaks the very word-shapes a serif exists to build, and the
 * dimness kills the stroke contrast that makes it readable at all. The face was
 * never actually judged.
 *
 * Georgia, not Source Serif 4: it ships on Windows AND iOS (zero bytes, no load
 * flash), it was drawn for screen reading with sturdy low-contrast strokes that
 * survive a dark ground — high-contrast editorial serifs halate badly on dark —
 * and it is a news serif, which is the register we're actually chasing.
 */
export type ReadFace = "sans" | "serif";

const KEY = "el:chrome";
const FACE_KEY = "el:face";

function isMode(v: string | null): v is ChromeMode {
  return v === "card" || v === "bare";
}

function isFace(v: string | null): v is ReadFace {
  return v === "sans" || v === "serif";
}

/** Reads `?face=serif|sans`, else localStorage, else "sans". */
export function useReadFace(): [ReadFace, (f: ReadFace) => void] {
  const [face, setFace] = React.useState<ReadFace>("sans");

  React.useEffect(() => {
    let next: ReadFace = "sans";
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("face");
      const fromStore = window.localStorage.getItem(FACE_KEY);
      if (isFace(fromUrl)) {
        next = fromUrl;
        window.localStorage.setItem(FACE_KEY, fromUrl);
      } else if (isFace(fromStore)) {
        next = fromStore;
      }
    } catch {
      /* private mode — stay on the default */
    }
    setFace(next);
  }, []);

  const set = React.useCallback((f: ReadFace) => {
    setFace(f);
    try {
      window.localStorage.setItem(FACE_KEY, f);
    } catch {
      /* ignore */
    }
  }, []);

  return [face, set];
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
