"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizPlayer } from "@/components/QuizPlayer";
import { SpokenPrompt } from "@/components/SpokenPrompt";
import { KidCelebration } from "@/components/KidCelebration";
import { ShipHudDialog } from "@/components/ShipHudDialog";
import {
  nibblesPoseArtSrc,
  NIBBLES_CHARACTER,
} from "@/lib/nibblesCompanion";
import {
  GLOWTRAILS_ART,
  GLOWTRAILS_BOOK_TITLE,
  GLOWTRAILS_HOTSPOTS,
  GLOWTRAILS_HOTSPOT_MIN_PX,
  GLOWTRAILS_PART_IDS,
  GLOWTRAILS_REDUCED_MOTION_MS,
  GLOWTRAILS_TIDAL,
  GLOWTRAILS_TURN_MS,
  activePartId,
  bandText,
  hintAfterMs,
  isGlowTrailsPartId,
  karaokeForPage,
  nextBookPage,
  partArtSrc,
  partEarnLine,
  partFindLine,
  partHintLine,
  partKidLabel,
  partOverviewArtSrc,
  poseForBookPage,
  prevBookPage,
  spreadArtSrc,
  type BookPageId,
  type BookProgress,
  type GlowTrailsPartId,
} from "@/lib/glowtrailsTidal";
import type { StoryReadingBand } from "@/lib/storyReadingBand";

type LessonItem = {
  id: string;
  prompt: string;
  options: string[];
  sortOrder: number;
};

type GlowTrailsBookProps = {
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

type SpreadPhase = "overview" | "find" | "hint";

/**
 * GlowTrails book: Nibbles intro → Tidal chapter → 3 soft find-it spreads
 * (lessons on find → earn stickers) → chapter complete. Ship HUD is a dialog.
 */
export function GlowTrailsBook({
  childId,
  childName,
  band,
  initialProgress,
  lesson,
}: GlowTrailsBookProps) {
  const router = useRouter();
  const startPage: BookPageId = initialProgress.chapterComplete
    ? "complete"
    : initialProgress.earnedPartIds.length > 0 ||
        initialProgress.spreadIndex > 0
      ? "spread"
      : "intro-1";

  const [page, setPage] = useState<BookPageId>(startPage);
  const [turning, setTurning] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress, setProgress] = useState<BookProgress>(initialProgress);
  const [lineOverride, setLineOverride] = useState<string | null>(null);
  const [lessonPart, setLessonPart] = useState<GlowTrailsPartId | null>(null);
  const [missTick, setMissTick] = useState(0);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [hudOpen, setHudOpen] = useState(false);
  const [spreadPhase, setSpreadPhase] = useState<SpreadPhase>("overview");
  const [isDesktopSpread, setIsDesktopSpread] = useState(false);
  const resumePageRef = useRef<BookPageId>(startPage);
  const resumeSpreadIndexRef = useRef(initialProgress.spreadIndex);
  const hintTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktopSpread(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const turnMs = reduceMotion ? GLOWTRAILS_REDUCED_MOTION_MS : GLOWTRAILS_TURN_MS;
  const partId = activePartId(progress);

  const clearHintTimer = useCallback(() => {
    if (hintTimerRef.current != null) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (next: BookPageId | null) => {
      if (!next || next === page) return;
      setLineOverride(null);
      setTurning(true);
      clearHintTimer();
      if (next === "spread") {
        setSpreadPhase("overview");
      }
      window.setTimeout(() => {
        setPage(next);
        setTurning(false);
      }, turnMs);
    },
    [page, turnMs, clearHintTimer],
  );

  // 180s post-overview hint (from canonical copy hintAfterMs).
  useEffect(() => {
    clearHintTimer();
    if (page !== "spread" || spreadPhase !== "overview") return;
    if (progress.earnedPartIds.includes(partId)) return;
    const ms = hintAfterMs();
    hintTimerRef.current = window.setTimeout(() => {
      setSpreadPhase("hint");
      setLineOverride(partHintLine(partId, band));
    }, ms);
    return clearHintTimer;
  }, [
    page,
    spreadPhase,
    partId,
    band,
    progress.earnedPartIds,
    clearHintTimer,
  ]);

  const karaoke =
    lineOverride ??
    (page === "spread" && spreadPhase === "hint"
      ? partHintLine(partId, band)
      : karaokeForPage(page, band, progress));
  const poseId = poseForBookPage(page);
  const poseSrc = nibblesPoseArtSrc(poseId, 512);
  const next = nextBookPage(page);
  const prev = prevBookPage(page);

  const earnedSet = useMemo(
    () => new Set(progress.earnedPartIds),
    [progress.earnedPartIds],
  );

  const canAdvanceSpread =
    earnedSet.has(partId) ||
    progress.chapterComplete ||
    allEarned(progress);

  function onHotspot(hitId: GlowTrailsPartId) {
    if (hitId !== partId) {
      onPageMiss();
      return;
    }
    if (earnedSet.has(hitId)) {
      setLineOverride(partEarnLine(hitId, band));
      return;
    }
    clearHintTimer();
    setSpreadPhase("find");
    setLineOverride(partFindLine(hitId, band));
    setLessonPart(hitId);
  }

  function onPageMiss() {
    setMissTick((n) => n + 1);
    setLineOverride(bandText(GLOWTRAILS_TIDAL.tidal.partMiss, band));
  }

  function openHud() {
    resumePageRef.current = page;
    resumeSpreadIndexRef.current = progress.spreadIndex;
    setHudOpen(true);
  }

  function exitHudToExactSpread() {
    setHudOpen(false);
    setProgress((p) => ({
      ...p,
      spreadIndex: resumeSpreadIndexRef.current,
    }));
    setPage(resumePageRef.current);
    setLineOverride(null);
  }

  const artSrc =
    page === "spread" || page === "complete" || page === "chapter-open"
      ? spreadArtSrc(partId)
      : GLOWTRAILS_ART.fruitGlowTrails;

  const hotspot = GLOWTRAILS_HOTSPOTS.find((h) => h.id === partId)!;

  return (
    <div
      className={`book-shell glowtrails-book ${
        isDesktopSpread ? "is-desktop-spread" : "is-mobile-spread"
      }`}
      data-book-page={page}
      data-spread-phase={spreadPhase}
      data-part={partId}
      data-chapter-complete={progress.chapterComplete ? "true" : "false"}
      data-reduced-motion={reduceMotion ? "true" : "false"}
    >
      <KidCelebration playKey={celebrateKey} active={celebrateKey > 0} />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <button type="button" className="btn-secondary min-h-12" onClick={openHud}>
          {bandText(GLOWTRAILS_TIDAL.hud.goToShip, band)}
        </button>
        <p className="text-sm font-bold uppercase tracking-wide text-pine-600">
          {GLOWTRAILS_BOOK_TITLE}
          {childName ? ` · ${childName}` : ""}
          {" · Tidal"}
        </p>
        <Link className="btn-secondary min-h-12" href={`/play/${childId}`}>
          {bandText(GLOWTRAILS_TIDAL.hud.treeControl, band)}
        </Link>
      </div>

      <div
        className={`book-spread ${turning ? "is-turning" : ""} ${
          reduceMotion ? "book-spread-fade" : "book-spread-turn"
        }`}
        style={{ ["--book-turn-ms" as string]: `${turnMs}ms` }}
      >
        <div className="book-stage glowtrails-stage">
          <img
            src={artSrc}
            alt=""
            className="book-stage-art"
            width={1024}
            height={1024}
          />

          {page === "spread" ? (
            <div className="glowtrails-overview-chip" aria-hidden="true">
              <img
                src={partOverviewArtSrc(partId)}
                alt=""
                width={96}
                height={96}
              />
            </div>
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

          {page === "spread" ? (
            <SoftFindLayer
              partId={partId}
              hotspot={hotspot}
              earned={earnedSet.has(partId)}
              onHit={onHotspot}
              onMiss={onPageMiss}
            />
          ) : null}

          {page === "complete" || progress.chapterComplete ? (
            <div className="book-star-badge" aria-hidden="true">
              ★
            </div>
          ) : null}

          <PartTray earned={earnedSet} />
        </div>

        {isDesktopSpread && page === "spread" ? (
          <div className="glowtrails-verso" aria-hidden="true">
            <img
              src={partOverviewArtSrc(partId)}
              alt=""
              width={256}
              height={256}
            />
            <p className="mt-2 text-center text-base font-semibold text-pine-800">
              Match the picture
            </p>
          </div>
        ) : null}

        <div className="book-karaoke">
          <SpokenPrompt text={karaoke} autoSpeak tapWords />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="btn-secondary min-h-12"
          disabled={!prev || turning || page === "spread"}
          onClick={() => goTo(prev)}
        >
          Back a page
        </button>
        {page === "complete" ? (
          <Link className="kid-primary" href={`/play/${childId}`}>
            {bandText(GLOWTRAILS_TIDAL.hud.treeControl, band)}
          </Link>
        ) : page === "spread" ? (
          <button
            type="button"
            className={canAdvanceSpread ? "kid-celebrate" : "kid-primary"}
            disabled={turning || !canAdvanceSpread}
            onClick={() => {
              if (progress.chapterComplete || allEarned(progress)) {
                goTo("complete");
                return;
              }
              // Advance to next unearned spread in-place.
              setLineOverride(null);
              setSpreadPhase("overview");
              setProgress((p) => ({
                ...p,
                spreadIndex: Math.min(
                  p.spreadIndex + 1,
                  GLOWTRAILS_PART_IDS.length - 1,
                ),
              }));
            }}
          >
            {canAdvanceSpread
              ? progress.chapterComplete || allEarned(progress)
                ? "Finish Tidal"
                : "Next spread"
              : `Find the ${partKidLabel(partId)}`}
          </button>
        ) : (
          <button
            type="button"
            className="kid-primary"
            disabled={!next || turning}
            onClick={() => goTo(next)}
          >
            {page === "intro-4"
              ? "Planet Tidal"
              : page === "chapter-open"
                ? "Start looking"
                : "Turn the page"}
          </button>
        )}
      </div>

      {lessonPart && lesson ? (
        <LessonOverlay
          childId={childId}
          partId={lessonPart}
          lesson={lesson}
          onClose={() => setLessonPart(null)}
          onEarned={(result) => {
            const earnedPartIds = result.earnedPartIds.filter(isGlowTrailsPartId);
            setProgress({
              earnedPartIds,
              chapterComplete: result.chapterComplete,
              spreadIndex: result.chapterComplete
                ? GLOWTRAILS_PART_IDS.length - 1
                : Math.max(
                    progress.spreadIndex,
                    GLOWTRAILS_PART_IDS.findIndex(
                      (id) => !earnedPartIds.includes(id),
                    ),
                  ),
              currentPlanetId: progress.currentPlanetId,
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
              Back to Story Tree
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

      <ShipHudDialog
        open={hudOpen}
        band={band}
        progress={progress}
        onTree={() => {
          setHudOpen(false);
          router.push(`/play/${childId}`);
        }}
        onExit={exitHudToExactSpread}
        onClose={() => setHudOpen(false)}
      />

      <span className="sr-only" aria-live="polite">
        {missTick > 0
          ? bandText(GLOWTRAILS_TIDAL.tidal.partMiss, band)
          : ""}
      </span>
    </div>
  );
}

function allEarned(progress: BookProgress): boolean {
  return GLOWTRAILS_PART_IDS.every((id) => progress.earnedPartIds.includes(id));
}

function SoftFindLayer({
  partId,
  hotspot,
  earned,
  onHit,
  onMiss,
}: {
  partId: GlowTrailsPartId;
  hotspot: { id: GlowTrailsPartId; leftPct: number; topPct: number };
  earned: boolean;
  onHit: (id: GlowTrailsPartId) => void;
  onMiss: () => void;
}) {
  return (
    <div className="book-hotspot-layer glowtrails-soft-find">
      <button
        type="button"
        className="book-hotspot-miss"
        aria-label={`Look for the ${partKidLabel(partId)}`}
        onClick={onMiss}
      />
      <button
        type="button"
        data-hotspot={hotspot.id}
        data-part-earned={earned ? "true" : "false"}
        aria-label={
          earned
            ? `${partKidLabel(partId)} earned`
            : `Tap the ${partKidLabel(partId)}`
        }
        className="book-hotspot glowtrails-hotspot"
        style={{
          left: `${hotspot.leftPct}%`,
          top: `${hotspot.topPct}%`,
          minWidth: GLOWTRAILS_HOTSPOT_MIN_PX,
          minHeight: GLOWTRAILS_HOTSPOT_MIN_PX,
        }}
        onClick={(event) => {
          event.stopPropagation();
          onHit(hotspot.id);
        }}
      >
        {/* Soft find: invisible hit; no gold ring chrome */}
        <span className="sr-only">{partKidLabel(partId)}</span>
      </button>
      {earned ? (
        <img
          className="glowtrails-earned-sticker"
          src={partArtSrc(partId, true)}
          alt=""
          width={72}
          height={72}
          style={{
            left: `${hotspot.leftPct}%`,
            top: `${hotspot.topPct}%`,
          }}
        />
      ) : null}
    </div>
  );
}

function PartTray({ earned }: { earned: Set<string> }) {
  return (
    <ul className="book-part-tray" aria-label="Ship tray stickers">
      {GLOWTRAILS_PART_IDS.map((id) => {
        const on = earned.has(id);
        return (
          <li key={id} data-tray-part={id} data-earned={on ? "true" : "false"}>
            <img
              src={partArtSrc(id, on)}
              alt={partKidLabel(id)}
              width={48}
              height={48}
            />
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
  partId: GlowTrailsPartId;
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
          planetId="tidal"
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
