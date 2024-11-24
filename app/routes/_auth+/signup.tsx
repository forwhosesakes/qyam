import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import { authClient } from "../../lib/auth.client";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx) => {
          // show loading state
        },
        onSuccess: (ctx) => {
          sendVerificationEmail();
        },
        onError: (ctx) => {
          console.log("error: ", ctx);

          // alert(ctx.error)
        },
      }
    );
  };

  const sendVerificationEmail = () => {
    authClient.sendVerificationEmail(
      {
        email,
        callbackURL: "/", // The redirect URL after verification
      },
      {
        onError: (ctx) => {},
        onSuccess: (ctx) => {
          console.log("success in email sending");
        },
      }
    );
  };

  return (
    <div className="mt-48">
      <h2>Sign Up</h2>
      <Form onSubmit={signUp}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </Form>
      <p className="text-white">
        {" "}
        already have an account? <Link to={"/login"}>Login </Link>
      </p>
    </div>
  );
}
