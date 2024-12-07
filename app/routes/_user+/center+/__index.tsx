import { redirect, json } from "@remix-run/react";
import { getAuthenticated } from "~/lib/get-authenticated.server";

interface LoaderContext {
  request: Request;
  context: unknown;
}

export async function loader({ request, context }: LoaderContext) {
  // Before hook - authentication check
  const user = await getAuthenticated({ request, context });
  
  if (!user) {
    return json(
      { message: "Unauthorized - Please login to access this resource" },
      { status: 401 }
    );
  }

  // Additional before hook conditions
  if (!user.isEmailVerified) {
    return json(
      { message: "Please verify your email before accessing this resource" },
      { status: 401 }
    );
  }

  // Main loader logic
  return redirect("courses");
}


