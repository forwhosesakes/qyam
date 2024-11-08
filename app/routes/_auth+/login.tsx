import { Form, Link, redirect } from "@remix-run/react"
import { useState } from "react"
import {authClient} from '../../lib/auth.client'
import {getErrorMessage } from "../../lib/get-error-messege"
import React from "react"
 
export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // const raiseToast= useToast()
 
  const signIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (ctx:any) => {
          // show loading state
        },
        onSuccess: (ctx:any) => {
          redirect("/")
        },
        onError: (ctx:any) => {
          const msg = getErrorMessage(ctx)
          console.log("msg error in login", ctx);
          

        },
      },
    )
  }
 
  return (<div>
      <h2>
        Sign In
      </h2>
      <Form onSubmit={signIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
        >
          Sign In
        </button>
      </Form>


      <p className="text-white"> dont have an account? <Link to={"/signup"}>signup </Link></p>


      <p className="text-white"> Forgot your password? <Link to={"/forgot-password"}>Reset password </Link></p>
    </div>
  )
}