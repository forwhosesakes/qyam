import { User } from "better-auth/types";
import { Icon } from "./icon";
import { NavLink, useNavigate } from "@remix-run/react";
import Logo from "~/assets/images/logo.svg";
import {  useReducer } from "react";
import { cn } from "~/lib/tw-merge";
import { NavbarElements } from "~/lib/contstants";
import { Link } from "@remix-run/react";
import { authClient } from "~/lib/auth.client";
import { toast as showToast } from "sonner";
import { canViewElement } from "~/lib/check-permission";




type TProps = {
  // navElements: NavElement[],
  user: User | null;
};



const Navbar = (props: TProps) => {
console.log("hi",props);

  
  const navigate = useNavigate();

  const [isMenuOpen, toggleMenu] = useReducer((st) => !st, false);

  const expandElement = () => {};
  const scrollToSection = () => {};

  const handleLogout = async() => {
    try{
     const result = await authClient.signOut()
     if(result.data?.success)navigate("/")
     console.log(result);
     
    }catch(e){
      console.error(e)
      showToast.error("حدث خطأ أثناء تسجيل الخروج");
      

    }
  }

  const AuthActions = () =>
    props.user ? (
      <div className="h-full bg-white  ">
        <button
        onClick={handleLogout}
         className="button  font-bold text-center text-sm md:text-lg p-3 rounded-lg text-gray-700 hover:bg-black/5 transition-all">
          تسجيل الخروج
        </button>
      </div>
    ) : (
      <div className="visitors flex flex-auto  justify-end  gap-x-4">
        <button
          onClick={() => navigate("/signup")}
          className="button font-bold text-xs  md:text-sm text-center p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
        >
          {" "}
          تسجيل جديد
        </button>
        <button
          onClick={() => navigate("/login")}
          className="button font-bold text-xs  md:text-sm text-center p-3 rounded-lg text-gray-700 hover:bg-black/5 transition-all"
        >
          دخول
        </button>
      </div>
    );
  const DisplayedNavList = () => (
    <ul className="flex flex-col-reverse md:flex-row  items-end gap-x-8 gap-y-8 ">
      {
        NavbarElements
        .filter(element => canViewElement(element,props?.user?.role ?? null))
        .map(element=>(
          <li key={element.id} className="flex cursor-pointer font-bold text-gray-700">
            <NavLink to={element.link}>
              <span>{element.arabicLabel}</span>
              {element.children && element.children.length && (
                <Icon name="below-arrow" size="sm" />
              )}
            </NavLink>
          </li>
        ))
      }
    </ul>
  );

  return (
    <nav className="z-50 fixed w-full h-12 md:h-24  bg-white/95 mx-auto md:justify-center justify-normal flex items-center py-5 md:px-32  px-3 gap-x-8">
     <Link to="/">
     <img
        className={"h-8 w-8 md:h-auto md:w-auto  ml-auto md:ml-0"}
        src={Logo}
        alt="logo"
      />
     </Link>
     

      <div
        className={cn(
          " md:bg-transparent bg-white/95 md:h-auto h-[60vh] md:w-fit w-2/3 md:rounded-none md:p-0 p-5 rounded-r-lg text-right md:static absolute top-12 left-0",
          isMenuOpen ? "block" : "hidden",
          "md:block"
        )}
      >
        <DisplayedNavList />
      </div>
      <AuthActions />

      <div className="md:hidden ">
        <Icon
          onClick={toggleMenu}
          name={`${isMenuOpen ? "close" : "menu"}`}
          size="xl3"
          className=" p-2 hover:bg-black/5 transition-all  "
        />
      </div>
    </nav>
  );
};

export default Navbar;
