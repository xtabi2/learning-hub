import { describe, expect, it, vi } from "vitest";
import {
  GENERIC_RESET_MESSAGE,
  RESET_TOKEN_TTL_MS,
  generateResetToken,
  hashResetToken,
  requestPasswordReset,
  resetPassword,
  type ResetDb,
} from "../src/lib/passwordReset";

type Row = { id: string; userId: string; tokenHash: string; expiresAt: Date; usedAt: Date | null; createdAt: Date };

function fakeDb(users: Record<string, string>, clock: { now: Date }) {
  const tokens: Row[] = [];
  const passwords: Record<string, string> = {};
  const db: ResetDb = {
    user: {
      findUnique: async ({ where }) => (users[where.email] ? { id: users[where.email] } : null),
      update: async ({ where, data }) => { passwords[where.id] = data.passwordHash; return {}; },
    },
    passwordResetToken: {
      count: async ({ where }) => tokens.filter((t) => t.userId === where.userId && t.createdAt >= where.createdAt.gte).length,
      create: async ({ data }) => { tokens.push({ id: String(tokens.length), usedAt: null, createdAt: clock.now, ...data }); return {}; },
      findUnique: async ({ where }) => tokens.find((t) => t.tokenHash === where.tokenHash) ?? null,
      updateMany: async ({ where, data }) => {
        const hit = tokens.filter((t) => t.userId === where.userId && t.usedAt === null);
        hit.forEach((t) => (t.usedAt = data.usedAt));
        return { count: hit.length };
      },
    },
  };
  return { db, tokens, passwords };
}

const hash = async (p: string) => `h:${p}`;

async function issue(db: ResetDb, email: string, now: Date) {
  let link = "";
  await requestPasswordReset(db, email, "https://app.test/", async (_to, l) => { link = l; }, now);
  return new URL(link).searchParams.get("token")!;
}

describe("password reset tokens", () => {
  it("generates 32 random bytes and stores only the sha256 hash", async () => {
    const a = generateResetToken();
    const b = generateResetToken();
    expect(Buffer.from(a.token, "base64url")).toHaveLength(32);
    expect(a.token).not.toBe(b.token);
    expect(a.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.tokenHash).toBe(hashResetToken(a.token));

    const clock = { now: new Date() };
    const { db, tokens } = fakeDb({ "p@x.com": "u1" }, clock);
    const token = await issue(db, "P@x.com", clock.now);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].tokenHash).toBe(hashResetToken(token));
    expect(JSON.stringify(tokens)).not.toContain(token);
  });

  it("returns the same generic response for unknown and known emails", async () => {
    const clock = { now: new Date() };
    const { db } = fakeDb({ "p@x.com": "u1" }, clock);
    const send = vi.fn(async () => {});
    const known = await requestPasswordReset(db, "p@x.com", "http://a", send);
    const unknown = await requestPasswordReset(db, "nobody@x.com", "http://a", send);
    expect(known).toEqual(unknown);
    expect(known.message).toBe(GENERIC_RESET_MESSAGE);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("rate limits to 3 per hour, still generic", async () => {
    const clock = { now: new Date() };
    const { db } = fakeDb({ "p@x.com": "u1" }, clock);
    const send = vi.fn(async () => {});
    for (let i = 0; i < 5; i++) {
      expect((await requestPasswordReset(db, "p@x.com", "http://a", send, clock.now)).message).toBe(GENERIC_RESET_MESSAGE);
    }
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("rejects expired tokens", async () => {
    const clock = { now: new Date("2026-01-01T00:00:00Z") };
    const { db, passwords } = fakeDb({ "p@x.com": "u1" }, clock);
    const token = await issue(db, "p@x.com", clock.now);
    const later = new Date(clock.now.getTime() + RESET_TOKEN_TTL_MS + 1);
    const r = await resetPassword(db, token, "newpassword", hash, later);
    expect(r.ok).toBe(false);
    expect(passwords.u1).toBeUndefined();
  });

  it("is single-use and invalidates other tokens for the user", async () => {
    const clock = { now: new Date() };
    const { db, passwords } = fakeDb({ "p@x.com": "u1" }, clock);
    const t1 = await issue(db, "p@x.com", clock.now);
    const t2 = await issue(db, "p@x.com", clock.now);
    expect(await resetPassword(db, t1, "newpassword", hash, clock.now)).toEqual({ ok: true });
    expect(passwords.u1).toBe("h:newpassword");
    expect((await resetPassword(db, t1, "another1", hash, clock.now)).ok).toBe(false);
    expect((await resetPassword(db, t2, "another1", hash, clock.now)).ok).toBe(false);
    expect(passwords.u1).toBe("h:newpassword");
  });

  it("enforces min password length and rejects bogus tokens", async () => {
    const clock = { now: new Date() };
    const { db } = fakeDb({ "p@x.com": "u1" }, clock);
    const token = await issue(db, "p@x.com", clock.now);
    expect((await resetPassword(db, token, "short", hash)).ok).toBe(false);
    expect((await resetPassword(db, "bogus", "longenough", hash)).ok).toBe(false);
  });
});
