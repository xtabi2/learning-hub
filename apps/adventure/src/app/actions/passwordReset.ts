"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { authBaseUrl, hashPassword } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { requestPasswordReset, resetPassword, type ResetDb } from "@/lib/passwordReset";

const db = prisma as unknown as ResetDb;

async function baseUrl() {
  const fromEnv = authBaseUrl();
  if (fromEnv) return fromEnv;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function forgotPasswordAction(_prev: { message?: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  return requestPasswordReset(db, email, await baseUrl(), sendPasswordResetEmail);
}

export async function resetPasswordAction(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "").trim();
  const confirm = String(formData.get("confirm") ?? "").trim();
  if (password !== confirm) return { error: "Passwords do not match." };
  const result = await resetPassword(db, token, password, hashPassword);
  return result.ok ? { ok: true } : { error: result.error };
}
