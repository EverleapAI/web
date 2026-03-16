// apps/web/src/app/(app)/main/explore/learning/_data/mock/humanBehaviorLeadershipPath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const HUMAN_BEHAVIOR_LEADERSHIP_PATH: LearningPathContent = {
  id: "human-behavior-leadership",
  slug: "human-behavior-leadership",
  lane: "learning",

  theme: {
    tone: "warm-signal",
    accent: { r: 110, g: 210, b: 185 },
    accentStrong: { r: 255, g: 173, b: 120 },
    glow: { r: 120, g: 220, b: 200 },
    surfaceLabel: "Human insight",
  },

  card: {
    title: "Human Behavior + Leadership",
    hook: "Learn how people work, what moves them, and how to help a group go somewhere real.",
    description:
      "A learning path for people drawn to psychology, group dynamics, communication, mentoring, leadership, and understanding what makes people grow. This path is about reading situations, building trust, guiding energy, and learning how humans actually work together.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Human Behavior + Leadership",
    hook: "For minds that notice people, patterns, emotions, and what helps a group move.",
    summary:
      "Some people are pulled toward systems. Some toward visuals. Some keep noticing people — who is engaged, who is shut down, what makes a group click, why one message lands and another does not. Human Behavior + Leadership is for that kind of attention. It moves from observation into action: mentoring, leading small groups, understanding motivation, and practicing the kind of leadership that actually helps.",
    whyItPullsYouIn: [
      "You notice moods, dynamics, and shifts in people faster than most.",
      "You are curious about why people act the way they do.",
      "You like helping groups feel clearer, calmer, or more motivated.",
      "You want influence to feel real and human, not fake or bossy.",
    ],
  },

  traitChips: [
    { id: "people-radar", label: "People radar" },
    { id: "group-awareness", label: "Group awareness" },
    { id: "empathy", label: "Empathy" },
    { id: "communication", label: "Communication" },
    { id: "steady-presence", label: "Steady presence" },
    { id: "mentor-energy", label: "Mentor energy" },
  ],

  fitSignals: [
    {
      id: "notice-dynamics",
      label: "You notice group dynamics quickly.",
      score: 94,
      explanation:
        "You can often tell who is engaged, left out, tense, confident, or quietly leading without anyone saying it out loud.",
    },
    {
      id: "curious-about-people",
      label: "You are genuinely curious about people.",
      score: 91,
      explanation:
        "You do not just react to behavior. You want to understand what is underneath it — motivation, fear, energy, pressure, or personality.",
    },
    {
      id: "help-groups-move",
      label: "You like helping a group work better.",
      score: 88,
      explanation:
        "You get satisfaction from making things smoother, more connected, more focused, or less chaotic for other people.",
    },
    {
      id: "influence-without-posturing",
      label: "You care about influence that feels real.",
      score: 86,
      explanation:
        "You are less interested in empty authority and more interested in trust, clarity, and what actually helps people move.",
    },
  ],

  branchPreviews: [
    {
      id: "psychology-human-development",
      slug: "psychology-human-development",
      title: "Psychology + Human Development",
      oneLiner: "Explore motivation, identity, emotion, growth, and behavior.",
      whyItCouldFit:
        "Strong if you like understanding what is going on inside people, not just around them.",
      energy: "people",
    },
    {
      id: "leadership-team-culture",
      slug: "leadership-team-culture",
      title: "Leadership + Team Culture",
      oneLiner: "Learn how groups build trust, momentum, and healthy standards.",
      whyItCouldFit:
        "Great if you are drawn to guiding teams, building culture, or helping groups function better.",
      energy: "communication",
    },
    {
      id: "coaching-mentorship",
      slug: "coaching-mentorship",
      title: "Coaching + Mentorship",
      oneLiner: "Help people improve through support, feedback, and structure.",
      whyItCouldFit:
        "Excellent if you like helping someone grow one step at a time.",
      energy: "people",
    },
    {
      id: "conflict-communication",
      slug: "conflict-communication",
      title: "Conflict + Communication",
      oneLiner: "Practice listening, de-escalation, boundaries, and hard conversations.",
      whyItCouldFit:
        "Powerful if you are interested in how clarity and communication change outcomes.",
      energy: "calm",
    },
  ],

  branches: [
    {
      id: "psychology-human-development",
      slug: "psychology-human-development",
      title: "Psychology + Human Development",
      summary:
        "This branch focuses on motivation, emotion, identity, habits, stress, social influence, and how people grow over time. It is less about diagnosing and more about understanding what shapes behavior.",
      whatYouActuallyExplore: [
        "Why people act differently under pressure, confidence, or belonging",
        "How motivation, identity, and environment shape behavior",
        "How people grow, struggle, adapt, and develop over time",
      ],
      skillsThatGrowHere: [
        "Observation",
        "Psychology vocabulary",
        "Pattern recognition",
        "Reflective thinking",
      ],
      starterProjects: [
        "Keep a behavior journal on what motivates you during a week",
        "Interview people about how they learn best",
        "Create a mini guide on habits, stress, or motivation for teens",
      ],
      atmosphere:
        "Curious, reflective, and deeply human. You start seeing more layers inside behavior.",
    },
    {
      id: "leadership-team-culture",
      slug: "leadership-team-culture",
      title: "Leadership + Team Culture",
      summary:
        "This branch is about what helps a group trust each other, communicate clearly, and move in the same direction. It focuses on standards, energy, clarity, roles, and the invisible things that make teams either work or fall apart.",
      whatYouActuallyExplore: [
        "How trust and culture are built inside teams",
        "Why some groups feel safe, sharp, and connected while others do not",
        "How leadership affects tone, focus, and accountability",
      ],
      skillsThatGrowHere: [
        "Leadership communication",
        "Culture building",
        "Group facilitation",
        "Decision clarity",
      ],
      starterProjects: [
        "Run a short group check-in for a club or team",
        "Design a simple values or norms sheet for a student group",
        "Observe what changes group energy in practice or class",
      ],
      atmosphere:
        "Energetic, relational, and practical. You learn that leadership is often quieter and more precise than people think.",
    },
    {
      id: "coaching-mentorship",
      slug: "coaching-mentorship",
      title: "Coaching + Mentorship",
      summary:
        "This branch centers on helping someone improve through feedback, encouragement, structure, and belief. It is strong for people who like development, trust, and one-on-one guidance.",
      whatYouActuallyExplore: [
        "How feedback lands differently depending on timing and tone",
        "How confidence grows through structure and support",
        "How coaching differs from controlling, rescuing, or lecturing",
      ],
      skillsThatGrowHere: [
        "Mentoring",
        "Feedback delivery",
        "Goal framing",
        "Supportive accountability",
      ],
      starterProjects: [
        "Help a younger student or teammate with one skill over two weeks",
        "Create a practice or study support plan for someone",
        "Reflect on what kinds of feedback make people better",
      ],
      atmosphere:
        "Human, encouraging, and growth-focused. You feel the effect of helping one person move forward.",
    },
    {
      id: "conflict-communication",
      slug: "conflict-communication",
      title: "Conflict + Communication",
      summary:
        "This branch focuses on listening, boundaries, miscommunication, tension, repair, and how difficult conversations can either fracture trust or strengthen it.",
      whatYouActuallyExplore: [
        "Why people misread each other and escalate",
        "How wording, timing, and listening change outcomes",
        "How to say hard things clearly without making everything worse",
      ],
      skillsThatGrowHere: [
        "Listening",
        "Boundary setting",
        "De-escalation",
        "Clear communication",
      ],
      starterProjects: [
        "Write two versions of the same difficult message and compare them",
        "Practice reflective listening in a real conversation",
        "Make a short guide for handling tension on teams or in clubs",
      ],
      atmosphere:
        "Calm, nuanced, and quietly powerful. You learn how much changes when communication gets cleaner.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way to test this path is not by reading about leadership for three hours. It is by observing people closely, helping one real person, or leading one small moment well.",
    actions: [
      {
        id: "observe-group-dynamics",
        title: "Observe one real group like a human systems lab",
        type: "experiment",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "This path gets clearer when you start noticing patterns in real people, not just ideas about people.",
        instructions: [
          "Pick a real setting: class, practice, work shift, club, or friend group.",
          "Notice who brings energy, who withdraws, who influences tone, and who gets ignored.",
          "Write down three patterns you saw without judging them.",
          "Ask yourself what changed the energy of the group.",
        ],
      },
      {
        id: "help-one-person-grow",
        title: "Help one person improve at one small thing",
        type: "project",
        effort: "medium",
        timeEstimate: "30–60 min",
        whyThisMatters:
          "Leadership and mentorship become real fast when you try to help one actual human being move forward.",
        instructions: [
          "Pick someone younger, newer, or less experienced in one area.",
          "Choose one tiny target: confidence, consistency, technique, organization, or communication.",
          "Give support that is specific, kind, and useful.",
          "Notice what actually helps versus what just sounds good.",
        ],
      },
      {
        id: "lead-a-small-check-in",
        title: "Lead a short check-in or reflection moment",
        type: "join",
        effort: "medium",
        timeEstimate: "10–20 min",
        whyThisMatters:
          "You learn a lot about leadership by helping a group pause, focus, and reconnect clearly.",
        instructions: [
          "Use a team, club, project group, or even a family conversation.",
          "Ask one simple question that gets people to answer honestly.",
          "Keep it brief and structured.",
          "Pay attention to what made people open up or stay quiet.",
        ],
      },
      {
        id: "communication-audit",
        title: "Rewrite one messy conversation into a cleaner one",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "A huge part of this path is learning how wording changes trust, clarity, and defensiveness.",
        instructions: [
          "Think of a recent conversation that went badly or felt unclear.",
          "Write what was said or what you wanted to say.",
          "Rewrite it in a way that is more direct, calm, and useful.",
          "Notice what changed in tone, clarity, and likely outcome.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "This path often feels less flashy than others at first, but more powerful over time. You begin to notice what shifts trust, what creates tension, what helps someone believe in themselves, and what kind of presence changes a room. The learning feels human, subtle, and very real.",
    moments: [
      {
        id: "reading-the-room",
        title: "You start reading the room more clearly",
        body:
          "You notice emotional weather, unspoken tension, and group dynamics before anyone names them directly.",
      },
      {
        id: "small-support-big-effect",
        title: "A small moment of support has a big effect",
        body:
          "You realize a well-timed word, question, or piece of feedback can change someone’s confidence more than you expected.",
      },
      {
        id: "influence-gets-cleaner",
        title: "Your influence feels less forced",
        body:
          "Instead of trying to sound impressive, you get better at being clear, steady, and actually helpful.",
      },
      {
        id: "you-see-the-hidden-layer",
        title: "You begin to see the hidden layer under behavior",
        body:
          "A reaction stops looking random. You start asking what pressure, fear, identity, or need might be underneath it.",
      },
    ],
  },

  growthPath: {
    title: "How people usually grow here",
    summary:
      "Most people do not begin by calling themselves leaders. They begin by noticing people well, then helping in small ways, then earning trust, then learning how to guide a group or support growth more intentionally.",
    stages: [
      {
        id: "observe",
        label: "Start by observing people well",
        timeframe: "First few weeks",
        summary:
          "You begin noticing patterns in emotion, communication, motivation, confidence, and group dynamics more consciously.",
        signalsOfProgress: [
          "You can describe what is happening in a group more clearly",
          "You notice patterns without rushing to judge them",
          "You become more aware of how tone changes outcomes",
        ],
      },
      {
        id: "support",
        label: "Move into small acts of support",
        timeframe: "Next 1–2 months",
        summary:
          "You begin helping one person or one group in small, practical ways — with structure, encouragement, clarity, or feedback.",
        signalsOfProgress: [
          "People respond well to your support",
          "You begin seeing what kind of help is actually useful",
          "You grow more confident in one-on-one guidance",
        ],
      },
      {
        id: "lead",
        label: "Practice real leadership in small settings",
        timeframe: "As trust grows",
        summary:
          "Now you start guiding moments, conversations, routines, or group energy more intentionally and with more presence.",
        signalsOfProgress: [
          "People listen because they trust you, not because you push",
          "You can create calmer, clearer group moments",
          "You think more about culture, not just tasks",
        ],
      },
      {
        id: "shape-culture",
        label: "Learn how to shape culture over time",
        timeframe: "With repeated practice",
        summary:
          "This is where you start understanding standards, belonging, accountability, and the deeper patterns that shape a team, club, or community.",
        signalsOfProgress: [
          "You notice what strengthens or weakens trust over time",
          "You care about what kind of environment you are helping create",
          "You can explain why some leadership approaches work better than others",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "This path grows through real human practice. Read a little, yes — but then observe, lead, mentor, facilitate, and pay attention to what happens.",
    actions: [
      {
        id: "start-observation-journal",
        title: "Start a simple people-and-groups journal",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "10 min after real situations",
        whyThisMatters:
          "Writing down what you notice sharpens your awareness and helps you move from vague impressions into real pattern recognition.",
        instructions: [
          "After a class, team practice, meeting, or social situation, write down what you noticed.",
          "Track things like confidence, tension, belonging, motivation, and tone.",
          "Do not gossip — stay observational and useful.",
          "Look for repeated patterns over time.",
        ],
      },
      {
        id: "mentor-someone-small",
        title: "Mentor one person in one narrow area",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Mentorship is one of the fastest ways to pressure-test whether this path feels natural and meaningful to you.",
        instructions: [
          "Pick one person you can support realistically.",
          "Choose one clear goal.",
          "Offer structure, encouragement, and honest useful feedback.",
          "Reflect on what helped most.",
        ],
      },
      {
        id: "lead-one-real-thing",
        title: "Lead one small real thing",
        type: "join",
        effort: "medium",
        timeEstimate: "30–60 min",
        whyThisMatters:
          "Leadership gets real when people are actually counting on you for clarity, tone, or direction.",
        instructions: [
          "Lead a check-in, warm-up, discussion, meeting segment, or student activity.",
          "Keep the purpose clear.",
          "Watch the energy before, during, and after.",
          "Adjust based on what actually happened.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "online-psych-leadership",
        title: "Good online places to explore people and leadership",
        description:
          "These are useful because they give you language and frameworks, but still connect back to real human situations.",
        items: [
          {
            id: "khan-psychology",
            title: "Khan Academy Psychology",
            mode: "virtual",
            provider: "Khan Academy",
            summary:
              "Accessible psychology content that helps you build basic language for behavior, emotion, cognition, and development.",
            whyItHelps:
              "Good for turning human curiosity into clearer understanding without making it feel overly academic at the start.",
            href: "https://www.khanacademy.org/test-prep/mcat/behavior",
            formatLabel: "Self-paced foundations",
          },
          {
            id: "coursera-leadership",
            title: "Beginner leadership and communication courses",
            mode: "virtual",
            provider: "Coursera and similar platforms",
            summary:
              "Intro-level courses on team communication, leadership basics, motivation, and collaboration.",
            whyItHelps:
              "Helpful when you want structure, vocabulary, and practice ideas you can test in real life.",
            formatLabel: "Structured online learning",
          },
          {
            id: "ted-communication-behavior",
            title: "Talks on behavior, motivation, and communication",
            mode: "virtual",
            provider: "TED and similar platforms",
            summary:
              "Short talks that can spark ideas about people, trust, decision-making, and leadership.",
            whyItHelps:
              "Useful for inspiration, especially when paired with real-world observation and practice.",
            href: "https://www.ted.com",
            formatLabel: "Short-form exploration",
          },
        ],
      },
      {
        id: "local-human-practice",
        title: "Local directions to explore near Marin / Bay Area",
        description:
          "This path gets much stronger when you are in real human environments where leadership, communication, and support matter.",
        items: [
          {
            id: "student-leadership",
            title: "Student leadership, peer support, or club leadership roles",
            mode: "local",
            provider: "Schools, clubs, teams, and youth organizations",
            summary:
              "Roles where you help lead meetings, organize people, support peers, or shape culture.",
            whyItHelps:
              "Real groups are the best lab for learning leadership and communication.",
            locationLabel: "Marin / North Bay",
            distanceLabel: "Local",
            formatLabel: "In-person practice",
          },
          {
            id: "coaching-assistant",
            title: "Youth coaching, camp assistant, or mentorship roles",
            mode: "local",
            provider: "Sports programs, camps, after-school programs, and community groups",
            summary:
              "Helping younger students or kids develop is a strong way to test coaching and mentorship energy.",
            whyItHelps:
              "You quickly learn what support, structure, and encouragement actually do.",
            locationLabel: "Marin County / Bay Area",
            distanceLabel: "Local to regional",
            formatLabel: "Hands-on people work",
          },
          {
            id: "community-volunteer",
            title: "Community volunteering in people-facing settings",
            mode: "local",
            provider: "Nonprofits, community centers, schools, and youth programs",
            summary:
              "Volunteer roles can put you in real environments where empathy, communication, and calm leadership matter.",
            whyItHelps:
              "This path becomes much clearer when your skills affect real people, not just hypothetical ones.",
            locationLabel: "Near 94901 / Marin",
            distanceLabel: "Local",
            formatLabel: "Service + real interaction",
          },
        ],
      },
      {
        id: "deeper-practice",
        title: "When you want to go a level deeper",
        description:
          "These are good once you know this path feels real and you want more structure, challenge, or responsibility.",
        items: [
          {
            id: "peer-counseling",
            title: "Peer counseling or peer mentoring programs",
            mode: "hybrid",
            provider: "Schools, youth orgs, and community programs",
            summary:
              "Programs that teach listening, support, and how to help peers thoughtfully.",
            whyItHelps:
              "A strong bridge between natural people skills and more intentional practice.",
            locationLabel: "Bay Area / school-based",
            distanceLabel: "Varies",
            formatLabel: "Training + practice",
          },
          {
            id: "psychology-clubs",
            title: "Psychology, debate, or leadership clubs",
            mode: "local",
            provider: "Schools and youth organizations",
            summary:
              "Clubs where you can explore behavior, communication, argument, leadership, and group process.",
            whyItHelps:
              "These spaces let you practice thinking and communicating in more intentional ways.",
            locationLabel: "Local schools / youth orgs",
            distanceLabel: "Local",
            formatLabel: "Group-based learning",
          },
          {
            id: "summer-youth-leadership",
            title: "Youth leadership and development programs",
            mode: "hybrid",
            provider: "Community colleges, nonprofits, youth orgs, and summer programs",
            summary:
              "Programs focused on facilitation, service, communication, and leadership growth.",
            whyItHelps:
              "Good when you want to turn instinct into more deliberate leadership skill.",
            locationLabel: "Bay Area / online options",
            distanceLabel: "Varies",
            formatLabel: "Seasonal deeper dive",
          },
        ],
      },
    ],
  },
};