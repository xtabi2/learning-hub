import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { readSession } from "@/lib/auth";

export default async function HomePage() {
  const user = await readSession();

  return (
    <div className="space-y-8">
      <section className="card space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          K–3 home reading practice
        </p>
        <h1 className="font-display text-4xl text-pine-900 sm:text-5xl">
          Build reading skills one mastered node at a time.
        </h1>
        <p className="max-w-2xl text-lg text-pine-800">
          Parents create an account, add a child, and unlock a skill path across
          phonemic awareness, phonics, fluency, vocabulary, and comprehension.
          Nodes stay locked until mastery (≥80% over the last 10 items).
        </p>
        <div className="flex flex-wrap gap-3">
          {user ? (
            <Link className="btn-primary" href="/dashboard">
              Open parent dashboard
            </Link>
          ) : (
            <>
              <Link className="btn-primary" href="/signup">
                Parent sign up
              </Link>
              <Link className="btn-secondary" href="/login">
                Log in
              </Link>
            </>
          )}
        </div>
      </section>
      <Disclaimer />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Placement mini-quiz",
            body: "A short check places your child on entry skills without skipping later mastery gates.",
          },
          {
            title: "Locked until mastery",
            body: "Practice stays sequential: unlock the next node only after the current skill clears the mastery window.",
          },
          {
            title: "Printable parent report",
            body: "See weak strands, streak, recent sessions, and skill status ready for a fridge printout.",
          },
        ].map((feature) => (
          <article key={feature.title} className="card space-y-2">
            <h2 className="font-display text-xl text-pine-900">{feature.title}</h2>
            <p className="text-sm text-pine-700">{feature.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
