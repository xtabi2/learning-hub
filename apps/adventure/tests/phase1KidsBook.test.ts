import { describe, expect, it } from "vitest";
import { planetThemeById, gearById } from "../src/lib/galaxyCatalog";
import {
  PHASE1_CHAPTER_PLANET_ID,
  PHASE1_GEAR_UNLOCK_ID,
  PHASE1_GEAR_UNLOCK_PART_ID,
  PHASE1_HOTSPOTS,
  PHASE1_HOTSPOT_MIN_PX,
  PHASE1_KIDS_BOOK,
  PHASE1_PAGE_ORDER,
  PHASE1_PART_IDS,
  PHASE1_PROGRESS_STICKER_PART_ID,
  applyBookPartEarn,
  bandText,
  bothPartsEarned,
  emptyBookProgress,
  gearUnlockForPart,
  isPhase1PartId,
  karaokeForPage,
  nextBookPage,
  parseBookProgressJson,
  partEarnLine,
  partFindLine,
  pickBookLessonSkill,
  prevBookPage,
  serializeBookProgress,
} from "../src/lib/phase1KidsBook";
import { snapshotFromRow } from "../src/lib/adventure";

describe("Phase 1 kids-book catalog lock", () => {
  it("uses only boost-thruster and comet-fin hotspot ids", () => {
    expect(PHASE1_PART_IDS).toEqual(["boost-thruster", "comet-fin"]);
    expect(PHASE1_KIDS_BOOK.shipPartIds).toEqual(["boost-thruster", "comet-fin"]);
    expect(Object.keys(PHASE1_KIDS_BOOK.mistwhisper.parts)).toEqual([
      "boost-thruster",
      "comet-fin",
    ]);
    expect(PHASE1_HOTSPOTS.map((h) => h.id)).toEqual([
      "boost-thruster",
      "comet-fin",
    ]);
    const blob = JSON.stringify(PHASE1_KIDS_BOOK);
    expect(blob).not.toMatch(/ship-lamp|ship-bumper/);
    expect(isPhase1PartId("boost-thruster")).toBe(true);
    expect(isPhase1PartId("comet-fin")).toBe(true);
    expect(isPhase1PartId("ship-lamp")).toBe(false);
  });

  it("keeps Mistwhisper as the only chapter planet", () => {
    expect(PHASE1_KIDS_BOOK.chapter1PlanetId).toBe("mistwhisper");
    expect(PHASE1_CHAPTER_PLANET_ID).toBe("mistwhisper");
    expect(PHASE1_KIDS_BOOK.chapterCompleteWhen).toBe("both_parts_earned");
  });

  it("maps boost-thruster to existing fog-lantern-helm; comet-fin is sticker-only", () => {
    expect(PHASE1_GEAR_UNLOCK_PART_ID).toBe("boost-thruster");
    expect(PHASE1_PROGRESS_STICKER_PART_ID).toBe("comet-fin");
    expect(PHASE1_GEAR_UNLOCK_ID).toBe("fog-lantern-helm");
    expect(gearUnlockForPart("boost-thruster")).toBe("fog-lantern-helm");
    expect(gearUnlockForPart("comet-fin")).toBeNull();

    const mist = planetThemeById("mistwhisper");
    expect(mist?.requiredGearId).toBe("fog-lantern-helm");
    expect(gearById("fog-lantern-helm")?.id).toBe("fog-lantern-helm");
  });

  it("sizes hotspot slots at least 64px and keeps two rings only", () => {
    expect(PHASE1_HOTSPOT_MIN_PX).toBeGreaterThanOrEqual(64);
    expect(PHASE1_HOTSPOTS).toHaveLength(2);
  });
});

describe("Phase 1 copy bands", () => {
  it("keeps CW partFind / partEarn / pagePrompt lines", () => {
    expect(partFindLine("boost-thruster", "emerging")).toBe("A boost thruster!");
    expect(partFindLine("boost-thruster", "early")).toBe(
      "You found the boost thruster!",
    );
    expect(partFindLine("boost-thruster", "growing")).toBe(
      "You found the boost thruster—zoom power!",
    );
    expect(partFindLine("boost-thruster", "fluent-ms")).toBe(
      "You found the boost thruster—exactly the zoom this page needed!",
    );
    expect(partEarnLine("boost-thruster", "emerging")).toBe("Thruster earned!");
    expect(partEarnLine("boost-thruster", "fluent-ms")).toBe(
      "Boost thruster earned—sticker stamped on the ship tray!",
    );
    expect(partFindLine("comet-fin", "emerging")).toBe("A comet fin!");
    expect(partFindLine("comet-fin", "growing")).toBe(
      "You found the comet fin—steering sparkle!",
    );
    expect(partEarnLine("comet-fin", "early")).toBe(
      "Comet fin earned! Sticker on the tray!",
    );
    expect(bandText(PHASE1_KIDS_BOOK.mistwhisper.pagePrompt, "growing")).toBe(
      "This page hides a boost thruster and a comet fin in the fog. Tap each one!",
    );
    expect(bandText(PHASE1_KIDS_BOOK.mistwhisper.pagePrompt, "fluent-ms")).toBe(
      "A boost thruster and a comet fin are hiding in this foggy page. Tap each one to earn it for our ship.",
    );
  });

  it("joins karaoke-short cover/intro/complete lines", () => {
    expect(karaokeForPage("intro-1", "emerging")).toContain("Nibbles wakes up!");
    expect(karaokeForPage("complete", "early")).toMatch(/More chapters coming soon/);
    expect(PHASE1_KIDS_BOOK.cover.cta.emerging).toBe("Open the book");
  });
});

describe("applyBookPartEarn", () => {
  it("grants fog-lantern-helm only for boost-thruster", () => {
    const first = applyBookPartEarn(
      { bookProgress: emptyBookProgress(), gearOwned: [] },
      "boost-thruster",
    );
    expect(first.earned).toBe(true);
    expect(first.grantedGearId).toBe("fog-lantern-helm");
    expect(first.gearOwned).toEqual(["fog-lantern-helm"]);
    expect(first.bookProgress.earnedPartIds).toEqual(["boost-thruster"]);
    expect(first.bookProgress.chapterComplete).toBe(false);
    expect(first.newlyComplete).toBe(false);

    const second = applyBookPartEarn(
      {
        bookProgress: first.bookProgress,
        gearOwned: first.gearOwned,
      },
      "comet-fin",
    );
    expect(second.earned).toBe(true);
    expect(second.grantedGearId).toBeNull();
    expect(second.gearOwned).toEqual(["fog-lantern-helm"]);
    expect(second.bookProgress.chapterComplete).toBe(true);
    expect(second.newlyComplete).toBe(true);
    expect(bothPartsEarned(second.bookProgress.earnedPartIds)).toBe(true);
  });

  it("does not invent a gear id when comet-fin is earned first", () => {
    const fin = applyBookPartEarn(
      { bookProgress: emptyBookProgress(), gearOwned: [] },
      "comet-fin",
    );
    expect(fin.earned).toBe(true);
    expect(fin.grantedGearId).toBeNull();
    expect(fin.gearOwned).toEqual([]);
    expect(fin.bookProgress.chapterComplete).toBe(false);
  });

  it("is idempotent per part and ignores unknown ids", () => {
    const once = applyBookPartEarn(
      { bookProgress: emptyBookProgress(), gearOwned: [] },
      "boost-thruster",
    );
    const twice = applyBookPartEarn(
      { bookProgress: once.bookProgress, gearOwned: once.gearOwned },
      "boost-thruster",
    );
    expect(twice.earned).toBe(false);
    expect(twice.alreadyHad).toBe(true);
    expect(twice.grantedGearId).toBeNull();
    expect(twice.gearOwned).toEqual(["fog-lantern-helm"]);

    const bogus = applyBookPartEarn(
      { bookProgress: emptyBookProgress(), gearOwned: [] },
      "ship-lamp",
    );
    expect(bogus.earned).toBe(false);
    expect(bogus.bookProgress.earnedPartIds).toEqual([]);
  });

  it("does not duplicate fog-lantern-helm if already owned", () => {
    const result = applyBookPartEarn(
      {
        bookProgress: emptyBookProgress(),
        gearOwned: ["fog-lantern-helm"],
      },
      "boost-thruster",
    );
    expect(result.grantedGearId).toBeNull();
    expect(result.gearOwned).toEqual(["fog-lantern-helm"]);
    expect(result.earned).toBe(true);
  });
});

describe("book progress parse/serialize", () => {
  it("returns empty for missing or invalid JSON", () => {
    expect(parseBookProgressJson(null)).toEqual(emptyBookProgress());
    expect(parseBookProgressJson("")).toEqual(emptyBookProgress());
    expect(parseBookProgressJson("nope")).toEqual(emptyBookProgress());
    expect(parseBookProgressJson("[]")).toEqual(emptyBookProgress());
  });

  it("keeps locked ids only and stamps complete when both earned", () => {
    const parsed = parseBookProgressJson(
      JSON.stringify({
        earnedPartIds: ["boost-thruster", "ship-lamp", "comet-fin"],
        chapterComplete: false,
      }),
    );
    expect(parsed.earnedPartIds).toEqual(["boost-thruster", "comet-fin"]);
    expect(parsed.chapterComplete).toBe(true);
    expect(JSON.parse(serializeBookProgress(parsed))).toEqual({
      earnedPartIds: ["boost-thruster", "comet-fin"],
      chapterComplete: true,
    });
  });

  it("Phase 1 parse still locks Mistwhisper ids (adventure uses GlowTrails now)", () => {
    const parsed = parseBookProgressJson(
      JSON.stringify({
        earnedPartIds: ["comet-fin"],
        chapterComplete: false,
      }),
    );
    expect(parsed.earnedPartIds).toEqual(["comet-fin"]);
    expect(parsed.chapterComplete).toBe(false);
    // Adventure snapshot path now filters to GlowTrails Tidal ids only.
    const snap = snapshotFromRow({
      planetId: "nibbles",
      partsCollected: 0,
      shipPartsJson: "[]",
      readyToLeave: false,
      bookProgressJson: JSON.stringify({
        earnedPartIds: ["comet-fin", "oxygen-tank"],
        chapterComplete: false,
      }),
    });
    expect(snap.bookProgress.earnedPartIds).toEqual(["oxygen-tank"]);
    expect(snap.bookProgress.currentPlanetId).toBe("tidal");
  });
});

describe("book page model + lesson pick", () => {
  it("walks cover → intros → chapter → complete only", () => {
    expect(PHASE1_PAGE_ORDER).toEqual([
      "cover",
      "intro-1",
      "intro-2",
      "intro-3",
      "intro-4",
      "chapter",
      "complete",
    ]);
    expect(nextBookPage("cover")).toBe("intro-1");
    expect(nextBookPage("intro-4")).toBe("chapter");
    expect(nextBookPage("chapter")).toBe("complete");
    expect(nextBookPage("complete")).toBeNull();
    expect(prevBookPage("cover")).toBeNull();
    expect(prevBookPage("chapter")).toBe("intro-4");
  });

  it("prefers an unlocked Mistwhisper / phonemic_awareness skill", () => {
    const picked = pickBookLessonSkill({
      phonemic_awareness: [
        { id: "rhyme-locked", unlocked: false },
        { id: "rhyme-ready", unlocked: true },
      ],
      phonics: [{ id: "other-ready", unlocked: true }],
    });
    expect(picked?.id).toBe("rhyme-ready");
  });
});
