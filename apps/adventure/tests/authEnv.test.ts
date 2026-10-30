import { describe, expect, it, vi } from "vitest";
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: {} }));
import { authBaseUrl, cookieSecure } from "../src/lib/auth";

const E = (e: Record<string, string>) => e as unknown as NodeJS.ProcessEnv;

describe("auth env resolution", () => {
  it("prefers AUTH_URL", () => {
    expect(authBaseUrl(E({ AUTH_URL: "https://x.vercel.app/", VERCEL_URL: "y.vercel.app" }))).toBe("https://x.vercel.app");
  });
  it("falls back to Vercel system env with https", () => {
    expect(authBaseUrl(E({ VERCEL_URL: "p-abc.vercel.app" }))).toBe("https://p-abc.vercel.app");
    expect(authBaseUrl(E({ VERCEL_ENV: "production", VERCEL_URL: "p-abc.vercel.app", VERCEL_PROJECT_PRODUCTION_URL: "p.vercel.app" }))).toBe("https://p.vercel.app");
  });
  it("cookie Secure: explicit wins, https inferred, home-lab default false", () => {
    expect(cookieSecure(E({ AUTH_COOKIE_SECURE: "false", VERCEL_URL: "a.vercel.app" }))).toBe(false);
    expect(cookieSecure(E({ AUTH_COOKIE_SECURE: "true" }))).toBe(true);
    expect(cookieSecure(E({ VERCEL_URL: "a.vercel.app" }))).toBe(true);
    expect(cookieSecure(E({ AUTH_URL: "http://192.168.1.5:3000" }))).toBe(false);
    expect(cookieSecure(E({}))).toBe(false);
  });
});
