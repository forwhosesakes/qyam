import React from "react";
import { NavLink, Outlet, useRouteLoaderData } from "@remix-run/react";
import { Icon } from "~/components/icon";

const Profile = () => {
  const { user } = useRouteLoaderData<any>("root");

  const categories = [
    // { id: "all", label: "الكل" },
    { id: "courses", label: "المناهج" },
    { id: "programs", label: "البرامج" },
    { id: "certs", label: "شهاداتي" },
    { id: "articles", label: "المقالات" },
  ];

  return (
    <section className="pt-24 px-48 flex justify-between gap-x-12 bg-section ">
      <div>
        <div className="flex flex-col">
          {categories.map((category) => (
            <NavLink
              className={
                "hover:bg-primary/10 w-52 my-4 transition-all font-bold rounded-lg  text-center border border-[#3479B7] aria-[current=page]:bg-primary aria-[current=page]:text-white p-4"
              }
              prefetch="viewport"
              to={category.id}
            >
              <span className={"h-full w-full border-red-500"}>
                {category.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[#D0D5DD]">
        <div className="bg-gray-50 rounded-xl p-8">
          <h4 className="mb-8 font-bold">بيانـــاتي</h4>

          <div className="flex flex-wrap justify-between mx-auto gap-x-12 gap-y-4 [&>p]:text-sm mb-12 ">
            <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
              <span className="text-secondary">الاسم :</span>

              {user.name}
            </p>
            <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
              <span className="text-secondary"> الإيميل :</span>

              {user.email}
            </p>

            <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
              <span className="text-secondary"> الجوال :</span>

              {user.phone}
            </p>

            <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
              <span className="text-secondary"> المستوى :</span>
              غير محدد
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 my-6">
          <h4 className="mb-8 font-bold">إحصائيات المدرب</h4>
          <ul className="flex justify-around w-full">
            <li className="flex flex-col">
              <Icon name="clock" size="xl4" />
              <p className="text-[#475467]  rounded-lg p-2 w-72 text-center">
            ساعات التدريب :

                {user.trainingHours ??"0"}
              </p>
            </li>
            <li className="flex flex-col">
              <Icon name="student" size="xl4" />
              <p className="text-[#475467]  rounded-lg p-2 w-72 text-center">
             عدد المتدربين :
                {user.noStudents ?? "0"}
              </p>
            </li>


            <li className="flex flex-col">
              <Icon name="course" size="xl4" />
              <p className="text-[#475467] rounded-lg p-2 w-72 text-center">
                المقرر :
                0
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 my-6">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Profile;
