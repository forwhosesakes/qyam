import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import Hero from "./components/hero";
import About from "./components/about";
import TeachingMethods from "./components/teaching-methods";
import EvaluationMethods from "./components/evaluation-methods";
import TargetedUsers from "./components/targeted-users";
import Partners from "./components/partners";
import Outro from "./components/outro";
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
    <div className="flex flex-col gap-y-12">
      <Hero/>
      <About/>
      <EvaluationMethods/>
      <TeachingMethods/>
      <TargetedUsers/>
      <Partners/>
      <Outro/>
    </div>
  );
}

