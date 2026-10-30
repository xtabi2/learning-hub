import { createHash, randomBytes } from "node:crypto";

export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
export const RESET_MAX_PER_HOUR = 3;
export const MIN_PASSWORD_LENGTH = 8;
export const GENERIC_RESET_MESSAGE =
  "If an account exists for that email, we've sent a link to reset your password. It expires in 30 minutes.";

export function generateResetToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashResetToken(token) };
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

type TokenRow = { id: string; userId: string; expiresAt: Date; usedAt: Date | null };

/** Minimal Prisma surface used here (injectable for tests). */
export type ResetDb = {
  user: {
    findUnique(args: { where: { email: string }; select: { id: true } }): Promise<{ id: string } | null>;
    update(args: { where: { id: string }; data: { passwordHash: string } }): Promise<unknown>;
  };
  passwordResetToken: {
    count(args: { where: { userId: string; createdAt: { gte: Date } } }): Promise<number>;
    create(args: { data: { userId: string; tokenHash: string; expiresAt: Date } }): Promise<unknown>;
    findUnique(args: { where: { tokenHash: string } }): Promise<TokenRow | null>;
    updateMany(args: {
      where: { userId: string; usedAt: null };
      data: { usedAt: Date };
    }): Promise<{ count: number }>;
  };
};

export type SendResetEmail = (to: string, link: string) => Promise<void>;

/** Always resolves to the generic message (no account enumeration). */
export async function requestPasswordReset(
  db: ResetDb,
  rawEmail: string,
  baseUrl: string,
  send: SendResetEmail,
  now: Date = new Date(),
): Promise<{ message: string }> {
  const email = rawEmail.trim().toLowerCase();
  const generic = { message: GENERIC_RESET_MESSAGE };
  if (!email || !email.includes("@")) return generic;
  try {
    const user = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return generic;
    const recent = await db.passwordResetToken.count({
      where: { userId: user.id, createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) } },
    });
    if (recent >= RESET_MAX_PER_HOUR) return generic;
    const { token, tokenHash } = generateResetToken();
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(now.getTime() + RESET_TOKEN_TTL_MS) },
    });
    const link = `${baseUrl.replace(/\/+$/, "")}/adventure/reset-password?token=${encodeURIComponent(token)}`;
    await send(email, link);
  } catch (err) {
    console.error("[password-reset] request failed", err);
  }
  return generic;
}

export type ResetResult = { ok: true } | { ok: false; error: string };

export async function resetPassword(
  db: ResetDb,
  token: string,
  newPassword: string,
  hash: (pw: string) => Promise<string>,
  now: Date = new Date(),
): Promise<ResetResult> {
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  const invalid: ResetResult = { ok: false, error: "This reset link is invalid or has expired. Please request a new one." };
  if (!token) return invalid;
  const row = await db.passwordResetToken.findUnique({ where: { tokenHash: hashResetToken(token) } });
  if (!row || row.usedAt || row.expiresAt.getTime() <= now.getTime()) return invalid;
  // Marks this token AND every other outstanding token for the user as used, atomically per row.
  const claimed = await db.passwordResetToken.updateMany({
    where: { userId: row.userId, usedAt: null },
    data: { usedAt: now },
  });
  if (claimed.count === 0) return invalid; // lost a race with a concurrent reset
  await db.user.update({ where: { id: row.userId }, data: { passwordHash: await hash(newPassword) } });
  return { ok: true };
}
