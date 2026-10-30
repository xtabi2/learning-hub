import { AuthForm } from "@/components/AuthForm";
import { Disclaimer } from "@/components/Disclaimer";
import { loginAction } from "@/app/actions/auth";
import { readSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await readSession();
  if (user) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <AuthForm action={loginAction} mode="login" submitLabel="Log in" />
      <Disclaimer compact />
    </div>
  );
}
