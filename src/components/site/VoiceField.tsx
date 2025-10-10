'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import { recognizeOnceText, type ExpectHint } from '@/lib/speech.client';

type Props = {
  /** Standard input id (so labels can target this control). */
  id?: string;
  /** Optional input name. */
  name?: string;

  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onMicResult?: (text: string) => void;
  placeholder?: string;

  /** Alias for focusing on mount (supported for convenience). */
  autoFocus?: boolean;
  /** Prefer this instead of autoFocus in pages to avoid a11y/TS lint noise */
  focusOnMount?: boolean;

  className?: string;

  /** 'free' | 'email' | 'phone' | 'contact' */
  expect?: ExpectHint;
  disableMic?: boolean;
};

function getErrorMessage(err: unknown, fallback = 'Could not capture speech.'): string {
  if (err instanceof Error && typeof err.message === 'string') return err.message;
  return fallback;
}

export default function VoiceField({
  id,
  name,
  value,
  onChange,
  onKeyDown,
  onBlur,
  onMicResult,
  placeholder,
  autoFocus = false,
  focusOnMount = false,
  className,
  expect = 'free',
  disableMic = false,
}: Props) {
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const shouldAutoFocus = autoFocus || focusOnMount;

  // Input attributes that avoid autocorrect clobbering emails/phones
  const inputMode = useMemo<React.HTMLAttributes<HTMLInputElement>['inputMode']>(() => {
    if (expect === 'phone') return 'tel';
    if (expect === 'email') return 'email';
    return 'text';
  }, [expect]);

  const startMic = useCallback(async () => {
    if (disableMic || listening) return;
    setErr(null);
    setListening(true);
    try {
      const text = await recognizeOnceText({
        silenceMs: 1000, // stop after ~1s of silence
        expect,
        biasPhrases:
          expect === 'email'
            ? ['at', 'dot', 'underscore', 'hyphen', 'gmail.com', 'outlook.com', 'yahoo.com', 'comcast.net']
            : expect === 'phone'
            ? ['plus', 'dash', 'hyphen']
            : [],
      });
      if (text && onMicResult) onMicResult(text);
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setListening(false);
      btnRef.current?.focus();
    }
  }, [disableMic, listening, expect, onMicResult]);

  return (
    <div className={className}>
      <div className="flex items-stretch gap-2">
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          autoFocus={shouldAutoFocus}
          inputMode={inputMode}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 rounded-xl border border-black/10 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(var(--accent-rgb))]/40"
        />
        <button
          type="button"
          ref={btnRef}
          onClick={startMic}
          disabled={disableMic || listening}
          aria-pressed={listening}
          aria-label={listening ? 'Listening…' : 'Use microphone'}
          className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold bg-white/90 shadow-sm ring-1 ring-black/10 hover:bg-white disabled:opacity-60"
        >
          {listening ? 'Listening…' : '🎤'}
        </button>
      </div>
      {err && <p className="mt-2 text-[12px] text-red-700">{err}</p>}
    </div>
  );
}
