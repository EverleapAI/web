import type { WorkPathContent } from "../workPathSchema";

export const FILM_VIDEO_PRODUCER_PATH: WorkPathContent = {
  id: "film-video-producer",
  slug: "film-video-producer",
  lane: "work",

  theme: {
    tone: "cinematic-pulse",
    accent: { r: 255, g: 166, b: 92 },
    accentStrong: { r: 255, g: 116, b: 92 },
    glow: { r: 255, g: 202, b: 120 },
    surfaceLabel: "Cinematic build",
  },

  card: {
    title: "Film & Video Producer",
    hook: "Shape stories, shoots, timing, people, and the final emotional experience.",
    description:
      "A path for people who are drawn to storytelling, visual rhythm, coordination, and making creative work actually happen. Film and video producing blends taste, planning, communication, momentum, and problem-solving into something people can watch, feel, and remember.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Film & Video Producer",
    hook:
      "You are not only noticing the finished video. You are noticing the pacing, the emotion, the setup, the choices behind it, and how all the moving parts had to come together to make it land.",
    summary:
      "Film and video producers help bring visual stories into reality. Depending on the project, that can mean helping shape the concept, organizing the shoot, coordinating people, solving production problems, managing timelines, protecting the creative vision, and making sure the whole thing actually gets finished. At its best, this is creative leadership with real-world momentum behind it.",
    whyItPullsYouIn: [
      "You like the idea of turning a creative vision into something real instead of leaving it as only an idea.",
      "You notice that good visual storytelling depends on timing, feeling, detail, and execution — not just talent.",
      "You are drawn to work that mixes creativity, coordination, pressure, and visible final output.",
    ],
  },

  traitChips: [
    { id: "story-instinct", label: "Story instinct" },
    { id: "production-energy", label: "Production energy" },
    { id: "people-coordination", label: "People coordination" },
    { id: "taste-and-timing", label: "Taste + timing" },
  ],

  fitSignals: [
    {
      id: "creative-and-logistical",
      label: "Creative + logistical",
      score: 90,
      explanation:
        "This path fits people who do not want creativity to stay vague. They want to help shape the vision and also make the real-world process move.",
    },
    {
      id: "pressure-and-adaptability",
      label: "Pressure adaptability",
      score: 87,
      explanation:
        "A strong signal here is being able to stay useful when plans shift, timing gets tight, or the production day becomes messy.",
    },
    {
      id: "story-judgment",
      label: "Story judgment",
      score: 88,
      explanation:
        "This path rewards people who can feel when a moment is dragging, landing, confusing, emotional, or visually stronger than what came before.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Creative direction + coordination",
      note: "Vision stays strongest when execution stays moving",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Prep + shoots + problem-solving",
      note: "Planning, communication, set energy, follow-through",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Videos, shoots, story-driven projects",
      note: "Content, scenes, productions, edits, campaigns",
    },
  ],

  specialtyPreviews: [
    {
      id: "content-producer",
      slug: "content-producer",
      title: "Content Producer",
      oneLiner:
        "Helps plan, organize, and deliver short-form or brand-driven video projects from idea to release.",
      whyItCouldFit:
        "Great for someone who likes fast-moving creative work and wants storytelling to connect with real audiences quickly.",
      energy: "craft",
    },
    {
      id: "field-producer",
      slug: "field-producer",
      title: "Field Producer",
      oneLiner:
        "Coordinates people, logistics, interviews, locations, and on-the-ground decisions during production.",
      whyItCouldFit:
        "Great for someone who stays sharp under pressure and likes being in the middle of action, people, and moving parts.",
      energy: "systems",
    },
    {
      id: "creative-producer",
      slug: "creative-producer",
      title: "Creative Producer",
      oneLiner:
        "Protects the concept, pacing, and overall vision while helping the team turn it into something watchable and strong.",
      whyItCouldFit:
        "Great for someone who has taste, emotional judgment, and wants to guide the story without needing to be the only person making it.",
      energy: "high-creative",
    },
  ],

  specialties: [
    {
      id: "content-producer",
      slug: "content-producer",
      title: "Content Producer",
      summary:
        "Content producers work on videos built for audiences, brands, platforms, events, or digital channels. The pace is often faster, and the job is to help creative ideas become real and publishable.",
      whatYouActuallyDo: [
        "Help plan shoots, schedules, locations, and creative goals.",
        "Coordinate with editors, shooters, talent, or clients to keep the project moving.",
        "Make sure the final piece fits the platform, audience, and intended feeling.",
      ],
      skillsThatGrowHere: [
        "Creative planning",
        "Audience awareness",
        "Production coordination",
        "Execution under deadlines",
      ],
      starterProjects: [
        "Plan and shoot a short profile video on someone interesting in your community.",
        "Create a mini video campaign for a school event, club, or local business.",
        "Take a simple concept and produce three versions for different platforms.",
      ],
      atmosphere:
        "Fast, visible, and practical — strong for someone who wants to make things that actually get seen.",
    },
    {
      id: "field-producer",
      slug: "field-producer",
      title: "Field Producer",
      summary:
        "Field producers help make production happen in the real world. They manage moving parts on location and help protect both the schedule and the usable footage.",
      whatYouActuallyDo: [
        "Coordinate interviews, location details, crew timing, and shoot flow.",
        "Solve unexpected problems quickly without freezing the production.",
        "Keep communication clear between creative goals and what can actually happen on set.",
      ],
      skillsThatGrowHere: [
        "Calm under pressure",
        "On-the-ground leadership",
        "Logistics thinking",
        "Fast decision-making",
      ],
      starterProjects: [
        "Run a multi-location school or sports video shoot with a clear schedule.",
        "Produce a short documentary-style video that depends on real interviews and timing.",
        "Plan a one-day shoot where every hour has a purpose and backup plan.",
      ],
      atmosphere:
        "Energetic, people-heavy, and unpredictable in a way that can be thrilling if you like motion and real-world complexity.",
    },
    {
      id: "creative-producer",
      slug: "creative-producer",
      title: "Creative Producer",
      summary:
        "Creative producers help guide the concept and emotional direction of a project while also keeping the team aligned enough to actually deliver it.",
      whatYouActuallyDo: [
        "Shape ideas, references, tone, and the intended emotional effect of the piece.",
        "Help directors, editors, and collaborators stay aligned around what matters most.",
        "Protect the quality and identity of the project when compromises start showing up.",
      ],
      skillsThatGrowHere: [
        "Taste",
        "Narrative judgment",
        "Creative leadership",
        "Vision alignment",
      ],
      starterProjects: [
        "Build a moodboard and production plan for a short branded or story-driven video.",
        "Produce a short scene where lighting, performance, and pacing all support one feeling.",
        "Take an ordinary event and turn it into a mini cinematic recap with a strong point of view.",
      ],
      atmosphere:
        "More vision-driven than people expect — strong if you care about feeling, style, and whether the final piece actually lands.",
    },
  ],

  dayInLife: {
    title: "A day in the life",
    summary:
      "The work can swing between planning, coordination, creative decisions, and last-minute problem-solving. It is less about one perfect moment of inspiration and more about helping the whole project keep becoming real.",
    moments: [
      {
        id: "morning-prep",
        timeLabel: "8:30 AM",
        title: "Review the plan and what could go wrong",
        body:
          "You check the schedule, locations, people, gear, and creative priorities so the day starts with clarity instead of chaos.",
      },
      {
        id: "midday-production",
        timeLabel: "11:00 AM",
        title: "Keep the shoot moving",
        body:
          "You help solve timing issues, communicate between people, and protect the most important scenes, interviews, or moments while the day is unfolding fast.",
      },
      {
        id: "afternoon-adjust",
        timeLabel: "2:30 PM",
        title: "Adapt when reality changes the plan",
        body:
          "A producer often has to pivot without losing the thread — weather changes, people run late, something looks wrong, or the story needs a better angle.",
      },
      {
        id: "late-wrap",
        timeLabel: "5:30 PM",
        title: "Wrap, review, and prepare the next step",
        body:
          "You make sure the work is usable, the next stage is clear, and the production does not lose momentum once the camera stops rolling.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "This path often starts with small shoots, school projects, creative collaborations, and self-made work. Momentum grows when you can show that you do not just like content — you know how to shape and deliver it.",
    stages: [
      {
        id: "stage-1",
        label: "Early signal",
        timeframe: "Now → 2 months",
        summary:
          "You start making small visual projects more intentionally and noticing the difference between having an idea and actually producing it.",
        signalsOfProgress: [
          "You begin planning your shoots instead of improvising everything.",
          "You notice pacing, framing, and emotional rhythm more actively.",
          "You start finishing small projects instead of leaving them half-formed.",
        ],
      },
      {
        id: "stage-2",
        label: "Real traction",
        timeframe: "2 → 6 months",
        summary:
          "You build a body of work: short videos, recaps, profiles, mini-docs, social edits, or concept-driven pieces that show your judgment and follow-through.",
        signalsOfProgress: [
          "Your projects feel more intentional and less random.",
          "You can explain the choices behind the final piece.",
          "You get better at handling people, timing, and creative pressure together.",
        ],
      },
      {
        id: "stage-3",
        label: "Deeper commitment",
        timeframe: "6+ months",
        summary:
          "You begin seeing whether you are strongest in content, on-location production, creative producing, editing leadership, or another branch of the work.",
        signalsOfProgress: [
          "You know which kind of production environment gives you energy.",
          "Your pieces start showing more polish and clearer emotional control.",
          "You can lead a project from concept through execution with more confidence.",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The best first move is usually to produce something small with real intention. You learn fast when a story has to become an actual finished piece.",

    actions: [
      {
        id: "film-video-producer-next-1",
        title: "Produce one short video with a clear feeling",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "30–45 min",
        whyThisMatters:
          "Producing starts getting real when you stop only capturing moments and start shaping how a viewer is supposed to feel.",
        instructions: [
          "Choose one simple subject: a person, place, event, or routine.",
          "Decide the feeling first — tense, warm, fast, reflective, playful.",
          "Shoot and assemble only what supports that feeling.",
        ],
      },
      {
        id: "film-video-producer-next-2",
        title: "Run a mini shoot with an actual plan",
        type: "project",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "The producer instinct grows when you have to coordinate time, sequence, and usable output instead of just filming whatever happens.",
        instructions: [
          "Create a short shot list, a timeline, and one backup plan.",
          "Film with a beginning, middle, and end in mind.",
          "Afterward, note what planning helped and what you would tighten next time.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "near-you",
        title: "Near you",
        description:
          "Places around Marin and the Bay Area where video, media, and production start to feel like a real working world instead of just content on a screen.",
        items: [
          {
            id: "marin-library-the-lab",
            title: "Use The Lab for creative production experiments",
            mode: "local",
            provider: "Marin County Free Library",
            locationLabel: "Marin",
            distanceLabel: "Free local maker space",
            summary:
              "A flexible creative environment where media projects, digital experimentation, and self-started builds can begin without huge overhead.",
            whyItHelps:
              "Strong when you need a place to stop waiting and actually make something.",
          },
          {
            id: "sfpl-the-mix-media",
            title: "Explore teen media-making at The Mix",
            mode: "local",
            provider: "San Francisco Public Library",
            locationLabel: "San Francisco",
            distanceLabel: "Teen-focused day trip",
            summary:
              "A teen-centered creative space where storytelling, media, and hands-on making can feel more approachable and real.",
            whyItHelps:
              "Useful if you want a low-pressure place to make visual work while building confidence.",
          },
          {
            id: "bay-area-youth-film",
            title: "Look for a Bay Area youth film workshop",
            mode: "local",
            provider: "Regional youth media programs",
            locationLabel: "Bay Area",
            distanceLabel: "Hands-on creative learning",
            summary:
              "Short workshops and youth media programs can give you structure, critique, and collaborators instead of trying to learn every role alone.",
            whyItHelps:
              "Film and video work gets better much faster when other people are involved.",
          },
          {
            id: "community-event-recap",
            title: "Produce a recap video for a real local event",
            mode: "local",
            provider: "Community or school events",
            locationLabel: "Marin / Bay Area",
            distanceLabel: "Real-world practice",
            summary:
              "A real event gives you pressure, timing, people, and a usable final goal — which is exactly where producer instincts start getting sharper.",
            whyItHelps:
              "You learn more from one real production than from a lot of vague planning.",
          },
        ],
      },

      {
        id: "online-now",
        title: "Online",
        description:
          "Places you can start now if you want your interest in film and video to become more intentional and more real.",
        items: [
          {
            id: "skillshare-video-storytelling",
            title: "Try a short storytelling or editing class",
            mode: "virtual",
            provider: "Skillshare",
            formatLabel: "Creative classes",
            summary:
              "Short classes on editing, production, visual storytelling, and concept development that can help you make stronger choices faster.",
            whyItHelps:
              "Good when you want quick structure and creative momentum without overcomplicating the tools.",
            href: "https://www.skillshare.com",
          },
          {
            id: "adobe-creative-cloud-tutorials",
            title: "Practice real edits with Adobe tutorials",
            mode: "virtual",
            provider: "Adobe",
            formatLabel: "Tool tutorials",
            summary:
              "Guided tutorials for Premiere Pro and related tools that help you move from raw footage to intentional pacing and polish.",
            whyItHelps:
              "Useful when you want your ideas to look more finished and watchable.",
            href: "https://helpx.adobe.com/creative-cloud/tutorials-explore.html",
          },
          {
            id: "youtube-film-breakdowns",
            title: "Study scene breakdowns and production analysis",
            mode: "virtual",
            provider: "YouTube creators",
            formatLabel: "Free analysis",
            summary:
              "Film breakdown channels can help you notice pacing, shot purpose, emotional rhythm, and production choices more actively.",
            whyItHelps:
              "This is strong when you want your taste to become more precise, not just bigger.",
            href: "https://www.youtube.com",
          },
          {
            id: "vimeo-staff-picks",
            title: "Watch strong short-form work on Vimeo",
            mode: "virtual",
            provider: "Vimeo",
            formatLabel: "Creative reference library",
            summary:
              "A strong place to study short films, branded storytelling, documentaries, and visual point of view at a high level.",
            whyItHelps:
              "Good producers build taste by watching with attention, not just for entertainment.",
            href: "https://vimeo.com",
          },
        ],
      },
    ],
  },
};