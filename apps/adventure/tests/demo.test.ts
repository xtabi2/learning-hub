import { describe, expect, it } from "vitest";
import {
  DEMO_CHILD_GRADE,
  DEMO_CHILD_NAME,
  baselineBlockReasonForChild,
  filterRealChildren,
  isDemoChild,
} from "../src/lib/demo";

describe("demo naming constants", () => {
  it("uses the stable Demo Kid / grade 1 labels for startDemo", () => {
    expect(DEMO_CHILD_NAME).toBe("Demo Kid");
    expect(DEMO_CHILD_GRADE).toBe("1");
  });
});

describe("isDemoChild / filterRealChildren", () => {
  it("detects demo vs real profiles", () => {
    expect(isDemoChild({ isDemo: true })).toBe(true);
    expect(isDemoChild({ isDemo: false })).toBe(false);
  });

  it("filters dashboard-style lists to real children only", () => {
    const kids = [
      { id: "1", name: "Ada", isDemo: false },
      { id: "2", name: DEMO_CHILD_NAME, isDemo: true },
      { id: "3", name: "Bea", isDemo: false },
    ];
    expect(filterRealChildren(kids).map((k) => k.id)).toEqual(["1", "3"]);
  });

  it("returns an empty list when only the demo kid exists", () => {
    expect(filterRealChildren([{ id: "d", isDemo: true }])).toEqual([]);
  });
});

describe("baseline blocked for demo", () => {
  it("blocks baseline entry for demo profiles with a clear error", () => {
    expect(baselineBlockReasonForChild({ isDemo: true })).toBe(
      "Baseline entry is not available for the demo kid profile.",
    );
  });

  it("allows baseline entry for real children", () => {
    expect(baselineBlockReasonForChild({ isDemo: false })).toBeNull();
  });
});
