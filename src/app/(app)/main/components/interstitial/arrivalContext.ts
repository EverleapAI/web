// The accent for the screen the interstitial is standing in front of.
//
// This used to derive the whole opener from where the user had just been, which
// is how "You were sizing up Dancers" ended up above a question about being a
// doctor. The entry now comes from RETORTS and refers to nothing but the act of
// asking, so the only thing left to decide here is colour — and colour belongs
// to the screen you're arriving at, not the one you left.

// Borrowed from LANE_ACCENT / SPECIALTY_ACCENTS so the interstitial belongs to
// the same family as the cards it replaced.
const SKY = "96, 176, 255";
const VIOLET = "167, 139, 250";
const EMERALD = "52, 211, 153";
const AMBER = "245, 176, 90";

const EXACT: Record<string, string> = {
  today: SKY,
  explore_summary: EMERALD,
  explore_work: SKY,
  achievements: AMBER,
  actions: AMBER,
};

const PREFIX: Array<[string, string]> = [
  ["insights", VIOLET],
  ["explore", EMERALD],
  ["action", AMBER],
];

export function accentForPage(pageKey: string): string {
  const key = (pageKey || "").toLowerCase();
  if (EXACT[key]) return EXACT[key];
  for (const [prefix, accent] of PREFIX) {
    if (key.startsWith(prefix)) return accent;
  }
  return SKY;
}
