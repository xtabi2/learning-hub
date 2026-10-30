"use client";

import { useEffect } from "react";
import { hub } from "../../../../shared/index.js";

/**
 * Copies launch-tower progress onto the hub child when the names match.
 * The parent portal keeps its own saved children and database progress.
 */
export function HubChildBridge({
  portalChildName,
  storyReadingBand,
  partsCollected,
  readyToLeave,
}: {
  portalChildName: string;
  storyReadingBand: string;
  partsCollected: number;
  readyToLeave: boolean;
}) {
  useEffect(() => {
    const current = hub().getCurrentChild();
    if (!current) return;
    const sameName = current.name.trim().toLowerCase() === portalChildName.trim().toLowerCase();
    hub().recordProgress(current.id, {
      adventure: {
        lastOpenedAt: new Date().toISOString(),
        ...(sameName ? { storyReadingBand, partsCollected, readyToLeave, updatedAt: new Date().toISOString() } : {}),
      },
    });
  }, [portalChildName, storyReadingBand, partsCollected, readyToLeave]);

  return null;
}
