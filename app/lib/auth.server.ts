import { Auth, betterAuth, Session, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { sendEmail } from "./send-email.server";
import { AppLoadContext } from "@remix-run/cloudflare";
import { client } from "~/db/db-client.server";

export type Environment = {
  Variables: {
    user: User | null;
    session: Session | null;
  };
};

let auth: Auth | null|any = null;

export const getAuth = (c: AppLoadContext) => {
  if (auth) return auth;
  return initAuth(c);
};
export const initAuth = (c: AppLoadContext): Auth => {
  
  auth = betterAuth({
    
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendOnSignUp: true,
      sendResetPassword: async ({ user, url, token }, request) => {
         sendEmail(
          {
            to: user.email,
            subject: "Reset",
            text: `Click the link to verify your email: ${url}`,
          },
          c.cloudflare.env.RESEND_API,
          c.cloudflare.env.MAIN_EMAIL
        );
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }, request) => {
         sendEmail(
          {
            to: user.email,
            subject: "Verify your email address",
            text: `Click the link to verify your email: ${url}`,
          },
          c.cloudflare.env.RESEND_API,
          c.cloudflare.env.MAIN_EMAIL
        );
      },
    },
    user:{additionalFields:{
      cvKey:{type:"string"},
      bio:{type:"string"},
      phone:{type:"number"},
      acceptenceState:{type:"string"}
    }},
    database: prismaAdapter(
      client(c.cloudflare.env.DATABASE_URL),
      {
        provider: "postgresql", //change this to your database provider
      }
    ),
    plugins: [admin()],
  });


  return auth;
};




