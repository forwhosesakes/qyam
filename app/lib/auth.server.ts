import { Auth, betterAuth, Session, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { sendEmail } from "./send-email.server";
import { AppLoadContext } from "@remix-run/cloudflare";
import { client } from "~/db/db-client.server";

export type Environment = {
  Bindings: {
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_TRUSTED_ORIGINS: string;
  };
  Variables: {
    user: User | null;
    session: Session | null;
  };
};

let auth: Auth | null = null;

export const getAuth = (c: AppLoadContext) => {
  if (auth) return auth;
  return initAuth(c);
};
export const initAuth = (c: AppLoadContext): Auth => {
  console.log("init auth", c.cloudflare.env);
  
  auth = betterAuth({
    
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendOnSignUp: true,
      sendResetPassword: async (user, url) => {
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
      sendVerificationEmail: async (user, url, token) => {
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
    database: prismaAdapter(
      client(c.cloudflare.env.DATABASE_URL),
      {
        provider: "postgresql", //change this to your database provider
      }
    ),
    plugins: [admin()],
  });

  console.log("auth db", auth.options.database);

  return auth;
};
