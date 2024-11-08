import { Form, useNavigate } from "@remix-run/react"
import React, { useState } from "react"
import { authClient } from "../../lib/auth.client"
import { getErrorMessage } from "../../lib/get-error-messege"

const ForgotPassword = ()=>{
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const resetPassword = async ()=>{
        const { data, error } = await authClient.forgetPassword({
            email,
            redirectTo: "/reset-password",
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
          

    })
}

    return (<div>
        <h2>
          Sign In
        </h2>
        <Form onSubmit={resetPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
         
          <button
            type="submit"
            className="px-5 py-2 button"
          >
            Reset Password
          </button>
        </Form>
  
  
      </div>
    )



}

export default ForgotPassword