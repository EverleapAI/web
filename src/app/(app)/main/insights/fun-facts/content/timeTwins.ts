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

export type MotivationId =
  | "meaning"
  | "mastery"
  | "people"
  | "freedom"
  | "curiosity"
  | "momentum";

export type StrengthSignalId =
  | "action"
  | "people"
  | "curiosity"
  | "clarity";

export type SkillTag =
  | "observation"
  | "systems"
  | "abstraction"
  | "experimentation"
  | "pattern-recognition"
  | "storytelling"
  | "design"
  | "analysis"
  | "empathy"
  | "strategy"
  | "synthesis";

export type ThemeTag =
  | "nature"
  | "future"
  | "code"
  | "ideas"
  | "emotion"
  | "history"
  | "art"
  | "science"
  | "people"
  | "systems";

export type TimeTwinEnergyStyle =
  | "quiet-deep"
  | "focused-builder"
  | "playful-explorer"
  | "symbolic-creator";

export type TimeTwinWatchoutStyle =
  | "overthinking"
  | "scattered-curiosity"
  | "perfectionism"
  | "intensity";

export type TimeTwinMatchProfile = {
  motivations: Partial<Record<MotivationId, number>>;
  signals: Partial<Record<StrengthSignalId, number>>;
  skills: SkillTag[];
  themes: ThemeTag[];
  energy: TimeTwinEnergyStyle;
  watchout: TimeTwinWatchoutStyle;
};

export type TimeTwin = {
  id: string;

  name: string;
  era: string;
  tagline: string;

  /** kept temporarily for compatibility with current UI */
  heroImage: string;
  portraitImage: string;

  /** code-driven rendering tokens */
  visualTheme: TimeTwinVisualTheme;
  portraitArchetype: TimeTwinPortraitArchetype;
  heroPattern: TimeTwinHeroPattern;

  accentRgb: AccentRgb;

  mindType: string;

  whyYou: string[];

  tiles: TimeTwinTile[];

  storyBeats: TimeTwinStoryBeat[];

  /** narrative-first copy */
  intro: string;
  connection: string;
  reflection: string;

  superpower: string;
  watchout: string;
  tryThisWeek: string;

  learnMore: string;

  /** matching profile for future scoring */
  matchProfile: TimeTwinMatchProfile;
};

export const TIME_TWINS: TimeTwin[] = [
  {
    id: "merian",

    name: "Maria Sibylla Merian",
    era: "1647–1717",
    tagline: "The observer who saw hidden transformation everywhere.",

    heroImage: "/time-twins/merian-hero.jpg",
    portraitImage: "/time-twins/merian-portrait.jpg",

    visualTheme: "inventor-parchment",
    portraitArchetype: "inventor",
    heroPattern: "sketch",

    accentRgb: { r: 255, g: 196, b: 92 },

    mindType: "Pattern Naturalist",

    whyYou: [
      "You notice patterns other people walk past because they seem ordinary at first glance.",
      "Curiosity for you is not abstract. It pulls you toward details, systems, and visible evidence.",
      "You often understand something best by watching it closely over time rather than rushing to a conclusion.",
    ],

    tiles: [
      {
        title: "Close Observation",
        body: "You trust what careful attention reveals over what noise or first impressions suggest.",
        icon: "Compass",
      },
      {
        title: "Art + Inquiry",
        body: "You naturally connect beauty, structure, and investigation instead of separating them.",
        icon: "Sparkles",
      },
      {
        title: "Pattern Through Patience",
        body: "You can stay with a subject long enough to see its deeper shape emerge.",
        icon: "Wrench",
      },
    ],

    storyBeats: [
      {
        body: "Maria Sibylla Merian studied insects, plants, and metamorphosis with a seriousness that changed science. She did not just illustrate nature — she documented transformation with precision at a time when many people still misunderstood it.",
      },
      {
        body: "What makes her compelling is not only that she crossed art and science, but that she trusted direct observation. She looked closely, repeatedly, and let patterns reveal themselves through disciplined attention.",
      },
      {
        body: "That is why this match can feel personal. Some minds are drawn toward details not because they are small, but because they are the doorway to a larger truth.",
      },
    ],

    intro:
      "Maria Sibylla Merian is a strong match for minds that learn through close observation. She studied the natural world with unusual patience and transformed that attention into work that was both scientifically important and visually exact.",
    connection:
      "This match is not about liking nature in a general way. It is about the kind of mind that wants to watch carefully, notice real change, and trust patterns that reveal themselves slowly instead of dramatically.",
    reflection:
      "That can be a remarkable strength because it lets you see what flashier thinkers miss. The challenge is that slow fascination can turn into drift if you keep exploring without deciding where to commit.",

    superpower:
      "You can spot meaningful patterns by staying with a subject longer and more carefully than most people do.",

    watchout:
      "When curiosity keeps branching outward, it can become harder to decide which thread deserves your full effort.",

    tryThisWeek:
      "Pick one ordinary thing you usually overlook and study it closely for a few days until you can describe a pattern in it that most people would miss.",

    learnMore: "https://en.wikipedia.org/wiki/Maria_Sibylla_Merian",

    matchProfile: {
      motivations: {
        curiosity: 0.95,
        mastery: 0.74,
        freedom: 0.42,
        meaning: 0.28,
      },
      signals: {
        curiosity: 0.92,
        clarity: 0.68,
        action: 0.34,
        people: 0.18,
      },
      skills: [
        "observation",
        "pattern-recognition",
        "design",
        "analysis",
        "synthesis",
      ],
      themes: ["nature", "science", "art", "ideas"],
      energy: "quiet-deep",
      watchout: "scattered-curiosity",
    },
  },

  {
    id: "ayrton",

    name: "Hertha Ayrton",
    era: "1854–1923",
    tagline: "The experimental mind that pushed until the system gave up its secret.",

    heroImage: "/time-twins/ayrton-hero.jpg",
    portraitImage: "/time-twins/ayrton-portrait.jpg",

    visualTheme: "inventor-electric",
    portraitArchetype: "inventor",
    heroPattern: "coil",

    accentRgb: { r: 68, g: 210, b: 255 },

    mindType: "Experimental Builder",

    whyYou: [
      "You are not satisfied by vague understanding. You want to test, refine, and see what actually holds up.",
      "Problems can energize you when they feel real enough to push against.",
      "You often trust iteration more than elegance at the beginning.",
    ],

    tiles: [
      {
        title: "Test It For Real",
        body: "You gain confidence by experimenting rather than just theorizing.",
        icon: "Wrench",
      },
      {
        title: "Systems Under Pressure",
        body: "You like seeing how something behaves when it is pushed, challenged, or clarified.",
        icon: "Bolt",
      },
      {
        title: "Stubborn Precision",
        body: "Once you care about a problem, you do not let go easily.",
        icon: "Shield",
      },
    ],

    storyBeats: [
      {
        body: "Hertha Ayrton worked on electric arcs and fluid dynamics with a stubborn, practical intelligence. She kept pushing into difficult technical questions that many people were happy to leave unresolved.",
      },
      {
        body: "She was not just bright. She was persistent in the engineering sense — willing to test, refine, and keep working until the system became legible.",
      },
      {
        body: "That is what makes this match interesting. Some minds want possibility. Others want proof. Ayrton belongs to the second group, but with enough imagination to keep the experiment alive.",
      },
    ],

    intro:
      "Hertha Ayrton is a strong match for minds that want to push past loose ideas and make something real. Her style of intelligence was practical, experimental, and unusually persistent in the face of hard technical problems.",
    connection:
      "This match is about more than science. It fits the kind of person who trusts testing, iteration, and repeated contact with reality more than clean talk alone.",
    reflection:
      "That can make you unusually effective when something needs to be built or clarified. The risk is staying locked in problem-solving mode so long that rest starts to feel unproductive instead of necessary.",

    superpower:
      "You can turn uncertainty into progress by testing what is real instead of waiting for perfect certainty first.",

    watchout:
      "Because you are willing to push so hard, you may drift into overwork or make everything feel like a problem that needs solving immediately.",

    tryThisWeek:
      "Take one idea you keep thinking about and run the smallest real experiment you can instead of polishing the theory one more time.",

    learnMore: "https://en.wikipedia.org/wiki/Hertha_Ayrton",

    matchProfile: {
      motivations: {
        mastery: 0.88,
        curiosity: 0.82,
        freedom: 0.58,
        momentum: 0.46,
      },
      signals: {
        action: 0.72,
        clarity: 0.74,
        curiosity: 0.62,
        people: 0.16,
      },
      skills: [
        "experimentation",
        "systems",
        "analysis",
        "strategy",
        "pattern-recognition",
      ],
      themes: ["science", "systems", "ideas", "future"],
      energy: "focused-builder",
      watchout: "perfectionism",
    },
  },

  {
    id: "germain",

    name: "Sophie Germain",
    era: "1776–1831",
    tagline: "The quiet mathematician who pursued elegance beneath resistance.",

    heroImage: "/time-twins/germain-hero.jpg",
    portraitImage: "/time-twins/germain-portrait.jpg",

    visualTheme: "logic-victorian",
    portraitArchetype: "mathematician",
    heroPattern: "diagram",

    accentRgb: { r: 190, g: 110, b: 255 },

    mindType: "Elegant Abstractor",

    whyYou: [
      "You are pulled toward problems that feel clean, deep, and structurally interesting.",
      "You often care as much about the shape of an idea as the answer itself.",
      "Solitude can sharpen your thinking rather than drain it.",
    ],

    tiles: [
      {
        title: "Abstract Depth",
        body: "You enjoy ideas that sit below the surface and reward precise thinking.",
        icon: "Code",
      },
      {
        title: "Intellectual Independence",
        body: "You do not need external noise in order to develop a strong internal line of thought.",
        icon: "Compass",
      },
      {
        title: "Elegance Detector",
        body: "You can feel when a solution is structurally beautiful, not just technically correct.",
        icon: "Sparkles",
      },
    ],

    storyBeats: [
      {
        body: "Sophie Germain pursued mathematics at a time when access to serious intellectual life was structurally denied to her. She kept going anyway, working under a male pseudonym in order to be taken seriously.",
      },
      {
        body: "Her work in number theory and elasticity matters, but so does the style of mind behind it: precise, independent, and drawn to deep structure rather than spectacle.",
      },
      {
        body: "This match tends to land for people who are less energized by performance than by the private satisfaction of making something difficult become clear and elegant.",
      },
    ],

    intro:
      "Sophie Germain is a powerful match for minds that care about elegance, structure, and intellectual independence. She kept pursuing difficult mathematical problems even when the world around her was not built to welcome that pursuit.",
    connection:
      "This match is less about loving math specifically and more about the kind of mind that wants deep structure, internal coherence, and the feeling that an idea has finally resolved into something clean.",
    reflection:
      "That can make your thinking unusually strong and original. The challenge is that private standards can become so high that you delay sharing work before it has a chance to become useful outside your own head.",

    superpower:
      "You can go deep into abstract structure and stay with it until something difficult becomes unexpectedly elegant.",

    watchout:
      "You may hold your own work back too long because the version in your head still feels cleaner than the version anyone else can see.",

    tryThisWeek:
      "Take one complicated idea you care about and reduce it to the simplest form that still feels true, even if it is not perfect yet.",

    learnMore: "https://en.wikipedia.org/wiki/Sophie_Germain",

    matchProfile: {
      motivations: {
        mastery: 0.9,
        curiosity: 0.78,
        meaning: 0.34,
        freedom: 0.28,
      },
      signals: {
        clarity: 0.9,
        curiosity: 0.66,
        action: 0.28,
        people: 0.1,
      },
      skills: [
        "abstraction",
        "analysis",
        "pattern-recognition",
        "systems",
        "strategy",
      ],
      themes: ["science", "ideas", "systems", "history"],
      energy: "quiet-deep",
      watchout: "overthinking",
    },
  },

  {
    id: "stevens",

    name: "Nettie Stevens",
    era: "1861–1912",
    tagline: "The patient researcher who stayed with the evidence until it spoke clearly.",

    heroImage: "/time-twins/stevens-hero.jpg",
    portraitImage: "/time-twins/stevens-portrait.jpg",

    visualTheme: "scientist-luminous",
    portraitArchetype: "scientist",
    heroPattern: "glass",

    accentRgb: { r: 120, g: 255, b: 210 },

    mindType: "Quiet Discoverer",

    whyYou: [
      "You can stay with a hard question long after the obvious excitement has faded.",
      "Careful evidence matters to you more than a flashy theory.",
      "You often do your strongest work without needing a lot of external drama around it.",
    ],

    tiles: [
      {
        title: "Patient Inquiry",
        body: "You can keep going when a question takes time and discipline rather than novelty.",
        icon: "Beaker",
      },
      {
        title: "Evidence Loyalty",
        body: "You would rather know what is true than protect a prettier guess.",
        icon: "Shield",
      },
      {
        title: "Steady Focus",
        body: "Quiet attention is one of your actual strengths, not just a default mode.",
        icon: "Brain",
      },
    ],

    storyBeats: [
      {
        body: "Nettie Stevens helped establish that chromosomes determine biological sex, work that required careful observation and disciplined scientific seriousness rather than big public mythmaking.",
      },
      {
        body: "She represents a kind of intelligence that is often undervalued because it is not theatrical. It is patient, evidence-driven, and loyal to the question itself.",
      },
      {
        body: "That is why this match can feel specific. Some people are energized by brilliance as a performance. Others are built for steady truth-seeking.",
      },
    ],

    intro:
      "Nettie Stevens is a strong match for minds that do serious work quietly. Her intelligence was disciplined, evidence-based, and patient enough to stay with a difficult biological question until the answer became clear.",
    connection:
      "This match is about the kind of person who does not need noise in order to be powerful. It fits minds that trust close evidence, sustained inquiry, and slow certainty.",
    reflection:
      "That can make you remarkably reliable when the work is real. The difficulty is that quiet seriousness can become invisible to others if you do not occasionally translate what you are doing and why it matters.",

    superpower:
      "You can bring patience and disciplined attention to hard questions until something real finally resolves.",

    watchout:
      "Because your strength is so steady and understated, you may underestimate how much your work or insight deserves to be seen and named.",

    tryThisWeek:
      "Choose one question you care about and follow the evidence farther than feels convenient instead of switching to something fresher too early.",

    learnMore: "https://en.wikipedia.org/wiki/Nettie_Stevens",

    matchProfile: {
      motivations: {
        mastery: 0.84,
        curiosity: 0.8,
        meaning: 0.44,
        momentum: 0.24,
      },
      signals: {
        clarity: 0.78,
        curiosity: 0.72,
        action: 0.32,
        people: 0.14,
      },
      skills: [
        "analysis",
        "observation",
        "experimentation",
        "pattern-recognition",
        "systems",
      ],
      themes: ["science", "nature", "ideas", "history"],
      energy: "quiet-deep",
      watchout: "perfectionism",
    },
  },

  {
    id: "shannon",

    name: "Claude Shannon",
    era: "1916–2001",
    tagline: "The playful architect of information itself.",

    heroImage: "/time-twins/shannon-hero.jpg",
    portraitImage: "/time-twins/shannon-portrait.jpg",

    visualTheme: "code-shadow",
    portraitArchetype: "coder",
    heroPattern: "grid",

    accentRgb: { r: 72, g: 235, b: 200 },

    mindType: "Systems Playmaker",

    whyYou: [
      "You like reducing complicated things until the hidden rules finally show themselves.",
      "You enjoy elegant systems more than messy performance.",
      "Play and precision may live much closer together in you than other people expect.",
    ],

    tiles: [
      {
        title: "Compression Mind",
        body: "You like discovering the simplest structure underneath a large mess of information.",
        icon: "Code",
      },
      {
        title: "Playful Precision",
        body: "You may think best when experimentation and curiosity stay alive inside the logic.",
        icon: "Sparkles",
      },
      {
        title: "Systems Instinct",
        body: "You are drawn toward what makes the whole mechanism work, not just its surface results.",
        icon: "Orbit",
      },
    ],

    storyBeats: [
      {
        body: "Claude Shannon laid the foundations of information theory, which means he helped formalize how information itself can be measured, transmitted, and understood.",
      },
      {
        body: "But part of what makes him interesting is that he was not only precise. He was playful. He liked elegant systems, but he also approached them with curiosity and experimental delight.",
      },
      {
        body: "That is why this match can be compelling. Some minds are serious in a visibly serious way. Others are just as rigorous, but the rigor comes alive through play, reduction, and invention.",
      },
    ],

    intro:
      "Claude Shannon is a strong match for minds that love elegant systems. He helped define information theory, but the deeper signature was the way he thought: reducing complexity, finding structure, and keeping play alive inside serious work.",
    connection:
      "This match is not only about code or math. It fits people who feel energized when a confusing thing finally compresses into something simple, powerful, and beautifully structured.",
    reflection:
      "That can make you excellent at finding order where others only see overload. The challenge is that your inner model can become so clear to you that you forget it may still feel invisible to everyone else.",

    superpower:
      "You can uncover elegant hidden structure inside confusing systems and make the whole thing feel simpler than it looked at first.",

    watchout:
      "You may move so quickly toward internal elegance that you skip the slower work of explaining the path for other people.",

    tryThisWeek:
      "Take one cluttered system in your life and reduce it to the few rules that actually drive most of what happens inside it.",

    learnMore: "https://en.wikipedia.org/wiki/Claude_Shannon",

    matchProfile: {
      motivations: {
        curiosity: 0.92,
        freedom: 0.74,
        mastery: 0.68,
        momentum: 0.26,
      },
      signals: {
        clarity: 0.94,
        curiosity: 0.72,
        action: 0.38,
        people: 0.08,
      },
      skills: [
        "abstraction",
        "systems",
        "pattern-recognition",
        "analysis",
        "strategy",
      ],
      themes: ["code", "systems", "ideas", "science"],
      energy: "playful-explorer",
      watchout: "overthinking",
    },
  },

  {
    id: "cannon",

    name: "Annie Jump Cannon",
    era: "1863–1941",
    tagline: "The classifier who brought order to the stars.",

    heroImage: "/time-twins/cannon-hero.jpg",
    portraitImage: "/time-twins/cannon-portrait.jpg",

    visualTheme: "cosmic-wonder",
    portraitArchetype: "cosmic-guide",
    heroPattern: "stars",

    accentRgb: { r: 92, g: 150, b: 255 },

    mindType: "Cosmic Organizer",

    whyYou: [
      "Big systems do not necessarily intimidate you if there is a pattern inside them.",
      "You often find meaning by sorting, classifying, and making the overwhelming legible.",
      "You may enjoy scale most when it becomes coherent rather than abstractly grand.",
    ],

    tiles: [
      {
        title: "Scale With Structure",
        body: "You can handle huge complexity when there is an organizing pattern to work with.",
        icon: "Orbit",
      },
      {
        title: "Order From Vastness",
        body: "You make overwhelming things feel graspable by giving them structure.",
        icon: "Compass",
      },
      {
        title: "Quiet System Power",
        body: "Your influence may come through organization and clarity more than through spectacle.",
        icon: "Sparkles",
      },
    ],

    storyBeats: [
      {
        body: "Annie Jump Cannon classified hundreds of thousands of stars and built the stellar classification system still used in astronomy today.",
      },
      {
        body: "What makes her fascinating is not just the scale of the work, but the kind of mind it required: patient, system-oriented, and capable of bringing order to something almost unimaginably large.",
      },
      {
        body: "This match resonates with people who do not only dream big. They also know how to sort the big picture into something usable, clear, and real.",
      },
    ],

    intro:
      "Annie Jump Cannon is a strong match for minds that are able to handle scale by creating structure. She worked at the level of stars, but her deeper strength was classification — making vastness understandable.",
    connection:
      "This is a good fit for people who are not overwhelmed by complexity so long as there is a pattern to find, a framework to build, or an order waiting to be named.",
    reflection:
      "That can make you powerful in environments that feel too large or messy for other people. The challenge is that your gift for structuring complexity can make you undervalue the emotional side of what people need in order to follow you.",

    superpower:
      "You can bring order to enormous complexity and make something vast feel coherent enough to work with.",

    watchout:
      "Because structure comes naturally to you, you may assume other people feel safe once the system makes sense, even when they still need a human bridge.",

    tryThisWeek:
      "Take one area of your life that feels too big or messy and build a classification system for it before you try to change everything at once.",

    learnMore: "https://en.wikipedia.org/wiki/Annie_Jump_Cannon",

    matchProfile: {
      motivations: {
        mastery: 0.82,
        curiosity: 0.76,
        meaning: 0.46,
        momentum: 0.36,
      },
      signals: {
        clarity: 0.82,
        curiosity: 0.66,
        action: 0.4,
        people: 0.12,
      },
      skills: [
        "pattern-recognition",
        "observation",
        "systems",
        "analysis",
        "synthesis",
      ],
      themes: ["science", "systems", "ideas", "history"],
      energy: "focused-builder",
      watchout: "perfectionism",
    },
  },

  {
    id: "duchatelet",

    name: "Émilie du Châtelet",
    era: "1706–1749",
    tagline: "The translator of difficult ideas into living clarity.",

    heroImage: "/time-twins/duchatelet-hero.jpg",
    portraitImage: "/time-twins/duchatelet-portrait.jpg",

    visualTheme: "geometry-marble",
    portraitArchetype: "philosopher",
    heroPattern: "geometry",

    accentRgb: { r: 160, g: 215, b: 255 },

    mindType: "Clarity Synthesizer",

    whyYou: [
      "You like bridging worlds that are usually treated as separate — thought and application, philosophy and science, depth and explanation.",
      "You often want ideas to become clearer, stronger, and more usable, not just more impressive.",
      "You may feel most alive when you are helping something difficult make real sense.",
    ],

    tiles: [
      {
        title: "Bridge Builder",
        body: "You connect ideas across boundaries instead of leaving them isolated in separate camps.",
        icon: "Compass",
      },
      {
        title: "Clarity Through Depth",
        body: "You do not flatten complexity — you help it become understandable without losing what matters.",
        icon: "Code",
      },
      {
        title: "Intellectual Translation",
        body: "You may be strongest when turning dense ideas into something another mind can actually use.",
        icon: "Sparkles",
      },
    ],

    storyBeats: [
      {
        body: "Émilie du Châtelet translated and expanded Newton’s Principia, helping bring difficult physics into broader intellectual life while also contributing her own serious thought on energy and reason.",
      },
      {
        body: "She represents a kind of intelligence that does more than master ideas privately. It clarifies them, connects them, and carries them across boundaries.",
      },
      {
        body: "That is why this match feels specific. Some minds are built for discovery. Others are built for synthesis — for helping truth become legible, portable, and alive.",
      },
    ],

    intro:
      "Émilie du Châtelet is a strong match for minds that love clarity, synthesis, and intellectual bridge-building. Her work mattered not only because she understood difficult ideas, but because she could carry them across contexts without flattening them.",
    connection:
      "This match fits people who do not just want to know something. They want to make it clearer, more connected, and more usable for thought, conversation, and action.",
    reflection:
      "That can make you unusually valuable because you reduce confusion without reducing depth. The challenge is that you may spend so much time improving and clarifying ideas that you forget your own original position also deserves space.",

    superpower:
      "You can connect deep ideas across boundaries and make them clearer without making them smaller.",

    watchout:
      "You may become so good at translation and synthesis that you under-claim the originality of your own thinking.",

    tryThisWeek:
      "Take one difficult idea you care about and explain it in a way that keeps its depth but makes it truly usable to someone else.",

    learnMore: "https://en.wikipedia.org/wiki/%C3%89milie_du_Ch%C3%A2telet",

    matchProfile: {
      motivations: {
        meaning: 0.62,
        mastery: 0.78,
        curiosity: 0.7,
        freedom: 0.44,
      },
      signals: {
        clarity: 0.86,
        curiosity: 0.58,
        people: 0.26,
        action: 0.24,
      },
      skills: [
        "analysis",
        "abstraction",
        "synthesis",
        "storytelling",
        "strategy",
      ],
      themes: ["science", "history", "ideas", "systems"],
      energy: "quiet-deep",
      watchout: "overthinking",
    },
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

    accentRgb: { r: 255, g: 120, b: 88 },

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

    intro:
      "Octavia E. Butler did not use the future as decoration. She used it as a way to tell the truth. Her fiction asked what people, communities, and systems actually do under pressure — and she was willing to follow those answers somewhere uncomfortable if that was where honesty led.",
    connection:
      "That is what makes this match feel distinct. Some people imagine to escape. Others imagine to understand. If your mind naturally notices power, consequence, survival, and the pressure points inside a system, Butler’s pattern makes sense.",
    reflection:
      "That can make you unusually perceptive because you do not stop at the surface version of events. But it can also make the world feel heavier, because once you see the deeper structure, simple optimism is harder to fake.",

    superpower:
      "You can imagine consequences and possibilities with unusual honesty, which lets you see farther into a system than most people do.",

    watchout:
      "Because you can see so many layers at once, it can become harder to trust simple motion or uncomplicated hope.",

    tryThisWeek:
      "Write a one-page scenario about a change unfolding in your world, but force yourself to make it emotionally and socially believable, not just clever.",

    learnMore: "https://en.wikipedia.org/wiki/Octavia_E._Butler",

    matchProfile: {
      motivations: {
        meaning: 0.84,
        curiosity: 0.7,
        freedom: 0.56,
        people: 0.4,
      },
      signals: {
        curiosity: 0.72,
        people: 0.54,
        clarity: 0.48,
        action: 0.28,
      },
      skills: [
        "storytelling",
        "strategy",
        "systems",
        "synthesis",
        "empathy",
      ],
      themes: ["future", "people", "systems", "emotion", "ideas"],
      energy: "symbolic-creator",
      watchout: "intensity",
    },
  },

  {
    id: "varo",

    name: "Remedios Varo",
    era: "1908–1963",
    tagline: "The symbolic artist who turned inner worlds into strange precision.",

    heroImage: "/time-twins/varo-hero.jpg",
    portraitImage: "/time-twins/varo-portrait.jpg",

    visualTheme: "painter-bloom",
    portraitArchetype: "artist",
    heroPattern: "paint",

    accentRgb: { r: 255, g: 72, b: 145 },

    mindType: "Symbolic Creator",

    whyYou: [
      "Your inner life may arrive not just as feelings, but as symbols, images, and strangely complete atmospheres.",
      "You are often trying to make the invisible more visible without flattening its mystery.",
      "Imagination for you can feel exacting, not vague.",
    ],

    tiles: [
      {
        title: "Inner Architecture",
        body: "Your imagination often has structure, mood, and symbolic logic rather than random drift.",
        icon: "Feather",
      },
      {
        title: "Precision Through Art",
        body: "You may express subtle truth best through form, image, and composition rather than direct explanation.",
        icon: "Sparkles",
      },
      {
        title: "Symbolic Perception",
        body: "You notice meaning in atmosphere, metaphor, and layered association.",
        icon: "Compass",
      },
    ],

    storyBeats: [
      {
        body: "Remedios Varo painted dreamlike worlds that felt mystical, mechanical, and psychologically exact all at once. Her work did not simply express feeling — it organized inner complexity into intricate visual logic.",
      },
      {
        body: "What makes her such an interesting Time Twin is that she was not chaotic in her imagination. She was precise. Her symbolic worlds felt constructed, intentional, and strangely coherent.",
      },
      {
        body: "This match tends to resonate with people whose inner worlds are vivid but not random — people who feel compelled to turn subtle atmosphere into something shaped and shareable.",
      },
    ],

    intro:
      "Remedios Varo is a powerful match for minds that experience imagination as something structured, symbolic, and unusually alive. She transformed inner worlds into images that felt mysterious, but never careless.",
    connection:
      "This match is not just about being artistic. It is about the kind of person who senses layers, metaphors, and hidden correspondences — and wants to shape them into something real enough to hold.",
    reflection:
      "That can make your work or perception feel strikingly original because it carries an inner logic other people cannot easily predict. The challenge is that intensity and symbolism can become your default language even when something simpler would also be true.",

    superpower:
      "You can transform subtle internal complexity into something symbolic, precise, and deeply memorable.",

    watchout:
      "When intensity and symbolism feel natural, you may forget that not every truth needs maximum depth in order to matter.",

    tryThisWeek:
      "Make one visual or written artifact that captures a mood, symbol, or private logic without explaining it first.",

    learnMore: "https://en.wikipedia.org/wiki/Remedios_Varo",

    matchProfile: {
      motivations: {
        meaning: 0.72,
        freedom: 0.68,
        curiosity: 0.64,
        mastery: 0.4,
      },
      signals: {
        curiosity: 0.7,
        clarity: 0.36,
        people: 0.28,
        action: 0.18,
      },
      skills: [
        "design",
        "storytelling",
        "synthesis",
        "observation",
        "pattern-recognition",
      ],
      themes: ["art", "emotion", "ideas", "future"],
      energy: "symbolic-creator",
      watchout: "intensity",
    },
  },

  {
    id: "sei",

    name: "Sei Shōnagon",
    era: "c. 966–1017",
    tagline: "The observer of mood, detail, and the tiny truths people reveal without meaning to.",

    heroImage: "/time-twins/sei-hero.jpg",
    portraitImage: "/time-twins/sei-portrait.jpg",

    visualTheme: "ink-moon",
    portraitArchetype: "writer",
    heroPattern: "ink",

    accentRgb: { r: 210, g: 140, b: 255 },

    mindType: "Subtle Social Observer",

    whyYou: [
      "You notice small emotional or social details that other people move past too quickly.",
      "Tone, mood, timing, and tiny signals can matter to you as much as explicit content.",
      "You often understand people through close observation rather than blunt declarations.",
    ],

    tiles: [
      {
        title: "Detail Radar",
        body: "You catch small shifts that reveal much larger truths.",
        icon: "Feather",
      },
      {
        title: "Mood Sensitivity",
        body: "Atmosphere and tone carry real meaning for you, not just decoration.",
        icon: "Brain",
      },
      {
        title: "Quiet Human Insight",
        body: "Your strongest read of a situation may come softly, but not shallowly.",
        icon: "Compass",
      },
    ],

    storyBeats: [
      {
        body: "Sei Shōnagon, author of The Pillow Book, was extraordinarily attentive to human detail — to social nuance, emotional atmosphere, elegance, irritation, and the small moments that reveal how people really move through the world.",
      },
      {
        body: "She is interesting because her mind was sharp without being heavy. She noticed what others overlooked, and she could make brief observations feel startlingly exact.",
      },
      {
        body: "This match tends to resonate with people whose minds are tuned to subtlety — those who sense tone, texture, and social meaning before the room has fully named it.",
      },
    ],

    intro:
      "Sei Shōnagon is a strong match for minds that notice quiet human detail. Her writing was driven by sensitivity to mood, status, irritation, elegance, and the tiny lived texture of social life.",
    connection:
      "This match is not about being shy or literary in a generic way. It fits people who read situations through tone, detail, and nuance — and who often understand more than they initially say aloud.",
    reflection:
      "That can make you perceptive in ways that feel almost unfair because you catch the real signal before it becomes obvious. The challenge is that high sensitivity to nuance can make action harder if you keep waiting for the whole emotional picture to settle completely.",

    superpower:
      "You can detect subtle human patterns and emotional texture that most people miss in their rush toward louder signals.",

    watchout:
      "Because nuance matters so much to you, you may hesitate too long before acting, naming, or choosing a direction.",

    tryThisWeek:
      "Write down five tiny details you notice in a day that most people would not mention, then ask what larger truth each one is pointing toward.",

    learnMore: "https://en.wikipedia.org/wiki/Sei_Sh%C5%8Dnagon",

    matchProfile: {
      motivations: {
        people: 0.64,
        curiosity: 0.66,
        meaning: 0.58,
        freedom: 0.34,
      },
      signals: {
        people: 0.72,
        curiosity: 0.62,
        clarity: 0.44,
        action: 0.18,
      },
      skills: [
        "observation",
        "storytelling",
        "empathy",
        "pattern-recognition",
        "design",
      ],
      themes: ["people", "emotion", "history", "art", "ideas"],
      energy: "quiet-deep",
      watchout: "overthinking",
    },
  },
];

export function getTimeTwinById(id?: string | null): TimeTwin | undefined {
  if (!id) return undefined;
  return TIME_TWINS.find((t) => t.id === id);
}

export function getDefaultTimeTwin(): TimeTwin {
  return TIME_TWINS[0];
}