import { Form, Link, useActionData, useSubmit } from "@remix-run/react"
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useEffect, useState } from "react";
import { authClient } from "../../lib/auth.client";
import glossary from "./glossary";
import TitleBlock from "~/components/ui/title-block";
import { createId } from "@paralleldrive/cuid2";


// export async function loader({ context }: LoaderFunctionArgs) {
//   try {
//     const objects: R2Objects = await context.cloudflare.env.QYAM_BUCKET.list();

//     return {
//       files: objects.objects.map((obj) => ({
//         key: obj.key,
//         size: obj.size,
//         uploaded: obj.uploaded,
//         httpMetadata: obj.httpMetadata,
//       })),
//     };
//   } catch (error) {
//     console.error("Loader error:", error);
//     return { error: "Failed to load files", files: [] };
//   }
// }

export async function action({ request, context }: ActionFunctionArgs) {
 
  
  const formData = await request.formData();
  try{
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { error: "Please select a valid file", status: 400 };
  }
  const key = `${Date.now()}-${createId()}.${file.name.split(".")[1]}`;
  const buffer = await file.arrayBuffer();


  const uploadResult = await context.cloudflare.env.QYAM_BUCKET.put(
    key,
    buffer,
    {
      httpMetadata: {
        contentType: file.type,
      },
    }
  );
  const checkUpload = await context.cloudflare.env.QYAM_BUCKET.head(key);
  return {
    success: true,
    key,
    details: {
      uploadResult,
      verification: checkUpload,
    },
 
  };
  
  
  
}catch(error){
  console.error(error)

  return{
    error:"failed to upload",
    details: error instanceof Error ? error.message : String(error),
    status: 500,
  }

}
  

 

}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [acceptenceState, setAcceptenceState] = useState("accepted");
  const submit = useSubmit();
  const actionData = useActionData<ActionData>();
  const [phone, setPhone] = useState<number>();

  interface ActionData {
    success?: boolean;
    key?: string;
    error?: string;
  }
useEffect(()=>{
  const handleSigneup = async () => {
    console.log("action data : ", actionData);
    
    if(actionData?.success && actionData?.key){
      console.log("Attempting signup with data:", {
        email,
        password,
        name,
        bio,
        cvKey: actionData.key,
        phone,
        acceptenceState,
      });
      try{
        
        
      await authClient.signUp.email(
        {
          email,
          password,
          name,
          bio,
          cvKey:actionData.key,
          phone,
          acceptenceState,
        },
        {
          onRequest: (ctx) => {
            console.log("onRequest: ", ctx);
  
            // show loading state
          },
          onSuccess: (ctx) => {
            console.log("onSuccess: ", ctx);
  
            sendVerificationEmail();
          },
          onError: (ctx) => {
            console.log("onError details: ", {
              error: ctx.error,
              status: ctx.status,
              message: ctx.message,
              data: ctx.data
            });
  
          },
        }
      );
    }catch(e){
      console.error("signup error: ",e)

    }
    }
  }
  handleSigneup()
},[actionData])


  const signUp = async () => {
    
    if(cv){
      console.log(cv);
      const formData = new FormData();
    formData.set("intent", "upload");
    formData.set("file", cv);
    submit(formData, { method: "post" });

      
   
    }
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
    <div className="h-screen w-full pt-[96px]">
      <div className="flex sm:flex-row flex-col items-center h-full w-full">
        <div className=" sm:w-5/12 w-[80%] h-full flex flex-col justify-start sm:items-end  items-center ml-5 sm:ml-0">
          <Form
          method="post"
          encType="multipart/form-data"
            className="w-8/12 flex flex-col sm:items-start items-center gap-3"
          >
            <TitleBlock
              className="my-5"
              text={glossary.signup.newSignup.title}
            />
            <div className=" md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.fullName}
              </p>
              <input
                className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={glossary.signup.newSignup.fullNamePlaceholder}
              />
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.phoneNumber}
              </p>
              <input
                className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full"
                type="number"
                value={phone}
                onChange={(e) => {
                  const phoneNubmer:number = Number(e.target.value)
                  console.log("phone number : ", phoneNubmer);
                  
                  setPhone(phoneNubmer)
                }}
                // TODO: change setName to setNumber
                placeholder={"9661122334455"}
              />
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.email}
              </p>
              <input
                className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.password}
              </p>
              <input
                className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // TODO: change setName to setNumber
                placeholder={"9661122334455"}
              />
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.confirmPassword}
              </p>
              <input
                className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                // TODO: change setName to setNumber
                placeholder={"9661122334455"}
              />
            </div>

            {/* <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            /> */}

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.cv}
              </p>
              <input
                className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full"
                type="file"
                name="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCv(file);
                  }
                }}
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.selfIntroduction}
              </p>
              <textarea
                className="text-xs lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full"
                value={bio} //TODO: change to slef introduction
                placeholder={
                  glossary.signup.newSignup.selfIntrodutionPlaceholder
                }
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <button
              className="button min-w-24 text-xs lg:text-base md:text-sm text-center bg-primary hover:opacity-90 transition-opacity text-white rounded-lg mt-6  w-2/3 p-3 z-10"
              type="submit"
              onClick={signUp}
            >
              {glossary.signup.newSignup.confirmationButton}
            </button>
          </Form>
        </div>
        <div className=" flex flex-col justify-start  sm:items-start items-center sm:w-7/12 w-[80%] h-full">
          <div className="flex flex-col justify-start sm:items-start items-center  sm:w-1/2 w-[80%]">
            <TitleBlock
              className="mb-10 mt-5"
              text={glossary.signup.registrationTerms.title}
            />
            <div>
              <p className="text-xs lg:text-base md:text-sm">
                1. {glossary.signup.registrationTerms.first}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                2. {glossary.signup.registrationTerms.second}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                3. {glossary.signup.registrationTerms.third}
              </p>
              <p className="mb-3 text-xs lg:text-base md:text-sm">
                4. {glossary.signup.registrationTerms.forth}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                {glossary.signup.registrationTerms.notice}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                {glossary.signup.registrationTerms.noticeText}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-start sm:items-start items-center sm:w-2/3 w-[80%] ">
            <TitleBlock
              className="my-12"
              text={glossary.signup.admissionCriteria.title}
            />
            <div>
              <p className="text-xs lg:text-base md:text-sm">
                {glossary.signup.admissionCriteria.description}
              </p>
              <p className="text-xs lg:text-base md:text-sm mt-2">
                1. {glossary.signup.admissionCriteria.first}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                2. {glossary.signup.admissionCriteria.second}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                3. {glossary.signup.admissionCriteria.third}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                4. {glossary.signup.admissionCriteria.forth}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                5. {glossary.signup.admissionCriteria.fifth}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


