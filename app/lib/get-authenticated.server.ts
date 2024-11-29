import { getAuth } from "./auth.server";
import { User } from "better-auth";


export const getAuthenticated = async ({ request, context }: any)=>{

    const session = await getAuth(context).api.getSession({
        headers: request.headers, // you need to pass the headers object.
      });
      return session?.user && session.user.emailVerified 
        ? (session.user as User)
        : null;
}


