import glossary from "../glossary";
import Parents from "~/assets/images/parents.png";
import Supervisor from "~/assets/images/supervisor.png";
import TitleBlock from "../../../components/ui/title-block";
import ColoredDrop from "~/components/ui/colored-drop";
const TargetedUsers = () => {
  const users = [
    { name: "parents", img: Parents },
    { name: "youth_supervisors", img: Supervisor },
    { name: "programs_supervisors", img: Supervisor },
  ];

  return (
    <section id="targeted-users" className="md:px-24 px-6 w-full  min-h-[60vh]">
      <TitleBlock className="my-8" text={glossary.targeted_users.title} />
      <div className="flex flex-wrap md:h-48 md:gap-24 gap-6 justify-center ">
        {users.map((user) => (
        <div key={user.name} className="relative flex flex-col md:justify-center md:gap-y-4 items-center w-64 mx-4 min-h-[200px]">

        <ColoredDrop 
          size="sm" 
          color="#8BC53F" 
          className="absolute md:-left-8 bottom-2 left-0 z-10"
        />
      
        <svg
          className="absolute origin-top scale-[0.75] md:scale-100 top-0"
          xmlns="http://www.w3.org/2000/svg"
          width="248"
          height="229"
          viewBox="0 0 248 229"
          fill="none"
        >
          <path
            d="M72.6917 221.045L72.6912 221.045C68.38 218.622 63.9385 215.558 59.3299 211.792L59.3286 211.791C55.9093 209.017 52.3918 205.844 48.7762 202.279L48.7761 202.279L0.680643 154.882L59.3956 85.3157L59.3957 85.3156L69.6967 73.1034L69.6968 73.1033L105.05 31.2115L105.051 31.2106C130.036 1.46035 160.25 -4.38947 186.208 3.9775C199.269 8.19546 211.358 15.9831 221.261 26.1596C231.186 36.3656 238.88 48.9227 243.114 62.6397L243.114 62.6398C252.138 91.8401 245.384 126.604 210.961 155.363L211.282 155.747L210.961 155.363L170.089 189.516C146.035 209.6 126.223 224.113 107.368 227.674C96.2445 229.773 84.994 227.981 72.6917 221.045Z"
            stroke="#0D3151"
          />
        </svg>
  
 
        <img 
          className="w-fit ml-12 mb- mt-8 md:mt-0 relative z-20" 
          src={user.img} 
          alt={user.name}
        />
  
        {/* User Description */}
        <p className="mx-auto w-3/5 text-center relative z-20">
          {glossary.targeted_users[user.name as keyof typeof glossary.targeted_users]}
        </p>
      </div>
        ))}
      </div>
    </section>
  );
};

export default TargetedUsers;
