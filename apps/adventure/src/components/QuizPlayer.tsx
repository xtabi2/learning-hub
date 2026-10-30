"use client";

import { useMemo, useState, useTransition } from "react";
import { submitAttemptAction } from "@/app/actions/play";
import { earnBookPartAction } from "@/app/actions/book";
import Link from "next/link";
import { SpokenPrompt } from "@/components/SpokenPrompt";
import { KidCelebration } from "@/components/KidCelebration";
import { NibblesCompanionBanner } from "@/components/NibblesCompanionBanner";
import {
  nibblesStartLine,
  nibblesWinLine,
  pickNibblesLine,
} from "@/lib/nibblesCompanion";

type QuizItem = {
  id: string;
  prompt: string;
  options: string[];
  sortOrder: number;
};

export function QuizPlayer({
  childId,
  skillTitle,
  items,
  planetId,
  bookPartId,
  returnHref,
  onBookPartEarned,
}: {
  childId: string;
  skillTitle: string;
  items: QuizItem[];
  /** Current adventure planet — enables Glowtrail arrive/win TTS beats. */
  planetId?: string | null;
  /** Phase 1 storybook: earn this hotspot part on first correct answer. */
  bookPartId?: string | null;
  /** Navigate-and-return target after a book lesson. */
  returnHref?: string | null;
  onBookPartEarned?: (result: {
    earned: boolean;
    alreadyHad: boolean;
    grantedGearId: string | null;
    newlyComplete: boolean;
    chapterComplete: boolean;
    earnedPartIds: string[];
  }) => void;
}) {
  const ordered = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    explanation: string;
    mastered: boolean;
    percent: number;
    windowSize: number;
  } | null>(null);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const item = ordered[index];
  const hasChoices = Boolean(item?.options?.length);
  const startLine = nibblesStartLine(planetId, childId);

  if (!item) {
    return (
      <div className="card">
        <p>No practice items are available for this skill yet.</p>
      </div>
    );
  }

  function onSubmit() {
    if (!selected || !item) return;
    setError(null);
    startTransition(async () => {
      const result = await submitAttemptAction({
        childId,
        itemId: item.id,
        answer: selected,
      });
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      if (
        "correct" in result &&
        typeof result.correct === "boolean" &&
        result.explanation &&
        typeof result.mastered === "boolean" &&
        typeof result.percent === "number" &&
        typeof result.windowSize === "number"
      ) {
        setFeedback({
          correct: result.correct,
          explanation: result.explanation,
          mastered: result.mastered,
          percent: result.percent,
          windowSize: result.windowSize,
        });
        if (result.correct) {
          setCelebrateKey((k) => k + 1);
          if (bookPartId) {
            const book = await earnBookPartAction({
              childId,
              partId: bookPartId,
            });
            if (!("error" in book) && book.ok) {
              onBookPartEarned?.({
                earned: book.earned,
                alreadyHad: book.alreadyHad,
                grantedGearId: book.grantedGearId,
                newlyComplete: book.newlyComplete,
                chapterComplete: book.chapterComplete,
                earnedPartIds: book.earnedPartIds,
              });
            }
          }
        }
      }
    });
  }

  function next() {
    setFeedback(null);
    setSelected(null);
    setIndex((value) => (value + 1) % ordered.length);
  }

  const feedbackLine = feedback
    ? feedback.correct
      ? feedback.mastered
        ? nibblesWinLine(planetId, celebrateKey)
        : pickNibblesLine("celebration", celebrateKey)
      : pickNibblesLine("miss_pep", celebrateKey)
    : "";

  return (
    <div className="card space-y-5">
      <KidCelebration
        playKey={celebrateKey}
        active={Boolean(feedback?.correct) && celebrateKey > 0}
      />
      {planetId ? (
        <NibblesCompanionBanner
          kind="before_task"
          line={startLine}
          seed={childId}
          // Karaoke + tap-a-word without autoSpeak so quiz item TTS stays primary.
          speak={false}
          compact
        />
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-pine-900">{skillTitle}</h1>
        <span className="rounded-full bg-pine-100 px-3 py-1 text-sm font-bold text-pine-800">
          Item {index + 1} of {ordered.length}
        </span>
      </div>
      <div className="flash-card">
        <SpokenPrompt text={item.prompt} autoSpeak />
        {!hasChoices && (
          <p className="mt-3 text-center text-lg text-pine-600">
            Look, listen, and tap the speaker to hear it again.
          </p>
        )}
      </div>
      {hasChoices && (
        <div className="grid gap-3" role="group" aria-label="Answer choices">
          {item.options.map((option) => {
            const isSelected = selected === option;
            return (
              <button
                key={option}
                type="button"
                disabled={Boolean(feedback) || pending}
                aria-pressed={isSelected}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty(
                    "--ripple-x",
                    `${event.clientX - rect.left}px`,
                  );
                  event.currentTarget.style.setProperty(
                    "--ripple-y",
                    `${event.clientY - rect.top}px`,
                  );
                  setSelected(option);
                }}
                className={`kid-option pr-12 ${
                  isSelected ? "kid-option-selected" : ""
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
      {error && (
        <p
          className="rounded-2xl border-2 border-red-500 bg-red-50 px-4 py-3 text-base font-semibold text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}
      {feedback && (
        <div
          className={
            feedback.correct ? "kid-feedback-ok" : "kid-feedback-retry"
          }
          role="status"
        >
          <p className="text-lg font-bold">
            {feedback.correct ? "Nice work!" : "Not quite — keep going."}
          </p>
          <p className="mt-1">{feedback.explanation}</p>
          <p className="mt-2 text-sm font-semibold opacity-90">
            Mission progress: {Math.round(feedback.percent * 100)}% over{" "}
            {feedback.windowSize} recent tries
            {feedback.mastered ? " — power-up earned!" : "."}
          </p>
          <div className="mt-3">
            <NibblesCompanionBanner
              kind={
                feedback.correct
                  ? feedback.mastered
                    ? "celebration"
                    : "after_clear"
                  : "miss_pep"
              }
              line={feedbackLine}
              seed={celebrateKey}
              speak
              compact
            />
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {!feedback ? (
          hasChoices ? (
            <button
              className="kid-primary"
              type="button"
              disabled={!selected || pending}
              onClick={onSubmit}
            >
              {pending ? "Checking..." : "Check answer"}
            </button>
          ) : (
            <button className="kid-primary" type="button" onClick={next}>
              Next card
            </button>
          )
        ) : (
          <button className="kid-primary" type="button" onClick={next}>
            Next item
          </button>
        )}
        {returnHref ? (
          <Link className="kid-celebrate" href={returnHref}>
            Back to the book
          </Link>
        ) : null}
      </div>
    </div>
  );
}
