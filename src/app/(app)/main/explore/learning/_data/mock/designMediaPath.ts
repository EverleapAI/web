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
      "A learning path for people who like visual thinking, storytelling, creative tools, and making ideas visible.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Design + Media",
    hook:
      "For minds that think visually and want to create things people experience.",
    summary:
      "This path is about turning creative instinct into real output — graphics, video, brand identity, and digital experiences.",
    whyItPullsYouIn: [
      "You notice visuals and design details others miss.",
      "You like making things look and feel good.",
      "You enjoy storytelling through visuals.",
      "You want your ideas to become real creative work.",
    ],
  },

  traitChips: [
    { id: "visual-thinking", label: "Visual thinking" },
    { id: "creative-expression", label: "Creative expression" },
    { id: "story-sense", label: "Story sense" },
    { id: "aesthetic-eye", label: "Aesthetic eye" },
  ],

  fitSignals: [
    {
      id: "visual-awareness",
      label: "You notice design everywhere",
      score: 92,
      explanation:
        "You pay attention to layout, typography, and visual style.",
    },
    {
      id: "creative-drive",
      label: "You enjoy creating visual things",
      score: 90,
      explanation:
        "You like turning ideas into images, videos, or designs.",
    },
    {
      id: "story-expression",
      label: "You like expressing ideas visually",
      score: 88,
      explanation:
        "You prefer showing ideas instead of just explaining them.",
    },
  ],

  whatYouLearn: [
    {
      id: "visual-basics",
      title: "How visual design works",
      description: "Color, typography, layout, and composition.",
    },
    {
      id: "tools",
      title: "Creative tools",
      description:
        "Using tools like Canva, Adobe, or editing software to build real outputs.",
    },
    {
      id: "storytelling",
      title: "Visual storytelling",
      description:
        "How images, motion, and pacing communicate ideas.",
    },
    {
      id: "projects",
      title: "How to create real projects",
      description:
        "Turning ideas into posters, videos, brands, or experiences.",
    },
    {
      id: "style",
      title: "Developing your style",
      description:
        "Learning what you like and refining your creative voice.",
    },
  ],

  featuredOpportunity: {
    title: "Start creating instantly with Canva",
    provider: "Canva",
    summary:
      "An easy-to-use design tool where you can create visuals immediately.",
    whyStartHere:
      "Fast, beginner-friendly, and lets you make something real in minutes.",
    href: "https://www.canva.com",
    mode: "virtual",
    formatLabel: "Beginner-friendly design tool",
  },

  opportunityGroups: [
    {
      id: "build-skill",
      title: "Build real creative skill",
      description:
        "Online places to learn tools, practice fast, and start building real portfolio pieces.",
      items: [
        {
          id: "canva-design-school",
          title: "Canva Design School",
          provider: "Canva",
          summary:
            "Simple lessons to start learning layout, typography, color, and visual communication.",
          whyItFits:
            "Great first step if you want to build confidence fast and make things immediately.",
          mode: "virtual",
          href: "https://www.canva.com/learn/",
          formatLabel: "Short tutorials",
          tags: ["beginner-friendly", "free", "self-paced"],
        },
        {
          id: "adobe-tutorials",
          title: "Adobe Creative Tutorials",
          provider: "Adobe",
          summary:
            "Guided lessons using industry-standard creative tools across design, photo, and video.",
          whyItFits:
            "Helps you move beyond beginner tools into stronger creative workflows.",
          mode: "virtual",
          href: "https://helpx.adobe.com/creative-cloud/tutorials.html",
          formatLabel: "Project-based learning",
          tags: ["structured", "portfolio-building"],
        },
        {
          id: "figma-learn",
          title: "Figma Learn Design",
          provider: "Figma",
          summary:
            "Hands-on lessons for interface design, layout, prototyping, and collaborative creative work.",
          whyItFits:
            "Excellent if your creativity leans toward digital products, screens, and visual systems.",
          mode: "virtual",
          href: "https://help.figma.com/hc/en-us/categories/360002051613-Learn-design",
          formatLabel: "Interactive learning",
          tags: ["structured", "hands-on", "self-paced"],
        },
        {
          id: "davinci-training",
          title: "DaVinci Resolve Training",
          provider: "Blackmagic Design",
          summary:
            "Free official training for editing, color, and post-production workflows.",
          whyItFits:
            "A strong path if storytelling through video and motion feels more exciting than static graphics.",
          mode: "virtual",
          href: "https://www.blackmagicdesign.com/products/davinciresolve/training",
          formatLabel: "Video editing training",
          tags: ["free", "structured", "portfolio-building"],
        },
        {
          id: "behance",
          title: "Behance Creative Inspiration",
          provider: "Behance",
          summary:
            "Browse real portfolios, campaigns, motion pieces, brand systems, and visual storytelling work.",
          whyItFits:
            "Sharpens your taste by showing what strong creative work actually looks like in the real world.",
          mode: "virtual",
          href: "https://www.behance.net/",
          formatLabel: "Portfolio inspiration",
          tags: ["self-paced", "portfolio-building"],
        },
      ],
    },

    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Real places where design and media stop being abstract and start becoming projects, collaboration, and finished work.",
      items: [
        {
          id: "school-media",
          title: "School media or design clubs",
          provider: "Local schools",
          summary:
            "Work on posters, yearbook, social content, video, or visual projects with other students.",
          whyItFits:
            "Collaboration and deadlines help creative work become real instead of staying in your head.",
          mode: "local",
          href: "https://www.google.com/search?q=Marin+County+school+media+club+design+club",
          locationLabel: "Marin / North Bay",
          formatLabel: "Student creative work",
          tags: ["local", "hands-on"],
        },
        {
          id: "community-arts",
          title: "Community art and media programs",
          provider: "Bay Area arts organizations",
          summary:
            "Explore local workshops, youth programs, and creative classes focused on visual storytelling and making.",
          whyItFits:
            "Being around other creative people makes it easier to build momentum and finish projects.",
          mode: "local",
          href: "https://www.google.com/search?q=Bay+Area+youth+media+arts+programs",
          locationLabel: "Bay Area",
          formatLabel: "Workshops + programs",
          tags: ["local", "structured"],
        },
        {
          id: "creative-competitions",
          title: "Student creative competitions",
          provider: "Regional / national organizations",
          summary:
            "Enter work in poster, film, digital media, or design competitions and build toward a real finished piece.",
          whyItFits:
            "Deadlines and submission goals are one of the fastest ways to actually complete creative work.",
          mode: "hybrid",
          href: "https://www.google.com/search?q=student+design+competition+bay+area",
          locationLabel: "Regional / online",
          formatLabel: "Submission-based projects",
          tags: ["portfolio-building", "hands-on"],
        },
        {
          id: "sfmoma-youth",
          title: "SFMOMA public programs",
          provider: "SFMOMA",
          summary:
            "Explore exhibits, artist talks, and public-facing design and visual culture in a serious creative environment.",
          whyItFits:
            "Good creative work gets stronger when you spend time around ambitious visual ideas and real audiences.",
          mode: "local",
          href: "https://www.sfmoma.org/events/",
          locationLabel: "San Francisco",
          formatLabel: "Exhibits + events",
          tags: ["local", "self-paced"],
        },
        {
          id: "maker-media-space",
          title: "Maker and media spaces near you",
          provider: "Local search",
          summary:
            "Find creative labs, maker spaces, and community build environments where you can prototype and produce real work.",
          whyItFits:
            "Useful if your creativity comes alive when you are physically making, editing, printing, or testing ideas.",
          mode: "local",
          href: "https://www.google.com/search?q=maker+space+media+lab+Marin+County",
          locationLabel: "Near 94901",
          formatLabel: "Hands-on exploration",
          tags: ["local", "hands-on"],
        },
      ],
    },
  ],
};