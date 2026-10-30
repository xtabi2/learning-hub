/**
 * Placement completion / navigation contracts used by the server action
 * and PlacementQuiz client. Keeping these pure avoids redirect-on-complete
 * (which previously crashed the client transition).
 */

export type PlacementCompleteOk = { ok: true; childId: string };

/** Success payload from completePlacementAction — never redirects. */
export function placementCompleteOk(childId: string): PlacementCompleteOk {
  return { ok: true as const, childId };
}

/** Client navigates here via router.push after a successful complete. */
export function placementPlayPath(childId: string): string {
  return `/play/${childId}`;
}

/**
 * Strong pillar on placement (≥80% correct with at least one item) unlocks
 * that pillar's entry skill via synthetic mastery.
 */
export function isStrongPlacementPillar(bucket?: {
  correct: number;
  total: number;
}): boolean {
  return Boolean(
    bucket && bucket.total > 0 && bucket.correct / bucket.total >= 0.8,
  );
}
