import { useEffect } from "react";
import { getLevel, hub, readingGradeId } from "../../../shared/index.js";
import { speakWord } from "./speech.js";
import { Icon } from "./icons.jsx";

/** Pre-K and K kids are still learning to read, so their prompts are spoken too. */
export function isPreReader(kid) {
  try {
    const child = kid === undefined ? hub().getCurrentChild() : kid;
    return Boolean(child) && readingGradeId(getLevel(child).grade) === "k";
  } catch {
    return false;
  }
}

/**
 * Icon-only speaker that replays `text`. For pre-readers it also says `text` once
 * when it appears, so the written words are never the only instruction.
 */
export default function Say({ text, auto = isPreReader() }) {
  useEffect(() => {
    if (!auto || !text) return undefined;
    const t = window.setTimeout(() => speakWord(text), 250);
    return () => window.clearTimeout(t);
  }, [text, auto]);
  return (
    <button type="button" className="say" aria-label="Hear it" onClick={() => speakWord(text)}>
      <Icon name="speaker" />
    </button>
  );
}
