"use client";

import { SpokenPrompt } from "@/components/SpokenPrompt";
import {
  NIBBLES_CHARACTER,
  nibblesCompanionArtSrc,
  pickNibblesLine,
  type NibblesLineKind,
} from "@/lib/nibblesCompanion";

type NibblesCompanionBannerProps = {
  /** Which companion line pool to use. */
  kind?: NibblesLineKind;
  /** Override spoken / shown line. */
  line?: string;
  seed?: string | number;
  /**
   * Auto-read the line aloud when mounted / line changes.
   * Always renders SpokenPrompt karaoke + tap-a-word (never plain text-only).
   */
  speak?: boolean;
  className?: string;
  compact?: boolean;
  /** Optional gear id for morph_teaser art (/adventure/gear/morph-<id>.png). */
  gearId?: string | null;
};

/**
 * Kid-facing Nibbles companion card: goo mechanic/guide avatar + narrative line.
 * Treats story beats like a book: TTS + karaoke highlight + tap any word to hear it.
 * Does not replace quiz item prompts — sits beside hub / blocker / celebration copy.
 */
export function NibblesCompanionBanner({
  kind = "hub_welcome",
  line,
  seed = 0,
  speak = true,
  className = "",
  compact = false,
  gearId = null,
}: NibblesCompanionBannerProps) {
  const text = line ?? pickNibblesLine(kind, seed);
  const artSrc = nibblesCompanionArtSrc({
    kind,
    gearId,
    size: compact ? 128 : 512,
  });

  return (
    <aside
      className={`flex items-start gap-3 rounded-3xl border-2 border-nibbles/80 bg-gradient-to-br from-nibbles/20 via-cream to-lime-50 p-3 shadow-sm sm:gap-4 sm:p-4 ${className}`}
      data-nibbles-companion="true"
      data-nibbles-kind={kind}
      data-nibbles-pose-src={artSrc}
      data-narrative-book="true"
      aria-label={`${NIBBLES_CHARACTER.name}, ${NIBBLES_CHARACTER.role}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl border-2 border-nibbles bg-nibbles/30 shadow ${
          compact ? "h-14 w-14" : "h-20 w-20 sm:h-24 sm:w-24"
        }`}
      >
        <img
          src={artSrc}
          alt={NIBBLES_CHARACTER.name}
          className="h-full w-full object-cover"
          width={compact ? 56 : 96}
          height={compact ? 56 : 96}
          onError={(event) => {
            const img = event.currentTarget;
            if (img.dataset.fallback === "avatar") return;
            if (img.dataset.fallback === "companion") {
              img.dataset.fallback = "avatar";
              img.src = NIBBLES_CHARACTER.fallbackArtSrc;
              return;
            }
            img.dataset.fallback = "companion";
            img.src = NIBBLES_CHARACTER.artSrc;
          }}
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wide text-nibbles-ink">
          {NIBBLES_CHARACTER.name} · guide
        </p>
        <SpokenPrompt
          text={text}
          autoSpeak={speak}
          tapWords
          compact={compact}
          className="!items-center"
        />
      </div>
    </aside>
  );
}
