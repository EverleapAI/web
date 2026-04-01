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
  {
    id: "production-momentum",
    label: "Production momentum",
    score: 85,
    explanation:
      "You like getting things finished and keeping creative work moving instead of stalling in ideas.",
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

  specialties: [
    {
      id: "content-producer",
      slug: "content-producer",
      title: "Content Producer",
      summary:
        "This version is about taking an idea from rough concept to something people can actually watch, click, share, or remember. The pace is usually fast, the formats are shorter, and the pressure is making something that lands quickly without feeling disposable.",
      whatYouActuallyDo: [
        "Turn loose ideas into clear video plans with a hook, structure, shoot needs, and a release goal.",
        "Coordinate shoots, talent, edits, deadlines, and revisions so content actually gets finished instead of stalling in endless ideas.",
        "Shape videos around audience attention - what pulls someone in, what keeps the energy up, and what makes them keep watching.",
        "Work across concept, production, and post so the final video feels intentional instead of random.",
      ],
      skillsThatGrowHere: [
        "Fast concept development",
        "Short-form storytelling",
        "Production planning",
        "Creative execution under deadline",
      ],
      starterProjects: [
        "Produce a short video series around one theme and actually publish it on a regular rhythm.",
        "Take one event, product, club, or person and create a full mini content package around it.",
        "Practice building clear shot lists and edit plans before you start filming.",
      ],
      atmosphere:
        "Fast-moving, practical, and output-driven. The work feels alive because your ideas become real quickly, but only if you stay organized enough to finish them.",
    },
    {
      id: "field-producer",
      slug: "field-producer",
      title: "Field Producer",
      summary:
        "This version is about making the shoot itself work in the real world. You are handling location reality, time pressure, people coordination, and constant change while protecting the quality of what gets captured.",
      whatYouActuallyDo: [
        "Keep the shoot moving by coordinating people, timing, logistics, gear, and next steps in real time.",
        "Solve location, scheduling, access, and communication problems before they slow everything down.",
        "Support the director or creative lead by making sure the real-world execution stays aligned with the plan.",
        "Adapt instantly when weather, talent, timing, energy, or location conditions shift.",
      ],
      skillsThatGrowHere: [
        "Live coordination",
        "Problem-solving under pressure",
        "Set communication",
        "Logistical awareness",
      ],
      starterProjects: [
        "Help organize and run a real shoot for a school event, club, interview, or community project.",
        "Practice making run-of-show plans, call sheets, or simple production schedules.",
        "Notice what usually causes chaos on shoots and how stronger prep reduces it.",
      ],
      atmosphere:
        "High-energy, unpredictable, and momentum-heavy. This is for people who like being in the middle of action and staying useful when things get messy.",
    },
    {
      id: "creative-producer",
      slug: "creative-producer",
      title: "Creative Producer",
      summary:
        "This version is about shaping how the project feels - the concept, tone, pacing, references, emotional arc, and creative decisions that make the final work worth watching.",
      whatYouActuallyDo: [
        "Develop the concept so the project has a clear emotional direction, not just a vague visual idea.",
        "Guide decisions around tone, pacing, references, structure, and what moments need to hit hardest.",
        "Work with directors, editors, shooters, and clients to keep the creative vision strong all the way through production.",
        "Protect what makes the story interesting when time, budget, and logistics try to flatten it.",
      ],
      skillsThatGrowHere: [
        "Taste and creative judgment",
        "Story shaping",
        "Pacing instinct",
        "Creative direction across collaborators",
      ],
      starterProjects: [
        "Create treatment decks or moodboards for real concepts and explain why each creative choice matters.",
        "Study edits, ads, trailers, and short films to understand how emotion and pacing are being controlled.",
        "Take a simple video concept and push it into something stronger through framing, rhythm, and story choices.",
      ],
      atmosphere:
        "Cinematic, collaborative, and taste-driven. The work is less about doing one technical task and more about steering the project toward something memorable.",
    },
  ],

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
      "The difference is not gear - it is finishing something. Plan it, shoot it, edit it, and make it watchable.",
    heroBadge: "Make something real",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Where production becomes real",
        description:
          "Real-world environments where video stops being an idea and becomes something you actually produce with people, time pressure, and real constraints.",
        mode: "local",
        items: [
          {
            id: "marin-library",
            title: "Marin County Library - The Lab",
            href: "https://marinlibrary.org/the-lab/",
            note:
              "Free creative space to experiment with video, editing, and production tools.",
            badge: "Free / Local",
            mode: "local",
          },
          {
            id: "sfpl-mix",
            title: "The Mix (SF Public Library)",
            href: "https://www.sfpl.org/locations/main-library/the-mix",
            note:
              "Teen creative studio with real media tools, projects, and people making content.",
            badge: "Teen space",
            mode: "local",
          },
          {
            id: "bay-area-film-events",
            title: "Bay Area film + video events",
            href: "https://www.eventbrite.com/d/ca--san-francisco/film/",
            note:
              "Find screenings, workshops, and creative meetups where people are actively producing work.",
            badge: "Real scene",
            mode: "local",
          },
          {
            id: "film-festivals",
            title: "Local film festivals (Mill Valley, SF Indie)",
            href: "https://www.mvff.com/",
            note:
              "Watch real films, observe audience reaction, and understand what actually lands.",
            badge: "Inspiration",
            mode: "local",
          },
          {
            id: "shoot-your-own",
            title: "Produce a real video (school / club / local event)",
            href: "https://www.google.com/search?q=local+events+near+94901",
            note:
              "Film something real with time pressure and people involved. This is where producing actually becomes real.",
            badge: "Do it now",
            mode: "local",
          },
        ],
      },

      {
        id: "remote",
        eyebrow: "Online",
        title: "Start producing now",
        description:
          "Tools and platforms that turn you from watcher to creator immediately. No waiting, no setup excuses.",
        mode: "remote",
        items: [
          {
            id: "capcut",
            title: "CapCut",
            href: "https://www.capcut.com/",
            note:
              "Fastest way to edit clean, watchable videos immediately.",
            badge: "Start fast",
            mode: "remote",
          },
          {
            id: "premiere",
            title: "Adobe Premiere Pro tutorials",
            href: "https://helpx.adobe.com/premiere-pro/tutorials.html",
            note:
              "Learn professional editing workflows once you want more control.",
            badge: "Pro tool",
            mode: "remote",
          },
          {
            id: "davinci",
            title: "DaVinci Resolve training",
            href: "https://www.blackmagicdesign.com/products/davinciresolve/training",
            note:
              "Free high-end editing and color grading training used in real productions.",
            badge: "Free + Pro",
            mode: "remote",
          },
          {
            id: "youtube-breakdowns",
            title: "Film breakdowns on YouTube",
            href: "https://www.youtube.com/results?search_query=film+editing+breakdown",
            note:
              "Study pacing, cuts, and storytelling decisions from real content.",
            badge: "Learn by watching",
            mode: "remote",
          },
          {
            id: "vimeo",
            title: "Vimeo Staff Picks",
            href: "https://vimeo.com/channels/staffpicks",
            note:
              "Watch high-quality short films to sharpen your creative judgment.",
            badge: "Taste builder",
            mode: "remote",
          },
        ],
      },
    ],
  },
};