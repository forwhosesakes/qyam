import { Form, Navigate, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { authClient, useSession } from "../../lib/auth.client";
import { cn } from "../../lib/tw-merge";
import { getErrorMessage } from "../../lib/get-error-messege";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const navigate = useNavigate()


  

  //use the session to redirect user of they are unqualified for restting password ( t)


  const resetPassword = async () => {
    const { data, error } = await authClient.resetPassword({
      newPassword: password,
      
    }, {
      onRequest: (ctx:any) => {
        // show loading state
      },
      onSuccess: (ctx:any) => {
        navigate("/")
      },
      onError: (ctx:any) => {
        const msg = getErrorMessage(ctx)
        console.log("msg error in login", ctx);
        

      }
  })}

  return (
    <div>
      <h2>Reset password</h2>
      <Form onSubmit={resetPassword}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
        <button className={cn("button bg-blue-800 text-white p-4", {
        "disabled": confirmedPassword===password,
      })} type="submit">Reset Password</button>
      </Form>

   

    </div>
  )
};

export default ResetPassword
