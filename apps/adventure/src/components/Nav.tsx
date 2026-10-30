import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/auth";
import { HubPlayingAs } from "./HubPlayingAs";

export function Nav({ user }: { user: SessionUser | null }) {
  return (
    <header className="no-print border-b border-pine-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="font-display text-xl text-pine-800">
          Reading Progress Game
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <a className="btn-secondary hub-home" href="/">
            Home
          </a>
          <HubPlayingAs />
          {user ? (
            <>
              <span className="hidden text-pine-700 sm:inline">Hi, {user.name}</span>
              <Link className="btn-secondary" href="/dashboard">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button className="btn-secondary" type="submit">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="btn-secondary" href="/login">
                Log in
              </Link>
              <Link className="btn-primary" href="/signup">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
