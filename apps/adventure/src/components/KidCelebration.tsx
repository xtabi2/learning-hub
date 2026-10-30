"use client";

import { useEffect, useState } from "react";

type KidCelebrationProps = {
  /** Bump this (e.g. attempt id / timestamp) to replay the burst. */
  playKey: string | number;
  active: boolean;
  durationMs?: number;
};

/**
 * Brief kid-safe celebration overlay (balloons + sparkles).
 * Auto-dismisses; pointer-events none so kids can keep tapping.
 */
export function KidCelebration({
  playKey,
  active,
  durationMs = 1600,
}: KidCelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(timer);
  }, [active, playKey, durationMs]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
      data-celebration="true"
    >
      <div className="kid-celebrate-burst absolute inset-0 flex items-center justify-center">
        <UnicornSticker />
      </div>
      <Balloon className="kid-balloon-1 left-[12%] top-[70%] text-rose-400" />
      <Balloon className="kid-balloon-2 left-[28%] top-[75%] text-sky-400" />
      <Balloon className="kid-balloon-3 left-[55%] top-[72%] text-violet-400" />
      <Balloon className="kid-balloon-4 left-[72%] top-[68%] text-amber-400" />
      <Balloon className="kid-balloon-5 left-[88%] top-[74%] text-emerald-400" />
      <Sparkle className="kid-spark-1 left-[18%] top-[22%]" />
      <Sparkle className="kid-spark-2 left-[42%] top-[14%]" />
      <Sparkle className="kid-spark-3 left-[65%] top-[20%]" />
      <Sparkle className="kid-spark-4 left-[80%] top-[30%]" />
    </div>
  );
}

function UnicornSticker() {
  return (
    <div className="kid-unicorn-pop flex flex-col items-center gap-1">
      <svg
        viewBox="0 0 120 120"
        className="h-28 w-28 drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="60" cy="70" rx="36" ry="32" fill="#fce7f3" />
        <circle cx="60" cy="48" r="28" fill="#fdf2f8" />
        <path d="M60 18 L68 48 L52 48 Z" fill="#c4b5fd" />
        <circle cx="50" cy="48" r="3.5" fill="#1d3023" />
        <circle cx="70" cy="48" r="3.5" fill="#1d3023" />
        <path
          d="M48 58 Q60 66 72 58"
          fill="none"
          stroke="#fb7185"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M78 40 Q98 28 102 48 Q90 52 78 46"
          fill="#a78bfa"
          opacity="0.9"
        />
        <path
          d="M82 52 Q100 58 96 72 Q84 68 80 58"
          fill="#f9a8d4"
          opacity="0.85"
        />
        <circle cx="44" cy="54" r="5" fill="#fda4af" opacity="0.7" />
        <circle cx="76" cy="54" r="5" fill="#fda4af" opacity="0.7" />
      </svg>
      <span className="rounded-full bg-white/90 px-3 py-1 font-display text-lg text-pine-800 shadow">
        Nice!
      </span>
    </div>
  );
}

function Balloon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 40 56"
      className={`absolute h-14 w-10 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="20" cy="22" rx="14" ry="18" fill="currentColor" />
      <path d="M20 40 L17 46 L23 46 Z" fill="currentColor" opacity="0.85" />
      <path
        d="M20 46 Q18 52 22 56"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute h-8 w-8 text-amber-300 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"
      />
    </svg>
  );
}
