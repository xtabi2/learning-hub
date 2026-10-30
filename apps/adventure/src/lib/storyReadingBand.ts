/**
 * Kid story-reading demand bands for Glowtrail narrative + practice ramp.
 * Placement sets START_BAND; Glowtrail planets climb only toward personal peak.
 * Cap: fluent-ms (middle school). Parent skill labels stay separate.
 *
 * Band IDs (ONLY): emerging | early | growing | fluent-ms
 * Grade midpoints (product heuristic): emergingpprox1, earlypprox2.5, growingpprox4.5, fluent-mspprox7
 * peakGrade = min(startGradeMid + 3, 8) then map to band — NOT startBandIndex+3.
 */

export const STORY_READING_BANDS = [
  "emerging",
  "early",
  "growing",
  "fluent-ms",
] as const;

export type StoryReadingBand = (typeof STORY_READING_BANDS)[number];

export const STORY_READING_BAND_KID_HINTS: Record<StoryReadingBand, string> = {
  emerging: "gentle story steps",
  early: "growing story steps",
  growing: "bright story steps",
  "fluent-ms": "deep story steps",
};

export const STORY_READING_BAND_PARENT_LABELS: Record<StoryReadingBand, string> = {
  emerging: "Emerging ≈ K–early 1",
  early: "Early ≈ grades 2–3",
  growing: "Growing ≈ grades 4–5",
  "fluent-ms": "Fluent / middle school cap ≈ 6–8",
};

export const DEFAULT_STORY_READING_BAND: StoryReadingBand = "emerging";
export const MAX_STORY_READING_BAND: StoryReadingBand = "fluent-ms";
export const GLOWTRAIL_SKILL_PLANET_COUNT = 8;
export const GLOWTRAIL_PEAK_GRADE_SPAN = 3;
export const MAX_STORY_GRADE = 8;

export const BAND_GRADE_MIDPOINT: Record<StoryReadingBand, number> = {
  emerging: 1,
  early: 2.5,
  growing: 4.5,
  "fluent-ms": 7,
};

export function isStoryReadingBand(value: string): value is StoryReadingBand {
  return (STORY_READING_BANDS as readonly string[]).includes(value);
}

export function storyReadingBandIndex(band: StoryReadingBand): number {
  return STORY_READING_BANDS.indexOf(band);
}

export function bandFromIndex(index: number): StoryReadingBand {
  const max = STORY_READING_BANDS.length - 1;
  const i = Math.max(0, Math.min(max, Math.round(index)));
  return STORY_READING_BANDS[i]!;
}

export function bandFromGrade(grade: number): StoryReadingBand {
  const g = Number.isFinite(grade) ? grade : 0;
  if (g < 1.75) return "emerging";
  if (g < 3.5) return "early";
  if (g < 5.75) return "growing";
  return "fluent-ms";
}

export function gradeMidpointForBand(band: StoryReadingBand): number {
  return BAND_GRADE_MIDPOINT[band];
}

/** peakGrade = min(startGradeMid + 3, 8). */
export function peakGradeForStart(startBand: StoryReadingBand): number {
  return Math.min(
    gradeMidpointForBand(startBand) + GLOWTRAIL_PEAK_GRADE_SPAN,
    MAX_STORY_GRADE,
  );
}

export function peakBand(startBand: StoryReadingBand): StoryReadingBand {
  return bandFromGrade(peakGradeForStart(startBand));
}

export function peakBandIndex(startBand: StoryReadingBand): number {
  return storyReadingBandIndex(peakBand(startBand));
}

export function deriveStartBandFromPlacementAccuracy(
  overallAccuracy: number,
): StoryReadingBand {
  const a = Number.isFinite(overallAccuracy)
    ? Math.max(0, Math.min(1, overallAccuracy))
    : 0;
  if (a < 0.4) return "emerging";
  if (a < 0.65) return "early";
  if (a < 0.85) return "growing";
  return "fluent-ms";
}

export function deriveStartBandFromPillarHits(
  pillarHits: Record<string, { correct: number; total: number }>,
): StoryReadingBand {
  let correct = 0;
  let total = 0;
  for (const bucket of Object.values(pillarHits)) {
    correct += bucket.correct;
    total += bucket.total;
  }
  if (total <= 0) return DEFAULT_STORY_READING_BAND;
  return deriveStartBandFromPlacementAccuracy(correct / total);
}

export function clampBandToStartPeak(
  startBand: StoryReadingBand,
  peak: StoryReadingBand,
  candidate: StoryReadingBand,
): StoryReadingBand {
  const s = storyReadingBandIndex(startBand);
  const p = storyReadingBandIndex(peak);
  const lo = Math.min(s, p);
  const hi = Math.max(s, p);
  const c = storyReadingBandIndex(candidate);
  return bandFromIndex(Math.max(lo, Math.min(hi, c)));
}

export function clampBandToPeak(
  startBand: StoryReadingBand,
  candidate: StoryReadingBand,
): StoryReadingBand {
  return clampBandToStartPeak(startBand, peakBand(startBand), candidate);
}

/** Planet number i in 1..8; climb only toward personal peak via i/8 grade interpolate. */
export function bandAtGlowtrailPlanetNumber(
  startBand: StoryReadingBand,
  planetNumber: number,
): StoryReadingBand {
  const startGrade = gradeMidpointForBand(startBand);
  const peakG = peakGradeForStart(startBand);
  const peak = peakBand(startBand);
  const i = Math.max(1, Math.min(GLOWTRAIL_SKILL_PLANET_COUNT, Math.round(planetNumber)));
  const fraction = i / GLOWTRAIL_SKILL_PLANET_COUNT;
  const grade = startGrade + (peakG - startGrade) * fraction;
  return clampBandToStartPeak(startBand, peak, bandFromGrade(grade));
}

export function bandAtGlowtrailPlanetIndex(
  startBand: StoryReadingBand,
  skillPlanetIndex: number,
): StoryReadingBand {
  return bandAtGlowtrailPlanetNumber(startBand, skillPlanetIndex + 1);
}

export function skillPlanetIndexInOrder(
  planetOrder: readonly string[],
  planetId: string,
  hubId = "nibbles",
): number {
  return planetOrder.filter((id) => id !== hubId).indexOf(planetId);
}

export function effectiveBandForPlanet(options: {
  startBand: StoryReadingBand;
  planetOrder: readonly string[];
  planetId: string;
  hubId?: string;
}): StoryReadingBand {
  const skillIndex = skillPlanetIndexInOrder(
    options.planetOrder,
    options.planetId,
    options.hubId,
  );
  if (skillIndex < 0) return options.startBand;
  return bandAtGlowtrailPlanetIndex(options.startBand, skillIndex);
}

export function bandComplexityFactor(band: StoryReadingBand): number {
  const max = STORY_READING_BANDS.length - 1;
  return max <= 0 ? 0 : storyReadingBandIndex(band) / max;
}

export type NarrativeComplexity = "simple" | "standard" | "rich";

/** emerging	o simple, early/growing	o standard, fluent-ms	o rich. */
export function narrativeComplexityForBand(
  band: StoryReadingBand,
): NarrativeComplexity {
  if (band === "emerging") return "simple";
  if (band === "fluent-ms") return "rich";
  return "standard";
}
