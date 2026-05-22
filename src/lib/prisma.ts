import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaMissingEnvWarningShown?: boolean;
};

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function warnMissingDatabaseUrl() {
  if (globalForPrisma.prismaMissingEnvWarningShown) {
    return;
  }

  console.warn(
    "DATABASE_URL is not configured. Falling back to empty tutorial data.",
  );
  globalForPrisma.prismaMissingEnvWarningShown = true;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaPg(connectionString);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const prisma = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
