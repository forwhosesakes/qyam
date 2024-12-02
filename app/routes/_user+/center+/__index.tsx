
import {redirect} from "@remix-run/react";
import { getAuthenticated } from "~/lib/get-authenticated.server";

export async function loader({request, context}) {
    const user = await getAuthenticated({request, context})
    return user?redirect("courses"):redirect("/")
  }


