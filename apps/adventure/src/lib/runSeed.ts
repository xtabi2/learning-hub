/** Prisma Int is signed 32-bit; hashes are unsigned 32-bit. Keep seeds in 1..2^31-1. */
export function toSafeRunSeed(hash: number): number {
  const n = Math.abs(Math.trunc(Number(hash) || 0)) % 2147483647;
  return n === 0 ? 1 : n;
}

