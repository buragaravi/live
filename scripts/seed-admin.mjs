import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Admin";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters");
  process.exit(1);
}

const normalizedEmail = email.toLowerCase().trim();
const passwordHash = await bcrypt.hash(password, 12);

const existing = await prisma.admin.findUnique({
  where: { email: normalizedEmail },
});

if (existing) {
  console.log(`Admin already exists: ${normalizedEmail}`);
} else {
  await prisma.admin.create({
    data: { email: normalizedEmail, passwordHash, name },
  });
  console.log(`Admin created: ${normalizedEmail}`);
}

await prisma.$disconnect();
