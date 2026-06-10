export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.on("beforeExit", async () => {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$disconnect();
    });
  }
}
