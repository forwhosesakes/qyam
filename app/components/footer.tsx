import FooterPaths from "~/assets/images/footer-paths.svg";
import LogoBW from "~/assets/images/logo-bw.png";
import FooterLogo from "~/assets/images/footer-logo.png";
import glossary from "~/lib/glossary";
import { Icon } from "./icon";
import { NavbarElements } from "~/lib/contstants";
import { NavLink } from "@remix-run/react";


const Footer = () => {
  return (
    <footer className="text-white bg-transparent">
      <img  className={"w-full"} src={FooterPaths} alt="footer" />
      <div className="bg-primary py-12 md:px-24 px-8">
        <div className="flex justify-between">
        <div>
                <img src={LogoBW} alt="logo-bw"/>
                <p className="font-normal md:w-3/5 mt-4">{glossary.footer.description}</p>
         <ul className="mt-4 flex gap-x-4">{NavbarElements.map((el)=><li key={el.id} className="text-white md:text-lg text-xs font-bold"><NavLink to={el.link}>{el.arabicLabel}</NavLink></li>)}</ul>

            </div>
            <img src={FooterLogo} alt="logo" className="md:block hidden"/>
          
        </div>
        <hr className="my-12" />
        <div className="flex items-center gap-x-4">
         <Icon name="youtube" size={"lg"} />
         <Icon name="x-social" size={"lg"} />
         <p className="flex-auto text-left md:text-lg text-xs"> {glossary.footer.copyrights}</p>


        </div>
      </div>
    </footer>
  );
};

export default Footer;
