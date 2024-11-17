import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Icon } from "~/components/icon";
import { getAuth } from "~/lib/auth.server";
import Hero from "./components/hero";

export async function loader({ request , context}: LoaderFunctionArgs) {
  
	//check if the user is logged in 
//   const session = await getAuth(context).api.getSession({
//     headers:  request.headers// you need to pass the headers object.
// })
//   if (session?.user && session.user.emailVerified) return null
//   else return  redirect("login")
return null
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Hero/>
      
    </div>
  );
}

