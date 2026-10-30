import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "./prismaFactory";

// One PrismaClient per server instance (also across hot reloads / warm serverless invocations)
// to keep connection count and Turso reads low.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
