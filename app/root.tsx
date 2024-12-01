import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { User } from "better-auth/types";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import "./tailwind.css";
import { getAuth } from "./lib/auth.server";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Toaster } from "sonner";
import { getToast } from "./lib/toast.server";
import { useToast } from "./components/toaster";
import React from "react";

// Custom error classes
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class ToastError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ToastError';
  }
}

// Types
interface LoaderData {
  toast: any; // Replace with your actual toast type
  user: User | null;
  error?: {
    message: string;
    type: string;
  };
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  let user: User | null = null;
  let toast = null;
  let headers = undefined;

  try {
    // Handle authentication
    const session = await getAuth(context).api.getSession({
      headers: request.headers,
    }).catch((error:any) => {
      console.error('Authentication error:', error);
      throw new AuthenticationError('Failed to get user session');
    });

    // Verify user session
    user = session?.user && session.user.emailVerified 
      ? (session.user as User) 
      : null;

    // Handle toast
    const toastResult = await getToast(request).catch((error) => {
      console.error('Toast error:', error);
      throw new ToastError('Failed to get toast notification');
    });

    if (toastResult) {
      toast = toastResult.toast;
      headers = toastResult.headers;
    }

    return json<LoaderData>(
      { 
        toast, 
        user,
        error: undefined 
      }, 
      { 
        headers: headers || undefined,
        status: 200
      }
    );

  } catch (error) {
    console.error('Root loader error:', error);

    if (error instanceof AuthenticationError) {
      return json<LoaderData>(
        {
          toast: null,
          user: null,
          error: {
            type: 'auth',
            message: 'Authentication failed. Please try logging in again.'
          }
        },
        { status: 401 }
      );
    }

    if (error instanceof ToastError) {
      return json<LoaderData>(
        {
          toast: null,
          user,
          error: {
            type: 'toast',
            message: 'Failed to load notifications'
          }
        },
        { status: 200 }
      );
    }

    return json<LoaderData>(
      {
        toast: null,
        user: null,
        error: {
          type: 'unknown',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl" lang="ar">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>قيم</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { direction: "rtl", fontFamily: "PingARLT" },
            duration: 5000,
            classNames: {
              success: "border bg-green-100/90 border-green-500/20 text-black/75 toast-icon-success",
              error: "border bg-red-100/90 border-red-500/20 text-black/75 toast-icon-error",
              info: "border bg-blue-100/90 border-blue-500/20 text-black/75 toast-icon-info",
              warning: "border bg-yellow-100/90 border-yellow-500/20 text-black/75 toast-icon-warning",
            },
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const { toast, error } = useLoaderData<LoaderData>();
  
  useToast(toast);

  // Handle errors
  React.useEffect(() => {
    if (error) {
      switch (error.type) {
        case 'auth':
          // You can add custom error handling here
          console.error('Authentication error:', error.message);
          break;
        case 'toast':
          console.error('Toast error:', error.message);
          break;
        case 'unknown':
          console.error('Unknown error:', error.message);
          break;
      }
    }
  }, [error]);

  const noNavbarRoutes = ["/login"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* {showNavbar && <Navbar />} */}
      <Outlet />
      {showNavbar && <Footer />}
    </>
  );
}