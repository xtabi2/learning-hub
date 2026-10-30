"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completePlacementAction } from "@/app/actions/play";
import { placementPlayPath } from "@/lib/placement";
import { SpokenPrompt } from "@/components/SpokenPrompt";

type PlacementItem = {
  id: string;
  prompt: string;
  options: string[];
};

export function PlacementQuiz({
  childId,
  items,
}: {
  childId: string;
  items: PlacementItem[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (Object.keys(answers).length < items.length) {
      setError("Please answer every question before finishing placement.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await completePlacementAction({
          childId,
          answers: items.map((item) => ({
            itemId: item.id,
            answer: answers[item.id],
          })),
        });
        if (result?.ok) {
          router.push(placementPlayPath(result.childId));
          router.refresh();
          return;
        }
        setError("Placement could not be saved. Please try again.");
      } catch {
        setError("Placement could not be saved. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="card">
        <h1 className="font-display text-pine-900">How to play · first mission</h1>
        <p className="mt-2 text-pine-700">
          This short how-to helps Nibbles set your story steps. Tap answers, hear
          the words, and we will chart Glowtrail together afterward.
        </p>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className="card space-y-4">
          <p className="text-sm font-bold uppercase tracking-wide text-pine-600">
            Question {index + 1}
          </p>
          <div className="flash-card">
            <SpokenPrompt text={item.prompt} autoSpeak={index === 0} />
          </div>
          <div
            className="grid gap-3"
            role="group"
            aria-label={`Choices for question ${index + 1}`}
          >
            {item.options.map((option) => {
              const selected = answers[item.id] === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
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
                    setAnswers((current) => ({ ...current, [item.id]: option }));
                  }}
                  className={`kid-option pr-12 ${
                    selected ? "kid-option-selected" : ""
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {error && (
        <p
          className="rounded-2xl border-2 border-red-500 bg-red-50 px-4 py-3 text-base font-semibold text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}
      <button
        className="kid-primary"
        type="button"
        disabled={pending}
        onClick={submit}
      >
        {pending ? "Saving placement..." : "Finish placement"}
      </button>
    </div>
  );
}
