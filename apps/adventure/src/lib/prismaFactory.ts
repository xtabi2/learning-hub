import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

/**
 * Runtime DB switch:
 * - TURSO_DATABASE_URL set -> Prisma driver adapter over libSQL (Turso, or a local `file:` libSQL DB).
 * - otherwise              -> classic Prisma SQLite engine using DATABASE_URL (home-lab Docker, local dev).
 */
export function usingLibsql(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export function createPrismaClient(): PrismaClient {
  const log: ("error" | "warn")[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    const adapter = new PrismaLibSQL({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    });
    return new PrismaClient({ adapter, log });
  }
  return new PrismaClient({ log });
}
