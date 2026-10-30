import Link from "next/link";

export function DemoBanner() {
  return (
    <aside className="rounded-2xl border-[3px] border-violet-400 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-sky-50 px-5 py-4 text-violet-950 shadow-md">
      <p className="flex flex-wrap items-center gap-2 font-bold tracking-wide">
        <span aria-hidden="true" className="text-xl">
          🎮
        </span>
        <span className="uppercase">Demo · Try as kid</span>
      </p>
      <p className="mt-2 text-base leading-snug">
        You are previewing the kid experience. Progress here belongs only to this
        demo profile and does <strong>not</strong> change any real child&apos;s
        mastery or streaks.{" "}
        <Link
          className="font-semibold underline decoration-2 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
          href="/dashboard"
        >
          Back to parent dashboard
        </Link>
      </p>
    </aside>
  );
}
