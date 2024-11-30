import glossary from "../../lib/glossary";
import TitleBlock from "~/components/ui/title-block";
import QyamSign from "~/assets/images/qyam-sign.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { getAuthenticated } from "~/lib/get-authenticated.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import userDB from "~/db/user/user.server";
import { sendEmail } from "~/lib/send-email.server";
import { createToastHeaders } from "~/lib/toast.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await getAuthenticated({ request, context });
  return Response.json(user);
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  return userDB
    .registerUserIntoProgram(
      formData.get("id") as string,
      context.cloudflare.env.DATABASE_URL
    )
    .then(() => {
      sendEmail(
        {
          to: context.cloudflare.env.ADMIN_EMAIL,
          subject: "طلب التسجيل في برنامج قيم",
          text: `المستخدم: ${formData.get(
            "name"
          )} قام بإنشاء طلب انضمام لبرنامج قيم. يمكنك قبول أو رفض الطلب عبر المنصة.`,
        },
        context.cloudflare.env.RESEND_API,
        context.cloudflare.env.MAIN_EMAIL
      );
    })
    .then(async () => {
      return Response.json(
        { success: true },
        {
          headers: await createToastHeaders({
             description: "",
            title: `تم إرسال طلب الانضمام لبرنامج قيم`,
            type: "success",
          }),
        }
      );
    })
    .catch(async () => {
      return Response.json(
        { success: false },
        {
          headers: await createToastHeaders({
             description: "",
            title: `فشلت عملية إرسال طلب الانضمام لبرنامج قيم`,
            type: "error",
          }),
        }
      );
    });
}
const Levels = () => {
  const user = useLoaderData<any>();

  const isJoinEnabled = user ?user?.role === "user" && (user?.acceptenceState === "rejected"|| user?.acceptenceState === "idle"):false;
  const fetcher = useFetcher();

  const joinTheProgram = () => {
    fetcher.submit({ id: user.id, name: user.name }, { method: "POST" });
  };

  const levels = [
    {
      title: "المستوى الأول : شهادة مهندس القيم الممارس",
      img: null,
      method: [
        "مقدمة تأصيلية في القيم",
        "استراتيجيات بناء القيم",
        "تصميم المبادرات والبرامج القيمية",
        "مشروع المستوى الأول",
      ],
    },
    {
      title: "المستوى الثاني : شهادة أخصائي القيم",
      img: null,
      method: [
        "تصميم الأنشطة القيمية",
        "التسويق القيمي",
        "مشروع المستوى الثاني",
      ],
    },
    {
      title: "المستوى الثالث : شهادة خبير القيم",
      img: QyamSign,
      method: [
        "المدرب المعتمد في التدريب على القيم",
        "الكوتشينج في القيم",
        "بناء المؤشرات وأدوات القياس ",
        "مشروع المستوى الثالث",
      ],
    },
  ];
  return (
    <section id="levels" className="bg-section md:pt-48 pt-24 ">
      <div className="w-4/5  mx-auto">
        <div className="flex justify-between">
          <TitleBlock text={glossary.levels.title} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={joinTheProgram}
                  disabled={!isJoinEnabled}
                  className=" bg-primary hover:bg-primary/90 transition-all md:p-3 p-2 md:text-lg text-xs font-bold text-white rounded-lg disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {glossary.levels.button_user[user?user.acceptenceState as keyof typeof glossary.levels.button_user:"idle"]}

                </button>
              </TooltipTrigger>
              {!user && (
                <TooltipContent>
                  <p className="text-xs">
                    يجب عليك التسجيل أولًا لتتمكن من الانضمام إلى البرنامج
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className="mt-12 w-11/12 mx-auto">{glossary.levels.description}</p>
        <div className="mt-12 ">
          {levels.map((level: any, ind: number) => (
            <div key={ind} className="flex flex-col gap-y-4">
              <h6 className="bg-primary p-4 rounded-lg text-white">
                {level.title}
              </h6>
              <div className="rounded-2xl bg-white mb-12 p-5 flex  justify-between ">
                <div>
                  <h6 className="font-bold leading-loose">المنهاج :</h6>

                  <ul className="list-disc pr-4">
                    {level.method.map((item: any, i: number) => (
                      <li key={i} className="md:text-lg text-sm font-medium">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {level.img && (
                  <img
                    className="md:h-auto md:w-auto h-24 w-24"
                    src={level.img}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Levels;
