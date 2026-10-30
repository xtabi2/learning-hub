import { existsSync } from "node:fs";
import path from "node:path";
import { TOWER_ART_DIR, TOWER_BOOKS, bookCoverFile, type TowerCovers } from "./launchTower";

/** Server-only: book cover art from public/adventure/tower/book-<id>.png when present. */
export function resolveTowerCovers(publicDir = path.join(process.cwd(), "public")): TowerCovers {
  const covers: TowerCovers = {};
  for (const b of TOWER_BOOKS) {
    const f = bookCoverFile(b.id);
    if (existsSync(path.join(publicDir, TOWER_ART_DIR, f))) covers[b.id] = `${TOWER_ART_DIR}/${f}`;
  }
  return covers;
}
