// types/speech-sdk.d.ts

export {};

declare global {
  /**
   * Minimal SpeechRecognition typings (enough for our usage).
   * No `any` so ESLint stays happy.
   */

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence?: number;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error:
      | "no-speech"
      | "aborted"
      | "audio-capture"
      | "network"
      | "not-allowed"
      | "service-not-allowed"
      | "bad-grammar"
      | "language-not-supported"
      | string;
    readonly message?: string;
  }

  type SpeechRecognitionHandler<TEvent extends Event> = (
    this: SpeechRecognition,
    ev: TEvent
  ) => void;

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    continuous: boolean;

    start(): void;
    stop(): void;
    abort(): void;

    onaudiostart: SpeechRecognitionHandler<Event> | null;
    onaudioend: SpeechRecognitionHandler<Event> | null;
    onend: SpeechRecognitionHandler<Event> | null;
    onerror: SpeechRecognitionHandler<SpeechRecognitionErrorEvent> | null;
    onresult: SpeechRecognitionHandler<SpeechRecognitionEvent> | null;
    onstart: SpeechRecognitionHandler<Event> | null;
  }

  interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
  }

  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
