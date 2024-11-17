import { redirect, type ActionFunctionArgs } from '@remix-run/cloudflare'
import {getAuth} from "../../lib/auth.server"
import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ request, context }: LoaderFunctionArgs) {
    return getAuth(context).api.signOut({headers:request.headers}).then((res)=>{
        
        return redirect("/")})
        return null

}

export async function action({ request }: ActionFunctionArgs) {
    // return auth.api.signOut()
	
}
