"use client";

import {
  GLOWTRAILS_ART,
  GLOWTRAILS_FIRST_PLANET_ID,
  GLOWTRAILS_PART_IDS,
  GLOWTRAILS_TIDAL,
  bandText,
  missionLabel,
  type BookProgress,
  type GlowTrailsPartId,
} from "@/lib/glowtrailsTidal";
import type { StoryReadingBand } from "@/lib/storyReadingBand";

type ShipHudDialogProps = {
  open: boolean;
  band: StoryReadingBand;
  progress: BookProgress;
  onTree: () => void;
  onExit: () => void;
  onClose: () => void;
};

/**
 * Ship HUD popup (not a route): star map with Tidal highlight, Tree → Story Tree,
 * Exit → restore exact prior spread.
 */
export function ShipHudDialog({
  open,
  band,
  progress,
  onTree,
  onExit,
  onClose,
}: ShipHudDialogProps) {
  if (!open) return null;

  const book = GLOWTRAILS_TIDAL;
  const earned = new Set(progress.earnedPartIds);
  const planetChip = bandText(book.hud.tidalPlanetChip, band);

  return (
    <div
      className="book-overlay ship-hud-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={bandText(book.hud.mapTitle, band)}
    >
      <div className="book-overlay-card ship-hud-card space-y-4">
        <div className="relative overflow-hidden rounded-2xl ship-hud-stage">
          <img
            src={GLOWTRAILS_ART.shipChrome}
            alt=""
            className="h-auto w-full object-cover"
            width={1024}
            height={1024}
          />
          <img
            src={GLOWTRAILS_ART.starMap}
            alt=""
            className="ship-hud-starmap-art"
            width={1024}
            height={1024}
          />
          <div className="ship-hud-map" data-planet={GLOWTRAILS_FIRST_PLANET_ID}>
            <p className="text-sm font-bold uppercase tracking-wide text-sky-100">
              {bandText(book.hud.mapTitle, band)}
            </p>
            <div
              className="ship-hud-planet is-current"
              data-planet-id="tidal"
              aria-current="true"
            >
              <span className="ship-hud-planet-dot" />
              <span>{planetChip}</span>
            </div>
            <ul className="ship-hud-missions" aria-label="Tidal missions">
              {GLOWTRAILS_PART_IDS.map((id: GlowTrailsPartId) => (
                <li
                  key={id}
                  data-mission={id}
                  data-earned={earned.has(id) ? "true" : "false"}
                >
                  {missionLabel(id, band)}
                  {earned.has(id) ? " ★" : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="kid-primary min-h-14"
            onClick={onTree}
          >
            {bandText(book.hud.treeControl, band)}
          </button>
          <button
            type="button"
            className="kid-celebrate min-h-14"
            onClick={onExit}
          >
            {bandText(book.hud.shipExit, band)}
          </button>
          <button type="button" className="btn-secondary min-h-14" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
