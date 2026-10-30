"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  segmentPrompt,
  speakableWordToken,
  wordIndexAtChar,
} from "@/lib/spokenPrompt";

type SpokenPromptProps = {
  text: string;
  /** Speak automatically when the prompt is shown / text changes. */
  autoSpeak?: boolean;
  /**
   * When true (default), each word is tappable to hear just that word again
   * (book-like narrative reading).
   */
  tapWords?: boolean;
  className?: string;
  /** Slightly tighter type for companion / map narrative. */
  compact?: boolean;
};

function speechAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

/**
 * Kid-facing narrative / instruction reader:
 * - on-device TTS with karaoke word highlight (SpeechSynthesis onboundary)
 * - tap any word to hear that word again
 * - large speaker control to replay the full line
 * Falls back to full-text speak without highlight when boundaries are absent.
 */
export function SpokenPrompt({
  text,
  autoSpeak = true,
  tapWords = true,
  className = "",
  compact = false,
}: SpokenPromptProps) {
  const segments = useMemo(() => segmentPrompt(text), [text]);
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [hasSpeech, setHasSpeech] = useState(false);
  const [mode, setMode] = useState<"line" | "word">("line");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setHasSpeech(speechAvailable());
  }, []);

  const cancelSpeech = useCallback(() => {
    if (speechAvailable()) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setSpeaking(false);
    setActiveWord(null);
    setMode("line");
  }, []);

  const speakText = useCallback(
    (utterText: string, options?: { wordIndex?: number | null }) => {
      if (!speechAvailable() || !utterText.trim()) return;

      cancelSpeech();

      const utterance = new SpeechSynthesisUtterance(utterText);
      utteranceRef.current = utterance;
      const isWord = options?.wordIndex !== undefined && options.wordIndex !== null;
      setMode(isWord ? "word" : "line");

      if (isWord) {
        setActiveWord(options!.wordIndex!);
        utterance.onboundary = null;
      } else {
        utterance.onboundary = (event: SpeechSynthesisEvent) => {
          if (event.name && event.name !== "word") return;
          setActiveWord(wordIndexAtChar(segments, event.charIndex));
        };
      }

      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        utteranceRef.current = null;
        setSpeaking(false);
        setActiveWord(null);
        setMode("line");
      };

      utterance.onerror = () => {
        utteranceRef.current = null;
        setSpeaking(false);
        setActiveWord(null);
        setMode("line");
      };

      window.speechSynthesis.speak(utterance);
    },
    [segments, cancelSpeech],
  );

  const speak = useCallback(() => {
    speakText(text);
  }, [text, speakText]);

  const speakWordAt = useCallback(
    (wordIndex: number, rawToken: string) => {
      const token = speakableWordToken(rawToken);
      if (!token) return;
      speakText(token, { wordIndex });
    },
    [speakText],
  );

  useEffect(() => {
    if (!autoSpeak || !hasSpeech) return;
    speak();
    return () => {
      cancelSpeech();
    };
  }, [text, autoSpeak, hasSpeech, speak, cancelSpeech]);

  const textClass = compact
    ? "flex-1 text-lg font-semibold leading-snug text-pine-900 sm:text-xl"
    : "flex-1 text-xl font-semibold leading-relaxed text-pine-900 sm:text-2xl";

  return (
    <div
      className={`flex items-start gap-3 ${className}`}
      data-speaking={speaking ? "true" : "false"}
      data-speak-mode={mode}
      data-tap-words={tapWords && hasSpeech ? "true" : "false"}
    >
      <p className={textClass} aria-live="polite">
        {segments.length === 0
          ? text
          : segments.map((seg, i) => {
              if (seg.type === "gap") {
                return <span key={`g-${i}`}>{seg.text}</span>;
              }
              const highlighted =
                speaking &&
                activeWord !== null &&
                seg.wordIndex === activeWord;
              const highlightClass = highlighted
                ? "rounded bg-amber-200/90 px-0.5 text-pine-900 transition-colors"
                : "transition-colors";

              if (tapWords && hasSpeech) {
                return (
                  <button
                    key={`w-${seg.wordIndex}-${seg.start}`}
                    type="button"
                    className={`inline cursor-pointer border-0 bg-transparent p-0 text-inherit font-inherit align-baseline underline decoration-dotted decoration-pine-300 underline-offset-4 hover:bg-amber-100/80 hover:decoration-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 rounded ${highlightClass}`}
                    aria-label={`Hear word: ${speakableWordToken(seg.text) || seg.text}`}
                    title="Tap to hear this word"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      speakWordAt(seg.wordIndex, seg.text);
                    }}
                  >
                    {seg.text}
                  </button>
                );
              }

              return (
                <span
                  key={`w-${seg.wordIndex}-${seg.start}`}
                  className={highlightClass}
                >
                  {seg.text}
                </span>
              );
            })}
      </p>
      {hasSpeech && (
        <button
          type="button"
          aria-label="Replay line aloud"
          title="Hear the whole line again"
          onClick={() => speak()}
          className={`inline-flex shrink-0 items-center justify-center rounded-2xl border-2 border-pine-300 bg-pine-50 text-pine-800 shadow-sm transition hover:bg-pine-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 active:scale-95 ${
            compact ? "h-12 w-12" : "h-14 w-14"
          }`}
        >
          <SpeakerIcon speaking={speaking} />
        </button>
      )}
    </div>
  );
}

function SpeakerIcon({ speaking }: { speaking: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      {speaking ? <circle cx="20" cy="5" r="2" className="opacity-80" /> : null}
    </svg>
  );
}
