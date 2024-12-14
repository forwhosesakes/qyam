
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import ws from "ws";
neonConfig.webSocketConstructor = ws;
// let globalDb:any = null;

export const client = (db: string) => {

    console.log("there is no global db, creating one")
    try {
      const pool = new Pool({ connectionString: db,
        min: 0,
        max: 10,
        connectionTimeoutMillis:5000,
        idleTimeoutMillis: 8000,

      });
      const adapter = new PrismaNeon(pool);
      const prisma = new PrismaClient({ adapter });
      console.log("new db was created");
      
      return prisma;
    }
    catch(e){
      console.log("error connecting to db",e);
      return null
      
    }

  


};
