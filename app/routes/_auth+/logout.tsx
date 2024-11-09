import { redirect, type ActionFunctionArgs } from '@remix-run/cloudflare'
import {auth} from "../../lib/auth.server"
import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ request }: LoaderFunctionArgs) {
    return auth.api.signOut({headers:request.headers}).then((res)=>{
        
        console.log("yaho logging out ");
        
        return redirect("/")})
        return null

}

export async function action({ request }: ActionFunctionArgs) {
    // return auth.api.signOut()
	
}
