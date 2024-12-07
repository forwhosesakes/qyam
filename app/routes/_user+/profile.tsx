import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { getAuthenticated } from "~/lib/get-authenticated.server";
import userDB from "~/db/user/user.server";
import { UserCertificate } from "~/types/types";
import { Link, useLoaderData } from "@remix-run/react";
import { Icon } from "~/components/icon";
import ProfileImage from "~/assets/images/profile.png";

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    const user = await getAuthenticated({ request, context });
    if (user) {
      return userDB
        .getUserWithCertificates(user.id, context.cloudflare.env.DATABASE_URL)
        .then((res: any) => {
          return Response.json({ success: true, user: res.data });
        })
        .catch((error) => {
          return error;
        });
    } else return redirect("/");
  } catch (error) {
    console.error("Loader error:", error);
    return Response.json({ success: false, error });
  }
}
const Profile = () => {
  const { user } = useLoaderData<any>();

  return (
    <section className="pt-24 px-48  bg-section ">
      <div className="my-6 flex w-full justify-between">
        <div className="">
        <h3>بياناتي</h3>
        <div className="flex gap-x-2 my-4">
          <Link to={"/"}>الرئيسية</Link>
          <span>{">"}</span>
          <span className="font-bold">{"حسابي"}</span>
        </div>
        </div>
     

        <div className="flex gap-x-3 items-center">
          <p className="flex flex-col text-sm gap-y-1 text-[#475467]">
            <span className="font-bold ">{user.name}</span>
            <span>متدرب</span>
          </p>

          <img
            className={"w-16 h-16 border-2 border-[#D0D5DD]  rounded-full"}
            src={ProfileImage}
            alt="profile"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[#D0D5DD]">
        <div className="bg-gray-50 rounded-xl p-8">
          <h4 className="mb-8  text-primary font-bold">بيانـــاتي</h4>

          <div className="flex flex-wrap  gap-x-6 gap-y-4 [&>p]:text-sm mb-12 ">
            <p className="text-[#475467] font-bold border border-[#D0D5DD] rounded-lg p-2 min-w-72 text-right">
              <Icon name="person-gray" size="md" />
              <span className="mr-2">الاسم :</span>
              {user.name}
            </p>
            <p className="text-[#475467] font-bold  border border-[#D0D5DD] rounded-lg p-2  min-w-72 text-right">
              <Icon name="email" size="md" />

              <span className="mr-2"> الإيميل :</span>

              {user.email}
            </p>
            <p className="text-[#475467] font-bold  border border-[#D0D5DD] rounded-lg p-2  min-w-72 text-right">
              <Icon name="email" size="md" />

              <span className="mr-2"> رقم المتدرب :</span>

              {user.id}
            </p>

            <p className="text-[#475467] font-bold border border-[#D0D5DD] rounded-lg p-2 min-w-72 text-right">
              <Icon name="mobile" size="md" />
              <span className="mr-2"> الجوال :</span>
              {user.phone}
            </p>

            <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 min-w-72 text-right">
              <span className="mr-2 font-bold"> المستوى :</span>
              غير محدد
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 my-6">
          <h4 className="mb-8 text-primary font-bold">إحصائيات المدرب</h4>
          <ul className="flex justify-around w-full">
            <li className="flex flex-col">
              <Icon name="clock" size="xl4" />
              <p className="text-[#475467]  rounded-lg p-2 w-72 text-center">
                ساعات التدريب :{user.trainingHours ?? "0"}
              </p>
            </li>
            <li className="flex flex-col">
              <Icon name="student" size="xl4" />
              <p className="text-[#475467]  rounded-lg p-2 w-72 text-center">
                عدد المتدربين :{user.noStudents ?? "0"}
              </p>
            </li>

            <li className="flex flex-col">
              <Icon name="course" size="xl4" />
              <p className="text-[#475467] rounded-lg p-2 w-72 text-center">
                المقرر : 0
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 my-6">
          <>
            <h4 className="font-bold text-primary my-4">شهاداتي</h4>
            <div className="bg-gray-50 rounded-xl p-8 my-6">
              <div className="border border-gray-100 rounded-lg p-4">
                {user.UserCertificate.length ? (
                  <ul>
                    {user.UserCertificate.map(
                      (m: UserCertificate, i: number) => (
                        <li
                          key={i}
                          className="flex my-2 p-2 w-full justify-between attachment-container"
                        >
                          <span className="w-1/2">{m.name}</span>

                          <div className="flex gap-x-4">
                            <Link
                              className="ml-2 p-2 hover:bg-gray-100 rounded-md transition-all"
                              to={`/download/${m.certificateKey}`}
                              reloadDocument
                              download={m.certificateKey}
                            >
                              <Icon name="download" size={"lg"} />
                            </Link>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>لا توجد شهادات </p>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
    </section>
  );
};

export default Profile;
