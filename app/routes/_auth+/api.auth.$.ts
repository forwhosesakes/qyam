
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare"
import { auth } from "../../lib/auth.server";
 
export async function loader({ request }: LoaderFunctionArgs) {
    console.log("The request in the loader auth api:  ", request);
    
    return auth.handler(request)
}
 
export async function action({ request }: ActionFunctionArgs) {
    console.log("The request in the action auth api:  ", request);

    return auth.handler(request)
}