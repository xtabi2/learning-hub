import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./constants";
import { prisma } from "./db";

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be set to at least 16 characters");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Canonical public base URL. AUTH_URL (or legacy NEXTAUTH_URL) wins; on Vercel fall back to
 * https://VERCEL_PROJECT_PRODUCTION_URL (production) or https://VERCEL_URL (previews).
 */
export function authBaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const explicit = env.AUTH_URL || env.NEXTAUTH_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const host =
    (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) ||
    env.VERCEL_URL ||
    env.VERCEL_PROJECT_PRODUCTION_URL;
  if (host) return `https://${host.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return "";
}

/** Secure cookies only over HTTPS. Home-lab HTTP (LAN/Tailscale) must stay non-Secure. */
export function cookieSecure(env: NodeJS.ProcessEnv = process.env) {
  const explicit = env.AUTH_COOKIE_SECURE;
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  const base = authBaseUrl(env);
  if (base.startsWith("https://")) return true;
  if (base.startsWith("http://")) return false;
  // Default false: production Docker on plain HTTP (common for home lab)
  return false;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: cookieSecure(),
  });
}

export async function clearSession() {
  const jar = await cookies();
  // Must match createSession path/sameSite/secure or Secure cookies survive delete()
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: cookieSecure(),
  });
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const session = await readSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireChildForParent(childId: string, parentId: string) {
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId },
  });
  if (!child) {
    redirect("/dashboard");
  }
  return child;
}
