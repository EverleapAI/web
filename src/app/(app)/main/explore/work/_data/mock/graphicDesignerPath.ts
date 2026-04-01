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
  {
    id: "taste-and-judgment",
    label: "Taste + judgment",
    score: 85,
    explanation:
      "You can tell when something feels clean, modern, balanced, or off - and you want to push it toward something stronger.",
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

  specialties: [
    {
      id: "brand-designer",
      slug: "brand-designer",
      title: "Brand Designer",
      summary:
        "This version of design is about shaping how a company, product, or idea feels the moment someone sees it. You are building identity - logos, color systems, typography, and visual language that make something feel recognizable, intentional, and emotionally clear.",
      whatYouActuallyDo: [
        "Design logos, color palettes, typography systems, and flexible brand guidelines.",
        "Translate abstract ideas like tone, personality, and audience into visual choices people can immediately feel.",
        "Build identity systems that stay consistent across websites, packaging, social posts, presentations, and campaigns.",
        "Refine visual direction until the brand feels clear and memorable instead of generic or scattered.",
      ],
      skillsThatGrowHere: [
        "Visual identity systems",
        "Typography",
        "Color judgment",
        "Brand consistency",
      ],
      starterProjects: [
        "Create a full brand identity for a fictional company, club, or local business.",
        "Redesign an existing brand and explain what feels stronger in your version and why.",
        "Build a small brand guide showing the logo system, colors, typography, and how the identity should be used.",
      ],
      atmosphere:
        "Taste-driven, strategic, and concept-heavy. The work is creative, but every visual choice has to communicate something real.",
    },
    {
      id: "digital-designer",
      slug: "digital-designer",
      title: "Digital Designer",
      summary:
        "This version focuses on visuals for screens - websites, apps, campaigns, and social content. You are designing for attention, clarity, motion, and how people actually move through digital spaces.",
      whatYouActuallyDo: [
        "Design layouts and visual systems for websites, apps, and digital products.",
        "Create graphics, campaigns, and social assets that feel sharp, current, and easy to understand quickly.",
        "Think about hierarchy, spacing, rhythm, and what pulls the eye first on a screen.",
        "Work with developers or digital tools to make sure the design holds up once it becomes real.",
      ],
      skillsThatGrowHere: [
        "Layout systems",
        "UI awareness",
        "Digital composition",
        "Screen-based visual hierarchy",
      ],
      starterProjects: [
        "Design a homepage, landing page, or app concept in Figma and explain your layout choices.",
        "Create a short social campaign with multiple assets that feel visually connected.",
        "Take an existing website and redesign it so the content feels clearer, stronger, and more modern.",
      ],
      atmosphere:
        "Fast-moving, screen-native, and current. This work rewards people who can make digital experiences feel both beautiful and easy to follow.",
    },
    {
      id: "illustrative-designer",
      slug: "illustrative-designer",
      title: "Illustrative Designer",
      summary:
        "This version blends graphic design with drawing, image-making, and visual storytelling. You are not just arranging design elements - you are creating original visual language that adds personality, style, and emotional distinctiveness.",
      whatYouActuallyDo: [
        "Create custom illustrations that support brands, stories, campaigns, or products.",
        "Combine drawing with typography, layout, and design systems so the work still communicates clearly.",
        "Develop a visual style that feels recognizable and expressive instead of generic.",
        "Use illustration to clarify ideas, create mood, and give projects a stronger point of view.",
      ],
      skillsThatGrowHere: [
        "Illustration",
        "Visual storytelling",
        "Style development",
        "Expressive communication",
      ],
      starterProjects: [
        "Create a poster or campaign series that uses your own illustration style instead of stock visuals.",
        "Design an illustrated brand or product concept with packaging, graphics, and supporting assets.",
        "Build a small portfolio set of pieces that all feel like they came from the same visual mind.",
      ],
      atmosphere:
        "Expressive, creative, and style-forward. This is where design becomes more personal and where your visual voice matters a lot.",
    },
  ],

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
    heroTitle: "The fastest way to understand design is to make work people can see",
    heroSummary:
      "Do not wait for the perfect class or the perfect logo idea. Pick a real prompt, make something visual, post it, revise it, and build your eye through repetition. That is how graphic design becomes real.",
    heroBadge: "Build visible work",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Get around real creative energy",
        description:
          "These local opportunities get you closer to studios, workshops, portfolio-building spaces, and real creative communities instead of keeping design trapped in your head.",
        mode: "local",
        items: [
          {
            id: "marin-library-the-lab",
            title: "Marin County Library - The Lab",
            href: "https://marinlibrary.org/the-lab/",
            note:
              "A free makerspace and creative tech environment where you can work on visual projects, print ideas, experiment, and get used to making things outside your bedroom.",
            badge: "Free creative space",
            mode: "local",
          },
          {
            id: "marin-library-events",
            title: "Marin County Library Events",
            href: "https://marinlibrary.bibliocommons.com/v2/events",
            note:
              "A live stream of community workshops, art events, and hands-on programs. Useful if you want nearby creative activity you can actually show up to.",
            badge: "Find local workshops",
            mode: "local",
          },
          {
            id: "sfpl-the-mix",
            title: "San Francisco Public Library - The Mix",
            href: "https://sfpl.org/teens/the-mix",
            note:
              "A teen-focused creative space with design, media, and digital making resources. Strong if you want a youth-centered place to create and explore.",
            badge: "Teen creative hub",
            mode: "local",
          },
          {
            id: "cca-youth-programs",
            title: "CCA Youth Programs",
            href: "https://cca.edu/academics/#section-youth-programs",
            note:
              "California College of the Arts offers youth pathways that can push your work past hobby level and closer to real portfolio-building.",
            badge: "Design pathway",
            mode: "local",
          },
          {
            id: "cca-scholastic-art-awards",
            title: "CCA Scholastic Art Awards",
            href: "https://www.cca.edu/academics/scholastic-art-awards/",
            note:
              "A serious Bay Area entry point for student artists and designers in grades 7-12. Good if you want a deadline, recognition, and a reason to produce strong work.",
            badge: "Submit real work",
            mode: "local",
          },
          {
            id: "aiga-sf-events",
            title: "AIGA San Francisco Events",
            href: "https://aigasf.org/events/",
            note:
              "Northern California design events, talks, and workshops. A strong way to see what the real design world sounds like and where people in the field gather.",
            badge: "Design community",
            mode: "local",
          },
        ],
      },
      {
        id: "remote",
        eyebrow: "Online",
        title: "Where designers actually start building",
        description:
          "These are not filler links. They are real tools, prompts, and portfolio platforms that can help you make work this week and start developing a visible design voice.",
        mode: "remote",
        items: [
          {
            id: "figma",
            title: "Figma",
            href: "https://www.figma.com/",
            note:
              "The fastest serious way to design posters, interfaces, layouts, social graphics, and full visual systems. This is one of the most important modern design tools to learn.",
            badge: "Essential tool",
            mode: "remote",
          },
          {
            id: "canva",
            title: "Canva",
            href: "https://www.canva.com/",
            note:
              "A fast way to start making real visual work immediately. Useful for posters, campaigns, social graphics, and getting reps before your skills get more advanced.",
            badge: "Start fast",
            mode: "remote",
          },
          {
            id: "behance",
            title: "Behance",
            href: "https://www.behance.net/",
            note:
              "A place to publish your work and study how strong designers present projects. Great for learning what a portfolio case study actually looks like.",
            badge: "Portfolio platform",
            mode: "remote",
          },
          {
            id: "dribbble",
            title: "Dribbble",
            href: "https://dribbble.com/",
            note:
              "Useful for seeing current visual trends, styles, and presentation quality. Good for sharpening your eye and noticing what feels polished versus average.",
            badge: "Visual standards",
            mode: "remote",
          },
          {
            id: "briefbox",
            title: "Briefbox Design Challenges",
            href: "https://www.briefbox.me/",
            note:
              "Real-world style creative briefs that help you stop waiting for inspiration and start building portfolio pieces with clear constraints.",
            badge: "Practice with prompts",
            mode: "remote",
          },
          {
            id: "adobe-express",
            title: "Adobe Express",
            href: "https://www.adobe.com/express/",
            note:
              "A practical way to build flyers, social assets, posters, and quick campaigns while getting comfortable with visual hierarchy and brand consistency.",
            badge: "Create fast",
            mode: "remote",
          },
        ],
      },
    ],
  },
};