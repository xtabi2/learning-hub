import { AuthForm } from "@/components/AuthForm";
import { Disclaimer } from "@/components/Disclaimer";
import { signupAction } from "@/app/actions/auth";
import { readSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const user = await readSession();
  if (user) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <AuthForm action={signupAction} mode="signup" submitLabel="Create account" />
      <Disclaimer compact />
    </div>
  );
}
