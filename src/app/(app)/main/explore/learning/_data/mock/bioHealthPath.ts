// apps/web/src/app/(app)/main/explore/learning/_data/mock/bioHealthPath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const BIO_HEALTH_PATH: LearningPathContent = {
  id: "bio-health",
  slug: "bio-health",
  lane: "learning",

  theme: {
    tone: "living-systems",
    accent: { r: 120, g: 220, b: 160 },
    accentStrong: { r: 90, g: 170, b: 255 },
    glow: { r: 130, g: 230, b: 190 },
    surfaceLabel: "Living systems",
  },

  card: {
    title: "Biology + Health",
    hook:
      "Understand how the body works — and what actually helps people feel better.",
    description:
      "A path for people curious about biology, health, recovery, performance, and how science connects to real life.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Biology + Health",
    hook:
      "This is about understanding the system you live inside — your body, your energy, and how it adapts.",
    summary:
      "You start noticing patterns most people ignore — why you feel better some days, what changes performance, how recovery actually works. Biology stops being abstract and becomes something you can see, test, and improve in real life.",
    whyItPullsYouIn: [
      "You want science that actually matters day-to-day.",
      "You notice patterns in energy, stress, and performance.",
      "You care about health, training, or helping people feel better.",
      "You like understanding systems, not memorizing facts.",
    ],
  },

  traitChips: [
    { id: "life-curiosity", label: "Life curiosity" },
    { id: "science-mind", label: "Science mindset" },
    { id: "care-energy", label: "Care energy" },
    { id: "observation", label: "Observation" },
  ],

  fitSignals: [
    {
      id: "body-curiosity",
      label: "Curiosity about the body",
      score: 94,
      explanation:
        "You naturally ask how systems like energy, recovery, movement, and health actually work.",
    },
    {
      id: "health-patterns",
      label: "You notice real-world patterns",
      score: 90,
      explanation:
        "You pick up on how sleep, food, stress, training, and habits change outcomes over time.",
    },
    {
      id: "science-real-life",
      label: "You want useful science",
      score: 88,
      explanation:
        "You care less about random facts and more about science that helps explain real life.",
    },
  ],

  whatYouLearn: [
    {
      id: "body-systems",
      title: "Body systems",
      description: "How muscles, organs, hormones, and energy systems interact.",
    },
    {
      id: "recovery",
      title: "Recovery",
      description: "How sleep, stress, rest, and nutrition affect rebuilding.",
    },
    {
      id: "performance",
      title: "Performance",
      description: "How training, fatigue, adaptation, and consistency shape outcomes.",
    },
    {
      id: "health-patterns",
      title: "Health patterns",
      description: "How to notice changes in focus, mood, energy, and physical state.",
    },
    {
      id: "applied-science",
      title: "Applied science",
      description: "How to use biology to make better everyday decisions.",
    },
  ],

  featuredOpportunity: {
    title: "Track your own biology",
    provider: "Self-directed",
    summary:
      "Track sleep, energy, training, hydration, and recovery for two weeks and look for patterns.",
    whyStartHere:
      "This path gets much more interesting when biology stops being a chapter in a book and starts becoming something you can actually observe in yourself.",
    mode: "local",
  },

  opportunityGroups: [
    {
      id: "try-now",
      title: "Try this now",
      description:
        "Fast, low-pressure ways to see whether this world grabs your attention.",
      items: [
        {
          id: "khan-bio",
          title: "Khan Academy Biology",
          provider: "Khan Academy",
          summary:
            "A clear, beginner-friendly place to build the basics of cells, systems, genetics, and how living things work.",
          whyItFits:
            "This is one of the easiest ways to test whether biology feels energizing once the ideas are explained clearly.",
          mode: "virtual",
          href: "https://www.khanacademy.org/science/biology",
        },
        {
          id: "crash-course",
          title: "Crash Course Biology",
          provider: "YouTube",
          summary:
            "Fast, high-energy videos that make core biology ideas feel more alive and less textbook-heavy.",
          whyItFits:
            "Good if you want something visual, quick, and easy to sample before committing to deeper study.",
          mode: "virtual",
          href: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNm4xY9P5ZP0d2Fh4r2N9fP",
        },
        {
          id: "visible-body",
          title: "Visible Body (3D Anatomy)",
          provider: "Visible Body",
          summary:
            "Interactive anatomy tools that let you explore muscles, organs, and body structures in a visual way.",
          whyItFits:
            "Strong pick if what hooks you is seeing how the body is built, not just reading about it.",
          mode: "virtual",
          href: "https://www.visiblebody.com/",
        },
      ],
    },

    {
      id: "deeper",
      title: "Go deeper",
      description:
        "More structured ways to build understanding and connect biology to real outcomes.",
      items: [
        {
          id: "coursera",
          title: "Biology / Health Courses",
          provider: "Coursera",
          summary:
            "Browse beginner-friendly courses in human biology, health, anatomy, and wellness from major universities.",
          whyItFits:
            "Helpful when you want a more serious path and want to see what studying this could actually look like.",
          mode: "virtual",
          href: "https://www.coursera.org/browse/health",
        },
        {
          id: "nutrition",
          title: "Nutrition Science",
          provider: "Stanford Online",
          summary:
            "Explore how food affects energy, performance, metabolism, and long-term health.",
          whyItFits:
            "Great if the part of biology that interests you most is what changes how people feel day to day.",
          mode: "virtual",
          href: "https://online.stanford.edu/courses",
        },
        {
          id: "huberman",
          title: "Huberman Lab",
          provider: "Podcast / YouTube",
          summary:
            "Deep dives into sleep, stress, focus, recovery, exercise, and how the brain and body respond to habits.",
          whyItFits:
            "Useful if you like science that immediately connects to performance, routines, and everyday life.",
          mode: "virtual",
          href: "https://www.youtube.com/@hubermanlab",
        },
      ],
    },

    {
      id: "real-world",
      title: "Make it real near you",
      description:
        "Places and environments where biology stops being abstract and starts feeling physical, visible, and human.",
      items: [
        {
          id: "nature",
          title: "Guided Nature Walks",
          provider: "National Park Service",
          summary:
            "Join ranger-led programs and walks that help you notice ecosystems, adaptation, habitats, and living systems around you.",
          whyItFits:
            "A good reminder that biology is not only inside a lab — it is everywhere once you learn how to look.",
          mode: "local",
          href: "https://www.nps.gov/muwo/planyourvisit/calendar.htm",
        },
        {
          id: "volunteer",
          title: "Health Volunteering",
          provider: "Marin Community Clinics",
          summary:
            "See real healthcare environments up close and learn how health, care, and systems support actual people.",
          whyItFits:
            "Strong option if your interest in biology overlaps with wanting to help, support, or work around health in real life.",
          mode: "local",
          href: "https://www.marinclinic.org/get-involved/volunteer/",
        },
        {
          id: "fitness",
          title: "Training Environments",
          provider: "Local gyms",
          summary:
            "Spend time around coaching, exercise, movement, and recovery spaces where performance and adaptation are visible.",
          whyItFits:
            "This is biology in motion — you can watch how training, fatigue, and recovery actually affect people.",
          mode: "local",
          href: "https://www.google.com/search?q=marin+fitness+training",
        },
        {
          id: "exploratorium",
          title: "Exploratorium",
          provider: "SF Museum",
          summary:
            "Interactive science exhibits that make experimentation, observation, and systems-thinking feel hands-on.",
          whyItFits:
            "Great if you learn best by touching, testing, noticing, and seeing how ideas play out in the real world.",
          mode: "local",
          href: "https://www.exploratorium.edu/",
        },
      ],
    },
  ],
};