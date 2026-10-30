"use client";

import { useActionState } from "react";
import Link from "next/link";

type AuthState = { error?: string } | null;
type AuthAction = (
  prev: AuthState,
  formData: FormData,
) => Promise<AuthState>;

export function AuthForm({
  action,
  submitLabel,
  mode,
}: {
  action: AuthAction;
  submitLabel: string;
  mode: "login" | "signup";
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="card mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl text-pine-900">
        {mode === "login" ? "Parent log in" : "Create parent account"}
      </h1>
      {mode === "signup" && (
        <label className="block space-y-1 text-sm">
          <span>Your name</span>
          <input className="input" name="name" required autoComplete="name" />
        </label>
      )}
      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input
          className="input"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Password</span>
        <input
          className="input"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </label>
      {mode === "login" && (
        <p className="text-right text-sm">
          <Link className="text-pine-700 underline" href="/forgot-password">
            Forgot password?
          </Link>
        </p>
      )}
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button className="btn-primary w-full" disabled={pending} type="submit">
        {pending ? "Working..." : submitLabel}
      </button>
      <p className="text-sm text-pine-700">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link className="font-semibold underline" href="/signup">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link className="font-semibold underline" href="/login">
              Log in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
