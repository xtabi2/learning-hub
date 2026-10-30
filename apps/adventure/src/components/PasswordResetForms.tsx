"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, resetPasswordAction } from "@/app/actions/passwordReset";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null);
  return (
    <form action={action} className="card mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl text-pine-900">Forgot password?</h1>
      <p className="text-sm text-pine-700">Enter your parent account email and we&apos;ll send a reset link.</p>
      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input className="input" name="email" type="email" required autoComplete="email" />
      </label>
      {state?.message && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{state.message}</p>
      )}
      <button className="btn-primary w-full" disabled={pending} type="submit">
        {pending ? "Sending..." : "Send reset link"}
      </button>
      <p className="text-sm text-pine-700">
        <Link className="font-semibold underline" href="/login">Back to log in</Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, null);
  if (state?.ok) {
    return (
      <div className="card mx-auto max-w-md space-y-4">
        <h1 className="font-display text-3xl text-pine-900">Password updated</h1>
        <Link className="btn-primary inline-block" href="/login">Log in</Link>
      </div>
    );
  }
  return (
    <form action={action} className="card mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl text-pine-900">Choose a new password</h1>
      <input type="hidden" name="token" value={token} />
      <label className="block space-y-1 text-sm">
        <span>New password</span>
        <input className="input" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Confirm new password</span>
        <input className="input" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
      </label>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <button className="btn-primary w-full" disabled={pending} type="submit">
        {pending ? "Saving..." : "Set new password"}
      </button>
      <p className="text-sm text-pine-700">
        <Link className="font-semibold underline" href="/forgot-password">Request a new link</Link>
      </p>
    </form>
  );
}
