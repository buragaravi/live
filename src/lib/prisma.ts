import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    const url = new URL(raw);
    url.searchParams.set("connection_limit", "1");
    url.searchParams.set("pool_timeout", "10");
    return url.toString();
  } catch {
    const separator = raw.includes("?") ? "&" : "?";
    return `${raw}${separator}connection_limit=1&pool_timeout=10`;
  }
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: { url: getDatabaseUrl() },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always reuse one client per Node process (dev hot-reload + prod)
globalForPrisma.prisma = prisma;
