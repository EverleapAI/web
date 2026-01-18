// src/app/main/explore/content/careers.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Careers
 * These are not job listings — they are identity experiments.
 * Tone: life coach talking to an older teen.
 */
const careers: ExploreArea = {
  id: "careers",
  label: "Careers",
  chip: "Everleap suggestions",
  glowClass: "from-sky-400 via-indigo-500 to-slate-400",
  href: "/main/explore/careers",

  headline: "Careers",
  summary:
    "Everleap suggestions — directions that fit your strengths, values, and vibe.",
  hint: "These are experiments, not commitments.",

  // Optional: keep as global tags only (renderer will NOT use these as per-card why)
  signals: [
    "impact-first",
    "needs autonomy",
    "likes fast feedback loops",
    "wants real-world relevance",
    "hates performative work",
  ],

  nextMoves: [
    {
      id: "pick-one",
      title: "Pick 1 direction to test",
      blurb: "Not decide. Test. Your reaction is the data.",
    },
    {
      id: "one-convo",
      title: "Do 1 real conversation",
      blurb: "Talk to someone doing it. Ask what’s brutal and what’s great.",
    },
    {
      id: "micro-proof",
      title: "Build 1 micro-proof",
      blurb: "A tiny artifact beats a big decision.",
    },
  ],

  cards: [
    // ✅ NEW (put first so it shows in the top 4)
    {
      id: "gameDesigner",
      icon: "🎮",
      title: "Game Designer",
      short:
        "You’re basically a vibes engineer — but for fun.\n\n" +
        "Game design is choosing rules, rewards, and challenges so a player *feels* something: tension, curiosity, pride, chaos, flow.\n\n" +
        "If you’ve ever thought “this level is unfair” or “this is addictive” or “this is boring,” you’re already thinking like a designer.\n\n" +
        "Tiny task: pick a simple game and change ONE rule. Watch what happens.",
      cardMedia: {
        src: "/images/careers/1.jpg",
        alt: "Game design scene",
      },
      visualBreak: {
        asset: {
          src: "/images/explore/careers/4.jpg",
          kind: "process",
          alt: "Teen at a messy desk moving paper cards around, testing rules for a simple homemade game.",
        },
        constraints: { noTextOverlay: true, noPolishedStock: true },
      },
      why: [
        "You like experimenting with rules and seeing how behavior changes.",
        "You notice what feels fun vs frustrating (and you want to fix it).",
        "You enjoy fast feedback loops — you try something, test it, adjust.",
      ],
      hint: "Change one rule in a simple game and test it with one person.",
      tags: ["systems", "creativity", "fast-feedback", "player-psychology"],
    },

    {
      id: "productUx",
      icon: "🧩",
      title: "Product / UX",
      short:
        "You know when an app just *feels right* to use? That’s not an accident.\n\n" +
        "Product and UX is about noticing what’s confusing or annoying — and making it better for real people.\n\n" +
        "If you like building things and you care how people experience them, this might be your lane.\n\n" +
        "Tiny test: pick an app you use, redesign one screen, and show it to two people. See what they say.",
      cardMedia: {
        src: "/images/careers/2.jpg",
        alt: "Product and UX scene",
      },
      visualBreak: {
        asset: {
          src: "/images/explore/careers/1.jpg",
          kind: "process",
          alt: "Person sketching a phone screen on paper, crossing out one layout and trying a simpler one.",
        },
        constraints: { noTextOverlay: true, noPolishedStock: true },
      },
      why: [
        "You notice friction fast — clunky flows and confusing screens jump out at you.",
        "You care about real people using the thing, not just the idea of it.",
        "You like impact + fast feedback (you want to see if your change worked).",
      ],
      hint: "Redesign one real screen and get two opinions — clarity wins.",
      tags: ["human-centered", "iteration", "impact-first", "fast-feedback"],
    },

    {
      id: "healthHumanSupport",
      icon: "🫶",
      title: "Health + Human Support",
      short:
        "Some people are just good at being there when things get real.\n\n" +
        "This path is about helping people through physical, mental, or emotional stuff — and actually making their day better.\n\n" +
        "If people come to you when they’re struggling, that’s not random.\n\n" +
        "Tiny test: talk to someone who works in a helping role and ask what makes the job feel worth it.",
      cardMedia: {
        src: "/images/careers/3.jpg",
        alt: "Helping and support scene",
      },
      visualBreak: {
        asset: {
          src: "/images/explore/careers/2.jpg",
          kind: "human",
          alt: "Two people sitting quietly on a bench, one listening closely while the other talks.",
        },
        constraints: { noTextOverlay: true, noPolishedStock: true },
      },
      why: [
        "People trust you with real stuff — you’re steady when it matters.",
        "You get satisfaction from making someone’s day meaningfully better.",
        "You’re not into performative help — you want what actually works.",
      ],
      hint: "Talk to someone in a helping role: what feels brutal vs worth it?",
      tags: ["empathy", "real-world", "service", "impact-first"],
    },

    {
      id: "educationCommunityPrograms",
      icon: "🏫",
      title: "Education / Community",
      short:
        "This is about creating spaces where people grow.\n\n" +
        "You might be teaching, running programs, or organizing groups so things actually work.\n\n" +
        "If you like helping people level up and hate wasted potential, this could be you.\n\n" +
        "Tiny test: help out with one group or program and notice what parts give you energy.",
      cardMedia: {
        src: "/images/careers/4.jpg",
        alt: "Education and community scene",
      },
      visualBreak: {
        asset: {
          src: "/images/explore/careers/3.jpg",
          kind: "human",
          alt: "A small group around a table with notebooks open, one person pointing while others follow along.",
        },
        constraints: { noTextOverlay: true, noPolishedStock: true },
      },
      why: [
        "You can see people’s potential and you hate when it gets wasted.",
        "You like building environments where others can win (systems, support, structure).",
        "You care about belonging — making a place feel safe + real.",
      ],
      hint: "Join one group/program once — notice what energizes you vs drains you.",
      tags: ["teaching", "community", "belonging", "systems"],
    },

    {
      id: "independentBuilder",
      icon: "🚀",
      title: "Independent Builder",
      short:
        "This is for people who’d rather make their own thing than wait for permission.\n\n" +
        "You come up with ideas, try them, and learn by doing.\n\n" +
        "If freedom matters to you more than having everything planned, pay attention to that.\n\n" +
        "Tiny test: build something small this weekend and put it out into the world.",
      why: [
        "You’d rather test a real thing than debate it forever.",
        "Autonomy matters — you want to choose the rules sometimes.",
        "You learn fastest by shipping and adjusting in public.",
      ],
      hint: "Ship a tiny thing publicly (even to a small group) and watch what happens.",
      tags: ["autonomy", "builder", "fast-feedback", "initiative"],
    },

    {
      id: "dataAi",
      icon: "🧠",
      title: "Data + AI",
      short:
        "This is about turning messy information into clear decisions.\n\n" +
        "You look for patterns, test ideas, and figure out what’s actually going on.\n\n" +
        "If you like being right for the right reasons, this could be your thing.\n\n" +
        "Tiny test: track something you care about for a week and see what you learn.",
      why: [
        "You like patterns — messy info bothers you until it makes sense.",
        "You prefer ‘prove it’ over vibes (being right for the right reasons).",
        "You enjoy experimenting and refining the model in your head.",
      ],
      hint: "Track one thing for 3–7 days and turn it into one simple insight.",
      tags: ["patterns", "analysis", "experiments", "clarity"],
    },

    {
      id: "operationsProjects",
      icon: "🗺️",
      title: "Ops + Projects",
      short:
        "Some people are wired to make things run smoothly.\n\n" +
        "You notice what’s missing, what’s slowing things down, and how to fix it.\n\n" +
        "If you’re the quiet problem-solver in the group, this is real power.\n\n" +
        "Tiny test: take one messy process and make it 20% better.",
      why: [
        "You see bottlenecks other people ignore (and you can’t unsee them).",
        "You like making chaos calmer — simple plans, clear steps, real execution.",
        "You get satisfaction from reliability and things working in the real world.",
      ],
      hint: "Pick one messy process and remove one step (or make one step easier).",
      tags: ["systems", "execution", "reliability", "real-world"],
    },

    {
      id: "creativeStorytelling",
      icon: "🎬",
      title: "Creative Storytelling",
      short:
        "This is about making people feel something.\n\n" +
        "You use words, images, or video to get ideas to land.\n\n" +
        "If you care how a message hits, not just what it says, this might be you.\n\n" +
        "Tiny test: tell one story in three different ways and see what connects.",
      why: [
        "You care about how a message lands, not just what it technically says.",
        "You notice tone, vibe, pacing — the invisible stuff that makes people feel.",
        "You like experimenting with formats until it clicks.",
      ],
      hint: "Tell one real story 3 ways (text, 15-sec script, 5-image storyboard).",
      tags: ["message", "emotion", "format", "iteration"],
    },

    {
      id: "businessPartnerships",
      icon: "🤝",
      title: "Business + Partnerships",
      short:
        "This is where conversations turn into real outcomes.\n\n" +
        "You connect people, spot opportunities, and help things move forward.\n\n" +
        "If you like talking to people and making things happen, that’s a clue.\n\n" +
        "Tiny test: ask five people about a problem they have and listen closely.",
      why: [
        "You’re good at reading people and getting to the real point fast.",
        "You like turning talk into action — deals, plans, wins, momentum.",
        "You’re energized by connection and making things move forward.",
      ],
      hint: "Do 5 mini interviews: “What’s annoying about this?” then summarize the pattern.",
      tags: ["people", "momentum", "opportunity", "real-world"],
    },
  ],
};

export default careers;
