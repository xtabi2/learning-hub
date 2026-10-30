/**
 * Pure helpers for kid-facing spoken prompts (karaoke highlight + tap-a-word).
 * Web Speech API boundary events report charIndex into the utterance text;
 * these helpers map that index onto word tokens for highlighting.
 */

export type PromptSegment =
  | {
      type: "word";
      text: string;
      start: number;
      end: number;
      wordIndex: number;
    }
  | { type: "gap"; text: string };

/** Split prompt text into word + whitespace gap segments for karaoke rendering. */
export function segmentPrompt(text: string): PromptSegment[] {
  const segments: PromptSegment[] = [];
  let wordIndex = 0;
  let i = 0;
  while (i < text.length) {
    if (/\s/.test(text[i]!)) {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j]!)) j += 1;
      segments.push({ type: "gap", text: text.slice(i, j) });
      i = j;
    } else {
      let j = i + 1;
      while (j < text.length && !/\s/.test(text[j]!)) j += 1;
      segments.push({
        type: "word",
        text: text.slice(i, j),
        start: i,
        end: j,
        wordIndex: wordIndex++,
      });
      i = j;
    }
  }
  return segments;
}

/**
 * Map a SpeechSynthesis boundary charIndex to the active word index.
 * Returns null when there are no words or charIndex is before the first word.
 */
export function wordIndexAtChar(
  segments: PromptSegment[],
  charIndex: number,
): number | null {
  let last: number | null = null;
  for (const seg of segments) {
    if (seg.type !== "word") continue;
    if (charIndex >= seg.start && charIndex < seg.end) {
      return seg.wordIndex;
    }
    if (charIndex >= seg.start) {
      last = seg.wordIndex;
    }
  }
  return last;
}

/** Count of word tokens (for tests / callers). */
export function countWords(segments: PromptSegment[]): number {
  return segments.filter((s) => s.type === "word").length;
}

/**
 * Strip flanking punctuation so a tapped token speaks cleanly
 * (e.g. "Hello," → "Hello", "Glowtrail…" → "Glowtrail").
 * Keeps internal apostrophes (I'll, don't).
 */
export function speakableWordToken(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // Remove leading/trailing non-letter/number/apostrophe runs.
  const cleaned = trimmed.replace(
    /^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu,
    "",
  );
  return cleaned || trimmed;
}
