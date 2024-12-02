

import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { getAuthenticated, } from "~/lib/get-authenticated.server";
export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await getAuthenticated({request,context})
  if (user && (user as QUser).role==="user") return null
  return redirect("/")
}