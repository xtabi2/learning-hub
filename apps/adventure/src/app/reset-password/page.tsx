import Link from "next/link";
import { ResetPasswordForm } from "@/components/PasswordResetForms";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="card mx-auto max-w-md space-y-4">
        <p>This reset link is missing its token.</p>
        <Link className="font-semibold underline" href="/forgot-password">Request a new link</Link>
      </div>
    );
  }
  return <ResetPasswordForm token={token} />;
}
