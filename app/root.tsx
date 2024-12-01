import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { User } from "better-auth/types";
import { getAuth } from "./lib/auth.server";
import { getToast } from "./lib/toast.server";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useToast } from "./components/toaster";
import React from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

interface LoaderData {
  toast: any;
  user: User | null;
  error?: {
    message: string;
    type: string;
  };
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    // Get auth session
    const session = await getAuth(context).api.getSession({
      headers: request.headers,
    });

    // Verify user
    const user = session?.user && session.user.emailVerified 
      ? (session.user as User) 
      : null;

    // Get toast data directly without accessing headers
    const toastData = await getToast(request);
    
    // Create a new response with combined data
    return json<LoaderData>(
      {
        toast: toastData?.toast || null,
        user,
        error: undefined
      },
      {
        headers: new Headers({
          ...(toastData?.headers ? Object.fromEntries(toastData.headers.entries()) : {}),
        })
      }
    );

  } catch (error) {
    console.error('Root loader error:', error);

    // Return error response
    return json<LoaderData>(
      {
        toast: null,
        user: null,
        error: {
          type: 'unknown',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}

// Rest of your component code remains the same...
export default function App() {
  const { toast, user, error } = useLoaderData<LoaderData>();
  const location = useLocation();
  
  useToast(toast);

  // Handle errors silently or show them in UI as needed
  React.useEffect(() => {
    if (error) {
      console.error('Application error:', error);
    }
  }, [error]);

  const noNavbarRoutes = ["/login"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Outlet />
      {showNavbar && <Footer />}
    </>
  );
}