/* =============================================================================
   Skills taxonomy (O*NET backbone + CASEL/SEL lens → teen-friendly Everleap labels)
   - Closed vocabulary so the AI doesn't invent skills
   - Deterministic scoring from existing user signals + word cloud + receipts
   - Designed to pair with Explore later (O*NET-ish grouping, not job-y copy)
   ============================================================================= */

export type SkillId =
  // Self skills (self-management)
  | "self_regulation"
  | "focus"
  | "follow_through"
  | "time_management"
  | "planning"
  | "stress_management"
  | "resilience"
  | "growth_mindset"
  | "self_awareness"
  | "confidence"
  // People skills (relationship skills)
  | "communication"
  | "active_listening"
  | "empathy"
  | "collaboration"
  | "leadership"
  | "conflict_repair"
  | "boundaries"
  | "asking_for_help"
  | "coaching"
  // Thinking skills (thinking + learning)
  | "critical_thinking"
  | "problem_solving"
  | "systems_thinking"
  | "creativity"
  | "decision_making"
  | "learning_how_to_learn"
  | "curiosity"
  | "research"
  // Making skills (create + ship)
  | "writing"
  | "storytelling"
  | "public_speaking"
  | "design_sense"
  | "building"
  | "iteration"
  | "organization"
  | "initiative"
  | "adaptability";

export type SkillDomainId = "self" | "people" | "thinking" | "making";

// Everleap signals used across Insights (kept aligned with StrengthsTab local types)
export type SignalId = "action" | "people" | "curiosity" | "clarity";

export type SignalLike = {
  id: SignalId;
  strength: number; // 0..1
  why?: string;
  examples?: string[];
};

export type WordCloudItemLike = {
  term: string;
  weight: number; // 0..1-ish
};

export type SkillDef = {
  id: SkillId;

  // Where it lives (helps UI grouping)
  domain: SkillDomainId;

  // Teen-friendly
  label: string;
  oneLine: string;

  // Conversational / agentic building blocks
  whenFed: string;
  whenStarved: string;
  upside: string;
  watchout: string;

  // Bridges to your existing signal model
  signalHints: SignalId[];

  // Deterministic classification support (small, stable)
  keywords: string[];

  // Optional: reference anchor (non-exhaustive)
  sourceHint?: "CASEL" | "O*NET" | "Hybrid";
};

export type SkillHit = {
  def: SkillDef;
  score: number; // 0..1
  receipts: string[]; // short evidence strings
};

export type SkillProfile = {
  top6: SkillHit[];
  top: SkillHit | null;

  domainBridge: Record<SkillDomainId, SkillId[]>;

  introLine: string;
  proofLine: string;
  watchoutLine: string;
};

/* =============================================================================
   Data: closed vocabulary (36-ish)
   ============================================================================= */

export const SKILLS: ReadonlyArray<SkillDef> = [
  /* ---------------------------------------------
     SELF (self-management)
     --------------------------------------------- */
  {
    id: "self_regulation",
    domain: "self",
    label: "Self-Control",
    oneLine: "You can steer yourself when it matters.",
    whenFed: "when you have routines, a real reason, and a clear next rep.",
    whenStarved: "when everything is chaotic and you’re running on vibes only.",
    upside: "Consistency turns into confidence over time.",
    watchout: "Too much control can become rigidity or self-pressure.",
    signalHints: ["action", "clarity"],
    keywords: ["discipline", "self control", "control myself", "routine", "habit", "consistent", "willpower", "stick to it"],
    sourceHint: "Hybrid",
  },
  {
    id: "focus",
    domain: "self",
    label: "Focus",
    oneLine: "You can lock in and ignore noise.",
    whenFed: "when your environment is clean and the goal is specific.",
    whenStarved: "when you’re multitasking, distracted, or the task is vague.",
    upside: "You make fast progress because your attention is real.",
    watchout: "Over-focusing can turn into tunnel vision or burnout.",
    signalHints: ["action", "clarity"],
    keywords: ["focus", "locked in", "concentrate", "deep work", "distraction", "attention", "zone", "flow"],
    sourceHint: "O*NET",
  },
  {
    id: "follow_through",
    domain: "self",
    label: "Follow-Through",
    oneLine: "You finish what you start.",
    whenFed: "when deadlines are real and the work matters to you.",
    whenStarved: "when tasks feel pointless or there’s no ownership.",
    upside: "People trust you because you close loops.",
    watchout: "You can take on too much and quietly drown.",
    signalHints: ["action"],
    keywords: ["finish", "follow through", "complete", "deliver", "done", "ship", "close it", "commit"],
    sourceHint: "Hybrid",
  },
  {
    id: "time_management",
    domain: "self",
    label: "Time Control",
    oneLine: "You can protect time like it’s a resource (because it is).",
    whenFed: "when you plan your week and keep promises to yourself.",
    whenStarved: "when your schedule is reactive and everyone else owns your time.",
    upside: "You get more done with less panic.",
    watchout: "Over-scheduling can kill spontaneity and joy.",
    signalHints: ["clarity", "action"],
    keywords: ["time", "schedule", "calendar", "deadline", "priorities", "plan my week", "late", "on time"],
    sourceHint: "O*NET",
  },
  {
    id: "planning",
    domain: "self",
    label: "Planning",
    oneLine: "You can build a path instead of hoping one appears.",
    whenFed: "when you can map steps and see progress.",
    whenStarved: "when things are ambiguous and nobody defines a plan.",
    upside: "You reduce chaos and increase your odds.",
    watchout: "Planning can become protection from starting.",
    signalHints: ["clarity"],
    keywords: ["plan", "steps", "roadmap", "strategy", "prep", "organize", "map it out", "what's next"],
    sourceHint: "O*NET",
  },
  {
    id: "stress_management",
    domain: "self",
    label: "Stress Control",
    oneLine: "You can calm your system and think again.",
    whenFed: "when you have recovery habits and can name what you feel.",
    whenStarved: "when pressure piles up with no release valve.",
    upside: "You make better decisions under stress.",
    watchout: "You can cope by going numb instead of dealing.",
    signalHints: ["clarity", "action"],
    keywords: ["stress", "anxiety", "overwhelmed", "calm", "breathe", "reset", "pressure", "nerves"],
    sourceHint: "Hybrid",
  },
  {
    id: "resilience",
    domain: "self",
    label: "Bounce-Back",
    oneLine: "You recover and keep going.",
    whenFed: "when setbacks are treated like data, not identity.",
    whenStarved: "when mistakes feel like shame and everything feels final.",
    upside: "You get stronger because you don’t quit.",
    watchout: "You can pretend you’re fine when you’re not.",
    signalHints: ["action", "clarity"],
    keywords: ["resilient", "bounce back", "recover", "setback", "keep going", "reset", "tough", "handle it"],
    sourceHint: "Hybrid",
  },
  {
    id: "growth_mindset",
    domain: "self",
    label: "Growth Mindset",
    oneLine: "You treat ability as trainable.",
    whenFed: "when effort is respected and practice is real.",
    whenStarved: "when people label you and expect you to stay the same.",
    upside: "You improve faster because you keep learning.",
    watchout: "You can blame yourself for normal learning curves.",
    signalHints: ["curiosity", "action"],
    keywords: ["improve", "practice", "train", "get better", "learn from", "feedback", "coach", "growth"],
    sourceHint: "Hybrid",
  },
  {
    id: "self_awareness",
    domain: "self",
    label: "Self-Awareness",
    oneLine: "You notice your patterns (before they run you).",
    whenFed: "when you reflect and tell the truth to yourself.",
    whenStarved: "when life is nonstop and you never pause.",
    upside: "You can adjust fast and choose intentionally.",
    watchout: "Too much self-analysis can turn into self-judgment.",
    signalHints: ["clarity", "curiosity"],
    keywords: ["reflect", "self aware", "pattern", "notice", "why I do", "trigger", "I realize", "I tend to"],
    sourceHint: "CASEL",
  },
  {
    id: "confidence",
    domain: "self",
    label: "Confidence",
    oneLine: "You trust yourself enough to take real shots.",
    whenFed: "when you collect reps and honest wins.",
    whenStarved: "when you only measure yourself by outcomes or approval.",
    upside: "You act sooner and learn faster.",
    watchout: "Fake confidence can be armor that blocks learning.",
    signalHints: ["action"],
    keywords: ["confident", "believe in", "I can", "take the shot", "try out", "put myself", "fear of"],
    sourceHint: "Hybrid",
  },

  /* ---------------------------------------------
     PEOPLE (relationship skills)
     --------------------------------------------- */
  {
    id: "communication",
    domain: "people",
    label: "Communication",
    oneLine: "You can say what you mean in a way people can hear.",
    whenFed: "when you feel safe to be direct and real.",
    whenStarved: "when everyone hints, avoids, or plays status games.",
    upside: "You prevent messes and build trust.",
    watchout: "If you go too blunt, people stop listening.",
    signalHints: ["people", "clarity"],
    keywords: ["communicate", "say it", "tell them", "explain", "clear", "direct", "message", "text"],
    sourceHint: "Hybrid",
  },
  {
    id: "active_listening",
    domain: "people",
    label: "Real Listening",
    oneLine: "You can hear what’s underneath the words.",
    whenFed: "when conversations aren’t rushed and you can ask follow-ups.",
    whenStarved: "when people talk to win, not to understand.",
    upside: "People feel seen — and things resolve faster.",
    watchout: "You can absorb everyone else’s emotions.",
    signalHints: ["people"],
    keywords: ["listen", "listening", "hear", "understand", "ask questions", "follow up", "what do you mean", "pay attention"],
    sourceHint: "CASEL",
  },
  {
    id: "empathy",
    domain: "people",
    label: "Empathy",
    oneLine: "You can feel people without losing yourself.",
    whenFed: "when you have space and boundaries.",
    whenStarved: "when you’re surrounded by constant drama or pressure.",
    upside: "You build connection and trust quickly.",
    watchout: "Over-empathy can turn into over-carrying.",
    signalHints: ["people"],
    keywords: ["empathy", "feel", "care", "they felt", "support", "understand them", "compassion", "sensitive"],
    sourceHint: "CASEL",
  },
  {
    id: "collaboration",
    domain: "people",
    label: "Collaboration",
    oneLine: "You can build with other people instead of fighting for control.",
    whenFed: "when roles are clear and the goal is shared.",
    whenStarved: "when it’s messy, flaky, or competitive in the wrong way.",
    upside: "You move faster because you don’t do everything alone.",
    watchout: "You can compromise too much and lose your voice.",
    signalHints: ["people", "action"],
    keywords: ["team", "together", "collab", "group", "partner", "we", "project", "coordinate"],
    sourceHint: "O*NET",
  },
  {
    id: "leadership",
    domain: "people",
    label: "Leadership",
    oneLine: "You can set direction and raise the standard.",
    whenFed: "when you’re trusted with real responsibility.",
    whenStarved: "when you’re forced to follow nonsense or chaos.",
    upside: "You create momentum for groups.",
    watchout: "You can become the default adult and burn out.",
    signalHints: ["people", "action"],
    keywords: ["lead", "captain", "in charge", "organize", "responsible", "direction", "standard", "mentor"],
    sourceHint: "O*NET",
  },
  {
    id: "conflict_repair",
    domain: "people",
    label: "Conflict Repair",
    oneLine: "You can clean up tension instead of letting it rot.",
    whenFed: "when honesty is safe and repair is real.",
    whenStarved: "when people do drama, silence, or passive aggression.",
    upside: "Relationships stay clean and teams stay functional.",
    watchout: "You can become the fixer for everyone.",
    signalHints: ["people", "clarity"],
    keywords: ["conflict", "argument", "fight", "resolve", "talk it out", "apologize", "repair", "misunderstanding"],
    sourceHint: "CASEL",
  },
  {
    id: "boundaries",
    domain: "people",
    label: "Boundaries",
    oneLine: "You can be kind without being used.",
    whenFed: "when your ‘no’ is respected and you don’t have to over-explain.",
    whenStarved: "when people push, guilt, or expect you to be available 24/7.",
    upside: "Your relationships get healthier and less draining.",
    watchout: "Hard boundaries can become walls if you’re hurt.",
    signalHints: ["clarity", "people"],
    keywords: ["boundary", "boundaries", "say no", "too much", "protect my", "space", "respect", "limit"],
    sourceHint: "CASEL",
  },
  {
    id: "asking_for_help",
    domain: "people",
    label: "Asking for Help",
    oneLine: "You can recruit support instead of soloing everything.",
    whenFed: "when help is normal and not treated like weakness.",
    whenStarved: "when you feel like you have to look perfect.",
    upside: "You learn faster and avoid preventable stress.",
    watchout: "If you never ask, you get isolated under pressure.",
    signalHints: ["people", "clarity"],
    keywords: ["ask for help", "help me", "can you", "mentor", "coach", "support", "advice", "feedback"],
    sourceHint: "CASEL",
  },
  {
    id: "coaching",
    domain: "people",
    label: "Coaching Others",
    oneLine: "You can help someone improve without shaming them.",
    whenFed: "when you can teach, model, and give real feedback.",
    whenStarved: "when the culture is sarcasm, blame, or ego.",
    upside: "You raise the level of people around you.",
    watchout: "You can coach everyone except yourself.",
    signalHints: ["people", "action"],
    keywords: ["coach", "teach", "help them", "feedback", "practice with", "show them", "mentor", "train"],
    sourceHint: "Hybrid",
  },

  /* ---------------------------------------------
     THINKING (thinking + learning)
     --------------------------------------------- */
  {
    id: "critical_thinking",
    domain: "thinking",
    label: "Critical Thinking",
    oneLine: "You don’t just believe things — you test them.",
    whenFed: "when you can compare options and check evidence.",
    whenStarved: "when people want fast agreement with no reasoning.",
    upside: "You avoid traps and make smarter decisions.",
    watchout: "Over-analysis can delay action.",
    signalHints: ["clarity", "curiosity"],
    keywords: ["evidence", "logic", "analyze", "analysis", "reason", "truth", "debate", "pros and cons", "critical"],
    sourceHint: "O*NET",
  },
  {
    id: "problem_solving",
    domain: "thinking",
    label: "Problem Solving",
    oneLine: "You can turn messy into workable.",
    whenFed: "when you can break a problem into parts and iterate.",
    whenStarved: "when everything is vague and no one defines success.",
    upside: "You make progress even when the path isn’t obvious.",
    watchout: "You can take ownership of problems that aren’t yours.",
    signalHints: ["clarity", "action"],
    keywords: ["solve", "fix", "figure it out", "debug", "workaround", "solution", "issue", "problem"],
    sourceHint: "O*NET",
  },
  {
    id: "systems_thinking",
    domain: "thinking",
    label: "Systems Thinking",
    oneLine: "You notice how parts affect each other.",
    whenFed: "when you can see the whole system, not just one moment.",
    whenStarved: "when people treat symptoms instead of causes.",
    upside: "You build solutions that keep working.",
    watchout: "You can over-model and under-ship.",
    signalHints: ["clarity"],
    keywords: ["system", "patterns", "root cause", "feedback loop", "process", "structure", "why it happens", "upstream"],
    sourceHint: "O*NET",
  },
  {
    id: "creativity",
    domain: "thinking",
    label: "Creativity",
    oneLine: "You make new paths when the old ones don’t fit.",
    whenFed: "when you can remix, design, and experiment.",
    whenStarved: "when everything is pre-scripted and safe.",
    upside: "You generate options fast and build interesting solutions.",
    watchout: "Ideas can multiply faster than finishing.",
    signalHints: ["curiosity", "clarity"],
    keywords: ["create", "creative", "design", "invent", "idea", "imagine", "make", "original", "remix", "prototype"],
    sourceHint: "Hybrid",
  },
  {
    id: "decision_making",
    domain: "thinking",
    label: "Decision Making",
    oneLine: "You can choose a path and live with it.",
    whenFed: "when you have enough info and a clear ‘good enough.’",
    whenStarved: "when stakes feel huge and you’re afraid to be wrong.",
    upside: "You move sooner — and you learn sooner.",
    watchout: "Rushing can look confident but create avoidable messes.",
    signalHints: ["clarity", "action"],
    keywords: ["decide", "choice", "choose", "commit", "option", "which one", "good enough", "tradeoff"],
    sourceHint: "Hybrid",
  },
  {
    id: "learning_how_to_learn",
    domain: "thinking",
    label: "Learning Strategy",
    oneLine: "You learn in a way that actually sticks.",
    whenFed: "when you use reps, feedback, and spaced practice.",
    whenStarved: "when learning is just cramming or memorizing.",
    upside: "Your progress compounds because you learn efficiently.",
    watchout: "You can optimize the method instead of doing the reps.",
    signalHints: ["curiosity", "clarity"],
    keywords: ["study", "learn", "practice", "flashcards", "spaced", "review", "method", "how I learn"],
    sourceHint: "Hybrid",
  },
  {
    id: "curiosity",
    domain: "thinking",
    label: "Curiosity",
    oneLine: "Questions pull you forward.",
    whenFed: "when you can explore and ask ‘why’ without being rushed.",
    whenStarved: "when it’s all repetition and ‘because I said so.’",
    upside: "You notice patterns and learn fast.",
    watchout: "Curiosity can delay choosing a first step.",
    signalHints: ["curiosity"],
    keywords: ["curious", "curiosity", "why", "how", "question", "questions", "explore", "rabbit hole", "investigate"],
    sourceHint: "Hybrid",
  },
  {
    id: "research",
    domain: "thinking",
    label: "Research",
    oneLine: "You can find signal in a noisy internet.",
    whenFed: "when you have a real question and time to verify.",
    whenStarved: "when you rely on vibes, rumors, or one source.",
    upside: "You make better choices because your inputs are better.",
    watchout: "Research can become a hiding place from action.",
    signalHints: ["curiosity", "clarity"],
    keywords: ["research", "sources", "look up", "verify", "evidence", "study", "read about", "compare"],
    sourceHint: "O*NET",
  },

  /* ---------------------------------------------
     MAKING (create + ship)
     --------------------------------------------- */
  {
    id: "writing",
    domain: "making",
    label: "Writing",
    oneLine: "You can turn thoughts into clear words.",
    whenFed: "when you write drafts and revise (not wait for perfect).",
    whenStarved: "when you only write for grades or you’re afraid to be judged.",
    upside: "You can persuade, explain, and think more clearly.",
    watchout: "Perfectionism can block finishing.",
    signalHints: ["clarity"],
    keywords: ["write", "writing", "draft", "essay", "blog", "notes", "edit", "revise", "copy"],
    sourceHint: "O*NET",
  },
  {
    id: "storytelling",
    domain: "making",
    label: "Storytelling",
    oneLine: "You can make people care (without begging for attention).",
    whenFed: "when you connect facts to meaning and emotion.",
    whenStarved: "when you feel like you have to perform instead of communicate.",
    upside: "You can lead, persuade, and make ideas memorable.",
    watchout: "If it becomes performance-only, it stops being true.",
    signalHints: ["people", "clarity"],
    keywords: ["story", "narrative", "hook", "plot", "tell", "make it feel", "relatable", "examples"],
    sourceHint: "Hybrid",
  },
  {
    id: "public_speaking",
    domain: "making",
    label: "Speaking",
    oneLine: "You can explain live, under pressure.",
    whenFed: "when you practice and get real reps (not just talent).",
    whenStarved: "when you avoid the stage and never build the muscle.",
    upside: "You can lead groups and sell ideas.",
    watchout: "Confidence can hide weak structure — keep it clear.",
    signalHints: ["people", "action"],
    keywords: ["present", "presentation", "speak", "talk", "speech", "pitch", "public", "stage", "debate"],
    sourceHint: "O*NET",
  },
  {
    id: "design_sense",
    domain: "making",
    label: "Design Sense",
    oneLine: "You notice what feels clean, human, and high quality.",
    whenFed: "when you can iterate visually and get feedback.",
    whenStarved: "when everything is sloppy or rushed with no care.",
    upside: "Your work looks better and works better.",
    watchout: "Being picky can delay shipping.",
    signalHints: ["clarity", "curiosity"],
    keywords: ["design", "aesthetic", "layout", "visual", "clean", "UI", "color", "typography", "style"],
    sourceHint: "Hybrid",
  },
  {
    id: "building",
    domain: "making",
    label: "Building",
    oneLine: "You can make something real — not just talk about it.",
    whenFed: "when you can prototype, test, and learn by doing.",
    whenStarved: "when everything is theoretical and no one ships.",
    upside: "You learn faster because reality gives feedback.",
    watchout: "You can build too fast and skip foundations.",
    signalHints: ["action"],
    keywords: ["build", "make", "prototype", "create", "ship", "deploy", "launch", "craft", "project"],
    sourceHint: "O*NET",
  },
  {
    id: "iteration",
    domain: "making",
    label: "Iteration",
    oneLine: "You can improve through cycles instead of one perfect attempt.",
    whenFed: "when feedback is normal and you can run versions.",
    whenStarved: "when mistakes are punished and you play safe.",
    upside: "Your work gets better because you keep refining it.",
    watchout: "Endless iteration can become avoidance of finishing.",
    signalHints: ["action", "clarity"],
    keywords: ["iterate", "iteration", "version", "revise", "improve", "feedback loop", "refactor", "try again"],
    sourceHint: "Hybrid",
  },
  {
    id: "organization",
    domain: "making",
    label: "Organization",
    oneLine: "You can keep the chaos in a container.",
    whenFed: "when you can label, structure, and keep things findable.",
    whenStarved: "when everything is scattered and nobody owns the system.",
    upside: "You move faster because you don’t lose stuff (time, files, info).",
    watchout: "Over-organizing can become procrastination.",
    signalHints: ["clarity"],
    keywords: ["organize", "folder", "system", "list", "checklist", "clean up", "structure", "plan"],
    sourceHint: "O*NET",
  },
  {
    id: "initiative",
    domain: "making",
    label: "Initiative",
    oneLine: "You start without needing permission.",
    whenFed: "when you feel trusted and the goal is real.",
    whenStarved: "when everything is micromanaged or you’re punished for trying.",
    upside: "You create opportunities instead of waiting for them.",
    watchout: "Initiative without alignment can waste effort.",
    signalHints: ["action"],
    keywords: ["start", "initiative", "I just did", "took it on", "made it happen", "proactive", "reach out", "set up"],
    sourceHint: "O*NET",
  },
  {
    id: "adaptability",
    domain: "making",
    label: "Adaptability",
    oneLine: "You can adjust without losing yourself.",
    whenFed: "when change is treated as normal and you can learn quickly.",
    whenStarved: "when change is constant chaos with no explanation.",
    upside: "You stay effective in new environments.",
    watchout: "Too much adapting can blur what you actually want.",
    signalHints: ["clarity", "action"],
    keywords: ["adapt", "adaptable", "adjust", "new", "change", "switch", "learn fast", "different"],
    sourceHint: "Hybrid",
  },
] as const;

/* =============================================================================
   Public helpers
   ============================================================================= */

export function getSkillDef(id: SkillId): SkillDef | null {
  return (SKILLS as SkillDef[]).find((s) => s.id === id) ?? null;
}

/* =============================================================================
   Scoring (deterministic, bounded)
   ============================================================================= */

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function toBlob(args: { signals: SignalLike[]; terms: WordCloudItemLike[]; receipts: string[] }) {
  const signalsText = (args.signals ?? [])
    .flatMap((s) => [s.why ?? "", ...(s.examples ?? [])])
    .map((x) => cleanOneLine(String(x)))
    .filter(Boolean)
    .join(" | ");

  const termsText = (args.terms ?? [])
    .slice(0, 30)
    .map((t) => cleanOneLine(String(t.term ?? "")))
    .filter(Boolean)
    .join(" | ");

  const receiptsText = (args.receipts ?? [])
    .slice(0, 10)
    .map((x) => cleanOneLine(String(x)))
    .filter(Boolean)
    .join(" | ");

  return `${signalsText} | ${termsText} | ${receiptsText}`.toLowerCase();
}

function countKeywordHits(blob: string, keywords: string[]) {
  let hits = 0;
  for (const raw of keywords) {
    const k = (raw ?? "").toLowerCase().trim();
    if (!k) continue;
    if (blob.includes(k)) hits += 1;
  }
  return hits;
}

function strengthMap(signals: SignalLike[]) {
  const m = new Map<SignalId, number>();
  for (const s of signals ?? []) {
    if (!s) continue;
    m.set(s.id, clamp01(Number(s.strength ?? 0)));
  }
  return m;
}

function pickReceiptsForSkill(args: {
  def: SkillDef;
  signals: SignalLike[];
  terms: WordCloudItemLike[];
  receipts: string[];
}): string[] {
  const { def, signals, terms, receipts } = args;

  const out: string[] = [];
  const want = new Set(def.keywords.map((k) => k.toLowerCase()));

  // 1) Prefer explicit receipts
  for (const r of receipts ?? []) {
    const rr = cleanOneLine(r);
    if (!rr) continue;
    const low = rr.toLowerCase();
    if ([...want].some((k) => k.length >= 4 && low.includes(k))) {
      out.push(rr.length > 140 ? `${rr.slice(0, 137)}…` : rr);
      if (out.length >= 2) return out;
    }
  }

  // 2) Then signal examples / why
  const signalBits = (signals ?? [])
    .flatMap((s) => [s.why ?? "", ...(s.examples ?? [])])
    .map((x) => cleanOneLine(String(x)))
    .filter((x) => x.length >= 6 && x.length <= 180);

  for (const b of signalBits) {
    const low = b.toLowerCase();
    if ([...want].some((k) => k.length >= 4 && low.includes(k))) {
      out.push(b);
      if (out.length >= 2) return out;
    }
  }

  // 3) Finally, use top terms as themes
  const topTerms = (terms ?? [])
    .slice(0, 14)
    .map((t) => cleanOneLine(String(t.term)))
    .filter((t) => t.length >= 3 && t.length <= 20);

  for (const t of topTerms) {
    const low = t.toLowerCase();
    if ([...want].some((k) => k.length >= 4 && low.includes(k))) {
      out.push(`Theme: ${t}`);
      if (out.length >= 2) return out;
    }
  }

  return out.slice(0, 2);
}

function buildDomainBridgeFromHits(hits: SkillHit[]): Record<SkillDomainId, SkillId[]> {
  const out: Record<SkillDomainId, SkillId[]> = { self: [], people: [], thinking: [], making: [] };

  for (const h of hits) {
    const d = h.def.domain;
    if (!out[d].includes(h.def.id)) out[d].push(h.def.id);
  }

  return out;
}

function introFromTop(top: SkillDef | null, name: string) {
  const who = name ? `${name}, ` : "";
  if (!top) return `${who}I don’t have enough signal yet to reflect your skills cleanly. Give me a couple real examples.`;
  return `${who}here are the skills I think you reach for when things get real — not résumé words, but repeatable moves.`;
}

function proofFromTop(topHit: SkillHit | null) {
  const r = topHit?.receipts?.[0] ? cleanOneLine(topHit.receipts[0]) : "";
  if (!topHit) return "As you add more real examples, this gets sharper and more personal.";
  if (r) return `Proof I’m not guessing: “${r.replace(/^Theme:\s*/i, "")}”`;
  return "Proof I’m not guessing: this is coming directly from your words + themes you’ve repeated.";
}

function watchoutFromTop(top: SkillDef | null) {
  if (!top) return "Watchout: generic results usually mean we need more real examples to work with.";
  return `Watchout: ${top.watchout.replace(/\.$/, "")}.`;
}

/* =============================================================================
   Main entry: buildSkillsProfile
   ============================================================================= */

export function buildSkillsProfile(args: {
  name?: string;
  signals: SignalLike[];
  terms: WordCloudItemLike[];
  receipts?: string[];
  topN?: number; // default 6
}): SkillProfile {
  const name = cleanOneLine(args.name ?? "");
  const receipts = (args.receipts ?? []).map((x) => cleanOneLine(x)).filter(Boolean);

  const blob = toBlob({ signals: args.signals ?? [], terms: args.terms ?? [], receipts });

  const strengths = strengthMap(args.signals ?? []);
  const sPeople = strengths.get("people") ?? 0;
  const sCuriosity = strengths.get("curiosity") ?? 0;
  const sAction = strengths.get("action") ?? 0;
  const sClarity = strengths.get("clarity") ?? 0;

  const scored: SkillHit[] = SKILLS.map((def) => {
    const hits = countKeywordHits(blob, def.keywords);

    // Base: small so “no-signal” doesn’t invent
    let score = 0.06;

    // Keyword signal (bounded)
    score += Math.min(0.36, hits * 0.04);

    // Signal boosts (stable)
    if (def.signalHints.includes("people")) score += sPeople * 0.18;
    if (def.signalHints.includes("curiosity")) score += sCuriosity * 0.18;
    if (def.signalHints.includes("action")) score += sAction * 0.16;
    if (def.signalHints.includes("clarity")) score += sClarity * 0.14;

    // Gentle nudges (few only)
    if (def.id === "collaboration") score += sPeople * 0.06;
    if (def.id === "communication") score += sPeople * 0.06;
    if (def.id === "curiosity") score += sCuriosity * 0.06;
    if (def.id === "initiative") score += sAction * 0.06;
    if (def.id === "planning") score += sClarity * 0.06;

    const receiptsFor = pickReceiptsForSkill({
      def,
      signals: args.signals ?? [],
      terms: args.terms ?? [],
      receipts,
    });

    return { def, score: clamp01(score), receipts: receiptsFor };
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const topN = Math.max(1, Math.min(10, Math.floor(args.topN ?? 6)));
  const top6 = scored.slice(0, topN);

  // If we truly have no signal, avoid “strong” claims
  const top = top6[0] ?? null;
  const hasSignal = (top?.score ?? 0) >= 0.20;

  const safeTop6 = hasSignal ? top6 : [];
  const domainBridge = buildDomainBridgeFromHits(safeTop6);

  return {
    top6: safeTop6,
    top: hasSignal ? top : null,
    domainBridge,
    introLine: introFromTop(hasSignal ? top?.def ?? null : null, name),
    proofLine: proofFromTop(hasSignal ? top ?? null : null),
    watchoutLine: watchoutFromTop(hasSignal ? top?.def ?? null : null),
  };
}