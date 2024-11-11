// import { PrismaClient } from "@prisma/client";




// export const client =   (db: string) => {
// return  new PrismaClient({datasourceUrl:db})

// }


import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

import ws from 'ws';
neonConfig.webSocketConstructor = ws;


export const client = (db:string)=>{

const pool = new Pool({ connectionString:db });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });
return prisma
}



