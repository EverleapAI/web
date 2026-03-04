// apps/web/src/app/(app)/main/insights/content/motivationsTaxonomy.ts
/* =============================================================================
   Motivations taxonomy (Schwartz 19 → teen-friendly Everleap labels)
   - Closed vocabulary so the AI doesn't invent motivations
   - Deterministic scoring from existing user signals + word cloud + receipts
   ============================================================================= */

export type MotivationId =
  | "thinking_for_myself"
  | "doing_it_my_way"
  | "chasing_challenge"
  | "enjoying_life"
  | "winning_and_proving_myself"
  | "leading_the_room"
  | "building_status_and_resources"
  | "feeling_safe_and_stable"
  | "wanting_a_stable_world"
  | "respecting_the_rules"
  | "keeping_the_peace"
  | "honoring_what_came_before"
  | "protecting_my_people"
  | "being_counted_on"
  | "standing_up_for_everyone"
  | "protecting_the_planet"
  | "respecting_differences"
  | "staying_grounded"
  | "protecting_my_reputation";

export type DriverId = "meaning" | "mastery" | "people" | "freedom" | "curiosity" | "momentum";

// "clarity" is a *hint* (used by taxonomy), not a full universal driver.
export type DriverHintId = DriverId | "clarity";

export type MotivationDef = {
  id: MotivationId;

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

  // Helps bridge to your 6 “universal drivers” layer
  driverHints: DriverHintId[];

  // Deterministic classification support (small, stable, no magic)
  keywords: string[];
};

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

export type MotivationHit = {
  def: MotivationDef;
  score: number; // 0..1
  receipts: string[]; // short evidence strings
};

export type MotivationProfile = {
  top5: MotivationHit[];
  top: MotivationHit | null;

  // Useful for bridges (“Freedom is powered by X and Y”)
  driverBridge: Record<DriverId, MotivationId[]>;

  // Optional narrative helpers (you can ignore these if you prefer writing in tabs)
  introLine: string;
  proofLine: string;
  watchoutLine: string;
};

/* =============================================================================
   Data: 19 motivations
   ============================================================================= */

export const MOTIVATIONS_19: ReadonlyArray<MotivationDef> = [
  {
    id: "thinking_for_myself",
    label: "Thinking For Myself",
    researchLabel: "Self-Direction–Thought",
    oneLine: "You want your own opinions — not hand-me-down takes.",
    whenFed: "when you can explore ideas, ask real questions, and form your own viewpoint.",
    whenStarved: "when it’s all memorizing, copying, or being told what to think.",
    upside: "You learn deeply and spot patterns other people miss.",
    watchout: "You can get stuck in “one more rabbit hole” and delay committing to a next step.",
    driverHints: ["curiosity", "freedom"],
    keywords: [
      "think",
      "thinking",
      "ideas",
      "opinion",
      "debate",
      "philosophy",
      "theory",
      "why",
      "question",
      "questions",
      "understand",
      "meaning",
      "truth",
      "research",
      "evidence",
      "logic",
      "analysis",
      "curious",
      "curiosity",
      "learn",
      "learning",
      "discover",
    ],
  },
  {
    id: "doing_it_my_way",
    label: "Doing It My Way",
    researchLabel: "Self-Direction–Action",
    oneLine: "You want ownership of the method — and the choice.",
    whenFed: "when you can choose the approach, customize the process, and steer your own path.",
    whenStarved: "when everything is micromanaged or pre-scripted.",
    upside: "You design smart systems and adapt fast when the situation changes.",
    watchout: "If you feel controlled, you can disengage even from good opportunities.",
    driverHints: ["freedom", "momentum"],
    keywords: [
      "my way",
      "own way",
      "autonomy",
      "independent",
      "freedom",
      "choose",
      "choice",
      "control",
      "ownership",
      "self",
      "decide",
      "design",
      "create my",
      "build my",
      "custom",
      "customize",
      "not told",
      "not forced",
      "i decide",
    ],
  },
  {
    id: "chasing_challenge",
    label: "Chasing Challenge",
    researchLabel: "Stimulation",
    oneLine: "You get energy from stretch, novelty, and intensity.",
    whenFed: "when there’s challenge, newness, risk (the good kind), and a reason to level up.",
    whenStarved: "when it’s repetitive, safe-but-dead, or nothing is at stake.",
    upside: "You grow fast under pressure and you don’t fear hard things.",
    watchout: "You can get bored with maintenance and skip the boring reps that make you elite.",
    driverHints: ["momentum", "mastery"],
    keywords: [
      "challenge",
      "hard",
      "intense",
      "pressure",
      "risk",
      "exciting",
      "adventure",
      "novel",
      "new",
      "bold",
      "push",
      "stretch",
      "edge",
      "competitive",
      "compete",
      "fight",
      "spar",
      "tournament",
    ],
  },
  {
    id: "enjoying_life",
    label: "Enjoying Life",
    researchLabel: "Hedonism",
    oneLine: "You care about pleasure, vibe, and feeling alive.",
    whenFed: "when the experience feels fun, beautiful, satisfying, or energizing.",
    whenStarved: "when it’s joyless grind with no payoff in the moment or later.",
    upside: "You’re good at making life sustainable — you know how to refuel.",
    watchout: "You can avoid discomfort that’s actually the doorway to growth.",
    driverHints: ["meaning", "momentum"],
    keywords: [
      "fun",
      "enjoy",
      "enjoying",
      "happy",
      "happiness",
      "pleasure",
      "vibe",
      "music",
      "food",
      "travel",
      "experience",
      "beautiful",
      "aesthetic",
      "party",
      "laugh",
      "play",
      "chill",
      "relax",
    ],
  },
  {
    id: "winning_and_proving_myself",
    label: "Winning & Proving Myself",
    researchLabel: "Achievement",
    oneLine: "You want to earn it — and be undeniably capable.",
    whenFed: "when there’s a clear standard, a real goal, and a chance to perform.",
    whenStarved: "when standards are fuzzy or results don’t matter.",
    upside: "You push through friction and raise your baseline over time.",
    watchout: "You can tie self-worth to outcomes and feel crushed by normal setbacks.",
    driverHints: ["mastery", "momentum"],
    keywords: [
      "win",
      "winning",
      "prove",
      "proving",
      "achievement",
      "achieve",
      "success",
      "goal",
      "goals",
      "results",
      "performance",
      "rank",
      "score",
      "top",
      "best",
      "competitive",
      "compete",
      "trophy",
      "medal",
      "accomplish",
    ],
  },
  {
    id: "leading_the_room",
    label: "Leading the Room",
    researchLabel: "Power–Dominance",
    oneLine: "You’re motivated by influence and responsibility in the moment.",
    whenFed: "when you can set direction, make calls, and lead people through uncertainty.",
    whenStarved: "when you’re sidelined, ignored, or forced to follow without input.",
    upside: "You can move groups forward and create momentum for others.",
    watchout: "You can become controlling when you don’t trust the group’s competence.",
    driverHints: ["momentum", "people"],
    keywords: [
      "lead",
      "leader",
      "leadership",
      "influence",
      "command",
      "in charge",
      "control",
      "decide",
      "direct",
      "run it",
      "manage",
      "captain",
      "authority",
      "power",
    ],
  },
  {
    id: "building_status_and_resources",
    label: "Building Status & Resources",
    researchLabel: "Power–Resources",
    oneLine: "You care about access — reputation, money, tools, opportunity.",
    whenFed: "when you can build a stronger position: skills + connections + resources.",
    whenStarved: "when you feel stuck with no leverage or options.",
    upside: "You’re strategic about creating opportunity instead of waiting for it.",
    watchout: "If it becomes only status, you can lose touch with what you actually care about.",
    driverHints: ["meaning", "momentum"],
    keywords: [
      "money",
      "income",
      "wealth",
      "resources",
      "status",
      "reputation",
      "network",
      "connections",
      "opportunity",
      "options",
      "access",
      "influence",
      "power",
      "brand",
      "portfolio",
    ],
  },
  {
    id: "feeling_safe_and_stable",
    label: "Feeling Safe & Stable",
    researchLabel: "Security–Personal",
    oneLine: "You want your day-to-day life to feel steady and protected.",
    whenFed: "when your environment feels predictable enough to relax and focus.",
    whenStarved: "when there’s chaos, uncertainty, or constant risk.",
    upside: "You build reliable routines and make decisions that reduce avoidable stress.",
    watchout: "Too much safety can become avoidance of growth or new experiences.",
    driverHints: ["clarity", "meaning"],
    keywords: [
      "safe",
      "safety",
      "stable",
      "stability",
      "secure",
      "security",
      "predictable",
      "routine",
      "calm",
      "anxiety",
      "stress",
      "risk",
      "certainty",
      "plan",
    ],
  },
  {
    id: "wanting_a_stable_world",
    label: "Wanting a Stable World",
    researchLabel: "Security–Societal",
    oneLine: "You care about a society that works: order, fairness, safety.",
    whenFed: "when communities have structure, protection, and systems that function.",
    whenStarved: "when the world feels chaotic, unsafe, or unfair.",
    upside: "You’re the person who thinks about consequences and systems, not just vibes.",
    watchout: "You can become rigid when the world refuses to stay neat.",
    driverHints: ["meaning", "clarity"],
    keywords: [
      "society",
      "community",
      "public",
      "safety",
      "law",
      "order",
      "stability",
      "system",
      "systems",
      "policy",
      "rules",
      "fair",
      "fairness",
      "justice",
    ],
  },
  {
    id: "respecting_the_rules",
    label: "Respecting the Rules",
    researchLabel: "Conformity–Rules",
    oneLine: "You value structure and clear expectations.",
    whenFed: "when there are rules that make sense and people follow through.",
    whenStarved: "when it’s messy, inconsistent, or everyone does whatever they want.",
    upside: "You’re dependable and you keep standards from falling apart.",
    watchout: "You can over-prioritize compliance when creativity would solve the problem faster.",
    driverHints: ["clarity", "mastery"],
    keywords: [
      "rules",
      "rule",
      "structure",
      "expectations",
      "discipline",
      "consistent",
      "standards",
      "standard",
      "policy",
      "procedure",
      "system",
      "organized",
      "order",
      "compliance",
    ],
  },
  {
    id: "keeping_the_peace",
    label: "Keeping the Peace",
    researchLabel: "Conformity–Interpersonal",
    oneLine: "You try not to harm, embarrass, or upset people.",
    whenFed: "when relationships feel respectful, calm, and emotionally safe.",
    whenStarved: "when there’s drama, hostility, or constant conflict.",
    upside: "You build trust and you’re good at reading the room.",
    watchout: "You can avoid hard conversations and end up carrying resentment silently.",
    driverHints: ["people", "meaning"],
    keywords: [
      "peace",
      "calm",
      "conflict",
      "drama",
      "avoid",
      "hurt",
      "harm",
      "respect",
      "polite",
      "kind",
      "nice",
      "tension",
      "awkward",
    ],
  },
  {
    id: "honoring_what_came_before",
    label: "Honoring What Came Before",
    researchLabel: "Tradition",
    oneLine: "You value roots: culture, family, history, faith, ritual.",
    whenFed: "when you feel connected to something bigger than the moment — identity and lineage.",
    whenStarved: "when everything feels disposable or disrespectful.",
    upside: "You bring meaning, continuity, and respect into groups.",
    watchout: "You can resist necessary change because it feels like disrespect.",
    driverHints: ["meaning", "people"],
    keywords: [
      "tradition",
      "family",
      "culture",
      "heritage",
      "history",
      "faith",
      "religion",
      "ritual",
      "values",
      "roots",
      "legacy",
      "custom",
    ],
  },
  {
    id: "protecting_my_people",
    label: "Protecting My People",
    researchLabel: "Benevolence–Caring",
    oneLine: "You care deeply about your inner circle’s wellbeing.",
    whenFed: "when you can help, support, or protect people you love.",
    whenStarved: "when you feel powerless to help or see people treated badly.",
    upside: "You’re loyal and you create safety for others.",
    watchout: "You can over-carry responsibility and forget your own needs.",
    driverHints: ["people", "meaning"],
    keywords: [
      "family",
      "friends",
      "my people",
      "protect",
      "care",
      "help",
      "support",
      "loyal",
      "love",
      "mentor",
      "coach",
      "team",
      "together",
    ],
  },
  {
    id: "being_counted_on",
    label: "Being Someone Others Can Count On",
    researchLabel: "Benevolence–Dependability",
    oneLine: "You’re motivated by reliability and trust.",
    whenFed: "when you have responsibility that matters and people trust you with it.",
    whenStarved: "when nobody notices effort or commitments feel meaningless.",
    upside: "You’re the person who follows through and builds real credibility.",
    watchout: "You can become the default adult and quietly burn out.",
    driverHints: ["mastery", "meaning"],
    keywords: [
      "reliable",
      "dependable",
      "trust",
      "responsible",
      "responsibility",
      "follow through",
      "commitment",
      "show up",
      "consistent",
      "count on",
      "promise",
    ],
  },
  {
    id: "standing_up_for_everyone",
    label: "Standing Up for Everyone",
    researchLabel: "Universalism–Concern",
    oneLine: "You care about fairness and protecting people beyond your circle.",
    whenFed: "when you can push for justice, equality, and real-world impact.",
    whenStarved: "when the system feels unfair and nobody cares.",
    upside: "You act with conscience and you can inspire others to care.",
    watchout: "You can become exhausted trying to fix problems that are bigger than one person.",
    driverHints: ["meaning", "people"],
    keywords: [
      "justice",
      "fairness",
      "equal",
      "equality",
      "rights",
      "human",
      "help others",
      "impact",
      "change",
      "cause",
      "advocate",
      "activism",
      "community",
    ],
  },
  {
    id: "protecting_the_planet",
    label: "Protecting the Planet",
    researchLabel: "Universalism–Nature",
    oneLine: "You’re motivated by the environment and the future of life.",
    whenFed: "when your actions reduce harm and protect nature.",
    whenStarved: "when people treat the planet like it’s disposable.",
    upside: "You think long-term and care about consequences.",
    watchout: "You can feel hopeless if you take the whole planet on your shoulders.",
    driverHints: ["meaning", "clarity"],
    keywords: [
      "nature",
      "planet",
      "environment",
      "climate",
      "sustain",
      "sustainable",
      "recycle",
      "conservation",
      "earth",
      "wildlife",
      "ocean",
      "pollution",
    ],
  },
  {
    id: "respecting_differences",
    label: "Respecting Differences",
    researchLabel: "Universalism–Tolerance",
    oneLine: "You value openness, inclusion, and understanding people who aren’t like you.",
    whenFed: "when differences are respected and people feel seen.",
    whenStarved: "when there’s intolerance, stereotyping, or closed-mindedness.",
    upside: "You build bridges and learn fast from other perspectives.",
    watchout: "You can hesitate to take a stance because you want to be fair to everyone.",
    driverHints: ["people", "curiosity"],
    keywords: [
      "different",
      "differences",
      "inclusive",
      "inclusion",
      "tolerance",
      "open-minded",
      "open minded",
      "accept",
      "acceptance",
      "diversity",
      "respect",
      "understand people",
      "perspective",
    ],
  },
  {
    id: "staying_grounded",
    label: "Staying Grounded",
    researchLabel: "Humility",
    oneLine: "You don’t need spotlight to feel solid.",
    whenFed: "when you can focus on the work and keep ego out of the way.",
    whenStarved: "when everything becomes attention, flexing, or status games.",
    upside: "You stay calm, coachable, and real under pressure.",
    watchout: "You can under-claim your achievements and get overlooked.",
    driverHints: ["clarity", "mastery"],
    keywords: [
      "humble",
      "humility",
      "grounded",
      "quiet",
      "calm",
      "ego",
      "no ego",
      "not about me",
      "simple",
      "modest",
      "low-key",
      "low key",
    ],
  },
  {
    id: "protecting_my_reputation",
    label: "Protecting My Reputation",
    researchLabel: "Face",
    oneLine: "You care about how you’re seen — and avoiding humiliation.",
    whenFed: "when you feel respected and your image aligns with who you are.",
    whenStarved: "when you feel judged, exposed, or embarrassed.",
    upside: "You’re thoughtful about standards and how you show up in public.",
    watchout: "You can play it safe to avoid embarrassment and miss real growth moments.",
    driverHints: ["mastery", "clarity"],
    keywords: [
      "reputation",
      "image",
      "embarrass",
      "embarrassment",
      "cringe",
      "judged",
      "judge",
      "respect",
      "status",
      "look bad",
      "humiliated",
      "shame",
      "social",
    ],
  },
] as const;

/* =============================================================================
   Public helpers
   ============================================================================= */

export function getMotivationDef(id: MotivationId): MotivationDef | null {
  return (MOTIVATIONS_19 as MotivationDef[]).find((m) => m.id === id) ?? null;
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
    .slice(0, 6)
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

function pickReceiptsForMotivation(args: {
  def: MotivationDef;
  signals: SignalLike[];
  terms: WordCloudItemLike[];
  receipts: string[];
}): string[] {
  const { def, signals, terms, receipts } = args;

  const out: string[] = [];
  const want = new Set(def.keywords.map((k) => k.toLowerCase()));

  // 1) Prefer explicit receipts (short quotes)
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

  // 3) Finally, use top terms as “themes”
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

function mapHintToDrivers(hint: DriverHintId): DriverId[] {
  // "clarity" is a helper concept; in the 6-driver layer it most closely expresses as Meaning.
  if (hint === "clarity") return ["meaning"];
  return [hint];
}

function buildDriverBridgeFromHits(hits: MotivationHit[]): Record<DriverId, MotivationId[]> {
  const out: Record<DriverId, MotivationId[]> = {
    meaning: [],
    mastery: [],
    people: [],
    freedom: [],
    curiosity: [],
    momentum: [],
  };

  for (const h of hits) {
    for (const hint of h.def.driverHints ?? []) {
      for (const d of mapHintToDrivers(hint)) {
        if (!out[d].includes(h.def.id)) out[d].push(h.def.id);
      }
    }
  }

  return out;
}

function introFromTop(top: MotivationDef | null, name: string) {
  const who = name ? `${name}, ` : "";
  if (!top) return `${who}I don’t have enough signal yet to map your motivations cleanly. Give me a couple real examples.`;
  return `${who}here’s what I think you’re optimizing for — not as labels, but as the conditions that make you come alive.`;
}

function proofFromTop(topHit: MotivationHit | null) {
  const r = topHit?.receipts?.[0] ? cleanOneLine(topHit.receipts[0]) : "";
  if (!topHit) return "As you add more real examples, this gets sharper and more personal.";
  if (r) return `Proof I’m not guessing: “${r.replace(/^Theme:\s*/i, "")}”`;
  return "Proof I’m not guessing: this is coming directly from your words + themes you’ve repeated.";
}

function watchoutFromTop(top: MotivationDef | null) {
  if (!top) return "Watchout: generic results usually mean we need more real examples to work with.";
  return `Watchout: ${top.watchout.replace(/\.$/, "")}.`;
}

/* =============================================================================
   Main entry: buildMotivationProfile
   ============================================================================= */

export function buildMotivationProfile(args: {
  name?: string;
  signals: SignalLike[];
  terms: WordCloudItemLike[];
  receipts?: string[];
  topN?: number; // default 5
}): MotivationProfile {
  const name = cleanOneLine(args.name ?? "");
  const receipts = (args.receipts ?? []).map((x) => cleanOneLine(x)).filter(Boolean);

  const blob = toBlob({ signals: args.signals ?? [], terms: args.terms ?? [], receipts });

  const strengths = strengthMap(args.signals ?? []);
  const sPeople = strengths.get("people") ?? 0;
  const sCuriosity = strengths.get("curiosity") ?? 0;
  const sAction = strengths.get("action") ?? 0;
  const sClarity = strengths.get("clarity") ?? 0;

  // Deterministic score per motivation (bounded)
  const scored: MotivationHit[] = MOTIVATIONS_19.map((def) => {
    const hits = countKeywordHits(blob, def.keywords);

    // Base: keep small so “no-signal” doesn't invent
    let score = 0.06;

    // Keyword signal (bounded). 0..~0.32
    score += Math.min(0.32, hits * 0.04);

    // Signal boosts (coarse, but stable)
    if (def.driverHints.includes("people")) score += sPeople * 0.18;
    if (def.driverHints.includes("curiosity")) score += sCuriosity * 0.18;

    if (def.driverHints.includes("momentum")) score += sAction * 0.12;
    if (def.driverHints.includes("mastery")) score += sAction * 0.10;

    // "clarity" is a hint; it mostly strengthens Meaning-like motivations.
    if (def.driverHints.includes("clarity")) score += sClarity * 0.14;

    if (def.driverHints.includes("meaning")) score += sClarity * 0.10;
    if (def.driverHints.includes("freedom")) score += sClarity * 0.06;

    // Gentle direct nudges for a few specific constructs
    if (def.id === "keeping_the_peace") score += sPeople * 0.06;
    if (def.id === "protecting_my_people") score += sPeople * 0.06;
    if (def.id === "thinking_for_myself") score += sCuriosity * 0.06;
    if (def.id === "chasing_challenge") score += sAction * 0.05;

    // Clamp to 0..1 and attach receipts
    const receiptsFor = pickReceiptsForMotivation({
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
  const hasSignal = (top?.score ?? 0) >= 0.20;

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