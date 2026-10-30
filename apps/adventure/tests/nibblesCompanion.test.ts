import { describe, expect, it } from "vitest";
import {
  HOME_HUB_ID,
  HOME_PLANET_ID,
  HOME_PLANET_NAME,
} from "../src/lib/adventure";
import {
  NIBBLES_CHARACTER,
  STAR_NOOK_HUB,
  isStarNookHubId,
  kidPlanetDisplayName,
  nibblesBlockerLine,
  nibblesCompanionArtSrc,
  nibblesLines,
  nibblesMorphGearArtSrc,
  nibblesMorphTeaser,
  nibblesPoseArtSrc,
  nibblesPoseIdForKind,
  pickNibblesLine,
  type NibblesLineKind,
} from "../src/lib/nibblesCompanion";
import { PLANET_THEME_POOL, shipTierDef } from "../src/lib/galaxyCatalog";

describe("Star Nook hub rename helpers", () => {
  it("keeps stable catalog id nibbles while kid display is Star Nook", () => {
    expect(HOME_PLANET_ID).toBe("nibbles");
    expect(HOME_HUB_ID).toBe("star-nook");
    expect(HOME_PLANET_NAME).toBe("Star Nook");
    expect(STAR_NOOK_HUB.planetId).toBe(HOME_PLANET_ID);
    expect(STAR_NOOK_HUB.hubId).toBe(HOME_HUB_ID);
    expect(STAR_NOOK_HUB.displayName).toBe("Star Nook");
  });

  it("maps hub ids to Star Nook display and leaves other planets alone", () => {
    expect(isStarNookHubId("nibbles")).toBe(true);
    expect(isStarNookHubId("star-nook")).toBe(true);
    expect(isStarNookHubId("mistwhisper")).toBe(false);
    expect(kidPlanetDisplayName("nibbles")).toBe("Star Nook");
    expect(kidPlanetDisplayName("star-nook")).toBe("Star Nook");
    expect(kidPlanetDisplayName("mistwhisper", "Mistwhisper")).toBe("Mistwhisper");
  });

  it("catalog theme for hub uses Star Nook label (not planet Nibbles)", () => {
    const hub = PLANET_THEME_POOL.find((p) => p.id === "nibbles");
    expect(hub?.name).toBe("Star Nook");
    expect(hub?.themeBlurb.toLowerCase()).toMatch(/dockyard|home base|moon/);
    expect(hub?.name.toLowerCase()).not.toBe("nibbles");
  });

  it("starter ship label references Star Nook, not place-name Nibbles", () => {
    expect(shipTierDef(1)?.label).toMatch(/Star Nook/i);
    expect(shipTierDef(1)?.label.toLowerCase()).not.toBe("nibbles hopper");
  });
});

describe("Nibbles companion character + line pickers", () => {
  it("defines Nibbles as companion character with art path", () => {
    expect(NIBBLES_CHARACTER.name).toBe("Nibbles");
    expect(NIBBLES_CHARACTER.artSrc).toBe("/nibbles-companion.png");
    expect(NIBBLES_CHARACTER.role).toMatch(/mechanic|guide/i);
  });

  it("pickNibblesLine is deterministic for a seed", () => {
    const a = pickNibblesLine("hub_welcome", "child-1");
    const b = pickNibblesLine("hub_welcome", "child-1");
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(10);
    expect(a.toLowerCase()).toMatch(/star nook|we|ship/);
  });

  it("exposes stub pools for each companion UX kind", () => {
    for (const kind of [
      "hub_welcome",
      "before_task",
      "after_clear",
      "miss_pep",
      "blocked_gear",
      "blocked_ship",
      "gear_unlock",
      "morph_teaser",
      "story_star_hint",
      "celebration",
      "galaxy_arrive",
      "map_nudge",
      "galaxy_clear",
    ] as const) {
      const pool = nibblesLines(kind);
      expect(pool.length).toBeGreaterThanOrEqual(1);
      expect(pickNibblesLine(kind, 0)).toBe(pool[0]);
    }
  });

  it("never shames misses — pep / morph retry language", () => {
    const miss = pickNibblesLine("miss_pep", 0);
    expect(miss.toLowerCase()).not.toMatch(
      /stupid|fail|wrong|bad job|you missed/,
    );
    expect(miss.toLowerCase()).toMatch(/try|together|morph|bounce|ready/);
  });

  it("explains blockers in gear/ship story terms", () => {
    const gear = nibblesBlockerLine({
      reason: "need_gear",
      gearLabel: "Glow Lantern",
      seed: 1,
    });
    expect(gear.toLowerCase()).toMatch(/gear|suit|morph/);
    expect(gear).toMatch(/Glow Lantern/);
    expect(gear.toLowerCase()).not.toMatch(
      /phonics|fluency|vocabulary|comprehension|literacy/,
    );

    const ship = nibblesBlockerLine({ reason: "need_ship_upgrade", seed: 2 });
    expect(ship.toLowerCase()).toMatch(/ship|hop|upgrade|star nook/);
    expect(ship.toLowerCase()).not.toMatch(/practice reading|mastery/);
  });

  it("morph teaser names the locked gear", () => {
    const tease = nibblesMorphTeaser("Fire Suit", "blaze");
    expect(tease).toMatch(/Fire Suit/);
    expect(tease.toLowerCase()).toMatch(/morph|gear|blob|temporary/);
  });
});

describe("Nibbles pose art by line kind", () => {
  it("maps each NibblesLineKind to the locked pose id", () => {
    const expected: Record<NibblesLineKind, string> = {
      hub_welcome: "welcome",
      before_task: "listen",
      after_clear: "thumbs",
      miss_pep: "oops",
      blocked_gear: "tinker",
      blocked_ship: "tinker",
      gear_unlock: "cheer",
      morph_teaser: "guide",
      story_star_hint: "reach-star",
      celebration: "cheer",
      galaxy_arrive: "welcome",
      map_nudge: "guide",
      galaxy_clear: "cheer",
    };
    for (const [kind, poseId] of Object.entries(expected) as [
      NibblesLineKind,
      string,
    ][]) {
      expect(nibblesPoseIdForKind(kind)).toBe(poseId);
    }
  });

  it("builds 512 banner and 128 badge pose paths", () => {
    expect(nibblesPoseArtSrc("welcome", 512)).toBe(
      "/adventure/nibbles/pose-welcome-512.png",
    );
    expect(nibblesPoseArtSrc("listen", 128)).toBe(
      "/adventure/nibbles/pose-listen.png",
    );
  });

  it("uses morph gear art for morph_teaser when gearId known", () => {
    expect(nibblesMorphGearArtSrc("fire-suit")).toBe(
      "/adventure/gear/morph-fire-suit.png",
    );
    expect(
      nibblesCompanionArtSrc({ kind: "morph_teaser", gearId: "hush-scarf" }),
    ).toBe("/adventure/gear/morph-hush-scarf.png");
    expect(nibblesCompanionArtSrc({ kind: "morph_teaser" })).toBe(
      "/adventure/nibbles/pose-guide-512.png",
    );
  });

  it("defaults companion banner art to 512 pose paths", () => {
    expect(nibblesCompanionArtSrc({ kind: "galaxy_arrive" })).toBe(
      "/adventure/nibbles/pose-welcome-512.png",
    );
    expect(nibblesCompanionArtSrc({ kind: "map_nudge", size: 128 })).toBe(
      "/adventure/nibbles/pose-guide.png",
    );
    expect(nibblesCompanionArtSrc({ kind: "blocked_gear" })).toBe(
      "/adventure/nibbles/pose-tinker-512.png",
    );
    // Fallback portrait constant unchanged for AUTH/demo/Glowtrail/TTS safety.
    expect(NIBBLES_CHARACTER.artSrc).toBe("/nibbles-companion.png");
  });
});
