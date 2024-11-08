import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins"
import {sendEmail} from "./send-email.server"
const prisma = new PrismaClient();
export const auth = betterAuth({
    emailAndPassword: {    
        enabled: true,
        requireEmailVerification: true,
         sendResetPassword:async(user, url) =>{
            await sendEmail({
                to: user.email,
                subject: "Reset",
                text: `Click the link to verify your email: ${url}`,
                
              });
            
        },
    } ,
    emailVerification:{
        sendVerificationEmail:async (user, url, token) => {
            await sendEmail({
              to: user.email,
        
              subject: "Verify your email address",
              text: `Click the link to verify your email: ${url}`,
              
            });
          },
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", //change this to your database provider
        // url: process.env.DATABASE_URL, // path to your database or connection string
    }),
    plugins:[admin()]
  

})