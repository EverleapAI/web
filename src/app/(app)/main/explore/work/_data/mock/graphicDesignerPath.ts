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
        "Small design decisions — spacing, contrast, color — often change the entire visual impact.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Creative flow",
      note: "Concept → layout → refinement",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Concept + execution",
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
      "Design work mixes creative thinking with careful execution and iteration.",
    moments: [
      {
        id: "morning-ideas",
        timeLabel: "9:00 AM",
        title: "Brainstorm visual concepts",
        body:
          "You explore references, sketch ideas, and imagine visual directions.",
      },
      {
        id: "midday-design",
        timeLabel: "11:30 AM",
        title: "Create the design",
        body:
          "You build layouts, refine colors, adjust typography, and explore variations.",
      },
      {
        id: "afternoon-feedback",
        timeLabel: "2:00 PM",
        title: "Review and improve",
        body:
          "You adjust the work based on feedback and refine the final visual outcome.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "Design careers often start with small personal projects and portfolios.",
    stages: [],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The fastest way to explore design is to start creating visual work.",

    actions: [
      {
        id: "design-next-1",
        title: "Redesign something you see every day",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "30 min",
        whyThisMatters:
          "Design skills grow when you experiment with improving existing visuals.",
        instructions: [
          "Choose a logo, poster, or website you see often.",
          "Create a redesign with your own style.",
          "Notice what decisions changed the look and feel.",
        ],
      },
    ],

    opportunityGroups: [],
  },
};