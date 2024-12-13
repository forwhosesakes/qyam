import { redirect } from "@remix-run/cloudflare";
import { User } from "better-auth";
import { client } from "~/db/db-client.server";

export const getAuthenticated = async ({ request, context }: any) => {
  try {
    const sessionCookie = request.headers.get('Cookie')?.match(/session=([^;]+)/)?.[1];
    
    if (!sessionCookie) {
      return null;
    }

    const dbClient = client(context.cloudflare.env.DATABASE_URL);
    const session = await dbClient.session.findUnique({
      where: { id: sessionCookie },
      include: { user: true }
    });

    return session?.user || null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const requireAuth = async (request: Request, context: any, redirectTo: string = '/login') => {
  const user = await getAuthenticated({ request, context });
  if (!user) {
    throw redirect(redirectTo);
  }
  return user;
};

export const requireNoAuth = async (request: Request, context: any, redirectTo: string = '/') => {
  const user = await getAuthenticated({ request, context });
  if (user) {
    throw redirect(redirectTo);
  }
  return null;
};

export const requireSpecialCase = async (
  request: Request, 
  context: any, 
  condition: (user: User | null) => boolean,
  redirectTo: string = '/'
) => {
  const user = await getAuthenticated({ request, context });
  const isAuthorized = condition(user);
  if (!isAuthorized) {
    throw redirect(redirectTo);
  }
  return user;
};