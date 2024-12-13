
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import ws from "ws";
neonConfig.webSocketConstructor = ws;
let globalDb = null;

export const client = (db: string) => {
  if (!globalDb) {
    try {
      const pool = new Pool({ connectionString: db});
      const adapter = new PrismaNeon(pool);
      const prisma = new PrismaClient({ adapter });
      return prisma;
    }
    catch(e){
      console.log("error connecting to db",e);
      
    }

  }
  return globalDb;
};
