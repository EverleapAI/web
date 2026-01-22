// src/app/onboarding/zipLookup.ts
export type ZipPlace = { city: string; state: string }; // 2-letter code

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

export function stateFullName(code: string): string {
  const upper = code.trim().toUpperCase();
  return STATE_NAMES[upper] ?? upper;
}

export function normalizeZip(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length >= 5) return digits.slice(0, 5);
  return "";
}

/**
 * Tiny starter table so onboarding works now.
 * Expand later when you import a real dataset.
 */
export const ZIP_LOOKUP: Record<string, ZipPlace> = {
  "01801": { city: "Woburn", state: "MA" },
  "02139": { city: "Cambridge", state: "MA" },
  "94110": { city: "San Francisco", state: "CA" },
  "94901": { city: "San Rafael", state: "CA" },
};

export async function lookupZipPlace(zip5: string): Promise<ZipPlace | null> {
  if (!/^\d{5}$/.test(zip5)) return null;
  return ZIP_LOOKUP[zip5] ?? null;
}
