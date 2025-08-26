import FooterPaths from "~/assets/images/drops-group.png";
import LogoBW from "~/assets/images/logo-bw.png";
import FooterLogo from "~/assets/images/footer-logo.png";
import glossary from "~/lib/glossary";
import { Icon } from "./icon";
import { NavbarElements } from "~/lib/contstants";
import { NavLink } from "@remix-run/react";

  const DisplayedNavList = () => (
    <ul className="flex flex-col-reverse md:flex-row  items-end gap-x-8 gap-y-8 ">
      {NavbarElements.filter((element) =>
   element.requiredRole==="all"
      ).map((element) => (
        <li
          key={element.id}
          className="flex cursor-pointer font-bold"
        >
          <NavLink
            prefetch="intent"
            to={element.link}
          >
            <span>{element.arabicLabel}</span>
            {element.children && element.children.length && (
              <Icon name="below-arrow" size="sm" />
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  ); 


const Footer = ({phoneNumber,text}:{phoneNumber:number,text:string}) => {



// const canvasRef = useRef<HTMLCanvasElement>(null)

// useEffect(()=>{
//   QRCode.toCanvas(document.getElementById("qrcode"), `https://wa.me/${phoneNumber}?text=${text}`, {toSJISFunc:toSJIS},(error)=>{
//     if(error)console.error(error);
//     else console.log("success");
//   })

//   // console.log("happened qrcode");
  
// })
  
  return (
    <footer className="relative mt-32 text-white bg-transparent">
      <img className={"absolute -top-6 md:-top-28  z-10 w-full"} src={FooterPaths} alt="footer" />
      <div className="bg-primary relative z-50 py-12 md:px-24 px-8 ">
        <div className="flex justify-between ">
          <div>
            <img src={LogoBW} alt="logo-bw" />
            <p className="font-normal lg:text-xl text-base  md:w-4/5 mt-4 md:mt-12">
              {glossary.footer.description}
            </p>
          </div>
     
          <img src={FooterLogo}  alt="logo" className="md:block hidden h-[200px] w-[200px] object-contain flex-shrink-0 mr-2" />
        </div>
             <div className="flex  gap-3 items-center  md:w-1/3 lg:w-auto">
            {/* <p className="text-white">تواصل معنا على</p> */}
            {/* <img className=" w-32 h-32" src={} alt="" /> */}
            {/* <canvas className="ml-2" id="qrcode"></canvas> */}


<DisplayedNavList/>
            
          </div>
        <hr className="my-12" />
        <div className="flex items-center gap-x-4">
                <p className="flex-left text-left md:text-lg text-xs">
            {" "}
            {glossary.footer.copyrights}
          </p> 
          <div className="  mr-auto">

            <span>
              <div className="flex gap-4">
                
          
                  <a href="https://www.snapchat.com/add/m.alftayat"  rel='noopener noreferrer' target="_blank" > <Icon  name="snapchat"  size={"lg"} /></a>
                <a href="https://x.com/m_alftayat" rel='noopener noreferrer' target="_blank">
                        <Icon   name="twitter-x"  size={"lg"} />
                </a>

                   <a href="https://www.instagram.com/m.alftayat/" rel='noopener noreferrer' target="_blank">
                        <Icon   name="instagram"  size={"lg"} />
                </a>

  
                </div>

            </span>
            <p className="my-1 text-[#8AC53E]">0539486006</p>
        

          </div>

 
    
        </div>
      </div>
    </footer>
  );
};

export default Footer;
