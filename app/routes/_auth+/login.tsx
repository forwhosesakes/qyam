import { Form, Link, redirect, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { authClient } from "../../lib/auth.client";
import { getErrorMessage } from "../../lib/get-error-messege";
import LoginShapeImg from "~/assets/images/login-drop-group.png";
import Logo from "~/assets/images/logo.svg";
import GradientEllipse from "~/components/ui/gradient-ellipse";

import glossary from "./glossary";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const raiseToast= useToast()

  const signIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (ctx: any) => {
          // show loading state
        },
        onSuccess: (ctx: any) => {
          navigate("/");
        },
        onError: (ctx: any) => {
          const msg = getErrorMessage(ctx);
          console.log("msg error in login", ctx);
        },
      }
    );
  };

  return (
    <div className="lg:flex lg:flex-row  justify-between items-center w-full h-screen overflow-hidden ">
      <div className="blur-[180px] inset-0 absolute">
        <div className="relative h-full w-full overflow-hidden">
          <GradientEllipse
            bgColor={"bg-[rgb(139,197,63)]/50"}
            className={" -top-24 lg:right-16 right-0"}
          />

          <GradientEllipse
            bgColor={"bg-[#B8ECFF]"}
            className={"lg:left-96 -left-16 top-44"}
          />
          <GradientEllipse
            bgColor={"bg-[rgb(3,102,157)]/50"}
            className={"lg:top-96 lg:right-0"}
          />
        </div>
      </div>
      <div className="h-full w-full flex flex-col  justify-center items-center z-10 overflow-y-hidden">
        <img
          className="lg:my-16 my-8 z-10 lg:w-[186px] lg:h-[155px]  w-[144px] h-[120px] brd"
          src={Logo}
          alt=""
        />
        <h2 className="my-5 z-10">{glossary.login.title}</h2>

        <Form
          onSubmit={signIn}
          className="my-5 flex flex-col gap-2 w-full items-center justify-center z-10"
        >
          <div className="md:w-1/3  w-3/5">
            <p className="text-xs lg:text-base md:text-sm my-1 text-primary z-10">
              {glossary.login.email}
            </p>
            <input
              className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full z-10"
              type="email"
              value={email}
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="md:w-1/3 w-3/5">
            <p className="text-xs lg:text-base md:text-sm my-1 text-primary z-10">
              {glossary.login.password}
            </p>
            <input
              className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full z-10"
              type="password"
              value={password}
              placeholder="1127651158"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:w-1/3 w-3/5 z-10">
            <button
              type="submit"
              className="button text-xs lg:text-lg md:text-sm text-center bg-primary hover:opacity-90 transition-opacity text-white rounded-lg mt-6  w-full p-3 z-10"
            >
              {glossary.login.login}
            </button>
            <Link
              className="text-black text-xs lg:text-lg md:text-sm underline my-1 z-10"
              to={"/forgot-password"}
            >
              {glossary.login.forgot_password}
            </Link>
          </div>
        </Form>
      </div>

      <div className="hidden lg:flex justify-center items-end h-full bg-primary w-2/3 z-10">
        <div className="mb-16 mx-2">
          <img src={LoginShapeImg} alt="" />
        </div>
      </div>
    </div>
  );
}
