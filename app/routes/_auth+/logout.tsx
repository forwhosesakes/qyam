import { redirect } from '@remix-run/cloudflare'
import {getAuth} from "../../lib/auth.server"
import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ request, context }: LoaderFunctionArgs) {
    return getAuth(context).api.signOut({headers:request.headers}).then(()=>{
        return null
      }).catch((e:any)=>{
        //todo: show toast here 
            console.log("error: ", e);
            return redirect("/")
            
        })

    
}


