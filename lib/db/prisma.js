import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

if (!process.env.DATABASE_URL) {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    // Vercel serverless functions have a writable /tmp directory
    const tmpDbPath = path.join("/tmp", "dev.db");
    const localDbPath = path.join(process.cwd(), "prisma", "dev.db");
    
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(localDbPath)) {
      try {
        fs.copyFileSync(localDbPath, tmpDbPath);
      } catch (e) {
        console.warn("Failed to copy seed db to /tmp:", e);
      }
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  } else {
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  }
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
