/**
 * Demo kid profile helpers. Demo progress is isolated on isDemo=true rows
 * and must never mix with real children's mastery/baselines.
 */

export const DEMO_CHILD_NAME = "Demo Kid";
export const DEMO_CHILD_GRADE = "1";

export function isDemoChild(child: { isDemo: boolean }): boolean {
  return child.isDemo === true;
}

/** Dashboard lists real kids only — demo profiles are filtered out. */
export function filterRealChildren<T extends { isDemo: boolean }>(
  children: T[],
): T[] {
  return children.filter((c) => !isDemoChild(c));
}

/**
 * Parent-entered school baselines are blocked for demo profiles.
 * Returns an error message when blocked, otherwise null.
 */
export function baselineBlockReasonForChild(child: {
  isDemo: boolean;
}): string | null {
  if (isDemoChild(child)) {
    return "Baseline entry is not available for the demo kid profile.";
  }
  return null;
}
