import FooterPaths from "~/assets/images/footer-paths.svg";
import LogoBW from "~/assets/images/logo-bw.png";
import FooterLogo from "~/assets/images/footer-logo.png";
import glossary from "~/lib/glossary";
import { Icon } from "./icon";
import { useEffect } from "react";
import QRCode from "qrcode"
import toSJIS from "qrcode/helper/to-sjis"

const Footer = ({phoneNumber,text}:{phoneNumber:number,text:string}) => {
  


// const canvasRef = useRef<HTMLCanvasElement>(null)

useEffect(()=>{
  QRCode.toCanvas(document.getElementById("qrcode"), `https://wa.me/${phoneNumber}?text=${text}`, {toSJISFunc:toSJIS},(error)=>{
    if(error)console.error(error);
    else console.log("success");
  })

  console.log("happened qrcode");
  
})
  
  return (
    <footer className="relative mt-12 text-white bg-transparent">
      <img className={"absolute -top-6 md:-top-28 bg-gray-50 z-10 w-full"} src={FooterPaths} alt="footer" />
      <div className="bg-primary relative z-50 py-12 md:px-24 px-8">
        <div className="flex justify-between">
          <div>
            <img src={LogoBW} alt="logo-bw" />
            <p className="font-normal  md:w-3/5 mt-4 md:mt-12">
              {glossary.footer.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 justify-center items-center ">
            <p className="text-white">تواصل معنا على</p>
            <p>٠٥١٢٣٤٦٧٨٩</p>
            {/* <img className=" w-32 h-32" src={} alt="" /> */}
            <canvas id="qrcode"></canvas>
          </div>
          <img src={FooterLogo} alt="logo" className="md:block hidden" />
        </div>
        <hr className="my-12" />
        <div className="flex items-center gap-x-4">
          <Icon name="youtube" size={"lg"} />
          <Icon name="x-social" size={"lg"} />
          <p className="flex-auto text-left md:text-lg text-xs">
            {" "}
            {glossary.footer.copyrights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
