import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LaunchTowerHome } from "../src/components/LaunchTowerHome";
import {
  TOP_LEVEL_INDEX,
  TOWER_BOOKS,
  TOWER_LEVELS,
  booksForLevel,
  canGoDown,
  canGoUp,
  clampLevel,
  levelArt,
} from "../src/lib/launchTower";

const render = (initialLevel?: number) =>
  renderToStaticMarkup(
    createElement(LaunchTowerHome, { childId: "kid1", childName: "Ava", band: "early", initialLevel }),
  );
const count = (html: string, s: string) => html.split(s).length - 1;

describe("launch tower levels", () => {
  it("has exactly 5 levels: Ground, 2, 3, 4, Final", () => {
    expect(TOWER_LEVELS.map((l) => l.label)).toEqual(["Ground", "2", "3", "4", "Final"]);
    expect(TOWER_LEVELS.some((l) => /5th/.test(l.label))).toBe(false);
  });
  it("maps every book to a real level; GlowTrails is on Ground", () => {
    const ids = new Set(TOWER_LEVELS.map((l) => l.id));
    for (const b of TOWER_BOOKS) expect(ids.has(b.level)).toBe(true);
    expect(booksForLevel("ground").map((b) => b.id)).toContain("glowtrails-tidal");
    expect(new Set(TOWER_BOOKS.map((b) => b.id)).size).toBe(TOWER_BOOKS.length);
  });
  it("uses ground/floor/final art", () => {
    expect(levelArt("ground")).toMatch(/tower-ground/);
    for (const id of ["2", "3", "4"] as const) expect(levelArt(id)).toMatch(/tower-floor/);
    expect(levelArt("final")).toMatch(/tower-final/);
  });
});

describe("elevator bounds", () => {
  it("clamps between Ground and Final", () => {
    expect(clampLevel(-3)).toBe(0);
    expect(clampLevel(99)).toBe(TOP_LEVEL_INDEX);
    expect(clampLevel(NaN)).toBe(0);
    expect(canGoDown(0)).toBe(false);
    expect(canGoUp(0)).toBe(true);
    expect(canGoUp(TOP_LEVEL_INDEX)).toBe(false);
    expect(canGoDown(TOP_LEVEL_INDEX)).toBe(true);
  });
});

describe("LaunchTowerHome render", () => {
  it("starts at Ground and shows the GlowTrails title exactly once", () => {
    const html = render();
    expect(html).toContain('data-level="ground"');
    expect(count(html, "GlowTrails")).toBe(1);
    expect(html).toContain('href="/play/kid1/book"');
    expect(html).not.toContain("Story Tree");
    expect(html).toContain('data-peek="2"');
  });
  it("narrates one tappable line, identical on every floor, with no fruit wording", () => {
    for (const lvl of [0, 2, TOP_LEVEL_INDEX]) {
      const html = render(lvl);
      for (const w of ["Ride", "elevator", "book", "blast"]) expect(html).toContain(`>${w}<`);
      expect(html.toLowerCase()).not.toContain("fruit");
      expect(count(html, 'class="tower-line"')).toBe(1);
    }
  });
  it("top floor is labeled Final with a coming-soon lock and disabled up button", () => {
    const html = render(TOP_LEVEL_INDEX);
    expect(html).toMatch(/data-floor-chip[^>]*>Final</);
    expect(html).toContain('data-locked="true"');
    expect(html).toContain("✨");
    expect(html).not.toContain("data-peek");
    // pill lives in the sky area, not inside the deck with the elevator car
    expect(html.indexOf('data-locked')).toBeLessThan(html.indexOf("tower-deck"));
    expect(html).not.toContain("🔒");
    expect(html).toMatch(/disabled=""[^>]*aria-label="Elevator up"/);
    expect(count(html, "GlowTrails")).toBe(0);
  });
});
