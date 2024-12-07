import FooterPaths from "~/assets/images/footer-paths.svg";
import LogoBW from "~/assets/images/logo-bw.png";
import FooterLogo from "~/assets/images/footer-logo.png";
import glossary from "~/lib/glossary";
import { Icon } from "./icon";


const Footer = () => {
  return (
    <footer className="text-white bg-transparent">
      <img  className={"w-full"} src={FooterPaths} alt="footer" />
      <div className="bg-primary py-12 md:px-24 px-8">
        <div className="flex justify-between">
        <div>
                <img src={LogoBW} alt="logo-bw"/>
                <p className="font-normal  md:w-3/5 mt-4 md:mt-12">{glossary.footer.description}</p>

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
