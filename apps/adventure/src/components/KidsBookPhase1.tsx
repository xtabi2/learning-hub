"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QuizPlayer } from "@/components/QuizPlayer";
import { SpokenPrompt } from "@/components/SpokenPrompt";
import { KidCelebration } from "@/components/KidCelebration";
import {
  nibblesPoseArtSrc,
  NIBBLES_CHARACTER,
} from "@/lib/nibblesCompanion";
import {
  PHASE1_ART,
  PHASE1_BOOK_TITLE,
  PHASE1_HOTSPOTS,
  PHASE1_HOTSPOT_MIN_PX,
  PHASE1_KIDS_BOOK,
  PHASE1_PART_IDS,
  PHASE1_REDUCED_MOTION_MS,
  PHASE1_TURN_MS,
  bandText,
  coverCta,
  isPhase1PartId,
  karaokeForPage,
  nextBookPage,
  partArtSrc,
  partEarnLine,
  partFindLine,
  partKidLabel,
  poseForBookPage,
  prevBookPage,
  type BookPageId,
  type BookProgress,
  type Phase1PartId,
} from "@/lib/phase1KidsBook";
import type { StoryReadingBand } from "@/lib/storyReadingBand";

type LessonItem = {
  id: string;
  prompt: string;
  options: string[];
  sortOrder: number;
};

type KidsBookPhase1Props = {
  childId: string;
  childName: string;
  band: StoryReadingBand;
  initialProgress: BookProgress;
  lesson: {
    skillId: string;
    skillTitle: string;
    items: LessonItem[];
  } | null;
};

export function KidsBookPhase1({
  childId,
  childName,
  band,
  initialProgress,
  lesson,
}: KidsBookPhase1Props) {
  const [page, setPage] = useState<BookPageId>("cover");
  const [turning, setTurning] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress, setProgress] = useState<BookProgress>(initialProgress);
  const [lineOverride, setLineOverride] = useState<string | null>(null);
  const [lessonPart, setLessonPart] = useState<Phase1PartId | null>(null);
  const [missTick, setMissTick] = useState(0);
  const [celebrateKey, setCelebrateKey] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const turnMs = reduceMotion ? PHASE1_REDUCED_MOTION_MS : PHASE1_TURN_MS;

  const goTo = useCallback(
    (next: BookPageId | null) => {
      if (!next || next === page) return;
      setLineOverride(null);
      setTurning(true);
      window.setTimeout(() => {
        setPage(next);
        setTurning(false);
      }, turnMs);
    },
    [page, turnMs],
  );

  const karaoke = lineOverride ?? karaokeForPage(page, band);
  const poseId = poseForBookPage(page);
  const poseSrc = nibblesPoseArtSrc(poseId, 512);
  const next = nextBookPage(page);
  const prev = prevBookPage(page);
  const canAdvance =
    page !== "chapter" || progress.chapterComplete || bothEarned(progress);
  const showCompleteNext = page === "chapter" && canAdvance;

  const earnedSet = useMemo(
    () => new Set(progress.earnedPartIds),
    [progress.earnedPartIds],
  );

  function onHotspot(partId: Phase1PartId) {
    if (earnedSet.has(partId)) {
      setLineOverride(partEarnLine(partId, band));
      return;
    }
    setLineOverride(partFindLine(partId, band));
    setLessonPart(partId);
  }

  function onPageMiss() {
    setMissTick((n) => n + 1);
    setLineOverride(bandText(PHASE1_KIDS_BOOK.mistwhisper.partMiss, band));
  }

  const artSrc =
    page === "cover"
      ? PHASE1_ART.cover
      : page === "chapter" || page === "complete"
        ? PHASE1_ART.chapter
        : PHASE1_ART.intro;

  return (
    <div
      className="book-shell"
      data-book-page={page}
      data-chapter-complete={progress.chapterComplete ? "true" : "false"}
      data-reduced-motion={reduceMotion ? "true" : "false"}
    >
      <KidCelebration
        playKey={celebrateKey}
        active={celebrateKey > 0}
      />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Link className="btn-secondary" href={`/play/${childId}`}>
          Close book
        </Link>
        <p className="text-sm font-bold uppercase tracking-wide text-pine-600">
          {PHASE1_BOOK_TITLE}
          {childName ? ` · ${childName}` : ""}
        </p>
      </div>

      <div
        className={`book-spread ${turning ? "is-turning" : ""} ${
          reduceMotion ? "book-spread-fade" : "book-spread-turn"
        }`}
        style={{ ["--book-turn-ms" as string]: `${turnMs}ms` }}
      >
        <div className="book-stage">
          <img
            src={artSrc}
            alt=""
            className="book-stage-art"
            width={1024}
            height={1024}
          />
          {page !== "cover" ? (
            <img
              src={PHASE1_ART.pageEdge}
              alt=""
              className="book-page-edge"
              width={128}
              height={1024}
            />
          ) : null}

          <div className="book-nibbles" data-nibbles-pose={poseId}>
            <img
              src={poseSrc}
              alt={NIBBLES_CHARACTER.name}
              className="book-nibbles-live"
              width={160}
              height={160}
              onError={(event) => {
                const img = event.currentTarget;
                if (img.dataset.fallback === "avatar") return;
                img.dataset.fallback = "avatar";
                img.src = NIBBLES_CHARACTER.fallbackArtSrc;
              }}
            />
          </div>

          {page === "cover" ? (
            <CoverOverlay
              band={band}
              onOpen={() => goTo("intro-1")}
            />
          ) : null}

          {page === "chapter" ? (
            <ChapterHotspots
              earned={earnedSet}
              onHit={onHotspot}
              onMiss={onPageMiss}
            />
          ) : null}

          {page === "complete" ||
          (page === "chapter" && progress.chapterComplete) ? (
            <div className="book-star-badge" aria-hidden="true">
              ★
            </div>
          ) : null}

          <PartTray earned={earnedSet} />
        </div>

        <div className="book-karaoke">
          <SpokenPrompt text={karaoke} autoSpeak tapWords />
        </div>
      </div>

      {page !== "cover" ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="btn-secondary min-h-12"
            disabled={!prev || turning}
            onClick={() => goTo(prev)}
          >
            Back a page
          </button>
          {page === "complete" ? (
            <Link className="kid-primary" href={`/play/${childId}`}>
              Back to Star Nook
            </Link>
          ) : (
            <button
              type="button"
              className={showCompleteNext ? "kid-celebrate" : "kid-primary"}
              disabled={!next || turning || (page === "chapter" && !canAdvance)}
              onClick={() => goTo(page === "chapter" && canAdvance ? "complete" : next)}
            >
              {page === "chapter" && !canAdvance
                ? "Find both ship parts"
                : page === "intro-4"
                  ? "Chapter one"
                  : "Turn the page"}
            </button>
          )}
        </div>
      ) : null}

      {lessonPart && lesson ? (
        <LessonOverlay
          childId={childId}
          partId={lessonPart}
          lesson={lesson}
          onClose={() => setLessonPart(null)}
          onEarned={(result) => {
            setProgress({
              earnedPartIds: result.earnedPartIds.filter(isPhase1PartId),
              chapterComplete: result.chapterComplete,
            });
            setLineOverride(partEarnLine(lessonPart, band));
            setCelebrateKey((k) => k + 1);
            setLessonPart(null);
            if (result.chapterComplete) {
              window.setTimeout(() => goTo("complete"), turnMs + 400);
            }
          }}
        />
      ) : null}

      {lessonPart && !lesson ? (
        <div className="book-overlay" role="dialog" aria-label="Lesson needed">
          <div className="card space-y-4">
            <p className="text-lg font-semibold text-pine-900">
              A grown-up needs to open a Sound Scanners mission first.
            </p>
            <Link className="kid-primary" href={`/play/${childId}`}>
              Back to missions
            </Link>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setLessonPart(null)}
            >
              Stay on the page
            </button>
          </div>
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {missTick > 0 ? bandText(PHASE1_KIDS_BOOK.mistwhisper.partMiss, band) : ""}
      </span>
    </div>
  );
}

function bothEarned(progress: BookProgress): boolean {
  return PHASE1_PART_IDS.every((id) => progress.earnedPartIds.includes(id));
}

function CoverOverlay({
  band,
  onOpen,
}: {
  band: StoryReadingBand;
  onOpen: () => void;
}) {
  const book = PHASE1_KIDS_BOOK;
  return (
    <div className="book-cover-copy">
      <p className="font-display text-3xl text-pine-900 sm:text-4xl">
        {book.cover.title}
      </p>
      <p className="mt-1 text-base font-semibold text-pine-800">
        {book.cover.byline}
      </p>
      <button type="button" className="kid-celebrate mt-4" onClick={onOpen}>
        {coverCta(band)}
      </button>
    </div>
  );
}

function ChapterHotspots({
  earned,
  onHit,
  onMiss,
}: {
  earned: Set<string>;
  onHit: (id: Phase1PartId) => void;
  onMiss: () => void;
}) {
  return (
    <div className="book-hotspot-layer">
      <button
        type="button"
        className="book-hotspot-miss"
        aria-label="Look for ship parts in the fog"
        onClick={onMiss}
      />
      {PHASE1_HOTSPOTS.map((slot) => {
        const isEarned = earned.has(slot.id);
        return (
          <button
            key={slot.id}
            type="button"
            data-hotspot={slot.id}
            data-part-earned={isEarned ? "true" : "false"}
            aria-label={
              isEarned
                ? `${partKidLabel(slot.id)} earned`
                : `Tap the ${partKidLabel(slot.id)}`
            }
            className="book-hotspot"
            style={{
              left: `${slot.leftPct}%`,
              top: `${slot.topPct}%`,
              minWidth: PHASE1_HOTSPOT_MIN_PX,
              minHeight: PHASE1_HOTSPOT_MIN_PX,
            }}
            onClick={(event) => {
              event.stopPropagation();
              onHit(slot.id);
            }}
          >
            <img
              src={partArtSrc(slot.id, isEarned)}
              alt=""
              width={72}
              height={72}
            />
          </button>
        );
      })}
    </div>
  );
}

function PartTray({ earned }: { earned: Set<string> }) {
  return (
    <ul className="book-part-tray" aria-label="Ship tray stickers">
      {PHASE1_PART_IDS.map((id) => {
        const on = earned.has(id);
        return (
          <li key={id} data-tray-part={id} data-earned={on ? "true" : "false"}>
            <img src={partArtSrc(id, on)} alt={partKidLabel(id)} width={48} height={48} />
          </li>
        );
      })}
    </ul>
  );
}

function LessonOverlay({
  childId,
  partId,
  lesson,
  onClose,
  onEarned,
}: {
  childId: string;
  partId: Phase1PartId;
  lesson: { skillId: string; skillTitle: string; items: LessonItem[] };
  onClose: () => void;
  onEarned: (result: {
    earned: boolean;
    alreadyHad: boolean;
    grantedGearId: string | null;
    newlyComplete: boolean;
    chapterComplete: boolean;
    earnedPartIds: string[];
  }) => void;
}) {
  const returnHref = `/play/${childId}/book`;
  const fullHref = `/play/${childId}/skill/${lesson.skillId}?from=book&part=${partId}`;
  return (
    <div className="book-overlay" role="dialog" aria-label="Earn this ship part">
      <div className="book-overlay-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-2xl text-pine-900">
            Earn the {partKidLabel(partId)}
          </p>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <QuizPlayer
          childId={childId}
          skillTitle={lesson.skillTitle}
          planetId="mistwhisper"
          items={lesson.items}
          bookPartId={partId}
          returnHref={returnHref}
          onBookPartEarned={onEarned}
        />
        <Link className="btn-secondary inline-flex" href={fullHref}>
          Open full mission
        </Link>
      </div>
    </div>
  );
}
