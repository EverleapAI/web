'use client';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type ExpectHint = 'free' | 'email' | 'phone' | 'contact';
export interface SpeechOptions {
  silenceMs?: number;
  biasPhrases?: string[];
  expect?: ExpectHint;
}

type SpeechSDKModule = typeof import('microsoft-cognitiveservices-speech-sdk');

async function loadSpeechSdk(): Promise<SpeechSDKModule> {
  const mod = (await import('microsoft-cognitiveservices-speech-sdk')) as unknown as
    SpeechSDKModule & { default?: SpeechSDKModule };
  return mod.default ?? (mod as SpeechSDKModule);
}

export async function fetchSpeechToken(): Promise<{ token: string; region: string }> {
  const res = await fetch(`${API_BASE}/speech/token`, { method: 'POST' });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Speech token fetch failed (${res.status}): ${txt}`);
  }
  return (await res.json()) as { token: string; region: string };
}

export async function recognizeOnceText(opts: SpeechOptions = {}): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Speech SDK can only run in the browser');
  }

  const sdk = await loadSpeechSdk();
  const { token, region } = await fetchSpeechToken();

  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
  speechConfig.speechRecognitionLanguage = 'en-US';
  speechConfig.setProperty(
    sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
    String(opts.silenceMs ?? 1000),
  );

  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  const phrases = [
    'at', 'dot', 'underscore', 'hyphen', 'dash', 'plus',
    'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'comcast.net',
    ...(opts.biasPhrases ?? []),
  ];
  const pl = sdk.PhraseListGrammar.fromRecognizer(recognizer);
  phrases.forEach((p: string) => pl.addPhrase(p));

  const raw = await new Promise<string>((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result: unknown) => {
        recognizer.close();
        const r = result as { reason?: number; text?: string };
        if (r?.reason === sdk.ResultReason.RecognizedSpeech) {
          resolve(r.text ?? '');
        } else {
          const reasonName =
            r?.reason === sdk.ResultReason.NoMatch ? 'NoMatch'
            : r?.reason === sdk.ResultReason.Canceled ? 'Canceled'
            : String(r?.reason ?? 'Unknown');
          reject(new Error(`No speech recognized (${reasonName})`));
        }
      },
      (err: unknown) => {
        recognizer.close();
        reject(err instanceof Error ? err : new Error(String(err)));
      },
    );
  });

  // Clean trailing sentence punctuation that the SDK sometimes adds.
  const baseText = (raw || '').trim().replace(/[.!?。、，。]+$/g, '');

  switch (opts.expect) {
    case 'email':
      return normalizeSpokenEmail(baseText);
    case 'phone':
      return normalizeSpokenPhone(baseText);
    case 'contact':
      return normalizeEmailOrPhone(baseText);
    default:
      return baseText;
  }
}

/* ---------- Normalizers ---------- */

export function normalizeSpokenEmail(input: string): string {
  let v = input.toLowerCase();
  v = v
    .replace(/\s*(at|@)\s*/g, '@')
    .replace(/\s*(dot|period)\s*/g, '.')
    .replace(/\s*(underscore|under score)\s*/g, '_')
    .replace(/\s*(dash|hyphen)\s*/g, '-')
    .replace(/\s*(plus|plus sign)\s*/g, '+');

  v = v.replace(/\s+(@|\.|\+|_|-)\s+/g, '$1').replace(/\s+/g, '');

  v = v
    .replace(/@gmailcom$/, '@gmail.com')
    .replace(/@yahoocom$/, '@yahoo.com')
    .replace(/@outlookcom$/, '@outlook.com')
    .replace(/@hotmailcom$/, '@hotmail.com')
    .replace(/@icloudcom$/, '@icloud.com')
    .replace(/@comcastnet$/, '@comcast.net');

  // Strip trailing dots
  v = v.replace(/\.+$/g, '');
  return v;
}

export function normalizeSpokenPhone(input: string): string {
  let v = input.toLowerCase();
  const map: Record<string, string> = {
    zero: '0',
    oh: '0',
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
  };

  v = v.replace(/\b(zero|oh|one|two|three|four|five|six|seven|eight|nine)\b/g, (m) => map[m] || m);
  v = v.replace(/\b(dash|hyphen|space|dot|period|parenthesis|paren|open|close)\b/gi, '');

  const d = v.replace(/\D+/g, '');
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  if (d.length === 10) return `+1${d}`;
  return d ? `+${d}` : '';
}

export function normalizeEmailOrPhone(input: string): string {
  if (/@|\bat\b|\bdot\b|\bperiod\b/i.test(input)) {
    return normalizeSpokenEmail(input);
  }
  return normalizeSpokenPhone(input);
}
