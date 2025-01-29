import { Form, useActionData, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useEffect, useState } from "react";
import { authClient } from "../../lib/auth.client";
import glossary from "./glossary";
import TitleBlock from "~/components/ui/title-block";
import { createId } from "@paralleldrive/cuid2";
import { toast as showToast } from "sonner";
import { getAuthenticated } from "~/lib/get-authenticated.server";
import LoadingOverlay from "~/components/loading-overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { REGIONS } from "~/lib/constants";
import { QUser } from "~/types/types";
const sanitizeFileName = (name: string) => {
  // Create a blob with the file to generate a safe filename
  return name.replace(/[^\u0600-\u06FF\u0750-\u077F\w.-]/g, '_');
};


export async function loader({ request, context }: LoaderFunctionArgs) {
  const user= await getAuthenticated({request, context});
  if(!user) return null
    else if((user as QUser).acceptenceState==="accepted")
      return redirect("/")
    else 
    return redirect(`/404?status=${(user as QUser).acceptenceState}`)

  
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const intent = formData.get("intent");
    const file = formData.get("file");
    console.log("fiiiiile::::", file)

    if (!file || !(file instanceof File)) {
      console.log("file:::", file);
      
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  // const [password, setPassword] = useState("");
  // const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [region, setRegion] = useState("الرياض");
  const [cv, setCv] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const submit = useSubmit();
  const [loading, setLoading] = useState(false);

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

  const [touched, setTouched] = useState<{
    email?: boolean;
    // password?: boolean;
    // passwordConfirmation?: boolean;
    name?: boolean;
    phone?: boolean;
    cv?: boolean;
    bio?: boolean;
  }>({});

  const validateForm = (touchedFields = touched) => {
    const newErrors: typeof errors = {};
    const g = glossary.signup.validationErrors;

    if (touchedFields.name && !name.trim()) {
      newErrors.name = g.name;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (touchedFields.email) {
      if (!email) {
        newErrors.email = g.email.required;
      } else if (!emailRegex.test(email)) {
        newErrors.email = g.email.invalid;
      }
    }

    // if (touchedFields.password) {
    //   if (!password) {
    //     newErrors.password = g.password.required;
    //   } else if (password.length < 8) {
    //     newErrors.password = g.password.length;
    //   }
    // }

    // if (touchedFields.passwordConfirmation && password !== passwordConfirmation) {
    //   newErrors.passwordConfirmation = g.passwordConfirmation;
    // }

    if (touchedFields.phone) {
      if (!phone || phone == "") {
        newErrors.phone = g.phone.required;
      } 
      // else if (phone.length === 12 && !phone.startsWith("966")) {
      //   newErrors.phone = g.phone.saudi;
      // } else if (phone.length === 10 && !phone.startsWith("05")) {
      //   newErrors.phone = g.phone.notValid;
      // } 
      
      else if (!(phone.length === 10 )) {
        newErrors.phone = g.phone.length_10;
      }
    }

    if (touchedFields.cv) {
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
    }

    if (touchedFields.bio && !bio.trim()) {
      newErrors.bio = g.bio;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm({ ...touched, [field]: true });
  };

  interface ActionData {
    success?: boolean;
    key?: string;
    error?: string;
  }
  useEffect(() => {
    const handleSigneup = async () => {
      if (actionData?.success && actionData?.key) {
        try {
          await authClient.signUp.email(
            {
              email,
              password: createId(),
              name,
              bio,
              cvKey: actionData.key,
              phone: Number(phone),
              region,
              acceptenceState: "pending",
            },
            {
              onRequest: (ctx) => {
                setLoading(true);

                // show loading state
              },
              onSuccess: async (ctx) => {
                setLoading(false);

                showToast.success(glossary.signup.toasts.verifyEmail.title, {
                  description: glossary.signup.toasts.verifyEmail.description,
                });
              },
              onError: (ctx) => {
                setLoading(false);
                

                if (ctx.error.code === "USER_WITH_THIS_EMAIL_ALREADY_EXISTS" || ctx.error.code==="USER_ALREADY_EXISTS") {
                  showToast.error(glossary.signup.toasts.signupError.title, {
                    description: glossary.signup.toasts.signupError.emailExist,
                  });
                }
       
                else {
                  showToast.error(glossary.signup.toasts.signupError.title, {
                    description:
                      glossary.signup.toasts.signupError.generalDescription,
                  });
                }
              },
            }
          );
        } catch (e) {
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

  // Add function to check if all required fields are filled
  const areAllFieldsFilled = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      // password !== '' &&
      // passwordConfirmation !== '' &&
      phone !== undefined &&
      phone !== "" &&
      cv !== null &&
      bio.trim() !== ""
    );
  };

  // Update useEffect for form validation
  useEffect(() => {
    if (Object.values(touched).some(Boolean)) {
      const isValid = validateForm();
      const areFieldsFilled = areAllFieldsFilled();
      setIsFormValid(isValid && areFieldsFilled);
    } else {
      setIsFormValid(false); // Ensure button is disabled initially
    }
  }, [email, name, phone, cv, bio]);

  // Update the signUp function to double-check
  const signUp = async () => {
    // Mark all fields as touched before submission
    const allTouched = {
      email: true,
      // password: true,
      // passwordConfirmation: true,
      name: true,
      phone: true,
      cv: true,
      bio: true,
    };
    setTouched(allTouched);

    if (!validateForm(allTouched) || !areAllFieldsFilled()) return;

    if (cv) {
      const formData = new FormData();
      formData.set("intent", "upload");
      console.log("before form set, file::", cv);
      
      formData.append("file", cv, cv.name);
      submit(formData, { method: "post" });
    }
  };

  return (
    <div className="min-h-screen  bg-section w-full pt-[96px] pb-8">
      {loading && <LoadingOverlay message="جاري الإرسال..." />}

      <div className="flex sm:flex-row flex-col items-start min-h-fit h-full w-full">
        <div className=" w-[80%] sm:w-5/12  h-full flex flex-col justify-start items-center sm:items-end   ml-5 sm:ml-0">
          <Form
            method="post"
            encType="multipart/form-data"
            className="w-8/12 flex flex-col sm:items-start items-center gap-3"
          >
            <TitleBlock
              className="mt-10 mb-5"
              text={glossary.signup.newSignup.title}
            />
            <div className=" md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.fullName}
              </p>
              <input
                className={`text-xs lg:text-base md:text-sm p-1 ${
                  errors.name && touched.name ? "border-red-600" : ""
                } bg-white text-black border rounded w-full`}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) {
                    validateForm({ ...touched, name: true });
                  }
                }}
                onBlur={() => handleBlur("name")}
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
                  errors.phone && touched.phone ? "border-red-600" : ""
                } lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="number"
                value={phone}
                onChange={(e) => {
                  const phoneNubmer: string = e.target.value;
                  setPhone(phoneNubmer);
                }}
                onBlur={() => handleBlur("phone")}
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
                  errors.email && touched.email ? "border-red-600" : ""
                } md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) {
                    validateForm({ ...touched, email: true });
                  }
                }}
                onBlur={() => handleBlur("email")}
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <span className="text-red-600 text-xs">{errors.email}</span>
              )}
            </div>

            {/* <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.password}
              </p>
              <input
                className={`text-xs lg:text-base  ${
                  errors.password && touched.password ? "border-red-600" : ""
                } md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    validateForm({ ...touched, password: true });
                  }
                }}
                onBlur={() => handleBlur("password")}
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
                  errors.passwordConfirmation && touched.passwordConfirmation ? "border-red-600" : ""
                } md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="password"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  if (touched.passwordConfirmation) {
                    validateForm({ ...touched, passwordConfirmation: true });
                  }
                }}
                onBlur={() => handleBlur("passwordConfirmation")}
                placeholder={"9661122334455"}
              />
              {errors.passwordConfirmation && (
                <span className="text-red-600 text-xs">
                  {errors.passwordConfirmation}
                </span>
              )}
            </div> */}
            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.region}
              </p>

              <DropdownMenu >
                <DropdownMenuTrigger className="w-full bg-white justify-between">
               <span>
               {region}

               </span>
                    {/* <Icon name={"below-arrow"} size="md"/> */}
                    
            
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-64 overflow-scroll border-6">
                  <DropdownMenuRadioGroup
                    value={region}
                    onValueChange={setRegion}
                  >
                    {REGIONS.map((reg) => (
                      <DropdownMenuRadioItem className={`${region===reg?"bg-gray-50":""}`} value={reg}>
                        {reg}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="md:w-2/3 sm:w-[80%] min-w-24 w-full">
              <p className="text-xs lg:text-base md:text-sm my-1 text-primary">
                {glossary.signup.newSignup.cv}
              </p>
              <input
                className={`text-xs ${
                  errors.cv && touched.cv ? "border-red-600" : ""
                } lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full`}
                type="file"
                name="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  
                  if (file) {
                    console.log("file::", file);
                    
                    // const sanitizedName = sanitizeFileName(file.name);
                  // Read the original file's content
const fileBuffer = await file.arrayBuffer();

// Create a new File with the correct data
const newFile = new File([fileBuffer], "new_file", {
  type: file.type,
  lastModified: file.lastModified,
});
                    console.log("new file::", newFile);
                    if (!file || !(file instanceof File)) {
                      console.log("not valid vile:::", file);
                      
                     
                    }
                    
                    
                    setCv(newFile);
                  }
                }}
                onBlur={() => handleBlur("cv")}
                // accept=".pdf,.doc,.docx"
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
                  errors.bio && touched.bio ? "border-red-600" : ""
                } lg:text-base md:text-sm p-1 bg-white text-black border rounded w-full`}
                value={bio}
                placeholder={
                  glossary.signup.newSignup.selfIntrodutionPlaceholder
                }
                onChange={(e) => {
                  setBio(e.target.value);
                  if (touched.bio) {
                    validateForm({ ...touched, bio: true });
                  }
                }}
                onBlur={() => handleBlur("bio")}
              />
              {errors.bio && (
                <span className="text-red-600 text-xs">{errors.bio}</span>
              )}
            </div>

            <button
              className={`button min-w-24 text-xs lg:text-base md:text-sm text-center  hover:opacity-90 ${
                isFormValid
                  ? "bg-primary hover:opacity-90"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-opacity text-white rounded-lg mt-6  w-2/3 p-3 z-10`}
              type="submit"
              disabled={!isFormValid}
              onClick={signUp}
            >
              {glossary.signup.newSignup.confirmationButton}
            </button>
          </Form>
        </div>
        <div className="flex  flex-col  justify-start  mt-24  sm:mt-0 sm:mb-0 mb-10  items-center sm:items-start sm:w-7/12 w-[80%] h-full">
          <div className=" flex flex-col justify-start sm:items-start items-center  sm:w-2/3 w-[80%]">
            <TitleBlock
              className="my-10"
              text={glossary.signup.registrationTerms.title}
            />
            <div className="mt-2">
              <p className="text-xs lg:text-base md:text-sm">
                1. {glossary.signup.registrationTerms.first}
              </p>
              <p className="text-xs lg:text-base md:text-sm">
                2. {glossary.signup.registrationTerms.second}
              </p>
            </div>
          </div>

          <div className="  flex flex-col justify-start sm:items-start items-center sm:w-2/3 w-[80%] ">
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
              <p className="text-xs lg:text-base md:text-sm">
                6. {glossary.signup.admissionCriteria.sixth}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
