import {
  BASELINE_BANDS,
  type BaselineBand,
  type Pillar,
  PILLARS,
} from "./constants";

/**
 * Home-lab heuristic only — NOT official ODE/district/vendor cut scores.
 * Maps a coarse parent-picked band to how many skills (ordered by sortOrder
 * within a pillar) receive synthetic mastery so practice can start closer to
 * the right level without unlocking the whole path arbitrarily.
 */
export function skillsToMasterCount(
  band: BaselineBand,
  skillCount: number,
): number {
  if (skillCount <= 0) return 0;
  switch (band) {
    case "well_below":
    case "below":
      return 0;
    case "approaching":
      return Math.min(1, skillCount);
    case "on_grade":
      return Math.min(Math.max(1, Math.ceil(skillCount / 2)), skillCount);
    case "above":
      // Leave the last node in a chain for practice when possible.
      return skillCount === 1 ? 1 : skillCount - 1;
    default:
      return 0;
  }
}

export function isBaselineBand(value: string): value is BaselineBand {
  return (BASELINE_BANDS as readonly string[]).includes(value);
}

export type BaselineBands = Partial<Record<Pillar, BaselineBand>>;

export function parseBandsJson(raw: string): BaselineBands {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: BaselineBands = {};
    for (const pillar of PILLARS) {
      const value = parsed[pillar];
      if (typeof value === "string" && isBaselineBand(value)) {
        out[pillar] = value;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function serializeBandsJson(bands: BaselineBands): string {
  const out: Record<string, BaselineBand> = {};
  for (const pillar of PILLARS) {
    const band = bands[pillar];
    if (band) out[pillar] = band;
  }
  return JSON.stringify(out);
}

/**
 * Given skills for one pillar (already sorted by sortOrder), return the
 * skill ids that should receive synthetic mastery for the chosen band.
 */
export function skillIdsForBand(
  band: BaselineBand,
  skills: { id: string; sortOrder: number }[],
): string[] {
  const ordered = skills.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const count = skillsToMasterCount(band, ordered.length);
  return ordered.slice(0, count).map((s) => s.id);
}
