/* =============================================================================
   Strengths taxonomy (VIA 24 → teen-friendly Everleap labels)
   - Closed vocabulary so the AI doesn't invent strengths
   - Deterministic scoring from existing user signals + word cloud + receipts
   ============================================================================= */

export type StrengthId =
  | "curiosity"
  | "love_of_learning"
  | "judgment"
  | "creativity"
  | "perspective"
  | "bravery"
  | "perseverance"
  | "honesty"
  | "zest"
  | "love"
  | "kindness"
  | "social_intelligence"
  | "teamwork"
  | "fairness"
  | "leadership"
  | "forgiveness"
  | "humility"
  | "prudence"
  | "self_regulation"
  | "appreciation_of_beauty"
  | "gratitude"
  | "hope"
  | "humor"
  | "spirituality";

export type DriverId = "meaning" | "mastery" | "people" | "freedom" | "curiosity" | "momentum";
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

export type StrengthDef = {
  id: StrengthId;

  // Teen-friendly
  label: string;
  oneLine: string;

  // Conversational agentic copy building blocks
  whenFed: string;
  whenStarved: string;
  upside: string;
  watchout: string;

  // Optional: internal reference
  researchLabel?: string;

  // Bridges to your driver layer
  driverHints: DriverId[];

  // Deterministic classification support (small, stable)
  keywords: string[];
};

export type StrengthHit = {
  def: StrengthDef;
  score: number; // 0..1
  receipts: string[]; // short evidence strings
};

export type StrengthProfile = {
  top5: StrengthHit[];
  top: StrengthHit | null;

  driverBridge: Record<DriverId, StrengthId[]>;

  introLine: string;
  proofLine: string;
  watchoutLine: string;
};

/* =============================================================================
   Data: 24 strengths (VIA)
   ============================================================================= */

export const STRENGTHS_24: ReadonlyArray<StrengthDef> = [
  {
    id: "curiosity",
    label: "Curiosity",
    researchLabel: "Curiosity",
    oneLine: "Questions pull you forward.",
    whenFed: "when you’re allowed to explore, ask why, and go deeper without being rushed.",
    whenStarved: "when it’s all memorizing, repeating, or “just do it because I said so.”",
    upside: "You learn fast and notice patterns other people miss.",
    watchout: "You can keep researching instead of choosing a first step.",
    driverHints: ["curiosity", "freedom"],
    keywords: ["curious", "curiosity", "why", "how", "question", "questions", "explore", "rabbit hole", "figure out", "investigate"],
  },
  {
    id: "love_of_learning",
    label: "Love of Learning",
    researchLabel: "Love of Learning",
    oneLine: "You like getting better by understanding more.",
    whenFed: "when learning feels relevant, skill-based, and connected to something real.",
    whenStarved: "when school feels like empty hoops with no payoff.",
    upside: "You build knowledge that actually sticks — and compounds.",
    watchout: "You can collect info without turning it into action.",
    driverHints: ["curiosity", "mastery"],
    keywords: ["learn", "learning", "study", "read", "research", "practice", "skill", "improve", "master", "training"],
  },
  {
    id: "judgment",
    label: "Clear Thinking",
    researchLabel: "Judgment / Critical Thinking",
    oneLine: "You don’t just believe things — you test them.",
    whenFed: "when you can compare options, check evidence, and think independently.",
    whenStarved: "when people want you to agree fast without reasoning.",
    upside: "You make smarter decisions and avoid obvious traps.",
    watchout: "You can over-analyze and delay committing.",
    driverHints: ["curiosity", "meaning"],
    keywords: ["evidence", "logic", "analyze", "analysis", "reason", "truth", "debate", "pros and cons", "think it through", "critical"],
  },
  {
    id: "creativity",
    label: "Creativity",
    researchLabel: "Creativity",
    oneLine: "You make new paths when the old ones don’t fit.",
    whenFed: "when you can design, remix, experiment, and make something original.",
    whenStarved: "when everything is pre-scripted and there’s no room to invent.",
    upside: "You generate options fast and build interesting solutions.",
    watchout: "Ideas can multiply faster than finishing.",
    driverHints: ["freedom", "curiosity", "meaning"],
    keywords: ["create", "creative", "design", "invent", "build", "idea", "imagine", "make", "art", "write", "prototype"],
  },
  {
    id: "perspective",
    label: "Perspective",
    researchLabel: "Perspective",
    oneLine: "You see the bigger picture — and what matters.",
    whenFed: "when you can step back, connect dots, and make sense of chaos.",
    whenStarved: "when everything is urgent and nobody thinks long-term.",
    upside: "You give people clarity and calm in confusing moments.",
    watchout: "You can get stuck explaining instead of acting.",
    driverHints: ["meaning"],
    keywords: ["big picture", "perspective", "long-term", "meaning", "context", "wisdom", "advice", "see the pattern", "overview"],
  },
  {
    id: "bravery",
    label: "Bravery",
    researchLabel: "Bravery",
    oneLine: "You can act even when it’s scary.",
    whenFed: "when you’re allowed to try hard things without being shamed for mistakes.",
    whenStarved: "when fear of embarrassment runs the whole room.",
    upside: "You take real shots — and grow faster because of it.",
    watchout: "You can push too hard without recovery.",
    driverHints: ["momentum", "mastery"],
    keywords: ["brave", "scared", "fear", "courage", "risk", "try", "hard", "pressure", "nerves", "bold"],
  },
  {
    id: "perseverance",
    label: "Grit",
    researchLabel: "Perseverance",
    oneLine: "You stay in it when it gets hard.",
    whenFed: "when there’s a real goal and progress is visible over time.",
    whenStarved: "when effort feels pointless or nobody notices follow-through.",
    upside: "You outlast friction and finish what you start.",
    watchout: "You can grind past the point where it’s smart.",
    driverHints: ["momentum", "mastery"],
    keywords: ["grit", "persevere", "keep going", "stick with it", "commit", "discipline", "finish", "follow through", "effort"],
  },
  {
    id: "honesty",
    label: "Honesty",
    researchLabel: "Honesty / Integrity",
    oneLine: "You’d rather be real than look perfect.",
    whenFed: "when truth is safe and you can speak without punishment.",
    whenStarved: "when people play games, fake it, or punish honesty.",
    upside: "You build trust and make relationships cleaner.",
    watchout: "You can be too blunt if you don’t pace it.",
    driverHints: ["meaning", "people"],
    keywords: ["honest", "truth", "real", "integrity", "authentic", "say it", "straightforward", "no fake", "trust"],
  },
  {
    id: "zest",
    label: "Zest",
    researchLabel: "Zest",
    oneLine: "You bring energy when you’re engaged.",
    whenFed: "when the work feels alive: challenge, purpose, or genuine excitement.",
    whenStarved: "when it’s repetitive, dead, or empty routine.",
    upside: "You lift the room and make effort feel lighter.",
    watchout: "When you’re bored, your motivation can drop hard.",
    driverHints: ["momentum", "meaning"],
    keywords: ["energy", "alive", "excited", "hype", "enthusiasm", "vibe", "fun", "charge", "intense"],
  },
  {
    id: "love",
    label: "Deep Bonds",
    researchLabel: "Love",
    oneLine: "You go all-in on the people you care about.",
    whenFed: "when relationships feel real, mutual, and safe.",
    whenStarved: "when things feel cold, fake, or unstable.",
    upside: "You create loyalty and strong support systems.",
    watchout: "You can over-attach or take things personally.",
    driverHints: ["people", "meaning"],
    keywords: ["love", "close", "bond", "best friend", "family", "care about", "relationship", "connected", "loyal"],
  },
  {
    id: "kindness",
    label: "Kindness",
    researchLabel: "Kindness",
    oneLine: "You help without needing credit.",
    whenFed: "when helping feels meaningful and not taken for granted.",
    whenStarved: "when people treat kindness like weakness or exploit it.",
    upside: "You make people safer and teams better.",
    watchout: "You can over-give and resent it later.",
    driverHints: ["people", "meaning"],
    keywords: ["kind", "help", "support", "care", "nice", "generous", "mentor", "coach", "comfort"],
  },
  {
    id: "social_intelligence",
    label: "People Sense",
    researchLabel: "Social Intelligence",
    oneLine: "You read the room — and adjust without losing yourself.",
    whenFed: "when you have real interactions and honest feedback loops.",
    whenStarved: "when people are fake, passive-aggressive, or unpredictable.",
    upside: "You navigate groups well and de-escalate tension.",
    watchout: "You can start self-editing too much.",
    driverHints: ["people", "momentum"],
    keywords: ["read the room", "social", "vibes", "emotion", "empathy", "awkward", "tension", "communicate", "feedback"],
  },
  {
    id: "teamwork",
    label: "Teamwork",
    researchLabel: "Teamwork",
    oneLine: "You get better with a real crew.",
    whenFed: "when the group has shared standards and shared effort.",
    whenStarved: "when it’s chaotic, flaky, or nobody owns their part.",
    upside: "You make teams more consistent and effective.",
    watchout: "You can carry the group if others don’t show up.",
    driverHints: ["people", "momentum"],
    keywords: ["team", "together", "group", "collab", "partner", "we", "community", "support each other", "shared"],
  },
  {
    id: "fairness",
    label: "Fairness",
    researchLabel: "Fairness",
    oneLine: "You care about what’s right — not just what’s easy.",
    whenFed: "when rules make sense and people are treated consistently.",
    whenStarved: "when things feel rigged or arbitrary.",
    upside: "You protect trust and standards.",
    watchout: "Injustice can become a focus trap.",
    driverHints: ["meaning", "people"],
    keywords: ["fair", "unfair", "justice", "equity", "respect", "consistent", "rules", "bias", "rights"],
  },
  {
    id: "leadership",
    label: "Leadership",
    researchLabel: "Leadership",
    oneLine: "You can set direction and raise the standard.",
    whenFed: "when you’re trusted with responsibility and real influence.",
    whenStarved: "when you’re sidelined or forced to follow nonsense.",
    upside: "You create momentum for groups.",
    watchout: "You can become the ‘default adult’ and burn out.",
    driverHints: ["people", "momentum", "meaning"],
    keywords: ["lead", "captain", "in charge", "organize", "responsible", "direction", "standard", "manage", "guide"],
  },
  {
    id: "forgiveness",
    label: "Reset Power",
    researchLabel: "Forgiveness",
    oneLine: "You can move on without staying poisoned.",
    whenFed: "when accountability exists and repair is real (not fake apologies).",
    whenStarved: "when people repeat harm with no change.",
    upside: "You recover faster and keep relationships clean.",
    watchout: "Forgiving too fast can erase boundaries.",
    driverHints: ["people", "meaning"],
    keywords: ["forgive", "move on", "reset", "second chance", "let it go", "apology", "repair", "grudge"],
  },
  {
    id: "humility",
    label: "Humility",
    researchLabel: "Humility",
    oneLine: "You don’t need the spotlight to be solid.",
    whenFed: "when the culture values real work over flexing.",
    whenStarved: "when everything is status, attention, or image games.",
    upside: "You stay coachable and improve faster.",
    watchout: "You can under-claim your wins and get overlooked.",
    driverHints: ["mastery"],
    keywords: ["humble", "humility", "grounded", "no ego", "quiet", "modest", "low-key", "not about me"],
  },
  {
    id: "prudence",
    label: "Good Judgment Under Risk",
    researchLabel: "Prudence",
    oneLine: "You think before you leap — especially when stakes are real.",
    whenFed: "when planning is respected and you can prevent avoidable chaos.",
    whenStarved: "when people rush, ignore consequences, or wing it constantly.",
    upside: "You avoid dumb mistakes and protect future you.",
    watchout: "Too much caution can block good chances.",
    driverHints: ["meaning"],
    keywords: ["careful", "plan", "think ahead", "risk", "consequence", "avoid", "safe", "prudent", "smart choice"],
  },
  {
    id: "self_regulation",
    label: "Self-Control",
    researchLabel: "Self-Regulation",
    oneLine: "You can steer yourself when it matters.",
    whenFed: "when you have routines, clear goals, and a reason to stay consistent.",
    whenStarved: "when everything is chaotic and you’re running on vibes only.",
    upside: "You build consistency — which turns into confidence.",
    watchout: "Too much control can turn into rigidity or self-pressure.",
    driverHints: ["mastery", "momentum"],
    keywords: ["discipline", "routine", "self control", "control myself", "consistent", "habit", "focus", "resist", "structure"],
  },
  {
    id: "appreciation_of_beauty",
    label: "Aesthetic Eye",
    researchLabel: "Appreciation of Beauty & Excellence",
    oneLine: "You notice what’s beautiful — and what’s world-class.",
    whenFed: "when you can experience great work, nature, design, or excellence up close.",
    whenStarved: "when everything is sloppy, dull, or low-effort.",
    upside: "You raise quality and care about craft.",
    watchout: "You can get picky and delay shipping.",
    driverHints: ["meaning", "mastery"],
    keywords: ["beautiful", "aesthetic", "design", "art", "nature", "excellence", "amazing", "world class", "craft"],
  },
  {
    id: "gratitude",
    label: "Gratitude",
    researchLabel: "Gratitude",
    oneLine: "You notice what’s good — and don’t take it for granted.",
    whenFed: "when you pause long enough to recognize support and wins.",
    whenStarved: "when everything feels like pressure and nothing feels enough.",
    upside: "You recover faster and stay grounded.",
    watchout: "Forced gratitude can feel fake — keep it real.",
    driverHints: ["meaning", "people"],
    keywords: ["grateful", "gratitude", "appreciate", "thank", "lucky", "support", "blessed"],
  },
  {
    id: "hope",
    label: "Hope",
    researchLabel: "Hope",
    oneLine: "You can see a way forward — even when it’s hard.",
    whenFed: "when you have a believable next step and a reason to keep going.",
    whenStarved: "when everything feels pointless or stuck.",
    upside: "You keep moving and help others keep moving too.",
    watchout: "Hope without action can become coping instead of progress.",
    driverHints: ["meaning", "momentum"],
    keywords: ["hope", "future", "optimistic", "it will work", "next step", "believe", "possible", "plan"],
  },
  {
    id: "humor",
    label: "Humor",
    researchLabel: "Humor",
    oneLine: "You can lighten the moment without avoiding the truth.",
    whenFed: "when humor is safe and not used as a weapon.",
    whenStarved: "when the vibe is tense and everything is high-stakes all the time.",
    upside: "You reduce stress and make hard things doable.",
    watchout: "Jokes can become armor if you never say what you feel.",
    driverHints: ["people", "momentum"],
    keywords: ["funny", "humor", "joke", "laugh", "playful", "lighten", "banter", "comedy"],
  },
  {
    id: "spirituality",
    label: "Inner Compass",
    researchLabel: "Spirituality",
    oneLine: "You want life to mean something bigger than the moment.",
    whenFed: "when you feel connected to purpose, values, faith, or a deeper ‘why.’",
    whenStarved: "when everything feels empty, cynical, or purely status-driven.",
    upside: "You stay steady through uncertainty and choose with intention.",
    watchout: "If you search for perfect meaning, you can delay imperfect action.",
    driverHints: ["meaning"],
    keywords: ["meaning", "purpose", "faith", "spiritual", "values", "why", "soul", "connected", "bigger"],
  },
] as const;

/* =============================================================================
   Public helpers
   ============================================================================= */

export function getStrengthDef(id: StrengthId): StrengthDef | null {
  return (STRENGTHS_24 as StrengthDef[]).find((s) => s.id === id) ?? null;
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
    .slice(0, 26)
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

function pickReceiptsForStrength(args: {
  def: StrengthDef;
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
    .slice(0, 12)
    .map((t) => cleanOneLine(String(t.term)))
    .filter((t) => t.length >= 3 && t.length <= 18);

  for (const t of topTerms) {
    const low = t.toLowerCase();
    if ([...want].some((k) => k.length >= 4 && low.includes(k))) {
      out.push(`Theme: ${t}`);
      if (out.length >= 2) return out;
    }
  }

  return out.slice(0, 2);
}

function buildDriverBridgeFromHits(hits: StrengthHit[]): Record<DriverId, StrengthId[]> {
  const out: Record<DriverId, StrengthId[]> = {
    meaning: [],
    mastery: [],
    people: [],
    freedom: [],
    curiosity: [],
    momentum: [],
  };

  for (const h of hits) {
    for (const d of h.def.driverHints ?? []) {
      if (!out[d].includes(h.def.id)) out[d].push(h.def.id);
    }
  }

  return out;
}

function introFromTop(top: StrengthDef | null, name: string) {
  const who = name ? `${name}, ` : "";
  if (!top) return `${who}I don’t have enough signal yet to reflect your strengths cleanly. Give me a couple real examples.`;
  return `${who}here are the strengths I think you reach for when things get real — not as labels, but as patterns you can train.`;
}

function proofFromTop(topHit: StrengthHit | null) {
  const r = topHit?.receipts?.[0] ? cleanOneLine(topHit.receipts[0]) : "";
  if (!topHit) return "As you add more real examples, this gets sharper and more personal.";
  if (r) return `Proof I’m not guessing: “${r.replace(/^Theme:\s*/i, "")}”`;
  return "Proof I’m not guessing: this is coming directly from your words + themes you’ve repeated.";
}

function watchoutFromTop(top: StrengthDef | null) {
  if (!top) return "Watchout: generic results usually mean we need more real examples to work with.";
  return `Watchout: ${top.watchout.replace(/\.$/, "")}.`;
}

/* =============================================================================
   Main entry: buildStrengthProfile
   ============================================================================= */

export function buildStrengthProfile(args: {
  name?: string;
  signals: SignalLike[];
  terms: WordCloudItemLike[];
  receipts?: string[];
  topN?: number; // default 5
}): StrengthProfile {
  const name = cleanOneLine(args.name ?? "");
  const receipts = (args.receipts ?? []).map((x) => cleanOneLine(x)).filter(Boolean);

  const blob = toBlob({ signals: args.signals ?? [], terms: args.terms ?? [], receipts });

  const strengths = strengthMap(args.signals ?? []);
  const sPeople = strengths.get("people") ?? 0;
  const sCuriosity = strengths.get("curiosity") ?? 0;
  const sAction = strengths.get("action") ?? 0;
  const sClarity = strengths.get("clarity") ?? 0;

  const scored: StrengthHit[] = STRENGTHS_24.map((def) => {
    const hits = countKeywordHits(blob, def.keywords);

    // Base: small so “no-signal” doesn’t invent
    let score = 0.06;

    // Keyword signal (bounded)
    score += Math.min(0.34, hits * 0.04);

    // Signal boosts (stable)
    if (def.driverHints.includes("people")) score += sPeople * 0.18;
    if (def.driverHints.includes("curiosity")) score += sCuriosity * 0.18;

    if (def.driverHints.includes("momentum")) score += sAction * 0.12;
    if (def.driverHints.includes("mastery")) score += sAction * 0.10;

    // We don’t have a “meaning” signal directly; we use clarity as a proxy.
    if (def.driverHints.includes("meaning")) score += sClarity * 0.10;
    if (def.driverHints.includes("freedom")) score += sClarity * 0.06;

    // Gentle nudges (a few only)
    if (def.id === "teamwork") score += sPeople * 0.06;
    if (def.id === "social_intelligence") score += sPeople * 0.06;
    if (def.id === "curiosity") score += sCuriosity * 0.06;
    if (def.id === "perseverance") score += sAction * 0.05;

    const receiptsFor = pickReceiptsForStrength({
      def,
      signals: args.signals ?? [],
      terms: args.terms ?? [],
      receipts,
    });

    return { def, score: clamp01(score), receipts: receiptsFor };
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const topN = Math.max(1, Math.min(8, Math.floor(args.topN ?? 5)));
  const top5 = scored.slice(0, topN);

  // If we truly have no signal, avoid “strong” claims
  const top = top5[0] ?? null;
  const hasSignal = (top?.score ?? 0) >= 0.2;

  const safeTop5 = hasSignal ? top5 : [];
  const driverBridge = buildDriverBridgeFromHits(safeTop5);

  return {
    top5: safeTop5,
    top: hasSignal ? top : null,
    driverBridge,
    introLine: introFromTop(hasSignal ? top?.def ?? null : null, name),
    proofLine: proofFromTop(hasSignal ? top ?? null : null),
    watchoutLine: watchoutFromTop(hasSignal ? top?.def ?? null : null),
  };
}

/* =============================================================================
   Compatibility wrapper (what StrengthsTab is looking for)
   - Accepts the “tab inputs” shape and maps it into buildStrengthProfile.
   ============================================================================= */

export function buildStrengthsProfile(args: {
  name: string;
  signals: SignalLike[];
  themes: WordCloudItemLike[];
  superBullets: string[];
  watchoutBullets: string[];
}) {
  const receipts = [...(args.superBullets ?? []), ...(args.watchoutBullets ?? [])].map((x) => cleanOneLine(String(x))).filter(Boolean);
  return buildStrengthProfile({
    name: args.name,
    signals: args.signals ?? [],
    terms: args.themes ?? [],
    receipts,
    topN: 6,
  });
}

// Extra alias in case you want other call sites later.
export const buildStrengthsTaxonomy = buildStrengthsProfile;