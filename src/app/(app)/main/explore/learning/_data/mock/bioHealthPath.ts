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
    hook: "Understand living systems and how to help people stay healthy.",
    description:
      "A learning path for people drawn to biology, the human body, health science, medicine, nutrition, and how living systems work. It blends curiosity about life with practical ways to help people feel stronger, recover, and thrive.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Biology + Health",
    hook: "For minds curious about life, the body, and how health really works.",
    summary:
      "Some people are fascinated by living systems — how the body adapts, how cells work, how recovery happens, why stress changes behavior, or what helps people stay strong. Biology + Health explores life science from molecules to human performance and real-world care.",
    whyItPullsYouIn: [
      "You are curious about how the human body actually works.",
      "You notice patterns in health, training, nutrition, and recovery.",
      "You like understanding science that affects real people.",
      "You want knowledge that can help people live better.",
    ],
  },

  traitChips: [
    { id: "life-curiosity", label: "Life curiosity" },
    { id: "science-mind", label: "Science mindset" },
    { id: "care-energy", label: "Care energy" },
    { id: "observation", label: "Observation" },
    { id: "body-systems", label: "Body systems interest" },
    { id: "practical-science", label: "Practical science" },
  ],

  fitSignals: [
    {
      id: "curious-about-body",
      label: "You are fascinated by how the body works.",
      score: 94,
      explanation:
        "You often find yourself wondering how muscles, nerves, energy systems, or recovery processes actually function.",
    },
    {
      id: "health-patterns",
      label: "You notice patterns in health and performance.",
      score: 90,
      explanation:
        "You are curious about what makes someone stronger, healthier, faster, or more resilient.",
    },
    {
      id: "science-helping",
      label: "You like science that helps people.",
      score: 88,
      explanation:
        "The science becomes more interesting when it connects to improving someone's health or life.",
    },
    {
      id: "hands-on-learning",
      label: "You enjoy learning through observation and real examples.",
      score: 86,
      explanation:
        "Seeing biology in action — through sports, nutrition, injury recovery, or training — makes learning feel real.",
    },
  ],

  branchPreviews: [
    {
      id: "human-biology",
      slug: "human-biology",
      title: "Human Biology",
      oneLiner: "Understand the systems that keep the body alive and adapting.",
      whyItCouldFit:
        "Great if you like the science of how organs, cells, and body systems interact.",
      energy: "analysis",
    },
    {
      id: "health-science",
      slug: "health-science",
      title: "Health Science",
      oneLiner: "Explore medicine, wellness, prevention, and care.",
      whyItCouldFit:
        "Strong for people interested in healthcare and helping people recover or stay healthy.",
      energy: "people",
    },
    {
      id: "human-performance",
      slug: "human-performance",
      title: "Human Performance",
      oneLiner: "Study training, movement, strength, recovery, and endurance.",
      whyItCouldFit:
        "Perfect for people who love sports science or physical performance.",
      energy: "builder",
    },
    {
      id: "bio-research",
      slug: "bio-research",
      title: "Biological Research",
      oneLiner: "Investigate living systems through experiments and discovery.",
      whyItCouldFit:
        "Ideal for curious minds who want to explore unanswered scientific questions.",
      energy: "analysis",
    },
  ],

  branches: [
    {
      id: "human-biology",
      slug: "human-biology",
      title: "Human Biology",
      summary:
        "Human biology explores how the body’s systems — muscles, organs, hormones, nerves, and cells — work together to keep us alive and adaptable.",
      whatYouActuallyExplore: [
        "How organs and systems interact",
        "How the body responds to stress and recovery",
        "How cells and tissues function",
      ],
      skillsThatGrowHere: [
        "Scientific observation",
        "Biology fundamentals",
        "Systems thinking",
        "Research curiosity",
      ],
      starterProjects: [
        "Track sleep and energy patterns for a week",
        "Research how muscles recover after exercise",
        "Map a body system like the nervous system",
      ],
      atmosphere:
        "Curious, scientific, and exploratory.",
    },
    {
      id: "health-science",
      slug: "health-science",
      title: "Health Science",
      summary:
        "Health science focuses on helping people maintain wellness and recover from illness or injury.",
      whatYouActuallyExplore: [
        "Basic medical concepts",
        "Nutrition and wellness",
        "How prevention improves health",
      ],
      skillsThatGrowHere: [
        "Health awareness",
        "Communication about science",
        "Caregiving understanding",
        "Practical science thinking",
      ],
      starterProjects: [
        "Create a wellness guide for students",
        "Research how sleep affects recovery",
        "Track hydration and performance",
      ],
      atmosphere:
        "Human-centered, practical, and service-oriented.",
    },
    {
      id: "human-performance",
      slug: "human-performance",
      title: "Human Performance",
      summary:
        "Human performance explores how training, nutrition, recovery, and physiology affect strength, endurance, and movement.",
      whatYouActuallyExplore: [
        "How muscles adapt to training",
        "Energy systems and endurance",
        "Recovery and injury prevention",
      ],
      skillsThatGrowHere: [
        "Observation of performance",
        "Training structure",
        "Sports science thinking",
        "Data awareness",
      ],
      starterProjects: [
        "Track your own training adaptation",
        "Compare recovery strategies",
        "Design a beginner training plan",
      ],
      atmosphere:
        "Active, analytical, and practical.",
    },
    {
      id: "bio-research",
      slug: "bio-research",
      title: "Biological Research",
      summary:
        "This direction focuses on asking scientific questions about living systems and testing ideas through investigation.",
      whatYouActuallyExplore: [
        "How scientists design experiments",
        "How biological discoveries happen",
        "How evidence supports conclusions",
      ],
      skillsThatGrowHere: [
        "Scientific thinking",
        "Research design",
        "Critical analysis",
        "Data interpretation",
      ],
      starterProjects: [
        "Design a small biology experiment",
        "Research a new discovery in medicine",
        "Write a short science explanation article",
      ],
      atmosphere:
        "Investigative, thoughtful, and discovery-driven.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way to explore biology and health is to observe real living systems and test simple ideas.",
    actions: [
      {
        id: "body-observation",
        title: "Observe one body system in action",
        type: "experiment",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "Observation helps connect biology concepts to real experiences.",
        instructions: [
          "Pick a system like breathing or heart rate.",
          "Observe changes during activity.",
          "Write down what changes and why.",
        ],
      },
      {
        id: "nutrition-log",
        title: "Track nutrition and energy for a week",
        type: "project",
        effort: "medium",
        timeEstimate: "7 days",
        whyThisMatters:
          "Health science becomes real when you observe patterns in daily life.",
        instructions: [
          "Track meals, sleep, and energy levels.",
          "Look for patterns during the week.",
          "Reflect on what affects energy or focus.",
        ],
      },
      {
        id: "research-topic",
        title: "Explore a real biology topic",
        type: "read",
        effort: "light",
        timeEstimate: "30–45 min",
        whyThisMatters:
          "Reading about new discoveries helps you see how biology evolves.",
        instructions: [
          "Pick a topic like immunity or muscle growth.",
          "Read one article or research summary.",
          "Write a short explanation in your own words.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "Biology paths often feel like discovering hidden processes inside living systems. The more you learn, the more complex and fascinating life becomes.",
    moments: [
      {
        id: "body-awareness",
        title: "You start noticing biological processes everywhere",
        body:
          "Breathing, recovery, stress, and movement start to feel like systems you can observe and understand.",
      },
      {
        id: "science-realization",
        title: "Science connects to everyday life",
        body:
          "Biology becomes more than a textbook subject — it becomes part of how you understand the world.",
      },
      {
        id: "discovery-energy",
        title: "New discoveries feel exciting",
        body:
          "Learning about new medical or biological discoveries sparks curiosity.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Biology learning often starts with curiosity and gradually moves toward deeper scientific understanding and real-world application.",
    stages: [
      {
        id: "curiosity",
        label: "Start with curiosity",
        timeframe: "First weeks",
        summary:
          "You explore basic biology ideas and begin observing patterns in living systems.",
        signalsOfProgress: [
          "You ask more biological questions",
          "You connect science to real life",
        ],
      },
      {
        id: "learning",
        label: "Build scientific understanding",
        timeframe: "Next months",
        summary:
          "You develop deeper knowledge of biology and health science.",
        signalsOfProgress: [
          "You understand major body systems",
          "You read scientific information more comfortably",
        ],
      },
      {
        id: "application",
        label: "Apply science to real problems",
        timeframe: "Later exploration",
        summary:
          "You begin applying biology knowledge to health, performance, or research ideas.",
        signalsOfProgress: [
          "You connect science to practical outcomes",
          "You explore deeper topics or projects",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Next steps",
    summary:
      "Biology learning grows through curiosity, observation, and connecting science to real health questions.",
    actions: [
      {
        id: "science-journal",
        title: "Start a biology curiosity journal",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "10 min per observation",
        whyThisMatters:
          "Recording observations helps sharpen scientific thinking.",
        instructions: [
          "Write down interesting biology questions.",
          "Observe patterns in health or movement.",
          "Reflect on possible explanations.",
        ],
      },
      {
        id: "learn-basic-biology",
        title: "Take an introductory biology course online",
        type: "join",
        effort: "medium",
        timeEstimate: "2–3 hours total",
        whyThisMatters:
          "Structured learning helps build strong foundations.",
        instructions: [
          "Choose a beginner biology course.",
          "Watch the first few lessons.",
          "Note what topics excite your curiosity most.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "online-biology",
        title: "Online places to explore biology",
        description:
          "These resources help beginners explore biology and health science.",
        items: [
          {
            id: "khan-biology",
            title: "Khan Academy Biology",
            mode: "virtual",
            provider: "Khan Academy",
            summary: "Free lessons covering core biology topics.",
            whyItHelps:
              "Accessible explanations that build strong science foundations.",
            href: "https://www.khanacademy.org/science/biology",
            formatLabel: "Self-paced lessons",
          },
          {
            id: "crash-course-biology",
            title: "Crash Course Biology",
            mode: "virtual",
            provider: "YouTube / Crash Course",
            summary: "Short videos explaining key biology ideas.",
            whyItHelps:
              "Fast introduction to major biology concepts.",
            formatLabel: "Short video lessons",
          },
        ],
      },
    ],
  },
};