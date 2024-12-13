
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import ws from "ws";
neonConfig.webSocketConstructor = ws;
let globalDb = null;

export const client = (db: string) => {
  if (!globalDb) {
    const pool = new Pool({ connectionString: db , idleTimeoutMillis: 0,
      connectionTimeoutMillis: 0});
    const adapter = new PrismaNeon(pool);
    const prisma = new PrismaClient({ adapter });
    return prisma;
  }
  return globalDb;
};
