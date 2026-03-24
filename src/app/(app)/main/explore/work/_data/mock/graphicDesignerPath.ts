// apps/web/src/app/(app)/main/explore/work/_data/mock/graphicDesignerPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const GRAPHIC_DESIGNER_PATH: WorkPathContent = {
  id: "graphic-designer",
  slug: "graphic-designer",
  lane: "work",

  theme: {
    tone: "visual-creative",
    accent: { r: 236, g: 120, b: 255 },
    accentStrong: { r: 255, g: 104, b: 196 },
    glow: { r: 214, g: 153, b: 255 },
    surfaceLabel: "Visual creation",
  },

  card: {
    title: "Graphic Designer",
    hook: "Turn ideas, messages, and brands into visual experiences.",
    description:
      "A path for people who care about visuals, layout, typography, and how something feels at a glance. Graphic design blends creativity, communication, and visual judgment into work that shapes what people see and how they interpret it.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Graphic Designer",
    hook:
      "You notice fonts, spacing, color choices, logos, posters, and how design changes the way something feels.",
    summary:
      "Graphic designers shape visual communication. They design posters, branding, digital interfaces, social media graphics, packaging, and visual identities. At its best, design helps ideas become clear, memorable, and emotionally engaging.",
    whyItPullsYouIn: [
      "You notice when something looks clean, awkward, bold, or beautifully balanced.",
      "You enjoy combining creativity with visual problem-solving.",
      "You like the idea that design can change how people understand something instantly.",
    ],
  },

  traitChips: [
    { id: "visual-taste", label: "Visual taste" },
    { id: "creative-thinking", label: "Creative thinking" },
    { id: "design-sense", label: "Design sense" },
    { id: "detail-awareness", label: "Detail awareness" },
  ],

  fitSignals: [
    {
      id: "visual-instinct",
      label: "Visual instinct",
      score: 90,
      explanation:
        "Design often fits people who quickly notice visual imbalance, awkward layouts, or opportunities to make something more striking.",
    },
    {
      id: "creative-problem-solving",
      label: "Creative problem solving",
      score: 88,
      explanation:
        "Graphic design blends creativity with practical goals like clarity, communication, and brand identity.",
    },
    {
      id: "attention-to-detail",
      label: "Attention to detail",
      score: 87,
      explanation:
        "Small design decisions - spacing, contrast, color - often change the entire visual impact.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Creative flow",
      note: "Concept to layout to refinement",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Concept plus execution",
      note: "Brainstorming followed by visual production",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Design assets",
      note: "Logos, graphics, layouts, visual systems",
    },
  ],

  specialtyPreviews: [
    {
      id: "brand-designer",
      slug: "brand-designer",
      title: "Brand Designer",
      oneLiner:
        "Creates logos, color systems, and visual identity for companies and products.",
      whyItCouldFit:
        "Great for someone who loves shaping the personality of a brand visually.",
      energy: "creative",
    },
    {
      id: "digital-designer",
      slug: "digital-designer",
      title: "Digital Designer",
      oneLiner:
        "Designs graphics and visuals for websites, apps, and social media.",
      whyItCouldFit:
        "Great for someone drawn to modern digital products and visual storytelling.",
      energy: "systems",
    },
    {
      id: "illustrative-designer",
      slug: "illustrative-designer",
      title: "Illustrative Designer",
      oneLiner:
        "Combines drawing and graphic design to create expressive visual work.",
      whyItCouldFit:
        "Great for someone who loves art but also wants to communicate ideas visually.",
      energy: "high-creative",
    },
  ],

  specialties: [],

  dayInLife: {
  title: "A day in the life",
  summary:
    "Design is not just making things look good. It is making decisions, refining taste, and turning ideas into something people feel instantly.",

  moments: [
    {
      id: "morning-start",
      timeLabel: "9:00 AM",
      title: "Look at it with fresh eyes",
      body:
        "You open your work from yesterday and immediately see things you want to change. Spacing feels off. Colors feel slightly wrong. That is normal. Taste sharpens with distance.",
    },
    {
      id: "concept",
      timeLabel: "10:15 AM",
      title: "Explore directions",
      body:
        "You sketch ideas, pull references, and try different visual directions. This is not about being right yet. It is about exploring what it could be.",
    },
    {
      id: "build",
      timeLabel: "11:45 AM",
      title: "Make it real",
      body:
        "You start building the design - layout, typography, color, hierarchy. Decisions stack quickly. Every small choice changes how it feels.",
    },
    {
      id: "midday-reset",
      timeLabel: "1:00 PM",
      title: "Step back and reset",
      body:
        "You step away, come back, and see it differently. What felt strong might now feel average. This loop is constant - make, step back, refine.",
    },
    {
      id: "feedback",
      timeLabel: "2:30 PM",
      title: "Take feedback and adjust",
      body:
        "Someone else looks at it. They notice different things. Some feedback helps, some does not. The skill is knowing what to keep and what to ignore.",
    },
    {
      id: "refine",
      timeLabel: "3:45 PM",
      title: "Push it past average",
      body:
        "You adjust spacing, alignment, contrast, and details. This is where design goes from okay to strong. The difference is usually subtle but important.",
    },
    {
      id: "end",
      timeLabel: "5:30 PM",
      title: "You can feel the difference",
      body:
        "At the end of the day, the design is clearer, sharper, and more intentional. It communicates faster. That is the signal you are getting better.",
    },
  ],
},

  forecast: {
    title: "What growth can look like",
    summary:
      "Design careers often start with small personal projects and portfolios.",
    stages: [],
  },

  /* =========================
     FORECAST PASS (REFINED)
  ========================= */

  forecastV2: {
    outlookLabel: "Strong - but portfolio-driven",
    outlookSummary:
      "Graphic design is still in demand, but the barrier to entry has dropped. Tools are easier, AI can generate visuals, and more people are entering the field. The difference now is not access - it is taste, execution, and having real work to show.",

    metrics: [
      {
        id: "demand",
        label: "Demand",
        value: "Stable",
        tone: "positive",
        note: "Design is needed across almost every industry",
      },
      {
        id: "competition",
        label: "Competition",
        value: "High",
        tone: "mixed",
        note: "More designers entering due to accessible tools",
      },
      {
        id: "ai",
        label: "AI impact",
        value: "Moderate",
        tone: "mixed",
        note: "AI can generate visuals but not strong taste or direction",
      },
      {
        id: "portfolio",
        label: "Portfolio importance",
        value: "Critical",
        tone: "positive",
        note: "Your work matters more than credentials",
      },
    ],

    salaryRange: {
      low: "$45K",
      median: "$64K",
      high: "$110K+",
    },

    industry: {
      sourceLabel: "Bureau of Labor Statistics",
      sourceUrl:
        "https://www.bls.gov/ooh/arts-and-design/graphic-designers.htm",
      growthPercent: "3%",
      annualOpenings: "21,100",
      medianPay: "$64,500",
      educationTypical: "Bachelor's degree",
    },

    whatIsGrowing: [
      "Designers who can think in systems (branding, UI, product)",
      "People who combine design with digital or product skills",
      "Designers with a strong, distinct visual point of view",
    ],

    whatIsUnderPressure: [
      "Basic visual work that templates or AI can generate",
      "Generic portfolios that do not stand out",
      "People who rely only on tools without developing taste",
    ],

    aiImpact: {
      level: "medium",
      summary:
        "AI can generate layouts, logos, and variations quickly, but it cannot replace strong taste, judgment, or understanding of what actually works.",
      helpsWith: [
        "Generating ideas and variations",
        "Speeding up production work",
        "Exploring styles quickly",
      ],
      putsPressureOn: [
        "Simple or repetitive design tasks",
        "Designers who only execute without direction",
      ],
      humansStillOwn: [
        "Taste and visual judgment",
        "Brand identity and meaning",
        "Deciding what feels right and why",
      ],
    },

    whyThisCouldFeelExciting: [
      "You can build a real portfolio quickly and get noticed",
      "Design connects to many industries - tech, media, branding, product",
      "You can develop a unique visual style that is yours",
    ],

    whyThisCouldFeelRisky: [
      "It is easy to start, but harder to stand out",
      "You need consistent output to build a strong portfolio",
      "Trends and tools change quickly",
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The fastest way to explore design is to start creating visual work.",
    actions: [],
    opportunityGroups: [],
  },

  nextStepsV2: {
    heroTitle: "You do not need permission to start designing",
    heroSummary:
      "Real designers are not waiting for a job. They are making things, posting them, and getting better fast. You can start building a portfolio this week.",
    heroBadge: "Make real work",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Get around real creative energy",
        description:
          "Being around real creative spaces helps you move faster and take your work more seriously.",
        mode: "local",
        items: [
          {
            id: "marin-library-lab-design",
            title: "Marin County Library - The Lab",
            href: "https://marinlibrary.org/the-lab/",
            note:
              "Free creative space with tools, people, and projects you can actually make.",
            badge: "Free / Local",
            mode: "local",
          },
          {
            id: "sfpl-mix-design",
            title: "The Mix (SF Public Library)",
            href: "https://www.sfpl.org/locations/main-library/the-mix",
            note:
              "Teen-focused creative studio for design, media, and digital work.",
            badge: "Teen space",
            mode: "local",
          },
          {
            id: "cca-precollege",
            title: "CCA Pre-College Design Programs",
            href: "https://www.cca.edu/academics/pre-college/",
            note:
              "Serious design programs focused on portfolio building and real creative skills.",
            badge: "Portfolio",
            mode: "local",
          },
        ],
      },

      {
        id: "remote",
        eyebrow: "Online",
        title: "Where real designers actually start",
        description:
          "These are not just tools - they are how designers build portfolios, get noticed, and level up.",
        mode: "remote",
        items: [
          {
            id: "figma",
            title: "Figma",
            href: "https://www.figma.com",
            note:
              "Design real apps, interfaces, and layouts - this is what modern designers use.",
            badge: "Essential",
            mode: "remote",
          },
          {
            id: "canva",
            title: "Canva",
            href: "https://www.canva.com",
            note:
              "Fast way to start making posters, social graphics, and brand visuals right away.",
            badge: "Start fast",
            mode: "remote",
          },
          {
            id: "behance",
            title: "Behance",
            href: "https://www.behance.net",
            note:
              "Publish your work and see how real designers present portfolios.",
            badge: "Portfolio",
            mode: "remote",
          },
          {
            id: "dribbble",
            title: "Dribbble",
            href: "https://dribbble.com",
            note:
              "See current design trends and how high-level work is presented.",
            badge: "Level up",
            mode: "remote",
          },
          {
            id: "briefbox",
            title: "Briefbox Design Challenges",
            href: "https://briefbox.me",
            note:
              "Real-world style design briefs to build portfolio projects quickly.",
            badge: "Practice",
            mode: "remote",
          },
        ],
      },
    ],
  },
};