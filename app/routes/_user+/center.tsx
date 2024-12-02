import { NavLink, Outlet } from "@remix-run/react";


const Center = () => {

  const categories = [
    // { id: "all", label: "الكل" },
    { id: "courses", label: "المناهج" },
    { id: "programs", label: "البرامج" },
    { id: "articles", label: "المقالات" },
  ];

  return (
    <section className="pt-24 px-48 flex justify-between gap-x-12 bg-section min-h-screen ">
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
      <div className="bg-white w-full border border-gray-100 rounded-lg  m-5 p-5">
      <Outlet/>
      </div>

     
    </section>
  );
};

export default Center;
