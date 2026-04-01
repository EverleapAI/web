// apps/web/src/app/(app)/main/explore/work/_data/mock/physicalTherapistPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const PHYSICAL_THERAPIST_PATH: WorkPathContent = {
  id: "physical-therapist",
  slug: "physical-therapist",
  lane: "work",

  theme: {
    tone: "health-human",
    accent: { r: 94, g: 214, b: 160 },
    accentStrong: { r: 64, g: 180, b: 255 },
    glow: { r: 150, g: 240, b: 200 },
    surfaceLabel: "Human health",
  },

  card: {
    title: "Physical Therapist",
    hook: "Help people recover movement, strength, and confidence.",
    description:
      "A path for people who enjoy helping others heal, improve mobility, and regain physical strength.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Physical Therapist",
    hook:
      "You care about helping people move better and feel stronger in their bodies.",
    summary:
      "Physical therapists guide people through recovery - rebuilding strength, movement, and confidence after injury or physical challenges.",
    whyItPullsYouIn: [
      "You like helping people improve physically and mentally.",
      "You are curious how the body actually works.",
      "You want work where progress is visible and meaningful.",
    ],
  },

  traitChips: [
    { id: "empathy", label: "Empathy" },
    { id: "science-interest", label: "Science interest" },
    { id: "people-support", label: "People support" },
    { id: "patience", label: "Patience" },
  ],
fitSignals: [
  {
    id: "body-awareness",
    label: "Body awareness",
    score: 90,
    explanation:
      "You notice how people move, where they compensate, and what looks off or restricted.",
  },
  {
    id: "people-support",
    label: "People support",
    score: 88,
    explanation:
      "You get energy from helping people improve, especially when progress takes time.",
  },
  {
    id: "patience-progression",
    label: "Patience with progress",
    score: 86,
    explanation:
      "You can stay committed through slow, step-by-step improvement without needing instant results.",
  },
  {
    id: "hands-on-guidance",
    label: "Hands-on guidance",
    score: 85,
    explanation:
      "You are comfortable working directly with people to guide movement, strength, and recovery.",
  },
],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Hands-on guidance",
      note: "Direct work with people",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Sessions + progress",
      note: "Assess to guide to adjust",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Recovery progress",
      note: "Strength, mobility, confidence",
    },
  ],

  specialtyPreviews: [
    {
      id: "sports-therapy",
      slug: "sports-therapy",
      title: "Sports Physical Therapy",
      oneLiner: "Helps athletes recover and return to performance.",
      whyItCouldFit:
        "Strong if you are drawn to sports and performance.",
      energy: "active",
    },
    {
      id: "rehabilitation-therapy",
      slug: "rehabilitation-therapy",
      title: "Rehabilitation Therapy",
      oneLiner: "Helps patients recover from surgery, illness, or injury.",
      whyItCouldFit: "Strong if you care about long-term recovery.",
      energy: "human",
    },
  ],

  specialties: [
    {
      id: "sports-therapy",
      slug: "sports-therapy",
      title: "Sports Physical Therapy",
      summary:
        "This specialty is about getting athletes and active people back to movement, training, and performance after injury. You are working where recovery meets competition, confidence, and physical goals.",
      whatYouActuallyDo: [
        "Assess how someone moves, where they are compensating, and what is slowing recovery down.",
        "Guide rehab exercises that rebuild strength, mobility, balance, and confidence step by step.",
        "Help athletes return to practice or competition safely instead of just rushing them back too early.",
        "Work with coaches, trainers, and families so recovery fits the real demands of sport.",
      ],
      skillsThatGrowHere: [
        "Movement analysis",
        "Exercise progression",
        "Coaching under pressure",
        "Clear communication with driven people",
      ],
      starterProjects: [
        "Volunteer around sports teams, athletic training rooms, or adaptive athletics programs.",
        "Learn the basics of kinesiology, recovery, and common sports injuries.",
        "Observe how movement quality changes before and after fatigue, pain, or rehab work.",
      ],
      atmosphere:
        "Fast-moving, active, and goal-driven. The energy is often high because people want to get back to the version of themselves they know.",
    },
    {
      id: "rehabilitation-therapy",
      slug: "rehabilitation-therapy",
      title: "Rehabilitation Therapy",
      summary:
        "This specialty is about longer recovery arcs - after surgery, illness, injury, or life-changing physical setbacks. The work is slower, steadier, and often deeply human.",
      whatYouActuallyDo: [
        "Help patients rebuild movement after major injuries, surgeries, or health events.",
        "Break long-term recovery into smaller, manageable wins that people can actually stick with.",
        "Adapt exercises to the patient in front of you, not just the textbook version of recovery.",
        "Support people emotionally as well as physically when progress feels slow or frustrating.",
      ],
      skillsThatGrowHere: [
        "Patience under uncertainty",
        "Clinical observation",
        "Relationship-building",
        "Long-term progress planning",
      ],
      starterProjects: [
        "Volunteer in hospital, rehab, or community recovery environments.",
        "Learn anatomy and basic movement science so you can understand what recovery is asking of the body.",
        "Spend time noticing how people respond differently to pain, frustration, encouragement, and progress.",
      ],
      atmosphere:
        "Grounded, personal, and emotionally meaningful. You are often helping someone get everyday life back, not just performance.",
    },
  ],

  dayInLife: {
    title: "A day helping people move again",
    summary:
      "This work is hands-on, human, and visible. You are helping someone rebuild strength, movement, and confidence step by step.",

    moments: [
      {
        id: "morning-start",
        timeLabel: "9:00 AM",
        title: "Meet someone where they are",
        body:
          "Every session starts differently. Some people are improving, others are frustrated or in pain. You assess movement, but you are also reading mindset.",
      },
      {
        id: "first-session",
        timeLabel: "10:00 AM",
        title: "Guide the first movement",
        body:
          "You walk someone through exercises that feel small but matter. Even basic movement can be difficult. Your job is to guide, correct, and encourage.",
      },
      {
        id: "midday-progress",
        timeLabel: "11:45 AM",
        title: "Notice real progress",
        body:
          "A movement becomes smoother. Strength improves slightly. Sometimes it is subtle, but it is real. These moments build momentum.",
      },
      {
        id: "midday-challenge",
        timeLabel: "1:15 PM",
        title: "Push without breaking trust",
        body:
          "Recovery is uncomfortable. You need to push someone enough to improve, but not so much that they shut down. This balance is a core skill.",
      },
      {
        id: "afternoon-variety",
        timeLabel: "2:30 PM",
        title: "Every person is different",
        body:
          "No two patients are the same. Different injuries, different goals, different attitudes. You are constantly adapting your approach.",
      },
      {
        id: "visible-result",
        timeLabel: "4:00 PM",
        title: "See what changed",
        body:
          "At the end of a session, you can often see it. Better range, more confidence, less hesitation. Progress is physical and visible.",
      },
      {
        id: "long-term",
        timeLabel: "Ongoing",
        title: "Watch someone get their life back",
        body:
          "The real payoff happens over time. Someone who struggled to move starts walking, training, or living normally again. That is the impact of the work.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary: "This is a stable, in-demand healthcare path.",
    stages: [],
  },

  forecastV2: {
    outlookLabel: "Stable and growing - but highly committed",
    outlookSummary:
      "Physical therapy is a stable, in-demand healthcare path with strong long-term need. But entry requires significant education and commitment. The work is consistent and meaningful, but it is not casual - it demands patience, physical presence, and long-term investment.",

    metrics: [
      {
        id: "demand",
        label: "Demand",
        value: "High",
        tone: "positive",
        note: "Aging population and injury recovery drive steady need",
      },
      {
        id: "stability",
        label: "Stability",
        value: "Very high",
        tone: "positive",
        note: "Healthcare roles remain consistently needed",
      },
      {
        id: "education",
        label: "Education path",
        value: "Long",
        tone: "mixed",
        note: "Doctorate typically required",
      },
      {
        id: "physical",
        label: "Physical demands",
        value: "Real",
        tone: "mixed",
        note: "Hands-on work requires energy and presence",
      },
    ],

    salaryRange: {
      low: "$65K",
      median: "$97K",
      high: "$120K+",
    },

    industry: {
      sourceLabel: "Bureau of Labor Statistics",
      sourceUrl: "https://www.bls.gov/ooh/healthcare/physical-therapists.htm",
      growthPercent: "15%",
      annualOpenings: "24,200",
      medianPay: "$97,720",
      educationTypical: "Doctoral degree",
    },

    whatIsGrowing: [
      "Demand from aging populations",
      "Sports and performance recovery",
      "Preventative and long-term mobility care",
    ],

    whatIsUnderPressure: [
      "High education requirements and time investment",
      "Workload in high-demand clinical environments",
      "People entering without understanding the commitment",
    ],

    aiImpact: {
      level: "low",
      summary:
        "AI can assist with data, tracking, and planning, but it cannot replace hands-on therapy, physical guidance, or human interaction.",
      helpsWith: [
        "Tracking progress",
        "Program planning support",
        "Data and recovery insights",
      ],
      putsPressureOn: ["Basic program templating"],
      humansStillOwn: [
        "Hands-on physical guidance",
        "Reading patient movement and response",
        "Building trust and motivation",
      ],
    },

    whyThisCouldFeelExciting: [
      "You directly help people regain strength and independence",
      "Progress is visible and meaningful",
      "Strong long-term career stability",
    ],

    whyThisCouldFeelRisky: [
      "Requires long education and commitment",
      "Work can be physically and emotionally demanding",
      "Less flexibility early in the career path",
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary: "Start by getting close to real recovery and movement environments.",
    actions: [],
    opportunityGroups: [],
  },

  nextStepsV2: {
    heroTitle:
      "The fastest way to understand physical therapy is to get close to movement and recovery",
    heroSummary:
      "This path becomes real when you watch people rebuild strength, balance, range, and confidence in real environments. Do not just read about the body. Get near clinics, rehab settings, adaptive sports, exercise science, and movement coaching so you can see what recovery actually asks of both patient and therapist.",
    heroBadge: "See recovery up close",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Get around real recovery environments",
        description:
          "These are strong local entry points if you want to see how rehab, movement support, adaptive athletics, and healthcare teamwork actually work in the real world.",
        mode: "local",
        items: [
          {
            id: "marinhealth-volunteer",
            title: "MarinHealth Volunteer Services",
            href: "https://www.mymarinhealth.org/about-us/volunteer-services/volunteer-positions-programs/",
            note:
              "A real local hospital entry point where you can get exposure to patient care environments and start seeing how recovery settings actually function.",
            badge: "Hospital exposure",
            mode: "local",
          },
          {
            id: "kaiser-san-rafael-volunteer",
            title: "Kaiser San Rafael Volunteer Services",
            href: "https://healthy.kaiserpermanente.org/northern-california/facilities/San-Rafael-Medical-Center-100327/departments/volunteer-services-dlp-106380",
            note:
              "A strong way to get close to a real clinical environment in your area and understand the pace, structure, and teamwork inside healthcare.",
            badge: "Clinical setting",
            mode: "local",
          },
          {
            id: "keen-san-francisco",
            title: "KEEN San Francisco",
            href: "https://www.keensanfrancisco.org/",
            note:
              "Volunteer with athletes with disabilities in movement-based activities. This is a strong way to experience encouragement, adaptation, and physical progress firsthand.",
            badge: "Adaptive sports",
            mode: "local",
          },
          {
            id: "borp-adaptive-sports",
            title: "BORP Adaptive Sports and Recreation",
            href: "https://www.borp.org/",
            note:
              "A Bay Area adaptive sports organization where you can see the intersection of movement, disability, confidence, and long-term physical support.",
            badge: "Bay Area movement",
            mode: "local",
          },
          {
            id: "college-of-marin-kinesiology",
            title: "College of Marin Kinesiology, Athletics, and Dance",
            href: "https://www1.marin.edu/departments/kinesiology-athletics-and-dance",
            note:
              "A nearby academic entry point if you want to start building real movement-science vocabulary and get closer to exercise, anatomy, and body mechanics.",
            badge: "Movement science",
            mode: "local",
          },
          {
            id: "special-olympics-northern-california",
            title: "Special Olympics Northern California Volunteer",
            href: "https://www.sonc.org/get-involved/volunteer/",
            note:
              "A meaningful way to support athletes, be around coached movement, and understand how physical progress connects to confidence and independence.",
            badge: "Meaningful volunteer work",
            mode: "local",
          },
        ],
      },
      {
        id: "remote",
        eyebrow: "Online",
        title: "Build body and movement knowledge now",
        description:
          "These are practical online starting points for learning anatomy, movement, exercise basics, and the language of recovery before you ever step into a PT clinic.",
        mode: "remote",
        items: [
          {
            id: "khan-health-medicine",
            title: "Khan Academy - Health and Medicine",
            href: "https://www.khanacademy.org/science/health-and-medicine",
            note:
              "A clear, structured foundation for anatomy, physiology, and core health concepts. Great if you want to understand the body without getting overwhelmed fast.",
            badge: "Free foundation",
            mode: "remote",
          },
          {
            id: "coursera-anatomy",
            title: "Coursera Anatomy Courses",
            href: "https://www.coursera.org/courses?query=anatomy",
            note:
              "A useful way to start learning the structure of the human body in a more serious, college-style format that connects well to future PT study.",
            badge: "Deepen anatomy",
            mode: "remote",
          },
          {
            id: "coursera-physical-therapy",
            title: "Coursera Physical Therapy Courses",
            href: "https://www.coursera.org/courses?query=physical%20therapy",
            note:
              "A direct way to explore rehab, mobility, and recovery-related topics and decide whether the actual content of the field pulls you in.",
            badge: "Explore the field",
            mode: "remote",
          },
          {
            id: "ace-fitness",
            title: "ACE Fitness",
            href: "https://www.acefitness.org/",
            note:
              "A strong resource for understanding exercise science, movement quality, and safe training principles that connect well to rehab thinking.",
            badge: "Exercise science",
            mode: "remote",
          },
          {
            id: "medlineplus-muscles-joints",
            title: "MedlinePlus - Muscles, Bones, and Joints",
            href: "https://medlineplus.gov/musclesbonesandjoints.html",
            note:
              "A trustworthy health source for learning the basics of injury, pain, joints, muscles, and movement-related conditions without the noise of random internet advice.",
            badge: "Trusted health info",
            mode: "remote",
          },
          {
            id: "apta-be-a-pt",
            title: "APTA - Be A PT",
            href: "https://www.apta.org/your-career/careers-in-physical-therapy/be-a-pt",
            note:
              "A direct look at what the profession actually requires, including the education path, roles, and long-term reality of becoming a physical therapist.",
            badge: "Career reality check",
            mode: "remote",
          },
        ],
      },
    ],
  },
};