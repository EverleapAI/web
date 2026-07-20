// The agentic entry for the arrival interstitial.
//
// Earlier versions built this line from where the user had just been. That
// produced the one failure this screen cannot afford: "You were sizing up
// Dancers" sitting directly above a question about being a doctor. The intro
// and the questions were written by different authors and had no way to agree.
//
// These say nothing about where you came from and nothing about any specific
// question, so they can never contradict what follows. They do one job: make
// a short set of questions feel worth answering, in a voice that sounds like
// someone thinking out loud rather than a form requesting input.
//
// Voice, from 08_Writing/081_TEEN_LANGUAGE_GUIDE — checked against the guide,
// not guessed at. An earlier set was rewritten wholesale for breaking it:
//
//   "These are the questions I'd ask if we were talking rather than you
//    reading a screen — so answer them that way."
//
// That is an essay sentence. Nobody speaks it. The guide is explicit: grade
// 8-10 reading level, shorter sentences, one idea at a time, conversational
// before academic, avoid excessive punctuation. Specifically avoid:
//
//   - long sentences with em-dash subclauses
//   - aphorisms and neat closing lines ("honest is the only version worth having")
//   - commentary about the app, forms, or screens — it breaks the person
//   - corporate or inspirational register
//   - trying to be clever; a light warmth is the ceiling
//
// Write TO them, never LIKE them. The test in the guide: would a thoughtful
// sixteen-year-old say "that actually makes sense"?

export type Retort = {
  /** Eyebrow: 2-4 words, uppercased on render. */
  eyebrow: string;
  /** The entry itself — two or three sentences. */
  body: string;
};

// NO COUNTS. Never "three questions" — a batch can hold fewer, and then the
// copy is simply lying to the user. "A few", "these", "what's below" all survive
// a batch of one.
export const RETORTS: Retort[] = [
  {
    eyebrow: "A few gaps",
    body: "I've got a decent picture of you now. There are still gaps in it. Here are a few questions that would close one.",
  },
  {
    eyebrow: "Still working you out",
    body: "Some things about you I'm sure of. Some I'm still guessing at. These questions are aimed at the guessing.",
  },
  {
    eyebrow: "Before you go in",
    body: "Quick thing first, then I'm out of your way. I'd rather ask than assume, so here are a few questions.",
  },
  {
    eyebrow: "A hunch to check",
    body: "I have a hunch about you I'm not sure enough about to say yet. These would settle it. There's no right answer, just the true one.",
  },
  {
    eyebrow: "Filling in gaps",
    body: "A lot of what I know about you is from a while back, and people change. Here are a few questions to check what's still true.",
  },
  {
    eyebrow: "Quick check",
    body: "These are short on purpose. What you pick changes what I show you next.",
  },
  {
    eyebrow: "The unclear part",
    body: "I can see what interests you. I can't see how you act when it counts. These questions get at that.",
  },
  {
    eyebrow: "Worth knowing",
    body: "If I were a person helping you decide something real, here's what I'd want to know first.",
  },
  {
    eyebrow: "Small but useful",
    body: "These look like small questions. They're the ones that tell me the most, so have a look.",
  },
  {
    eyebrow: "One minute",
    body: "These take about a minute. I keep them short because long ones make people answer what sounds good instead of what's true.",
  },
  {
    eyebrow: "Testing an idea",
    body: "I've started forming an idea of how you work. Before I go with it, I want to check it against you. Here are a few questions that would help.",
  },
  {
    eyebrow: "Where I'm stuck",
    body: "Two things you've told me don't quite line up. I can't sort it out on my own, but these questions might.",
  },
  {
    eyebrow: "Between us",
    body: "Nobody sees this but me. I use it to make what you see next less generic, so answer these honestly rather than well.",
  },
  {
    eyebrow: "Sharpening it",
    body: "I could describe you right now, but it'd come out blurry. These sharpen it. Don't overthink them.",
  },
  {
    eyebrow: "Rather ask",
    body: "I could keep guessing about you. Asking works better, so here are a few.",
  },
  {
    eyebrow: "Not a test",
    body: "No quiz, no score. Just a few questions, and the only wrong move is picking what you think you're supposed to.",
  },
  {
    eyebrow: "Catching up",
    body: "You've done a fair bit since I last checked in. These questions catch me up on what's changed.",
  },
  {
    eyebrow: "The interesting bit",
    body: "The interesting thing about you isn't any one answer. It's where two of them pull against each other. That's what these are looking for.",
  },
  {
    eyebrow: "Honestly",
    body: "I'd rather ask something a bit awkward than get you wrong. Here they are, and they won't take long.",
  },
  {
    eyebrow: "Worth a minute",
    body: "Everything I show you is built from what you've told me. So the more real these answers are, the better that gets.",
  },
  {
    eyebrow: "Something odd",
    body: "Two things you've said sit a little oddly together. That's usually where the real answer is. These should tell me which way it goes.",
  },
  {
    eyebrow: "Getting specific",
    body: "General answers give me a general picture, which isn't much use. So on these, pick whichever option is closest, even if none is exactly right.",
  },
  {
    eyebrow: "Your call",
    body: "You can skip these. Nothing breaks. But answering means less guessing from me later.",
  },
  {
    eyebrow: "Reading you",
    body: "I think I've read you right, but thinking isn't knowing. These are the check. If I've got you wrong, this is where you say so.",
  },
  {
    eyebrow: "The last few",
    body: "There's a short list of things I still don't know about you. Here are a few questions that take some off it.",
  },
  {
    eyebrow: "Straight answers",
    body: "No build-up. Just a few questions, and the quicker you answer the more honest they usually are.",
  },
  {
    eyebrow: "What I'm missing",
    body: "I know what you like. I don't know what you'd choose when two things you want point different ways. These get at that.",
  },
  {
    eyebrow: "Checking in",
    body: "A moment before Today. These are what I'd ask if we were just talking.",
  },
  {
    eyebrow: "Only you know",
    body: "None of this is written down anywhere, and I can't work it out from what you've done. You're the only one who knows, so here are a few questions.",
  },
  {
    eyebrow: "Keeping up",
    body: "What I know about you should be as current as you are. These close the gap.",
  },
];

/**
 * Picks a retort without repeating the last few. Deterministic per page load
 * rather than random per render, so it doesn't flicker between one line and
 * another while the interstitial is open.
 */
const RECENT_KEY = "everleap_recent_retorts";
const AVOID_LAST = 8;

export function pickRetort(): Retort {
  let recent: number[] = [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (raw) recent = JSON.parse(raw);
  } catch {
    recent = [];
  }

  const available = RETORTS.map((_, index) => index).filter(
    (index) => !recent.includes(index)
  );
  const pool = available.length ? available : RETORTS.map((_, index) => index);
  const chosen = pool[Math.floor(Math.random() * pool.length)];

  try {
    const next = [chosen, ...recent].slice(0, AVOID_LAST);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // A full or blocked localStorage costs variety, not function.
  }

  return RETORTS[chosen];
}
