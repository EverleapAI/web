// apps/web/src/app/(app)/main/explore/learning/_data/mock/designMediaPath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const DESIGN_MEDIA_PATH: LearningPathContent = {
  id: "design-media",
  slug: "design-media",
  lane: "learning",

  theme: {
    tone: "creative-signal",
    accent: { r: 255, g: 120, b: 210 },
    accentStrong: { r: 255, g: 160, b: 120 },
    glow: { r: 255, g: 110, b: 200 },
    surfaceLabel: "Creative build",
  },

  card: {
    title: "Design + Media",
    hook: "Shape ideas into visuals, stories, and experiences people feel.",
    description:
      "A learning path for people who like visual thinking, storytelling, creative tools, and making ideas visible. Design + Media blends creativity with craft — turning concepts into images, video, brands, interfaces, and experiences.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Design + Media",
    hook: "For minds that think visually and want to create things people experience.",
    summary:
      "Some people think in images. Some notice typography, color, layout, motion, and visual storytelling everywhere. Design + Media is for people who want to turn that instinct into real creative skills — from digital design to video, brand storytelling, and interactive media.",
    whyItPullsYouIn: [
      "You notice visuals, layouts, and design details others miss.",
      "You like making things that look and feel good.",
      "You enjoy storytelling through images, motion, or visual style.",
      "You want creative ideas to become real projects.",
    ],
  },

  traitChips: [
    { id: "visual-thinking", label: "Visual thinking" },
    { id: "creative-expression", label: "Creative expression" },
    { id: "story-sense", label: "Story sense" },
    { id: "aesthetic-eye", label: "Aesthetic eye" },
    { id: "tool-explorer", label: "Creative tool explorer" },
    { id: "idea-maker", label: "Idea maker" },
  ],

  fitSignals: [
    {
      id: "visual-awareness",
      label: "You notice design everywhere",
      score: 92,
      explanation:
        "You pay attention to logos, colors, typography, layouts, and how visual things are put together.",
    },
    {
      id: "creative-drive",
      label: "You enjoy creating visual things",
      score: 90,
      explanation:
        "Whether it is drawing, editing video, designing slides, or making graphics, you enjoy turning ideas into visuals.",
    },
    {
      id: "story-expression",
      label: "You like expressing ideas visually",
      score: 88,
      explanation:
        "You like telling stories, sharing ideas, or communicating feelings through images, motion, or design.",
    },
    {
      id: "creative-tools",
      label: "You like experimenting with creative tools",
      score: 86,
      explanation:
        "You enjoy learning tools like Canva, Photoshop, editing software, or other design platforms.",
    },
  ],

  branchPreviews: [
    {
      id: "visual-design",
      slug: "visual-design",
      title: "Visual Design",
      oneLiner: "Create graphics, layouts, and visual identity systems.",
      whyItCouldFit:
        "Strong fit if you like making things look beautiful, clear, and memorable.",
      energy: "creative",
    },
    {
      id: "video-storytelling",
      slug: "video-storytelling",
      title: "Video + Storytelling",
      oneLiner: "Tell stories through motion, editing, and visual narrative.",
      whyItCouldFit:
        "Great for people who enjoy video, filmmaking, and visual storytelling.",
      energy: "high-creative",
    },
    {
      id: "brand-identity",
      slug: "brand-identity",
      title: "Brand + Identity",
      oneLiner: "Shape how ideas, companies, and projects look and feel.",
      whyItCouldFit:
        "Perfect if you enjoy logos, branding, and visual personality.",
      energy: "creative",
    },
    {
      id: "interactive-media",
      slug: "interactive-media",
      title: "Interactive Media",
      oneLiner: "Design digital experiences people interact with.",
      whyItCouldFit:
        "Good for people who like combining design with digital tools.",
      energy: "builder",
    },
  ],

  branches: [
    {
      id: "visual-design",
      slug: "visual-design",
      title: "Visual Design",
      summary:
        "This direction focuses on creating visual communication: posters, graphics, layouts, and digital visuals that convey ideas clearly and beautifully.",
      whatYouActuallyExplore: [
        "Typography, color, and layout systems",
        "Graphic composition and visual balance",
        "Designing visuals that communicate clearly",
      ],
      skillsThatGrowHere: [
        "Graphic design fundamentals",
        "Typography",
        "Color theory",
        "Visual storytelling",
      ],
      starterProjects: [
        "Design a poster for a local event",
        "Create a visual identity for a fictional brand",
        "Design a small set of social media graphics",
      ],
      atmosphere:
        "Creative, visual, and expressive. You spend time refining details and visual style.",
    },
    {
      id: "video-storytelling",
      slug: "video-storytelling",
      title: "Video + Storytelling",
      summary:
        "This branch focuses on creating visual stories using video, editing, pacing, and sound to create emotional or narrative impact.",
      whatYouActuallyExplore: [
        "Video editing techniques",
        "Narrative pacing and visual storytelling",
        "Combining visuals, music, and timing",
      ],
      skillsThatGrowHere: [
        "Video editing",
        "Story structure",
        "Creative direction",
        "Visual rhythm",
      ],
      starterProjects: [
        "Create a short documentary about something local",
        "Edit a highlight video of a sport or event",
        "Produce a short visual story with music",
      ],
      atmosphere:
        "Expressive, cinematic, and narrative-driven.",
    },
    {
      id: "brand-identity",
      slug: "brand-identity",
      title: "Brand + Identity",
      summary:
        "Brand design focuses on creating the visual personality of projects, companies, or communities — logos, colors, typography, and visual style.",
      whatYouActuallyExplore: [
        "Logo design and brand marks",
        "Designing consistent visual systems",
        "How visual identity communicates meaning",
      ],
      skillsThatGrowHere: [
        "Logo design",
        "Brand strategy basics",
        "Visual consistency",
        "Creative thinking",
      ],
      starterProjects: [
        "Design a logo and brand system for a fictional startup",
        "Create a visual identity for a club or team",
        "Redesign a brand you think could be improved",
      ],
      atmosphere:
        "Creative, conceptual, and focused on visual personality.",
    },
    {
      id: "interactive-media",
      slug: "interactive-media",
      title: "Interactive Media",
      summary:
        "This direction blends design with digital experiences — interfaces, motion, and interactive storytelling.",
      whatYouActuallyExplore: [
        "Designing interactive user experiences",
        "Visual design for apps and digital platforms",
        "Motion and interface storytelling",
      ],
      skillsThatGrowHere: [
        "UX thinking",
        "Interface design",
        "Motion design",
        "Digital creativity",
      ],
      starterProjects: [
        "Design a simple app interface concept",
        "Create an interactive prototype",
        "Design a website layout for a project",
      ],
      atmosphere:
        "Creative and technical — combining design thinking with digital tools.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way to explore design is to create something small and visual right away.",
    actions: [
      {
        id: "design-poster",
        title: "Design a simple poster",
        type: "project",
        effort: "light",
        timeEstimate: "30–60 min",
        whyThisMatters:
          "Poster design forces you to combine layout, typography, and visual hierarchy.",
        instructions: [
          "Pick an event or idea.",
          "Use Canva or another design tool.",
          "Choose a strong color palette.",
          "Export and share it with someone.",
        ],
      },
      {
        id: "edit-short-video",
        title: "Create a short edited video",
        type: "experiment",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "Video editing helps you understand pacing, rhythm, and storytelling.",
        instructions: [
          "Film or collect a few clips.",
          "Use simple editing software.",
          "Add music and transitions.",
          "Export a short video story.",
        ],
      },
      {
        id: "brand-concept",
        title: "Invent a brand concept",
        type: "project",
        effort: "medium",
        timeEstimate: "60–90 min",
        whyThisMatters:
          "Brand design teaches how visuals create identity and meaning.",
        instructions: [
          "Invent a fictional company or project.",
          "Create a name, logo, and color palette.",
          "Design one visual asset (poster, social graphic, or site mockup).",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "Design paths often feel creative and expressive. You start noticing visual details everywhere and begin thinking about how ideas could look or feel differently.",
    moments: [
      {
        id: "visual-awareness",
        title: "You start noticing design everywhere",
        body:
          "Logos, layouts, colors, and typography start jumping out at you everywhere.",
      },
      {
        id: "creative-flow",
        title: "Creative flow moments",
        body:
          "When working on a visual project, time can pass quickly because you are absorbed in the creative process.",
      },
      {
        id: "visual-impact",
        title: "Your ideas become visible",
        body:
          "Instead of staying in your head, your ideas start turning into images and visual experiences.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Creative skills usually grow through repeated projects, experimentation, and refining your visual taste.",
    stages: [
      {
        id: "experiment",
        label: "Experiment with tools",
        timeframe: "First few weeks",
        summary:
          "You explore different creative tools and begin making simple visual projects.",
        signalsOfProgress: [
          "You become comfortable using design software",
          "You start developing visual preferences",
        ],
      },
      {
        id: "projects",
        label: "Create real projects",
        timeframe: "1–3 months",
        summary:
          "You start building projects with a clear visual goal or concept.",
        signalsOfProgress: [
          "You complete multiple creative projects",
          "You start developing your own style",
        ],
      },
      {
        id: "portfolio",
        label: "Build a small portfolio",
        timeframe: "After several projects",
        summary:
          "Your work becomes a collection of projects that show what you can create.",
        signalsOfProgress: [
          "You can show your work publicly",
          "Your design decisions become more intentional",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Keep building creative momentum",
    summary:
      "Creative growth accelerates when you share your work and try projects connected to real communities.",
    actions: [
      {
        id: "share-work",
        title: "Share your creative work",
        type: "join",
        effort: "light",
        timeEstimate: "20 min",
        whyThisMatters:
          "Sharing projects builds confidence and helps you get feedback.",
        instructions: [
          "Post a project online or show a friend.",
          "Ask for honest feedback.",
          "Use the feedback to improve the design.",
        ],
      },
      {
        id: "three-projects",
        title: "Create three small design projects",
        type: "project",
        effort: "stretch",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Multiple projects help you explore different creative directions.",
        instructions: [
          "Design one poster",
          "Create one short video",
          "Design a simple brand identity",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "online-learning",
        title: "Online places to explore design",
        description:
          "These platforms allow you to learn design tools and techniques through projects.",
        items: [
          {
            id: "canva-design-school",
            title: "Canva Design School",
            mode: "virtual",
            provider: "Canva",
            summary: "Beginner-friendly lessons on design and layout.",
            whyItHelps:
              "Easy entry into design fundamentals using a widely used creative tool.",
            href: "https://www.canva.com/learn/",
            formatLabel: "Interactive tutorials",
          },
          {
            id: "adobe-creative-tutorials",
            title: "Adobe Creative Tutorials",
            mode: "virtual",
            provider: "Adobe",
            summary: "Guided lessons for creative tools like Photoshop and Illustrator.",
            whyItHelps:
              "Industry-standard tools used by many creative professionals.",
            href: "https://helpx.adobe.com/creative-cloud/tutorials.html",
            formatLabel: "Project-based learning",
          },
        ],
      },
    ],
  },
};