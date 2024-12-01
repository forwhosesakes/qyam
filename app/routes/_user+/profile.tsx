import React from "react";
import { NavLink, Outlet, useRouteLoaderData } from "@remix-run/react";

const Profile = () => {
  const { user } = useRouteLoaderData<any>("root");

  const categories = [
    { id: "all", label: "الكل" },
    { id: "courses", label: "المناهج" },
    { id: "programs", label: "البرامج" },
    { id: "certs", label: "شهاداتي" },
    { id: "articles", label: "المقالات" },
  ];

  return (
    <section className="pt-24 px-48 flex justify-between gap-x-12 bg-section ">
      <div>
        <ul>
          {categories.map((category) => (
            <li className="aria-[current=page]:bg-primary my-4 font-bold rounded-lg p-4 w-52 aria-[current=page]:text-white text-center border border-[#3479B7]">
              <NavLink prefetch="viewport" to={category.id}>{category.label}</NavLink>
            </li>
          ))}
        </ul>
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

          <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
            <span className="text-secondary"> ساعات التدريب :</span>

            {user.trainingHours}
          </p>

          <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
            <span className="text-secondary"> عدد المتدربين :</span>

            {user.noStudents}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 my-6">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Profile;
