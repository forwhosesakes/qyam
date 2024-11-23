import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { User } from "better-auth/types";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./tailwind.css";
import { getAuth } from "./lib/auth.server";
import Navbar from "./components/navbar";

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
  // check if the user is logged in
  const session = await getAuth(context).api.getSession({
    headers: request.headers, // you need to pass the headers object.
  });
  return session?.user && session.user.emailVerified
    ? (session.user as User)
    : null;
}
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl" lang="ar">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const user = useLoaderData();

  return (
    <>
      <Navbar user={user as User} />
      <Outlet />
    </>
  );
}
