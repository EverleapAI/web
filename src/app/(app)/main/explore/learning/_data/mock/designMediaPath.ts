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
    hook: "For minds that think visually and want to create things people experience.",
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
      description:
        "Color, typography, layout, and composition.",
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
      id: "try-this-week",
      title: "Try this this week",
      description:
        "Fast ways to see if this creative path actually feels right.",
      items: [
        {
          id: "canva-design-school",
          title: "Canva Design School",
          provider: "Canva",
          summary:
            "Simple lessons to start learning layout, typography, and visuals.",
          whyItFits:
            "Great first step to build confidence quickly.",
          mode: "virtual",
          href: "https://www.canva.com/learn/",
          formatLabel: "Short tutorials",
          tags: ["beginner-friendly", "free", "self-paced"],
        },
        {
          id: "youtube-editing",
          title: "Beginner video editing tutorials",
          provider: "YouTube",
          summary:
            "Learn how to cut, edit, and create short visual stories.",
          whyItFits:
            "Fast way to test storytelling through video.",
          mode: "virtual",
          formatLabel: "Video tutorials",
          tags: ["self-paced", "hands-on"],
        },
      ],
    },

    {
      id: "build-skill",
      title: "Build real creative skill",
      description:
        "Structured ways to improve your craft and build stronger projects.",
      items: [
        {
          id: "adobe-tutorials",
          title: "Adobe Creative Tutorials",
          provider: "Adobe",
          summary:
            "Guided lessons using industry-standard creative tools.",
          whyItFits:
            "Helps you move beyond beginner tools into professional workflows.",
          mode: "virtual",
          href: "https://helpx.adobe.com/creative-cloud/tutorials.html",
          formatLabel: "Project-based learning",
          tags: ["structured", "portfolio-building"],
        },
        {
          id: "portfolio-projects",
          title: "Create 3 design projects",
          provider: "Self-directed",
          summary:
            "Build a poster, short video, and brand concept.",
          whyItFits:
            "Projects are the fastest way to grow and see progress.",
          mode: "virtual",
          formatLabel: "Self-directed",
          tags: ["portfolio-building", "hands-on"],
        },
      ],
    },

    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Ways to make creative work real in your environment.",
      items: [
        {
          id: "school-media",
          title: "School media / design clubs",
          provider: "Local schools",
          summary:
            "Work on real creative projects with other students.",
          whyItFits:
            "Collaboration helps creativity grow faster.",
          mode: "local",
          locationLabel: "Marin / North Bay",
          tags: ["local", "hands-on"],
        },
        {
          id: "community-arts",
          title: "Community art and media programs",
          provider: "Local arts orgs",
          summary:
            "Workshops and programs focused on creative skills.",
          whyItFits:
            "Real-world creative environments accelerate growth.",
          mode: "local",
          locationLabel: "Bay Area",
          tags: ["local", "structured"],
        },
        {
          id: "creative-competitions",
          title: "Student creative competitions",
          provider: "Various orgs",
          summary:
            "Submit design, video, or media projects.",
          whyItFits:
            "Deadlines and goals help you actually finish work.",
          mode: "hybrid",
          locationLabel: "Regional / online",
          tags: ["portfolio-building"],
        },
      ],
    },
  ],
};