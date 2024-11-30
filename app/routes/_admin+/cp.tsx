import glossary from "~/lib/glossary";
import { NavLink, Outlet } from "@remix-run/react";
import React from "react";

const ControlPanel = () => {
  const tabs = [
    {
      name: glossary.cp.registered,
      link: "users",
    },
    {
      name: glossary.cp.material,
      link: "material",
    },

    {
      name: glossary.cp.messages,
      link: "messages",
    },
  ];

  return (
    <section className="pt-48 bg-section min-h-screen">
      <div className="flex justify-between w-4/5 mx-auto mb-12 ">
        <h3>{glossary.cp.control_panel}</h3>

        <h6>{glossary.cp.admin}</h6>
      </div>

      <div className="bg-white border border-[#D0D5DD] rounded-xl px-5 py-12 w-4/5 mx-auto">
        <ul className="flex gap-x-4">
          {tabs.map((tab) => (
            <li key={tab.link}>
              <NavLink
                className="p-3 hover:bg-gray-200/50  aria-[current=page]:hover:opacity-90 transition-all  border border-[#D0D5DD] aria-[current=page]:text-white rounded-lg aria-[current=page]:bg-primary"
                to={tab.link}
              >
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <hr className="mx-auto w-4/5 my-12" />

        <Outlet />
      </div>
    </section>
  );
};

export default ControlPanel;
