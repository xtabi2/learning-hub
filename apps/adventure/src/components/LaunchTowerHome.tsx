"use client";

import Link from "next/link";
import { useState } from "react";
import { SpokenPrompt } from "@/components/SpokenPrompt";
import {
  GROUND_LEVEL_INDEX,
  TOWER_ART,
  TOWER_HOME_LINE,
  TOWER_LEVELS,
  bookHref,
  booksForLevel,
  canGoDown,
  canGoUp,
  clampLevel,
  levelArt,
  type TowerBook,
  type TowerCovers,
} from "@/lib/launchTower";
import type { StoryReadingBand } from "@/lib/storyReadingBand";

type Props = {
  childId: string;
  childName: string;
  band: StoryReadingBand;
  isDemo?: boolean;
  covers?: TowerCovers;
  initialLevel?: number;
};

function BookCover({ childId, book, cover }: { childId: string; book: TowerBook; cover?: string }) {
  return (
    <Link href={bookHref(childId, book)} className="tower-book" data-book={book.id}>
      {cover ? (
        <img src={cover} alt="" className="tower-book-cover" width={256} height={256} />
      ) : (
        <span
          aria-hidden="true"
          className="tower-book-cover tower-book-cover-placeholder"
          style={{ background: `linear-gradient(135deg, ${book.colors[0]}, ${book.colors[1]})` }}
        >
          {book.emoji}
        </span>
      )}
      <span className="tower-book-title">{book.title}</span>
    </Link>
  );
}

/**
 * Kid home = Launch Tower book picker. One level at a time; elevator moves
 * Ground → 2 → 3 → 4 → Final. Each book title renders exactly once.
 */
export function LaunchTowerHome({
  childId,
  childName,
  band,
  isDemo = false,
  covers = {},
  initialLevel = GROUND_LEVEL_INDEX,
}: Props) {
  const [index, setIndex] = useState(() => clampLevel(initialLevel));
  const [dir, setDir] = useState<"up" | "down" | null>(null);
  const level = TOWER_LEVELS[index]!;
  const nextLevel = TOWER_LEVELS[index + 1];
  const books = booksForLevel(level.id);
  const left = books.filter((_, i) => i % 2 === 0);
  const right = books.filter((_, i) => i % 2 === 1);

  const move = (delta: 1 | -1) => {
    setDir(delta > 0 ? "up" : "down");
    setIndex((i) => clampLevel(i + delta));
  };

  return (
    <div className="launch-tower" data-launch-tower="home" data-level={level.id}>
      <div className="tower-top-bar">
        <p className="tower-who">
          {isDemo ? "Demo · " : ""}
          {childName ? `${childName}'s ` : ""}Launch Tower
        </p>
        <div className="flex gap-2">
          <Link className="tower-icon-btn" href="/dashboard" aria-label="Grown-up" title="Grown-up">
            <span aria-hidden="true">👤</span>
          </Link>
          <Link className="tower-icon-btn" href={`/report/${childId}`} aria-label="Report" title="Report">
            <span aria-hidden="true">📊</span>
          </Link>
        </div>
      </div>

      <div className="tower-line">
        <SpokenPrompt text={TOWER_HOME_LINE} autoSpeak={false} compact />
      </div>

      <div className="tower-stage">
        <div className="tower-sky">
          {books.length === 0 ? (
            <div className="tower-locked" data-locked="true">
              <span aria-hidden="true">✨</span> New books coming soon!
            </div>
          ) : null}
        </div>
        {nextLevel ? (
          <div className="tower-peek" aria-hidden="true" data-peek={nextLevel.id}>
            <img src={levelArt(nextLevel.id)} alt="" />
          </div>
        ) : null}
      <section
        key={level.id}
        className={`tower-level tower-level-${level.id === "final" ? "final" : level.id === "ground" ? "ground" : "floor"}`}
        aria-label={`Floor ${level.label}`}
      >
        <img src={levelArt(level.id)} alt="" className="tower-level-art" />
        <div className="tower-deck">
          <div className="tower-deck-side">
            {left.map((b) => (
              <BookCover key={b.id} childId={childId} book={b} cover={covers[b.id]} />
            ))}
          </div>
          <div className="tower-shaft" aria-hidden="true">
            <img
              src={TOWER_ART.car}
              alt=""
              className={`tower-car ${dir ? `tower-car-${dir}` : ""}`}
              width={256}
              height={320}
            />
          </div>
          <div className="tower-deck-side">
            {right.map((b) => (
              <BookCover key={b.id} childId={childId} book={b} cover={covers[b.id]} />
            ))}
          </div>
        </div>
      </section>
      </div>
      <div className="tower-elevator" role="group" aria-label="Elevator">
        <span className="tower-floor-chip" aria-live="polite" data-floor-chip>
          {level.label}
        </span>
        <button
          type="button"
          className="tower-elev-btn"
          onClick={() => move(1)}
          disabled={!canGoUp(index)}
          aria-label="Elevator up"
        >
          <img src={TOWER_ART.up} alt="" width={72} height={72} />
        </button>
        <button
          type="button"
          className="tower-elev-btn"
          onClick={() => move(-1)}
          disabled={!canGoDown(index)}
          aria-label="Elevator down"
        >
          <img src={TOWER_ART.down} alt="" width={72} height={72} />
        </button>
      </div>

    </div>
  );
}
