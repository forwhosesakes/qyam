import { User } from "better-auth/types";
import { Icon } from "./icon";
import { useNavigate } from "@remix-run/react";
import Logo from "~/assets/images/logo.svg";
import { useReducer } from "react";
import { cn } from "~/lib/tw-merge";

type NavElement = {
  id: string;
  arabicLabel: string;
  visibility: boolean;
  onClick?: () => void;
  children?: NavElement[];
};

type TProps = {
  // navElements: NavElement[],
  user: User | null;
};

const navElements: NavElement[] = [
  { id: "about", arabicLabel: "حول البرنامج", visibility: true, onClick() {} },
  {
    id: "registeration",
    arabicLabel: "شروط التسجيل",
    visibility: true,
    onClick() {},
  },
  {
    id: "levels",
    arabicLabel: "مستويات البرنامج",
    visibility: true,
    onClick() {},
  },
  {
    id: "certificates",
    arabicLabel: "شهادات البرنامج",
    visibility: true,
    onClick() {},
  },
  {
    id: "knowledge-center",
    arabicLabel: "مركز المعرفة",
    visibility: true,
    onClick() {},
  },
  {
    id: "contact-us",
    arabicLabel: "تواصل معنا",
    visibility: true,
    onClick() {},
  },
];

const Navbar = (props: TProps) => {
  const navigate = useNavigate();

  const [isMenuOpen, toggleMenu] = useReducer((st) => !st, false);

  const expandElement = () => {};
  const scrollToSection = () => {};

  const AuthActions = () =>
    props.user ? (
      <div className="h-full bg-white md:order-first order-2 ">
        <button className="button text-center text-sm md:text-lg p-3 rounded-lg text-gray-700 hover:bg-black/5 transition-all">
          تسجيل الخروج
        </button>
      </div>
    ) : (
      <div className="visitors flex gap-x-4">
        <button
          onClick={() => navigate("/login")}
          className="button text-xs lg:text-lg md:text-sm text-center p-3 rounded-lg text-gray-700 hover:bg-black/5 transition-all"
        >
          دخول
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="button text-xs lg:text-lg md:text-sm text-center p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
        >
          {" "}
          تسجيل جديد
        </button>
      </div>
    );

  const DisplayedNavList = () => (
    <ul className="flex flex-col-reverse md:flex-row md:justify-normal justify-end items-end gap-x-4 gap-y-8 ">
      {navElements.map((el) => (
        <li key={el.id} className="flex cursor-pointer font-bold text-gray-700">
          <span>{el.arabicLabel}</span>
          {el.children && el.children.length && (
            <Icon name="below-arrow" size="sm" />
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="z-50 absolute w-full h-12 md:h-24 bg-white/60 mx-auto md:justify-center justify-normal flex items-center py-5 px-3 gap-x-8">
      <div className="md:hidden">
        <Icon
          onClick={toggleMenu}
          name={`${isMenuOpen ? "close" : "menu"}`}
          size="xl3"
          className=" p-2 hover:bg-black/5 transition-all"
        />
      </div>
      <AuthActions />

      <div
        className={cn(
          " md:bg-transparent bg-white/95 md:h-auto h-[60vh] md:w-fit w-2/3 md:rounded-none md:p-0 p-5 rounded-r-lg text-right md:static absolute top-12 left-0",
          isMenuOpen ? "block" : "hidden",
          "md:block"
        )}
      >
        <DisplayedNavList />
      </div>

      <img
        className={"h-8 w-8 md:h-auto md:w-auto ml-auto md:ml-0"}
        src={Logo}
        alt="logo"
      />
    </nav>
  );
};

export default Navbar;
