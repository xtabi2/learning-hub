import { describe, expect, it } from "vitest";
import {
  countWords,
  segmentPrompt,
  speakableWordToken,
  wordIndexAtChar,
} from "../src/lib/spokenPrompt";

describe("segmentPrompt", () => {
  it("splits words and preserves whitespace gaps", () => {
    const segments = segmentPrompt("Tap the cat");
    expect(segments).toEqual([
      { type: "word", text: "Tap", start: 0, end: 3, wordIndex: 0 },
      { type: "gap", text: " " },
      { type: "word", text: "the", start: 4, end: 7, wordIndex: 1 },
      { type: "gap", text: " " },
      { type: "word", text: "cat", start: 8, end: 11, wordIndex: 2 },
    ]);
    expect(countWords(segments)).toBe(3);
  });

  it("handles leading/trailing/multi spaces and punctuation attached to words", () => {
    const segments = segmentPrompt("  Hello,  world! ");
    expect(countWords(segments)).toBe(2);
    const words = segments.filter((s) => s.type === "word");
    expect(words[0]).toMatchObject({ text: "Hello,", start: 2, wordIndex: 0 });
    expect(words[1]).toMatchObject({ text: "world!", wordIndex: 1 });
  });

  it("returns empty segments for empty string", () => {
    expect(segmentPrompt("")).toEqual([]);
    expect(countWords([])).toBe(0);
  });
});

describe("wordIndexAtChar", () => {
  const segments = segmentPrompt("Tap the cat");

  it("maps boundary charIndex to the spoken word", () => {
    expect(wordIndexAtChar(segments, 0)).toBe(0);
    expect(wordIndexAtChar(segments, 4)).toBe(1);
    expect(wordIndexAtChar(segments, 8)).toBe(2);
  });

  it("uses the latest word when charIndex lands in a gap after a word", () => {
    expect(wordIndexAtChar(segments, 3)).toBe(0);
    expect(wordIndexAtChar(segments, 7)).toBe(1);
  });

  it("returns null before any word", () => {
    expect(wordIndexAtChar(segmentPrompt("  hi"), 0)).toBeNull();
    expect(wordIndexAtChar([], 0)).toBeNull();
  });
});

describe("speakableWordToken", () => {
  it("strips flanking punctuation for tap-a-word TTS", () => {
    expect(speakableWordToken("Hello,")).toBe("Hello");
    expect(speakableWordToken("world!")).toBe("world");
    expect(speakableWordToken("Glowtrail…")).toBe("Glowtrail");
    expect(speakableWordToken("(Pretend")).toBe("Pretend");
    expect(speakableWordToken("boots.)")).toBe("boots");
  });

  it("keeps internal apostrophes", () => {
    expect(speakableWordToken("I'll")).toBe("I'll");
    expect(speakableWordToken("don't")).toBe("don't");
    expect(speakableWordToken("You're")).toBe("You're");
  });

  it("returns empty for blank input", () => {
    expect(speakableWordToken("")).toBe("");
    expect(speakableWordToken("   ")).toBe("");
  });
});
