// apps/web/src/app/(app)/main/explore/work/_data/mock/filmVideoProducerPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const FILM_VIDEO_PRODUCER_PATH: WorkPathContent = {
  id: "film-video-producer",
  slug: "film-video-producer",
  lane: "work",

  theme: {
    tone: "cinematic-pulse",
    accent: { r: 255, g: 166, b: 92 },
    accentStrong: { r: 255, g: 116, b: 92 },
    glow: { r: 255, g: 202, b: 120 },
    surfaceLabel: "Cinematic build",
  },

  card: {
    title: "Film & Video Producer",
    hook: "Shape stories, shoots, timing, people, and the final emotional experience.",
    description:
      "A path for people who are drawn to storytelling, visual rhythm, coordination, and making creative work actually happen.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Film & Video Producer",
    hook:
      "You are not just watching videos - you are noticing how they were built, paced, and made to land.",
    summary:
      "Producers turn ideas into finished video. That means shaping the concept, organizing the shoot, coordinating people, solving problems, and making sure the story actually gets finished.",
    whyItPullsYouIn: [
      "You want ideas to become real, not stay abstract.",
      "You notice pacing, emotion, and what makes something land.",
      "You like creative work that also requires coordination and momentum.",
    ],
  },

  traitChips: [
    { id: "story-instinct", label: "Story instinct" },
    { id: "production-energy", label: "Production energy" },
    { id: "people-coordination", label: "People coordination" },
    { id: "taste-and-timing", label: "Taste + timing" },
  ],

  fitSignals: [
    {
      id: "creative-and-logistical",
      label: "Creative + logistical",
      score: 90,
      explanation:
        "You want to shape the vision and also make the real-world process move.",
    },
    {
      id: "pressure-and-adaptability",
      label: "Pressure adaptability",
      score: 87,
      explanation:
        "You stay useful when plans shift, timing gets tight, or things get messy.",
    },
    {
      id: "story-judgment",
      label: "Story judgment",
      score: 88,
      explanation:
        "You can feel when something is dragging, landing, or needs a stronger moment.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Creative direction + coordination",
      note: "Keep vision strong while execution keeps moving",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Prep + shoot + adjust",
      note: "Planning to execution to adaptation",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Finished video",
      note: "Content, scenes, edits, campaigns",
    },
  ],

  specialtyPreviews: [
    {
      id: "content-producer",
      slug: "content-producer",
      title: "Content Producer",
      oneLiner:
        "Plans and delivers short-form or brand-driven video from idea to release.",
      whyItCouldFit:
        "Fast-moving work where your ideas quickly become something people see.",
      energy: "craft",
    },
    {
      id: "field-producer",
      slug: "field-producer",
      title: "Field Producer",
      oneLiner:
        "Runs the real-world shoot - people, timing, locations, and decisions.",
      whyItCouldFit:
        "High-energy, on-the-ground work with real pressure and momentum.",
      energy: "systems",
    },
    {
      id: "creative-producer",
      slug: "creative-producer",
      title: "Creative Producer",
      oneLiner:
        "Shapes the concept, pacing, and emotional direction of the project.",
      whyItCouldFit:
        "Strong for people with taste who want to guide how something feels.",
      energy: "high-creative",
    },
  ],

  specialties: [],

  dayInLife: {
  title: "A day on set",
  summary:
    "It is not calm creative work. It is momentum, coordination, and making something real under pressure.",

  moments: [
    {
      id: "morning-setup",
      timeLabel: "8:30 AM",
      title: "Everything starts moving at once",
      body:
        "People arrive, gear is set up, locations get checked. You are not just watching - you are making sure everything is ready before the first shot even happens.",
    },
    {
      id: "first-shot",
      timeLabel: "10:00 AM",
      title: "Get the first real moment",
      body:
        "The first shot matters. It sets tone and momentum. Something will not go exactly as planned. You adjust quickly and keep things moving.",
    },
    {
      id: "midday-pressure",
      timeLabel: "12:30 PM",
      title: "Stay ahead of the problems",
      body:
        "Time is tight. People are waiting. Something always goes wrong - lighting, timing, energy. Your job is to solve it without slowing everything down.",
    },
    {
      id: "coordination",
      timeLabel: "2:00 PM",
      title: "Keep everyone aligned",
      body:
        "You are talking to multiple people constantly - crew, talent, whoever is involved. Everyone needs clarity, and you are the one holding it together.",
    },
    {
      id: "capture-moment",
      timeLabel: "3:30 PM",
      title: "Get the shot that makes it work",
      body:
        "There is usually one moment where it comes together. The timing, the energy, the framing. You know it when you see it. That is what makes the whole project worth it.",
    },
    {
      id: "wrap",
      timeLabel: "5:30 PM",
      title: "Wrap and move forward",
      body:
        "You are not done. You make sure everything is captured, organized, and ready for editing. Momentum matters after the shoot too.",
    },
    {
      id: "after",
      timeLabel: "Evening",
      title: "It becomes real later",
      body:
        "The final payoff comes in the edit. When the story actually lands and people watch it - that is when the work really hits.",
    },
  ],
},

  forecast: {
    title: "What growth can look like",
    summary:
      "You gain momentum when you consistently finish real video projects.",
    stages: [],
  },

  /* =========================
     FORECAST PASS (NEW)
  ========================= */

  forecastV2: {
    outlookLabel: "Exploding - but crowded",
    outlookSummary:
      "Video production has never been more accessible. Anyone can shoot, edit, and publish - but that also means far more competition. The advantage now is not access to tools, it is the ability to finish strong work, tell better stories, and consistently produce content that people actually watch.",

    metrics: [
      {
        id: "demand",
        label: "Demand",
        value: "Very high",
        tone: "positive",
        note: "Video dominates social, marketing, and entertainment",
      },
      {
        id: "competition",
        label: "Competition",
        value: "Very high",
        tone: "mixed",
        note: "More creators than ever entering the space",
      },
      {
        id: "entry",
        label: "Barrier to entry",
        value: "Low",
        tone: "mixed",
        note: "Tools are cheap and widely available",
      },
      {
        id: "consistency",
        label: "Consistency advantage",
        value: "Critical",
        tone: "positive",
        note: "People who finish and publish regularly win",
      },
    ],

    salaryRange: {
      low: "$40K",
      median: "$65K",
      high: "$120K+",
    },

    industry: {
      sourceLabel: "Bureau of Labor Statistics",
      sourceUrl:
        "https://www.bls.gov/ooh/media-and-communication/film-and-video-editors-and-camera-operators.htm",
      growthPercent: "7%",
      annualOpenings: "9,400",
      medianPay: "$65,000",
      educationTypical: "Varies widely",
    },

    whatIsGrowing: [
      "Short-form and social video production",
      "Creators who can both produce and edit",
      "People who understand pacing and audience attention",
    ],

    whatIsUnderPressure: [
      "Generic video that does not stand out",
      "People who never finish or publish work",
      "Creators who rely only on gear instead of story",
    ],

    aiImpact: {
      level: "medium",
      summary:
        "AI is speeding up editing, captioning, and basic production tasks, but it cannot replace taste, timing, or the ability to create something people actually care about.",
      helpsWith: [
        "Editing speed and automation",
        "Captions and formatting",
        "Basic content generation",
      ],
      putsPressureOn: [
        "Simple editing work",
        "Low-effort content production",
      ],
      humansStillOwn: [
        "Storytelling and pacing",
        "Creative direction",
        "What makes something worth watching",
      ],
    },

    whyThisCouldFeelExciting: [
      "You can publish real work immediately and build an audience",
      "Creative ideas can spread quickly if they land",
      "You can improve fast by producing consistently",
    ],

    whyThisCouldFeelRisky: [
      "It is easy to start but hard to stand out",
      "Inconsistent output kills momentum",
      "Attention is competitive and constantly shifting",
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "Start producing something real - that is where this path begins.",
    actions: [],
    opportunityGroups: [],
  },

  nextStepsV2: {
    heroTitle: "You can produce a real video this week",
    heroSummary:
      "The difference is not gear - it is finishing something. Plan it, shoot it, and make it watchable.",
    heroBadge: "Make something real",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Where production becomes real",
        description:
          "Real-world environments where video stops being an idea and becomes something you actually produce.",
        mode: "local",
        items: [
          {
            id: "marin-library",
            title: "Marin County Library - The Lab",
            href: "https://marinlibrary.org/the-lab/",
            note:
              "Free space to experiment with media, editing, and creative production.",
            badge: "Free",
            mode: "local",
          },
          {
            id: "sfpl-mix",
            title: "The Mix (SF Public Library)",
            href: "https://www.sfpl.org/locations/main-library/the-mix",
            note:
              "Teen creative studio with tools and people making real media.",
            badge: "Teen space",
            mode: "local",
          },
          {
            id: "event-video",
            title: "Film a real event (school / club / local)",
            href: "#",
            note:
              "The fastest way to learn producing is working with real time, people, and pressure.",
            badge: "Real world",
            mode: "local",
          },
        ],
      },

      {
        id: "remote",
        eyebrow: "Online",
        title: "Start producing now",
        description:
          "Tools and platforms that turn you from watcher to creator immediately.",
        mode: "remote",
        items: [
          {
            id: "capcut",
            title: "CapCut",
            href: "https://www.capcut.com/",
            note:
              "Fastest way to edit clean, watchable videos right away.",
            badge: "Start fast",
            mode: "remote",
          },
          {
            id: "premiere",
            title: "Adobe Premiere Pro",
            href: "https://helpx.adobe.com/premiere-pro/tutorials.html",
            note:
              "Industry-standard editing when you want more control.",
            badge: "Pro tool",
            mode: "remote",
          },
          {
            id: "youtube",
            title: "Film breakdowns on YouTube",
            href: "https://www.youtube.com",
            note:
              "Learn pacing, storytelling, and production by studying real work.",
            badge: "Free",
            mode: "remote",
          },
          {
            id: "vimeo",
            title: "Vimeo Staff Picks",
            href: "https://vimeo.com",
            note:
              "Watch high-quality short films to sharpen your taste.",
            badge: "Inspiration",
            mode: "remote",
          },
        ],
      },
    ],
  },
};