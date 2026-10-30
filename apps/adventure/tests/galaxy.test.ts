import { describe, expect, it } from "vitest";
import {
  HOME_PLANET_ID,
  buildPlanetOrder,
  canLandOnPlanet,
  canTravelToPlanet,
  canVisitPlanetIndex,
  checkGearGate,
  farthestReachableIndex,
  generateAdventureLayout,
  mapPillarsToPlanets,
  planetCountForChild,
  requiredShipTierForPlanetIndex,
} from "../src/lib/adventure";
import {
  GALAXIES,
  GEAR_CATALOG,
  migrateOwnedGearIds,
  canonicalizeGearId,
  GLOWTRAIL_PLANET_COUNT,
  GLOWTRAIL_SKILL_PLANET_IDS,
  GLOWTRAIL_STORY_BEATS,
  MAX_PLANETS_PER_GALAXY,
  MIN_PLANETS_PER_GALAXY,
  PLANET_THEME_POOL,
  galaxyForGrade,
  gearById,
  hashChildId,
  isGlowtrailSkillPlanet,
  planetThemeById,
} from "../src/lib/galaxyCatalog";

describe("galaxy catalog", () => {
  it("maps each grade K–3 to a galaxy", () => {
    expect(GALAXIES.map((g) => g.grade).sort()).toEqual(["1", "2", "3", "K"]);
    expect(galaxyForGrade("K").id).toBe("galaxy-k");
    expect(galaxyForGrade("1").id).toBe("galaxy-1");
    expect(galaxyForGrade("2").id).toBe("galaxy-2");
    expect(galaxyForGrade("3").id).toBe("galaxy-3");
  });

  it("names the starting (K) galaxy Glowtrail without a grade label for kids", () => {
    const glow = galaxyForGrade("K");
    expect(glow.name).toBe("Glowtrail Galaxy");
    expect(glow.name.toLowerCase()).not.toMatch(/grade|kindergarten|\bk\b/);
    expect(glow.blurb.toLowerCase()).toMatch(/story star/);
  });

  it("keeps original cartoon planet themes (no cuisine names)", () => {
    const blob = PLANET_THEME_POOL.map((p) => `${p.name} ${p.themeBlurb}`).join(
      " ",
    );
    expect(blob.toLowerCase()).not.toMatch(
      /pizza|burger|taco|sushi|cookie|cake|kitchen|chef|recipe|cuisine/,
    );
    expect(PLANET_THEME_POOL.some((p) => p.id === HOME_PLANET_ID)).toBe(true);
  });

  it("encodes Glowtrail 8 skill planets + Star Nook hub with gear", () => {
    expect(PLANET_THEME_POOL[0]?.id).toBe(HOME_PLANET_ID);
    expect(PLANET_THEME_POOL[0]?.name).toBe("Star Nook");
    expect(GLOWTRAIL_SKILL_PLANET_IDS).toEqual([
      "mistwhisper",
      "bouncebloom",
      "echo-canyon",
      "bubbledeep",
      "sizzle-rock",
      "flipcliff",
      "softsnow-drift",
      "sparktown-dock",
    ]);
    expect(GLOWTRAIL_PLANET_COUNT).toBe(9);

    const expectedGear: Record<string, string> = {
      mistwhisper: "fog-lantern-helm",
      bouncebloom: "spring-boots",
      "echo-canyon": "echo-headphones",
      bubbledeep: "scuba-bubble",
      "sizzle-rock": "fire-suit",
      flipcliff: "sticky-boots",
      "softsnow-drift": "hush-scarf",
      "sparktown-dock": "sorter-mitts",
    };
    expect(planetThemeById("softsnow-drift")?.morphArtId).toBe("hush-scarf");

    for (const id of GLOWTRAIL_SKILL_PLANET_IDS) {
      expect(isGlowtrailSkillPlanet(id)).toBe(true);
      const theme = planetThemeById(id);
      expect(theme, id).toBeTruthy();
      expect(theme!.requiredGearId).toBe(expectedGear[id]);
      expect(gearById(theme!.requiredGearId!)?.label.length).toBeGreaterThan(3);
      expect(theme!.themeBlurb.length).toBeGreaterThan(10);
      // Parent notes exist but are metadata only (kid blurbs must not echo jargon).
      expect(theme!.parentSkillNote.length).toBeGreaterThan(3);
      expect(theme!.themeBlurb.toLowerCase()).not.toMatch(
        /phonics|fluency|vocabulary|comprehension|phonological|decoding|literacy/,
      );
    }

    expect(isGlowtrailSkillPlanet(HOME_PLANET_ID)).toBe(false);
    expect(GEAR_CATALOG.map((g) => g.id)).toEqual(
      expect.arrayContaining(Object.values(expectedGear)),
    );
  });

  it("records Glowtrail story beat stubs for clear / ship upgrade", () => {
    expect(GLOWTRAIL_STORY_BEATS.galaxyId).toBe("galaxy-k");
    expect(GLOWTRAIL_STORY_BEATS.clearAllBrightensStoryStar).toBe(true);
    expect(GLOWTRAIL_STORY_BEATS.forwardAfterSparktownNeedsShipUpgrade).toBe(
      true,
    );
    expect(GLOWTRAIL_STORY_BEATS.sparktownPlanetId).toBe("sparktown-dock");
  });
});

describe("layout generation", () => {
  it("picks a deterministic planet count between 6 and pool size from childId", () => {
    const id = "child_abc123";
    const count = planetCountForChild(id);
    expect(count).toBeGreaterThanOrEqual(MIN_PLANETS_PER_GALAXY);
    expect(count).toBeLessThanOrEqual(
      Math.min(MAX_PLANETS_PER_GALAXY, PLANET_THEME_POOL.length),
    );
    expect(planetCountForChild(id)).toBe(count);
    expect(hashChildId(id)).toBe(hashChildId(id));
  });

  it("uses fixed Glowtrail order (Star Nook + 8) for grade K", () => {
    const order = buildPlanetOrder({ childId: "any-k-child", grade: "K" });
    expect(order).toEqual([HOME_PLANET_ID, ...GLOWTRAIL_SKILL_PLANET_IDS]);
    expect(order[0]).toBe(HOME_PLANET_ID);
    expect(order).toHaveLength(GLOWTRAIL_PLANET_COUNT);
  });

  it("forces Star Nook hub (id nibbles) first for grade 1 layouts", () => {
    const order = buildPlanetOrder({ childId: "seed-k1", grade: "1" });
    expect(order[0]).toBe(HOME_PLANET_ID);
    expect(order.length).toBeGreaterThanOrEqual(6);
    expect(order.length).toBeLessThanOrEqual(PLANET_THEME_POOL.length);
    expect(new Set(order).size).toBe(order.length);
  });

  it("is stable for the same childId + grade", () => {
    const a = generateAdventureLayout("stable-child", "K");
    const b = generateAdventureLayout("stable-child", "K");
    expect(a).toEqual(b);
    expect(a.galaxyId).toBe("galaxy-k");
    expect(a.shipTier).toBe(1);
    expect(a.currentPlanetId).toBe(HOME_PLANET_ID);
    expect(a.planetOrder[0]).toBe(HOME_PLANET_ID);
  });

  it("maps pillars onto planets for parent helpers only", () => {
    const order = buildPlanetOrder({ childId: "map-child", grade: "2" });
    const mapped = mapPillarsToPlanets(order);
    expect(mapped).toHaveLength(order.length);
    expect(mapped.every((m) => typeof m.pillar === "string")).toBe(true);
  });
});

describe("revisit vs forward travel rules", () => {
  const order = [
    HOME_PLANET_ID,
    "mistwhisper",
    "bouncebloom",
    "echo-canyon",
    "bubbledeep",
    "sizzle-rock",
  ];

  it("ship tier 1 only reaches the first planet; higher tiers unlock forward", () => {
    expect(farthestReachableIndex(1)).toBe(0);
    expect(canVisitPlanetIndex(0, 1)).toBe(true);
    expect(canVisitPlanetIndex(1, 1)).toBe(false);
    expect(canVisitPlanetIndex(1, 2)).toBe(true);
    expect(requiredShipTierForPlanetIndex(2)).toBe(3);
  });

  it("allows revisit within unlocked range without a new ship", () => {
    const revisit = canTravelToPlanet({
      planetOrder: order,
      fromPlanetId: "mistwhisper",
      toPlanetId: HOME_PLANET_ID,
      shipTier: 2,
    });
    expect(revisit.allowed).toBe(true);
    expect(revisit.reason).toBe("ok");
  });

  it("blocks forward travel until ship is upgraded", () => {
    const forward = canTravelToPlanet({
      planetOrder: order,
      fromPlanetId: HOME_PLANET_ID,
      toPlanetId: "mistwhisper",
      shipTier: 1,
    });
    expect(forward.allowed).toBe(false);
    expect(forward.reason).toBe("need_ship_upgrade");

    const unlocked = canTravelToPlanet({
      planetOrder: order,
      fromPlanetId: HOME_PLANET_ID,
      toPlanetId: "mistwhisper",
      shipTier: 2,
    });
    expect(unlocked.allowed).toBe(true);
  });
});

describe("gear gate checks", () => {
  it("allows landing on Star Nook hub with no gear", () => {
    expect(canLandOnPlanet(HOME_PLANET_ID, [])).toBe(true);
    expect(checkGearGate(HOME_PLANET_ID, []).ok).toBe(true);
  });

  it("blocks Mistwhisper until fog lantern helm is owned", () => {
    const gate = checkGearGate("mistwhisper", []);
    expect(gate.ok).toBe(false);
    if (!gate.ok) {
      expect(gate.gearId).toBe("fog-lantern-helm");
      expect(gate.gear.label).toMatch(/Fog Lantern Helm/i);
    }
    expect(canLandOnPlanet("mistwhisper", [])).toBe(false);
    expect(canLandOnPlanet("mistwhisper", ["fog-lantern-helm"])).toBe(true);
    // Legacy ownedGear id still unlocks via alias map
    expect(canLandOnPlanet("mistwhisper", ["glow-lantern"])).toBe(true);
  });

  it("requires fire suit for Sizzle Rock", () => {
    expect(canLandOnPlanet("sizzle-rock", ["glow-lantern"])).toBe(false);
    expect(canLandOnPlanet("sizzle-rock", ["fire-suit"])).toBe(true);
  });

  it("requires sorter mitts for Sparktown Dock (galaxy clear gate)", () => {
    expect(canLandOnPlanet("sparktown-dock", [])).toBe(false);
    expect(canLandOnPlanet("sparktown-dock", ["sorter-mitts"])).toBe(true);
    expect(canLandOnPlanet("sparktown-dock", ["sorter-gloves"])).toBe(true);
  });

  it("migrates legacy ownedGear ids to CW+GD locked ids", () => {
    expect(canonicalizeGearId("glow-lantern")).toBe("fog-lantern-helm");
    expect(canonicalizeGearId("scuba-bubbles")).toBe("scuba-bubble");
    expect(canonicalizeGearId("hush-soft-gear")).toBe("hush-scarf");
    expect(canonicalizeGearId("sorter-gloves")).toBe("sorter-mitts");
    expect(canonicalizeGearId("spring-boots")).toBe("spring-boots");
    expect(
      migrateOwnedGearIds([
        "glow-lantern",
        "fog-lantern-helm",
        "scuba-bubbles",
        "sorter-gloves",
      ]),
    ).toEqual(["fog-lantern-helm", "scuba-bubble", "sorter-mitts"]);
  });
});
