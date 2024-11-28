import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
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
import { toast as showToast } from "sonner";
import { useToast } from "~/components/toaster";
import { getToast } from "~/lib/toast.server";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";


export async function loader({ request }: LoaderFunctionArgs) {
  const { toast } = await getToast(request);
  return { toast };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const intent = formData.get("intent");
    if (intent && intent === "verify") {
      try {
        const email = formData.get("email");
        
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${context.cloudflare.env.RESEND_API}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'no-reply@qyam.org', // or your verified domain
            to: email,
            subject: 'Verify your email',
            html: `<p>Please click the link below to verify your email:</p>
                  <a href="${new URL('/', request.url).toString()}">Verify Email</a>`
          })
        });
        const result = await response.json();
        if (!response.ok) {
          console.error('Email sending failed:', result);
          return {
            error: "verification_failed",
            message: result.message || "Failed to send verification email",
          }
        }
        return {success:true}
      } catch (e) {
        console.log(e);
        
        return {
          error: "Failed to send verification email",
          detail: e instanceof Error ? e.message : String(e),
        };
      }
    }
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
  } catch (error) {
    console.error(error);

    return {
      error: "failed to upload",
      details: error instanceof Error ? error.message : String(error),
      status: 500,
    };
  }
}

export default function Signup() {
  const { toast } = useLoaderData<typeof loader>();
  useToast(toast);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [acceptenceState, setAcceptenceState] = useState("accepted");
  const submit = useSubmit();
  const actionData = useActionData<ActionData>();
  const [phone, setPhone] = useState<string>();

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    name?: string;
    phone?: string;
    cv?: string;
    bio?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const g = glossary.signup.validationErrors;

    if (!name.trim()) {
      newErrors.name = g.name;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = g.email.required;
    } else if (!emailRegex.test(email)) {
      newErrors.email = g.email.invalid;
    }

    if (!password) {
      newErrors.password = g.password.required;
    } else if (password.length < 8) {
      newErrors.password = g.password.length;
    }

    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = g.passwordConfirmation;
    }

    if (!phone || phone == "") {
      newErrors.phone = g.phone.required;
    } else if (phone.length === 12 && !phone.startsWith("966")) {
      newErrors.phone = g.phone.saudi;
    } else if (phone.length === 10 && !phone.startsWith("05")) {
      newErrors.phone = g.phone.notValid;
    } else if (!(phone.length === 10 || phone.length === 12)) {
      newErrors.phone = g.phone.length;
    }

    if (!cv) {
      newErrors.cv = g.cv.required;
    } else {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(cv.type)) {
        newErrors.cv = g.cv.type;
      } else if (cv.size > 5 * 1024 * 1024) {
        newErrors.cv = g.cv.size;
      }
    }

    if (!bio.trim()) {
      newErrors.bio = g.bio;
    }

    setErrors(newErrors);
    console.log(newErrors, Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  };

  interface ActionData {
    success?: boolean;
    key?: string;
    error?: string;
  }
  useEffect(() => {
    const handleSigneup = async () => {
      console.log("action data : ", actionData);

      if (actionData?.success && actionData?.key) {
        try {
          await authClient.signUp.email(
            {
              email,
              password,
              name,
              bio,
              cvKey: actionData.key,
              phone: Number(phone),
              acceptenceState,
            },
            {
              onRequest: (ctx) => {
                console.log("onRequest: ", ctx);

                // show loading state
              },
              onSuccess: async (ctx) => {
                console.log("onSuccess: ", ctx);

                showToast.success(glossary.signup.toasts.verifyEmail.title, {
                  description: glossary.signup.toasts.verifyEmail.description,
                });

                await sendVerificationEmail();
              },
              onError: (ctx) => {
                console.log("onError details: ", {
                  error: ctx.error,
                  status: ctx.status,
                  message: ctx.message,
                  data: ctx.data,
                });

                if (ctx.error.code === "USER_WITH_THIS_EMAIL_ALREADY_EXISTS") {
                  showToast.error(glossary.signup.toasts.signupError.title, {
                    description: glossary.signup.toasts.signupError.emailExist,
                  });
                } else {
                  showToast.error(glossary.signup.toasts.signupError.title, {
                    description:
                      glossary.signup.toasts.signupError.generalDescription,
                  });
                }
              },
            }
          );
        } catch (e) {
          console.error("signup error: ", e);

          showToast.error(glossary.signup.toasts.signupError.title, {
            description: e instanceof Error ? e.message : String(e),
          });
        }
      } else if (actionData?.error) {
        showToast.error(glossary.signup.toasts.signupError.title, {
          description: actionData.error,
        });
      }
    };
    handleSigneup();
  }, [actionData]);

  const signUp = async () => {
    if (!validateForm()) return;
    if (cv) {
      const formData = new FormData();
      formData.set("intent", "upload");
      formData.set("file", cv);
      submit(formData, { method: "post" });
    }
  };

  const sendVerificationEmail = async () => {
    const formData = new FormData();
    formData.set("intent", "verify");
    formData.set("email", email);
    try {
      submit(formData, { method: "post" });
      
      

      // await authClient.sendVerificationEmail(
      //   {
      //     email,
      //     callbackURL: "/", // The redirect URL after verification
      //   },
      //   {
      //     onError: (ctx) => {
      //       console.error("Failed to send verification email:", ctx);
      //       showToast.error(glossary.signup.toasts.verifyEmail.error, {
      //         description: glossary.signup.toasts.verifyEmail.errorDescription,
      //       });
      //     },
      //     onSuccess: (ctx) => {
      //       console.log("Verification email sent successfully");
      //     },
      //   }
      // );
    } catch (error) {
      console.error("Verification email error:", error);
      showToast.error(glossary.signup.toasts.verifyEmail.error, {
        description: glossary.signup.toasts.verifyEmail.errorDescription,
      });
    }
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
                className={`text-xs lg:text-base md:text-sm p-1 ${
                  errors.name ? "border-red-600" : ""
                }  bg-white text-black border rounded w-full`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={glossary.signup.newSignup.fullNamePlaceholder}
              />
              {errors.name && (
                <span className="text-red-600 text-xs">{errors.name}</span>
              )}
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.phoneNumber}
              </p>
              <input
                className={`text-xs ${
                  errors.phone ? "border-red-600" : ""
                } lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="number"
                value={phone}
                onChange={(e) => {
                  const phoneNubmer: string = e.target.value;
                  console.log("phone number : ", phoneNubmer);

                  setPhone(phoneNubmer);
                }}
                // TODO: change setName to setNumber
                placeholder={"رقم الجوال"}
              />
              {errors.phone && (
                <span className="text-red-600 text-xs">{errors.phone}</span>
              )}
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.email}
              </p>
              <input
                className={`text-xs lg:text-base ${
                  errors.email ? "border-red-600" : ""
                } md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <span className="text-red-600 text-xs">{errors.email}</span>
              )}
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.password}
              </p>
              <input
                className={`text-xs lg:text-base  ${
                  errors.password ? "border-red-600" : ""
                } md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // TODO: change setName to setNumber
                placeholder={"9661122334455"}
              />
              {errors.password && (
                <span className="text-red-600 text-xs">{errors.password}</span>
              )}
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.confirmPassword}
              </p>
              <input
                className={`text-xs lg:text-base ${
                  errors.passwordConfirmation ? "border-red-600" : ""
                } md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                // TODO: change setName to setNumber
                placeholder={"9661122334455"}
              />
              {errors.passwordConfirmation && (
                <span className="text-red-600 text-xs">
                  {errors.passwordConfirmation}
                </span>
              )}
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
                className={`text-xs ${
                  errors.cv ? "border-red-600" : ""
                } lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="file"
                name="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log(file);

                    setCv(file);
                  }
                }}
                accept=".pdf,.doc,.docx"
              />
              {errors.cv && (
                <span className="text-red-600 text-xs">{errors.cv}</span>
              )}
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.selfIntroduction}
              </p>
              <textarea
                className={`text-xs ${
                  errors.bio ? "border-red-600" : ""
                } lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full`}
                value={bio} //TODO: change to slef introduction
                placeholder={
                  glossary.signup.newSignup.selfIntrodutionPlaceholder
                }
                onChange={(e) => setBio(e.target.value)}
              />
              {errors.bio && (
                <span className="text-red-600 text-xs">{errors.bio}</span>
              )}
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
