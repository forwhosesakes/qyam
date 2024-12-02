import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticated } from "~/lib/get-authenticated.server";
import userDB from "~/db/user/user.server";
import { createToastHeaders } from "~/lib/toast.server";
import { UserCertificate } from "~/types/types";
import { Link, useLoaderData } from "@remix-run/react";
import { Icon } from "~/components/icon";


export async function loader({ request,context }: LoaderFunctionArgs) {
  try {
    const user = await getAuthenticated({request, context})
     if (user)
    return userDB
      .getUserCertificates(user.id, context.cloudflare.env.DATABASE_URL)
      .then((res: any) => {
        return res.data;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    console.error("Loader error:", error);
    return Response.json({ success: false, error });
  }
}

const Certs = ()=>{
const certs = useLoaderData<any[]>()
    return (<>
        <h4 className="font-bold my-4">شهاداتي</h4>
      <div className="bg-gray-50 rounded-xl p-8 my-6">


      <div className="border border-gray-100 rounded-lg p-4">
          {certs.length ? (
            <ul>
          
              {certs.map((m: UserCertificate, i: number) => (
                <li
                  key={i}
                  className="flex my-2 p-2 w-full justify-between attachment-container"
                >
                  <span className="w-1/2">{m.name}</span>

                  <div className="flex gap-x-4">

                  <Link
                    className="ml-2 p-2 hover:bg-gray-100 rounded-md transition-all"
                    to={`/download/${m.certificateKey}`}
                    reloadDocument
                    download={m.certificateKey}
                  >
                    <Icon name="download" size={"lg"} />
                  </Link>
                  </div>            
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد مقررات  </p>
          )}
        </div>
      
    </div>
    </>)
}

export default Certs