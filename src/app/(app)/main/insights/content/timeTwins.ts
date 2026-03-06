// apps/web/src/app/(app)/main/insights/fun-facts/content/timeTwins.ts

export type AccentRgb = {
  r: number;
  g: number;
  b: number;
};

export type RGB = AccentRgb;

export type TimeTwinTile = {
  title: string;
  body: string;
  icon?: string;
};

export type TimeTwinStoryBeat = {
  body: string;
};

export type TimeTwinVisualTheme =
  | "inventor-parchment"
  | "inventor-electric"
  | "scientist-luminous"
  | "logic-victorian"
  | "code-shadow"
  | "cosmic-wonder"
  | "geometry-marble"
  | "future-dusk"
  | "painter-bloom"
  | "ink-moon";

export type TimeTwinPortraitArchetype =
  | "inventor"
  | "scientist"
  | "mathematician"
  | "coder"
  | "cosmic-guide"
  | "philosopher"
  | "futurist"
  | "artist"
  | "writer";

export type TimeTwinHeroPattern =
  | "sketch"
  | "coil"
  | "glass"
  | "diagram"
  | "grid"
  | "stars"
  | "geometry"
  | "skyline"
  | "paint"
  | "ink";

export type TimeTwin = {
  id: string;

  name: string;
  era: string;
  tagline: string;

  /** kept temporarily for compatibility with current UI */
  heroImage: string;
  portraitImage: string;

  /** new code-driven rendering tokens */
  visualTheme: TimeTwinVisualTheme;
  portraitArchetype: TimeTwinPortraitArchetype;
  heroPattern: TimeTwinHeroPattern;

  accentRgb: AccentRgb;

  mindType: string;

  whyYou: string[];

  tiles: TimeTwinTile[];

  storyBeats: TimeTwinStoryBeat[];

  superpower: string;
  watchout: string;
  tryThisWeek: string;

  learnMore: string;
};

export const TIME_TWINS: TimeTwin[] = [
  {
    id: "leonardo",

    name: "Leonardo da Vinci",
    era: "1452–1519",
    tagline: "The mind that refused to stay in one box.",

    heroImage: "/time-twins/leonardo-hero.jpg",
    portraitImage: "/time-twins/leonardo-portrait.jpg",

    visualTheme: "inventor-parchment",
    portraitArchetype: "inventor",
    heroPattern: "sketch",

    accentRgb: { r: 214, g: 180, b: 120 },

    mindType: "Pattern Seer",

    whyYou: [
      "You do not naturally keep art, science, and curiosity in separate rooms.",
      "When something catches your attention, you want to understand how it works from the inside out.",
      "You are often less interested in the approved answer than in the bigger pattern behind it.",
    ],

    tiles: [
      {
        title: "Cross-Wired Curiosity",
        body: "You instinctively connect ideas that most people keep in separate categories.",
        icon: "Compass",
      },
      {
        title: "Make To Understand",
        body: "Thinking for you often becomes sketching, testing, building, or diagramming.",
        icon: "Wrench",
      },
      {
        title: "Restless Observation",
        body: "You look closely, keep asking questions, and do not like leaving a mystery untouched.",
        icon: "Sparkles",
      },
    ],

    storyBeats: [
      {
        body: "Leonardo filled notebook after notebook with studies of anatomy, machines, flight, water, architecture, and painting. He did not treat these as separate interests. To him, they were all part of the same investigation.",
      },
      {
        body: "He watched the world with almost unreasonable intensity. Muscles, birds, rivers, light, engineering problems — all of it belonged in the same field of vision if it helped him see reality more clearly.",
      },
      {
        body: "That is what makes him more than a generic genius figure. The real pattern is that he thought by connecting things, by drawing them, and by chasing the structure underneath appearances.",
      },
    ],

    superpower:
      "Your curiosity can lead you to connections that people miss when they stay inside one narrow box.",

    watchout:
      "When too many interesting paths open at once, your attention can splinter and make completion feel less exciting than discovery.",

    tryThisWeek:
      "Take one idea you care about and sketch it three different ways — visually, verbally, and as a system — so you can see how the pattern changes.",

    learnMore: "https://en.wikipedia.org/wiki/Leonardo_da_Vinci",
  },

  {
    id: "tesla",

    name: "Nikola Tesla",
    era: "1856–1943",
    tagline: "The imagination of electricity.",

    heroImage: "/time-twins/tesla-hero.jpg",
    portraitImage: "/time-twins/tesla-portrait.jpg",

    visualTheme: "inventor-electric",
    portraitArchetype: "inventor",
    heroPattern: "coil",

    accentRgb: { r: 120, g: 180, b: 255 },

    mindType: "Visionary Builder",

    whyYou: [
      "You often think several steps beyond what is directly in front of you.",
      "Invisible systems interest you because they shape everything even when nobody notices them.",
      "You can sometimes see a design in your head before the world has any proof that it should exist.",
    ],

    tiles: [
      {
        title: "Future-Leaning Mind",
        body: "You are energized by what something could become, not just by what it already is.",
        icon: "Orbit",
      },
      {
        title: "Internal Simulation",
        body: "You can mentally run ideas before anyone else sees the prototype.",
        icon: "Brain",
      },
      {
        title: "Hidden Systems Curiosity",
        body: "You are drawn to the forces behind things, not only the visible result.",
        icon: "Bolt",
      },
    ],

    storyBeats: [
      {
        body: "Tesla was not only an inventor with technical skill. He was unusually visual. He claimed he could picture machines in detail, rotate them in his mind, and test them internally before ever building them physically.",
      },
      {
        body: "His work on alternating current helped transform how electrical power could be generated and distributed. That matters because he was not just solving a local problem — he was thinking at the scale of systems.",
      },
      {
        body: "The real link here is not “electricity.” It is the habit of seeing hidden structure, imagining what does not exist yet, and trusting that vision long before everyone else catches up.",
      },
    ],

    superpower:
      "You can imagine systems, futures, and possibilities that other people do not see until much later.",

    watchout:
      "When your mind is moving far ahead of the room, you can become impatient with slower thinkers or with the practical work of translation.",

    tryThisWeek:
      "Write down one idea that feels ahead of its time, then force yourself to explain how it would work in the simplest possible terms.",

    learnMore: "https://en.wikipedia.org/wiki/Nikola_Tesla",
  },

  {
    id: "curie",

    name: "Marie Curie",
    era: "1867–1934",
    tagline: "The quiet force of scientific curiosity.",

    heroImage: "/time-twins/curie-hero.jpg",
    portraitImage: "/time-twins/curie-portrait.jpg",

    visualTheme: "scientist-luminous",
    portraitArchetype: "scientist",
    heroPattern: "glass",

    accentRgb: { r: 140, g: 255, b: 200 },

    mindType: "Relentless Discoverer",

    whyYou: [
      "You can stay with a question long after the first excitement has worn off.",
      "You are not just curious in a playful way — you can be patient, disciplined, and deeply persistent about the truth.",
      "Quiet intensity fits you better than loud performance.",
    ],

    tiles: [
      {
        title: "Patient Curiosity",
        body: "You can keep investigating even when the answer takes time to reveal itself.",
        icon: "Beaker",
      },
      {
        title: "Deep Focus",
        body: "When something matters, your attention can become unusually steady.",
        icon: "Brain",
      },
      {
        title: "Low-Drama Seriousness",
        body: "You do not need noise or recognition in order to pursue meaningful work.",
        icon: "Shield",
      },
    ],

    storyBeats: [
      {
        body: "Marie Curie’s work required extraordinary patience. She spent years investigating radioactive materials with a level of persistence that most people could not sustain.",
      },
      {
        body: "She became the first person to win two Nobel Prizes, but the deeper point is not the awards. It is the quality of attention underneath them: rigorous, stubborn, and willing to keep going when the process was slow and difficult.",
      },
      {
        body: "That is why this match can feel specific. Some people are energized by novelty alone. Curie represents another kind of mind — one that can remain loyal to a hard question until it yields something real.",
      },
    ],

    superpower:
      "You can bring patience, seriousness, and sustained focus to questions that would exhaust most people.",

    watchout:
      "Because you can go so deep, you may overextend yourself or start treating intensity as the only acceptable pace.",

    tryThisWeek:
      "Pick one question you care about and stay with it longer than feels convenient, even if the progress is slow and quiet.",

    learnMore: "https://en.wikipedia.org/wiki/Marie_Curie",
  },

  {
    id: "ada",

    name: "Ada Lovelace",
    era: "1815–1852",
    tagline: "The poet of logic and machines.",

    heroImage: "/time-twins/ada-hero.jpg",
    portraitImage: "/time-twins/ada-portrait.jpg",

    visualTheme: "logic-victorian",
    portraitArchetype: "mathematician",
    heroPattern: "diagram",

    accentRgb: { r: 200, g: 150, b: 255 },

    mindType: "Abstract Thinker",

    whyYou: [
      "You are drawn to systems, but not in a cold way — you want the underlying logic and the imaginative possibility at the same time.",
      "You tend to see what a tool, structure, or idea could become, not only what it currently does.",
      "Pattern and creativity feel linked to you, not opposed.",
    ],

    tiles: [
      {
        title: "Logic + Imagination",
        body: "You do not experience structure and creativity as enemies.",
        icon: "Code",
      },
      {
        title: "Systems Lens",
        body: "You naturally think in terms of interactions, rules, and hidden architecture.",
        icon: "Compass",
      },
      {
        title: "Future Possibility",
        body: "You see the next version of things before they are obvious to everyone else.",
        icon: "Orbit",
      },
    ],

    storyBeats: [
      {
        body: "Ada Lovelace is often described as the first computer programmer, but the most interesting thing about her is not the title. It is the leap she made in her thinking.",
      },
      {
        body: "When she looked at Charles Babbage’s analytical engine, she did not just see a machine for calculation. She imagined a machine that could work with symbols and patterns more broadly — even music, if represented correctly.",
      },
      {
        body: "That makes her less a “math person” stereotype and more a model of a mind that can see structure and possibility at once. That is the part of this match that actually matters.",
      },
    ],

    superpower:
      "You can connect imagination and logic in a way that lets you see systems other people only partially understand.",

    watchout:
      "Because your mind likes abstraction, you may sometimes stay in the conceptual layer longer than the practical layer needs.",

    tryThisWeek:
      "Take one messy system in your life and map what it is doing now, then write one sentence about what it could become if it were designed better.",

    learnMore: "https://en.wikipedia.org/wiki/Ada_Lovelace",
  },

  {
    id: "turing",

    name: "Alan Turing",
    era: "1912–1954",
    tagline: "The code-breaker who looked beneath the surface.",

    heroImage: "/time-twins/turing-hero.jpg",
    portraitImage: "/time-twins/turing-portrait.jpg",

    visualTheme: "code-shadow",
    portraitArchetype: "coder",
    heroPattern: "grid",

    accentRgb: { r: 120, g: 220, b: 210 },

    mindType: "Hidden-Pattern Decoder",

    whyYou: [
      "You want to know what is actually going on underneath the mess.",
      "Puzzles are interesting to you because they imply a deeper logic waiting to be uncovered.",
      "You trust structure even when the answer is not visible yet.",
    ],

    tiles: [
      {
        title: "Pattern Hunter",
        body: "You are drawn to order that is hidden inside noise.",
        icon: "Code",
      },
      {
        title: "Quiet Precision",
        body: "You can tolerate complexity if it leads to a cleaner explanation.",
        icon: "Brain",
      },
      {
        title: "Below-The-Surface Thinking",
        body: "You care about the mechanism beneath the appearance.",
        icon: "Orbit",
      },
    ],

    storyBeats: [
      {
        body: "Alan Turing helped crack encrypted wartime communications at Bletchley Park, work that required patience, abstraction, and the ability to believe there was order inside apparent chaos.",
      },
      {
        body: "He also laid down ideas that became foundational to modern computing. In both cases, the important pattern was the same: he was interested in what could be formalized, decoded, and understood beneath the surface.",
      },
      {
        body: "This match is strongest for people whose minds are naturally drawn to hidden structure — people who are less interested in noise than in the rules underneath it.",
      },
    ],

    superpower:
      "You can stay with hard, complicated problems long enough to find the pattern that makes them intelligible.",

    watchout:
      "You may spend so long refining the internal logic that other people lose sight of the path you took to get there.",

    tryThisWeek:
      "Take one confusing problem and reduce it to its underlying rules before you try to solve the whole thing at once.",

    learnMore: "https://en.wikipedia.org/wiki/Alan_Turing",
  },

  {
    id: "sagan",

    name: "Carl Sagan",
    era: "1934–1996",
    tagline: "The cosmic storyteller of wonder and scale.",

    heroImage: "/time-twins/sagan-hero.jpg",
    portraitImage: "/time-twins/sagan-portrait.jpg",

    visualTheme: "cosmic-wonder",
    portraitArchetype: "cosmic-guide",
    heroPattern: "stars",

    accentRgb: { r: 110, g: 140, b: 255 },

    mindType: "Wonder Translator",

    whyYou: [
      "You are energized by big questions instead of scared off by them.",
      "Facts matter to you, but meaning matters too.",
      "You like ideas that make the world feel larger, more connected, and more alive.",
    ],

    tiles: [
      {
        title: "Scale Thinker",
        body: "You naturally zoom out until the bigger picture comes into view.",
        icon: "Orbit",
      },
      {
        title: "Wonder + Clarity",
        body: "You want depth without losing the human feeling inside it.",
        icon: "Sparkles",
      },
      {
        title: "Meaning-Maker",
        body: "You care about what knowledge changes in the way people see themselves.",
        icon: "Compass",
      },
    ],

    storyBeats: [
      {
        body: "Carl Sagan studied planets, atmospheres, and the possibility of life beyond Earth, but what made him memorable was not just the science. It was the way he translated scale into emotion and wonder.",
      },
      {
        body: "He could explain the cosmos in a way that made people feel both smaller and more connected. Knowledge, in his hands, did not flatten reality. It made it more vivid.",
      },
      {
        body: "That is the real point of this match: some minds are built not only to understand large ideas, but to feel their meaning and help other people feel it too.",
      },
    ],

    superpower:
      "You can connect big ideas to wonder, meaning, and a larger sense of possibility.",

    watchout:
      "You may sometimes drift so far into the big picture that the next practical move feels less compelling than the vision itself.",

    tryThisWeek:
      "Take one huge idea you love and explain it in a way that would make someone younger feel curious rather than intimidated.",

    learnMore: "https://en.wikipedia.org/wiki/Carl_Sagan",
  },

  {
    id: "hypatia",

    name: "Hypatia",
    era: "c. 360–415",
    tagline: "A mind shaped by reason, geometry, and calm clarity.",

    heroImage: "/time-twins/hypatia-hero.jpg",
    portraitImage: "/time-twins/hypatia-portrait.jpg",

    visualTheme: "geometry-marble",
    portraitArchetype: "philosopher",
    heroPattern: "geometry",

    accentRgb: { r: 175, g: 205, b: 255 },

    mindType: "Clarity Seeker",

    whyYou: [
      "You feel relief when something complicated finally becomes elegant and understandable.",
      "You are drawn toward order, proportion, and coherence.",
      "You often want to understand before you rush into action.",
    ],

    tiles: [
      {
        title: "Calm Intelligence",
        body: "You prefer depth and clarity to noise and speed.",
        icon: "Compass",
      },
      {
        title: "Elegant Structure",
        body: "You like ideas that fit together in a way that feels clean and principled.",
        icon: "Code",
      },
      {
        title: "Reasoned Presence",
        body: "You trust thoughtfulness more than chaos or performance.",
        icon: "Shield",
      },
    ],

    storyBeats: [
      {
        body: "Hypatia taught mathematics, astronomy, and philosophy in Alexandria, where she became known for intellectual discipline and unusual clarity of thought.",
      },
      {
        body: "Her legacy is not only about brilliance. It is about a style of mind: composed, structured, rigorous, and devoted to understanding rather than noise.",
      },
      {
        body: "This match tends to resonate with people who are less drawn to spectacle than to the quiet satisfaction of making complex things coherent.",
      },
    ],

    superpower:
      "You can bring calm structure to tangled ideas and help complexity become clear without flattening it.",

    watchout:
      "You may wait for complete clarity when a smaller imperfect step would already teach you something useful.",

    tryThisWeek:
      "Take one confusing topic and reduce it to three principles that feel clean, accurate, and calm.",

    learnMore: "https://en.wikipedia.org/wiki/Hypatia",
  },

  {
    id: "butler",

    name: "Octavia E. Butler",
    era: "1947–2006",
    tagline: "The futurist who used imagination to tell hard truths.",

    heroImage: "/time-twins/butler-hero.jpg",
    portraitImage: "/time-twins/butler-portrait.jpg",

    visualTheme: "future-dusk",
    portraitArchetype: "futurist",
    heroPattern: "skyline",

    accentRgb: { r: 255, g: 145, b: 120 },

    mindType: "Future Realist",

    whyYou: [
      "You imagine futures not just for escape, but to understand people and systems more honestly.",
      "You notice pressure points — the places where power, fear, survival, and change all collide.",
      "Your imagination is not decorative. It asks what would really happen next.",
    ],

    tiles: [
      {
        title: "World Builder",
        body: "You instinctively imagine systems, tensions, and consequences rather than disconnected scenes.",
        icon: "Orbit",
      },
      {
        title: "Truth Through Story",
        body: "Imagination helps you get closer to reality, not farther from it.",
        icon: "Feather",
      },
      {
        title: "Consequences Radar",
        body: "You often sense where choices could lead before others do.",
        icon: "Bolt",
      },
    ],

    storyBeats: [
      {
        body: "Octavia E. Butler grew up quiet, observant, and serious. She spent long stretches of time in libraries and used speculative fiction not to escape reality, but to expose it.",
      },
      {
        body: "Her novels explored power, survival, adaptation, and human behavior under pressure. What made them powerful was not just imagination, but honesty. She could imagine futures that felt unsettling because they were psychologically believable.",
      },
      {
        body: "That is why this match can feel specific. Some people imagine for decoration. Butler imagined in order to reveal the truth about how systems work, what people do under strain, and what change really costs.",
      },
    ],

    superpower:
      "You can imagine consequences and possibilities with unusual honesty, which lets you see farther into a system than most people do.",

    watchout:
      "Because you can see so many layers at once, it can become harder to trust simple motion or uncomplicated hope.",

    tryThisWeek:
      "Write a one-page scenario about a change unfolding in your world, but force yourself to make it emotionally and socially believable, not just clever.",

    learnMore: "https://en.wikipedia.org/wiki/Octavia_E._Butler",
  },

  {
    id: "frida",

    name: "Frida Kahlo",
    era: "1907–1954",
    tagline: "The artist who turned inner life into vivid truth.",

    heroImage: "/time-twins/frida-hero.jpg",
    portraitImage: "/time-twins/frida-portrait.jpg",

    visualTheme: "painter-bloom",
    portraitArchetype: "artist",
    heroPattern: "paint",

    accentRgb: { r: 255, g: 110, b: 150 },

    mindType: "Emotional Alchemist",

    whyYou: [
      "You do not just feel things deeply — you want to turn them into something visible, meaningful, or memorable.",
      "Your inner world carries symbols, mood, tension, and texture.",
      "You are more interested in honesty than polish when something matters.",
    ],

    tiles: [
      {
        title: "Inner World Builder",
        body: "Feelings and ideas often arrive as images, symbols, or moods.",
        icon: "Feather",
      },
      {
        title: "Truth Over Polish",
        body: "You would rather be real than perform neatness for approval.",
        icon: "Shield",
      },
      {
        title: "Intensity With Meaning",
        body: "Strong emotion can become fuel instead of just pressure.",
        icon: "Sparkles",
      },
    ],

    storyBeats: [
      {
        body: "Frida Kahlo turned physical pain, memory, identity, and emotional complexity into visual language. Her work does not feel distant from her life because it was never meant to be separated from it.",
      },
      {
        body: "She became iconic not because she was simply expressive, but because she could transform inner experience into something unforgettable and exacting. Her honesty had form.",
      },
      {
        body: "This match tends to resonate with people whose inner lives are vivid, symbolic, and too alive to remain private forever. The real pattern is transformation: feeling something deeply, then making something from it.",
      },
    ],

    superpower:
      "You can transform difficult feeling into something vivid, honest, and emotionally precise.",

    watchout:
      "When intensity becomes familiar, you may start mistaking emotional heat for depth and forget the value of rest or distance.",

    tryThisWeek:
      "Make one image, sketch, collage, or visual note that captures a real inner state without explaining it first.",

    learnMore: "https://en.wikipedia.org/wiki/Frida_Kahlo",
  },

  {
    id: "murasaki",

    name: "Murasaki Shikibu",
    era: "c. 973–c. 1014",
    tagline: "A literary mind tuned to nuance, mood, and human complexity.",

    heroImage: "/time-twins/murasaki-hero.jpg",
    portraitImage: "/time-twins/murasaki-portrait.jpg",

    visualTheme: "ink-moon",
    portraitArchetype: "writer",
    heroPattern: "ink",

    accentRgb: { r: 205, g: 165, b: 235 },

    mindType: "Subtle Observer",

    whyYou: [
      "You notice quiet details in people that others miss because they are rushing past them.",
      "Mood, tone, and emotional texture matter to you as much as explicit action.",
      "You often understand complexity through close observation rather than noise or spectacle.",
    ],

    tiles: [
      {
        title: "Detail Radar",
        body: "You pick up small signals that reveal much larger truths.",
        icon: "Feather",
      },
      {
        title: "Emotional Nuance",
        body: "You notice shades of feeling, not just obvious reactions.",
        icon: "Brain",
      },
      {
        title: "Quiet Depth",
        body: "Your strongest insights may come softly rather than dramatically.",
        icon: "Compass",
      },
    ],

    storyBeats: [
      {
        body: "Murasaki Shikibu wrote The Tale of Genji, a work often described as one of the earliest novels in the world. What makes it remarkable is not spectacle, but subtlety.",
      },
      {
        body: "Her writing is deeply attentive to status, emotion, social nuance, longing, and the atmosphere around human relationships. She was interested in how inner life moves, not only in what happens outwardly.",
      },
      {
        body: "This match is strongest for people who notice the small shifts — the tone change, the hesitation, the feeling that lives between words. The pattern here is observation with depth, not noise.",
      },
    ],

    superpower:
      "You can detect emotional depth, small social signals, and subtle patterns that many people move past too quickly to notice.",

    watchout:
      "Because you register so much nuance, you may hesitate to act before everything feels fully understood or emotionally legible.",

    tryThisWeek:
      "Write a short scene in which the real meaning lives in tone, detail, and what is left unsaid rather than in direct explanation.",

    learnMore: "https://en.wikipedia.org/wiki/Murasaki_Shikibu",
  },
];

export function getTimeTwinById(id?: string | null): TimeTwin | undefined {
  if (!id) return undefined;
  return TIME_TWINS.find((t) => t.id === id);
}

export function getDefaultTimeTwin(): TimeTwin {
  return TIME_TWINS[0];
}