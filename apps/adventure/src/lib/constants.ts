export const MASTERY_THRESHOLD = 0.8;
export const MASTERY_WINDOW = 10;

export const GRADES = ["K", "1", "2", "3"] as const;
export type Grade = (typeof GRADES)[number];

export const PILLARS = [
  "phonemic_awareness",
  "phonics",
  "fluency",
  "vocabulary",
  "comprehension",
] as const;
export type Pillar = (typeof PILLARS)[number];

export const PILLAR_LABELS: Record<Pillar, string> = {
  phonemic_awareness: "Phonemic Awareness",
  phonics: "Phonics",
  fluency: "Fluency",
  vocabulary: "Vocabulary",
  comprehension: "Comprehension",
};

export const SESSION_COOKIE = "rpg_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Coarse parent-picked bands — home-lab heuristic only, not official cut scores. */
export const BASELINE_BANDS = [
  "well_below",
  "below",
  "approaching",
  "on_grade",
  "above",
] as const;
export type BaselineBand = (typeof BASELINE_BANDS)[number];

export const BASELINE_BAND_LABELS: Record<BaselineBand, string> = {
  well_below: "Well below grade",
  below: "Below grade",
  approaching: "Approaching grade",
  on_grade: "On grade",
  above: "Above grade",
};

export const BASELINE_SOURCE_LABEL = "School-reported / parent-entered";
