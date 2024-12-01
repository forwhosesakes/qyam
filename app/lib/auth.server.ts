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

export const getAuth = (context: AppLoadContext): Auth|any => {
  // Create a new auth instance for each request
  return betterAuth({
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url, token }, request) => {
        await sendEmail(
          {
            to: user.email,
            subject: "إعادة تعيين كلمة المرور",
            text: `قم بتعيين كلمة مرورك بالضغط على هذا : <a href="${url}">الرابط</a>`,
          },
          context.cloudflare.env.RESEND_API,
          context.cloudflare.env.MAIN_EMAIL
        );
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url, token }, request) => {
        await sendEmail(
          {
            to: user.email,
            subject: "تأكيد التسجيل في قيم",
            text: `قم بتأكيد تسجيلك عن طريق دخول <a href="${url}">هذا الرابط</a>`,
          },
          context.cloudflare.env.RESEND_API,
          context.cloudflare.env.MAIN_EMAIL
        );
      },
    },
    user: {
      additionalFields: {
        cvKey: { type: "string" },
        bio: { type: "string" },
        phone: { type: "number" },
        acceptenceState: { type: "string" }
      }
    },
    database: prismaAdapter(
      client(context.cloudflare.env.DATABASE_URL),
      {
        provider: "postgresql"
      }
    ),
    plugins: [admin()],
  });
};




